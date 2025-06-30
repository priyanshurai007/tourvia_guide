import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import TransitionLink from "./TransitionLink";

type Props = {
  name: string;
  location: string;
  image: string;
  rating: number;
  description: string;
  href: string;
  itemVariants: {
    hidden: { y: number; opacity: number };
    visible: {
      y: number;
      opacity: number;
      transition: { type: string; stiffness: number };
    };
  };
};

export default function GuideCard({
  name,
  location,
  image,
  rating,
  description,
  href,
  itemVariants,
}: Props) {
  return (
    <motion.div
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
      variants={itemVariants}
    >
      <div className="relative h-48">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 384px"
          className="transition-transform hover:scale-105 duration-500 object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold">{name}</h3>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{rating}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-400 mb-4">
          <FaMapMarkerAlt className="mr-1" />
          <span>{location}</span>
        </div>
        <p className="text-gray-300 mb-4">{description}</p>
        <TransitionLink href={href}>
          <motion.div
            className="block text-center bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View Profile
          </motion.div>
        </TransitionLink>
      </div>
    </motion.div>
  );
}
