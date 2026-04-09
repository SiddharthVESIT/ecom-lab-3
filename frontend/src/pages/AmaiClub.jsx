import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AmaiClub = () => {
    const benefits = [
        {
            title: "Early Access",
            desc: "Be the first to experience our limited seasonal collections 48 hours before general release.",
            icon: "priority_high"
        },
        {
            title: "Double Loyalty Beans",
            desc: "Earn 20 Beans for every ₹100 spent, accelerating your journey to exclusive rewards.",
            icon: "payments"
        },
        {
            title: "Connoisseur Pricing",
            desc: "Enjoy a permanent 15% reduction on all recurring subscription orders.",
            icon: "local_offer"
        },
        {
            title: "Monthly Tasting Box",
            desc: "Receive a curated selection of chef's choice truffles and bars delivered to your door.",
            icon: "card_giftcard"
        }
    ];

    return (
        <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#0f0d08]">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1548907040-4baa42d10919?w=1600" 
                        alt="Amai Club" 
                        className="w-full h-full object-cover opacity-20 dark:opacity-10 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fcfbf9] dark:to-[#0f0d08]"></div>
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4"
                    >
                        The Inner Circle
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-bold text-zen-black dark:text-white mb-6"
                    >
                        Amai Club
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-zen-brown dark:text-gray-400 font-light leading-relaxed"
                    >
                        Join our exclusive membership program designed for the true artisan chocolate enthusiast. 
                        Experience Amai like never before with unprecedented benefits and curated experiences.
                    </motion.p>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-10 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-[#1a160d] p-8 rounded-2xl border border-zen-highlight dark:border-zen-highlight-dark hover:shadow-xl transition-all group"
                        >
                            <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white transition-colors">
                                    {benefit.icon}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 dark:text-white">{benefit.title}</h3>
                            <p className="text-zen-brown dark:text-gray-400 text-sm leading-relaxed">
                                {benefit.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="bg-zen-black dark:bg-[#15120a] rounded-[2rem] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8 italic">
                        Ready to elevate your palate?
                    </h2>
                    <p className="text-gray-400 mb-10 max-w-lg mx-auto">
                        Membership is currently open for a limited time. Join the club and start earning Double Beans today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            to="/auth" 
                            className="h-14 px-10 bg-primary hover:bg-[#d9a610] text-white rounded-xl font-bold flex items-center justify-center transition-all transform hover:scale-105"
                        >
                            Join The Club
                        </Link>
                        <Link 
                            to="/collections" 
                            className="h-14 px-10 border border-white/20 text-white hover:bg-white hover:text-black rounded-xl font-bold flex items-center justify-center transition-all"
                        >
                            Explore Collections
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer space */}
            <div className="h-20"></div>
        </div>
    );
};

export default AmaiClub;
