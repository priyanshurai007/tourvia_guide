'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Image from 'next/image';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaSave
} from 'react-icons/fa';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    role: 'Super Admin',
    email: 'admin@indianguide.com',
    phone: '+91 98765 43210',
    location: 'Delhi, India',
    bio: 'Experienced administrator managing Indian Guide platform operations and guide approvals since 2020.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  });

  const [formData, setFormData] = useState({ ...adminData });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    setAdminData({ ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...adminData });
    setIsEditing(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Profile"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header with Avatar and Toggle Edit Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500">
              <Image 
                src={adminData.avatar}
                alt={adminData.name}
                fill
                className="object-cover"
                sizes="64px"
                priority
              />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-white">{adminData.name}</h3>
              <p className="text-orange-400">{adminData.role}</p>
            </div>
          </div>
          <button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
              isEditing 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            {isEditing ? 'Cancel' : <><FaEdit className="mr-2" /> Edit Profile</>}
          </button>
        </div>

        {/* Profile Info or Edit Form */}
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Avatar URL</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center"
              >
                <FaSave className="mr-2" /> Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <FaEnvelope className="text-orange-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <div className="text-white">{adminData.email}</div>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-orange-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm text-gray-400">Phone</div>
                  <div className="text-white">{adminData.phone}</div>
                </div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-orange-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm text-gray-400">Location</div>
                  <div className="text-white">{adminData.location}</div>
                </div>
              </div>
              <div className="flex items-start">
                <FaUser className="text-orange-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm text-gray-400">Role</div>
                  <div className="text-white">{adminData.role}</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-start">
                <div className="w-full">
                  <div className="text-sm text-gray-400 mb-2">Bio</div>
                  <div className="text-white">{adminData.bio}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Section */}
        <div className="pt-6 border-t border-gray-700">
          <h4 className="text-lg font-medium text-white mb-4">Security</h4>
          <div className="space-y-3">
            <button
              className="w-full text-left px-4 py-3 bg-gray-700 rounded-md hover:bg-gray-600 transition duration-200 flex items-center justify-between"
            >
              <span className="text-white">Change Password</span>
              <span className="text-orange-400">→</span>
            </button>
            <button
              className="w-full text-left px-4 py-3 bg-gray-700 rounded-md hover:bg-gray-600 transition duration-200 flex items-center justify-between"
            >
              <span className="text-white">Two-Factor Authentication</span>
              <span className="text-gray-400 text-sm">Not Enabled</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
} 