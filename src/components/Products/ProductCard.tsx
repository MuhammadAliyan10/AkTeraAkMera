import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Tag,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Enhanced types based on Prisma schema
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

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Handle exchange request
  const handleExchange = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/products/${product.id}/exchange`;
  };

  // Handle view details
  const handleViewDetails = () => {
    window.location.href = `/products/${product.id}`;
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

  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  // Get primary image or first image
  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];

  return (
    <motion.div
      layout
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 120,
        damping: 15,
      }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col"
      onClick={handleViewDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted flex-shrink-0">
        <motion.img
          src={primaryImage?.url || "/placeholder-product.jpg"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
        />

        {/* Condition Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            className={`${
              conditionColors[product.condition]
            } backdrop-blur-sm border text-xs font-medium`}
          >
            {conditionLabels[product.condition]}
          </Badge>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute top-3 right-3">
          <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
            <DollarSign className="h-3 w-3" />
            {formatPrice(product.priceCents)}
          </div>
        </div>

        {/* Exchange Only Badge */}
        {product.isExchangeOnly && (
          <div className="absolute top-12 left-3">
            <Badge className="bg-purple-500/90 backdrop-blur-sm text-white border-purple-500/30 text-xs font-medium">
              Exchange Only
            </Badge>
          </div>
        )}

        {/* Timestamp Overlay */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-background/80 backdrop-blur-sm text-muted-foreground px-2 py-1 rounded-lg text-xs flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatTimeAgo(product.createdAt)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Category */}
        <div className="flex items-center gap-2">
          <Tag className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground capitalize">
            {product.category.toLowerCase().replace("_", " ")}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
          {product.title}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
            {product.description}
          </p>
        )}

        {/* Owner Info */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-3 w-3 text-primary" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-foreground">
                {product.owner.fullName}
              </span>
              {product.owner.isVerified && (
                <Shield className="h-3 w-3 text-blue-500" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>★</span>
            <span>{product.owner.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Location */}
        {product.address && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{product.address}</span>
          </div>
        )}

        {/* Exchange Button */}
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0.9,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="mt-auto pt-2"
        >
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-300"
            size="sm"
            onClick={handleExchange}
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            {product.isExchangeOnly ? "Exchange Only" : "Exchange Now"}
          </Button>
        </motion.div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
}
