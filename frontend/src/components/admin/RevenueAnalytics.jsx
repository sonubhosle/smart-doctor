import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FaRupeeSign,
    FaDownload,
    FaChartLine,
    FaChartBar,
    FaArrowUp,
    FaArrowDown,
    FaWallet,
    FaCreditCard,
    FaEye
} from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getRevenueAnalytics } from '../../redux/slices/adminSlice';
import Spinner from '../common/Spinner';
import { format, subMonths } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const RevenueAnalytics = () => {
    const dispatch = useDispatch();
    const { revenue, isLoading } = useSelector((state) => state.admin);
    const [dateRange, setDateRange] = useState({
        startDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });
    const [chartType, setChartType] = useState('line');

    useEffect(() => {
        fetchRevenueData();
    }, [dispatch, dateRange]);

    const fetchRevenueData = () => {
        dispatch(getRevenueAnalytics({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
        }));
    };

    // Get summary data with fallbacks
    const summary = revenue?.summary || {
        totalRevenue: 0,
        totalAppointments: 0,
        averagePerAppointment: 0,
        growth: 0,
        monthlyAverage: 0,
        projectedRevenue: 0,
        topDoctors: [],
        paymentMethods: {
            razorpay: 0,
            cash: 0
        }
    };

    // Prepare chart data from monthlyData
    const getChartData = () => {
        const monthlyData = revenue?.monthlyData || [];

        if (monthlyData.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        // Format labels from dates
        const labels = monthlyData.map(item => {
            const date = new Date(item.date);
            return format(date, 'MMM yyyy');
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Revenue (₹)',
                    data: monthlyData.map(item => item.revenue),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: chartType === 'line'
                        ? 'rgba(79, 70, 229, 0.1)'
                        : 'rgba(79, 70, 229, 0.5)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: chartType === 'line',
                    yAxisID: 'y',
                },
                {
                    label: 'Appointments',
                    data: monthlyData.map(item => item.count),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    yAxisID: 'y1',
                }
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 6
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            if (context.dataset.label.includes('Revenue')) {
                                label += '₹' + context.parsed.y.toLocaleString('en-IN');
                            } else {
                                label += context.parsed.y;
                            }
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Revenue (₹)',
                    color: '#6B7280'
                },
                ticks: {
                    callback: function (value) {
                        return '₹' + value.toLocaleString('en-IN');
                    },
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Appointments',
                    color: '#6B7280'
                },
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return value;
                    }
                }
            },
        },
    };

    const handleExportCSV = () => {
        const payments = revenue?.payments || [];

        if (payments.length === 0) {
            return;
        }

        const csvData = payments.map(payment => ({
            'Date': format(new Date(payment.createdAt), 'dd/MM/yyyy'),
            'Patient': payment.appointmentId?.patientId?.name || 'N/A',
            'Doctor': payment.appointmentId?.doctorId?.name || 'N/A',
            'Amount': payment.amount || 0,
            'Payment ID': payment.razorpay_payment_id || 'Cash',
            'Status': payment.status || 'N/A'
        }));

        const headers = ['Date', 'Patient', 'Doctor', 'Amount', 'Payment ID', 'Status'];
        const csvContent = [
            headers.join(','),
            ...csvData.map(row =>
                headers.map(header => {
                    const value = row[header]?.toString() || '';
                    return value.includes(',') ? `"${value}"` : value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">Revenue Analytics</h1>
                        <p className="text-gray-500 mt-2 font-medium">
                            Track platform revenue and financial performance
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-50/50 border border-indigo-50/50 p-1.5">
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                className="px-4 py-2 border-none bg-gray-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-700"
                            />
                            <span className="text-gray-400 font-medium">to</span>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                className="px-4 py-2 border-none bg-gray-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-700"
                            />
                        </div>

                        <button
                            onClick={handleExportCSV}
                            disabled={!revenue?.payments?.length}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl hover:from-green-600 hover:to-green-700 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-green-200 hover:-translate-y-0.5 font-semibold"
                        >
                            <FaDownload className="h-4 w-4" />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
                                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
                                    ₹{summary.totalRevenue.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-2xl shadow-inner border border-white">
                                <FaRupeeSign className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-500 mt-3 flex items-center">
                            From <span className="font-bold text-gray-900 mx-1">{summary.totalAppointments}</span> appointments
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Avg per Appointment</p>
                                <p className="text-3xl font-extrabold text-indigo-600 mt-2">
                                    ₹{summary.averagePerAppointment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-2xl shadow-inner border border-white">
                                <FaWallet className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Monthly Average</p>
                                <p className="text-3xl font-extrabold text-purple-600 mt-2">
                                    ₹{summary.monthlyAverage.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-2xl shadow-inner border border-white">
                                <FaChartBar className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Growth Rate</p>
                                <div className="flex items-center mt-2">
                                    <p className={`text-3xl font-extrabold ${summary.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {summary.growth >= 0 ? '+' : ''}{summary.growth.toFixed(1)}%
                                    </p>
                                    {summary.growth >= 0 ? (
                                        <FaArrowUp className="ml-2 h-5 w-5 text-emerald-500 drop-shadow-sm" />
                                    ) : (
                                        <FaArrowDown className="ml-2 h-5 w-5 text-rose-500 drop-shadow-sm" />
                                    )}
                                </div>
                            </div>
                            <div className={`${summary.growth >= 0 ? 'bg-emerald-50' : 'bg-rose-50'} p-4 rounded-2xl shadow-inner border border-white`}>
                                <FaChartLine className={`h-6 w-6 ${summary.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-8 hover:shadow-2xl transition-all duration-300">
                        <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center">
                            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 w-2 h-6 rounded-full mr-3"></span>
                            Projected Annual Revenue
                        </h3>
                        <div className="flex items-center justify-between bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                                ₹{summary.projectedRevenue.toLocaleString('en-IN')}
                            </p>
                            <div className="text-right">
                                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1 block">Forecast</span>
                                <p className="text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                                    Based on last 30 days
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-8 hover:shadow-2xl transition-all duration-300">
                        <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center">
                            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 w-2 h-6 rounded-full mr-3"></span>
                            Payment Methods Distribution
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl border border-gray-100 hover:bg-indigo-50/30 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-100 p-2.5 rounded-xl shadow-inner">
                                        <FaCreditCard className="text-blue-600 h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-gray-800">Razorpay</span>
                                </div>
                                <div className="flex items-center space-x-3 text-right">
                                    <span className="font-extrabold text-lg text-gray-900">{summary.paymentMethods.razorpay}</span>
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                        {summary.totalAppointments > 0
                                            ? ((summary.paymentMethods.razorpay / summary.totalAppointments) * 100).toFixed(1)
                                            : 0}%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl border border-gray-100 hover:bg-emerald-50/30 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-emerald-100 p-2.5 rounded-xl shadow-inner">
                                        <FaWallet className="text-emerald-600 h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-gray-800">Cash</span>
                                </div>
                                <div className="flex items-center space-x-3 text-right">
                                    <span className="font-extrabold text-lg text-gray-900">{summary.paymentMethods.cash}</span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                        {summary.totalAppointments > 0
                                            ? ((summary.paymentMethods.cash / summary.totalAppointments) * 100).toFixed(1)
                                            : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-8 mb-8">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Revenue Trends</h2>
                        <div className="flex space-x-2 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/50">
                            <button
                                onClick={() => setChartType('line')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${chartType === 'line'
                                    ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                                    }`}
                            >
                                Line Trend
                            </button>
                            <button
                                onClick={() => setChartType('bar')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${chartType === 'bar'
                                    ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                                    }`}
                            >
                                Bar Chart
                            </button>
                        </div>
                    </div>

                    <div className="h-96 w-full">
                        {revenue?.monthlyData?.length > 0 ? (
                            chartType === 'line' ? (
                                <Line data={getChartData()} options={chartOptions} />
                            ) : (
                                <Bar data={getChartData()} options={chartOptions} />
                            )
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <div className="bg-gray-100 p-4 rounded-full mb-4">
                                    <FaEye className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-xl font-bold text-gray-700">No revenue data available</p>
                                <p className="text-sm text-gray-500 mt-2">Try adjusting your date range constraints</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Doctors & Recent Transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="bg-gradient-to-r from-orange-400 to-pink-500 w-2 h-6 rounded-full mr-3"></span>
                            Top Performing Doctors
                        </h2>
                        {summary.topDoctors.length > 0 ? (
                            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/80">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Doctor
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Appointments
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Revenue
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Avg. per Visit
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/50 divide-y divide-gray-100">
                                        {summary.topDoctors.map((doctor, index) => (
                                            <tr key={index} className="hover:bg-indigo-50/30 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {doctor.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-600 bg-gray-50/80 px-3 py-1 rounded-lg border border-gray-100">
                                                        {doctor.count}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                                        ₹{doctor.revenue.toLocaleString('en-IN')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-600">
                                                        ₹{(doctor.revenue / doctor.count).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
                                <p className="font-semibold text-gray-600">No doctor revenue data available</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-50/50 border border-indigo-50/50 p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="bg-gradient-to-r from-teal-400 to-emerald-500 w-2 h-6 rounded-full mr-3"></span>
                            Recent Transactions
                        </h2>
                        {revenue?.payments && revenue.payments.length > 0 ? (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                                {revenue.payments.slice(0, 10).map((payment, index) => (
                                    <div key={index} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-indigo-50/30 hover:border-indigo-100 transition-all duration-300 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">
                                                    {payment.appointmentId?.patientId?.name || 'Patient'}
                                                </p>
                                                <p className="text-xs font-semibold text-indigo-500 mt-1">
                                                    With: {payment.appointmentId?.doctorId?.name || 'Doctor'}
                                                </p>
                                                <p className="text-xs font-medium text-gray-400 mt-2 bg-white px-2 py-0.5 rounded-full inline-block border border-gray-100 shadow-sm">
                                                    {format(new Date(payment.createdAt), 'dd MMM yyyy, hh:mm a')}
                                                </p>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <p className="font-extrabold text-gray-900">
                                                    ₹{payment.amount?.toLocaleString('en-IN')}
                                                </p>
                                                <span className={`mt-2 text-[10px] font-bold px-2.5 py-1 uppercase rounded-full shadow-sm border ${payment.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
                                <p className="font-semibold text-gray-600">No recent transactions</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Insights */}
                {revenue?.monthlyData?.length > 0 && (
                    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 rounded-3xl p-8 border border-white shadow-xl shadow-indigo-100/50">
                        <h3 className="font-bold text-gray-800 text-xl mb-6 flex items-center">
                            <span className="bg-indigo-600 text-white rounded-xl shadow-inner w-8 h-8 flex items-center justify-center text-sm mr-3">�</span>
                            Strategic Revenue Insights
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Peak Revenue Month</p>
                                <p className="text-2xl font-extrabold text-gray-900">
                                    {revenue.monthlyData.reduce((max, curr) =>
                                        curr.revenue > max.revenue ? curr : max
                                    ).date ? format(new Date(revenue.monthlyData.reduce((max, curr) =>
                                        curr.revenue > max.revenue ? curr : max
                                    ).date), 'MMMM yyyy') : 'N/A'}
                                </p>
                                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
                                    ₹{revenue.monthlyData.reduce((max, curr) =>
                                        curr.revenue > max.revenue ? curr : max
                                    ).revenue.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Average Daily Revenue</p>
                                <p className="text-2xl font-extrabold text-gray-900 mt-3">
                                    ₹{((summary.totalRevenue) / ((new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60 * 24) + 1)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Avg Rev / Doctor</p>
                                <p className="text-2xl font-extrabold text-gray-900 mt-3">
                                    ₹{(summary.totalRevenue / (summary.topDoctors.length || 1)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueAnalytics;