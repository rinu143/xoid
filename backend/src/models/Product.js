import mongoose from 'mongoose';

const sizeStockSchema = new mongoose.Schema(
  {
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    imageUrls: [{ type: String }],
    colors: [{ type: String }],
    keywords: [{ type: String, index: true }],
    material: { type: String },
    sizeStock: { type: sizeStockSchema, default: () => ({}) },
    stock: { type: Number, default: 0 },
    sizes: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  const s = this.sizeStock || {};
  this.stock = (s.S || 0) + (s.M || 0) + (s.L || 0) + (s.XL || 0);
  next();
});

export default mongoose.model('Product', productSchema);


