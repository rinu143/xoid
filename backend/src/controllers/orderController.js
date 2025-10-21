import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  const { items, shippingAddress, subtotal, shippingCost, total } = req.body;
  const snapshotItems = [];
  for (const it of items) {
    const p = await Product.findById(it.productId);
    if (!p) return res.status(400).json({ message: 'Invalid product' });
    snapshotItems.push({
      productId: p._id,
      name: p.name,
      price: p.price,
      quantity: it.quantity,
      size: it.size,
      imageUrl: p.imageUrls?.[0] || '',
    });
  }
  const order = await Order.create({
    userId: req.user.id,
    customerName: req.user.name,
    customerEmail: req.user.email,
    items: snapshotItems,
    shippingAddress,
    subtotal,
    shippingCost,
    total,
  });
  res.status(201).json(order);
};

export const listOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
};

export const myOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (String(order.userId) !== String(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
};

export const updateStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status || order.status;
  await order.save();
  res.json({ message: 'Status updated' });
};


