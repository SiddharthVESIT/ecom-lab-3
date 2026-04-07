import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/api';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';

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

    if (loading) return (
        <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-primary font-bold tracking-widest text-sm uppercase">Recalling your rituals...</p>
        </div>
    );

    return (
        <div className="flex-1 flex justify-center w-full px-6 py-10 lg:px-20 lg:py-16 bg-[#faf9f6] dark:bg-background-dark">
            <div className="max-w-[1000px] w-full flex flex-col gap-10">
                <div className="flex flex-col gap-2 pb-6 border-b border-border-subtle">
                    <h1 className="text-4xl font-black leading-tight tracking-tight text-text-main dark:text-white">Ritual History</h1>
                    <p className="text-text-secondary text-base">Your chronicle of artisanal chocolate experiences.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="py-20 text-center bg-white dark:bg-[#1a160c] rounded-3xl border border-border-subtle shadow-sm">
                        <span className="material-symbols-outlined text-6xl text-primary/20 mb-4">inventory_2</span>
                        <p className="text-text-secondary mb-8 text-lg">Your collection of rituals is currently empty.</p>
                        <Link to="/collections" className="inline-flex items-center justify-center h-14 px-10 bg-primary hover:bg-[#d9a60f] text-white text-sm font-bold tracking-widest uppercase rounded-xl transition-all shadow-lg hover:shadow-primary/20">
                            Begin your first Ritual
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-[#1a160c] p-8 rounded-3xl shadow-sm border border-border-subtle hover:border-primary/20 transition-all group">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-border-subtle">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-black text-xl text-text-main dark:text-white">Order #{order.id}</h3>
                                            <span className="inline-block px-3 py-0.5 bg-primary/10 text-primary font-black text-[10px] rounded-full uppercase tracking-widest">
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-text-secondary">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div className="md:text-right">
                                        <p className="text-2xl font-black text-text-main dark:text-white tracking-tight">{formatCurrency(order.total_cents)}</p>
                                        {order.discount_paise > 0 && (
                                            <p className="text-xs font-bold text-primary">Saved {formatCurrency(order.discount_paise)} via Beans</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="flex justify-between items-center bg-[#fcfbf9] dark:bg-black/20 p-4 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-primary text-xl">bakery_dining</span>
                                                </div>
                                                <span className="text-sm font-bold text-text-main dark:text-white">
                                                    {item.quantity} × {item.product?.name || 'Artisan Creation'}
                                                </span>
                                            </div>
                                            <span className="text-sm font-black text-text-secondary">{formatCurrency(item.price_cents * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button className="text-xs font-bold text-primary flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                                        <span className="material-symbols-outlined text-sm">download</span>
                                        Download Memorial Invoice
                                    </button>
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
