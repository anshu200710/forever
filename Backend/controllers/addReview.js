// controllers/addReview.js
import { v2 as cloudinary } from 'cloudinary';
import Review from '../models/review.js';


const addReview = async (req, res) => {

    
    try {
        const { comment, productId, rating } = req.body;
        const images = req.files;

        

        let imageUrls = [];

        if (images.length > 0) {
            imageUrls = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
        }

        const reviewData = {
            productId,
            rating,
            comment,
            date: Date.now(),
            imageUrls: imageUrls,
        };

        const review = new Review(reviewData);
        await review.save();

        res.json({ success: true, message: 'REVIEW ADDED' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};



const listReview = async (req, res) => {
    try {
        const { productId } = req.query; // Get productId from query parameters

        let reviews;

        if (productId) {
            reviews = await Review.find({ productId: productId }).populate('userId'); // Filter by productId and populate user
        } else {
            reviews = await Review.find({}).populate('userId'); // If no productId, return all reviews (you may want to remove this).
        }

        res.json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      await Review.findByIdAndDelete(reviewId);
      res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }

export { addReview, listReview, deleteReview };