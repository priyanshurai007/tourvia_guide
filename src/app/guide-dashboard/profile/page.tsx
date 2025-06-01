'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaGlobe, 
  FaStar, 
  FaCamera, 
  FaLanguage, 
  FaUpload, 
  FaSave, 
  FaTrash,
  FaSpinner
} from 'react-icons/fa';

// Define guide data interface
interface GuideData {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  about?: string;
  profileImage?: string;
  coverImage?: string;
  rating?: number;
  reviews?: number;
  languages?: string[];
  website?: string;
  specialties?: string[];
  experience?: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  verificationStatus?: string;
  certifications?: Array<{ name: string; year: string; verificationStatus: string }>;
  galleryImages?: string[];
}

// Default fallback data
const defaultGuideData: GuideData = {
  id: '',
  name: '',
  email: '',
  phone: '',
  location: 'Delhi, India',
  about: 'No description available',
  profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077',
  rating: 0,
  reviews: 0,
  languages: ['English'],
  website: '',
  specialties: ['Tours'],
  experience: 0,
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: ''
  },
  verificationStatus: 'Pending',
  certifications: [],
  galleryImages: []
};

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profile, setProfile] = useState<GuideData>(defaultGuideData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fetch guide data from API
  useEffect(() => {
    fetchGuideData();
  }, []);
  
  // Function to fetch guide data
  const fetchGuideData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/guides/profile');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch guide data');
      }
      
      if (data.success && data.guide) {
        // Transform API data to match our interface
        const guideData: GuideData = {
          id: data.guide.id,
          name: data.guide.name || defaultGuideData.name,
          email: data.guide.email || defaultGuideData.email,
          phone: data.guide.phone || defaultGuideData.phone,
          location: data.guide.location || defaultGuideData.location,
          about: data.guide.about || defaultGuideData.about,
          profileImage: data.guide.avatar || defaultGuideData.profileImage,
          coverImage: data.guide.coverImage || defaultGuideData.coverImage,
          languages: data.guide.languages || defaultGuideData.languages,
          website: data.guide.website || defaultGuideData.website,
          specialties: data.guide.specialties || defaultGuideData.specialties,
          socialMedia: data.guide.socialMedia || defaultGuideData.socialMedia,
          rating: data.guide.rating || defaultGuideData.rating,
          reviews: data.guide.reviews || defaultGuideData.reviews,
          verificationStatus: data.guide.verificationStatus || defaultGuideData.verificationStatus,
          experience: data.guide.experience || defaultGuideData.experience,
          certifications: data.guide.certifications || defaultGuideData.certifications,
          galleryImages: data.guide.galleryImages || defaultGuideData.galleryImages
        };
        
        setProfile(guideData);
      }
    } catch (error) {
      console.error('Error fetching guide data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddLanguage = () => {
    if (newLanguage && profile.languages && !profile.languages.includes(newLanguage)) {
      setProfile({
        ...profile,
        languages: [...profile.languages, newLanguage]
      });
      setNewLanguage('');
    }
  };
  
  const handleRemoveLanguage = (language: string) => {
    if (profile.languages) {
      setProfile({
        ...profile,
        languages: profile.languages.filter(lang => lang !== language)
      });
    }
  };
  
  const handleAddSpecialty = () => {
    if (newSpecialty && profile.specialties && !profile.specialties.includes(newSpecialty)) {
      setProfile({
        ...profile,
        specialties: [...profile.specialties, newSpecialty]
      });
      setNewSpecialty('');
    }
  };
  
  const handleRemoveSpecialty = (specialty: string) => {
    if (profile.specialties) {
      setProfile({
        ...profile,
        specialties: profile.specialties.filter(spec => spec !== specialty)
      });
    }
  };
  
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      // Prepare data for API
      const dataToSave = {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        about: profile.about,
        website: profile.website,
        languages: profile.languages,
        specialties: profile.specialties,
        experience: profile.experience,
        socialMedia: profile.socialMedia,
        // Keeping image fields separate as they would typically be handled differently
        // with dedicated file upload endpoints
        avatar: profile.profileImage,
        coverImage: profile.coverImage
      };
      
      // Send data to API
      const response = await fetch('/api/guides/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }
      
      // Refresh guide data to reflect the changes
      await fetchGuideData();
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      
      // Exit edit mode
      setIsEditMode(false);
      
      // Set a timer to clear the success message
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-orange-500 mr-2" size={24} />
        <span className="text-gray-300">Loading profile data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
        <p>Error loading profile: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Success message alert */}
      {successMessage && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6 text-green-200 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="text-green-200 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Cover and Profile Image */}
      <div className="relative rounded-lg overflow-hidden mb-6 bg-gray-800 border border-gray-700">
        <div className="h-48 md:h-64 relative">
          <Image 
            src={profile.coverImage || defaultGuideData.coverImage} 
            alt="Cover" 
            fill 
            style={{ objectFit: "cover" }}
            className="bg-gray-700"
            unoptimized
          />
          {isEditMode && (
            <button className="absolute right-4 bottom-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full">
              <FaCamera size={20} />
            </button>
          )}
        </div>
        
        <div className="px-4 md:px-6 pb-6 pt-16 relative">
          <div className="absolute -top-16 left-6 rounded-full overflow-hidden border-4 border-gray-800 shadow-lg bg-gray-700 w-24 h-24 md:w-32 md:h-32 relative">
            <Image 
              src={profile.profileImage || defaultGuideData.profileImage} 
              alt={profile.name} 
              fill 
              style={{ objectFit: "cover" }}
              unoptimized
            />
            {isEditMode && (
              <button className="absolute inset-0 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white opacity-0 hover:opacity-100 transition">
                <FaCamera size={24} />
              </button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <FaMapMarkerAlt className="mr-1" size={14} />
                {profile.location}
                {profile.verificationStatus === 'Verified' && (
                  <span className="ml-3 px-2 py-0.5 bg-green-900/50 text-green-300 rounded-full text-xs border border-green-700 flex items-center">
                    Verified
                  </span>
                )}
              </div>
            </div>
            
            {!isEditMode ? (
              <button 
                onClick={() => setIsEditMode(true)}
                className="mt-4 md:mt-0 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button 
                  onClick={() => setIsEditMode(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Tabs and Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Tabs and Main Info */}
        <div className="md:col-span-2">
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden mb-6">
            <div className="flex border-b border-gray-700">
              <button 
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-3 text-center text-sm font-medium flex-1 ${activeTab === 'basic' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
              >
                Basic Info
              </button>
              <button 
                onClick={() => setActiveTab('specialties')}
                className={`px-4 py-3 text-center text-sm font-medium flex-1 ${activeTab === 'specialties' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
              >
                Specialties
              </button>
              <button 
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-3 text-center text-sm font-medium flex-1 ${activeTab === 'gallery' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
              >
                Gallery
              </button>
            </div>
            
            <div className="p-4 md:p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">About Me</label>
                    {isEditMode ? (
                      <textarea 
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500"
                        rows={4}
                        value={profile.about || ''}
                        onChange={(e) => setProfile({...profile, about: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-300">{profile.about}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                      {isEditMode ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                          </div>
                          <input 
                            type="email" 
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-300">
                          <FaEnvelope className="text-gray-400 mr-2" />
                          {profile.email}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                      {isEditMode ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone className="text-gray-400" />
                          </div>
                          <input 
                            type="tel" 
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
                            value={profile.phone || ''}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-300">
                          <FaPhone className="text-gray-400 mr-2" />
                          {profile.phone || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Continue with the remaining form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                      {isEditMode ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaMapMarkerAlt className="text-gray-400" />
                          </div>
                          <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
                            value={profile.location || ''}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-300">
                          <FaMapMarkerAlt className="text-gray-400 mr-2" />
                          {profile.location}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Website</label>
                      {isEditMode ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaGlobe className="text-gray-400" />
                          </div>
                          <input 
                            type="url" 
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
                            value={profile.website || ''}
                            onChange={(e) => setProfile({...profile, website: e.target.value})}
                            placeholder="https://example.com"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-300">
                          <FaGlobe className="text-gray-400 mr-2" />
                          {profile.website ? (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                              {profile.website}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Specialties Tab */}
              {activeTab === 'specialties' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-400">Languages</label>
                      <div className="flex items-center text-gray-400 text-sm">
                        <FaLanguage className="mr-1" />
                        <span>{profile.languages?.length || 0} languages</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.languages?.map((language) => (
                        <div 
                          key={language} 
                          className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full flex items-center"
                        >
                          {language}
                          {isEditMode && (
                            <button
                              onClick={() => handleRemoveLanguage(language)}
                              className="ml-2 text-gray-400 hover:text-red-400"
                            >
                              <FaTrash size={10} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {isEditMode && (
                      <div className="flex items-center mt-3">
                        <input 
                          type="text" 
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          placeholder="Add language"
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <button 
                          onClick={handleAddLanguage}
                          className="px-3 py-2 bg-orange-600 text-white rounded-r-md hover:bg-orange-700"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-400">Specialties</label>
                      <div className="flex items-center text-gray-400 text-sm">
                        <span>{profile.specialties?.length || 0} specialties</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.specialties?.map((specialty) => (
                        <div 
                          key={specialty} 
                          className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full flex items-center"
                        >
                          {specialty}
                          {isEditMode && (
                            <button
                              onClick={() => handleRemoveSpecialty(specialty)}
                              className="ml-2 text-gray-400 hover:text-red-400"
                            >
                              <FaTrash size={10} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {isEditMode && (
                      <div className="flex items-center mt-3">
                        <input 
                          type="text" 
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                          placeholder="Add specialty"
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <button 
                          onClick={handleAddSpecialty}
                          className="px-3 py-2 bg-orange-600 text-white rounded-r-md hover:bg-orange-700"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Experience (Years)</label>
                    {isEditMode ? (
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
                        value={profile.experience || 0}
                        onChange={(e) => setProfile({...profile, experience: parseInt(e.target.value)})}
                        min="0"
                      />
                    ) : (
                      <p className="text-gray-300">
                        {profile.experience ? `${profile.experience} years` : 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-400">Photo Gallery</label>
                    {isEditMode && (
                      <button className="px-3 py-1 bg-orange-600 text-white rounded flex items-center text-sm hover:bg-orange-700">
                        <FaUpload className="mr-2" />
                        Upload Photos
                      </button>
                    )}
                  </div>
                  
                  {profile.galleryImages && profile.galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {profile.galleryImages.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-700">
                          <Image 
                            src={image} 
                            alt={`Gallery image ${index + 1}`} 
                            fill
                            style={{ objectFit: "cover" }}
                            className="hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                          {isEditMode && (
                            <button className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-80 hover:opacity-100">
                              <FaTrash size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {isEditMode && (
                        <div className="flex items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-600 hover:border-orange-500 transition-colors cursor-pointer">
                          <div className="text-center">
                            <FaUpload className="mx-auto text-gray-400 mb-2" size={24} />
                            <span className="text-sm text-gray-400">Add Photo</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg">
                      <FaCamera className="mx-auto text-gray-500 mb-3" size={36} />
                      <p className="text-gray-400 mb-2">No photos in your gallery yet</p>
                      {isEditMode && (
                        <button className="px-4 py-2 bg-orange-600 text-white rounded mt-2 hover:bg-orange-700">
                          Upload Your First Photo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Stats and Certifications */}
        <div>
          {/* Statistics Card */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">Statistics</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400">Rating</div>
                <div className="flex items-center">
                  <FaStar className="text-orange-500 mr-1" />
                  <span className="text-white font-medium">{profile.rating || '0.0'}</span>
                  <span className="text-gray-400 text-sm ml-1">/ 5.0</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400">Reviews</div>
                <div className="text-white font-medium">{profile.reviews || 0}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-gray-400">Experience</div>
                <div className="text-white font-medium">
                  {profile.experience ? `${profile.experience} years` : 'Not specified'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Certifications Card */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Certifications</h2>
              {isEditMode && (
                <button className="text-sm text-orange-500 hover:text-orange-400">
                  + Add New
                </button>
              )}
            </div>
            <div className="p-4">
              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="space-y-4">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded-lg relative">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-white">{cert.name}</h3>
                        {isEditMode && (
                          <button className="text-gray-400 hover:text-red-400">
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Year: {cert.year}</p>
                      <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs ${
                        cert.verificationStatus === 'Verified' 
                          ? 'bg-green-900/50 text-green-300 border border-green-700' 
                          : 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                      }`}>
                        {cert.verificationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-2">No certifications added yet</p>
                  {isEditMode && (
                    <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                      Add Certification
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 