import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser, registerUser, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userResponse;
            if (isLogin) {
                userResponse = await loginUser(email, password);
            } else {
                userResponse = await registerUser(fullName, email, password);
            }
            if (userResponse.user && !userResponse.user.flavorProfile) {
                navigate('/flavor-quiz');
            } else {
                navigate('/collections');
            }
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
            const userResponse = await loginWithGoogle();
            if (userResponse.user && !userResponse.user.flavorProfile) {
                navigate('/flavor-quiz');
            } else {
                navigate('/collections');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Google Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center py-20 px-4 sm:p-8 relative min-h-[80vh]">
            {/* Background decorative gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-[#897f61]/10 rounded-full blur-3xl"></div>
            </div>

            {/* Auth Card */}
            <div className="relative w-full max-w-[440px] bg-white dark:bg-[#1a160d] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-[#e6e3db] dark:border-[#3a3528]">

                {/* Header Section */}
                <div className="pt-10 pb-4 px-8 text-center">
                    <h1 className="text-[#181611] dark:text-white tracking-tight text-[28px] font-bold leading-tight mb-2">
                        {isLogin ? 'Welcome Back' : 'Join Zen Chocolatier'}
                    </h1>
                    <p className="text-[#897f61] dark:text-[#ada692] text-sm">Experience the art of Japanese chocolate crafting.</p>
                </div>

                {/* Tabs */}
                <div className="px-8 pb-6">
                    <div className="flex border-b border-[#e6e3db] dark:border-[#3a3528]">
                        <button
                            className={`flex-1 pb-3 pt-2 text-center border-b-[2px] font-bold text-sm tracking-[0.015em] transition-all ${isLogin ? 'border-[#ecb613] text-[#181611] dark:text-white' : 'border-transparent text-[#897f61] hover:text-[#181611] dark:text-[#ada692] dark:hover:text-white'}`}
                            onClick={() => { setIsLogin(true); setError(''); }}
                        >
                            Sign In
                        </button>
                        <button
                            className={`flex-1 pb-3 pt-2 text-center border-b-[2px] font-bold text-sm tracking-[0.015em] transition-all ${!isLogin ? 'border-[#ecb613] text-[#181611] dark:text-white' : 'border-transparent text-[#897f61] hover:text-[#181611] dark:text-[#ada692] dark:hover:text-white'}`}
                            onClick={() => { setIsLogin(false); setError(''); }}
                        >
                            Register
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form className="px-8 pb-8 flex flex-col gap-5" onSubmit={handleSubmit}>

                    {error && <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</div>}

                    {!isLogin && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#181611] dark:text-[#f4f3f0] uppercase tracking-wider ml-1" htmlFor="fullname">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#897f61]">
                                    <span className="material-symbols-outlined text-[20px]">person</span>
                                </div>
                                <input
                                    className="block w-full rounded-lg border border-[#e6e3db] dark:border-[#3a3528] bg-transparent dark:bg-[#221d10] text-[#181611] dark:text-white pl-10 pr-4 py-3 text-sm placeholder-[#897f61]/60 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                                    id="fullname"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    type="text"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#181611] dark:text-[#f4f3f0] uppercase tracking-wider ml-1" htmlFor="email">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#897f61]">
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                            </div>
                            <input
                                className="block w-full rounded-lg border border-[#e6e3db] dark:border-[#3a3528] bg-transparent dark:bg-[#221d10] text-[#181611] dark:text-white pl-10 pr-4 py-3 text-sm placeholder-[#897f61]/60 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                type="email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-[#181611] dark:text-[#f4f3f0] uppercase tracking-wider" htmlFor="password">Password</label>
                            {isLogin && <a className="text-xs font-medium text-[#897f61] hover:text-primary transition-colors" href="#">Forgot password?</a>}
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#897f61]">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </div>
                            <input
                                className="block w-full rounded-lg border border-[#e6e3db] dark:border-[#3a3528] bg-transparent dark:bg-[#221d10] text-[#181611] dark:text-white pl-10 pr-10 py-3 text-sm placeholder-[#897f61]/60 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                type="password"
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-col gap-4">
                        <button
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary hover:bg-[#d9a60e] transition-colors text-[#181611] text-sm font-bold leading-normal tracking-[0.015em] shadow-sm transform duration-100 disabled:opacity-50"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
                        </button>
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-[#e6e3db] dark:border-[#3a3528]"></div>
                            <span className="flex-shrink-0 mx-4 text-[#897f61] text-xs font-medium uppercase tracking-wide">Or continue with</span>
                            <div className="flex-grow border-t border-[#e6e3db] dark:border-[#3a3528]"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 rounded-lg border border-[#e6e3db] dark:border-[#3a3528] bg-transparent h-10 hover:bg-[#f8f8f6] dark:hover:bg-[#2a2415] transition-colors transform duration-100" type="button">
                                <span className="text-sm font-medium text-[#181611] dark:text-white">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-lg border border-[#e6e3db] dark:border-[#3a3528] bg-transparent h-10 hover:bg-[#f8f8f6] dark:hover:bg-[#2a2415] transition-colors transform duration-100" type="button">
                                <span className="text-sm font-medium text-[#181611] dark:text-white">Apple</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;
