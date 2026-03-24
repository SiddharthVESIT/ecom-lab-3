import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateFlavorProfile } from '../services/api';

const profiles = [
    {
        id: 'Earthy',
        title: 'Earthy & Mature',
        description: 'You appreciate the deep, roasted notes of Matcha, Hojicha, and the subtle umami of Miso.',
        icon: 'eco'
    },
    {
        id: 'Adventurous',
        title: 'Adventurous & Bold',
        description: 'You seek exciting and unique flavors like sharp Yuzu citrus and the gentle kick of Wasabi.',
        icon: 'explore'
    },
    {
        id: 'Sweet',
        title: 'Sweet & Traditional',
        description: 'You love the classic, comforting sweetness of Sakura, rich Praline, and Caramel.',
        icon: 'favorite'
    }
];

const FlavorQuiz = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [saving, setSaving] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!selectedId) return;
        setSaving(true);
        try {
            await updateFlavorProfile(selectedId);
            // Updating local context isn't strictly necessary if it re-fetches, but we can just redirect
            navigate('/collections');
        } catch (error) {
            console.error('Failed to update flavor profile:', error);
            setSaving(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center py-20 px-4 sm:p-8 relative min-h-[80vh]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-[#897f61]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-[600px] bg-white dark:bg-[#1a160d] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-[#e6e3db] dark:border-[#3a3528] p-8">
                <div className="text-center mb-8">
                    <h1 className="text-[#181611] dark:text-white tracking-tight text-[28px] font-bold leading-tight mb-2">
                        Welcome, {user?.fullName || 'Guest'}!
                    </h1>
                    <p className="text-[#897f61] dark:text-[#ada692] text-sm">
                        To curate the perfect chocolate experience for you, tell us about your palate.
                    </p>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                    {profiles.map(profile => (
                        <div 
                            key={profile.id}
                            onClick={() => setSelectedId(profile.id)}
                            className={`cursor-pointer border p-4 rounded-xl flex items-start gap-4 transition-all ${
                                selectedId === profile.id 
                                ? 'border-[#ecb613] bg-[#ecb613]/10' 
                                : 'border-[#e6e3db] dark:border-[#3a3528] bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-[32px] mt-1 ${selectedId === profile.id ? 'text-[#ecb613]' : 'text-[#897f61]'}`}>
                                {profile.icon}
                            </span>
                            <div>
                                <h3 className={`font-bold mb-1 ${selectedId === profile.id ? 'text-[#181611] dark:text-white' : 'text-[#181611] dark:text-[#f4f3f0]'}`}>
                                    {profile.title}
                                </h3>
                                <p className="text-sm text-[#897f61] dark:text-[#ada692] leading-snug">
                                    {profile.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!selectedId || saving}
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary hover:bg-[#d9a60e] transition-colors text-[#181611] text-sm font-bold leading-normal tracking-[0.015em] shadow-sm disabled:opacity-50"
                >
                    {saving ? 'Curating your collection...' : 'Discover My Chocolates'}
                </button>
            </div>
        </div>
    );
};

export default FlavorQuiz;
