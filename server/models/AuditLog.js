import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('AuditLog', AuditLogSchema);
