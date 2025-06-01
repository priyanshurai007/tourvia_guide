'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSort,
  FaMapMarkedAlt,
  FaGlobe,
  FaUserFriends,
  FaTag
} from 'react-icons/fa';
import DateDisplay from '@/components/DateDisplay';
import { Pagination } from '../guides/page';

interface Tour {
  id: number;
  name: string;
  region: string;
  country: string;
  image: string;
  status: string;
  popularityRank: number;
  tourCount: number;
  guideCount: number;
  lastUpdated: string;
  featured: boolean;
}


export default function DestinationsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');
  const [tours, setTours] = useState<Tour[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const response = await fetch(`/api/admin/tours?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }

        const data = await response.json();

        if (data.success) {
          setTours(data.guides);
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

  if (loading && tours.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl text-gray-200">Loading guides data...</p>
        </div>
      </div>
    );
  }

  if (error && tours.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Tours</h1>
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

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };



  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Destinations Management</h1>
          <p className="text-gray-400 mt-1">Manage your travel destinations and their information</p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="mt-4 md:mt-0 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition shadow-lg shadow-orange-600/20 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add New Destination
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden mb-8">
        {/* Filters */}
        <div className="p-4 border-b border-gray-700 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search destinations by name or region..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaGlobe className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                {regions.map((region, index) => (
                  <option key={index} value={region}>{region}</option>
                ))}
              </select>
            </div> */}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTag className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
              >
                <option value="All">All Destinations</option>
                <option value="Featured">Featured Only</option>
                <option value="Not Featured">Not Featured</option>
              </select>
            </div>
          </div>
        </div>

        {/* Destinations Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50 text-left">
              <tr>
                <th className="p-4 font-medium text-gray-300">Destination</th>
                <th className="p-4 font-medium text-gray-300">
                  <div className="flex items-center">
                    Region
                    <FaSort className="ml-1 text-gray-500 cursor-pointer" />
                  </div>
                </th>
                <th className="p-4 font-medium text-gray-300">
                  <div className="flex items-center">
                    Popularity
                    <FaSort className="ml-1 text-gray-500 cursor-pointer" />
                  </div>
                </th>
                <th className="p-4 font-medium text-gray-300">Tours</th>
                <th className="p-4 font-medium text-gray-300">Guides</th>
                <th className="p-4 font-medium text-gray-300">Status</th>
                <th className="p-4 font-medium text-gray-300">Featured</th>
                <th className="p-4 font-medium text-gray-300">Last Updated</th>
                <th className="p-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-400">
                    No destinations found matching your search criteria.
                  </td>
                </tr>
              ) : (
              tours.map((destination) => (
                <tr key={destination.id} className="border-t border-gray-700 hover:bg-gray-700/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden mr-3 border border-gray-600">
                        <Image
                          src={destination.image}
                          alt={destination.name}
                          fill
                          sizes="40px"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                      <span className="font-medium text-gray-200">{destination.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <FaMapMarkedAlt className="text-orange-400 mr-2" />
                      <span className="text-gray-300">{destination.region}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${destination.popularityRank <= 3 ? 'bg-green-900 text-green-300' :
                          destination.popularityRank <= 6 ? 'bg-blue-900 text-blue-300' :
                            'bg-gray-700 text-gray-300'
                        }`}>
                        {destination.popularityRank}
                      </span>
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                          style={{ width: `${Math.max(100 - (destination.popularityRank * 10), 10)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-gray-200 font-medium">{destination.tourCount}</span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <FaUserFriends className="text-gray-400 mr-1" />
                      <span className="text-gray-200">{destination.guideCount}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${destination.status === 'Active' ? 'bg-green-900/60 text-green-300 border border-green-700' :
                        'bg-red-900/60 text-red-300 border border-red-700'
                      }`}>
                      {destination.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {destination.featured ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-orange-900/60 text-orange-300 border border-orange-700">
                        Featured
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-400 border border-gray-600">
                        Not Featured
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-300">
                    <DateDisplay date={destination.lastUpdated} className="text-sm text-gray-400" />
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Destination"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="p-1 text-orange-400 hover:text-orange-300 transition-colors"
                        title="Edit Destination"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Destination"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
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
    </div>
  );
} 