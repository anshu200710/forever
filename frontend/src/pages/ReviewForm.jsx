import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const ReviewForm = ({ token, productId }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);

    const { backendUrl } = useContext(ShopContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment) {
            toast.error("Please enter a comment.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append('productId', productId);
            formData.append('comment', comment);
            formData.append('rating', rating);

            images.forEach((image) => formData.append('images', image));

            const response = await axios.post(backendUrl + '/api/review/add-review', formData, {
                headers: { token },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setComment('');
                setImages([]);
                setRating(5);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const renderClickableStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: 'inherit',
                        color: i <= rating ? 'orange' : 'lightgray',
                        cursor: 'pointer',
                    }}
                    onClick={() => setRating(i)}
                >
                    ★
                </button>
            );
        }
        return stars;
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rating:</label>
                <div>{renderClickableStars()}</div>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Comment:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Images:</label>
                <input type="file" multiple onChange={handleImageChange} />
            </div>
            <button
                type="submit"
                style={{ backgroundColor: '#f0c14b', border: '1px solid #a88734', borderRadius: '3px', padding: '10px 12px', cursor: 'pointer' }}
            >
                Submit Review
            </button>
        </form>
    );
};

export default ReviewForm;