import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('FriendRequest', FriendRequestSchema);
