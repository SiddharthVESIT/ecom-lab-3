import React, { useState, useEffect } from 'react';
import { getCart, createOrder, removeFromCart, createPaymentOrder, verifyPayment } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shipping, setShipping] = useState({
        firstName: '', lastName: '', address: '', country: 'United States', postalCode: '', email: ''
    });
    const [payment, setPayment] = useState({
        cardName: '', cardNumber: '', expiry: '', cvv: ''
    });
    const [orderLoading, setOrderLoading] = useState(false);
    const navigate = useNavigate();

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
            // 1. Create order on backend (amount in rupees, subtotal is string format)
            const paymentOrder = await createPaymentOrder(parseFloat(cart.subtotal));

            // 2. Open Razorpay Checktout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_change_me", // We can use env, but if it fails we show alert
                amount: paymentOrder.amount, // already in paise
                currency: "INR",
                name: "Amai",
                description: "Order Payment",
                order_id: paymentOrder.id,
                handler: async function (response) {
                    try {
                        const verification = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        
                        if (verification.verified) {
                            // 3. Create actual DB order upon successful payment
                            const res = await createOrder({
                                shippingAddress: `${shipping.address}, ${shipping.country}, ${shipping.postalCode}`,
                                billingAddress: `${shipping.address}, ${shipping.country}, ${shipping.postalCode}`
                            });
                            navigate(`/payment-success?orderId=${res.data.id}`);
                        } else {
                            alert("Payment verification failed. Please contact support.");
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
                theme: { color: "#3399cc" },
                modal: {
                    ondismiss: function() { setOrderLoading(false); }
                }
            };
            
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Failed to initialize payment');
            setOrderLoading(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-primary">Loading cart...</div>;

    const items = cart?.items || [];
    const subtotal = cart?.subtotal || '0.00';

    return (
        <div className="flex-1 flex justify-center w-full px-6 py-10 lg:px-20 lg:py-16">
            <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                {/* Left Column: Cart Summary */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex flex-col gap-2 pb-4 border-b border-[#e6e4dd] dark:border-[#3a3528]">
                        <p className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em]">Your Selection</p>
                        <p className="text-[#897f61] text-base font-normal leading-normal">Review your artisanal chocolates.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {items.length === 0 ? (
                            <p className="text-sm text-[#897f61]">Your cart is empty.</p>
                        ) : (
                            items.map(item => (
                                <div key={item.product_id} className="flex items-center gap-4 bg-white dark:bg-[#1a160c] p-4 rounded-xl shadow-sm border border-transparent dark:border-[#3a3528]">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex flex-col justify-center">
                                            <p className="text-base font-bold leading-normal line-clamp-1">{item.name}</p>
                                            <p className="text-[#897f61] text-sm font-normal mt-1">
                                                Qty: {item.quantity} | ${(item.line_total_cents / 100).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.product_id)}
                                        className="shrink-0 text-[#897f61] hover:text-red-500 transition-colors p-2"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-4 pt-6 border-t border-[#e6e4dd] dark:border-[#3a3528] space-y-3 text-sm">
                        <div className="flex justify-between text-[#897f61]">
                            <span>Subtotal</span>
                            <span>${subtotal}</span>
                        </div>
                        <div className="flex justify-between text-[#897f61]">
                            <span>Shipping (Standard)</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 text-[#181611] dark:text-[#f4f3f0]">
                            <span>Total</span>
                            <span>${subtotal}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-4 text-[#897f61] text-xs items-center justify-start opacity-70">
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            <span>Secure Checkout</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">local_shipping</span>
                            <span>Chilled Delivery</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Checkout Form */}
                <div className="lg:col-span-7 bg-white dark:bg-[#1a160c] p-8 rounded-2xl shadow-sm border border-[#e6e4dd] dark:border-[#3a3528]">
                    <form className="flex flex-col gap-8" onSubmit={handleCheckout}>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">contact_mail</span>
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#897f61] mb-2">Email Address</label>
                                    <input
                                        className="w-full h-12 rounded-lg bg-[#f8f8f6] dark:bg-[#2c2618] border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-0 transition-all text-sm px-4"
                                        placeholder="you@example.com" type="email" required
                                        value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">home_pin</span>
                                Shipping Address
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#897f61] mb-2">First Name</label>
                                    <input className="w-full h-12 rounded-lg bg-[#f8f8f6] dark:bg-[#2c2618] border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-0 transition-all text-sm px-4" type="text" required value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })} />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#897f61] mb-2">Last Name</label>
                                    <input className="w-full h-12 rounded-lg bg-[#f8f8f6] dark:bg-[#2c2618] border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-0 transition-all text-sm px-4" type="text" required value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#897f61] mb-2">Address</label>
                                    <input className="w-full h-12 rounded-lg bg-[#f8f8f6] dark:bg-[#2c2618] border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-0 transition-all text-sm px-4" placeholder="Street address, apartment, suite" type="text" required value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#897f61] mb-2">Country</label>
                                    <select className="w-full h-12 rounded-lg bg-[#f8f8f6] dark:bg-[#2c2618] border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-0 transition-all text-sm px-4 text-[#181611] dark:text-[#f4f3f0]" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })}>
                                        <option>United States</option>
                                        <option>Japan</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                    </select>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#897f61] mb-2">Postal Code</label>
                                    <input className="w-full h-12 rounded-lg bg-[#f8f8f6] dark:bg-[#2c2618] border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1a160c] focus:ring-0 transition-all text-sm px-4" type="text" required value={shipping.postalCode} onChange={e => setShipping({ ...shipping, postalCode: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Payment Information Removed - Handled by Razorpay */}

                        <div className="flex items-center justify-between pt-6 border-t border-[#f4f3f0] dark:border-[#3a3528] mt-4">
                            <Link to="/collections" className="text-sm font-bold text-[#897f61] hover:text-[#181611] dark:hover:text-white transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Return to Shop
                            </Link>
                            <button
                                type="submit"
                                disabled={orderLoading || items.length === 0}
                                className="h-12 px-8 bg-primary hover:bg-[#d9a60e] text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                {orderLoading ? 'Processing Securely...' : 'Pay Now'}
                                <span className="material-symbols-outlined text-sm">lock</span>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
