import express from 'express';
import mongoose from "mongoose";
import {
  sendRequest,
  respondRequest,
  cancelRequest,
  listFriends,
  pendingRequests,
  getMutualFriends,
  removeFriend
} from '../controllers/friendController.js';
import { protect } from '../middleware/authMiddleware.js';
import { friendRequestLimiter } from '../middleware/rateLimitMiddleware.js';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
const router = express.Router();
router.post('/send', protect, friendRequestLimiter,sendRequest);
router.post('/respond', protect, respondRequest);
router.post('/cancel', protect, cancelRequest);
router.get('/list', protect, listFriends);
router.get('/pending', protect, pendingRequests);
router.get('/mutual/:userId', protect, getMutualFriends);
router.post('/remove', protect,removeFriend);

export default router;
