import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye, MapPin, Tag } from "lucide-react";

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

// Sample product data structure
type Location = {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  university: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

type Product = {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  condition: string;
  location: Location;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
};

// Product Card Component
export default function ProductCard({ product }: { product: Product }) {
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isInCart, setIsInCart] = useState<boolean>(false);

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    setIsFavorited((prev) => !prev);
    // In a real app, this would update a favorites list in state or API
  };

  // Handle add to cart
  const handleAddToCart = () => {
    setIsInCart(true);
    // In a real app, this would add the product to a cart context or API
    setTimeout(() => setIsInCart(false), 2000); // Reset for demo
  };

  // Handle view details
  const handleViewDetails = () => {
    window.location.href = `/products/${product.id}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-background rounded-lg overflow-hidden shadow-sm dark:bg-slate-900 dark:hover:bg-slate-800 transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground">
          ${product.price.toFixed(2)}
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 left-2 bg-background/90 dark:bg-slate-800/90"
                onClick={handleFavoriteToggle}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorited
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold line-clamp-1">
            {product.title}
          </h3>
          <Badge variant="outline" className="ml-2 text-xs capitalize">
            {product.condition}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {product.description}
        </p>

        {/* Owner and Location */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={product.owner.image} />
              <AvatarFallback>{product.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {product.owner.name}
            </span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3" />
            <span>{product.location.university}</span>
          </div>
        </div>

        {/* Category */}
        <div className="mt-2">
          <Badge variant="secondary" className="text-xs">
            <Tag className="h-3 w-3 mr-1" />
            {product.category}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <Button
          variant={isInCart ? "secondary" : "default"}
          size="sm"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={isInCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isInCart ? "Added to Cart" : "Add to Cart"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="dark:bg-slate-800 border-none"
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </div>
    </motion.div>
  );
}
