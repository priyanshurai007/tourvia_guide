'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';
import { motion } from 'framer-motion';

export default function GuideJoin() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    languages: '',
    experience: '',
    bio: '',
    specialties: [],
    agreeToTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Specialty options
  const specialtyOptions = [
    "Food & Culinary",
    "History & Culture",
    "Adventure & Outdoors",
    "Art & Museums",
    "Nightlife",
    "Photography",
    "Shopping",
    "Local Traditions",
    "Architecture"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      if (name === 'agreeToTerms') {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      } else {
        // Handle specialties (multi-select checkboxes)
        setFormData(prev => {
          const updatedSpecialties = [...prev.specialties] as string[];
          
          if (checked) {
            updatedSpecialties.push(value);
          } else {
            const index = updatedSpecialties.indexOf(value);
            if (index !== -1) {
              updatedSpecialties.splice(index, 1);
            }
          }
          
          return {
            ...prev,
            specialties: updatedSpecialties
          };
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (stepNumber === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }
    
    if (stepNumber === 2) {
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.country.trim()) newErrors.country = 'Country is required';
      if (!formData.languages.trim()) newErrors.languages = 'Languages are required';
    }
    
    if (stepNumber === 3) {
      if (!formData.experience.trim()) newErrors.experience = 'Experience information is required';
      if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
      if (formData.bio.length < 100) newErrors.bio = 'Bio should be at least 100 characters';
      if (formData.specialties.length === 0) newErrors.specialties = 'Please select at least one specialty';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      window.scrollTo(0, 0);
    }, 1500);
  };

  // Create a staggered animation effect for form fields and sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
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
        stiffness: 80
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 text-white py-12">
        {/* Header with animated elements */}
        <motion.div 
          className="relative h-64 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1473625247510-8ceb1760943f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1499&q=80" 
              alt="Local guide"
              fill
              style={{ objectFit: "cover" }}
              className="opacity-30"
              unoptimized
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-transparent opacity-50"></div>
          <motion.div 
            className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">Become a Local Guide</h1>
            <p className="text-xl max-w-3xl">
              Share your passion for your city, earn income, and help travelers discover authentic experiences.
            </p>
          </motion.div>
        </motion.div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {success ? (
            <motion.div 
              className="bg-gray-800 rounded-lg shadow-lg p-10 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="inline-flex items-center justify-center rounded-full bg-green-900 p-3 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <svg className="h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Application Submitted!
              </motion.h2>
              <motion.p 
                className="text-gray-300 mb-6 text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Thank you for applying to be a guide on Find Your Best Guide. We've received your application and will review it shortly. You'll hear back from us within 2-3 business days.
              </motion.p>
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <TransitionLink href="/">
                  <motion.div 
                    className="inline-block bg-orange-600 text-white px-8 py-3 rounded-md hover:bg-orange-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Return to Home
                  </motion.div>
                </TransitionLink>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Progress bar with animation */}
              <div className="bg-gray-700 h-2">
                <motion.div 
                  className="bg-orange-600 h-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.4 }}
                ></motion.div>
              </div>
              
              <div className="p-8">
                <motion.div 
                  className="flex justify-between mb-8"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold">
                    {step === 1 && "Personal Information"}
                    {step === 2 && "Location & Languages"}
                    {step === 3 && "Experience & Specialties"}
                  </h2>
                  <div className="text-gray-400">Step {step} of 3</div>
                </motion.div>
                
                <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
                  {/* Each step gets a motion container for staggered animation */}
                  {step === 1 && (
                    <motion.div 
                      className="space-y-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                            First Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.firstName ? 'border-red-500' : 'border-gray-600'}`}
                          />
                          {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                            Last Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.lastName ? 'border-red-500' : 'border-gray-600'}`}
                          />
                          {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
                        </div>
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
                          className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.phone ? 'border-red-500' : 'border-gray-600'}`}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {/* Step 2: Location & Languages */}
                  {step === 2 && (
                    <motion.div 
                      className="space-y-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                            City <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.city ? 'border-red-500' : 'border-gray-600'}`}
                          />
                          {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                            Country <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.country ? 'border-red-500' : 'border-gray-600'}`}
                          />
                          {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country}</p>}
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="languages" className="block text-sm font-medium text-gray-300 mb-1">
                          Languages Spoken <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="languages"
                          name="languages"
                          value={formData.languages}
                          onChange={handleChange}
                          placeholder="English, Spanish, French, etc."
                          className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.languages ? 'border-red-500' : 'border-gray-600'}`}
                        />
                        {errors.languages && <p className="mt-1 text-sm text-red-400">{errors.languages}</p>}
                        <p className="mt-1 text-xs text-gray-400">Separate multiple languages with commas</p>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {/* Step 3: Experience & Specialties */}
                  {step === 3 && (
                    <motion.div 
                      className="space-y-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants}>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1">
                          Years of Experience <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.experience ? 'border-red-500' : 'border-gray-600'}`}
                        >
                          <option value="">Select years of experience</option>
                          <option value="Less than 1 year">Less than 1 year</option>
                          <option value="1-2 years">1-2 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5-10 years">5-10 years</option>
                          <option value="10+ years">10+ years</option>
                        </select>
                        {errors.experience && <p className="mt-1 text-sm text-red-400">{errors.experience}</p>}
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                          Tell us about yourself <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={5}
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Share your background, why you want to be a guide, and what makes your tours special..."
                          className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.bio ? 'border-red-500' : 'border-gray-600'}`}
                        ></textarea>
                        {errors.bio && <p className="mt-1 text-sm text-red-400">{errors.bio}</p>}
                        <p className="mt-1 text-xs text-gray-400">Minimum 100 characters</p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Specialties <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {specialtyOptions.map((specialty) => (
                            <div key={specialty} className="flex items-center">
                              <input
                                type="checkbox"
                                id={specialty}
                                name="specialties"
                                value={specialty}
                                checked={formData.specialties.includes(specialty)}
                                onChange={handleChange}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700"
                              />
                              <label htmlFor={specialty} className="ml-2 block text-sm text-gray-300">
                                {specialty}
                              </label>
                            </div>
                          ))}
                        </div>
                        {errors.specialties && <p className="mt-1 text-sm text-red-400">{errors.specialties}</p>}
                      </motion.div>
                      
                      <motion.div 
                        className="mt-6"
                        variants={itemVariants}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="agreeToTerms"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className={`h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700 ${errors.agreeToTerms ? 'border-red-500' : ''}`}
                          />
                          <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300">
                            I agree to the <a href="#" className="text-orange-400 hover:text-orange-300">Terms and Conditions</a> and <a href="#" className="text-orange-400 hover:text-orange-300">Privacy Policy</a>
                          </label>
                        </div>
                        {errors.agreeToTerms && <p className="mt-1 text-sm text-red-400">{errors.agreeToTerms}</p>}
                      </motion.div>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className="mt-8 flex justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {step > 1 ? (
                      <motion.button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
                        whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Back
                      </motion.button>
                    ) : (
                      <div></div> // Empty div to maintain spacing
                    )}
                    
                    {step < 3 ? (
                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                        whileHover={{ scale: 1.05, backgroundColor: "#c2410c" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Continue
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-md text-white ${
                          isSubmitting ? 'bg-orange-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                        whileHover={!isSubmitting ? { scale: 1.05, backgroundColor: "#c2410c" } : {}}
                        whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </motion.button>
                    )}
                  </motion.div>
                </form>
              </div>
            </motion.div>
          )}
          
          {/* Benefits Section with staggered animations */}
          {!success && (
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center">Benefits of Becoming a Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="bg-gray-800 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="inline-flex items-center justify-center rounded-full bg-orange-900 p-3 mb-4">
                    <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Earn Extra Income</h3>
                  <p className="text-gray-300">Set your own rates and schedule. Keep 80% of what you charge.</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-800 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="inline-flex items-center justify-center rounded-full bg-orange-900 p-3 mb-4">
                    <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Meet New People</h3>
                  <p className="text-gray-300">Connect with travelers from around the world and build your network.</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-800 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="inline-flex items-center justify-center rounded-full bg-orange-900 p-3 mb-4">
                    <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Share Your Passion</h3>
                  <p className="text-gray-300">Showcase the best of your city and culture in your own unique way.</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
} 