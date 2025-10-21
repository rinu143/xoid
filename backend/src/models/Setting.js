import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    category: { type: String, enum: ['api', 'payment', 'email', 'general'], default: 'api' },
    isEncrypted: { type: Boolean, default: false },
    description: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);


