'use client';

import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaStar, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

// Staggered animation variants for lists
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 50
    }
  }
};

// Hero slider data
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    heading: "Discover India with local guides",
    subheading: "Explore ancient temples, majestic palaces and authentic cultural experiences with knowledgeable locals."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1514222788835-3a1a1d5b32f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1449&q=80",
    heading: "Experience India like a local",
    subheading: "Access unique insights and secret spots only locals know about, from hidden temples to authentic food experiences."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1590766740616-0e8f29493cb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    heading: "Create unforgettable Indian memories",
    subheading: "Experience authentic adventures tailored to your interests across India's diverse landscapes and cultures."
  }
];

interface DecodedToken {
  id: string;
  exp: number;
  role?: string;
}

export default function Home() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if the user is logged in and redirect to dashboard
    const checkAuthAndRedirect = () => {
      try {
        // Get token from cookies
        const token = getCookie('token');
        
        if (token) {
          // If token exists, validate format and try to decode it
          if (typeof token === 'string' && token.split('.').length === 3) {
            try {
              const decoded = jwtDecode<DecodedToken>(token);
              const currentTime = Math.floor(Date.now() / 1000);
              
              // If token is not expired, redirect to dashboard
              if (decoded && decoded.exp > currentTime) {
                router.push('/dashboard');
                return;
              }
            } catch (error) {
              console.error('Error decoding token:', error);
            }
          } else {
            console.warn('Invalid token format in home page');
          }
        }
        
        // If not redirected, show the home page by setting loading to false
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setLoading(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);
  
  useEffect(() => {
    // Auto-rotate slides
    const interval = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };
  
  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };
  
  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="bg-gray-900 text-white">
        {/* Hero Section with Slider */}
        <section className="relative h-[90vh]">
          {/* Slide Images */}
          <div className="absolute inset-0 w-full h-full">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
              >
        <Image
                  src={slide.image} 
                  alt={slide.heading} 
                  fill 
          priority
                  className="object-cover brightness-[0.6]"
                  sizes="100vw"
                  quality={90}
                />
              </div>
            ))}
          </div>
          
          {/* Slide Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`max-w-3xl transition-all duration-700 transform ${
                    index === current
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10 absolute'
                  }`}
                >
                  <div className="text-shadow-lg">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                      {slide.heading}
                    </h1>
                    <p className="text-xl mb-8 text-white">
                      {slide.subheading}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <TransitionLink href="/search-guides">
                      <motion.div 
                        className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-md text-lg font-medium inline-flex items-center justify-center shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaSearch className="mr-2" />
                        Find a Guide
                      </motion.div>
                    </TransitionLink>
                    <TransitionLink href="/guides/join">
                      <motion.div 
                        className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white py-3 px-8 rounded-md text-lg font-medium inline-flex items-center justify-center transition-colors shadow-xl backdrop-blur-sm bg-black bg-opacity-10"
                        whileHover={{ scale: 1.05, backgroundColor: "white", color: "#111827" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Become a Guide
                      </motion.div>
                    </TransitionLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Slider Controls - Dots */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
            <div className="flex space-x-2 bg-black bg-opacity-40 px-4 py-2 rounded-full">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === current 
                      ? 'bg-white w-8 h-3' 
                      : 'bg-gray-400 w-3 h-3 bg-opacity-60 hover:bg-opacity-90'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Slider Controls - Arrows */}
          <div className="absolute inset-x-0 top-1/2 z-30 flex justify-between items-center px-4 md:px-10 transform -translate-y-1/2 pointer-events-none">
            <button 
              onClick={prevSlide}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 md:p-4 rounded-full transition-colors duration-300 shadow-xl pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous slide"
            >
              <FaChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 md:p-4 rounded-full transition-colors duration-300 shadow-xl pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next slide"
            >
              <FaChevronRight size={20} />
            </button>
          </div>
        </section>
        
        {/* Top Guides Section */}
        <motion.section 
          className="py-20 bg-gray-800"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Top Guides</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">Experienced locals passionate about sharing their hometown's secrets and creating unforgettable experiences for travelers.</p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Guide Card 1 */}
              <motion.div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg" variants={itemVariants}>
                <div className="relative h-48">
                  <Image 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                    alt="Raj Mehta" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform hover:scale-105 duration-500 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">Raj Mehta</h3>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 mb-4">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>Mumbai, India</span>
                  </div>
                  <p className="text-gray-300 mb-4">Mumbai native with expertise in heritage sites, street food, and Bollywood culture. Experience the vibrant spirit of India's largest city.</p>
                  <TransitionLink href="/guides/raj-mehta">
                    <motion.div 
                      className="block text-center bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Profile
                    </motion.div>
                  </TransitionLink>
                </div>
              </motion.div>
              
              {/* Guide Card 2 */}
              <motion.div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg" variants={itemVariants}>
                <div className="relative h-48">
                  <Image 
                    src="https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=689&q=80" 
                    alt="Kavita Singh" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform hover:scale-105 duration-500 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">Kavita Singh</h3>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 mb-4">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>Varanasi, India</span>
                  </div>
                  <p className="text-gray-300 mb-4">Born into a family of Varanasi musicians, I offer unique insights into spiritual traditions, sacred ceremonies, and classical music of India's oldest city.</p>
                  <TransitionLink href="/guides/kavita-singh">
                    <motion.div 
                      className="block text-center bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Profile
                    </motion.div>
                  </TransitionLink>
                </div>
              </motion.div>
              
              {/* Guide Card 3 */}
              <motion.div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg" variants={itemVariants}>
                <div className="relative h-48">
            <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                    alt="Rahul Verma" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform hover:scale-105 duration-500 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">Rahul Verma</h3>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 mb-4">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>Agra, India</span>
                  </div>
                  <p className="text-gray-300 mb-4">Mughal history expert with specialized knowledge of the Taj Mahal and Agra Fort. Discover hidden stories and architectural secrets of these iconic monuments.</p>
                  <TransitionLink href="/guides/rahul-verma">
                    <motion.div 
                      className="block text-center bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Profile
                    </motion.div>
                  </TransitionLink>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <TransitionLink href="/search-guides">
                <motion.div 
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-md text-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore All Guides
                </motion.div>
              </TransitionLink>
            </motion.div>
        </div>
        </motion.section>
        
        {/* Popular Destinations Section */}
        <motion.section 
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Royal Palaces & Destinations of India</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">Discover the majestic palaces and enchanting destinations of India with our expert local guides who know all the secret stories and hidden chambers.</p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Jaipur - City Palace */}
              <motion.div 
                className="rounded-xl overflow-hidden shadow-xl bg-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                variants={itemVariants}
              >
                <div className="relative h-64">
                  <Image 
                    src="https://images.unsplash.com/photo-1599661046827-9d1be56d4043?auto=format&fit=crop&q=80&w=1470"
                    alt="City Palace, Jaipur" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform duration-700 hover:scale-110 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">City Palace, Jaipur</h3>
                    <div className="flex items-center text-gray-300 text-sm mb-2">
                      <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> Rajasthan</span>
                      <span className="mx-2">•</span>
                      <span>15 Guides</span>
                    </div>
                    <TransitionLink href="/destinations/jaipur">
                      <motion.div 
                        className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 text-sm"
                        whileHover={{ x: 5 }}
                      >
                        Discover <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </motion.div>
                    </TransitionLink>
                  </div>
                </div>
              </motion.div>
              
              {/* Udaipur - Lake Palace */}
              <motion.div 
                className="rounded-xl overflow-hidden shadow-xl bg-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                variants={itemVariants}
              >
                <div className="relative h-64">
                  <Image 
                    src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1476" 
                    alt="Lake Palace, Udaipur" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform duration-700 hover:scale-110 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">Lake Palace, Udaipur</h3>
                    <div className="flex items-center text-gray-300 text-sm mb-2">
                      <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> Rajasthan</span>
                      <span className="mx-2">•</span>
                      <span>12 Guides</span>
                    </div>
                    <TransitionLink href="/destinations/udaipur">
                      <motion.div 
                        className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 text-sm"
                        whileHover={{ x: 5 }}
                      >
                        Discover <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </motion.div>
                    </TransitionLink>
                  </div>
                </div>
              </motion.div>
              
              {/* Mysore Palace */}
              <motion.div 
                className="rounded-xl overflow-hidden shadow-xl bg-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                variants={itemVariants}
              >
                <div className="relative h-64">
                  <Image 
                    src="https://images.unsplash.com/photo-1602536052359-ef94c19743c4?auto=format&fit=crop&q=80&w=1475" 
                    alt="Mysore Palace, Karnataka" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform duration-700 hover:scale-110 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">Mysore Palace</h3>
                    <div className="flex items-center text-gray-300 text-sm mb-2">
                      <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> Karnataka</span>
                      <span className="mx-2">•</span>
                      <span>10 Guides</span>
                    </div>
                    <TransitionLink href="/destinations/mysore">
                      <motion.div 
                        className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 text-sm"
                        whileHover={{ x: 5 }}
                      >
                        Discover <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </motion.div>
                    </TransitionLink>
                  </div>
                </div>
              </motion.div>
              
              {/* Taj Mahal */}
              <motion.div 
                className="rounded-xl overflow-hidden shadow-xl bg-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                variants={itemVariants}
              >
                <div className="relative h-64">
                  <Image 
                    src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1471" 
                    alt="Taj Mahal, Agra" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform duration-700 hover:scale-110 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">Taj Mahal</h3>
                    <div className="flex items-center text-gray-300 text-sm mb-2">
                      <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> Uttar Pradesh</span>
                      <span className="mx-2">•</span>
                      <span>18 Guides</span>
                    </div>
                    <TransitionLink href="/destinations/agra">
                      <motion.div 
                        className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 text-sm"
                        whileHover={{ x: 5 }}
                      >
                        Discover <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </motion.div>
                    </TransitionLink>
                  </div>
                </div>
              </motion.div>
              
              {/* Varanasi Ghats */}
              <motion.div 
                className="rounded-xl overflow-hidden shadow-xl bg-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                variants={itemVariants}
              >
                <div className="relative h-64">
                  <Image 
                    src="https://images.unsplash.com/photo-1511543462076-90896abd383d?auto=format&fit=crop&q=80&w=1471" 
                    alt="Varanasi Ghats" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform duration-700 hover:scale-110 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">Varanasi Ghats</h3>
                    <div className="flex items-center text-gray-300 text-sm mb-2">
                      <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> Uttar Pradesh</span>
                      <span className="mx-2">•</span>
                      <span>14 Guides</span>
                    </div>
                    <TransitionLink href="/destinations/varanasi">
                      <motion.div 
                        className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 text-sm"
                        whileHover={{ x: 5 }}
                      >
                        Discover <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </motion.div>
                    </TransitionLink>
                  </div>
                </div>
              </motion.div>
              
              {/* Hawa Mahal */}
              <motion.div 
                className="rounded-xl overflow-hidden shadow-xl bg-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                variants={itemVariants}
              >
                <div className="relative h-64">
                  <Image 
                    src="https://images.unsplash.com/photo-1599661046288-89b8be1a53a3?auto=format&fit=crop&q=80&w=1470" 
                    alt="Hawa Mahal, Jaipur" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform duration-700 hover:scale-110 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">Hawa Mahal</h3>
                    <div className="flex items-center text-gray-300 text-sm mb-2">
                      <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> Rajasthan</span>
                      <span className="mx-2">•</span>
                      <span>13 Guides</span>
                    </div>
                    <TransitionLink href="/destinations/jaipur">
                      <motion.div 
                        className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 text-sm"
                        whileHover={{ x: 5 }}
                      >
                        Discover <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </motion.div>
                    </TransitionLink>
                  </div>
                </div>
              </motion.div>
              
              {/* Red Fort */}
              <motion.div 
                className="rounded-xl overflow-hidden shadow-xl bg-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                variants={itemVariants}
              >
                <div className="relative h-64">
                  <Image 
                    src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1470" 
                    alt="Red Fort, Delhi" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform duration-700 hover:scale-110 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">Red Fort</h3>
                    <div className="flex items-center text-gray-300 text-sm mb-2">
                      <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> Delhi</span>
                      <span className="mx-2">•</span>
                      <span>16 Guides</span>
                    </div>
                    <TransitionLink href="/destinations/delhi">
                      <motion.div 
                        className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 text-sm"
                        whileHover={{ x: 5 }}
                      >
                        Discover <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </motion.div>
                    </TransitionLink>
                  </div>
                </div>
              </motion.div>
              
              {/* Kerala Backwaters */}
              <motion.div 
                className="rounded-xl overflow-hidden shadow-xl bg-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                variants={itemVariants}
              >
                <div className="relative h-64">
          <Image
                    src="https://images.unsplash.com/photo-1609340440248-f5a410415cf1?auto=format&fit=crop&q=80&w=1470" 
                    alt="Kerala Backwaters" 
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="transition-transform duration-700 hover:scale-110 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">Kerala Backwaters</h3>
                    <div className="flex items-center text-gray-300 text-sm mb-2">
                      <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> Kerala</span>
                      <span className="mx-2">•</span>
                      <span>11 Guides</span>
                    </div>
                    <TransitionLink href="/destinations/kerala">
                      <motion.div 
                        className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 text-sm"
                        whileHover={{ x: 5 }}
                      >
                        Discover <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </motion.div>
                    </TransitionLink>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <TransitionLink href="/destinations">
                <motion.div 
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-md text-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Destinations
                </motion.div>
              </TransitionLink>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Testimonials Section */}
        <motion.section 
          className="py-20 bg-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Travelers Say</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">Read about the amazing experiences others have had with our local guides.</p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Testimonial 1 */}
              <motion.div 
                className="bg-gray-900 p-8 rounded-lg shadow-md"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image 
                      src="https://randomuser.me/api/portraits/women/12.jpg" 
                      alt="Sarah Johnson" 
                      width={56} 
                      height={56} 
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-bold">Sarah Johnson</div>
                    <div className="text-gray-400 text-sm">New York, USA</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 mr-1" />
                  ))}
                </div>
                <p className="text-gray-300">"Raj was an incredible guide in Mumbai! He showed us hidden corners we would never have found on our own and shared fascinating stories about the city's history and Bollywood culture."</p>
              </motion.div>
              
              {/* Testimonial 2 */}
              <motion.div 
                className="bg-gray-900 p-8 rounded-lg shadow-md"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="David Chen" 
                      width={56} 
                      height={56} 
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-bold">David Chen</div>
                    <div className="text-gray-400 text-sm">Toronto, Canada</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`${i < 5 ? 'text-yellow-400' : 'text-gray-600'} mr-1`} />
                  ))}
                </div>
                <p className="text-gray-300">"Kavita's knowledge of Varanasi's spiritual traditions was incredible. She took us to witness the Ganga Aarti ceremony from a perfect spot and even arranged a private classical music performance."</p>
              </motion.div>
              
              {/* Testimonial 3 */}
              <motion.div 
                className="bg-gray-900 p-8 rounded-lg shadow-md"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
          <Image
                      src="https://randomuser.me/api/portraits/women/68.jpg" 
                      alt="Emma Wilson" 
                      width={56} 
                      height={56} 
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-bold">Emma Wilson</div>
                    <div className="text-gray-400 text-sm">London, UK</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 mr-1" />
                  ))}
                </div>
                <p className="text-gray-300">"Rahul made our Taj Mahal visit unforgettable! His insights into Mughal history and architecture were fascinating, and he took us at sunrise to avoid crowds and get the perfect photos."</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* CTA Section */}
        <motion.section 
          className="py-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-80">
          <Image
                src="/images/cta-bg.jpg" 
                alt="Join Our Community" 
                fill 
                sizes="100vw"
                className="brightness-25 object-cover"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to explore with a local guide?</h2>
              <p className="text-xl text-gray-300 mb-8">Discover authentic experiences and hidden gems on your next adventure.</p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <TransitionLink href="/search-guides">
                  <motion.div 
                    className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-md text-lg font-medium inline-flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Find Your Guide Today
                  </motion.div>
                </TransitionLink>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
    </div>
    </PageTransition>
  );
}
