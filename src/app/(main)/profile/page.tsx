"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar } from "lucide-react";
import Image from "next/image";

import { ProductCard } from "@/components/product-card";
import { getUserById, getProducts } from "../../data/mock-data";
import { User, Product } from "../../types";
import { format } from "date-fns";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock current user
  const currentUser = {
    id: "user1",
    name: "Jane Smith",
    image: "/api/placeholder/80/80",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Main St",
      city: "New York",
      university: "NYU",
    },
    rating: 4.8,
    joinedAt: new Date("2023-01-15"),
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const fetchedUser = getUserById(userId);
      if (fetchedUser) {
        setUser(fetchedUser);
        const { products: userProducts } = getProducts(1, 100); // Fetch all products
        setProducts(userProducts.filter((p) => p.owner.id === userId));
      } else {
        router.push("/404");
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [userId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Star className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={user.image}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 text-amber-500 fill-current mr-1" />
                <span className="text-gray-700 dark:text-gray-300">
                  {user.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{user.location.university || user.location.city}</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
                <Calendar className="h-5 w-5 mr-1" />
                <span>Joined {format(user.joinedAt, "MMMM yyyy")}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Listings
        </h2>
        {products.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No listings available.
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
