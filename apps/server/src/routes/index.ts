import { Router } from 'express';
import { healthRoutes } from './health.routes.js';
import { placesRoutes } from './places.routes.js';
import { mapRoutes } from './map.routes.js';
import { safetyRoutes } from './safety.routes.js';
import { alertsRoutes } from './alerts.routes.js';

const router = Router();

// Mount all API routes
router.use('/health', healthRoutes);
router.use('/places', placesRoutes);
router.use('/map', mapRoutes);
router.use('/safety', safetyRoutes);
router.use('/alerts', alertsRoutes);

export const apiRoutes = router;
