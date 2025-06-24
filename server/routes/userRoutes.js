import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { blockUser, unblockUser, getAuditLogs, searchUser, getAllUsers } from '../controllers/userController.js';
import User from '../models/User.js';
const router = express.Router();

router.post('/block/:id', protect, blockUser);
router.post('/unblock/:id', protect, unblockUser);
router.get('/audit-log', protect, getAuditLogs);
router.get('/search/:username', protect, searchUser);
router.get('/all', protect, getAllUsers);
export default router;
