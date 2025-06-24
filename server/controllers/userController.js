import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

const logAction = async (user, action, targetUser) => {
  await AuditLog.create({ user, action, targetUser });
};

export const blockUser = async (req, res) => {
  const blockerId = req.user._id;
  const blockedId = req.params.id;

  if (blockerId.toString() === blockedId) return res.status(400).json({ message: "Can't block yourself" });

  const blocker = await User.findById(blockerId);
  const blockedUser = await User.findById(blockedId);
  if (!blockedUser) return res.status(404).json({ message: "User not found" });

  if (blocker.blocked.includes(blockedId)) return res.status(400).json({ message: "Already blocked" });

  blocker.blocked.push(blockedId);

  // Also remove from friends if they are friends
  blocker.friends = blocker.friends.filter(fid => fid.toString() !== blockedId);
  blockedUser.friends = blockedUser.friends.filter(fid => fid.toString() !== blockerId);

  await blocker.save();
  await blockedUser.save();

  await logAction(blockerId, "blocked user", blockedId);

  res.json({ message: "User blocked" });
};

export const unblockUser = async (req, res) => {
  const blockerId = req.user._id;
  const blockedId = req.params.id;

  const blocker = await User.findById(blockerId);
  if (!blocker.blocked.includes(blockedId)) return res.status(400).json({ message: "User not blocked" });

  blocker.blocked = blocker.blocked.filter(uid => uid.toString() !== blockedId);
  await blocker.save();

  await logAction(blockerId, "unblocked user", blockedId);

  res.json({ message: "User unblocked" });
};

export const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find({ user: req.user._id })
    .populate('targetUser', 'username')
    .sort({ timestamp: -1 });

  res.json(logs);
};

export const searchUser = async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
}
export const getAllUsers = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('username email');
  res.json(users);
}