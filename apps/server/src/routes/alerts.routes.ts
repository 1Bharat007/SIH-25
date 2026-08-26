import { Router } from 'express';
import {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
  getSafeRouteDetours,
  getDetourById,
  getEvacuationGuidelines,
  getSafeShelters,
  checkProximity,
  streamAlerts,
} from '../controllers/alerts.controller.js';

const router = Router();

// Static and specialized query endpoints first
router.get('/stream', streamAlerts);
router.get('/proximity', checkProximity);
router.get('/detours', getSafeRouteDetours);
router.get('/detours/:id', getDetourById);
router.get('/guidelines', getEvacuationGuidelines);
router.get('/shelters', getSafeShelters);

// Standard Alert CRUD endpoints
router.get('/', getAlerts);
router.get('/:id', getAlertById);
router.post('/', createAlert);
router.patch('/:id', updateAlert);
router.delete('/:id', deleteAlert);

export const alertsRoutes = router;
