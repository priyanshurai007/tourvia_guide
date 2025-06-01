'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaFilter, FaStar, FaEdit, FaTrash, FaEye, FaPlus, FaEllipsisH, FaCheck, FaTimes } from 'react-icons/fa';
import DateDisplay from '@/components/DateDisplay';
import GuideProfileModal from '@/components/admin/GuideProfileModal';

// Guide interface
interface Guide {
  id: string;
  name: string;
  location: string;
  profileImage: string;
  languages: string[];
  rating: number;
  totalRatings: number;
  status: string;
  specialties: string[];
  updatedAt: string;
  createdAt: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalRevenue: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export default function GuidesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch guides from API
  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          search: searchTerm,
          status: statusFilter
        });
        
        const response = await fetch(`/api/admin/guides?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch guides');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setGuides(data.guides);
          setPagination(data.pagination);
        } else {
          throw new Error(data.error || 'Failed to fetch guides');
        }
      } catch (err: any) {
        console.error('Error fetching guides:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuides();
  }, [searchTerm, statusFilter, pagination.page, pagination.limit]);

  const openGuideProfile = (guide: Guide) => {
    setSelectedGuide(guide);
    setIsProfileModalOpen(true);
  };
  
  const closeGuideProfile = () => {
    setIsProfileModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Loading state
  if (loading && guides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl text-gray-200">Loading guides data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && guides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Guides</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Guides Management</h1>
          <p className="text-gray-400 mt-1">Manage your tour guides and their information</p>
        </div>
        <Link 
          href="/admin/guides/new" 
          className="mt-4 md:mt-0 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition shadow-lg shadow-orange-600/20 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add New Guide
        </Link>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-700 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search guides by name, location, or specialty..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 border border-gray-600 transition">
              More Filters
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading && guides.length > 0 && (
            <div className="p-4 text-center text-gray-400">
              <div className="inline-block h-6 w-6 border-t-2 border-b-2 border-orange-500 rounded-full animate-spin mr-2"></div>
              Updating guides...
            </div>
          )}
          
          <table className="w-full">
            <thead className="bg-gray-700/50 text-left">
              <tr>
                <th className="p-4 font-medium text-gray-300">Guide</th>
                <th className="p-4 font-medium text-gray-300">Location</th>
                <th className="p-4 font-medium text-gray-300">Languages</th>
                <th className="p-4 font-medium text-gray-300">Rating</th>
                <th className="p-4 font-medium text-gray-300">Specialties</th>
                <th className="p-4 font-medium text-gray-300">Status</th>
                <th className="p-4 font-medium text-gray-300">Last Updated</th>
                <th className="p-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-400">
                    No guides found matching your criteria
                  </td>
                </tr>
              ) : (
                guides.map((guide) => (
                  <tr key={guide.id} className="border-t border-gray-700 hover:bg-gray-700/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-600">
                          <Image 
                            src={guide.profileImage} 
                            alt={guide.name} 
                            fill 
                            sizes="40px"
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        </div>
                        <span className="font-medium text-gray-200">{guide.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{guide.location}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {guide.languages.map((language, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-gray-200 font-medium mr-1">{guide.rating.toFixed(1)}</span>
                        <FaStar className="text-yellow-400" />
                        <span className="text-gray-400 text-sm ml-1">({guide.totalRatings})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {guide.specialties.map((specialty, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        guide.status === 'Active' ? 'bg-green-900/60 text-green-300 border border-green-700' : 
                        guide.status === 'Inactive' ? 'bg-red-900/60 text-red-300 border border-red-700' : 
                        guide.status === 'Pending' ? 'bg-blue-900/60 text-blue-300 border border-blue-700' :
                        'bg-yellow-900/60 text-yellow-300 border border-yellow-700'
                      }`}>
                        {guide.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">
                      <DateDisplay date={guide.updatedAt} className="text-sm text-gray-400" />
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button 
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="View Guide"
                          onClick={() => openGuideProfile(guide)}
                        >
                          <FaEye />
                        </button>
                        <Link 
                          href={`/admin/guides/edit/${guide.id}`}
                          className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Edit Guide"
                        >
                          <FaEdit />
                        </Link>
                        <button 
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Guide"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-700 flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} guides
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded ${
                      pageNum === pagination.page
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                className={`px-3 py-1 rounded ${pagination.page === pagination.totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Guide Profile Modal */}
      {isProfileModalOpen && selectedGuide && (
        <GuideProfileModal
          guide={selectedGuide}
          onClose={closeGuideProfile}
        />
      )}
    </div>
  );
} 