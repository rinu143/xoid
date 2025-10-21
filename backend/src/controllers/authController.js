import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { sendEmail } from '../utils/sendEmail.js';

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
}

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  const token = generateToken(user._id);
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = generateToken(user._id);
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role, addresses: user.addresses });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return res.status(400).json({ message: 'Incorrect current password' });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password changed' });
};

export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user.id);
  if (email && email.toLowerCase() !== user.email.toLowerCase()) {
    // Email change requires OTP verification flow
    return res.status(400).json({ message: 'Email change requires OTP verification' });
  }
  if (name) user.name = name;
  await user.save();
  res.json({ message: 'Profile updated', name: user.name, email: user.email });
};

export const requestOTP = async (req, res) => {
  const { email, purpose } = req.body; // email_verification | password_reset
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await OTP.create({ email: email.toLowerCase(), otp: code, purpose, expiresAt });
  await sendEmail({ to: email, subject: 'Your OTP Code', html: `<p>Your OTP code is <b>${code}</b>. It expires in 15 minutes.</p>` });
  res.json({ message: 'OTP sent' });
};

export const verifyOTP = async (req, res) => {
  const { email, otp, purpose } = req.body;
  const record = await OTP.findOne({ email: email.toLowerCase(), otp, purpose });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
  await OTP.deleteMany({ email: email.toLowerCase(), purpose });
  res.json({ message: 'OTP verified' });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = await OTP.findOne({ email: email.toLowerCase(), otp, purpose: 'password_reset' });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'password_reset' });
  res.json({ message: 'Password reset successful' });
};


