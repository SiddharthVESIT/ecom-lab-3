import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/utils';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, loginUser, registerUser, loginWithGoogle, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await loginUser(email, password);
            } else {
                await registerUser(fullName, email, password, referralCode);
            }
            navigate('/collections');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/collections');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Google Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        // Loyalty Tier Logic
        const points = user.loyaltyPoints || 0;
        let tier = 'Bronze Connoisseur';
        let tierColor = 'text-zen-brown';
        let tierBg = 'bg-zen-brown/10';
        
        if (points >= 5000) {
            tier = 'Gold Sovereign';
            tierColor = 'text-primary';
            tierBg = 'bg-primary/10';
        } else if (points >= 1000) {
            tier = 'Silver Artisan';
            tierColor = 'text-gray-400';
            tierBg = 'bg-gray-400/10';
        }

        return (
            <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 flex-grow">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-text-main dark:text-white mb-2">My Amai Dashboard</h1>
                            <p className="text-text-secondary">Welcome back, <span className="text-text-main dark:text-white font-bold">{user.fullName}</span></p>
                        </div>
                        <div className="flex gap-4">
                            <Link to="/orders" className="px-6 py-2 border border-border-subtle rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Order History</Link>
                            <button onClick={logout} className="px-6 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">Sign Out</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Loyalty Card */}
                        <div className="lg:col-span-2 bg-[#1a160d] text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <span className="material-symbols-outlined text-[120px]">stars</span>
                            </div>
                            <div className="relative z-10">
                                <div className={`inline-block px-3 py-1 rounded-full ${tierBg} ${tierColor} text-[10px] font-black uppercase tracking-widest mb-4`}>
                                    {tier} Member
                                </div>
                                <h2 className="text-sm font-medium opacity-60 mb-1">Your Loyalty Balance</h2>
                                <div className="flex items-end gap-3 mb-8">
                                    <span className="text-6xl font-black text-primary">{points}</span>
                                    <span className="text-lg font-bold opacity-80 mb-2">Amai Beans</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold opacity-60 uppercase">Next Reward Progress</span>
                                        <span className="text-xs font-bold text-primary">{points % 1000} / 1000</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(points % 1000) / 10}%` }}></div>
                                    </div>
                                    <p className="text-[10px] opacity-40 mt-3 font-medium italic">Every 1000 beans grants a ₹100 instant reward voucher.</p>
                                </div>
                            </div>
                        </div>

                        {/* Referral Sidebar */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white dark:bg-[#1a160d] border border-border-subtle p-6 rounded-3xl shadow-sm">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">share</span>
                                    Share the Amai Experience
                                </h3>
                                {/* Referral Section (To be moved to Dashboard) */}
                                <div className="mb-10 text-center">
                                    <h3 className="text-sm font-bold text-zen-black dark:text-white uppercase tracking-widest mb-4">Refer a Friend</h3>
                                    <div className="inline-block bg-[#f4f3f0] dark:bg-[#252118] p-4 rounded-xl border border-dashed border-primary/40 text-center">
                                        <span className="text-xs font-bold text-text-secondary block mb-1 uppercase tracking-widest">Your Code</span>
                                        <span className="text-2xl font-black tracking-widest text-primary">{user.referralCode || user.referral_code || 'AMAI-USER'}</span>
                                    </div>
                                    <p className="text-sm text-text-secondary mt-3">Share this code with friends. They get a gift, you earn beans.</p>
                                </div>
                                <button onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(user.referralCode || user.referral_code); alert('Link Copied to clipboard!'); }} className="w-full mt-4 py-3 bg-primary hover:-translate-y-1 text-white font-bold rounded-xl text-sm shadow-lg hover:shadow-primary/20 transition-all">Copy Link</button>
                            </div>

                            <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
                                <h3 className="font-bold text-sm mb-3">Flavor Profile</h3>
                                {user.flavorProfile ? (
                                    <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                                        {Object.entries(user.flavorProfile).map(([k, v]) => (
                                            <span key={k} className="px-2 py-1 bg-white dark:bg-black/20 rounded-md border border-primary/10 capitalize">
                                                {v}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <Link to="/flavor-quiz" className="text-xs text-primary font-bold underline">Discover your profile →</Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center py-20 px-4 sm:p-8 relative min-h-[80vh]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-[#897f61]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-[440px] bg-white dark:bg-[#1a160d] rounded-2xl shadow-xl overflow-hidden border border-border-subtle">
                <div className="pt-12 pb-6 px-10 text-center">
                    <h1 className="text-4xl font-black font-display tracking-tight text-text-main mb-2">
                        {isLogin ? 'Welcome Back' : 'Create an Account'}
                    </h1>
                    <p className="text-text-secondary leading-relaxed max-w-sm mx-auto 2xl:mx-0">
                        {isLogin 
                            ? "Sign in to access your curated selections, track orders, and view your loyalty beans."
                            : "Join the Amai society. Earn loyalty beans with every purchase and enjoy exclusive access to limited drops."}
                    </p>
                </div>

                <div className="px-10 pb-6">
                    <div className="flex border-b border-border-subtle">
                        <button
                            className={`flex-1 pb-3 text-center border-b-2 font-bold text-sm tracking-wide transition-all ${isLogin ? 'border-primary text-text-main dark:text-white' : 'border-transparent text-text-secondary'}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Sign In
                        </button>
                        <button
                            className={`flex-1 pb-3 text-center border-b-2 font-bold text-sm tracking-wide transition-all ${!isLogin ? 'border-primary text-text-main dark:text-white' : 'border-transparent text-text-secondary'}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Create Account
                        </button>
                    </div>
                </div>

                <form className="px-10 pb-10 flex flex-col gap-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-xs text-center bg-red-50 p-2 rounded-lg font-medium">{error}</div>}

                    {!isLogin && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                className="w-full rounded-xl border border-border-subtle bg-transparent p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Kenzo Tange"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
                        <input
                            className="w-full rounded-xl border border-border-subtle bg-transparent p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@artisan.co"
                            type="email"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Password</label>
                        <input
                            className="w-full rounded-xl border border-border-subtle bg-transparent p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            type="password"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Referral Code (Optional)</label>
                            <input
                                className="w-full rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm focus:border-primary outline-none text-primary font-bold placeholder-primary/30"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                placeholder="GIFT-FROM-FRIEND"
                            />
                        </div>
                    )}

                    <div className="pt-2 flex flex-col gap-4">
                        <button
                            className="w-full bg-primary hover:bg-[#d9a60e] text-white h-12 rounded-xl font-bold text-sm shadow-lg transition-all disabled:opacity-50"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Register')}
                        </button>
                        <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 rounded-xl border border-border-subtle h-12 hover:bg-gray-50 transition-colors" type="button">
                            <span className="text-sm font-bold">Continue with Google</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;
