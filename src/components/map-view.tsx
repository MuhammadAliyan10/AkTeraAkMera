"use client";

import { Product, User } from "../app/types";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Package } from "lucide-react";

interface MapViewProps {
  products: Product[];
  currentUser: User;
}

export function MapView({ products, currentUser }: MapViewProps) {
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 }); // Default to NYC

  // In a real app, we would initialize a map using a library like Mapbox, Google Maps, or Leaflet
  // For this mockup, we'll simulate a map with relative positioning

  useEffect(() => {
    // In a real app, we would get the user's location
    // For this mockup, we'll use the current user's location
    if (currentUser?.location) {
      setMapCenter({
        lat: currentUser.location.latitude,
        lng: currentUser.location.longitude,
      });
    }
  }, [currentUser]);

  const calculatePosition = (lat: number, lng: number) => {
    // This is a very simplified calculation just for visualization
    // In a real app, you would use proper map coordinates
    const latDiff = (lat - mapCenter.lat) * 1000;
    const lngDiff = (lng - mapCenter.lng) * 1000;

    return {
      left: `calc(50% + ${lngDiff}px)`,
      top: `calc(50% - ${latDiff}px)`,
    };
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-gray-200 dark:bg-gray-900 overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-xl">
        <div className="grid grid-cols-5 grid-rows-5 w-full h-full opacity-50">
          {Array(25)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="border border-gray-300 dark:border-gray-700"
              ></div>
            ))}
        </div>
      </div>

      {/* Map Center Indicator (User) */}
      <div
        className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: "50%", top: "50%" }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-10 h-10 rounded-full bg-blue-600 border-2 border-white dark:border-gray-800 shadow-lg"
        >
          <Image
            src={currentUser?.image || "/api/placeholder/40/40"}
            alt="You are here"
            fill
            className="rounded-full object-cover"
          />
        </motion.div>
      </div>

      {/* Products on the map */}
      {products.map((product) => {
        const position = calculatePosition(
          product.location.latitude,
          product.location.longitude
        );

        return (
          <motion.div
            key={product.id}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={position}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: Math.random() * 0.5 }}
            whileHover={{ scale: 1.1, zIndex: 30 }}
            onClick={() => setSelectedItem(product)}
          >
            <div className="cursor-pointer">
              <div className="relative w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-md overflow-hidden">
                {product.owner.id === currentUser?.id ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500 text-white">
                    <Package className="w-6 h-6" />
                  </div>
                ) : (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white dark:border-gray-800">
                ${product.price?.toString() || "0"}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Selected Item Popup */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-40"
          >
            <div className="flex">
              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={selectedItem.images[0]}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-3 flex-grow">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {selectedItem.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ${selectedItem.price?.toString()}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>
                    {selectedItem.location.university ||
                      selectedItem.location.city}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
              >
                Close
              </button>
              <Link href={`/products/${selectedItem.id}`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md transition-colors">
                  View Details
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
        <div className="flex flex-col space-y-2">
          <button className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            +
          </button>
          <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
          <button className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            -
          </button>
        </div>
      </div>
    </div>
  );
}
