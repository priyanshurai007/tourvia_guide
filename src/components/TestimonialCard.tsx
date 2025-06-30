import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

type Props = {
  name: string;
  location: string;
  image: string;
  text: string;
  rating: number;
  itemVariants: {
    hidden: { y: number; opacity: number };
    visible: {
      y: number;
      opacity: number;
      transition: { type: string; stiffness: number };
    };
  };
};

export default function TestimonialCard({
  name,
  location,
  image,
  text,
  rating,
  itemVariants,
}: Props) {
  return (
    <motion.div
      className="bg-gray-900 p-8 rounded-lg shadow-md"
      variants={itemVariants}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <Image
            src={image}
            alt={name}
            width={56}
            height={56}
            className="rounded-full"
          />
        </div>
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-gray-400 text-sm">{location}</div>
        </div>
      </div>
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <FaStar key={i} className="text-yellow-400 mr-1" />
        ))}
      </div>
      <p className="text-gray-300">{text}</p>
    </motion.div>
  );
}
