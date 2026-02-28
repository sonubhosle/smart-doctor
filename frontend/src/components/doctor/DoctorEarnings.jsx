import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FaRupeeSign,
    FaCalendarAlt,
    FaDownload,
    FaChartLine,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getDoctorEarnings } from '../../redux/slices/doctorSlice';
import Spinner from '../common/Spinner';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DoctorEarnings = () => {
    const dispatch = useDispatch();
    const { earnings, isLoading } = useSelector((state) => state.doctor);
    const [dateRange, setDateRange] = useState('6months');
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [averageEarnings, setAverageEarnings] = useState(0);
    const [growth, setGrowth] = useState(0);

    useEffect(() => {
        dispatch(getDoctorEarnings());
    }, [dispatch]);

    useEffect(() => {
        if (earnings.length > 0) {
            // Calculate total earnings
            const total = earnings.reduce((sum, item) => sum + item.total, 0);
            setTotalEarnings(total);

            // Calculate average monthly earnings
            const avg = total / earnings.length;
            setAverageEarnings(avg);

            // Calculate growth (compare last month with previous month)
            if (earnings.length >= 2) {
                const lastMonth = earnings[0]?.total || 0;
                const prevMonth = earnings[1]?.total || 0;
                if (prevMonth > 0) {
                    const growthRate = ((lastMonth - prevMonth) / prevMonth) * 100;
                    setGrowth(growthRate);
                }
            }
        }
    }, [earnings]);

    const chartData = {
        labels: earnings.map(item => {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${monthNames[item._id.month - 1]} ${item._id.year}`;
        }).reverse(),
        datasets: [
            {
                label: 'Earnings (₹)',
                data: earnings.map(item => item.total).reverse(),
                borderColor: '#4f46e5',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)');
                    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#1e293b',
                bodyColor: '#1e293b',
                bodyFont: { weight: 'bold' },
                padding: 12,
                borderColor: '#e2e8f0',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `Earnings: ₹${context.parsed.y.toLocaleString()}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b',
                    font: { weight: '500' }
                }
            },
            y: {
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b',
                    callback: function (value) {
                        return '₹' + value.toLocaleString();
                    },
                },
            },
        },
    };

    const handleExportCSV = () => {
        const csvData = earnings.map(item => ({
            Month: `${item._id.month}/${item._id.year}`,
            Appointments: item.count,
            Earnings: item.total,
        }));

        const headers = ['Month', 'Appointments', 'Earnings'];
        const csvContent = [
            headers.join(','),
            ...csvData.map(row =>
                [`"${row.Month}"`, row.Appointments, row.Earnings].join(',')
            ),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `earnings_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-purple-50 rounded-full blur-[100px] -ml-20 -mb-20 opacity-60"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Card */}
                <div className="mb-10 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col md:flex-row md:items-center md:justify-between transition-all duration-300">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
                                Earnings Overview
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">
                            Track your monthly profits and financial growth
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
                        <div className="relative">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="appearance-none bg-white border border-gray-200 text-gray-700 px-6 py-3 pr-10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer font-bold shadow-sm"
                            >
                                <option value="3months">Last 3 Months</option>
                                <option value="6months">Last 6 Months</option>
                                <option value="12months">Last 12 Months</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                                <FaCalendarAlt className="h-4 w-4" />
                            </div>
                        </div>

                        <button
                            onClick={handleExportCSV}
                            className="bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black flex items-center space-x-2 font-bold transition-all duration-300 shadow-xl shadow-gray-200 hover:-translate-y-0.5"
                        >
                            <FaDownload className="h-4 w-4" />
                            <span>Export Data</span>
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="group bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2.5rem] shadow-xl shadow-indigo-200 p-8 text-white relative overflow-hidden transition-all duration-300 hover:-translate-y-2">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-2">Total Earnings</p>
                                <p className="text-4xl font-extrabold tracking-tighter">
                                    ₹{totalEarnings.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                                <FaRupeeSign className="h-7 w-7 text-white" />
                            </div>
                        </div>
                        <div className="mt-6 flex items-center space-x-2 text-indigo-100/80 text-sm font-medium">
                            <span className="flex items-center bg-white/10 px-3 py-1 rounded-full border border-white/5">
                                Lifetime Revenue
                            </span>
                        </div>
                    </div>

                    <div className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-2">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Average Monthly</p>
                                <p className="text-4xl font-extrabold text-gray-900 tracking-tighter">
                                    ₹{averageEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-3xl">
                                <FaChartLine className="h-7 w-7 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-6 flex items-center space-x-2 text-green-600 text-sm font-bold">
                            <span className="bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                Steady Growth
                            </span>
                        </div>
                    </div>

                    <div className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-2">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${growth >= 0 ? 'bg-indigo-50' : 'bg-red-50'} rounded-full -mr-16 -mt-16 blur-2xl`}></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Growth Rate</p>
                                <div className="flex items-center">
                                    <p className={`text-4xl font-extrabold tracking-tighter ${growth >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                                        {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                            <div className={`${growth >= 0 ? 'bg-indigo-100' : 'bg-red-100'} p-4 rounded-3xl transition-colors`}>
                                {growth >= 0 ? (
                                    <FaArrowUp className={`h-7 w-7 ${growth >= 0 ? 'text-indigo-600' : 'text-red-600'}`} />
                                ) : (
                                    <FaArrowDown className={`h-7 w-7 ${growth >= 0 ? 'text-indigo-600' : 'text-red-600'}`} />
                                )}
                            </div>
                        </div>
                        <div className={`mt-6 flex items-center space-x-2 text-sm font-bold ${growth >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                            <span className={`${growth >= 0 ? 'bg-indigo-50 border-indigo-100' : 'bg-red-50 border-red-100'} px-3 py-1 rounded-full border`}>
                                {growth >= 0 ? 'Performing Well' : 'Action Required'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Chart Card */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-900">Monthly Earnings Trend</h2>
                            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                                <span className="text-xs font-bold text-gray-500">Earnings</span>
                            </div>
                        </div>
                        <div className="h-80 w-full">
                            {earnings.length > 0 ? (
                                <Line data={chartData} options={chartOptions} />
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-gray-500 font-medium">No earnings data available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Insights Card */}
                    <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white shadow-sm flex flex-col hover:shadow-lg transition-all">
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
                            <span className="mr-3">💡</span> Financial Insights
                        </h3>
                        {earnings.length > 0 ? (
                            <div className="space-y-5 flex-grow">
                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-100/50 group hover:border-indigo-500 transition-colors">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Top Performing Month</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {(() => {
                                            const max = earnings.reduce((m, i) => i.total > m.total ? i : m);
                                            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                                            return `${months[max._id.month - 1]} ${max._id.year}`;
                                        })()}
                                    </p>
                                    <p className="text-indigo-600 font-extrabold mt-1">₹{Math.max(...earnings.map(e => e.total)).toLocaleString()}</p>
                                </div>

                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-100/50 group hover:border-indigo-500 transition-colors">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Appointments</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {earnings.reduce((sum, item) => sum + item.count, 0)} Sessions
                                    </p>
                                    <p className="text-gray-500 text-sm font-medium mt-1">Completed across all months</p>
                                </div>

                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-100/50 group hover:border-indigo-500 transition-colors">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Per Session Avg</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        ₹{(totalEarnings / earnings.reduce((sum, item) => sum + item.count, 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                    <p className="text-indigo-600 font-extrabold mt-1">Efficient Revenue</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center">
                                <p className="text-gray-500 font-medium">No insights available</p>
                            </div>
                        )}
                        <div className="mt-8 p-6 bg-white/40 rounded-3xl border border-white/60 text-center">
                            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Financial Status</p>
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg shadow-green-200">
                                Account in Good Standing
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Breakdown Table */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Monthly Breakdown</h2>
                        <span className="bg-gray-100 px-4 py-1.5 rounded-xl text-xs font-bold text-gray-500 border border-gray-200">
                            Detailed List
                        </span>
                    </div>

                    {earnings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Month</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Appointments</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Total Earnings</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Avg / Appt</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {earnings.map((item, index) => {
                                        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                            'July', 'August', 'September', 'October', 'November', 'December'];
                                        const monthName = monthNames[item._id.month - 1];
                                        const year = item._id.year;
                                        const avgPerAppointment = item.count > 0 ? item.total / item.count : 0;

                                        return (
                                            <tr key={index} className="hover:bg-indigo-50/30 transition-colors group">
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="p-3 bg-gray-50 rounded-2xl mr-4 group-hover:bg-white transition-colors">
                                                            <FaCalendarAlt className="h-4 w-4 text-indigo-500" />
                                                        </div>
                                                        <span className="text-base font-bold text-gray-900">
                                                            {monthName} {year}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-600">
                                                        {item.count} Sessions
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className="text-lg font-extrabold text-indigo-600">
                                                        ₹{item.total.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900">₹{avgPerAppointment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                        <span className="text-[10px] uppercase font-bold text-gray-400">Net Average</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <FaChartLine className="h-10 w-10" />
                            </div>
                            <p className="text-gray-900 font-bold text-xl">No Data Found</p>
                            <p className="text-gray-500 mt-2">Earnings data will appear here once you complete appointments.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorEarnings;