import React from "react";
import { motion } from "framer-motion";
import DestinationCard from "./DestinationCard";
import TransitionLink from "./TransitionLink";

const destinations = [
  {
    name: "City Palace, Jaipur",
    location: "Rajasthan",
    guides: 15,
    image:
      "https://images.unsplash.com/photo-1599661046827-9d1be56d4043?auto=format&fit=crop&q=80&w=1470",
    href: "/destinations/jaipur",
  },
  {
    name: "Lake Palace, Udaipur",
    location: "Rajasthan",
    guides: 12,
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1476",
    href: "/destinations/udaipur",
  },
  {
    name: "Mysore Palace",
    location: "Karnataka",
    guides: 10,
    image:
      "https://images.unsplash.com/photo-1602536052359-ef94c19743c4?auto=format&fit=crop&q=80&w=1475",
    href: "/destinations/mysore",
  },
  {
    name: "Taj Mahal",
    location: "Uttar Pradesh",
    guides: 18,
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1471",
    href: "/destinations/agra",
  },
  {
    name: "Varanasi Ghats",
    location: "Uttar Pradesh",
    guides: 14,
    image:
      "https://images.unsplash.com/photo-1511543462076-90896abd383d?auto=format&fit=crop&q=80&w=1471",
    href: "/destinations/varanasi",
  },
  {
    name: "Hawa Mahal",
    location: "Rajasthan",
    guides: 13,
    image:
      "https://images.unsplash.com/photo-1599661046288-89b8be1a53a3?auto=format&fit=crop&q=80&w=1470",
    href: "/destinations/jaipur",
  },
  {
    name: "Red Fort",
    location: "Delhi",
    guides: 16,
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1470",
    href: "/destinations/delhi",
  },
  {
    name: "Kerala Backwaters",
    location: "Kerala",
    guides: 11,
    image:
      "https://images.unsplash.com/photo-1609340440248-f5a410415cf1?auto=format&fit=crop&q=80&w=1470",
    href: "/destinations/kerala",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export default function PopularDestinations() {
  return (
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Royal Palaces & Destinations of India
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Discover the majestic palaces and enchanting destinations of India
            with our expert local guides who know all the secret stories and
            hidden chambers.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {destinations.map((dest) => (
            <DestinationCard key={dest.name} {...dest} />
          ))}
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
  );
}
