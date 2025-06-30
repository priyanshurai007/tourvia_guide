"use client";

import { useState, useEffect } from "react";
import TransitionLink from "./TransitionLink";
import { useRouter } from "next/navigation";
import GuideSearchBar from "./GuideSearchBar";
import { useAuth } from "../hooks/useAuth";

export default function ClientHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { isLoggedIn, userRole, userName, checkAuthStatus } = useAuth();

  useEffect(() => {
    // Initial check
    checkAuthStatus();
  }, [checkAuthStatus]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      // Call the server-side logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Clear client-side data regardless of API response
      // Update component state
      const event = new Event("userLoggedOut");
      window.dispatchEvent(event);

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    }
  };

  // Function to render dashboard link for logged-in users
  const renderDashboardLink = (className: string, onClick?: () => void) => {
    if (isLoggedIn) {
      // Get the correct dashboard URL based on user role
      let dashboardUrl = "/"; // Default for students

      if (userRole === "guide") {
        dashboardUrl = "/guide-dashboard";
      } else if (userRole === "admin") {
        dashboardUrl = "/admin-dashboard";
      }

      return (
        <TransitionLink
          href={dashboardUrl}
          className={className}
          onClick={onClick}
        >
          Dashboard
        </TransitionLink>
      );
    }
    return null;
  };

  return (
    <header className="bg-gray-800 shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between h-auto md:h-16 gap-2 md:gap-0">
          {/* Logo and site name */}
          <div className="flex justify-center md:justify-start items-center md:w-1/4 w-full order-1 md:order-none mb-2 md:mb-0">
            <TransitionLink href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white whitespace-nowrap">
                Find Your Best Guide
              </span>
            </TransitionLink>
          </div>

          {/* Navigation Links - Centered */}
          <div className="flex-1 flex justify-center items-center order-2 md:order-none w-full md:w-2/4">
            <nav className="flex items-center space-x-2 md:space-x-4">
              <TransitionLink
                href="/search-guides"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Find Guides
              </TransitionLink>
              <TransitionLink
                href="/about"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                About
              </TransitionLink>
              <TransitionLink
                href="/contact"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Contact
              </TransitionLink>
              <TransitionLink
                href="/guides/join"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Become a Guide
              </TransitionLink>
              {renderDashboardLink(
                "px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            </nav>
          </div>

          {/* Search Bar & Auth - Right */}
          <div className="flex items-center justify-end md:w-1/4 w-full order-3 md:order-none gap-2">
            <div className="hidden md:flex md:items-center">
              <GuideSearchBar onSearch={setSearchQuery} />
            </div>
            <div className="flex md:ml-2">
              {!isLoggedIn ? (
                <TransitionLink
                  href="/login"
                  className="px-4 py-2 text-sm text-orange-400 font-medium rounded-md hover:bg-gray-700"
                >
                  Login
                </TransitionLink>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700"
                >
                  Logout
                </button>
              )}
            </div>
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-2">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 shadow-lg border-b border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <TransitionLink
              href="/search-guides"
              className="block px-3 py-2 rounded-md textbase font-medium text-white bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Guides
            </TransitionLink>
            <TransitionLink
              href="/about"
              className="block px-3 py-2 rounded-md textbase font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </TransitionLink>
            <TransitionLink
              href="/contact"
              className="block px-3 py-2 rounded-md textbase font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </TransitionLink>
            <TransitionLink
              href="/guides/join"
              className="block px-3 py-2 rounded-md textbase font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Become a Guide
            </TransitionLink>
            {renderDashboardLink(
              "block px-3 py-2 rounded-md textbase font-medium text-gray-300 hover:bg-gray-700 hover:text-white",
              () => setMobileMenuOpen(false)
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-3 px-5">
              {!isLoggedIn ? (
                <>
                  <TransitionLink
                    href="/login"
                    className="w-full px-4 py-2 text-center text-sm text-orange-400 font-medium rounded-md border border-orange-400 hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </TransitionLink>
                  <TransitionLink
                    href="/signup"
                    className="w-full px-4 py-2 text-center text-sm bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </TransitionLink>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-center text-sm bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
