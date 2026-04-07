import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, addToCart, getReviews, createReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../lib/utils';

const ProductDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);

    // New review state
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productData, reviewsData] = await Promise.all([
                    getProductById(id),
                    getReviews(id)
                ]);
                setProduct(productData);
                setReviews(reviewsData);
            } catch (err) {
                console.error('Failed to fetch details.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            await addToCart(product.id, quantity);
            alert('Added to cart!');
        } catch (err) {
            alert('Please login to add to cart.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to leave a review.');
        setSubmittingReview(true);
        try {
            await createReview({ productId: id, rating: newRating, comment: newComment });
            const updatedReviews = await getReviews(id);
            setReviews(updatedReviews);
            setNewComment('');
            alert('Review submitted!');
        } catch (err) {
            alert('Failed to submit review.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-primary">Loading Amai experience...</div>;
    if (!product) return <div className="py-20 text-center">Product not found.</div>;

    const imgUrl = product.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAlFDsHr5u2h3uQg9HlSuXzg16R32UrhFlQW8h8B6wOW30MFW9XVCdWhWP8kG1yO6yH3Ap1dlU7Tjl8T88B-aCTc0N4zYdLheG4gGxfwT6kN3dP1sD_a_h_bbV8fsTCumUjgT8vkI9UWlYmxescMU224-J7P1GqsxpkePq0U0Iwl0BDUxx4SYV7P6cAy58aR4GMZDvDq_RK2GYQRsqqsWkJuf2bjyfeSThbAdZR2VizUQ4jrz-sW05Z_pnWSH8PymEaPAh1a_9LTUAx";

    return (
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 flex-grow">

            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 mb-8 mt-4">
                <Link to="/" className="text-text-secondary hover:text-primary dark:text-gray-400 text-sm font-medium transition-colors">Home</Link>
                <span className="text-text-secondary dark:text-gray-500 text-sm">/</span>
                <Link to="/collections" className="text-text-secondary hover:text-primary dark:text-gray-400 text-sm font-medium transition-colors">Collections</Link>
                <span className="text-text-secondary dark:text-gray-500 text-sm">/</span>
                <span className="text-text-main dark:text-white text-sm font-medium">{product.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                {/* Left Column: Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-[#2a2415] relative group shadow-sm">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${imgUrl}")` }}></div>
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Premium Selection</div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-primary font-bold tracking-wider text-xs uppercase">{product.category.replace('_', ' ')}</span>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-primary text-[18px]">star</span>
                            <span className="text-text-main dark:text-white font-bold text-sm">
                                {reviews.length > 0 
                                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                                    : 'New'}
                            </span>
                        </div>
                    </div>
                    <h1 className="text-text-main dark:text-white text-4xl lg:text-5xl font-bold font-display leading-tight mb-2">{product.name}</h1>
                    
                    <div className="flex items-baseline gap-4 mb-6">
                        <p className="text-3xl text-primary font-bold">{formatCurrency(product.price_cents)}</p>
                        <span className="text-sm text-text-secondary line-through opacity-50">{formatCurrency(product.price_cents * 1.2)}</span>
                    </div>

                    <p className="text-text-secondary dark:text-gray-300 text-lg leading-relaxed mb-6 font-light">
                        {product.description}
                    </p>

                    {/* Subscription Selection */}
                    <div className="mb-8 p-4 border border-primary/20 bg-primary/5 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-sm text-text-main dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">auto_renew</span>
                                Purchase Options
                            </span>
                            <span className="text-[10px] uppercase font-black tracking-widest text-primary px-2 py-0.5 bg-primary/10 rounded">Recommended</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${!isSubscribing ? 'border-primary bg-white' : 'border-border-subtle bg-transparent opacity-60'}`} onClick={() => setIsSubscribing(false)}>
                                <span className="text-sm font-bold">One-time purchase</span>
                                <span className="text-sm">{formatCurrency(product.price_cents)}</span>
                            </label>
                            <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${isSubscribing ? 'border-primary bg-white' : 'border-border-subtle bg-transparent opacity-60'}`} onClick={() => setIsSubscribing(true)}>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">Subscribe & Save 15%</span>
                                    <span className="text-[10px] text-primary font-bold">Earn Double Loyalty Beans</span>
                                </div>
                                <span className="text-sm font-bold text-primary">{formatCurrency(product.price_cents * 0.85)}</span>
                            </label>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="flex flex-wrap gap-4 mb-10">
                        <div className="flex items-center border border-border-subtle dark:border-[#4a4230] rounded-lg h-14 w-32 bg-white dark:bg-background-dark">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-text-secondary">
                                <span className="material-symbols-outlined text-[20px]">remove</span>
                            </button>
                            <input className="w-full h-full text-center border-none bg-transparent font-bold text-lg" readOnly value={quantity} />
                            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-text-secondary">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="flex-1 min-w-[200px] h-14 bg-primary hover:bg-[#d9a610] text-white rounded-lg font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            <span>{addingToCart ? 'Adding...' : 'Secure My Order'}</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border-subtle dark:border-[#3a3424] mb-10">
                        <div className="flex flex-col items-center text-center gap-2">
                             <div className="size-10 rounded-full bg-[#f4f3f0] dark:bg-[#3a3424] flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">eco</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-text-main dark:text-gray-200">100% Organic</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                             <div className="size-10 rounded-full bg-[#f4f3f0] dark:bg-[#3a3424] flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">bolt</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-text-main dark:text-gray-200">Express Delivery</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                             <div className="size-10 rounded-full bg-[#f4f3f0] dark:bg-[#3a3424] flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">workspace_premium</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-text-main dark:text-gray-200">Artisan Boxed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-20 pt-20 border-t border-border-subtle overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="w-full lg:w-1/3">
                        <h2 className="text-3xl font-bold mb-4">Customer Stories</h2>
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-5xl font-black">{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '-'}</span>
                            <div className="flex flex-col">
                                <div className="flex text-primary">
                                    {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined text-sm">star</span>)}
                                </div>
                                <span className="text-xs text-text-secondary">Based on {reviews.length} reviews</span>
                            </div>
                        </div>

                        {/* Review Form */}
                        {user ? (
                            <form onSubmit={handleReviewSubmit} className="bg-[#f8f8f6] dark:bg-[#1a160d] p-6 rounded-2xl border border-border-subtle">
                                <h3 className="font-bold mb-4">Share Your Taste</h3>
                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} type="button" onClick={() => setNewRating(s)} className={`material-symbols-outlined ${newRating >= s ? 'text-primary fill-current' : 'text-text-secondary/30'}`}>
                                            star
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    className="w-full bg-white dark:bg-[#252118] border border-border-subtle rounded-xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none min-h-[100px] mb-4"
                                    placeholder="Tell others about your Amai experience..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                />
                                <button type="submit" disabled={submittingReview} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#d9a610] transition-colors disabled:opacity-50">
                                    {submittingReview ? 'Sending feedback...' : 'Post Review'}
                                </button>
                            </form>
                        ) : (
                           <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
                               <p className="text-sm font-medium mb-4">You must be signed in to post a review.</p>
                               <Link to="/auth" className="text-primary font-bold text-sm underline">Sign In Now</Link>
                           </div>
                        )}
                    </div>

                    <div className="w-full lg:w-2/3 flex flex-col gap-10">
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className="pb-10 border-b border-border-subtle last:border-0">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex text-primary mb-1">
                                                {[...Array(review.rating)].map((_, i) => <span key={i} className="material-symbols-outlined text-[16px]">star</span>)}
                                            </div>
                                            <h4 className="font-bold text-lg">{review.user_name}</h4>
                                        </div>
                                        <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">{formatDate(review.created_at)}</span>
                                    </div>
                                    <p className="text-text-secondary dark:text-gray-300 leading-relaxed italic">"{review.comment}"</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-600 text-sm">verified_user</span>
                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Verified Connoisseur</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-border-subtle">
                                <span className="material-symbols-outlined text-5xl mb-4">rate_review</span>
                                <p className="font-medium">Be the first to share your thoughts on this artisan creation.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
