import { Router } from 'express';
import {
  getMonasteries,
  getMonasteryBySlug,
  getPanoramaScenes,
  getPanoramaById,
  getTraditionalAttire,
  getFestivals,
} from '../controllers/culture.controller.js';

const router = Router();

router.get('/monasteries', getMonasteries);
router.get('/monasteries/:slug', getMonasteryBySlug);
router.get('/panoramas', getPanoramaScenes);
router.get('/panoramas/:id', getPanoramaById);
router.get('/attire', getTraditionalAttire);
router.get('/festivals', getFestivals);

export const cultureRoutes = router;
