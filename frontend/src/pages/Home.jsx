import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../services/api';
import { formatCurrency } from '../lib/utils';

const Home = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await getProducts();
                setFeatured(data.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch featured products");
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">

            {/* Hero Section */}
            <div className="flex w-full flex-col">
                <div className="w-full h-[600px] md:h-[750px] relative overflow-hidden bg-stone-dark">
                    {/* Background Image with slow scale effect */}
                    <motion.div 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 6, ease: "easeOut" }}
                        className="absolute inset-0 z-0 bg-cover bg-center" 
                        data-alt="Dark stone surface with elegant matcha chocolates" 
                        style={{ backgroundImage: "url('/images/landing-backdrop.png')" }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-black/10"></div>
                    
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 md:px-20 max-w-[1280px] mx-auto w-full"
                    >
                        <motion.span variants={itemVariants} className="text-primary text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4 text-shadow-sm">Handcrafted by Amai</motion.span>
                        <motion.h1 variants={itemVariants} className="font-serif text-5xl md:text-7xl lg:text-[80px] font-black leading-[1.1] tracking-tight mb-6 max-w-4xl drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-[#fdf4d6] to-white">
                            The Art of <br />Japanese Chocolate
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-white/90 text-base md:text-lg max-w-xl font-medium leading-relaxed mb-10 drop-shadow-lg">
                            A harmonious blend of ceremonial matcha, rare criollo cacao, and the minimalist aesthetic of Zen. Experience the fleeting moment of perfection.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                            <Link to="/collections" className="flex items-center justify-center h-14 px-10 bg-primary hover:bg-[#d9a60f] hover:scale-105 hover:-translate-y-1 shadow-[0_0_20px_rgba(217,166,15,0.4)] text-charcoal text-sm font-black tracking-[0.2em] uppercase rounded-xl transition-all duration-300">
                                Shop Collections
                            </Link>
                            <Link to="/about" className="flex items-center justify-center h-14 px-10 bg-black/40 backdrop-blur-md hover:bg-black/60 hover:-translate-y-1 text-white border border-white/20 hover:border-white/40 text-sm font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300">
                                Our Story
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Philosophy Section */}
            <div className="w-full bg-background-light dark:bg-background-dark py-20 px-4 md:px-10">
                <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-16 items-start">
                    {/* Text Content */}
                    <div className="flex-1 flex flex-col gap-8 sticky top-24">
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-12 bg-primary"></div>
                            <span className="text-primary text-sm font-bold tracking-widest uppercase">Our Philosophy</span>
                        </div>
                        <h2 className="text-charcoal dark:text-off-white font-serif text-4xl md:text-5xl font-medium leading-tight">
                            Minimalist Perfection
                        </h2>
                        <p className="text-charcoal/70 dark:text-off-white/70 text-lg leading-relaxed font-light">
                            Every piece is a meditation on flavor, texture, and beauty. We believe in the purity of ingredients and the precision of craftsmanship. Our chocolates are not just sweets; they are an invitation to pause and appreciate the present moment.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="flex flex-col gap-3">
                                <span className="material-symbols-outlined text-primary text-[32px]">eco</span>
                                <h3 className="text-lg font-bold font-serif">Sourced in Japan</h3>
                                <p className="text-sm text-charcoal/60 dark:text-off-white/60">We partner exclusively with heritage tea farmers in Uji for our matcha and hojicha.</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="material-symbols-outlined text-primary text-[32px]">fingerprint</span>
                                <h3 className="text-lg font-bold font-serif">Master Craftsmanship</h3>
                                <p className="text-sm text-charcoal/60 dark:text-off-white/60">Decades of dedication to the art of tempering, molding, and finishing by hand.</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Grid */}
                    <div className="flex-1 w-full grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4 mt-12">
                            <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-stone-200">
                                <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" data-alt="Close up of matcha green tea powder texture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgbxevDy1sJLaCQcsZct__htlwIqK7IyPcNt5sR2v4UuzDIYFVaV3V4EgmbeOF0CNcwzhQC_Ve9opp4M9wDUTgAMwnf-ajFMKPpv91tfzu2lTX8FTKJkT3OydI0lpYk0Sjrjj5oXZhpEpOENscdCQdwE0CiWfGH6gG_TdLAaVQnJaKrS66zlQ1o4t3JQIiT13rVditY0TbhVgXu-BQ49yvwLygd0TW9mQE6K6NLb7id_0aePrn-w0jwCxgr4l8atMGNa0fh47wj4hk" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-stone-200">
                                <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" data-alt="Chocolatier pouring melted dark chocolate" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2kN1IH_uoeXuMKVW6bTs9HUbjvKkIuYbjU4_ujt_sB3-Col9DkgoTWrTKjuvwC_UcpkHK2OlGdxrQqfwgRRUUelK4C588vD8zDX0HKSmHVREvMGc0n5kICXyoHVwWh2lddDEslSCdsGLubIACCel1DpaN0WYXKC0jzqriylb2gwsEEzMbe6XbbOlQctpfwpks5bs6o7dLvpqkVFVWzwgMx4BzYudUX4_rIllG2zjuTlP--iIWvNT8XKON4hWCLiHwg04XBTt10Q5O" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Collections Header */}
            <div className="w-full bg-[#f4f3f0] dark:bg-stone-dark/30 py-20 px-4 md:px-10">
                <div className="max-w-[1280px] mx-auto flex flex-col gap-12">
                    <div className="flex flex-col items-center text-center gap-4">
                        <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Seasonal Offerings</span>
                        <h2 className="text-charcoal dark:text-off-white font-serif text-3xl md:text-4xl font-medium">Seasonal Collections</h2>
                        <div className="w-24 h-[1px] bg-primary/50"></div>
                    </div>

                    {/* Collection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full text-center py-20 text-primary">Loading seasonal treasures...</div>
                        ) : featured.map((product, idx) => (
                            <div key={product.id} className="group flex flex-col gap-4 bg-white dark:bg-background-dark p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <Link to={`/product/${product.id}`} className="w-full aspect-square overflow-hidden rounded-lg bg-[#f8f8f6] relative block">
                                    <img 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        src={product.image_url || "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800"} 
                                        alt={product.name}
                                    />
                                    {idx === 0 && <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-sm backdrop-blur-sm">Best Seller</div>}
                                    {idx === 2 && <div className="absolute top-3 left-3 bg-primary text-charcoal px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-sm">Seasonal</div>}
                                </Link>
                                <div className="flex flex-col gap-1 px-2 pb-2">
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="text-lg font-bold font-serif text-charcoal dark:text-off-white hover:text-primary transition-colors">{product.name}</h3>
                                    </Link>
                                    <p className="text-sm text-charcoal/60 dark:text-off-white/60 line-clamp-1">{product.description}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-base font-medium text-charcoal dark:text-off-white">{formatCurrency(product.price_cents)}</span>
                                        <Link to={`/product/${product.id}`} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                                            View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <Link to="/collections" className="inline-flex items-center justify-center h-12 px-8 border border-[#e6e3db] dark:border-stone-600 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white dark:hover:bg-white dark:hover:text-charcoal transition-all duration-300">
                            View All Collections
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
