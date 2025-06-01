'use client';

import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  FaHome, FaUserFriends, FaMapMarkedAlt, FaCalendarAlt, 
  FaChartBar, FaRegStar, FaCommentDots, FaCog, FaSignOutAlt, FaBars, FaTimes,
  FaUsers, FaComments, FaBell, FaUserCircle
} from 'react-icons/fa';
import ProfileModal from '@/components/admin/ProfileModal';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const pathname = usePathname();

  useEffect(() => {
    // Get admin name from localStorage
    const userName = localStorage.getItem('userName');
    if (userName) {
      setAdminName(userName);
    }
    
    // Check for admin role
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      // Redirect if not admin - this is a fallback protection
      window.location.href = '/login';
    }
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: FaHome },
    { name: 'Guides', href: '/admin/guides', icon: FaUserFriends },
    { name: 'Destinations', href: '/admin/destinations', icon: FaMapMarkedAlt },
    { name: 'Bookings', href: '/admin/bookings', icon: FaCalendarAlt },
    { name: 'Users', href: '/admin/users', icon: FaUsers },
    { name: 'Analytics', href: '/admin/analytics', icon: FaChartBar },
    { name: 'Reviews', href: '/admin/reviews', icon: FaRegStar },
    { name: 'Customer Support', href: '/admin/customer-support', icon: FaCommentDots },
    { name: 'Settings', href: '/admin/settings', icon: FaCog },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false);

  const handleSignOut = () => {
    // Clear all localStorage items
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    // Clear cookies - this will be fully handled by the server
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-gray-800 z-30 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-orange-500">IndianGuide</span>
            <span className="text-white font-bold">Admin</span>
          </Link>
          <button className="lg:hidden text-white" onClick={toggleSidebar}>
            <FaTimes size={24} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-70px)] px-4 py-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500">
              <Image 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
                alt="Admin" 
                fill 
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="font-medium text-white">{adminName}</p>
              <p className="text-sm text-gray-400">Super Admin</p>
            </div>
          </div>
          
          <nav className="space-y-1 flex-1 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${pathname === link.href ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <link.icon className="mr-3 h-5 w-5" />
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-gray-700">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors mb-2"
            >
              <FaHome className="mr-3 h-5 w-5" />
              <span>View Website</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-3 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors w-full"
            >
              <FaSignOutAlt className="mr-3 h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 shadow-md border-b border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              className="lg:hidden text-gray-300 hover:text-white transition-colors" 
              onClick={toggleSidebar}
            >
              <FaBars size={24} />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              <button className="relative text-gray-300 hover:text-white transition-colors">
                <FaBell size={20} />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <span className="text-gray-400">|</span>
              <button 
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
                onClick={openProfileModal}
              >
                <div className="flex items-center">
                  <FaUserCircle className="w-5 h-5 mr-2" />
                  <div className="text-sm">
                    Welcome, <span className="font-semibold text-white group-hover:text-orange-400 transition-colors">{adminName}</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-900">
          {children}
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={profileModalOpen} onClose={closeProfileModal} />
    </div>
  );
} 