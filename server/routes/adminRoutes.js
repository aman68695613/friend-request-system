import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllUsers, getAllAuditLogs } from '../controllers/adminController.js';

const router = express.Router();

// optionally add admin-only middleware
router.get('/users', protect, getAllUsers);
router.get('/logs', protect, getAllAuditLogs);

export default router;
