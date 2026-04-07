import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { addToCart } from '../services/api';
import { formatCurrency } from '../lib/utils';

const ProductCard = ({ product }) => {

    const [isAdded, setIsAdded] = React.useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            await addToCart(product.id || product.productId, 1);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error) {
            alert('Please login first to add items to the cart');
        }
    };

    const priceFormatted = formatCurrency(product.price_cents || 0);

    // Fallback image based on original design if none provided
    const imgUrl = product.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDzHHhfmn6c1JAiE55YwrYMvYgDoD5uJXWgALrwfDrnAFNbxVf7tFBFIS7oZT-v21c7BEt0tB9AOiP2dNa0Zlr9SvC_8db5bnT5S6lPepaoI_etb4H49IlQUzzOUQs0Aznu_E7_kh19l4B7nS_I5IYGReY8crm5DzzkZeXU7ntuxBpSrKefBs8qPflIj-yOxP_A1XPEhVQ0eU7c5ZzJ8UYbfmHQVe_ElrcD9AwSMl12AY1GUDO334okWrhrnI-ZLe7u9BcJZpmeJWGx";

    return (
        <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group flex flex-col gap-4 h-full"
        >
            <Link to={`/product/${product.id}`} className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 block">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url("${imgUrl}")` }}
                ></div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="size-8 bg-white/90 dark:bg-black/60 rounded-full flex items-center justify-center text-zen-black dark:text-white hover:bg-primary hover:text-black transition-colors" onClick={(e) => { e.preventDefault() }}>
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`w-full h-10 font-bold text-sm rounded-lg shadow-lg flex items-center justify-center transition-colors duration-300 ${isAdded ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-primary'}`}
                        onClick={handleAddToCart}
                    >
                        {isAdded ? (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">check</span> Added
                            </motion.span>
                        ) : (
                            <span>Quick Add</span>
                        )}
                    </motion.button>
                </div>
            </Link>
            <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <h3 className="text-zen-black dark:text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-zen-black dark:text-white text-lg font-bold">{priceFormatted}</p>
                </div>
                <p className="text-zen-brown dark:text-gray-400 text-sm mt-1 line-clamp-2">
                    {product.description}
                </p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
