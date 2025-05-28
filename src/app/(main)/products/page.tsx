"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Loader2, Sliders } from "lucide-react";

// Import shadcn components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Import ProductCard component
import ProductCard from "@/components/Products/ProductCard";
import { mockProducts, mockUsers } from "@/app/data/mock-data";
import { Product, User } from "@/app/types";

// Sample product data structure
type Location = {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  university: string;
};

// Mock data
// Removed redundant declaration of mockUsers

const products: Product[] = mockProducts;

// Categories for filtering
const categories = [
  "All",
  "Electronics",
  "Books",
  "Home",
  "Clothing",
  "Furniture",
  "Sports",
  "Stationery",
];

// Skeleton Loader for products
const ProductSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-48 w-full rounded-lg bg-muted"></div>
      <div className="mt-4 h-4 w-3/4 rounded bg-muted"></div>
      <div className="mt-2 h-3 w-1/2 rounded bg-muted"></div>
      <div className="mt-4 flex justify-between">
        <div className="h-5 w-1/4 rounded bg-muted"></div>
        <div className="h-5 w-1/4 rounded bg-muted"></div>
      </div>
    </div>
  );
};

// Products Page Component
export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("Newest");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let updatedProducts = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sort products
    switch (sortOption) {
      case "Price: Low to High":
        updatedProducts.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "Price: High to Low":
        updatedProducts.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "Newest":
        updatedProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    setFilteredProducts(updatedProducts);
  }, [selectedCategory, sortOption]);

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle sort option
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <>
      <Head>
        <title>Browse Products | Campus Market</title>
        <meta
          name="description"
          content="Browse all products on Campus Market"
        />
      </Head>

      <div className="container mx-auto min-h-screen px-4 py-6">
        {/* Filter and Sort Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="dark:bg-slate-800 border-none"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent className="dark:bg-slate-900">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategory === category}
                            onCheckedChange={() =>
                              handleCategoryChange(category)
                            }
                          />
                          <Label
                            htmlFor={`category-${category}`}
                            className="text-sm"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="dark:bg-slate-800 border-none"
                >
                  <Sliders className="h-4 w-4 mr-2" />
                  Sort: {sortOption} <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-slate-800">
                <DropdownMenuItem onClick={() => handleSortChange("Newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("Price: Low to High")}
                >
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("Price: High to Low")}
                >
                  Price: High to Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-muted-foreground">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "item" : "items"} found
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="mb-4 rounded-full bg-muted p-4">
                <Sliders className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No products found</h2>
              <p className="text-muted-foreground">
                Try adjusting your filters to find more items.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
