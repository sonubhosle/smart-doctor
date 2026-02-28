import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaClock,
    FaUser,
    FaPaperPlane,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaCheckCircle,
    FaGlobe,
    FaArrowRight
} from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            setIsSubmitting(false);
            setSubmitted(true);

            // Reset submitted state after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        }, 1500);
    };

    const contactInfo = [
        {
            icon: <FaMapMarkerAlt />,
            title: 'Visit Us',
            content: '123 Healthcare Ave, Mumbai',
            color: 'text-rose-500',
            bgColor: 'bg-rose-50'
        },
        {
            icon: <FaPhone />,
            title: 'Call Us',
            content: '+91 98765 43210',
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-50'
        },
        {
            icon: <FaEnvelope />,
            title: 'Email Us',
            content: 'support@smartdoctor.com',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50'
        },
        {
            icon: <FaClock />,
            title: 'Service Hours',
            content: '24/7 Support Available',
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-50'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header Section */}
            <section className="bg-slate-900 pt-24 pb-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] -z-0"></div>
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 mb-8">
                        <span className="text-indigo-300 font-bold text-xs uppercase tracking-widest">Connect With Experts</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter mb-6">
                        We're Here <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">To Help You</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                        Have questions about our platform or need technical assistance? Our team is available 24/7 to ensure your healthcare journey is seamless.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Contact Sidebar */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center space-x-6 hover:shadow-xl hover:shadow-indigo-50 transition-all group">
                                    <div className={`w-14 h-14 rounded-2xl ${info.bgColor} ${info.color} flex items-center justify-center flex-shrink-0 transform group-hover:scale-110 transition-transform`}>
                                        {React.cloneElement(info.icon, { className: 'w-6 h-6' })}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{info.title}</h3>
                                        <p className="text-slate-900 font-bold mt-1">{info.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links Card */}
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-bl-full -z-0"></div>
                            <h3 className="text-2xl font-black mb-6 relative z-10 tracking-tight">Follow Our <br /> Health Updates</h3>
                            <div className="flex gap-4 relative z-10">
                                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-indigo-600 transition-all hover:-translate-y-1">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Emergency Card */}
                        <div className="bg-rose-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-rose-200 animate-pulse-slow">
                            <h3 className="text-2xl font-black mb-2 tracking-tight">🚨 Emergency?</h3>
                            <p className="text-rose-100 text-sm font-medium mb-8 leading-relaxed">For immediate life-threatening situations, call our specialist emergency line.</p>
                            <a href="tel:+919876543210" className="flex items-center justify-between bg-white text-rose-600 px-8 py-5 rounded-[2rem] font-black group">
                                <span>+91 98765 43210</span>
                                <FaPhone className="group-hover:rotate-12 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[4rem] shadow-2xl p-10 lg:p-16 border border-slate-100">
                            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Send A Message</h2>
                            <p className="text-slate-500 font-medium mb-12">We typically respond to all inquiries within 2 hours.</p>

                            {submitted ? (
                                <div className="py-20 text-center space-y-6">
                                    <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl">
                                        <FaCheckCircle />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900">Message Received!</h3>
                                    <p className="text-slate-500 font-medium max-w-xs mx-auto">Thank you for reaching out. A specialist will contact you shortly.</p>
                                    <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-bold hover:underline">Send another message</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-8 py-5 bg-slate-50 border-transparent rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-bold placeholder:text-slate-300"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-8 py-5 bg-slate-50 border-transparent rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-bold placeholder:text-slate-300"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-8 py-5 bg-slate-50 border-transparent rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-bold placeholder:text-slate-300"
                                            placeholder="What is this regarding?"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="5"
                                            className="w-full px-8 py-5 bg-slate-50 border-transparent rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-bold placeholder:text-slate-300 resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
                                    >
                                        {isSubmitting ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"></div>
                                        ) : (
                                            <>
                                                <span>Send Secure Message</span>
                                                <FaPaperPlane className="text-base" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </section>

            {/* Map Section */}
            <section className="bg-white py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-100 rounded-[4rem] overflow-hidden h-[500px] shadow-2xl relative border-4 border-white">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.555016494142!2d72.8236993149017!3d19.075944787091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c1b2b2b2b3%3A0x5c9b3b3b3b3b3b3b!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(0.5) contrast(1.2)' }}
                            allowFullScreen=""
                            loading="lazy"
                            className="w-full h-full"
                        ></iframe>
                        <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white max-w-sm">
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Our Headquarters</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">123 Healthcare Avenue, Medical District, Mumbai - 400001, Maharashtra, India</p>
                            <a href="#" className="inline-flex items-center text-indigo-600 font-bold mt-4 hover:translate-x-2 transition-transform">
                                Open in Google Maps <FaArrowRight className="ml-2" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
            `}</style>

        </div>
    );
};

export default Contact;