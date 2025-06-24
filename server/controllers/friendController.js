import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { notifyUser } from '../server.js';
import mongoose from "mongoose";
const logAction = async (user, action, targetUser) => {
  await AuditLog.create({ user, action, targetUser });
};

export const sendRequest = async (req, res) => {
  const from = req.user._id;
  const { to } = req.body;

  if (from.toString() === to)
    return res.status(400).json({ error: "You can't friend yourself" });

  const fromUser = await User.findById(from);
  const toUser = await User.findById(to);

  if (!toUser) return res.status(404).json({ error: 'Recipient not found' });

  if (toUser.blocked.includes(from) || fromUser.blocked.includes(to))
    return res.status(403).json({ error: 'Cannot send request, user is blocked' });

  // 🛑 Check if already friends
  if (fromUser.friends.includes(to) || toUser.friends.includes(from)) {
    return res.status(400).json({ error: 'You are already friends' });
  }

  // ✅ Check for active (pending) request only
  const existingPending = await FriendRequest.findOne({
    $or: [
      { from, to },
      { from: to, to: from },
    ],
    status: 'pending',
  });

  if (existingPending) {
    return res.status(400).json({ error: 'Request already exists' });
  }

  await FriendRequest.create({ from, to });
  await logAction(from, 'sent request', to);

  notifyUser(to, 'new_request', {
    from: fromUser.username,
    fromId: fromUser._id,
  });

  return res.status(201).json({ message: 'Friend request sent' });
};


export const respondRequest = async (req, res) => {
  const userId = req.user._id;
  const { requestId, action } = req.body; // action = 'accept' | 'reject'

  const request = await FriendRequest.findById(requestId);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  if (request.to.toString() !== userId.toString())
    return res.status(403).json({ message: 'Not authorized' });

  if (request.status !== 'pending') return res.status(400).json({ message: 'Request already handled' });

  if (action === 'accept') {
    request.status = 'accepted';

    const fromUser = await User.findById(request.from);
    const toUser = await User.findById(request.to);

    fromUser.friends.push(toUser._id);
    toUser.friends.push(fromUser._id);

    await fromUser.save();
    await toUser.save();
    await logAction(userId, 'accepted request', request.from);
  } else {
    request.status = 'rejected';
    await logAction(userId, 'rejected request', request.from);
  }

  await request.save();
  res.json({ message: `Request ${action}ed` });
};

export const cancelRequest = async (req, res) => {
  const userId = req.user._id;
  const { requestId } = req.body;

  const request = await FriendRequest.findById(requestId);
  if (!request || request.from.toString() !== userId.toString())
    return res.status(403).json({ message: 'Unauthorized or not found' });

  request.status = 'cancelled';
  await request.save();
  await logAction(userId, 'cancelled request', request.to);

  res.json({ message: 'Request cancelled' });
};

export const listFriends = async (req, res) => {
  const user = await User.findById(req.user._id).populate('friends', 'username email');
  res.json(user.friends);
};

export const pendingRequests = async (req, res) => {
  const userId = req.user._id;

  const sent = await FriendRequest.find({ from: userId, status: 'pending' }).populate('to', 'username');
  const received = await FriendRequest.find({ to: userId, status: 'pending' }).populate('from', 'username');

  res.json({ sent, received });
};

export const getMutualFriends = async (req, res) => {
  const { userId } = req.params;
  const currentUser = await User.findById(req.user._id).populate('friends');
  const otherUser = await User.findById(userId).populate('friends');

  if (!otherUser) return res.status(404).json({ message: 'User not found' });

  const currentFriends = new Set(currentUser.friends.map(f => f._id.toString()));
  const mutuals = otherUser.friends.filter(f => currentFriends.has(f._id.toString()));

  res.json(mutuals);
};


export const removeFriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id;

  if (!friendId) {
    return res.status(400).json({ error: 'Friend ID is required' });
  }
  try {
    // Convert string to ObjectId if needed
    const friendObjectId = new mongoose.Types.ObjectId(friendId);

    // Remove friendId from current user's friends
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendObjectId }
    });

    // Remove current user from friend's friends
    await User.findByIdAndUpdate(friendObjectId, {
      $pull: { friends: userId }
    });

    // 💡 Remove any stale friend requests between them (in either direction)
    await FriendRequest.deleteMany({
      $or: [
        { from: userId, to: friendObjectId },
        { from: friendObjectId, to: userId }
      ]
    });
    return res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error("❌ Remove friend backend error:", error);
    return res.status(500).json({ error: 'Failed to remove friend' });
  }
}
