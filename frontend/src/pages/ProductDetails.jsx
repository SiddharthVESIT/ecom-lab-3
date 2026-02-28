import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, addToCart } from '../services/api';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            await addToCart(product.id, quantity);
            alert('Product added to cart!');
        } catch (err) {
            alert('Failed to add to cart. Please log in.');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-primary">Loading details...</div>;
    if (!product) return <div className="py-20 text-center">Product not found.</div>;

    const priceFormatted = product.price_cents
        ? `$${(product.price_cents / 100).toFixed(2)}`
        : '$0.00';

    const imgUrl = product.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAlFDsHr5u2h3uQg9HlSuXzg16R32UrhFlQW8h8B6wOW30MFW9XVCdWhWP8kG1yO6yH3Ap1dlU7Tjl8T88B-aCTc0N4zYdLheG4gGxfwT6kN3dP1sD_a_h_bbV8fsTCumUjgT8vkI9UWlYmxescMU224-J7P1GqsxpkePq0U0Iwl0BDUxx4SYV7P6cAy58aR4GMZDvDq_RK2GYQRsqqsWkJuf2bjyfeSThbAdZR2VizUQ4jrz-sW05Z_pnWSH8PymEaPAh1a_9LTUAx";

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
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Editor's Pick</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <button className="aspect-square rounded-lg overflow-hidden border-2 border-primary cursor-pointer relative">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${imgUrl}")` }}></div>
                        </button>
                        <button className="aspect-square rounded-lg overflow-hidden border border-transparent hover:border-primary/50 cursor-pointer relative flex items-center justify-center bg-[#f4f3f0] dark:bg-[#3a3424]">
                            <span className="material-symbols-outlined text-text-secondary text-3xl">play_circle</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-primary font-bold tracking-wider text-xs uppercase">{product.category}</span>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-primary text-[18px]">star</span>
                            <span className="text-text-main dark:text-white font-bold text-sm">4.9</span>
                        </div>
                    </div>
                    <h1 className="text-text-main dark:text-white text-4xl lg:text-5xl font-bold font-display leading-tight mb-4">{product.name}</h1>
                    <p className="text-2xl text-text-main dark:text-white font-medium mb-6">{priceFormatted}</p>
                    <p className="text-text-secondary dark:text-gray-300 text-lg leading-relaxed mb-8 font-light">
                        {product.description}
                    </p>

                    {/* Add to Cart */}
                    <div className="flex flex-wrap gap-4 mb-10">
                        <div className="flex items-center border border-border-subtle dark:border-[#4a4230] rounded-lg h-14 w-32 bg-white dark:bg-background-dark">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-full flex items-center justify-center text-text-secondary hover:text-text-main dark:hover:text-white"
                            >
                                <span className="material-symbols-outlined text-[20px]">remove</span>
                            </button>
                            <input
                                className="w-full h-full text-center border-none bg-transparent focus:ring-0 text-text-main dark:text-white font-bold text-lg"
                                readOnly
                                value={quantity}
                            />
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-full flex items-center justify-center text-text-secondary hover:text-text-main dark:hover:text-white"
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="flex-1 min-w-[200px] h-14 bg-primary hover:bg-[#d9a610] text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>

                        <Link
                            to="/checkout"
                            className="w-full sm:w-auto h-14 px-8 border-2 border-primary text-primary hover:bg-primary/5 rounded-lg font-bold text-lg transition-all flex items-center justify-center"
                        >
                            Go to Cart
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border-subtle dark:border-[#3a3424] mb-10">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="size-10 rounded-full bg-[#f4f3f0] dark:bg-[#3a3424] flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">eco</span>
                            </div>
                            <span className="text-xs font-semibold text-text-main dark:text-gray-200">100% Organic</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="size-10 rounded-full bg-[#f4f3f0] dark:bg-[#3a3424] flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">local_shipping</span>
                            </div>
                            <span className="text-xs font-semibold text-text-main dark:text-gray-200">Express Post</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="size-10 rounded-full bg-[#f4f3f0] dark:bg-[#3a3424] flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">verified</span>
                            </div>
                            <span className="text-xs font-semibold text-text-main dark:text-gray-200">Artisan Made</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
