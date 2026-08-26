import { Router } from 'express';
import {
  dispatchSOS,
  lookupNearestEmergency,
  startLiveLocation,
  getLiveLocation,
  updateLiveLocation,
  getSafetyRoutes,
} from '../controllers/safety.controller.js';

const router = Router();

// POST /api/v1/safety/sos
router.post('/sos', dispatchSOS);

// GET /api/v1/safety/nearest
router.get('/nearest', lookupNearestEmergency);

// POST /api/v1/safety/live-location/start
router.post('/live-location/start', startLiveLocation);

// GET /api/v1/safety/live-location/:token
router.get('/live-location/:token', getLiveLocation);

// POST /api/v1/safety/live-location/:token/update
router.post('/live-location/:token/update', updateLiveLocation);

// GET /api/v1/safety/routes
router.get('/routes', getSafetyRoutes);

export const safetyRoutes = router;
