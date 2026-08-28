import { Router } from 'express';
import {
  getMonasteries,
  getMonasteryBySlug,
  getPanoramaScenes,
  getPanoramaById,
  getTraditionalAttire,
  getFestivals,
  getGarments,
  getGarmentById,
} from '../controllers/culture.controller.js';

const router = Router();

router.get('/monasteries', getMonasteries);
router.get('/monasteries/:slug', getMonasteryBySlug);
router.get('/panoramas', getPanoramaScenes);
router.get('/panoramas/:id', getPanoramaById);
router.get('/attire', getTraditionalAttire);
router.get('/festivals', getFestivals);
router.get('/garments', getGarments);
router.get('/garments/:id', getGarmentById);

export const cultureRoutes = router;

