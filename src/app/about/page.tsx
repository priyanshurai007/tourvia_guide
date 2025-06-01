'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12">
      {/* Hero Section */}
      <section className="relative bg-orange-600 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
            alt="People traveling together"
            fill
            className="opacity-20"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Our Mission: Connect Travelers With Local Experts</h1>
            <p className="text-xl mb-8">
              We're building a platform that makes it easy to discover and book personalized experiences
              with local guides who are passionate about sharing their culture, history, and hidden gems.
            </p>
            <Link href="/search-guides">
              <div className="inline-block bg-white text-orange-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                Find a Guide
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="md:flex md:items-center md:space-x-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Our founding team"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                TourGuide Connect was born from a simple idea: travel is better with local insights. Our founders, Alex and Maya, experienced this firsthand during their backpacking trip across Southeast Asia in 2018.
              </p>
              <p>
                While in Vietnam, they met Linh, a university student who offered to show them around Hanoi for a day. That experience completely transformed their trip - they discovered hidden cafés, learned about local customs, and gained insights they never would have found in any guidebook.
              </p>
              <p>
                Inspired by this experience, they created TourGuide Connect - a platform that connects travelers with passionate local guides around the world, making every journey more authentic and meaningful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-800 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="max-w-3xl mx-auto text-gray-300">
              These core principles guide everything we do, from how we build our platform to how we support our community of guides and travelers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-700 rounded-lg p-8 shadow-lg">
              <div className="bg-orange-900 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Authentic Connections</h3>
              <p className="text-gray-300">
                We believe in fostering genuine connections between travelers and local guides, creating meaningful cultural exchanges that benefit both.
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-8 shadow-lg">
              <div className="bg-orange-900 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainable Tourism</h3>
              <p className="text-gray-300">
                We're committed to promoting sustainable travel practices that respect local communities, preserve cultural heritage, and minimize environmental impact.
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-8 shadow-lg">
              <div className="bg-orange-900 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Safety & Trust</h3>
              <p className="text-gray-300">
                We prioritize the safety of our community through thorough vetting processes, secure payments, and tools that build trust between guides and travelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <p className="max-w-3xl mx-auto text-gray-300">
            Meet the passionate team behind TourGuide Connect, dedicated to transforming how people explore the world.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="relative h-48 w-48 rounded-full overflow-hidden mx-auto mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Alex Chen, Co-founder & CEO"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl font-bold">Alex Chen</h3>
            <p className="text-orange-400">Co-founder & CEO</p>
            <p className="mt-2 text-gray-300">
              Former product manager and avid traveler who's visited 50+ countries.
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative h-48 w-48 rounded-full overflow-hidden mx-auto mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Maya Rodriguez, Co-founder & COO"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl font-bold">Maya Rodriguez</h3>
            <p className="text-orange-400">Co-founder & COO</p>
            <p className="mt-2 text-gray-300">
              Travel industry veteran with a passion for cultural immersion.
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative h-48 w-48 rounded-full overflow-hidden mx-auto mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="David Kim, CTO"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl font-bold">David Kim</h3>
            <p className="text-orange-400">CTO</p>
            <p className="mt-2 text-gray-300">
              Tech innovator building seamless experiences for guides and travelers.
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative h-48 w-48 rounded-full overflow-hidden mx-auto mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Priya Patel, Head of Guide Relations"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl font-bold">Priya Patel</h3>
            <p className="text-orange-400">Head of Guide Relations</p>
            <p className="mt-2 text-gray-300">
              Former tour guide developing resources to help guides thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="bg-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Become Part of Our Story</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you're a traveler seeking authentic experiences or a guide eager to share your local expertise, join us in building a more connected world.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/search-guides">
              <div className="inline-block bg-white text-orange-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                Find a Guide
              </div>
            </Link>
            <Link href="/guides/join">
              <div className="inline-block bg-transparent text-white border border-white px-6 py-3 rounded-md font-medium hover:bg-orange-700 transition-colors">
                Become a Guide
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 