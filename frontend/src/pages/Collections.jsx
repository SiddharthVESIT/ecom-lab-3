import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { getProducts, getProfile } from '../services/api';

import { useAuth } from '../context/AuthContext';

const Collections = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category') || '';

    const [products, setProducts] = useState([]);
    const [userFlavor, setUserFlavor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('featured');
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let currentFlavor = null;
                if (user) {
                    try {
                        const profileData = await getProfile();
                        currentFlavor = profileData.flavor_profile;
                        setUserFlavor(currentFlavor);
                    } catch (profileErr) {
                        console.warn("Could not fetch user profile flavor, proceeding without flavor sorting.", profileErr);
                    }
                }
                const data = await getProducts(categoryQuery, currentFlavor);
                setProducts(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryQuery, user]);

    const setCategory = (category) => {
        if (category) {
            setSearchParams({ category });
        } else {
            setSearchParams({});
        }
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'price-low') return a.price_cents - b.price_cents;
        if (sortOrder === 'price-high') return b.price_cents - a.price_cents;
        
        // Backend already handles flavor-based sorting when userFlavor is passed
        return 0;
    });

    return (
        <div className="flex-grow flex flex-col items-center w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">

            {/* Page Heading */}
            <div className="w-full max-w-[1200px] mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-zen-black dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">The Signature Collection</h1>
                        <p className="text-zen-brown dark:text-gray-400 text-base md:text-lg font-normal leading-normal max-w-2xl">
                            Handcrafted artisanal chocolates blending Japanese precision with global flavors. Experience the harmony of taste and texture.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zen-brown dark:text-gray-400">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="text-zen-black dark:text-white font-medium">Shop</span>
                    </div>
                </div>
            </div>

            {/* Filters / Chips */}
            <div className="w-full max-w-[1200px] mb-10 sticky top-[72px] z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur py-4 -mx-4 px-4 border-b border-transparent md:border-none flex justify-between items-center">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide max-w-[80%] md:max-w-none">
                    <span className="text-sm font-bold text-zen-black dark:text-white mr-2">Filter by:</span>

                    <button
                        onClick={() => setCategory('')}
                        className={`group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all shadow-sm ${!categoryQuery ? 'bg-zen-black text-white' : 'bg-zen-highlight dark:bg-zen-highlight-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-zen-black dark:text-white'}`}
                    >
                        <span className="text-sm font-medium">All Products</span>
                    </button>

                    <button
                        onClick={() => setCategory('signature_bonbons')}
                        className={`group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all shadow-sm ${categoryQuery === 'signature_bonbons' ? 'bg-zen-black text-white' : 'bg-zen-highlight dark:bg-zen-highlight-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-zen-black dark:text-white'}`}
                    >
                        <span className="text-sm font-medium">Signature Bonbons</span>
                    </button>

                    <button
                        onClick={() => setCategory('bars')}
                        className={`group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all shadow-sm ${categoryQuery === 'bars' ? 'bg-zen-black text-white' : 'bg-zen-highlight dark:bg-zen-highlight-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-zen-black dark:text-white'}`}
                    >
                        <span className="text-sm font-medium">Bars</span>
                    </button>

                    <button
                        onClick={() => setCategory('hampers')}
                        className={`group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all shadow-sm ${categoryQuery === 'hampers' ? 'bg-zen-black text-white' : 'bg-zen-highlight dark:bg-zen-highlight-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-zen-black dark:text-white'}`}
                    >
                        <span className="text-sm font-medium">Hampers</span>
                    </button>

                </div>

                {/* Sort moved OUTSIDE the overflow-x-auto container */}
                <div className="hidden md:flex flex-col items-end relative ml-4">
                    <button 
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-1 text-sm font-bold text-zen-black dark:text-white pb-3 md:pb-0"
                    >
                        <span className="text-zen-brown dark:text-gray-400 font-normal mr-1">Sort by:</span>
                        {sortOrder === 'featured' ? 'Featured' : sortOrder === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'} 
                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </button>
                    
                    {isSortOpen && (
                        <div className="absolute top-[100%] right-0 lg:mt-2 w-48 bg-white dark:bg-[#1a160d] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-5px_rgba(0,0,0,0.5)] border border-[#e6e3db] dark:border-[#3a3528] py-2 z-[60] origin-top-right animate-fade-in">
                            <button onClick={() => { setSortOrder('featured'); setIsSortOpen(false); }} className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${sortOrder === 'featured' ? 'bg-[#f4f3f0] dark:bg-[#2a2415] font-bold text-primary' : 'text-[#897f61] hover:bg-black/5 dark:hover:bg-white/5'}`}>Featured</button>
                            <button onClick={() => { setSortOrder('price-low'); setIsSortOpen(false); }} className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${sortOrder === 'price-low' ? 'bg-[#f4f3f0] dark:bg-[#2a2415] font-bold text-primary' : 'text-[#897f61] hover:bg-black/5 dark:hover:bg-white/5'}`}>Price: Low to High</button>
                            <button onClick={() => { setSortOrder('price-high'); setIsSortOpen(false); }} className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${sortOrder === 'price-high' ? 'bg-[#f4f3f0] dark:bg-[#2a2415] font-bold text-primary' : 'text-[#897f61] hover:bg-black/5 dark:hover:bg-white/5'}`}>Price: High to Low</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="w-full max-w-[1200px] py-20 flex justify-center text-primary">
                    Loading mastercrafted chocolates...
                </div>
            ) : error ? (
                <div className="w-full max-w-[1200px] py-10 text-red-500">
                    {error}
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
                >
                    {sortedProducts.map((product, index) => (
                        <motion.div 
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                    {/* Fallback if no products */}
                    {products.length === 0 && (
                        <div className="col-span-full text-center text-zen-brown/50 py-10">
                            No products available at the moment.
                        </div>
                    )}
                </motion.div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && (
                <div className="mt-20 w-full flex justify-center">
                    <div className="flex items-center gap-2">
                        <button className="flex size-10 items-center justify-center rounded-lg hover:bg-zen-highlight dark:hover:bg-zen-highlight-dark transition-colors text-zen-black dark:text-white disabled:opacity-50">
                            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
                        </button>
                        <button className="text-sm font-bold leading-normal flex size-10 items-center justify-center text-zen-black bg-primary rounded-lg shadow-sm">1</button>
                        <button className="flex size-10 items-center justify-center rounded-lg hover:bg-zen-highlight dark:hover:bg-zen-highlight-dark transition-colors text-zen-black dark:text-white">
                            <span className="material-symbols-outlined text-[20px]">arrow_forward_ios</span>
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Collections;
