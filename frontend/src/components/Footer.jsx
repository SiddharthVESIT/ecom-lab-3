import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-zen-surface-dark border-t border-zen-highlight dark:border-zen-highlight-dark py-12 px-6 md:px-10 mt-auto">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

                <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-zen-black dark:text-white">
                        <div className="size-6 text-primary">
                            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <span className="font-bold text-lg tracking-tight uppercase">Zen Chocolate</span>
                    </div>
                    <p className="text-zen-brown dark:text-gray-400 text-sm leading-relaxed">
                        Artistry in every bite. Experience the finest Japanese chocolates delivered to your door.
                    </p>
                </div>

                <div className="col-span-1">
                    <h4 className="text-zen-black dark:text-white font-bold mb-4">Shop</h4>
                    <ul className="flex flex-col gap-2 text-sm text-zen-brown dark:text-gray-400">
                        <li><Link to="/collections" className="hover:text-primary transition-colors">All Products</Link></li>
                        <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Best Sellers</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Gift Sets</a></li>
                    </ul>
                </div>

                <div className="col-span-1">
                    <h4 className="text-zen-black dark:text-white font-bold mb-4">About</h4>
                    <ul className="flex flex-col gap-2 text-sm text-zen-brown dark:text-gray-400">
                        <li><Link to="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
                    </ul>
                </div>

                <div className="col-span-1">
                    <h4 className="text-zen-black dark:text-white font-bold mb-4">Stay Updated</h4>
                    <p className="text-zen-brown dark:text-gray-400 text-sm mb-4">Subscribe for exclusive offers and new product alerts.</p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-zen-highlight dark:bg-zen-highlight-dark border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary text-zen-black dark:text-white placeholder-zen-brown/50"
                        />
                        <button className="bg-zen-black dark:bg-white text-white dark:text-black rounded-lg px-4 py-2 text-sm font-bold hover:bg-primary hover:text-black dark:hover:bg-primary dark:hover:text-black transition-colors">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-zen-highlight dark:border-zen-highlight-dark flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zen-brown dark:text-gray-500">
                <p>© 2026 Zen Chocolate. Handcrafted in Kyoto. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-zen-black dark:hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-zen-black dark:hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
