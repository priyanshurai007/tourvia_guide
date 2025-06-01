'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill out all required fields');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: ''
      });
    }, 1500);
  };

  // Custom staggered animation for form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        stiffness: 100
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="max-w-2xl mx-auto text-gray-300">
              Have questions about our services or need assistance planning your trip? 
              We're here to help make your travel experience exceptional.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Contact Form */}
            <div className="md:col-span-2">
              {success ? (
                <motion.div 
                  className="bg-gray-800 rounded-lg shadow-lg p-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center justify-center rounded-full bg-green-900 p-3 mb-6">
                    <svg className="h-10 w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
                  <p className="text-gray-300 mb-6">
                    Thank you for reaching out. We've received your message and will get back to you soon.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)} 
                    className="inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  className="bg-gray-800 rounded-lg shadow-lg p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
                  
                  {error && (
                    <motion.div 
                      className="bg-red-900 border border-red-800 text-red-100 px-4 py-3 rounded-md mb-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <motion.form 
                    onSubmit={handleSubmit}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <motion.div variants={itemVariants}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                          Your Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-orange-500 focus:border-orange-500"
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-orange-500 focus:border-orange-500"
                        />
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants}>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-orange-500 focus:border-orange-500"
                          />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                            Subject
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-orange-500 focus:border-orange-500"
                          />
                        </motion.div>
                      </div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                          Message <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-orange-500 focus:border-orange-500"
                        ></textarea>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                            isSubmitting ? 'bg-orange-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                          }`}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                      </motion.div>
                    </div>
                  </motion.form>
                </motion.div>
              )}
            </div>
            
            {/* Contact Information */}
            <div className="md:col-span-1">
              <motion.div 
                className="bg-gray-800 rounded-lg shadow-lg p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-medium text-orange-400 mb-2">Email Us</h3>
                    <a href="mailto:support@findyourbestguide.com" className="text-gray-300 hover:text-white block">support@findyourbestguide.com</a>
                    <a href="mailto:info@findyourbestguide.com" className="text-gray-300 hover:text-white block">info@findyourbestguide.com</a>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-medium text-orange-400 mb-2">Call Us</h3>
                    <a href="tel:+15551234567" className="text-gray-300 hover:text-white block">+1 (555) 123-4567</a>
                    <p className="text-gray-300">Monday - Friday: 9am - 6pm EST</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-lg font-medium text-orange-400 mb-2">Visit Our Office</h3>
                    <p className="text-gray-300">123 Travel Street</p>
                    <p className="text-gray-300">New York, NY 10001</p>
                    <p className="text-gray-300">United States</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-lg font-medium text-orange-400 mb-2">Office Hours</h3>
                    <p className="text-gray-300">Monday - Friday: 9am - 6pm</p>
                    <p className="text-gray-300">Saturday: 10am - 4pm</p>
                    <p className="text-gray-300">Sunday: Closed</p>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="mt-8 pt-6 border-t border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-lg font-medium mb-4">Are you a guide?</h3>
                  <TransitionLink href="/guides/join">
                    <div className="inline-block px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">
                      Join Our Platform
                    </div>
                  </TransitionLink>
                </motion.div>
              </motion.div>

              {/* Map */}
              <motion.div 
                className="bg-gray-800 rounded-lg shadow-lg mt-6 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="relative h-64 w-full">
                  <Image 
                    src="https://images.unsplash.com/photo-1553710134-0ee9de8fb19f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                    alt="Map location"
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="bg-orange-600 p-3 rounded-full shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <a 
                    href="https://maps.google.com/?q=New+York,+NY+10001" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    Get Directions →
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 