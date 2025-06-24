import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('username email friends blocked');
  res.json(users);
};

export const getAllAuditLogs = async (req, res) => {
  const logs = await AuditLog.find().populate('user targetUser', 'username').sort({ timestamp: -1 });
  res.json(logs);
};
