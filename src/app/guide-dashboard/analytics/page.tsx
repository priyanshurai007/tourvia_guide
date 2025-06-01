'use client';

import { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaChartBar, 
  FaStar, 
  FaUsers, 
  FaWallet, 
  FaMapMarkerAlt,
  FaFilter,
  FaDownload,
  FaCheck,
  FaTimes,
  FaUserFriends,
  FaRupeeSign,
  FaChartLine,
  FaChartPie
} from 'react-icons/fa';
import DateDisplay from '@/components/DateDisplay';

// Sample analytics data
const monthlyEarnings = [
  { month: 'Jan', amount: 32500 },
  { month: 'Feb', amount: 28000 },
  { month: 'Mar', amount: 35000 },
  { month: 'Apr', amount: 42000 },
  { month: 'May', amount: 45620 },
  { month: 'Jun', amount: 0 },
  { month: 'Jul', amount: 0 },
  { month: 'Aug', amount: 0 },
  { month: 'Sep', amount: 0 },
  { month: 'Oct', amount: 0 },
  { month: 'Nov', amount: 0 },
  { month: 'Dec', amount: 0 }
].slice(0, new Date().getMonth() + 1); // Only include months up to current month

const tourPerformance = [
  { 
    name: 'Old Delhi Heritage Tour', 
    completedTours: 28, 
    earnings: 44800, 
    avgRating: 4.8,
    reviewCount: 24,
    growth: 12 // percent growth from last month
  },
  { 
    name: 'Mumbai Heritage Walk', 
    completedTours: 22, 
    earnings: 26400, 
    avgRating: 4.7,
    reviewCount: 18,
    growth: 5
  },
  { 
    name: 'Cultural Food Tour', 
    completedTours: 35, 
    earnings: 49000, 
    avgRating: 4.9,
    reviewCount: 32,
    growth: 18
  },
  { 
    name: 'City Highlights Tour', 
    completedTours: 18, 
    earnings: 43200, 
    avgRating: 4.6,
    reviewCount: 15,
    growth: -3
  },
  { 
    name: 'Street Food Adventure', 
    completedTours: 15, 
    earnings: 18000, 
    avgRating: 4.5,
    reviewCount: 12,
    growth: 8
  }
];

const customersBySource = [
  { source: 'Website Bookings', count: 68, color: 'bg-blue-500' },
  { source: 'Mobile App', count: 42, color: 'bg-green-500' },
  { source: 'Partner Referrals', count: 25, color: 'bg-yellow-500' },
  { source: 'Travel Agencies', count: 15, color: 'bg-purple-500' },
  { source: 'Other Sources', count: 10, color: 'bg-gray-500' }
];

const recentReviews = [
  {
    id: 'R001',
    customerName: 'Vikash Gupta',
    tourName: 'Old Delhi Heritage Tour',
    rating: 5,
    comment: 'Raj was an exceptional guide who made our tour both educational and fun. His knowledge of Delhi history is impressive!',
    date: '2024-04-22'
  },
  {
    id: 'R002',
    customerName: 'Meera Shah',
    tourName: 'City Highlights Tour',
    rating: 5,
    comment: 'A fantastic experience from start to finish. The guide was knowledgeable, friendly, and showed us hidden gems we would never have found on our own.',
    date: '2024-04-20'
  },
  {
    id: 'R003',
    customerName: 'Aditya Patel',
    tourName: 'Mumbai Heritage Walk',
    rating: 4,
    comment: 'Very informative tour with great historical context. Would have liked a bit more time at certain locations.',
    date: '2024-04-15'
  }
];

// Calculate stats
const totalBookings = tourPerformance.reduce((sum, tour) => sum + tour.completedTours, 0);
const totalEarnings = tourPerformance.reduce((sum, tour) => sum + tour.earnings, 0);
const avgRating = tourPerformance.reduce((sum, tour) => sum + (tour.avgRating * tour.reviewCount), 0) / 
                 tourPerformance.reduce((sum, tour) => sum + tour.reviewCount, 0);
const totalReviews = tourPerformance.reduce((sum, tour) => sum + tour.reviewCount, 0);

// Time period options
const timePeriods = [
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'last-3-months', label: 'Last 3 Months' },
  { value: 'last-6-months', label: 'Last 6 Months' },
  { value: 'year-to-date', label: 'Year to Date' },
  { value: 'last-year', label: 'Last Year' }
];

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('this-month');
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Insights</h1>
          <p className="text-gray-400 mt-1">Track your performance, earnings, and customer satisfaction</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              {timePeriods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition shadow-lg border border-gray-600 flex items-center">
            <FaDownload className="mr-2" />
            Export Data
          </button>
        </div>
      </div>
      
      {/* Analytics Tabs */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden mb-6">
        <div className="flex overflow-x-auto border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-center font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-3 text-center font-medium whitespace-nowrap ${activeTab === 'earnings' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
          >
            Earnings
          </button>
          <button 
            onClick={() => setActiveTab('tours')}
            className={`px-4 py-3 text-center font-medium whitespace-nowrap ${activeTab === 'tours' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
          >
            Tour Performance
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-3 text-center font-medium whitespace-nowrap ${activeTab === 'reviews' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
          >
            Reviews & Ratings
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-3 text-center font-medium whitespace-nowrap ${activeTab === 'customers' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
          >
            Customer Insights
          </button>
        </div>
        
        <div className="p-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Total Bookings</p>
                      <p className="text-2xl font-bold text-white">{totalBookings}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <FaUsers className="text-blue-400" />
                    </div>
                  </div>
                  <p className="text-xs text-green-400 mt-2">+8% from last month</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">₹{totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <FaWallet className="text-green-400" />
                    </div>
                  </div>
                  <p className="text-xs text-green-400 mt-2">+12% from last month</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Avg. Rating</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-white mr-1">{avgRating.toFixed(1)}</p>
                        <FaStar className="text-yellow-500" />
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <FaStar className="text-yellow-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">From {totalReviews} reviews</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Completion Rate</p>
                      <p className="text-2xl font-bold text-white">98%</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <FaCheck className="text-orange-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">2% cancellation rate</p>
                </div>
              </div>
              
              {/* Monthly Earnings Chart */}
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 shadow mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white flex items-center">
                    <FaChartLine className="mr-2 text-orange-500" />
                    Monthly Earnings
                  </h3>
                </div>
                
                <div className="h-64">
                  <div className="flex h-48 items-end space-x-2">
                    {monthlyEarnings.map((data, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t hover:from-orange-500 hover:to-orange-300 transition-all group relative"
                          style={{ height: `${data.amount > 0 ? (data.amount / 50000) * 100 : 0}%` }}
                        >
                          {data.amount > 0 && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap">
                              ₹{data.amount.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{data.month}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-400">Total: </span>
                        <span className="text-white font-medium">₹{totalEarnings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Highest: </span>
                        <span className="text-white font-medium">
                          ₹{Math.max(...monthlyEarnings.map(item => item.amount)).toLocaleString()} ({monthlyEarnings.find(m => m.amount === Math.max(...monthlyEarnings.map(item => item.amount)))?.month})
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Average: </span>
                        <span className="text-white font-medium">
                          ₹{(monthlyEarnings.reduce((sum, item) => sum + item.amount, 0) / monthlyEarnings.length).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Top Performing Tours */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg border border-gray-600 shadow overflow-hidden">
                  <div className="p-4 border-b border-gray-600">
                    <h3 className="font-medium text-white flex items-center">
                      <FaChartBar className="mr-2 text-orange-500" />
                      Top Performing Tours
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {tourPerformance.slice(0, 3).map((tour, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-3 text-white font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-white">{tour.name}</span>
                              <span className="text-sm text-white">₹{tour.earnings.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>{tour.completedTours} tours</span>
                              <div className="flex items-center">
                                <FaStar className="text-yellow-500 mr-1" size={10} />
                                <span>{tour.avgRating} ({tour.reviewCount})</span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-gray-600 rounded-full mt-2 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                                style={{ width: `${(tour.earnings / tourPerformance[0].earnings) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Customer Sources */}
                <div className="bg-gray-700 rounded-lg border border-gray-600 shadow overflow-hidden">
                  <div className="p-4 border-b border-gray-600">
                    <h3 className="font-medium text-white flex items-center">
                      <FaChartPie className="mr-2 text-orange-500" />
                      Customer Booking Sources
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-center mb-2">
                        <div className="relative w-32 h-32">
                          <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
                          {customersBySource.map((source, i) => {
                            const total = customersBySource.reduce((sum, s) => sum + s.count, 0);
                            const percentage = (source.count / total) * 100;
                            let rotation = 0;
                            for (let j = 0; j < i; j++) {
                              rotation += (customersBySource[j].count / total) * 360;
                            }
                            
                            return (
                              <div 
                                key={i}
                                className={`absolute inset-0 ${source.color}`}
                                style={{
                                  clipPath: `conic-gradient(from ${rotation}deg, transparent 0%, transparent 0%, currentColor 0%, currentColor ${percentage}%, transparent ${percentage}%, transparent 100%)`,
                                  borderRadius: '9999px'
                                }}
                              ></div>
                            );
                          })}
                          <div className="absolute inset-4 bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {customersBySource.reduce((sum, s) => sum + s.count, 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {customersBySource.map((source, i) => (
                          <div key={i} className="flex items-center text-sm">
                            <div className={`w-3 h-3 rounded-full ${source.color} mr-2`}></div>
                            <div className="flex-1 flex justify-between">
                              <span className="text-gray-300">{source.source}</span>
                              <span className="text-white">{source.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div>
              <p className="text-gray-400 text-center py-20">
                Earnings analytics content would be displayed here.
              </p>
            </div>
          )}
          
          {/* Tours Tab */}
          {activeTab === 'tours' && (
            <div>
              <p className="text-gray-400 text-center py-20">
                Tour performance analytics would be displayed here.
              </p>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Overall Rating</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-white mr-1">{avgRating.toFixed(1)}</p>
                        <FaStar className="text-yellow-500" />
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <FaStar className="text-yellow-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Based on {totalReviews} reviews</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">5-Star Reviews</p>
                      <p className="text-2xl font-bold text-white">78%</p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-yellow-500 mx-0.5" size={14} />
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-600 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Review Response Rate</p>
                      <p className="text-2xl font-bold text-white">92%</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <FaCheck className="text-green-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">3 reviews pending response</p>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg border border-gray-600 shadow overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-600">
                  <h3 className="font-medium text-white">Recent Reviews</h3>
                </div>
                
                <div className="divide-y divide-gray-600">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="p-4">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-white">{review.customerName}</h4>
                          <p className="text-sm text-gray-400">{review.tourName}</p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < review.rating ? "text-yellow-500" : "text-gray-600"} 
                              size={14}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{review.comment}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400"><DateDisplay date={review.date} /></span>
                        <button className="text-xs text-orange-500 hover:text-orange-400">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-600 text-center">
                  <a href="#" className="text-sm text-orange-500 hover:text-orange-400">
                    View All Reviews
                  </a>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg border border-gray-600 shadow overflow-hidden">
                <div className="p-4 border-b border-gray-600">
                  <h3 className="font-medium text-white">Rating Distribution</h3>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const percent = rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 1 : 1;
                      return (
                        <div key={rating} className="flex items-center">
                          <div className="w-12 flex items-center">
                            <span className="text-sm text-white mr-1">{rating}</span>
                            <FaStar className="text-yellow-500" size={12} />
                          </div>
                          <div className="flex-1 mx-3">
                            <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${rating >= 4 ? 'bg-green-500' : rating === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-12 text-right">
                            <span className="text-sm text-gray-400">{percent}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div>
              <p className="text-gray-400 text-center py-20">
                Customer insights analytics would be displayed here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 