import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-zen-surface-dark/95 backdrop-blur-sm border-b border-zen-highlight dark:border-zen-highlight-dark transition-colors duration-300">
            <div className="px-6 md:px-10 py-3 max-w-[1440px] mx-auto flex items-center justify-between">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-4 text-zen-black dark:text-white hover:opacity-80 transition-opacity">
                    <div className="size-8 text-primary">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h2 className="text-zen-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">Zen Chocolatier</h2>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex flex-1 justify-center gap-8 items-center">
                    <Link to="/" className="text-zen-black dark:text-gray-200 hover:text-primary transition-colors text-sm font-medium">Home</Link>
                    <Link to="/collections" className="text-zen-black dark:text-gray-200 hover:text-primary transition-colors text-sm font-medium">Shop</Link>
                    <Link to="/about" className="text-zen-black dark:text-gray-200 hover:text-primary transition-colors text-sm font-medium">About</Link>
                    <Link to="/orders" className="text-zen-black dark:text-gray-200 hover:text-primary transition-colors text-sm font-medium">Orders</Link>
                </nav>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Link to="/auth" className="hidden sm:flex min-w-[84px] h-10 px-4 bg-primary hover:bg-yellow-500 text-zen-black text-sm font-bold items-center justify-center rounded-lg transition-colors">
                        Sign In
                    </Link>
                    <button className="hidden sm:flex size-10 items-center justify-center rounded-lg bg-zen-highlight dark:bg-zen-highlight-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-zen-black dark:text-white">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </button>

                    <Link to="/auth" className="sm:hidden flex size-10 items-center justify-center rounded-lg bg-zen-highlight dark:bg-zen-highlight-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-zen-black dark:text-white">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                    </Link>

                    <Link to="/checkout" className="flex size-10 items-center justify-center rounded-lg bg-zen-highlight dark:bg-zen-highlight-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-zen-black dark:text-white relative">
                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                        <span className="absolute top-2 right-2 size-2 bg-primary rounded-full"></span>
                    </Link>

                    <button
                        className="md:hidden flex size-10 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-zen-surface-dark border-b border-zen-highlight dark:border-zen-highlight-dark flex flex-col shadow-lg z-50">
                    <Link to="/" className="px-6 py-4 border-b border-zen-highlight dark:border-zen-highlight-dark text-zen-black dark:text-white hover:text-primary dark:hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link to="/collections" className="px-6 py-4 border-b border-zen-highlight dark:border-zen-highlight-dark text-zen-black dark:text-white hover:text-primary dark:hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                    <Link to="/about" className="px-6 py-4 border-b border-zen-highlight dark:border-zen-highlight-dark text-zen-black dark:text-white hover:text-primary dark:hover:text-primary" onClick={() => setMobileMenuOpen(false)}>About</Link>
                    <Link to="/orders" className="px-6 py-4 border-b border-zen-highlight dark:border-zen-highlight-dark text-zen-black dark:text-white hover:text-primary dark:hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
                    <Link to="/auth" className="px-6 py-4 text-zen-black dark:text-white hover:text-primary dark:hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Profile / Auth</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
