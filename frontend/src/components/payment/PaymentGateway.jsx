import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    FaCreditCard,
    FaLock,
    FaShieldAlt,
    FaUniversity,
    FaMobileAlt,
    FaCheckCircle,
    FaArrowRight
} from 'react-icons/fa';

const PaymentGateway = ({ amount, appointmentId, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);

        const res = await loadRazorpay();
        if (!res) {
            toast.error('Payment gateway failed to load. Please check your connection.');
            setLoading(false);
            return;
        }

        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/payments/create-order`,
                { appointmentId },
                {
                    headers: {
                        Authorization: `Bearer ${userData.token}`,
                    },
                }
            );

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.data.amount,
                currency: data.data.currency,
                name: 'Smart Doctor Care',
                description: 'Secure Appointment Consultation',
                order_id: data.data.id,
                handler: async (response) => {
                    try {
                        const verifyData = await axios.post(
                            `${import.meta.env.VITE_API_URL}/payments/verify`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                appointmentId,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${userData.token}`,
                                },
                            }
                        );

                        if (verifyData.data.success) {
                            toast.success('Payment Verified Successfully!');
                            onSuccess();
                            navigate('/patient/appointments');
                        }
                    } catch (error) {
                        toast.error('Security verification failed. Contact support.');
                    }
                },
                prefill: {
                    name: userData.name,
                    email: userData.email,
                    contact: userData.phone,
                },
                theme: {
                    color: '#4f46e5', // Indigo-600
                },
                modal: {
                    ondismiss: () => setLoading(false)
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            toast.error('Unable to initialize secure session');
            setLoading(false);
        }
    };

    return (
        <div className="relative group overflow-hidden bg-white/40 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 transition-all hover:shadow-[0_48px_80px_-20px_rgba(79,70,229,0.12)]">
            {/* Top Security Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-indigo-50/50">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 ring-4 ring-indigo-50 transition-transform group-hover:scale-110">
                        <FaShieldAlt className="text-white text-xl" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Secure Gateway</h3>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Transaction Verified</p>
                    </div>
                </div>
                <div className="flex items-center bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Live SSL</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Cost Breakdown */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50 shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultation</span>
                        <span className="text-sm font-black text-slate-900">₹{amount}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Service Fee</span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2 py-1 bg-emerald-50 rounded-lg">Waived</span>
                    </div>
                    <div className="pt-4 mt-2 border-t border-slate-200/50 flex justify-between items-center">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Total Payable</span>
                        <div className="text-right">
                            <span className="text-3xl font-black text-indigo-600 tracking-tighter block">₹{amount}</span>
                            <span className="text-[10px] font-bold text-slate-400">All Taxes Included</span>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/60 p-3 rounded-2xl border border-white flex flex-col items-center justify-center group/item hover:bg-white transition-colors">
                        <FaCreditCard className="text-slate-300 mb-1.5 text-lg group-hover/item:text-indigo-500 transition-colors" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Debit/Credit</span>
                    </div>
                    <div className="bg-white/60 p-3 rounded-2xl border border-white flex flex-col items-center justify-center group/item hover:bg-white transition-colors">
                        <FaMobileAlt className="text-slate-300 mb-1.5 text-lg group-hover/item:text-indigo-500 transition-colors" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">UPI/Wallets</span>
                    </div>
                    <div className="bg-white/60 p-3 rounded-2xl border border-white flex flex-col items-center justify-center group/item hover:bg-white transition-colors">
                        <FaUniversity className="text-slate-300 mb-1.5 text-lg group-hover/item:text-indigo-500 transition-colors" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">NetBanking</span>
                    </div>
                </div>

                {/* Main Action Button */}
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="relative w-full group/btn overflow-hidden"
                >
                    <div className={`flex items-center justify-center space-x-3 w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500 ${loading
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-white shadow-2xl shadow-slate-200 hover:shadow-indigo-100 hover:-translate-y-1 active:scale-95'
                        }`}>
                        {loading ? (
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>Establishing Tunnel...</span>
                            </div>
                        ) : (
                            <>
                                <FaLock className={`text-xs transition-transform group-hover/btn:scale-125 ${loading ? 'opacity-0' : 'opacity-60'}`} />
                                <span>Complete Secure Payment</span>
                                <FaArrowRight className="text-xs opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                            </>
                        )}
                    </div>
                </button>

                <div className="flex flex-col items-center space-y-3 pt-4">
                    <p className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <FaCheckCircle className="mr-2 text-emerald-500" />
                        PCI-DSS Compliant Encryption
                    </p>
                    <div className="flex items-center space-x-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
