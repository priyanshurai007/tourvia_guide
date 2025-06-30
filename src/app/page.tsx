/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";
import TransitionLink from "@/components/TransitionLink";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import PopularDestinations from "../components/PopularDestinations";
import Testimonials from "../components/Testimonials";
import TopGuides from "../components/TopGuides";

// Hero slider data
const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    heading: "Discover India with local guides",
    subheading:
      "Explore ancient temples, majestic palaces and authentic cultural experiences with knowledgeable locals.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1514222788835-3a1a1d5b32f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1449&q=80",
    heading: "Experience India like a local",
    subheading:
      "Access unique insights and secret spots only locals know about, from hidden temples to authentic food experiences.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1590766740616-0e8f29493cb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    heading: "Create unforgettable Indian memories",
    subheading:
      "Experience authentic adventures tailored to your interests across India's diverse landscapes and cultures.",
  },
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
        const token = getCookie("token");

        if (token) {
          // If token exists, validate format and try to decode it
          if (typeof token === "string" && token.split(".").length === 3) {
            try {
              const decoded = jwtDecode<DecodedToken>(token);
              const currentTime = Math.floor(Date.now() / 1000);

              // If token is not expired, redirect to dashboard
              if (decoded && decoded.exp > currentTime) {
                router.push("/dashboard");
                return;
              }
            } catch (error) {
              console.error("Error decoding token:", error);
            }
          } else {
            console.warn("Invalid token format in home page");
          }
        }

        // If not redirected, show the home page by setting loading to false
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setLoading(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  useEffect(() => {
    // Auto-rotate slides
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
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
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                  index === current ? "opacity-100" : "opacity-0"
                }`}
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
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10 absolute"
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
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "white",
                          color: "#111827",
                        }}
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
                      ? "bg-white w-8 h-3"
                      : "bg-gray-400 w-3 h-3 bg-opacity-60 hover:bg-opacity-90"
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
        <TopGuides />

        {/* Popular Destinations Section */}
        <PopularDestinations />

        {/* Testimonials Section */}
        <Testimonials />

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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to explore with a local guide?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Discover authentic experiences and hidden gems on your next
                adventure.
              </p>

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
