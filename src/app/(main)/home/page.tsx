"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Moon, Sun, User, LogOut, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import {
  getProducts,
  searchProducts,
  mockProducts,
  mockUsers,
} from "../../data/mock-data";
import { Product, LocationFilter, User as UserType } from "../../types";
import MapExchange from "@/components/map-items";

// Navbar Component

// Home Page Component
export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<LocationFilter>("nearby");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock current user
  const currentUser: UserType = {
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
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const page = parseInt(searchParams.get("page") || "1");
        const filterParam =
          (searchParams.get("filter") as LocationFilter) || "nearby";

        const { products: fetchedProducts, totalPages } = getProducts(
          page,
          8,
          filterParam
        );

        setProducts(fetchedProducts);
        setTotalPages(totalPages);
        setCurrentPage(page);
        setFilter(filterParam);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const results = searchProducts(searchQuery);
        setProducts(results);
        setTotalPages(1);
        setCurrentPage(1);
        router.push("/");
      } catch (err) {
        setError("Search failed. Please try again.");
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="mb-8 flex gap-2 max-w-lg mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for items (e.g., charger, jacket)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Search
          </Button>
        </motion.form>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 text-red-600 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div
            fireballId="loading-spinner"
            className="flex justify-center items-center h-64"
          >
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h2 className="text-xl text-gray-600 dark:text-gray-300">
              No items found. Try adjusting your search or filter.
            </h2>
            <Button
              onClick={() => {
                setSearchQuery("");
                router.push("/");
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/"
            />
          </>
        )}
        <section className="my-4 px-10">
          <MapExchange products={mockProducts} users={mockUsers} />
        </section>
      </main>
    </div>
  );
}
