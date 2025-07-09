"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  X,
  MapPin,
  User,
  Shield,
  Calendar,
  DollarSign,
  ArrowRightLeft,
  MessageCircle,
  Star,
  Tag,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { mockProducts } from "@/app/data/mock-data";
import ChatModal from "@/components/chat-message";

// Enhanced product type
type Product = {
  id: string;
  title: string;
  description?: string;
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
  priceCents: number;
  condition: "LIKE_NEW" | "GOOD" | "USED" | "POOR" | "DAMAGED";
  category:
    | "CHARGER"
    | "SPORTS_EQUIPMENT"
    | "TOOL"
    | "ELECTRONIC"
    | "FURNITURE"
    | "BOOK"
    | "CLOTHING"
    | "ACCESSORY"
    | "OTHER";
  isExchangeOnly: boolean;
  priceModel: "FIXED_TIME" | "USAGE_BASED";
  owner: {
    id: string;
    fullName: string;
    profileImageUrl?: string;
    isVerified: boolean;
    rating: number;
    phoneNumber?: string;
    email?: string;
  };
  location: { lat: number; lng: number };
  address?: string;
  createdAt: Date;
  updatedAt: Date;
};

const conditionColors = {
  LIKE_NEW:
    "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
  GOOD: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
  USED: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
  POOR: "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
  DAMAGED: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30",
};

const conditionLabels = {
  LIKE_NEW: "Like New",
  GOOD: "Good",
  USED: "Used",
  POOR: "Poor",
  DAMAGED: "Damaged",
};

// Loading Skeleton Component
const ProductDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  </div>
);

// Image Modal Component
const ImageModal = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: {
  images: any[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>

          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ArrowRight className="w-8 h-8" />
          </button>

          <img
            src={images[currentIndex]?.url}
            alt={`Product image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} of {images.length}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProduct = mockProducts.find((p) => p.id === params.id);
      if (foundProduct) {
        setProduct({
          id: foundProduct.id,
          title: foundProduct.title,
          description: foundProduct.description,
          images: foundProduct.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            isPrimary: img.order === 0,
          })),
          priceCents: Math.round((foundProduct.estimatedValue || 0) * 100),
          condition: foundProduct.condition,
          category: foundProduct.categoryId ? "ELECTRONIC" : "OTHER",
          isExchangeOnly: false,
          priceModel: "FIXED_TIME",
          owner: {
            id: foundProduct.ownerId,
            fullName: foundProduct.owner?.name || "Unknown User",
            profileImageUrl: foundProduct.owner?.profileImage,
            isVerified: foundProduct.owner?.isVerified || false,
            rating: 4.5,
            phoneNumber: "+1-555-123-4567",
            email: "seller@example.com",
          },
          location: foundProduct.location,
          address: foundProduct.address,
          createdAt: foundProduct.createdAt,
          updatedAt: foundProduct.updatedAt,
        });
      }
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const handleExchange = () => {
    window.location.href = `/products/${params.id}/exchange`;
  };

  const handleContactSeller = () => {
    setChatModalOpen(true);
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#18181b] text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative h-96 w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 cursor-pointer"
              onClick={() => setImageModalOpen(true)}
            >
              <img
                src={
                  product.images[selectedImageIndex]?.url ||
                  "/placeholder-product.jpg"
                }
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />

              {/* Condition Badge */}
              <div className="absolute top-4 left-4">
                <Badge
                  className={`${
                    conditionColors[product.condition]
                  } backdrop-blur-sm border`}
                >
                  {conditionLabels[product.condition]}
                </Badge>
              </div>

              {/* Price Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 text-sm font-semibold">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {formatPrice(product.priceCents)}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative h-20 w-full overflow-hidden rounded-lg cursor-pointer border-2 transition-all ${
                    index === selectedImageIndex
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground capitalize">
                  {product.category.toLowerCase().replace("_", " ")}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Listed {formatTimeAgo(product.createdAt)}
              </div>
            </div>

            {/* Price */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.priceCents)}
                </span>
              </div>
              {product.isExchangeOnly && (
                <div className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                  Exchange only - no cash payment
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Owner Information */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Seller Information</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {product.owner.fullName}
                    </span>
                    {product.owner.isVerified && (
                      <Shield className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{product.owner.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {product.owner.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Phone className="h-3 w-3" />
                  <span>{product.owner.phoneNumber}</span>
                </div>
              )}

              {product.owner.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{product.owner.email}</span>
                </div>
              )}
            </div>

            {/* Location */}
            {product.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{product.address}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleExchange}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
                size="lg"
              >
                <ArrowRightLeft className="h-5 w-5 mr-2" />
                Exchange Now
              </Button>

              <Button
                onClick={handleContactSeller}
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      <ImageModal
        images={product.images}
        currentIndex={selectedImageIndex}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onNext={() =>
          setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
        }
        onPrev={() =>
          setSelectedImageIndex(
            (prev) => (prev - 1 + product.images.length) % product.images.length
          )
        }
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        seller={{
          id: product.owner.id,
          name: product.owner.fullName,
          profileImage: product.owner.profileImageUrl,
          isVerified: product.owner.isVerified,
          rating: product.owner.rating,
          phoneNumber: product.owner.phoneNumber,
          email: product.owner.email,
          location: product.address,
          lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        }}
        productTitle={product.title}
        productImage={product.images[0]?.url}
      />
    </div>
  );
}
