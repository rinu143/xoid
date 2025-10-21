import User from '../models/User.js';

export const listUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  await user.save();
  res.json({ message: 'Role updated' });
};

export const addAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  const addr = req.body;
  if (addr.isDefault) {
    user.addresses = user.addresses.map((a) => ({ ...a.toObject(), isDefault: false }));
  }
  user.addresses.push(addr);
  if (user.addresses.length === 1) user.addresses[0].isDefault = true;
  await user.save();
  res.status(201).json(user.addresses[user.addresses.length - 1]);
};

export const updateAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { addressId } = req.params;
  const idx = user.addresses.findIndex((a) => a._id?.toString() === addressId);
  if (idx === -1) return res.status(404).json({ message: 'Address not found' });
  const updated = { ...user.addresses[idx].toObject(), ...req.body };
  if (updated.isDefault) {
    user.addresses = user.addresses.map((a, i) => ({ ...a.toObject(), isDefault: i === idx }));
  }
  user.addresses[idx] = updated;
  await user.save();
  res.json(updated);
};

export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { addressId } = req.params;
  const before = user.addresses.length;
  user.addresses = user.addresses.filter((a) => a._id?.toString() !== addressId);
  if (before !== user.addresses.length) {
    if (!user.addresses.some((a) => a.isDefault) && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    await user.save();
  }
  res.json({ message: 'Deleted' });
};

export const setDefaultAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { addressId } = req.params;
  user.addresses = user.addresses.map((a) => ({ ...a.toObject(), isDefault: a._id?.toString() === addressId }));
  await user.save();
  res.json({ message: 'Default updated' });
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  res.json(user.wishlist || []);
};

export const addToWishlist = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { productId } = req.params;
  if (!user.wishlist.find((id) => id.toString() === productId)) {
    user.wishlist.push(productId);
    await user.save();
  }
  res.status(201).json({ message: 'Added' });
};

export const removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { productId } = req.params;
  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();
  res.json({ message: 'Removed' });
};


