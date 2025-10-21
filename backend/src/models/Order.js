import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    size: String,
    imageUrl: String,
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: String,
    customerEmail: String,
    items: [orderItemSchema],
    shippingAddress: addressSchema,
    subtotal: Number,
    shippingCost: Number,
    total: Number,
    status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
    paymentMethod: { type: String, default: 'Razorpay' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    const rand = Math.floor(10000 + Math.random() * 90000);
    this.orderId = `X01D-${rand}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);


