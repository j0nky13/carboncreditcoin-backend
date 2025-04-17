import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: String, // we’ll add logic for this later
}, { timestamps: true });

export default mongoose.model('User', UserSchema);