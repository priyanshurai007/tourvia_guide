import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import TransitionLink from "./TransitionLink";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

type Props = {
  name: string;
  location: string;
  guides: number;
  image: string;
  href: string;
};

export default function DestinationCard({
  name,
  location,
  guides,
  image,
  href,
}: Props) {
  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-xl bg-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
      variants={itemVariants}
    >
      <div className="relative h-64">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 384px"
          className="transition-transform duration-700 hover:scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <div className="flex items-center text-gray-300 text-sm mb-2">
            <span className="flex items-center">
              <FaMapMarkerAlt className="mr-1" /> {location}
            </span>
            <span className="mx-2">•</span>
            <span>{guides} Guides</span>
          </div>
          <TransitionLink href={href}>
            <motion.div
              className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 text-sm"
              whileHover={{ x: 5 }}
            >
              Discover
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </motion.div>
          </TransitionLink>
        </div>
      </div>
    </motion.div>
  );
}
