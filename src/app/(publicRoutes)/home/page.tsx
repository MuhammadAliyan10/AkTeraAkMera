"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { mockProducts } from "@/app/data/mock-data";
import ProductCard from "@/components/Products/ProductCard";

// Banner slides data
const bannerSlides = [
  {
    id: 1,
    title: "Trade Smart, Swap Smarter",
    subtitle: "Join thousands of users exchanging items they love",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&h=400&q=80",
    cta: "Start Trading Now",
  },
  {
    id: 2,
    title: "Find Amazing Deals",
    subtitle: "Discover unique items from your local community",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=400&q=80",
    cta: "Browse Items",
  },
  {
    id: 3,
    title: "Sustainable Shopping",
    subtitle: "Reduce waste by trading instead of buying new",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&h=400&q=80",
    cta: "Learn More",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play banner
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Filter products for different sections
  const trendingProducts = mockProducts.slice(0, 8);
  const bestPriceProducts = mockProducts
    .filter((p) => (p.estimatedValue || 0) < 30)
    .slice(0, 8);
  const nearbyProducts = mockProducts.slice(4, 12);

  return (
    <div className="min-h-screen bg-white dark:bg-[#18181b] text-black dark:text-white">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 space-y-16">
        {/* Banner Section */}
        <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl">
          <div className="relative h-full">
            {bannerSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="px-6 md:px-12 max-w-2xl">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-6">
                      {slide.subtitle}
                    </p>
                    <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Trending Products Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <div>
                <h2 className="text-2xl font-bold">Trending Products</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Most popular items this week
                </p>
              </div>
            </div>
            <a
              href="/products/trending"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard
                  product={{
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    images: product.images.map((img: any) => ({
                      id: img.id,
                      url: img.url,
                      isPrimary: img.order === 0,
                    })),
                    priceCents: Math.round((product.estimatedValue || 0) * 100),
                    condition: product.condition,
                    category: product.categoryId ? "ELECTRONIC" : "OTHER",
                    isExchangeOnly: false,
                    priceModel: "FIXED_TIME",
                    owner: {
                      id: product.ownerId,
                      fullName: product.owner?.name || "Unknown User",
                      profileImageUrl: product.owner?.profileImage,
                      isVerified: product.owner?.isVerified || false,
                      rating: 4.5,
                    },
                    location: product.location,
                    address: product.address,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Best Price Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-500" />
              <div>
                <h2 className="text-2xl font-bold">Best Prices</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Amazing deals under $30
                </p>
              </div>
            </div>
            <a
              href="/products/best-prices"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestPriceProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard
                  product={{
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    images: product.images.map((img: any) => ({
                      id: img.id,
                      url: img.url,
                      isPrimary: img.order === 0,
                    })),
                    priceCents: Math.round((product.estimatedValue || 0) * 100),
                    condition: product.condition,
                    category: product.categoryId ? "ELECTRONIC" : "OTHER",
                    isExchangeOnly: false,
                    priceModel: "FIXED_TIME",
                    owner: {
                      id: product.ownerId,
                      fullName: product.owner?.name || "Unknown User",
                      profileImageUrl: product.owner?.profileImage,
                      isVerified: product.owner?.isVerified || false,
                      rating: 4.5,
                    },
                    location: product.location,
                    address: product.address,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Best Items Near You Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="text-2xl font-bold">Best Items Near You</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Local treasures in your area
                </p>
              </div>
            </div>
            <a
              href="/products/nearby"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nearbyProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard
                  product={{
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    images: product.images.map((img: any) => ({
                      id: img.id,
                      url: img.url,
                      isPrimary: img.order === 0,
                    })),
                    priceCents: Math.round((product.estimatedValue || 0) * 100),
                    condition: product.condition,
                    category: product.categoryId ? "ELECTRONIC" : "OTHER",
                    isExchangeOnly: false,
                    priceModel: "FIXED_TIME",
                    owner: {
                      id: product.ownerId,
                      fullName: product.owner?.name || "Unknown User",
                      profileImageUrl: product.owner?.profileImage,
                      isVerified: product.owner?.isVerified || false,
                      rating: 4.5,
                    },
                    location: product.location,
                    address: product.address,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 dark:border-gray-800 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} SwapHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
