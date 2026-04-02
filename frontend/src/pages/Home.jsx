import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">

            {/* Hero Section */}
            <div className="flex w-full flex-col">
                <div className="w-full h-[600px] md:h-[750px] relative overflow-hidden bg-stone-dark">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0 bg-cover bg-center" data-alt="Dark stone surface with handcrafted luxury chocolates arranged artistically" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBY9S11KXRh0MKo6FrudrhmW5TeyNLKDzYru4_e_Q5SR-8VtiGcEGUPpafzbcEHaLfPjREnoZ3Cw2_pzK4nabt33PtiGK2KE4zG0joq8ZdI-fcm711RQoeVKW4v-v3EuzHRnTCMBoZ1t7Xg5j3z89Hxq8KmkLwro3iWWmLoMzTuOy_6bgjkDiJk-Hv6s5o2bnM3K--KrGKFanRjcs2-JrILuSM6_6bsiTL6zj95d6Whdl9_GNv9pstQYRkGkNDXBJ_KuhL7VKsv6Y5Z')" }}>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 md:px-20 max-w-[1280px] mx-auto w-full">
                        <span className="text-primary text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4 animate-fade-in">Handcrafted by Amai</span>
                        <h1 className="text-white font-serif text-5xl md:text-7xl font-light leading-tight tracking-tight mb-6 max-w-4xl">
                            The Art of <br />Japanese Chocolate
                        </h1>
                        <p className="text-white/80 text-base md:text-lg max-w-xl font-light leading-relaxed mb-10">
                            A harmonious blend of ceremonial matcha, rare criollo cacao, and the minimalist aesthetic of Zen. Experience the fleeting moment of perfection.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/collections" className="flex items-center justify-center h-12 px-8 bg-primary hover:bg-[#d9a60f] text-charcoal text-sm font-bold tracking-widest uppercase rounded-lg transition-colors duration-300">
                                Shop Collections
                            </Link>
                            <Link to="/about" className="flex items-center justify-center h-12 px-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 text-sm font-bold tracking-widest uppercase rounded-lg transition-colors duration-300">
                                Our Story
                            </Link>
                        </div>
                    </div>
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
                        {/* Card 1 */}
                        <div className="group flex flex-col gap-4 bg-white dark:bg-background-dark p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <Link to="/product/1" className="w-full aspect-square overflow-hidden rounded-lg bg-[#f8f8f6] relative block">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Assorted artisanal truffles in a box" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsOa3Omdx5NSo8h_qU-qSXMe3Fd134Mzw4CMk2gQprz8OMU_X5qy7CP_zL_aF8lX1d_hLwW-Zug3YOB4JcO8kuluuHdy6jJ8xsuXoWjQ4V9jD-NsFGLFFVifq7ehGMUCkiOKl-VzvFKFX7nfia5Bo2EjTcENn6gCnEz2O3sbKQ5znuwJz7bkOfqtt3SI42xo8bo88Q4gbAd3PiRf3oI3X6pJ7Me-kTlVu6Fk_gNj1E_i3zkZhmb91mishm-NfkyEeA0kJU7MfVZMjH" />
                                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-sm backdrop-blur-sm">Best Seller</div>
                            </Link>
                            <div className="flex flex-col gap-1 px-2 pb-2">
                                <Link to="/product/1">
                                    <h3 className="text-lg font-bold font-serif text-charcoal dark:text-off-white hover:text-primary transition-colors">The Signature Box</h3>
                                </Link>
                                <p className="text-sm text-charcoal/60 dark:text-off-white/60">12pc Assortment of Matcha, Yuzu, and Sake.</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-base font-medium text-charcoal dark:text-off-white">$48.00</span>
                                    <Link to="/product/1" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                                        View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group flex flex-col gap-4 bg-white dark:bg-background-dark p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <Link to="/product/2" className="w-full aspect-square overflow-hidden rounded-lg bg-[#f8f8f6] relative block">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Matcha chocolate squares stacked elegantly" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzHHhfmn6c1JAiE55YwrYMvYgDoD5uJXWgALrwfDrnAFNbxVf7tFBFIS7oZT-v21c7BEt0tB9AOiP2dNa0Zlr9SvC_8db5bnT5S6lPepaoI_etb4H49IlQUzzOUQs0Aznu_E7_kh19l4B7nS_I5IYGReY8crm5DzzkZeXU7ntuxBpSrKefBs8qPflIj-yOxP_A1XPEhVQ0eU7c5ZzJ8UYbfmHQVe_ElrcD9AwSMl12AY1GUDO334okWrhrnI-ZLe7u9BcJZpmeJWGx" />
                            </Link>
                            <div className="flex flex-col gap-1 px-2 pb-2">
                                <Link to="/product/2">
                                    <h3 className="text-lg font-bold font-serif text-charcoal dark:text-off-white hover:text-primary transition-colors">Amai Matcha Nama</h3>
                                </Link>
                                <p className="text-sm text-charcoal/60 dark:text-off-white/60">Silky ganache made with premium Uji matcha.</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-base font-medium text-charcoal dark:text-off-white">$32.00</span>
                                    <Link to="/product/2" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                                        View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group flex flex-col gap-4 bg-white dark:bg-background-dark p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <Link to="/product/3" className="w-full aspect-square overflow-hidden rounded-lg bg-[#f8f8f6] relative block">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Pink sakura chocolate bar with dried petals" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh3uTjQT4fMJzXLCntewWDHJXrzsNg9Wza85T4o5qmJ_LHVKtEbATGMFSPYOcM8-V68U-SnLCFO4FkgjQ7BplVbqhj1ftU10_H873vVuUm1SpbrSDUQ-MS7FUHhmDk5bFjETOyx_PeL6CHnfBdcRAVYzlvXNpHdO4iuLj7o7xWtA24ERZX0ciAP2NmbrBez6K9B8fNELWjJXC0sw_gmTKzabT2zL2K0bX949qKJCuR3DKO9WoV-zm-bIHcpMfX6if96ZpNmNWgFepg" />
                                <div className="absolute top-3 left-3 bg-primary text-charcoal px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-sm">Seasonal</div>
                            </Link>
                            <div className="flex flex-col gap-1 px-2 pb-2">
                                <Link to="/product/3">
                                    <h3 className="text-lg font-bold font-serif text-charcoal dark:text-off-white hover:text-primary transition-colors">Sakura Blossom</h3>
                                </Link>
                                <p className="text-sm text-charcoal/60 dark:text-off-white/60">White chocolate infused with salted cherry blossoms.</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-base font-medium text-charcoal dark:text-off-white">$24.00</span>
                                    <Link to="/product/3" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                                        View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
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
