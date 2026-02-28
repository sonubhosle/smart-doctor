import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaUser,
    FaCalendarAlt,
    FaQuoteRight,
    FaFilter
} from 'react-icons/fa';
import { getDoctorReviews } from '../../redux/slices/doctorSlice';
import Spinner from '../common/Spinner';

const DoctorReviews = () => {
    const dispatch = useDispatch();
    const { reviews, isLoading } = useSelector((state) => state.doctor);
    const { user } = useSelector((state) => state.auth);
    const [filter, setFilter] = useState('all');
    const [stats, setStats] = useState({
        average: 0,
        total: 0,
        distribution: {
            5: 0, 4: 0, 3: 0, 2: 0, 1: 0
        }
    });

    useEffect(() => {
        dispatch(getDoctorReviews());
    }, [dispatch]);

    useEffect(() => {
        if (reviews.length > 0) {
            // Calculate statistics
            const total = reviews.length;
            const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
            const average = sum / total;

            // Calculate distribution
            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            reviews.forEach(review => {
                distribution[review.rating]++;
            });

            setStats({
                average,
                total,
                distribution
            });
        }
    }, [reviews]);

    const filteredReviews = filter === 'all'
        ? reviews
        : reviews.filter(review => review.rating === parseInt(filter));

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="h-5 w-5 text-yellow-400" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="h-5 w-5 text-yellow-400" />);
            } else {
                stars.push(<FaRegStar key={i} className="h-5 w-5 text-yellow-400" />);
            }
        }
        return stars;
    };

    const getRatingPercentage = (rating) => {
        return stats.total > 0
            ? ((stats.distribution[rating] / stats.total) * 100).toFixed(1)
            : 0;
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] py-12">
            <div className=" px-4 sm:px-6 lg:px-18">
                {/* Header Section */}
                <div className="mb-12 border-b border-gray-100 pb-10">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Patient Feedbacks
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Monitor patient satisfaction and session reviews.
                    </p>
                </div>

                {/* Rating Summary - Clean & Minimal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 items-center">
                    <div className="text-center md:text-left">
                        <div className="flex items-baseline justify-center md:justify-start space-x-2">
                            <span className="text-6xl font-black text-slate-900 leading-none">
                                {stats.average.toFixed(1)}
                            </span>
                            <span className="text-slate-400 font-bold">/ 5.0</span>
                        </div>
                        <div className="flex justify-center md:justify-start my-4">
                            {renderStars(stats.average)}
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Total {stats.total} Reviews
                        </p>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center space-x-4">
                                <span className="text-[10px] font-bold text-slate-500 w-8">{rating} Star</span>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-slate-900 transition-all duration-1000 ease-out"
                                        style={{ width: `${getRatingPercentage(rating)}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 w-8 text-right">
                                    {stats.distribution[rating]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-gray-100">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${filter === 'all'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                            }`}
                    >
                        All Reviews
                    </button>
                    {[5, 4, 3, 2, 1].map(rating => (
                        <button
                            key={rating}
                            onClick={() => setFilter(rating.toString())}
                            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center space-x-2 ${filter === rating.toString()
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                                }`}
                        >
                            <FaStar className={`h-2.5 w-2.5 ${filter === rating.toString() ? 'text-white' : 'text-slate-300'}`} />
                            <span>{rating} Stars</span>
                        </button>
                    ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-8">
                    {filteredReviews.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                            <p className="text-slate-400 font-medium">No reviews found for this criteria.</p>
                        </div>
                    ) : (
                        filteredReviews.map((review) => (
                            <div
                                key={review._id}
                                className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center space-x-5">
                                        <img
                                            src={review.patientId?.photo || `https://ui-avatars.com/api/?name=${review.patientId?.name}&background=f8fafc&color=94a3b8`}
                                            alt={review.patientId?.name}
                                            className="h-12 w-12 rounded-2xl object-cover border border-slate-100"
                                        />
                                        <div>
                                            <h3 className="font-bold text-slate-900 leading-tight">{review.patientId?.name}</h3>
                                            <div className="mt-1 flex items-center space-x-2">
                                                <div className="flex">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 bg-slate-50 rounded uppercase">
                                                    {review.rating}.0
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(review.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-600 leading-relaxed font-medium pl-1">
                                    {review.review}
                                </p>

                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center space-x-6">
                                    <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                                        Was this helpful?
                                    </button>
                                    <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                                        Report
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorReviews;