import { Router } from 'express';
import { getHealthStatus } from '../controllers/health.controller.js';

const router = Router();

// GET /api/v1/health
router.get('/', getHealthStatus);

export const healthRoutes = router;
