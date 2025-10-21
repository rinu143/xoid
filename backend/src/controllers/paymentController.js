import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body; // amount in paise
  const order = await instance.orders.create({ amount, currency, receipt });
  res.json(order);
};

export const verifySignature = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Invalid signature' });
  }
  const order = await Order.findById(orderId);
  if (order) {
    order.paymentStatus = 'Completed';
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();
  }
  res.json({ message: 'Payment verified' });
};


