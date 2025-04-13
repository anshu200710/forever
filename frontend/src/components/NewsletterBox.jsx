import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false); // New state variable
    const { backendUrl } = useContext(ShopContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/subscribers/subscribe', { email });
            if (response.data.success) {
                toast.success(response.data.message);
                setEmail('');
                setIsSubscribed(response.data.subscribed); // Update subscription status
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="text-center">
            <p className="text-2xl font-medium text-gray-800">
                Subscribe now & get 20% off
            </p>
            <p className="text-gray-400 mt-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam amet odio provident, explicabo nulla nemo omnis dolor pariatur necessitatibus vel. Libero possimus rerum, quas quia id facere ab iste tempore?
            </p>
            <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3' action="">
                <input
                    type="email"
                    placeholder="Enter you Email here"
                    className="w-full sm:flex-1 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className={`bg-black text-white text-xs px-10 py-4 ${isSubscribed ? 'bg-gray-500 cursor-not-allowed' : ''}`} disabled={isSubscribed}>
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
            </form>
        </div>
    );
};

export default NewsletterBox;