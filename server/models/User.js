import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('User', UserSchema);
