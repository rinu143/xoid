import Product from '../models/Product.js';
import { configureCloudinary } from '../config/cloudinary.js';

const cloudinary = configureCloudinary();

export const list = async (req, res) => {
  const { q, page = 1, limit = 12 } = req.query;
  const filter = q
    ? {
        $or: [
          { name: new RegExp(String(q), 'i') },
          { description: new RegExp(String(q), 'i') },
          { keywords: { $in: [new RegExp(String(q), 'i')] } },
        ],
      }
    : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

export const getById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

async function uploadBufferToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'xoid-products', public_id: filename, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export const create = async (req, res) => {
  const { name, price, description, colors = [], keywords = [], material, sizes = [], sizeStock = {} } = req.body;
  const files = req.files || [];
  const uploadResults = [];
  for (const file of files) {
    const result = await uploadBufferToCloudinary(file.buffer, `${Date.now()}-${file.originalname}`);
    uploadResults.push(result.secure_url);
  }
  const product = await Product.create({ name, price, description, colors, keywords, material, sizes, sizeStock, imageUrls: uploadResults });
  res.status(201).json(product);
};

export const update = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
};

export const remove = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Deleted' });
};

export const updateStock = async (req, res) => {
  const { sizeStock } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  product.sizeStock = sizeStock;
  await product.save();
  res.json(product);
};


