import { Router } from 'express';
import {
  postChatMessage,
  getOfflineKnowledgeBase,
} from '../controllers/chat.controller.js';

const router = Router();

router.post('/message', postChatMessage);
router.get('/offline-kb', getOfflineKnowledgeBase);

export const chatRoutes = router;
