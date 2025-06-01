import { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaInfoCircle, FaLanguage, FaTimes, FaSpinner } from 'react-icons/fa';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  about?: string;
  languages?: string[];
  interests?: string[];
  avatar?: string;
}

const defaultProfile: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  location: '',
  about: '',
  languages: [],
  interests: []
};

export default function AccountSettingsModal({ isOpen, onClose, onUpdate }: AccountSettingsModalProps) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      // Fetch user data from dashboard API since we're already authenticated there
      const response = await fetch('/api/dashboard/user-dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to load user data');
      }
      
      const data = await response.json();
      
      if (data.success && data.userData) {
        // Extract relevant profile data
        setProfile({
          id: data.userData.id || '',
          name: data.userData.name || '',
          email: data.userData.email || '',
          phone: data.userData.phone || '',
          location: data.userData.location || '',
          about: data.userData.about || '',
          languages: data.userData.languages || [],
          interests: data.userData.interests || [],
          avatar: data.userData.avatar
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage && !profile.languages?.includes(newLanguage)) {
      setProfile(prev => ({
        ...prev,
        languages: [...(prev.languages || []), newLanguage]
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages?.filter(lang => lang !== language) || []
    }));
  };

  const handleAddInterest = () => {
    if (newInterest && !profile.interests?.includes(newInterest)) {
      setProfile(prev => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests?.filter(item => item !== interest) || []
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (profile.phone && !/^\+?[\d\s-()]{8,20}$/.test(profile.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/users/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setSuccessMessage('Profile updated successfully!');
      
      // Optionally reload the profile data
      await loadProfile();
      
      // Notify parent component
      if (onUpdate) {
        onUpdate();
      }
      
      // Auto close after a delay
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({submit: error instanceof Error ? error.message : 'Failed to update profile'});
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-700 p-5">
          <h2 className="text-xl font-bold text-white">Account Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isSaving}
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        {successMessage && (
          <div className="m-5 p-3 bg-green-900/30 border border-green-600 rounded-md text-green-200">
            {successMessage}
          </div>
        )}
        
        {errors.submit && (
          <div className="m-5 p-3 bg-red-900/30 border border-red-600 rounded-md text-red-200">
            {errors.submit}
          </div>
        )}
        
        <div className="overflow-y-auto p-5" style={{ maxHeight: 'calc(90vh - 70px)' }}>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="animate-spin text-orange-500 mr-2" size={20} />
              <span>Loading your profile...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-md p-2.5 text-white focus:ring-orange-500 focus:border-orange-500`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <FaPhone className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-md p-2.5 text-white focus:ring-orange-500 focus:border-orange-500`}
                    placeholder="Your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 text-white focus:ring-orange-500 focus:border-orange-500"
                    placeholder="City, Country"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  <FaInfoCircle className="inline mr-2" />
                  About You
                </label>
                <textarea
                  name="about"
                  value={profile.about || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 text-white focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Tell us about yourself and your travel preferences..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  <FaLanguage className="inline mr-2" />
                  Languages You Speak
                </label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {profile.languages?.map((language, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full flex items-center text-sm"
                    >
                      {language}
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(language)}
                        className="ml-2 text-gray-400 hover:text-red-400"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add a language"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-l-md p-2.5 text-white focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    className="px-4 py-2.5 bg-orange-600 text-white rounded-r-md hover:bg-orange-700 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Travel Interests
                </label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {profile.interests?.map((interest, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full flex items-center text-sm"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="ml-2 text-gray-400 hover:text-red-400"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add interest (e.g., Hiking, Food, Culture)"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-l-md p-2.5 text-white focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-4 py-2.5 bg-orange-600 text-white rounded-r-md hover:bg-orange-700 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                  disabled={isSaving}
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
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 