import React, { useState, useEffect } from 'react';
import { getCart, createOrder, removeFromCart, createPaymentOrder, verifyPayment } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/utils';

const Checkout = () => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [shipping, setShipping] = useState({
        firstName: '', lastName: '', address: '', country: 'India', postalCode: '', email: user?.email || ''
    });
    const [orderLoading, setOrderLoading] = useState(false);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { getProfile } = await import('../services/api');
                const profile = await getProfile();
                if (profile && profile.loyalty_points) {
                    setLoyaltyPoints(profile.loyalty_points);
                }
            } catch (err) {}
        };
        fetchUserProfile();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await getCart();
                setCart(data);
            } catch (err) {
                console.error('Error fetching cart:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleRemove = async (itemId) => {
        try {
            await removeFromCart(itemId);
            const data = await getCart();
            setCart(data);
        } catch (err) {
            alert('Error removing item');
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!cart || cart.items.length === 0) return alert('Cart is empty.');

        setOrderLoading(true);
        try {
            // Calculate final amount after discount for Razorpay
            const subtotalPaise = cart.items.reduce((sum, item) => sum + Number(item.line_total_cents), 0);
            const discountPaise = Math.floor(pointsToRedeem / 10) * 100;
            const finalAmountPaise = Math.max(0, subtotalPaise - discountPaise);

            // 1. Create payment order on backend (amount in INR)
            const paymentOrder = await createPaymentOrder(finalAmountPaise / 100);

            // 2. Open Razorpay Checkout
            const options = {
                key: paymentOrder.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SS9xOu4pGYiGh3",
                amount: paymentOrder.amount, // in paise
                currency: "INR",
                name: "AMAI Chocolatiers",
                description: "Artisan Chocolate Order",
                order_id: paymentOrder.id,
                handler: async function (response) {
                    try {
                        const verification = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        
                        if (verification.verified) {
                            // 3. Create actual DB order
                            const res = await createOrder({
                                shippingAddress: `${shipping.address}, ${shipping.country}, ${shipping.postalCode}`,
                                billingAddress: `${shipping.address}, ${shipping.country}, ${shipping.postalCode}`,
                                pointsToRedeem: Number(pointsToRedeem)
                            });
                            navigate(`/payment-success?orderId=${res.data.id}`);
                        } else {
                            alert("Payment verification failed.");
                            setOrderLoading(false);
                        }
                    } catch (verifyError) {
                        alert("Error verifying payment");
                        setOrderLoading(false);
                    }
                },
                prefill: {
                    name: `${shipping.firstName} ${shipping.lastName}`,
                    email: shipping.email,
                },
                theme: { color: "#ecb613" },
                modal: { ondismiss: () => setOrderLoading(false) }
            };
            
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Payment initialization failed');
            setOrderLoading(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-primary font-display text-2xl animate-pulse">Preparing your Selection...</div>;

    const items = cart?.items || [];
    const subtotalPaise = items.reduce((sum, item) => sum + Number(item.line_total_cents), 0);
    const discountPaise = Math.floor(pointsToRedeem / 10) * 100;
    const totalPaise = Math.max(0, subtotalPaise - discountPaise);
    const userMaxPoints = loyaltyPoints || user?.loyaltyPoints || 0;

    return (
        <div className="flex-1 flex justify-center w-full px-6 py-10 lg:px-20 lg:py-16 bg-[#faf9f6] dark:bg-background-dark">
            <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                {/* Left Column: Cart Summary */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex flex-col gap-2 pb-4 border-b border-border-subtle">
                        <p className="text-3xl lg:text-4xl font-black leading-tight tracking-tight text-text-main dark:text-white">Your Selection</p>
                        <p className="text-text-secondary text-base">Review your artisanal chocolates.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {items.length === 0 ? (
                            <div className="py-10 text-center bg-white dark:bg-[#1a160c] rounded-2xl border border-dashed border-border-subtle">
                                <p className="text-sm text-text-secondary">Your collection is empty.</p>
                            </div>
                        ) : (
                            items.map(item => (
                                <div key={item.product_id} className="flex items-center gap-4 bg-white dark:bg-[#1a160c] p-4 rounded-2xl shadow-sm border border-border-subtle hover:border-primary/30 transition-colors group">
                                    <div className="flex flex-col justify-center flex-1">
                                        <p className="text-base font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">{item.name}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-text-secondary text-xs font-medium">Qty: {item.quantity}</p>
                                            <p className="text-text-main dark:text-gray-200 font-bold text-sm tracking-tight">{formatCurrency(item.line_total_cents)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.product_id)}
                                        className="shrink-0 text-text-secondary hover:text-red-500 transition-colors p-2"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Loyalty Points Redemption */}
                    {userMaxPoints > 0 && items.length > 0 && (
                        <div className="mt-4 p-5 bg-primary/5 border border-primary/20 rounded-2xl">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">stars</span>
                                    Amai Rewards
                                </span>
                                <span className="text-[10px] font-bold text-text-secondary">{userMaxPoints} Beans available</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-bold text-text-secondary uppercase">Redeem Beans for Discount</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max={userMaxPoints} 
                                        step="10" 
                                        value={pointsToRedeem}
                                        onChange={(e) => setPointsToRedeem(e.target.value)}
                                        className="flex-1 h-1.5 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-3"
                                    />
                                    <span className="text-lg font-black text-primary min-w-[60px] text-right">{pointsToRedeem}</span>
                                </div>
                                <p className="text-[10px] font-medium text-primary mt-1 italic">-{formatCurrency(discountPaise)} saved from your total</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 pt-6 border-t border-border-subtle space-y-3 text-sm">
                        <div className="flex justify-between text-text-secondary">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotalPaise)}</span>
                        </div>
                        {discountPaise > 0 && (
                            <div className="flex justify-between text-primary font-bold">
                                <span>Loyalty Discount</span>
                                <span>-{formatCurrency(discountPaise)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-text-secondary">
                            <span>Shipping (Standard)</span>
                            <span className="text-green-600 font-bold uppercase text-[10px] pt-1">Free</span>
                        </div>
                        <div className="flex justify-between text-2xl font-black pt-4 text-text-main dark:text-white border-t border-border-subtle mt-4">
                            <span>Total</span>
                            <span>{formatCurrency(totalPaise)}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-6 text-text-secondary text-[10px] font-black uppercase tracking-widest items-center opacity-60">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            <span>Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">local_shipping</span>
                            <span>Chilled</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Checkout Form */}
                <div className="lg:col-span-7 bg-white dark:bg-[#1a160c] p-8 md:p-10 rounded-3xl shadow-sm border border-border-subtle">
                    <form className="flex flex-col gap-10" onSubmit={handleCheckout}>

                        <div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">contact_mail</span>
                                Personal Details
                            </h3>
                            <div className="grid grid-cols-1 gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-text-secondary">Email Address</label>
                                    <input
                                        className="w-full h-12 rounded-xl bg-[#f8f8f6] dark:bg-[#2c2618] border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-1 focus:ring-primary transition-all text-sm px-4 outline-none"
                                        placeholder="you@artisan.co" type="email" required
                                        value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">home_pin</span>
                                Delivery Sanctuary
                            </h3>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-text-secondary">First Name</label>
                                    <input className="w-full h-12 rounded-xl bg-[#f8f8f6] dark:bg-[#2c2618] border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-1 focus:ring-primary transition-all text-sm px-4 outline-none" type="text" required value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })} />
                                </div>
                                <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-text-secondary">Last Name</label>
                                    <input className="w-full h-12 rounded-xl bg-[#f8f8f6] dark:bg-[#2c2618] border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-1 focus:ring-primary transition-all text-sm px-4 outline-none" type="text" required value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })} />
                                </div>
                                <div className="col-span-2 flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-text-secondary">Address</label>
                                    <input className="w-full h-12 rounded-xl bg-[#f8f8f6] dark:bg-[#2c2618] border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-1 focus:ring-primary transition-all text-sm px-4 outline-none" placeholder="Street name and House number" type="text" required value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
                                </div>
                                <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-text-secondary">Country</label>
                                    <select className="w-full h-12 rounded-xl bg-[#f8f8f6] dark:bg-[#2c2618] border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-1 focus:ring-primary transition-all text-sm px-4 outline-none text-text-main dark:text-white" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })}>
                                        <option>India</option>
                                        <option>Japan</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                        <option>United States</option>
                                    </select>
                                </div>
                                <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-text-secondary">Postal Code</label>
                                    <input className="w-full h-12 rounded-xl bg-[#f8f8f6] dark:bg-[#2c2618] border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-1 focus:ring-primary transition-all text-sm px-4 outline-none" type="text" required value={shipping.postalCode} onChange={e => setShipping({ ...shipping, postalCode: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border-subtle gap-6">
                            <Link to="/collections" className="text-xs font-bold text-text-secondary hover:text-text-main transition-colors flex items-center gap-2 group">
                                <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                                Return to Collections
                            </Link>
                            <button
                                type="submit"
                                disabled={orderLoading || items.length === 0}
                                className="w-full md:w-auto h-14 px-12 bg-primary hover:bg-[#d9a60e] text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {orderLoading ? 'Processing Sanctuary Order...' : `Complete Ritual • ${formatCurrency(totalPaise)}`}
                                <span className="material-symbols-outlined">lock</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
