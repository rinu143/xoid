import Review from '../models/Review.js';

export const listByProduct = async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
  res.json(reviews);
};

export const create = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const review = await Review.create({ productId, userId: req.user.id, author: req.user.name, rating, comment });
  res.status(201).json(review);
};

export const update = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (String(review.userId) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;
  await review.save();
  res.json(review);
};

export const remove = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (String(review.userId) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  await review.deleteOne();
  res.json({ message: 'Deleted' });
};


