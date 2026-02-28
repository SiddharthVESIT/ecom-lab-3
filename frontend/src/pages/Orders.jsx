import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/api';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="py-20 text-center text-primary">Loading orders...</div>;

    return (
        <div className="flex-1 flex justify-center w-full px-6 py-10 lg:px-20 lg:py-16">
            <div className="max-w-[1200px] w-full flex flex-col gap-6">
                <div className="flex flex-col gap-2 pb-4 border-b border-[#e6e4dd] dark:border-[#3a3528]">
                    <p className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em]">Your Orders</p>
                    <p className="text-[#897f61] text-base font-normal leading-normal">Track your recent purchases and artisan chocolates history.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="py-10 text-center">
                        <p className="text-[#897f61] mb-6">You haven't placed any orders yet.</p>
                        <Link to="/collections" className="inline-flex items-center justify-center h-12 px-8 bg-primary hover:bg-[#d9a60f] text-charcoal text-sm font-bold tracking-widest uppercase rounded-lg transition-colors duration-300">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-[#1a160c] p-6 rounded-xl shadow-sm border border-[#e6e4dd] dark:border-[#3a3528]">
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#e6e4dd] dark:border-[#3a3528]">
                                    <div>
                                        <h3 className="font-bold text-lg text-[#181611] dark:text-white">Order #{order.id}</h3>
                                        <p className="text-sm text-[#897f61]">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full uppercase tracking-wider mb-1">
                                            {order.status}
                                        </span>
                                        <p className="font-bold text-[#181611] dark:text-white">${(order.total_cents / 100).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <span className="text-[#181611] dark:text-white">
                                                {item.quantity}x {item.product?.name || 'Artisan Chocolate'}
                                            </span>
                                            <span className="text-[#897f61]">${(item.price_cents / 100).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
