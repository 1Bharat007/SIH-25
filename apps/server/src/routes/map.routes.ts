import { Router } from 'express';
import { getMapLayers } from '../controllers/map.controller.js';

const router = Router();

// GET /api/v1/map/layers
router.get('/layers', getMapLayers);

export const mapRoutes = router;
