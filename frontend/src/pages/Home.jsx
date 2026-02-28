import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaUserMd,
    FaCalendarCheck,
    FaShieldAlt,
    FaClock,
    FaStar,
    FaArrowRight,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaHeart,
    FaUserFriends,
    FaRocket,
    FaAward,
    FaStethoscope,
    FaCheckCircle,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Home = () => {
    const { user } = useSelector((state) => state.auth);

    const features = [
        {
            icon: <FaUserMd />,
            title: 'Expert Doctors',
            description: 'Access to 1000+ verified specialists across India.',
            color: 'blue'
        },
        {
            icon: <FaCalendarCheck />,
            title: 'Instant Booking',
            description: 'Book appointments in less than 60 seconds.',
            color: 'indigo'
        },
        {
            icon: <FaShieldAlt />,
            title: 'Secure Data',
            description: 'Enterprise-grade encryption for your health records.',
            color: 'emerald'
        },
        {
            icon: <FaClock />,
            title: '24/7 Access',
            description: 'Reach our support and doctors anytime, anywhere.',
            color: 'purple'
        }
    ];

    const stats = [
        { value: '1.2k+', label: 'Verified Doctors', icon: <FaStethoscope /> },
        { value: '85k+', label: 'Patient Consults', icon: <FaUserFriends /> },
        { value: '4.9/5', label: 'Average Rating', icon: <FaStar /> },
        { value: '15min', label: 'Avg. Response', icon: <FaClock /> }
    ];

    const popularSpecialties = [
        { name: 'Cardiology', icon: '❤️', slug: 'cardiology' },
        { name: 'Dermatology', icon: '🩺', slug: 'dermatology' },
        { name: 'Pediatrics', icon: '👶', slug: 'pediatrics' },
        { name: 'Neurology', icon: '🧠', slug: 'neurology' },
        { name: 'Orthopedics', icon: '🦴', slug: 'orthopedics' },
        { name: 'Dentistry', icon: '🦷', slug: 'dentistry' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-48 overflow-hidden bg-white">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-60 -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-50 rounded-full blur-[100px] opacity-40 -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Text Content */}
                        <div className="flex flex-col space-y-8 relative z-10 animate-fadeIn">
                            {/* Badge */}
                            <div className="flex items-center space-x-2 bg-indigo-50 w-fit px-4 py-2 rounded-full border border-indigo-100/50 shadow-sm transition-transform hover:scale-105">
                                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
                                <span className="text-indigo-700 font-bold text-xs uppercase tracking-widest">Digital Healthcare Revolution</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                                Excellence In <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 drop-shadow-sm">
                                    Healthcare
                                </span> Delivery
                            </h1>

                            <p className="text-lg lg:text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
                                Experience personalized care from the comfort of your home. Connect with world-class specialists and manage your health with ease.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                {!user ? (
                                    <>
                                        <Link
                                            to="/register"
                                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 transform hover:-translate-y-1"
                                        >
                                            Get Started For Free
                                        </Link>
                                        <Link
                                            to="/doctors"
                                            className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all duration-300 flex items-center group"
                                        >
                                            Find A Doctor <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        to={user.role === 'patient' ? '/patient/dashboard' : user.role === 'doctor' ? '/doctor/dashboard' : '/admin/dashboard'}
                                        className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 hover:scale-105 transition-all duration-500 tracking-tight"
                                    >
                                        Access Your Dashboard
                                    </Link>
                                )}
                            </div>

                            {/* Trust Badge */}
                            <div className="flex items-center space-x-6 pt-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <img key={i} className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-slate-50" src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} alt="User" />
                                    ))}
                                    <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">50k+</div>
                                </div>
                                <div className="h-10 w-[1px] bg-slate-200"></div>
                                <div>
                                    <div className="flex items-center text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(i => <FaStar key={i} className="w-3 h-3" />)}
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">2,500+ Reviews</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image Section */}
                        <div className="relative group animate-slideIn">
                            {/* Decorative Background Card */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[110%] bg-indigo-50/50 rounded-[4rem] -rotate-3 -z-10 transition-transform group-hover:rotate-0 duration-700"></div>

                            <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-2 group-hover:rotate-0 transition-transform duration-700 scale-95 group-hover:scale-100">
                                <img
                                    src="/assets/images/hero-doctor.png"
                                    alt="Professional Doctors"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Floating Stats UI */}
                            <div className="absolute top-10 -left-6 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white max-w-[180px] animate-float">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                                        <FaStethoscope className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Specialist</p>
                                        <p className="text-sm font-black text-slate-900 mt-1">Dr. Michael Chen</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-20 -right-10 bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white animate-float-delayed flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center shadow-lg">
                                    <FaCalendarCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-800 tracking-tight">Booking confirmed!</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Today at 4:30 PM</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- CORE STATS SECTION --- */}
            <section className="relative z-20 -mt-10 mx-auto max-w-6xl px-4 lg:px-0">
                <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[3rem] p-8 lg:p-12 shadow-2xl shadow-slate-200 border border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center group cursor-default">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-indigo-400 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:-translate-y-2">
                                {React.cloneElement(stat.icon, { className: 'w-5 h-5' })}
                            </div>
                            <h3 className="text-3xl font-black text-indigo-50 mb-1">{stat.value}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SERVICES / FEATURES SECTION --- */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
                                <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.3em]">Our Expertise</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
                                Why Millions Trust <br />
                                Smart Doctor Care
                            </h2>
                        </div>
                        <p className="text-slate-500 font-medium max-w-xs text-sm leading-relaxed pb-2 border-l-2 border-indigo-100 pl-6">
                            We combine cutting-edge technology with compassionate care to deliver a seamless healthcare experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 border border-slate-100 hover:border-indigo-100/50 relative overflow-hidden flex flex-col items-start">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0"></div>
                                <div className={`p-4 rounded-2xl bg-${feature.color}-50 text-${feature.color}-600 mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 relative z-10`}>
                                    {React.cloneElement(feature.icon, { className: 'w-7 h-7' })}
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-3 relative z-10 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed relative z-10">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- BROWSE SPECIALTIES SECTION --- */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Trusted Specialists By Category</h2>
                    <p className="text-slate-500 font-medium mb-12">Click to find the best doctors in your required field</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {popularSpecialties.map((spec, index) => (
                            <Link
                                key={index}
                                to={`/doctors?specialization=${spec.slug}`}
                                className="bg-slate-50/50 border border-slate-100 p-6 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 group flex flex-col items-center"
                            >
                                <span className="text-4xl mb-4 transform group-hover:scale-125 transition-transform">{spec.icon}</span>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">{spec.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA / DOWNLOAD SECTION --- */}
            <section className="py-32 bg-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] -z-0"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-700 to-purple-800 opacity-90 -z-10"></div>

                <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-10 animate-fadeIn">
                    <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                        Your Health Journey <br /> Perfected Digitally
                    </h2>
                    <p className="text-indigo-100 text-lg lg:text-xl font-medium max-w-2xl mx-auto opacity-80 leading-relaxed">
                        Join over 50,000 satisfied patients who have taken control of their health with Smart Doctor's intuitive platform.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                        <Link
                            to="/register"
                            className="px-10 py-5 bg-white text-indigo-700 font-black rounded-3xl shadow-2xl hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-2"
                        >
                            Create Your Account
                        </Link>
                        <Link
                            to="/doctors"
                            className="px-10 py-5 bg-indigo-500/30 text-white font-black rounded-3xl border-2 border-white/20 hover:bg-white/10 transition-all duration-300"
                        >
                            Consult A Specialist
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10">
                            <div className="p-3 bg-white/10 rounded-2xl"><FaShieldAlt className="w-5 h-5 text-indigo-200" /></div>
                            <div className="text-left text-white">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Security</p>
                                <p className="text-sm font-black">Data Encryption</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10">
                            <div className="p-3 bg-white/10 rounded-2xl"><FaCheckCircle className="w-5 h-5 text-indigo-200" /></div>
                            <div className="text-left text-white">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Verified</p>
                                <p className="text-sm font-black">100% Top Medical Staff</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10">
                            <div className="p-3 bg-white/10 rounded-2xl"><FaRocket className="w-5 h-5 text-indigo-200" /></div>
                            <div className="text-left text-white">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Speed</p>
                                <p className="text-sm font-black">Instant Scheduling</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Float Animations Wrapper */}
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float 6s ease-in-out infinite 3s; }
                .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
                .animate-slideIn { animation: slideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default Home;