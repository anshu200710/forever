import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
            if (response.data.success) {
                let allOrdersItem = [];
                response.data.orders.forEach((order) => {
                    order.items.forEach((item) => {
                        item['status'] = order.status;
                        item['paymenMethod'] = order.paymentMethod;
                        item['payment'] = order.payment;
                        item['date'] = order.date;
                        allOrdersItem.push(item);
                    });
                });
                setOrderData(allOrdersItem.reverse()); // Reverse the order here
            }
        } catch (error) {
            console.error("Error loading order data:", error);
        }
    };

    useEffect(() => {
        loadOrderData();
    }, [token]);

    const TrackerProgressBar = ({ steps }) => {
        return (
            <div className="relative">
                <div className="absolute top-0 left-4 md:left-6 h-full border-l-2 border-gray-300"></div>
                {steps.map((step) => (
                    <div key={step.status} className="flex items-start py-2 md:py-4">
                        <div className="relative">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center ${step.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                                {step.isCompleted && <span className="text-sm md:text-xl">✓</span>}
                            </div>
                        </div>
                        <div className="ml-2 md:ml-4">
                            <p className="text-xs md:text-sm font-semibold">{step.status}</p>
                            <p className="text-xs text-gray-500">{step.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='border-t pt-16'>
            <div className="text-2xl">
                <div className="inline-flex gap-2 items-center mb-3">
                    <Title text1={'MY'} text2={'ORDERS'} />
                </div>
                <div>
                    {orderData.map((item) => {
                        const steps = [
                            {
                                status: "Order Placed",
                                date: new Date(item.date).toDateString(),
                                isCompleted: true,
                            },
                            {
                                status: "Packing",
                                date: new Date(item.date).toDateString(),
                                isCompleted: item.status === "Packing" || item.status === "Shipped" || item.status === "Out for delivery" || item.status === "Delivered",
                            },
                            {
                                status: "Shipped",
                                date: new Date(item.date).toDateString(),
                                isCompleted: item.status === "Shipped" || item.status === "Out for delivery" || item.status === "Delivered",
                            },
                            {
                                status: "Out for delivery",
                                date: new Date(item.date).toDateString(),
                                isCompleted: item.status === "Out for delivery" || item.status === "Delivered",
                            },
                            {
                                status: "Delivered",
                                date: new Date(item.date).toDateString(),
                                isCompleted: item.status === "Delivered",
                            },
                        ];

                        return (
                            <div key={item.name} className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:item-center md:justify-between gap-4">
                                <div className="flex items-start gap-6 text-sm">
                                    <img src={item.image[0]} className='w-16 sm:w-20' alt="" />
                                    <div>
                                        <p className='sm:text-base font-medium'>{item.name}</p>
                                        <div className="flex items-start gap-3 mt-1 text-base text-gray-700">
                                            <p className='text-lg'>{currency}{item.price}</p>
                                            <p className='text-lg'>Quantity: {item.quantity}</p>
                                            <p className='text-lg'>Size: {item.size}</p>
                                        </div>
                                        <p className='mt-1'> Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                                        <p className='mt-1'> Payment: <span className='text-gray-400'>{item.paymenMethod}</span></p>
                                    </div>
                                </div>
                                <div className="md:w-1/2 flex flex-col">
                                    <TrackerProgressBar steps={steps} />
                                    <button
                                        onClick={() => loadOrderData()}
                                        className="border px-4 py-2 text-sm font-medium rounded-sm mt-4"
                                    >
                                        Track order
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Orders;