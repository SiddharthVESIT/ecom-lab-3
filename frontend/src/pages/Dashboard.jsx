import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyReferrals, verifyReferralCode, applyReferralCode } from '../services/api';
import { Link, Navigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Apply code state
    const [newCode, setNewCode] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verifyStatus, setVerifyStatus] = useState(null); // 'valid', 'invalid', 'error'
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchReferrals = async () => {
            try {
                const data = await getMyReferrals();
                setReferrals(data);
            } catch (err) {
                console.error("Failed to fetch referrals", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReferrals();
    }, [user]);

    if (!user) {
        return <Navigate to="/auth" />;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(user.referralCode || user.referral_code);
        alert('Referral link copied to clipboard!');
    };

    const handleVerifyAndApply = async () => {
        if (!newCode) return;
        
        setVerifying(true);
        try {
            const isValid = await verifyReferralCode(newCode);
            if (isValid) {
                setVerifyStatus('valid');
                setApplying(true);
                try {
                    await applyReferralCode(newCode);
                    alert("Referral code applied successfully! You earned 100 Beans.");
                    window.location.reload(); // Refresh to update points
                } catch (applyErr) {
                    alert(applyErr.response?.data?.message || 'Failed to apply code');
                    setVerifyStatus('error');
                } finally {
                    setApplying(false);
                }
            } else {
                setVerifyStatus('invalid');
            }
        } catch (err) {
            setVerifyStatus('error');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-10 py-10">
            <h1 className="text-4xl font-display font-black mb-8 text-text-main dark:text-white">My Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Actions */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    
                    {/* User Profile Card */}
                    <div className="bg-white dark:bg-[#1a160d] p-6 rounded-2xl border border-border-subtle shadow-sm flex flex-col items-center text-center">
                        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 relative mx-auto lg:mx-0">
                            <span className="text-3xl font-display font-black text-primary">
                                {user?.fullName?.charAt(0) || 'A'}
                            </span>
                            {(user?.isClubMember || user?.loyaltyPoints > 0 || user?.loyalty_points > 0) && (
                                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-[#15120a] rounded-full p-1 shadow-md border border-primary/20">
                                    <span className="material-symbols-outlined text-[20px] text-primary block">workspace_premium</span>
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-text-main dark:text-white mb-1">{user.fullName}</h2>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="text-text-secondary text-sm">{user.email}</span>
                            {(user?.isClubMember || user?.loyaltyPoints > 0 || user?.loyalty_points > 0) && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fdf4d6] dark:bg-[#252118] text-primary border border-primary/20 rounded text-[10px] uppercase tracking-widest font-black">
                                    Club Member
                                </span>
                            )}
                        </div>
                        
                        <div className="w-full bg-[#f4f3f0] dark:bg-[#252118] rounded-xl p-4 flex justify-between items-center border border-primary/20">
                            <span className="text-sm font-bold uppercase tracking-widest text-text-secondary">Loyalty Beans</span>
                            <span className="text-2xl font-black text-primary flex items-center gap-1">
                                <span className="material-symbols-outlined text-[20px]">stars</span>
                                {user.loyaltyPoints || user.loyalty_points || 0}
                            </span>
                        </div>
                    </div>

                    {/* Apply Referral Card */}
                    <div className="bg-white dark:bg-[#1a160d] p-6 rounded-2xl border border-border-subtle shadow-sm">
                        <h3 className="font-bold mb-3 flex items-center gap-2 text-text-main dark:text-white">
                            <span className="material-symbols-outlined text-primary">redeem</span>
                            Have a Referral Code?
                        </h3>
                        <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                            If you were referred by a friend, enter their code here to earn an instant <span className="font-bold text-primary">100 Beans</span>.
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={newCode}
                                onChange={(e) => { setNewCode(e.target.value.toUpperCase()); setVerifyStatus(null); }}
                                placeholder="e.g. VIP-GOLD"
                                className={`flex-1 border rounded-xl px-4 py-2 text-sm font-bold outline-none uppercase placeholder:font-normal
                                    ${verifyStatus === 'invalid' || verifyStatus === 'error' ? 'border-red-400 focus:border-red-500 bg-red-50' : 
                                    verifyStatus === 'valid' ? 'border-green-400 bg-green-50' : 
                                    'border-border-subtle focus:border-primary bg-transparent text-text-main dark:text-white'}`}
                            />
                            <button 
                                onClick={handleVerifyAndApply}
                                disabled={verifying || applying || !newCode}
                                className="bg-primary text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#d9a60e] disabled:opacity-50 transition-colors"
                            >
                                {verifying || applying ? 'verifying...' : 'Apply'}
                            </button>
                        </div>
                        {verifyStatus === 'invalid' && <p className="text-xs text-red-500 mt-2 font-bold">Invalid referral code.</p>}
                        {verifyStatus === 'error' && <p className="text-xs text-red-500 mt-2 font-bold">Could not apply code. You might have already used one.</p>}
                    </div>

                </div>

                {/* Right Column: Referral System Dashboard */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    
                    <div className="bg-white dark:bg-[#1a160d] rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-border-subtle bg-gradient-to-br from-[#f8f8f6] to-white dark:from-[#252118] dark:to-[#1a160d]">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-black font-display tracking-tight text-text-main dark:text-white mb-2">Refer a Connoisseur</h3>
                                    <p className="text-text-secondary text-sm">
                                        Share your unique code. When friends join and place an order, they receive beans, and you earn <span className="font-bold text-primary">200 Beans</span>.
                                    </p>
                                </div>
                                <div className="bg-[#f4f3f0] dark:bg-black/20 p-6 rounded-xl border border-dashed border-primary/40 text-center min-w-[200px]">
                                    <span className="text-xs font-bold text-text-secondary block mb-3 uppercase tracking-widest">Your Private Code</span>
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <span className="text-2xl font-black tracking-widest text-primary">{user.referralCode || user.referral_code || 'AMAI-USER'}</span>
                                        <button onClick={handleCopy} className="w-full py-2 bg-primary text-white font-bold rounded-xl text-sm shadow-md hover:shadow-primary/20 hover:-translate-y-1 transition-all">
                                            Copy Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-0">
                            <h4 className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary bg-[#fcfbf9] dark:bg-[#1f1a10] border-b border-border-subtle">
                                Your Referral Network ({referrals.length})
                            </h4>
                            
                            {loading ? (
                                <div className="p-8 text-center text-text-secondary text-sm font-medium">Loading your network...</div>
                            ) : referrals.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center">
                                    <span className="material-symbols-outlined text-5xl text-primary/20 mb-3">group_add</span>
                                    <p className="text-text-main dark:text-gray-300 font-bold mb-1">Your network is currently empty.</p>
                                    <p className="text-sm text-text-secondary">Be the first to introduce your friends to Amai.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-border-subtle">
                                    {referrals.map(ref => (
                                        <li key={ref.id} className="flex justify-between items-center p-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase">
                                                    {ref.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-main dark:text-white">{ref.full_name}</p>
                                                    <p className="text-xs text-text-secondary">{new Date(ref.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {ref.reward_granted ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded">
                                                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                        Rewarded
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded">
                                                        Pending Order
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
