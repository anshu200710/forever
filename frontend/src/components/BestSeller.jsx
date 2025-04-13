import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestseller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProducts = products
            .filter((item) => item.bestSeller === true)
            .reverse() // Reverse the filtered array
            .slice(0, 5); // Take the first 5 elements

        setBestSeller(bestProducts);
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi mollitia ea, possimus sed animi id nam dolorum nostrum? Illo tempora amet nemo quam maiores reiciendis fuga doloremque id perspiciatis numquam?
                </p>
            </div>

            {/* Rendering Products */}

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {bestseller.length > 0 ? (
                    bestseller.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                ) : (
                    <p>No BestSellers to display</p>
                )}
            </div>
        </div>
    );
};

export default BestSeller;