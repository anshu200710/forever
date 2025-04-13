import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllOrders = async () => {
        if (!token) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
            if (response.data.success) {
                setOrders(response.data.orders);
            } else {
                setError(response.data.message || "Failed to fetch orders.");
                toast.error(response.data.message || "Failed to fetch orders.");
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError("An error occurred while fetching orders.");
            toast.error("An error occurred while fetching orders.");
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } });
            if (response.data.success) {
                fetchAllOrders();
                toast.success("Order status updated successfully!");
            } else {
                toast.error(response.data.message || "Failed to update status.");
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error("An error occurred while updating status.");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [token]);

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (orders.length === 0) {
        return <div>No orders found.</div>;
    }

    return (
        <div>
            <h3>Order Page</h3>
            <div>
                {/* Reverse the orders array before mapping */}
                {[...orders].reverse().map((order) => (
                    <div
                        className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
                        key={order._id}
                    >
                        <img className="w-12" src={assets.parcel_icon} alt="" />
                        <div>
                            {order.items.map((item, itemIndex) => (
                                <p className="py-0.5" key={itemIndex}>
                                    {item.name} x {item.quantity} <span>{item.size}</span>
                                    {itemIndex < order.items.length - 1 ? "," : ""}
                                </p>
                            ))}
                            <p className="mt-3 mb-2 font-medium">{order.address.firstName + " " + order.address.lastName}</p>
                            <div>
                                <p>{order.address.street},</p>
                                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                            </div>
                            <p>{order.address.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
                            <p className="mt-3">Method: {order.paymentMethod}</p>
                            <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>
                        <select
                            onChange={(event) => statusHandler(event, order._id)}
                            value={order.status}
                            className="p-2 font-semibold"
                        >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Packing">Packing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;