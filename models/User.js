import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  otp: String,
  otpExpiresAt: Date,
}, { timestamps: true });

export default mongoose.model('User', UserSchema);