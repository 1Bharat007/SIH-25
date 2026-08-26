import { Router } from 'express';
import { getPlaces, getPlaceBySlug } from '../controllers/places.controller.js';

const router = Router();

// GET /api/v1/places
router.get('/', getPlaces);

// GET /api/v1/places/:slug
router.get('/:slug', getPlaceBySlug);

export const placesRoutes = router;
