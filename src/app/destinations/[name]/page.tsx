'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import TransitionLink from '@/components/TransitionLink';
import { FaMapMarkerAlt, FaUser, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { use } from 'react';

// Destination data for Indian destinations
const destinations = {
  'delhi': {
    name: 'Delhi, India',
    region: 'North India',
    guides: 25,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1470',
    description: 'Explore the blend of old and new in India\'s capital, from historic monuments like Red Fort and Qutub Minar to the bustling markets of Chandni Chowk.',
    longDescription: 'Delhi, India\'s capital territory, is a massive metropolitan area in the country\'s north. In Old Delhi, a neighborhood dating to the 1600s, stands the imposing Mughal-era Red Fort, a symbol of India, and the sprawling Jama Masjid mosque, whose courtyard accommodates 25,000 people. Nearby is Chandni Chowk, a vibrant bazaar filled with food carts, sweets shops and spice stalls. New Delhi, officially the capital city, is a modern district with wide boulevards, government buildings, and cultural attractions.',
    highlights: ['Red Fort', 'Qutub Minar', 'Humayun\'s Tomb', 'India Gate', 'Jama Masjid', 'Lotus Temple'],
    bestTimeToVisit: 'October to March for pleasant weather with temperatures ranging from 20-25°C.'
  },
  'jaipur': {
    name: 'Jaipur, India',
    region: 'Rajasthan',
    guides: 18,
    image: 'https://images.unsplash.com/photo-1599661046827-9d1be56d4043?auto=format&fit=crop&q=80&w=1470',
    description: 'Discover the Pink City\'s majestic palaces, vibrant bazaars, and rich Rajasthani culture with guides who know its royal history and hidden gems.',
    longDescription: 'Jaipur, the capital of India\'s Rajasthan state, is known as the "Pink City" due to the distinctive color of its buildings. It was founded in 1727 by Maharaja Sawai Jai Singh II, who ruled from 1699-1743. Part of the larger Golden Triangle tourist circuit along with Delhi and Agra, Jaipur is a gateway to Rajasthan\'s rich cultural heritage, featuring elaborate palaces, magnificent forts, and colorful markets that showcase the region\'s artistic traditions and craftsmanship.',
    highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Albert Hall Museum', 'Jal Mahal'],
    bestTimeToVisit: 'October to March for comfortable temperatures and to experience festivals like the Jaipur Literature Festival.'
  },
  'varanasi': {
    name: 'Varanasi, India',
    region: 'Uttar Pradesh',
    guides: 15,
    image: 'https://images.unsplash.com/photo-1561361058-c24cecda72e5?auto=format&fit=crop&q=80&w=1470',
    description: 'Experience the spiritual heart of India on the banks of the sacred Ganges River, with ancient temples, morning rituals, and the evening Ganga Aarti.',
    longDescription: 'Varanasi, also known as Benares or Kashi, is a city on the banks of the Ganges River in Uttar Pradesh, North India. A major religious hub in India, it is the holiest of the seven sacred cities in Hinduism and Jainism, and played an important role in the development of Buddhism. Some Hindus believe that death in the city will bring salvation, making it a major center for pilgrimage. The city is known worldwide for its many ghats, embankments made in steps of stone slabs along the river bank where pilgrims perform ritual ablutions.',
    highlights: ['Kashi Vishwanath Temple', 'Dashashwamedh Ghat', 'Sarnath', 'Ramnagar Fort', 'Manikarnika Ghat', 'Assi Ghat'],
    bestTimeToVisit: 'October to March for moderate temperatures, or during Dev Deepawali in November when the ghats are illuminated with thousands of lamps.'
  },
  'mumbai': {
    name: 'Mumbai, India',
    region: 'Maharashtra',
    guides: 22,
    image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=1470',
    description: 'From the iconic Gateway of India to the bustling streets of Dharavi, explore the city of dreams with guides who understand its energy and contrasts.',
    longDescription: 'Mumbai, formerly known as Bombay, is the capital city of the Indian state of Maharashtra and the financial capital of India. A bustling, diverse metropolis with a mix of old colonial architecture, modern high rises, coastal culture, and crowded bazaars, Mumbai represents the ever-changing face of today\'s India. The city is also the epicenter of the Bollywood film industry. Despite being one of the most expensive cities in India, Mumbai is also home to Dharavi, one of Asia\'s largest slums, highlighting the economic disparity that exists within the city.',
    highlights: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Chhatrapati Shivaji Terminus', 'Dharavi', 'Colaba Causeway'],
    bestTimeToVisit: 'October to March when the weather is pleasant and relatively dry, perfect for exploring the city.'
  },
  'goa': {
    name: 'Goa, India',
    region: 'West India',
    guides: 20,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1470',
    description: 'Relax on pristine beaches, explore Portuguese colonial architecture, and enjoy the unique blend of Indian and Western influences in this coastal paradise.',
    longDescription: 'Goa is a state on the southwestern coast of India within the region known as the Konkan. It is bounded by the Indian states of Maharashtra to the north and Karnataka to the east and south, with the Arabian Sea forming its western coast. Goa is India\'s smallest state by area and the fourth-smallest by population. Goa has a unique colonial history, having been colonized by the Portuguese who arrived in 1510 and ruled for about 450 years, the longest period of colonization in India. This has resulted in a distinctive blend of Indian and Portuguese cultures, evident in its architecture, cuisine, and traditions.',
    highlights: ['Baga Beach', 'Basilica of Bom Jesus', 'Fort Aguada', 'Dudhsagar Falls', 'Anjuna Flea Market', 'Chapora Fort'],
    bestTimeToVisit: 'November to February for perfect beach weather, or during Carnival in February for festivities.'
  },
  'kerala': {
    name: 'Kerala, India',
    region: 'South India',
    guides: 16,
    image: 'https://images.unsplash.com/photo-1602301413458-69484f2a3f3b?auto=format&fit=crop&q=80&w=1471',
    description: 'Discover the backwaters, tea plantations, and vibrant culture of God\'s Own Country with experienced local guides who know its serene landscapes.',
    longDescription: 'Kerala is a state on the southwestern Malabar Coast of India. It was formed on 1 November 1956, following the passage of the States Reorganisation Act, by combining Malayalam-speaking regions of the erstwhile states of Travancore-Cochin and Madras. Spread over 38,863 km², Kerala is bordered by Karnataka to the north and northeast, Tamil Nadu to the east and south, and the Lakshadweep Sea to the west. With 33 million inhabitants, Kerala is the thirteenth-largest Indian state by population. It is divided into 14 districts with the capital being Thiruvananthapuram.',
    highlights: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Fort Kochi', 'Periyar Wildlife Sanctuary', 'Kovalam Beach', 'Wayanad'],
    bestTimeToVisit: 'September to March after the monsoon when the landscape is lush green and perfect for exploring backwaters and hill stations.'
  },
  'agra': {
    name: 'Agra, India',
    region: 'Uttar Pradesh',
    guides: 24,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1471',
    description: 'Home to the magnificent Taj Mahal, explore this city\'s Mughal heritage, including Agra Fort and Fatehpur Sikri, with expert historical insight.',
    longDescription: 'Agra is a city on the banks of the Yamuna river in the Indian state of Uttar Pradesh, about 210 kilometers south of the national capital New Delhi. With a population of roughly 1.6 million, Agra is the fourth-most populous city in Uttar Pradesh and twenty-third most populous city in India. Agra\'s notable historical period began during the Mughal Empire\'s rule, especially during the reign of Emperor Akbar who made it the empire\'s capital from 1556 to 1648. It was during this time, and under the patronage of later Mughal emperors, that Agra came to be associated with architectural masterpieces like the Taj Mahal, Agra Fort, and Fatehpur Sikri.',
    highlights: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Itimad-ud-Daulah\'s Tomb', 'Mehtab Bagh', 'Akbar\'s Tomb'],
    bestTimeToVisit: 'October to March when the weather is pleasant and perfect for sightseeing without the summer heat.'
  },
  'darjeeling': {
    name: 'Darjeeling, India',
    region: 'West Bengal',
    guides: 14,
    image: 'https://images.unsplash.com/photo-1544433228-6a73f0a146d1?auto=format&fit=crop&q=80&w=1374',
    description: 'Nestled in the Himalayas, experience breathtaking mountain views, historic toy trains, and world-famous tea plantations with knowledgeable local guides.',
    longDescription: 'Darjeeling is a town in India\'s West Bengal state, in the Himalayan foothills. Once a summer resort for the British Raj elite, it\'s still known for its colonial-era architecture. It\'s surrounded by tea plantations and is known for producing one of the world\'s most prestigious and expensive teas. At an altitude of 2,042 meters, Darjeeling offers stunning views of Kangchenjunga, the world\'s third-highest mountain. The Darjeeling Himalayan Railway, opened in 1881, is a UNESCO World Heritage Site that still operates with vintage steam locomotives.',
    highlights: ['Tiger Hill', 'Darjeeling Himalayan Railway', 'Tea Gardens', 'Batasia Loop', 'Padmaja Naidu Himalayan Zoological Park', 'Peace Pagoda'],
    bestTimeToVisit: 'September to November or March to May for clear mountain views and pleasant weather for exploring tea gardens.'
  }
};

export default function DestinationPage({ params }: { params: { name: string } | Promise<{ name: string }> }) {
  const router = useRouter();
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const destinationName = unwrappedParams.name;
  const destination = destinations[destinationName as keyof typeof destinations];
  
  // If destination doesn't exist, redirect to destinations page
  useEffect(() => {
    if (!destination) {
      router.replace('/destinations');
    }
  }, [destination, router]);

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
          <p>Please wait while we redirect you to the destinations page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <Image 
          src={destination.image}
          alt={destination.name}
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
            {destination.name}
          </motion.h1>
          <motion.div 
            className="flex items-center text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaMapMarkerAlt className="mr-2" />
            <span>{destination.region}</span>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
              <p className="text-gray-300 mb-6">{destination.longDescription}</p>
              
              <h3 className="text-xl font-semibold mb-3">Highlights</h3>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {destination.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-gray-300">{highlight}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-start mb-4">
                <FaCalendarAlt className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-semibold">Best Time to Visit</h3>
                  <p className="text-gray-300">{destination.bestTimeToVisit}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaUser className="text-orange-500 mt-1 mr-2" />
                <div>
                  <h3 className="font-semibold">Local Guides</h3>
                  <p className="text-gray-300">{destination.guides} experienced guides available in {destination.name}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gray-800 rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4">Why Visit with a Local Guide</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mr-4">
                    <FaInfoCircle className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Insider Knowledge</h3>
                    <p className="text-gray-300">Local guides know the hidden gems, best times to visit popular attractions, and authentic local experiences you won't find in guidebooks.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mr-4">
                    <FaInfoCircle className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Cultural Insights</h3>
                    <p className="text-gray-300">Understand the local customs, traditions, and history with context provided by guides who grew up immersed in the culture.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mr-4">
                    <FaInfoCircle className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Personalized Experience</h3>
                    <p className="text-gray-300">Tours can be tailored to your interests - whether you're passionate about history, cuisine, photography, or spirituality.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Find Your Perfect Guide</h2>
              <p className="text-gray-300 mb-6">Ready to explore {destination.name} with a knowledgeable local guide? Browse our selection of experienced guides specializing in this destination.</p>
              
              <TransitionLink href={`/search-guides?location=${encodeURIComponent(destination.name.split(',')[0])}`}>
                <motion.div 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-md text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Find Guides in {destination.name.split(',')[0]}
                </motion.div>
              </TransitionLink>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="font-semibold mb-3">Why book with us?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Verified local Indian guides</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Secure online booking</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Customizable experiences</span>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 