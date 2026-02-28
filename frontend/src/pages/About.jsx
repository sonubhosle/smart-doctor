import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaHeart,
    FaHandsHelping,
    FaRocket,
    FaShieldAlt,
    FaUsers,
    FaAward,
    FaQuoteRight,
    FaArrowRight,
    FaBullseye,
    FaGlobe
} from 'react-icons/fa';

const About = () => {
    const teamMembers = [
        {
            name: 'Dr. Rajesh Kumar',
            role: 'Founder & CEO',
            image: 'https://randomuser.me/api/portraits/men/10.jpg',
            bio: 'Former cardiologist with 20+ years of experience, passionate about digital healthcare'
        },
        {
            name: 'Priya Sharma',
            role: 'Chief Medical Officer',
            image: 'https://randomuser.me/api/portraits/women/11.jpg',
            bio: 'MD with expertise in healthcare quality and patient safety standards'
        },
        {
            name: 'Amit Patel',
            role: 'CTO',
            image: 'https://randomuser.me/api/portraits/men/12.jpg',
            bio: 'Tech visionary leading innovation in healthcare technology solutions'
        },
        {
            name: 'Dr. Sneha Reddy',
            role: 'Head of Medical Operations',
            image: 'https://randomuser.me/api/portraits/women/13.jpg',
            bio: 'Experienced physician ensuring quality care across all specialties'
        }
    ];

    const values = [
        {
            icon: <FaHeart />,
            title: 'Patient First',
            description: 'Every decision we make prioritizes patient well-being and satisfaction',
            color: 'text-rose-500',
            bgColor: 'bg-rose-50'
        },
        {
            icon: <FaShieldAlt />,
            title: 'Trust & Safety',
            description: 'Your health data is protected with enterprise-grade security',
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-50'
        },
        {
            icon: <FaRocket />,
            title: 'Innovation',
            description: 'Continuously improving our platform with cutting-edge technology',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50'
        },
        {
            icon: <FaHandsHelping />,
            title: 'Accessibility',
            description: 'Making quality healthcare accessible to everyone, everywhere',
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-50'
        }
    ];

    const milestones = [
        { year: '2020', event: 'Smart Doctor founded with a vision to revolutionize healthcare' },
        { year: '2021', event: 'Reached 10,000+ patients and 500+ doctors onboard' },
        { year: '2022', event: 'Launched video consultation and 24/7 support' },
        { year: '2023', event: 'Expanded to 50+ cities, 50,000+ happy patients' },
        { year: '2024', event: 'Recognized as Top 10 HealthTech startups in India' }
    ];

    return (
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] -z-0"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 mb-8">
                        <span className="text-indigo-300 font-bold text-xs uppercase tracking-widest">Our Legacy & Mission</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter mb-8">
                        Revolutionizing <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Digital Healthcare</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
                        We're on a mission to make quality healthcare accessible, affordable,
                        and convenient for every citizen across the nation.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-32 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[3.5rem] shadow-2xl p-8 lg:p-16 border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-1 bg-indigo-600 rounded-full"></div>
                                <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.3em]">Our Origin Story</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">How It All Started</h2>
                            <p className="text-lg text-slate-500 leading-relaxed">
                                Smart Doctor was born from a simple observation: finding the right doctor
                                and booking appointments shouldn't be complicated. In 2020, our founder
                                <span className="text-indigo-600 font-bold"> Dr. Rajesh Kumar </span>
                                experienced firsthand the challenges patients face when trying to access quality healthcare.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="p-6 bg-slate-50 rounded-3xl">
                                    <p className="text-4xl font-black text-indigo-600 mb-2">50k+</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Healthy Users</p>
                                </div>
                                <div className="p-6 bg-indigo-50 rounded-3xl">
                                    <p className="text-4xl font-black text-indigo-600 mb-2">1k+</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Medical Staff</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] rotate-3 group-hover:rotate-0 transition-transform duration-500 -z-10 opacity-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="Medical Professional"
                                className="rounded-[3rem] shadow-2xl w-full h-[500px] object-cover transform -rotate-3 group-hover:rotate-0 transition-transform duration-500"
                            />
                            <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white flex items-center space-x-4 animate-float">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                    <FaAward className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">#1 Trusted</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Platform In India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.3em]">Our Principles</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">The Core Of Smart Doctor</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium">Our values define how we treat our patients, partners and our team every single day.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 border border-slate-100 hover:border-indigo-100 relative group"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${value.bgColor} ${value.color} flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                                    {React.cloneElement(value.icon, { className: 'w-8 h-8' })}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{value.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey / Milestones */}
            <section className="py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-20">
                        <div className="lg:w-1/3">
                            <div className="sticky top-32 space-y-6">
                                <div className="w-16 h-1 bg-indigo-600 rounded-full"></div>
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Our Journey Through Time</h2>
                                <p className="text-slate-500 font-medium">Tracking our growth from a small startup to a national healthcare leader.</p>
                            </div>
                        </div>
                        <div className="lg:w-2/3 space-y-12">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="flex gap-8 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-slate-200 group-hover:bg-indigo-600 transition-colors">
                                            {milestone.year}
                                        </div>
                                        <div className="w-[2px] h-full bg-slate-100 mt-4"></div>
                                    </div>
                                    <div className="pt-2 pb-12">
                                        <div className="bg-slate-50 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-indigo-50 border border-transparent group-hover:border-indigo-100 p-8 rounded-3xl transition-all duration-500">
                                            <p className="text-slate-700 font-bold leading-relaxed">{milestone.event}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.3em]">Our Leadership</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">The Visionaries Behind Care</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="group flex flex-col items-center text-center">
                                <div className="relative w-full aspect-square mb-6">
                                    <div className="absolute inset-4 bg-indigo-600 rounded-[2.5rem] rotate-6 group-hover:rotate-0 transition-transform duration-500 -z-10"></div>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover rounded-[2.5rem] shadow-xl group-hover:scale-95 transition-transform duration-500 border-4 border-white"
                                    />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">{member.name}</h3>
                                <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">{member.role}</p>
                                <p className="text-slate-500 text-sm mt-4 px-4 leading-relaxed font-medium">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="relative rounded-[4rem] bg-indigo-600 p-12 lg:p-20 overflow-hidden text-center text-white shadow-2xl shadow-indigo-200">
                        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -z-0"></div>
                        <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tight relative z-10">Join Our Mission For <br /> Better Health</h2>
                        <div className="flex flex-wrap justify-center gap-6 relative z-10">
                            <Link
                                to="/register"
                                className="px-10 py-5 bg-white text-indigo-700 font-black rounded-3xl shadow-xl hover:scale-105 transition-all text-lg"
                            >
                                Get Started Today
                            </Link>
                            <Link
                                to="/contact"
                                className="px-10 py-5 bg-indigo-500/30 text-white font-black rounded-3xl border-2 border-white/20 hover:bg-white/10 transition-all text-lg"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float { animation: float 5s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default About;