import React from "react";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    text: "Raj was an incredible guide in Mumbai! He showed us hidden corners we would never have found on our own and shared fascinating stories about the city's history and Bollywood culture.",
    rating: 5,
  },
  {
    name: "David Chen",
    location: "Toronto, Canada",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Kavita's knowledge of Varanasi's spiritual traditions was incredible. She took us to witness the Ganga Aarti ceremony from a perfect spot and even arranged a private classical music performance.",
    rating: 5,
  },
  {
    name: "Emma Wilson",
    location: "London, UK",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Rahul made our Taj Mahal visit unforgettable! His insights into Mughal history and architecture were fascinating, and he took us at sunrise to avoid crowds and get the perfect photos.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 50 },
  },
};

export default function Testimonials() {
  return (
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Students Say
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Read about the amazing experiences others have had with our local
            guides.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} itemVariants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
