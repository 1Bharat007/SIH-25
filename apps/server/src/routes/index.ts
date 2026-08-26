import { Router } from 'express';
import { healthRoutes } from './health.routes.js';
import { placesRoutes } from './places.routes.js';
import { mapRoutes } from './map.routes.js';

const router = Router();

// Mount all API routes
router.use('/health', healthRoutes);
router.use('/places', placesRoutes);
router.use('/map', mapRoutes);

export const apiRoutes = router;
