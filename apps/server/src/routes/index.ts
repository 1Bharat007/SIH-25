import { Router } from 'express';
import { healthRoutes } from './health.routes.js';
import { placesRoutes } from './places.routes.js';
import { mapRoutes } from './map.routes.js';
import { safetyRoutes } from './safety.routes.js';
import { alertsRoutes } from './alerts.routes.js';
import { cultureRoutes } from './culture.routes.js';
import { chatRoutes } from './chat.routes.js';

const router = Router();

// Mount all API routes
router.use('/health', healthRoutes);
router.use('/places', placesRoutes);
router.use('/map', mapRoutes);
router.use('/safety', safetyRoutes);
router.use('/alerts', alertsRoutes);
router.use('/culture', cultureRoutes);
router.use('/chat', chatRoutes);

export const apiRoutes = router;


