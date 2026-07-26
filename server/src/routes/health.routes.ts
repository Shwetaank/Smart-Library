import { Router } from 'express';
import { buildResponse } from '../utils/response.js';

const router = Router();

router.get('/', (_req: any, res: any) => {
  res.status(200).json(buildResponse('Service healthy', { status: 'ok' }));
});

export default router;
