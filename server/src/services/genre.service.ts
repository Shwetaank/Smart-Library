import { inject, singleton } from 'tsyringe';
import { GenreRepository } from '../repositories/genre.repository.js';
import { AuditService } from './audit.service.js';

@singleton()
export class GenreService {
  constructor(
    @inject(GenreRepository) private readonly genreRepository: GenreRepository,
    @inject(AuditService) private readonly auditService: AuditService,
  ) {}

  async createGenre(input: Record<string, unknown>, actorId?: string) {
    const genre = await this.genreRepository.create({ name: String(input.name).trim() });
    await this.auditService.log('GENRE_CREATED', 'Genre', JSON.stringify({ genreId: genre.id }), actorId);
    return genre;
  }

  async listGenres(query: Record<string, unknown>) {
    return this.genreRepository.findMany(query);
  }

  async getGenre(id: string) {
    return this.genreRepository.findById(id);
  }

  async updateGenre(id: string, input: Record<string, unknown>, actorId?: string) {
    const genre = await this.genreRepository.update(id, { name: String(input.name).trim() });
    await this.auditService.log('GENRE_UPDATED', 'Genre', JSON.stringify({ genreId: id }), actorId);
    return genre;
  }

  async deleteGenre(id: string, actorId?: string) {
    const genre = await this.genreRepository.softDelete(id);
    await this.auditService.log('GENRE_DELETED', 'Genre', JSON.stringify({ genreId: id }), actorId);
    return genre;
  }
}
