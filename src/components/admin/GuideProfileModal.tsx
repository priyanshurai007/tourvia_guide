'use client';

import React from 'react';
import { FaStar, FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLanguage, FaUser, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import Image from 'next/image';

interface Guide {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  languages: string[];
  specialties: string[];
  rating: number;
  totalRatings: number;
  status: string;
  totalBookings: number;
  confirmedBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

interface GuideProfileModalProps {
  guide: Guide;
  onClose: () => void;
}

const GuideProfileModal: React.FC<GuideProfileModalProps> = ({ guide, onClose }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes size={24} />
        </button>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Profile Image */}
            <div className="w-full md:w-1/3">
              <div className="aspect-square relative rounded-xl overflow-hidden border-4 border-gray-700">
                <Image 
                  src={guide.profileImage} 
                  alt={guide.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
              
              <div className="mt-4 bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Status</h3>
                <span className={`px-3 py-1 inline-block rounded-full text-sm ${
                  guide.status === 'Active' ? 'bg-green-900/60 text-green-300 border border-green-700' : 
                  guide.status === 'Inactive' ? 'bg-red-900/60 text-red-300 border border-red-700' : 
                  guide.status === 'Pending' ? 'bg-blue-900/60 text-blue-300 border border-blue-700' :
                  'bg-yellow-900/60 text-yellow-300 border border-yellow-700'
                }`}>
                  {guide.status}
                </span>
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold text-white mb-2">{guide.name}</h2>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-white font-semibold">{guide.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-400">{guide.totalRatings} reviews</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <FaEnvelope className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{guide.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaPhone className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">{guide.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white">{guide.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaCalendarAlt className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Joined</p>
                    <p className="text-white">{formatDate(guide.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {guide.languages.map((language, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm flex items-center"
                    >
                      <FaLanguage className="mr-1 text-blue-400" />
                      {language}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {guide.specialties.map((specialty, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Statistics Section */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="font-semibold text-white text-xl mb-4">Guide Performance</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-gray-400 text-sm">Total Bookings</h4>
                <p className="text-2xl font-bold text-white">{guide.totalBookings}</p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-gray-400 text-sm">Total Revenue</h4>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(guide.totalRevenue)}</p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-gray-400 text-sm">Average Rating</h4>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-white mr-1">{guide.rating.toFixed(1)}</p>
                  <FaStar className="text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-gray-400 text-sm">Last Updated</h4>
                <p className="text-xl font-bold text-white">{formatDate(guide.updatedAt)}</p>
              </div>
            </div>
            
            {/* Booking Breakdown */}
            {(guide.confirmedBookings !== undefined || guide.completedBookings !== undefined || guide.cancelledBookings !== undefined) && (
              <div className="mt-6">
                <h4 className="font-semibold text-white mb-3">Booking Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {guide.confirmedBookings !== undefined && (
                    <div className="bg-blue-900/40 border border-blue-800 p-4 rounded-lg">
                      <h5 className="text-gray-300 text-sm">Confirmed</h5>
                      <p className="text-xl font-bold text-blue-400">{guide.confirmedBookings}</p>
                    </div>
                  )}
                  
                  {guide.completedBookings !== undefined && (
                    <div className="bg-green-900/40 border border-green-800 p-4 rounded-lg">
                      <h5 className="text-gray-300 text-sm">Completed</h5>
                      <p className="text-xl font-bold text-green-400">{guide.completedBookings}</p>
                    </div>
                  )}
                  
                  {guide.cancelledBookings !== undefined && (
                    <div className="bg-red-900/40 border border-red-800 p-4 rounded-lg">
                      <h5 className="text-gray-300 text-sm">Cancelled</h5>
                      <p className="text-xl font-bold text-red-400">{guide.cancelledBookings}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <a 
              href={`/admin/guides/edit/${guide.id}`}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-500 transition-colors"
            >
              Edit Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideProfileModal; 