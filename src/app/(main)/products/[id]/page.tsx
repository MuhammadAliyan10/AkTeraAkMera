"use client";

// This page displays detailed information about a single product, including images, price,
// description, location, and seller details. It uses a full-page layout for a clean, modern UI,
// with a floating chat icon for quick actions and smooth animations for interactivity.

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  MessageSquare,
  Phone,
  ShoppingCart,
  MapPin,
  Tag,
  Calendar,
  X,
} from "lucide-react";

// Import shadcn components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toaster, useToast } from "@/components/ui/use-toast";
import { mockProducts } from "@/app/data/mock-data";
import { Product } from "@/app/types";

// Define TypeScript interfaces for type safety
interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  university: string;
}

// Mock API function to simulate fetching product data (replace with real API in production)
const fetchProductById = async (id: string): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProduct: Product | undefined = mockProducts.find(
        (e) => e.id == id
      );
      if (mockProduct) {
        resolve(mockProduct);
      } else {
        throw new Error("Product not found");
      }
    }, 800);
  });
};

// Format date to a readable string (e.g., "April 10, 2024")
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export default function ProductDetailPage() {
  // Extract product ID from URL params
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  // State for product data, loading, image carousel, favorite status, and chat icon
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [chatIconOpen, setChatIconOpen] = useState(false);

  // Use toast hook for notifications
  const { toast } = useToast();

  // Fetch product data on mount or when ID changes
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, []);

  // Image carousel navigation: go to next image
  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  // Image carousel navigation: go to previous image
  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  // Handle share action: copy URL to clipboard
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Product link copied to clipboard!",
      variant: "success",
    });
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    setIsFavorited((prev) => !prev);
    toast({
      title: isFavorited ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorited
        ? "Removed from your favorites list."
        : "Added to your favorites list!",
      variant: "success",
    });
  };

  // Render loading skeleton while fetching data
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  // Render not-found state if product is null
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.push("/products")}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[90vh] bg-background flex justify-between items-center">
      {/* Global toaster for notifications */}
      <Toaster />

      {/* Floating Chat Icon: provides quick access to chat, contact, and buy actions */}
      <div className="fixed bottom-6 right-6 z-50">
        <Popover open={chatIconOpen} onOpenChange={setChatIconOpen}>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
              aria-label="Open quick actions"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            className="w-80 p-4 dark:bg-slate-800"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Quick Actions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setChatIconOpen(false)}
                  aria-label="Close quick actions"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full dark:bg-slate-700 border-none"
                  onClick={() => router.push(`/products/${productId}/chat`)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  className="w-full dark:bg-slate-700 border-none"
                  onClick={() => router.push(`/products/${productId}/contact`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button
                  variant="default"
                  className="w-full col-span-2"
                  onClick={() => router.push(`/products/${productId}/purchase`)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Main Content: Full-page layout with two-column grid */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Image Carousel: Displays product images with navigation */}
          <div className="relative overflow-hidden rounded-lg bg-muted dark:bg-slate-800 aspect-square">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={product.images[currentImageIndex]}
                  alt={`${product.title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons for carousel */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/70 dark:bg-slate-800/70 rounded-full p-2 shadow-lg hover:bg-background/90"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/70 dark:bg-slate-800/70 rounded-full p-2 shadow-lg hover:bg-background/90"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex
                          ? "bg-primary"
                          : "bg-muted-foreground/50"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Details: Title, price, description, location, etc. */}
          <div className="flex flex-col space-y-6">
            {/* Title and Actions */}
            <div className="flex justify-between items-start">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl font-bold"
              >
                {product.title}
              </motion.h1>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="dark:bg-slate-800 border-none"
                        onClick={handleFavoriteToggle}
                        aria-label={
                          isFavorited
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorited ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isFavorited
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="dark:bg-slate-800 border-none"
                        onClick={handleShare}
                        aria-label="Share product"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share Product</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Price and Badges */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              <p className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs capitalize">
                  {product.condition}
                </Badge>
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {product.category}
                </Badge>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">
                {product.location.address}, {product.location.city} (Near{" "}
                {product.location.university})
              </p>
            </motion.div>

            {/* Listed Date */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">
                Listed on {formatDate(product.createdAt)}
              </p>
            </motion.div>

            {/* Separator for visual clarity */}
            <Separator className="dark:bg-slate-700" />

            {/* Seller Information: Full-width section with buy button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={product.owner.image}
                    alt={product.owner.name}
                  />
                  <AvatarFallback>
                    {product.owner.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{product.owner.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since{" "}
                    {new Date(product.owner.joinedAt).getFullYear()} •{" "}
                    {product.owner.rating.toFixed(1)} ⭐
                  </p>
                </div>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => router.push(`/products/${productId}/purchase`)}
              >
                Buy Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Skeleton Loader: Displays a placeholder UI while loading
function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background ">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Skeleton */}
          <Skeleton className="aspect-square w-full rounded-lg" />

          {/* Details Skeleton */}
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-start">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-8 w-24" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
