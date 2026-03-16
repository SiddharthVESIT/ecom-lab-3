import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { downloadInvoice } from '../services/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!orderId) return;
        setIsDownloading(true);
        try {
            const blob = await downloadInvoice(orderId);
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading invoice:", error);
            alert("Failed to download invoice. Please try again later.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex-1 flex justify-center items-center w-full px-6 py-20 lg:px-20 lg:py-24 bg-[#f8f8f6] dark:bg-[#0c0a05]">
            <div className="max-w-md w-full bg-white dark:bg-[#1a160c] p-8 md:p-12 rounded-2xl shadow-sm border border-[#e6e4dd] dark:border-[#3a3528] text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                
                <h1 className="text-3xl font-black mb-2 text-[#181611] dark:text-[#f4f3f0]">Payment Successful!</h1>
                <p className="text-[#897f61] mb-8">
                    Your order <span className="font-bold">#{orderId}</span> has been confirmed and is being processed.
                </p>

                <button 
                    onClick={handleDownload}
                    disabled={isDownloading || !orderId}
                    className="w-full h-12 mb-4 bg-primary hover:bg-[#d9a60e] text-white font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-xl">download</span>
                    {isDownloading ? 'Downloading...' : 'Download Invoice PDF'}
                </button>

                <Link 
                    to="/orders"
                    className="w-full h-12 bg-[#f8f8f6] dark:bg-[#2c2618] hover:bg-[#e6e4dd] dark:hover:bg-[#3a3528] text-[#181611] dark:text-[#f4f3f0] font-bold rounded-lg transition-all flex items-center justify-center"
                >
                    View My Orders
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
