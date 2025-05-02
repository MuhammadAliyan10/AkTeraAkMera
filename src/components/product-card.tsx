"use client";

import { Product } from "../app/types";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = () => {
    if (product.price === null) return "Free";
    return `${product.price.toFixed(2)}`;
  };

  const getLocationString = () => {
    if (product.location.university) {
      return product.location.university;
    }
    return product.location.city;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium">
            {formatPrice()}
          </div>
          {product.duration && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Rental</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{getLocationString()}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full overflow-hidden relative mr-2">
              <Image
                src={product.owner.image}
                alt={product.owner.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {product.owner.name}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <span className="text-amber-500 mr-1">
              <Star className="h-4 w-4 inline fill-current" />
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {product.owner.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Posted {formatDistanceToNow(product.createdAt, { addSuffix: true })}
        </div>
      </div>
    </motion.div>
  );
}
