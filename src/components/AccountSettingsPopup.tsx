'use client';

import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaGlobe, FaCalendarAlt, FaSave, FaSpinner } from 'react-icons/fa';

interface AccountSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    dob?: string;
    avatar?: string;
    bio?: string;
    preferences?: {
      tourTypes?: string[];
      languages?: string[];
    };
  };
}

export default function AccountSettingsPopup({ isOpen, onClose, userData }: AccountSettingsProps) {
  const [formData, setFormData] = useState({
    phone: userData.phone || '',
    location: userData.location || '',
    dob: userData.dob || '',
    bio: userData.bio || '',
    preferences: {
      tourTypes: userData.preferences?.tourTypes || [],
      languages: userData.preferences?.languages || []
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tourType, setTourType] = useState('');
  const [language, setLanguage] = useState('');
  
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // ESC key to close
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addTourType = () => {
    if (tourType && !formData.preferences.tourTypes.includes(tourType)) {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          tourTypes: [...prev.preferences.tourTypes, tourType]
        }
      }));
      setTourType('');
    }
  };
  
  const removeTourType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        tourTypes: prev.preferences.tourTypes.filter(t => t !== type)
      }
    }));
  };
  
  const addLanguage = () => {
    if (language && !formData.preferences.languages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          languages: [...prev.preferences.languages, language]
        }
      }));
      setLanguage('');
    }
  };
  
  const removeLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        languages: prev.preferences.languages.filter(l => l !== lang)
      }
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      setSuccess('Profile updated successfully!');
      
      // Close after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Complete Your Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-md text-red-200">
              {error}
            </div>
          )}
          
          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-md text-green-200">
              {success}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Bio
              </label>
              <textarea
                name="bio"
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                placeholder="Tell guides about yourself and your travel preferences..."
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    placeholder="+91 12345 67890"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    placeholder="Mumbai, India"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="dob"
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Tour Types
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.preferences.tourTypes.map((type, index) => (
                  <div 
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full flex items-center"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => removeTourType(type)}
                      className="ml-2 text-gray-400 hover:text-red-400"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400"
                  placeholder="Add tour preference..."
                  value={tourType}
                  onChange={(e) => setTourType(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTourType())}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-orange-600 text-white rounded-r-md hover:bg-orange-700"
                  onClick={addTourType}
                >
                  Add
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Languages You Speak
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.preferences.languages.map((lang, index) => (
                  <div 
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full flex items-center"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="ml-2 text-gray-400 hover:text-red-400"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400"
                  placeholder="Add language..."
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-orange-600 text-white rounded-r-md hover:bg-orange-700"
                  onClick={addLanguage}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md mr-3 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition flex items-center"
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
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 