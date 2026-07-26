import { singleton, inject } from 'tsyringe';
import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import * as appInsights from 'applicationinsights';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

@singleton()
export class UploadService {
  private readonly containerName: string;

  constructor(@inject('BlobServiceClient') private readonly blobServiceClient: BlobServiceClient) {
    this.containerName = env.azureBlobContainer;
  }

  async uploadCover(file: Express.Multer.File): Promise<string> {
    const extension = file.originalname.split('.').pop() ?? 'jpg';
    const blobName = `${uuidv4()}.${extension}`;

    return this.uploadToBlob(blobName, file.mimetype, file.buffer);
  }

  async uploadCoverFromUrl(url: string): Promise<string> {
    appInsights.defaultClient.trackTrace({
      message: `Starting upload from URL: ${url}`,
    });

    let response: Response;
    try {
      appInsights.defaultClient.trackTrace({
        message: 'Fetching image from URL...',
      });
      response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        },
      });
      appInsights.defaultClient.trackTrace({
        message: `Fetch response status: ${response.status}`,
        properties: { headers: Object.fromEntries(response.headers.entries()) },
      });
    } catch (error) {
      appInsights.defaultClient.trackException({
        exception: error instanceof Error ? error : new Error(String(error)),
        properties: { location: 'uploadCoverFromUrl.fetch' },
      });
      throw new AppError('Invalid URL provided.', 400);
    }

    if (!response.ok) {
      appInsights.defaultClient.trackTrace({
        message: `Failed to download image. Status: ${response.status}`,
      });
      throw new AppError(
        `Failed to download image from the provided URL. Status: ${response.status}`,
        400,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    appInsights.defaultClient.trackTrace({
      message: `Image downloaded into buffer. Size: ${buffer.length} bytes.`,
    });

    const contentType = response.headers.get('content-type') ?? 'image/jpeg';
    const extension = this.getExtensionFromContentType(contentType);
    const blobName = `${uuidv4()}.${extension}`;

    appInsights.defaultClient.trackTrace({
      message: `Uploading to blob storage with name: ${blobName}`,
    });
    const result = await this.uploadToBlob(blobName, contentType, buffer);
    appInsights.defaultClient.trackTrace({
      message: 'Upload to blob storage complete.',
    });
    return result;
  }

  private getExtensionFromContentType(contentType: string): string {
    return contentType.split('/')[1] ?? 'jpg';
  }

  private async uploadToBlob(
    blobName: string,
    contentType: string,
    buffer: Buffer,
  ): Promise<string> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      await containerClient.createIfNotExists();

      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: contentType },
      });

      const permissions = BlobSASPermissions.parse('r');
      return blockBlobClient.generateSasUrl({
        permissions,
        expiresOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    } catch (error) {
      const isDevelopmentStorage = env.azureBlobConnectionString === 'UseDevelopmentStorage=true';
      if (env.nodeEnv === 'production' || (!isDevelopmentStorage && !env.allowLocalCoverFallback)) {
        if (
          typeof error === 'object' &&
          error &&
          'code' in error &&
          error.code === 'AuthenticationFailed'
        ) {
          throw new AppError(
            'Azure Blob authentication failed. Update AZURE_BLOB_CONNECTION_STRING with the full access-key connection string from the Storage Account access keys page.',
            500,
          );
        }

        throw error;
      }

      appInsights.defaultClient.trackTrace({
        message: 'Azure Blob Storage upload failed. Falling back to local storage.',
        properties: { error },
      });

      const uploadDir = path.join(process.cwd(), 'uploads', 'covers');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, blobName), buffer);
      return `/covers/${blobName}`;
    }
  }

  async getSasUrl(blobName: string): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const url = await blockBlobClient.generateSasUrl({
      permissions: BlobSASPermissions.parse('r') as never,
      expiresOn: new Date(Date.now() + 60 * 60 * 1000),
    });
    return url;
  }

  async deleteCover(blobUrl?: string | null): Promise<void> {
    if (!blobUrl) return;

    const parsedUrl = new URL(blobUrl, 'http://localhost');
    const pathname = parsedUrl.pathname;
    const blobName = pathname.split('/').pop();
    if (!blobName) return;

    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    await containerClient.deleteBlob(blobName);
  }
}
