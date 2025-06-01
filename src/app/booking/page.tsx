'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DateDisplay from '@/components/DateDisplay';
import { Suspense } from 'react'


function Call() {
  const searchParams = useSearchParams();
  const tourId = searchParams.get('tourId');
  const guideId = searchParams.get('guideId');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    participants: 1,
    specialRequests: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock tour data
  const tour = {
    id: tourId || '1',
    title: 'Tokyo Night Food Tour',
    duration: '3 hours',
    price: 65,
    date: date || '2023-12-15',
    time: time || '19:00',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
    guide: {
      id: guideId || '2',
      name: 'Sophia Chen',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
      rating: 5.0,
      reviews: 89
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeToTerms(e.target.checked);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (formData.paymentMethod === 'creditCard') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCVC.trim()) newErrors.cardCVC = 'CVC is required';
    }

    if (!agreeToTerms) newErrors.terms = 'You must agree to the terms and conditions';

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingComplete(true);
      // Redirect to dashboard after successful booking
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 5000);
    }, 1500);
  };

  const totalPrice = tour.price * formData.participants;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {bookingComplete ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-green-900 p-3">
              <svg className="h-10 w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
            <p className="text-lg text-gray-300 mb-6">
              Thank you for booking the {tour.title}. We've sent a confirmation email to {formData.email}.
            </p>
            <p className="text-gray-400 mb-8">
              You will be redirected to your dashboard in a few seconds...
            </p>
            <Link href="/dashboard">
              <div className="inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors">
                Go to Dashboard
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tour Information */}
            <div className="md:col-span-1">
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden sticky top-24">
                <div className="relative h-48">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{tour.title}</h2>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 relative rounded-full overflow-hidden mr-2">
                      <Image
                        src={tour.guide.image}
                        alt={tour.guide.name}
                        fill
                        sizes="32px"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="text-gray-300">with {tour.guide.name}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm">{tour.guide.rating} ({tour.guide.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Date:</span>
                      <span><DateDisplay date={tour.date} /></span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Time:</span>
                      <span>{tour.time}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Duration:</span>
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Price per person:</span>
                      <span>${tour.price}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>

                  <Link href={`/guide-profile?id=${tour.guide.id}`}>
                    <div className="w-full block text-center px-4 py-2 border border-orange-500 text-orange-400 rounded-md hover:bg-orange-900 mt-4">
                      View Guide Profile
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="md:col-span-2">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
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
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
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
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.phone ? 'border-red-500' : 'border-gray-600'}`}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="participants" className="block text-sm font-medium text-gray-300 mb-1">Number of Participants</label>
                        <input
                          type="number"
                          id="participants"
                          name="participants"
                          min="1"
                          max="10"
                          value={formData.participants}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-300 mb-1">Special Requests or Notes</label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        rows={3}
                        value={formData.specialRequests}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        placeholder="Any dietary restrictions, accessibility needs, or other requests..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="mb-6 border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="creditCard"
                          name="paymentMethod"
                          value="creditCard"
                          checked={formData.paymentMethod === 'creditCard'}
                          onChange={handleChange}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded-full bg-gray-700"
                        />
                        <label htmlFor="creditCard" className="ml-2 block text-sm text-gray-300">
                          Credit / Debit Card
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="paypal"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleChange}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded-full bg-gray-700"
                        />
                        <label htmlFor="paypal" className="ml-2 block text-sm text-gray-300">
                          PayPal
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 border-t border-gray-700 pt-6">
                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={handleCheckboxChange}
                        className={`h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700 ${errors.terms ? 'border-red-500' : ''}`}
                      />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                        I agree to the <a href="#" className="text-orange-400 hover:text-orange-300">Terms and Conditions</a> and <a href="#" className="text-orange-400 hover:text-orange-300">Privacy Policy</a>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 rounded-md text-white font-medium ${isSubmitting ? 'bg-orange-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Booking'}
                    </button>

                    <p className="mt-4 text-sm text-gray-400 text-center">
                      You won't be charged yet. We'll confirm availability with the guide first.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default function Booking() {
  return (
    <Suspense>
      <Call />
    </Suspense>
  )
} 