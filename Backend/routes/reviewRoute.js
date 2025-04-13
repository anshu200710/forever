// routes/review.js
import express from 'express';
import { addReview, listReview, deleteReview } from '../controllers/addReview.js';
import upload from '../middleware/multer.js';



const reviewRouter = express.Router();


reviewRouter.post('/add-review', upload.array('images', 4), addReview);
reviewRouter.get('/list-review',listReview)
reviewRouter.delete('/delete-review/:reviewId', deleteReview);

export default reviewRouter;