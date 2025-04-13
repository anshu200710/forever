// models/review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    imageUrls: [{ type: String }], // Add imageUrls as array of strings
});

const reviewModel = mongoose.model('Review', reviewSchema);

export default reviewModel;