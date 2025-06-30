/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { motion } from "framer-motion";
import GuideCard from "./GuideCard";
import TransitionLink from "./TransitionLink";

const guides = [
  {
    name: "Raj Mehta",
    location: "Mumbai, India",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    rating: 4.9,
    description:
      "Mumbai native with expertise in heritage sites, street food, and Bollywood culture. Experience the vibrant spirit of India's largest city.",
    href: "/guides/raj-mehta",
  },
  {
    name: "Kavita Singh",
    location: "Varanasi, India",
    image:
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=689&q=80",
    rating: 4.9,
    description:
      "Born into a family of Varanasi musicians, I offer unique insights into spiritual traditions, sacred ceremonies, and classical music of India's oldest city.",
    href: "/guides/kavita-singh",
  },
  {
    name: "Rahul Verma",
    location: "Agra, India",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    rating: 4.9,
    description:
      "Mughal history expert with specialized knowledge of the Taj Mahal and Agra Fort. Discover hidden stories and architectural secrets of these iconic monuments.",
    href: "/guides/rahul-verma",
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

export default function TopGuides() {
  return (
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our Top Guides
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Experienced locals passionate about sharing their hometown's secrets
            and creating unforgettable experiences for students.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {guides.map((guide) => (
            <GuideCard
              key={guide.name}
              {...guide}
              itemVariants={itemVariants}
            />
          ))}
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
  );
}
