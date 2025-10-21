import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    otp: { type: String, required: true },
    purpose: { type: String, enum: ['email_verification', 'password_reset'], required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('OTP', otpSchema);


