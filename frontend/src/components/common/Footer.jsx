import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaUserMd,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaHeart,
    FaApple,
    FaGooglePlay,
    FaChevronRight
} from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        quick: [
            { name: 'Home', path: '/' },
            { name: 'Find Doctors', path: '/doctors' },
            { name: 'About Us', path: '/about' },
            { name: 'Contact', path: '/contact' },
            { name: 'FAQ', path: '/faq' },
        ],
        patients: [
            { name: 'Search Doctors', path: '/doctors' },
            { name: 'How It Works', path: '/how-it-works' },
            { name: 'Insurance Partners', path: '/insurance' },
            { name: 'Health Blog', path: '/blog' },
            { name: 'Patient Support', path: '/support' },
        ],
        doctors: [
            { name: 'Register as Doctor', path: '/register' },
            { name: 'Doctor Login', path: '/login' },
            { name: 'Partnership Program', path: '/partnership' },
            { name: 'Resources', path: '/resources' },
            { name: 'Doctor Support', path: '/support-doctors' },
        ],
    };

    return (
        <footer className="relative bg-[#020617] text-white pt-20 pb-10 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <Link to="/" className="flex items-center space-x-3 group w-fit">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <FaUserMd className="h-7 w-7 text-white" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    SMART DOCTOR
                                </span>
                            </Link>
                            <p className="mt-6 text-slate-400 leading-relaxed max-w-sm">
                                Elevating healthcare through seamless digital connections. Join thousands of patients and doctors in our trusted ecosystem.
                            </p>
                        </div>

                        <div className="flex space-x-4">
                            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {[
                            { title: 'Quick Links', items: footerLinks.quick },
                            { title: 'For Patients', items: footerLinks.patients },
                            { title: 'For Doctors', items: footerLinks.doctors }
                        ].map((section, idx) => (
                            <div key={idx} className="space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">
                                    {section.title}
                                </h3>
                                <ul className="space-y-4">
                                    {section.items.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            <Link
                                                to={link.path}
                                                className="text-slate-400 hover:text-white flex items-center group text-[15px] transition-colors"
                                            >
                                                <FaChevronRight className="h-2 w-2 mr-2 text-indigo-500 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md mb-16">
                    {[
                        { icon: FaMapMarkerAlt, label: 'Visit Us', value: 'Medical District, Mumbai - 400001', color: 'text-indigo-400' },
                        { icon: FaPhoneAlt, label: 'Call Us', value: '+91 98765 43210', color: 'text-purple-400' },
                        { icon: FaEnvelope, label: 'Email Us', value: 'support@smartdoctor.com', color: 'text-emerald-400' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4 group cursor-default">
                            <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <item.icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{item.label}</p>
                                <p className="text-sm font-semibold text-slate-200">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* App Download & Footer Info */}
                <div className="flex flex-col lg:flex-row items-center justify-between pt-10 border-t border-white/5 gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="text-slate-500 text-sm font-medium">
                            © {currentYear} Smart Doctor System. All rights reserved.
                        </div>
                        <div className="flex items-center space-x-6">
                            {['Privacy', 'Terms', 'Refund'].map((item) => (
                                <Link
                                    key={item}
                                    to={`/${item.toLowerCase()}`}
                                    className="text-xs text-slate-500 hover:text-indigo-400 font-bold transition-colors"
                                >
                                    {item} Policy
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <FaApple className="h-6 w-6 text-white" />
                            <div className="text-left">
                                <p className="text-[8px] uppercase font-bold text-slate-400 leading-none">Download on the</p>
                                <p className="text-xs font-black text-white">App Store</p>
                            </div>
                        </button>
                        <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <FaGooglePlay className="h-5 w-5 text-indigo-400" />
                            <div className="text-left">
                                <p className="text-[8px] uppercase font-bold text-slate-400 leading-none">Get it on</p>
                                <p className="text-xs font-black text-white">Google Play</p>
                            </div>
                        </button>
                    </div>

                    <div className="flex items-center text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                        <span>Made with</span>
                        <FaHeart className="h-3 w-3 text-red-500 mx-2 animate-pulse" />
                        <span>for excellence</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
