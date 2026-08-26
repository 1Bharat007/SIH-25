import { Router } from 'express';
import { healthRoutes } from './health.routes.js';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);

export const apiRoutes = router;
