import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProduct from '../components/RelatedProduct';
import ReviewForm from './ReviewForm';
import ReviewsList from '../components/ReviewList';
import Title from '../components/Title';

const Product = () => {
    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(null); // Initialize to null
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); //add error state.

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true); // Set loading to true
            setError(null); // reset error
            try {
                const product = products.find((item) => item._id === productId); // use find
                if (product) {
                    setProductData(product);
                    setImage(product.image[0]);
                } else {
                    setError('Product not found.'); // Set error
                }
            } catch (err) {
                setError('Failed to load product.'); // Set error
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false); // Set loading to false
            }
        };
        fetchProductData();
        window.scrollTo(0, 0); 
    }, [productId, products]); // Add products to dependency array

    if (loading) {
        return <p>Loading product...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!productData) {
        return <p>Product not found.</p>;
    }

    return (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
            {/* PRODUCT DATA*/}
            <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
                {/* PRODUCT IMAGE*/}
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                        {productData.image.map((item, index) => (
                            <img onClick={() => setImage(item)} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' key={index} src={item} alt="" />
                        ))}
                    </div>
                    <div className="w-full sm:w-[80%]">
                        <img className='w-full h-auto' src={image} alt="" />
                    </div>
                </div>

                {/*--------PRODUCT INFO -------------- */}
                <div className="flex-1">
                    <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
                    <div className=" flex items-center gap-1 mt-2">
                        <img className="w-3 5" src={assets.star_icon} alt="" />
                        <img className="w-3 5" src={assets.star_icon} alt="" />
                        <img className="w-3 5" src={assets.star_icon} alt="" />
                        <img className="w-3 5" src={assets.star_icon} alt="" />
                        <img className="w-3 5" src={assets.star_dull_icon} alt="" />
                        <p className='pl-2'>(122)</p>
                    </div>
                    <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
                    <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
                    <div className="flex flex-col gap-4 my-8">
                        <p>Select Size</p>
                        <div className="flex gap-2">
                            {productData.sizes.map((item, index) => (
                                <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => addToCart(productData._id, size)} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">ADD TO CART</button>
                    <hr className="mt-8 sm:w-4/5" />
                    <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                        <p>100% Original product.</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>

            {/* REVIEW SECTION OF DESCRIPTION */}
            <div className="mt-20">
                <div className="flex">
                    <b className="border px-5 py-3 text-sm">Description</b>
                    <p className="border px-5 py-3 text-sm">Reviews (122)</p>
                </div>
                <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
                    <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
                    <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
                </div>
            </div>



            <Title text1={'CUSTOMER'} text2={'REVIEWS'}/>
            {/* REVIEW FORM AND LIST */}
            <div className="mt-10">
                <ReviewForm productId={productData._id} />
                <ReviewsList productId={productData._id} />
            </div>

            {/*RELATED PRODUCTS */}
            <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
        </div>
    );
};

export default Product;