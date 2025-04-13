import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const ReviewsList = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image URL
    const { backendUrl } = useContext(ShopContext);

    useEffect(() => {
        if (productId) {
            getReviewsData();
        }
    }, [productId, backendUrl]);

    const getReviewsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/review/list-review?productId=${productId}`);
            if (response.data.success) {
                setReviews(response.data.reviews);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/review/delete-review/${reviewId}`);
            if (response.data.success) {
                toast.success(response.data.message);
                setReviews(reviews.filter((review) => review._id !== reviewId));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= rating ? 'orange' : 'lightgray' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return 'Invalid Date';
        }
        return date.toLocaleDateString();
    };

    const handleImageError = (e) => {
        e.target.src = 'placeholder_image.png';
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id} style={{ borderBottom: '1px solid #eee', padding: '15px 0', position: 'relative' }}>
                        <button
                            style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => deleteReview(review._id)}
                        >
                            <span style={{ color: 'red', fontSize: '1.2em' }}>&times;</span>
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            {renderStars(review.rating)}
                            <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{review.rating} out of 5</span>
                        </div>
                        <p style={{ marginBottom: '8px' }}>Comment: {review.comment}</p>
                        {review.userId && (
                            <p style={{ fontSize: '0.9em', color: '#666' }}>
                                User: {review.userId.username}
                            </p>
                        )}
                        <p style={{ fontSize: '0.8em', color: '#999' }}>
                            {formatDate(review.date)}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                            {review.imageUrls &&
                                review.imageUrls.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`Review Image ${index + 1}`}
                                        style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px', marginBottom: '10px', cursor: 'pointer' }}
                                        onClick={() => handleImageClick(imageUrl)}
                                        onError={handleImageError}
                                    />
                                ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No reviews yet.</p>
            )}

            {/* Modal/Popup (Outside of map) */}
            {selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        style={{
                            position: 'relative',
                            maxWidth: '80%',
                            maxHeight: '80%',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={selectedImage} alt="Full Size Review" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        <button
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '2em',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                            onClick={handleCloseModal}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsList;