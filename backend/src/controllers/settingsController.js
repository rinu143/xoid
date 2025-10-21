import CryptoJS from 'crypto-js';
import Setting from '../models/Setting.js';

const ENC_SECRET = process.env.SETTINGS_ENCRYPTION_SECRET || process.env.JWT_SECRET;

function encrypt(text) {
  if (!text) return text;
  return CryptoJS.AES.encrypt(text, ENC_SECRET).toString();
}

function decrypt(cipher) {
  if (!cipher) return cipher;
  const bytes = CryptoJS.AES.decrypt(cipher, ENC_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export const getAll = async (req, res) => {
  const settings = await Setting.find({}).lean();
  const result = settings.map((s) => ({
    key: s.key,
    value: s.isEncrypted ? decrypt(s.value) : s.value,
    category: s.category,
    description: s.description,
    updatedAt: s.updatedAt,
  }));
  res.json(result);
};

export const getByKey = async (req, res) => {
  const s = await Setting.findOne({ key: req.params.key }).lean();
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json({
    key: s.key,
    value: s.isEncrypted ? decrypt(s.value) : s.value,
    category: s.category,
    description: s.description,
    updatedAt: s.updatedAt,
  });
};

export const upsert = async (req, res) => {
  const { key, value, category = 'api', description } = req.body;
  if (!key) return res.status(400).json({ message: 'Key is required' });
  const isSensitive = ['GEMINI_API_KEY', 'RAZORPAY_KEY_SECRET', 'CLOUDINARY_API_SECRET', 'EMAIL_PASSWORD'].includes(key);
  const payload = {
    key,
    value: isSensitive ? encrypt(value) : value,
    isEncrypted: isSensitive,
    category,
    description,
    updatedBy: req.user?.id,
  };
  const setting = await Setting.findOneAndUpdate({ key }, payload, { new: true, upsert: true, setDefaultsOnInsert: true });
  res.json({ message: 'Saved', key: setting.key });
};

export const remove = async (req, res) => {
  const { key } = req.params;
  await Setting.deleteOne({ key });
  res.json({ message: 'Deleted' });
};

export const getPublicGeminiKey = async (req, res) => {
  const s = await Setting.findOne({ key: 'GEMINI_API_KEY' }).lean();
  if (!s) return res.status(404).json({ message: 'Not configured' });
  const value = s.isEncrypted ? decrypt(s.value) : s.value;
  // Do not cache on client for long
  res.set('Cache-Control', 'private, max-age=60');
  res.json({ key: value });
};


