'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import TransitionLink from '@/components/TransitionLink';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Destination data for Indian destinations
const destinations = [
  {
    id: 'delhi',
    name: 'Delhi, India',
    region: 'North India',
    guides: 25,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1470',
    description: 'Explore the blend of old and new in India\'s capital, from historic monuments like Red Fort and Qutub Minar to the bustling markets of Chandni Chowk.'
  },
  {
    id: 'jaipur',
    name: 'Jaipur, India',
    region: 'Rajasthan',
    guides: 18,
    image: 'https://images.unsplash.com/photo-1599661046827-9d1be56d4043?auto=format&fit=crop&q=80&w=1470',
    description: 'Discover the Pink City\'s majestic palaces, vibrant bazaars, and rich Rajasthani culture with guides who know its royal history and hidden gems.'
  },
  {
    id: 'varanasi',
    name: 'Varanasi, India',
    region: 'Uttar Pradesh',
    guides: 15,
    image: 'https://images.unsplash.com/photo-1561361058-c24cecda72e5?auto=format&fit=crop&q=80&w=1470',
    description: 'Experience the spiritual heart of India on the banks of the sacred Ganges River, with ancient temples, morning rituals, and the evening Ganga Aarti.'
  },
  {
    id: 'mumbai',
    name: 'Mumbai, India',
    region: 'Maharashtra',
    guides: 22,
    image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=1470',
    description: 'From the iconic Gateway of India to the bustling streets of Dharavi, explore the city of dreams with guides who understand its energy and contrasts.'
  },
  {
    id: 'goa',
    name: 'Goa, India',
    region: 'West India',
    guides: 20,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1470',
    description: 'Relax on pristine beaches, explore Portuguese colonial architecture, and enjoy the unique blend of Indian and Western influences in this coastal paradise.'
  },
  {
    id: 'kerala',
    name: 'Kerala, India',
    region: 'South India',
    guides: 16,
    image: 'https://images.unsplash.com/photo-1602301413458-69484f2a3f3b?auto=format&fit=crop&q=80&w=1471',
    description: 'Discover the backwaters, tea plantations, and vibrant culture of God\'s Own Country with experienced local guides who know its serene landscapes.'
  },
  {
    id: 'agra',
    name: 'Agra, India',
    region: 'Uttar Pradesh',
    guides: 24,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1471',
    description: 'Home to the magnificent Taj Mahal, explore this city\'s Mughal heritage, including Agra Fort and Fatehpur Sikri, with expert historical insight.'
  },
  {
    id: 'darjeeling',
    name: 'Darjeeling, India',
    region: 'West Bengal',
    guides: 14,
    image: 'https://images.unsplash.com/photo-1544433228-6a73f0a146d1?auto=format&fit=crop&q=80&w=1374',
    description: 'Nestled in the Himalayas, experience breathtaking mountain views, historic toy trains, and world-famous tea plantations with knowledgeable local guides.'
  }
];

// Animation variants
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Destinations() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1471"
          alt="Explore incredible destinations across India"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover Incredible India
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore India's most captivating destinations with local guides who know them best
          </motion.p>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Indian Destinations</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            From the snow-capped Himalayas to the tropical beaches of Kerala, find your next adventure with experienced local guides.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {destinations.map((destination) => (
            <motion.div 
              key={destination.id}
              className="rounded-xl overflow-hidden shadow-xl bg-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              variants={itemVariants}
            >
              <div className="relative h-72">
                <Image 
                  src={destination.image}
                  alt={destination.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-700 hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                  <div className="flex items-center text-gray-300 text-sm mb-2">
                    <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> {destination.region}</span>
                    <span className="mx-2">•</span>
                    <span>{destination.guides} Guides</span>
                  </div>
                  <TransitionLink href={`/search-guides?location=${encodeURIComponent(destination.name.split(',')[0])}`}>
                    <motion.div 
                      className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 text-sm"
                      whileHover={{ x: 5 }}
                    >
                      Find Guides <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </motion.div>
                  </TransitionLink>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-300 text-sm">{destination.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 