import React, { useState, useEffect } from 'react';
import { getOrders, downloadInvoice } from '../services/api';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDownloadInvoice = async (orderId) => {
        try {
            const blob = await downloadInvoice(orderId);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `Amai_Invoice_${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download invoice. Please try again later.');
        }
    };

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
        <div className="flex-1 flex justify-center items-center py-40">
            <div className="flex flex-col items-center gap-4 text-zen-brown dark:text-zen-brown-light">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
                <p className="font-bold tracking-widest uppercase text-sm">Loading your orders...</p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex justify-center w-full px-6 py-10 lg:px-20 lg:py-16 bg-[#faf9f6] dark:bg-background-dark">
            <div className="max-w-[1000px] w-full flex flex-col gap-10">
                <main className="max-w-6xl mx-auto px-6 py-12 flex-grow w-full">
                    <h1 className="text-4xl font-display font-bold text-zen-black dark:text-white mb-2">Order History</h1>
                    <p className="text-zen-brown dark:text-gray-400 mb-10">Review your past Amai experiences.</p>

                    {orders.length === 0 ? (
                        <div className="bg-[#f8f8f6] dark:bg-[#1a160d] border border-dashed border-[#e6e4dd] dark:border-[#3a3528] rounded-2xl py-24 flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-6xl text-[#d0ccc0] dark:text-[#4a4230] mb-4">inventory_2</span>
                            <h3 className="text-xl font-bold text-zen-black dark:text-white mb-2">Your order history is currently empty.</h3>
                            <p className="text-zen-brown dark:text-gray-400 mb-6 max-w-sm">Every great journey begins with a single taste. Explore our collections.</p>
                            <Link to="/collections" className="bg-primary hover:bg-[#d9a60e] text-white px-8 py-3 rounded-lg font-bold transition-all">
                                Place your first order
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
                                        {['completed', 'paid'].includes(order.status?.toLowerCase()) && (
                                            <button 
                                                onClick={() => handleDownloadInvoice(order.id)}
                                                className="text-primary hover:text-[#d9a60e] font-bold text-sm underline flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">download</span>
                                                Download Order Invoice
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Orders;
