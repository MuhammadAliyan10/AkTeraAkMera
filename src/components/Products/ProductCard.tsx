import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightLeft,
  Heart,
  Eye,
  MapPin,
  Tag,
  Calendar,
  Sparkles,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Updated types based on Prisma schema
type User = {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  isVerified: boolean;
};

type Category = {
  id: string;
  name: string;
};

type ProductImage = {
  id: string;
  url: string;
  altText?: string;
  order: number;
};

type Product = {
  id: string;
  title: string;
  description?: string;
  images: ProductImage[];
  condition: "NEW" | "LIKE_NEW" | "USED" | "DAMAGED";
  category?: Category;
  desiredItems?: string;
  estimatedValue?: number;
  location?: any; // JSON field
  address?: string;
  tags: string[];
  owner: User;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    swapRequests: number;
    reviews: number;
  };
};

// Condition color mapping
const conditionColors = {
  NEW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  LIKE_NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  USED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  DAMAGED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

// Product Card Component
export default function ProductCard({ product }: { product: Product }) {
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited((prev) => !prev);
    // Add haptic feedback animation
  };

  // Handle swap request
  const handleSwapRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/swap/request/${product.id}`;
  };

  // Handle view details
  const handleViewDetails = () => {
    window.location.href = `/products/${product.id}`;
  };

  // Handle message owner
  const handleMessageOwner = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/messages/new?userId=${product.owner.id}`;
  };

  // Image navigation
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

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

  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl dark:shadow-slate-900/20 transition-all duration-500 border border-slate-200 dark:border-slate-800 cursor-pointer"
      onClick={handleViewDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Availability indicator */}
      {!product.isAvailable && (
        <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
          <Badge variant="destructive" className="text-lg px-4 py-2">
            Not Available
          </Badge>
        </div>
      )}

      {/* Product Image Carousel */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={
                product.images[currentImageIndex]?.url ||
                "/placeholder-product.jpg"
              }
              alt={product.images[currentImageIndex]?.altText || product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>
        </AnimatePresence>

        {/* Image navigation */}
        {product.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Image indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge
            className={`${conditionColors[product.condition]} font-medium`}
          >
            {product.condition.replace("_", " ")}
          </Badge>
          {product.owner.isVerified && (
            <Badge className="bg-blue-500 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 backdrop-blur-sm"
                  onClick={handleFavoriteToggle}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isFavorited
                        ? "fill-red-500 text-red-500"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Estimated Value */}
        {product.estimatedValue && (
          <Badge className="absolute bottom-3 right-3 bg-green-500 text-white font-semibold">
            <DollarSign className="h-3 w-3 mr-1" />
            {product.estimatedValue.toFixed(0)}
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Title and Category */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.title}
            </h3>
          </div>

          {product.category && (
            <Badge variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {product.category.name}
            </Badge>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Desired Items */}
        {product.desiredItems && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
              Looking for:
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 line-clamp-1">
              {product.desiredItems}
            </p>
          </div>
        )}

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{product.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Owner and Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-slate-200 dark:ring-slate-700">
              <AvatarImage src={product.owner.profileImage} />
              <AvatarFallback className="text-xs font-semibold">
                {product.owner.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {product.owner.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="h-3 w-3" />
                {formatTimeAgo(product.createdAt)}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {product._count?.reviews && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {product._count.reviews}
              </div>
            )}
            {product._count?.swapRequests && (
              <div className="flex items-center gap-1">
                <ArrowRightLeft className="h-3 w-3" />
                {product._count.swapRequests}
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        {product.address && (
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="h-4 w-4 mr-2 text-slate-400" />
            <span className="truncate">{product.address}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <motion.div
        className="p-4 pt-0 space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            size="sm"
            onClick={handleSwapRequest}
            disabled={!product.isAvailable}
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Request Swap
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMessageOwner}
            className="border-slate-300 dark:border-slate-600"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="border-slate-300 dark:border-slate-600"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
}
