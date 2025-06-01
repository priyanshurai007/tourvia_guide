'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaRupeeSign, 
  FaTrashAlt, 
  FaEdit, 
  FaEye, 
  FaPlus,
  FaSort,
  FaToggleOn,
  FaToggleOff,
  FaEllipsisV,
  FaTimes,
  FaUpload,
  FaInfoCircle
} from 'react-icons/fa';
import DateDisplay from '@/components/DateDisplay';

// Define Tour interface based on database structure
interface Tour {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  maxParticipants: number;
  status: string;
  bookings: number;
  rating: number;
  lastUpdated: string;
  upcoming: number;
}

// Tour Form Interface
interface TourFormData {
  name: string;
  description: string;
  location: string;
  duration: string;
  price: string;
  maxParticipants: string;
  image: File | null;
  status: 'Draft' | 'Active' | 'Inactive';
}

export default function ToursManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [activeView, setActiveView] = useState('grid');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TourFormData>({
    name: '',
    description: '',
    location: '',
    duration: '',
    price: '',
    maxParticipants: '',
    image: null,
    status: 'Draft'
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Fetch tours from API when component mounts
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        setLoadingError(null);
        
        const response = await fetch('/api/tours/guide-tours');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tours');
        }
        
        setTours(data.tours || []);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setLoadingError(error instanceof Error ? error.message : 'Failed to load tours');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTours();
  }, []);
  
  // Filter tours based on search and filters
  const filteredTours = tours.filter(tour => {
    const matchesSearch = 
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tour.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort filtered tours
  const sortedTours = [...filteredTours].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'oldest':
        return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'popular':
        return b.bookings - a.bookings;
      default:
        return 0;
    }
  });
  
  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-900/60 text-green-300 border border-green-700';
      case 'inactive':
        return 'bg-red-900/60 text-red-300 border border-red-700';
      case 'draft':
        return 'bg-yellow-900/60 text-yellow-300 border border-yellow-700';
      default:
        return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (!file) {
      setFormData(prev => ({
        ...prev,
        image: null
      }));
      setImagePreview(null);
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be under 5MB');
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Image must be JPG, PNG, GIF, or WebP format');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      image: file
    }));
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setImagePreview(null);
      setFormData(prev => ({
        ...prev,
        image: null
      }));
      alert('Error reading image file. Please try a different file.');
    };
    reader.readAsDataURL(file);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      duration: '',
      price: '',
      maxParticipants: '',
      image: null,
      status: 'Draft'
    });
    setImagePreview(null);
    setFormError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.name || !formData.description || !formData.location || 
        !formData.duration || !formData.price || !formData.maxParticipants) {
      setFormError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Create FormData object for file upload
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('location', formData.location);
      submitFormData.append('duration', formData.duration);
      submitFormData.append('price', formData.price);
      submitFormData.append('maxParticipants', formData.maxParticipants);
      submitFormData.append('status', formData.status);
      
      // Handle image separately with proper error checking
      if (formData.image) {
        console.log('Adding image to form data', formData.image.name, formData.image.size, formData.image.type);
        
        // Check file size (5MB limit)
        if (formData.image.size > 5 * 1024 * 1024) {
          throw new Error('Image size must be under 5MB');
        }
        
        // Verify file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(formData.image.type)) {
          throw new Error('Image must be JPG, PNG, GIF, or WebP format');
        }
        
        submitFormData.append('image', formData.image);
      }
      
      // Send data to API with increased timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/tours/create', {
        method: 'POST',
        body: submitFormData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create tour');
      }
      
      console.log('Tour created successfully:', data);
      
      // Close modal and reset form
      setIsModalOpen(false);
      resetForm();
      
      // Show success message
      alert('Tour created successfully!');
      
      // Refresh the tour list with the latest data including the new tour
      const refreshResponse = await fetch('/api/tours/guide-tours');
      const refreshData = await refreshResponse.json();
      
      if (refreshResponse.ok) {
        setTours(refreshData.tours || []);
      } else {
        // If refresh fails, just reload the page
        window.location.reload();
      }
      
    } catch (error) {
      console.error('Error creating tour:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to create tour. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tour Management</h1>
          <p className="text-gray-400 mt-1">Create and manage your tour listings</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition shadow-lg shadow-orange-600/20 flex items-center text-sm"
        >
          <FaPlus className="mr-2" />
          Create New Tour
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-700 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tours by name, location, or keywords..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSort className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            
            <div className="flex border border-gray-600 rounded-md overflow-hidden">
              <button
                className={`px-3 py-2 ${activeView === 'grid' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
                onClick={() => setActiveView('grid')}
              >
                Grid
              </button>
              <button
                className={`px-3 py-2 ${activeView === 'list' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
                onClick={() => setActiveView('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-400">Loading your tours...</span>
          </div>
        ) : loadingError ? (
          <div className="p-8 text-center">
            <p className="text-red-400 mb-4">{loadingError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {activeView === 'grid' && (
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedTours.map((tour) => (
                    <div key={tour.id} className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px]">
                      <div className="relative h-40">
                        <Image 
                          src={tour.image} 
                          alt={tour.name} 
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                          unoptimized
                          loader={({ src }) => src}
                          priority={true}
                        />
                        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs ${getStatusColor(tour.status)}`}>
                          {tour.status}
                        </span>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-white mb-1">{tour.name}</h3>
                        
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <FaMapMarkerAlt className="mr-1" size={12} />
                          {tour.location}
                        </div>
                        
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mb-3">
                          <div className="flex items-center">
                            <FaClock className="mr-1" size={10} />
                            {tour.duration}
                          </div>
                          <div className="flex items-center">
                            <FaUsers className="mr-1" size={10} />
                            Max: {tour.maxParticipants}
                          </div>
                          <div className="flex items-center">
                            <FaRupeeSign className="mr-1" size={10} />
                            {tour.price} per person
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-400">
                            <div>Bookings: <span className="text-white">{tour.bookings}</span></div>
                            {tour.upcoming > 0 && (
                              <div className="text-orange-400">{tour.upcoming} upcoming</div>
                            )}
                          </div>
                          
                          <div className="flex gap-1">
                            <Link 
                              href={`/guide-dashboard/tours/${tour.id}`}
                              className="p-2 bg-gray-800 text-blue-400 hover:text-blue-300 rounded"
                            >
                              <FaEye size={14} />
                            </Link>
                            <Link 
                              href={`/guide-dashboard/tours/${tour.id}/edit`}
                              className="p-2 bg-gray-800 text-orange-400 hover:text-orange-300 rounded"
                            >
                              <FaEdit size={14} />
                            </Link>
                            <button 
                              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded relative"
                              onClick={() => toggleDropdown(tour.id)}
                            >
                              <FaEllipsisV size={14} />
                              
                              {showDropdown === tour.id && (
                                <div className="absolute mt-2 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 w-36">
                                  <button 
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                                  >
                                    {tour.status.toLowerCase() === 'active' ? (
                                      <>
                                        <FaToggleOff className="mr-2" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <FaToggleOn className="mr-2" />
                                        Activate
                                      </>
                                    )}
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center"
                                  >
                                    <FaTrashAlt className="mr-2" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* List View */}
            {activeView === 'list' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50 text-left">
                    <tr>
                      <th className="p-4 font-medium text-gray-300">Tour</th>
                      <th className="p-4 font-medium text-gray-300">Location</th>
                      <th className="p-4 font-medium text-gray-300">Duration</th>
                      <th className="p-4 font-medium text-gray-300">Price</th>
                      <th className="p-4 font-medium text-gray-300">Bookings</th>
                      <th className="p-4 font-medium text-gray-300">Status</th>
                      <th className="p-4 font-medium text-gray-300">Last Updated</th>
                      <th className="p-4 font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTours.map((tour) => (
                      <tr key={tour.id} className="border-t border-gray-700 hover:bg-gray-700/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-3 border border-gray-600">
                              <Image 
                                src={tour.image} 
                                alt={tour.name} 
                                fill 
                                sizes="48px"
                                style={{ objectFit: "cover" }}
                                unoptimized
                                loader={({ src }) => src}
                                priority={true}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{tour.name}</h3>
                              <div className="text-xs text-gray-400">#{tour.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{tour.location}</td>
                        <td className="p-4 text-gray-300">{tour.duration}</td>
                        <td className="p-4 text-gray-300">₹{tour.price}</td>
                        <td className="p-4">
                          <div className="text-white">{tour.bookings} total</div>
                          {tour.upcoming > 0 && (
                            <div className="text-xs text-orange-400">{tour.upcoming} upcoming</div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(tour.status)}`}>
                            {tour.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">
                          <DateDisplay date={tour.lastUpdated} className="text-sm" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2 relative">
                            <Link 
                              href={`/guide-dashboard/tours/${tour.id}`}
                              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded transition-colors" 
                              title="View Tour"
                            >
                              <FaEye size={14} />
                            </Link>
                            <Link 
                              href={`/guide-dashboard/tours/${tour.id}/edit`}
                              className="p-1.5 text-orange-400 hover:text-orange-300 hover:bg-orange-900/30 rounded transition-colors" 
                              title="Edit Tour"
                            >
                              <FaEdit size={14} />
                            </Link>
                            <button 
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" 
                              title="More Options"
                              onClick={() => toggleDropdown(tour.id)}
                            >
                              <FaEllipsisV size={14} />
                              
                              {showDropdown === tour.id && (
                                <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 w-36">
                                  <button 
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                                  >
                                    {tour.status.toLowerCase() === 'active' ? (
                                      <>
                                        <FaToggleOff className="mr-2" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <FaToggleOn className="mr-2" />
                                        Activate
                                      </>
                                    )}
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center"
                                  >
                                    <FaTrashAlt className="mr-2" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {sortedTours.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-400 mb-4">No tours found matching your search criteria.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-block px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                >
                  Create Your First Tour
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Create Tour Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Create New Tour</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tour Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Historical Walking Tour"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Delhi, India"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 2 hours"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., 1500"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Max Participants <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., 8"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-400">
                      <FaInfoCircle className="inline mr-1" />
                      Draft tours won't be visible to travelers
                    </p>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 h-32 resize-none"
                      placeholder="Provide a detailed description of your tour..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tour Image
                    </label>
                    <div className="mt-1 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Tour preview" 
                            className="mx-auto h-40 object-cover rounded"
                          />
                          <div className="mt-2 text-xs text-gray-400">
                            {formData.image && `${formData.image.name} (${Math.round(formData.image.size / 1024)} KB)`}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image: null }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <div className="flex flex-col items-center">
                            <FaUpload className="text-gray-400 mb-2" size={32} />
                            <span className="text-gray-400">Click to upload an image</span>
                            <span className="text-gray-500 text-xs mt-1">JPG, PNG or GIF up to 5MB</span>
                          </div>
                          <input
                            type="file"
                            name="image"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-700 pt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⟳</span>
                      Creating...
                    </>
                  ) : (
                    'Create Tour'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 