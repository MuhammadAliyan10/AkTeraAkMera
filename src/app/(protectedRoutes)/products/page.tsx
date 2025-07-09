"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Search,
  Sliders,
  Grid3X3,
  List,
  MapPin,
  DollarSign,
  Clock,
  Star,
  X,
  ChevronDown,
  ChevronUp,
  Package,
  Zap,
  Shield,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/Products/ProductCard";
import { mockProducts } from "@/app/data/mock-data";
import { ProductCondition, UserRole } from "@/lib/types";

// Enhanced product type matching database schema
type EnhancedProduct = {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    profileImage?: string;
    isVerified: boolean;
    rating: number;
    role: UserRole;
  };
  condition: ProductCondition;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  estimatedValue: number;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  images: {
    id: string;
    url: string;
    order: number;
  }[];
  tags: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Filter types
type FilterState = {
  categories: string[];
  conditions: ProductCondition[];
  priceRange: [number, number];
  location: string;
  verifiedOnly: boolean;
  availableOnly: boolean;
};

// Sort options
type SortOption =
  | "newest"
  | "oldest"
  | "price_low_high"
  | "price_high_low"
  | "rating"
  | "popularity";

// Categories from database
const categories = [
  { id: "electronics", name: "Electronics", icon: "💻" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "furniture", name: "Furniture", icon: "🪑" },
  { id: "clothing", name: "Clothing", icon: "👕" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "tools", name: "Tools", icon: "🔧" },
  { id: "accessories", name: "Accessories", icon: "👜" },
  { id: "other", name: "Other", icon: "📦" },
];

// Loading Skeleton Components
const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 12 }).map((_, index) => (
      <div key={index} className="space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const FilterSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-28" />
    </div>
  </div>
);

export default function ProductsPage() {
  // State management
  const [products, setProducts] = useState<EnhancedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<EnhancedProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    conditions: [],
    priceRange: [0, 1000],
    location: "",
    verifiedOnly: false,
    availableOnly: true,
  });

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Transform mock data to match our schema
        const transformedProducts: EnhancedProduct[] = mockProducts.map(
          (product) => ({
            id: product.id,
            title: product.title,
            description: product.description,
            ownerId: product.ownerId,
            owner: {
              id: product.ownerId,
              name: product.owner?.name || "Unknown User",
              profileImage: product.owner?.profileImage,
              isVerified: product.owner?.isVerified || false,
              rating: 4.5,
              role: UserRole.SELLER,
            },
            condition: product.condition,
            categoryId: product.categoryId || "other",
            category: {
              id: product.categoryId || "other",
              name: product.categoryId ? "Electronics" : "Other",
            },
            estimatedValue: product.estimatedValue || 0,
            location: product.location,
            address: product.address,
            images: product.images.map((img: any) => ({
              id: img.id,
              url: img.url,
              order: img.order || 0,
            })),
            tags: product.tags || [],
            isAvailable: product.isAvailable !== false,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          })
        );

        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          product.category.name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category.id)
      );
    }

    // Condition filter
    if (filters.conditions.length > 0) {
      filtered = filtered.filter((product) =>
        filters.conditions.includes(product.condition)
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.estimatedValue >= filters.priceRange[0] &&
        product.estimatedValue <= filters.priceRange[1]
    );

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((product) =>
        product.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Verified sellers only
    if (filters.verifiedOnly) {
      filtered = filtered.filter((product) => product.owner.isVerified);
    }

    // Available only
    if (filters.availableOnly) {
      filtered = filtered.filter((product) => product.isAvailable);
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "price_low_high":
        filtered.sort((a, b) => a.estimatedValue - b.estimatedValue);
        break;
      case "price_high_low":
        filtered.sort((a, b) => b.estimatedValue - a.estimatedValue);
        break;
      case "rating":
        filtered.sort((a, b) => b.owner.rating - a.owner.rating);
        break;
      case "popularity":
        // Mock popularity based on creation date and rating
        filtered.sort((a, b) => {
          const aScore =
            b.owner.rating * (new Date(b.createdAt).getTime() / 1000000);
          const bScore =
            a.owner.rating * (new Date(a.createdAt).getTime() / 1000000);
          return aScore - bScore;
        });
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle filter changes
  const handleCategoryChange = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleConditionChange = (condition: ProductCondition) => {
    setFilters((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      conditions: [],
      priceRange: [0, 1000],
      location: "",
      verifiedOnly: false,
      availableOnly: true,
    });
    setSearchQuery("");
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.conditions.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.availableOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#18181b]">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title and Stats */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Browse Products
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover amazing items from verified sellers
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>{filteredProducts.length} items</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>
                  {filteredProducts.filter((p) => p.owner.isVerified).length}{" "}
                  verified sellers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>
                  {Math.round(
                    filteredProducts.reduce(
                      (sum, p) => sum + p.estimatedValue,
                      0
                    ) / 100
                  )}
                  k total value
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products, categories, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 px-4">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 w-5 p-0 text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 hover:text-red-700"
                      >
                        Clear all
                      </Button>
                    )}
                  </SheetTitle>
                </SheetHeader>

                <div className="py-6 space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={filters.categories.includes(category.id)}
                            onCheckedChange={() =>
                              handleCategoryChange(category.id)
                            }
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="text-sm cursor-pointer"
                          >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Conditions */}
                  <div>
                    <h3 className="font-semibold mb-3">Condition</h3>
                    <div className="space-y-2">
                      {Object.values(ProductCondition).map((condition) => (
                        <div
                          key={condition}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`condition-${condition}`}
                            checked={filters.conditions.includes(condition)}
                            onCheckedChange={() =>
                              handleConditionChange(condition)
                            }
                          />
                          <Label
                            htmlFor={`condition-${condition}`}
                            className="text-sm cursor-pointer"
                          >
                            {condition.replace("_", " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="space-y-4">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: value as [number, number],
                          }))
                        }
                        max={1000}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Location */}
                  <div>
                    <h3 className="font-semibold mb-3">Location</h3>
                    <Input
                      placeholder="Enter city or university..."
                      value={filters.location}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  {/* Additional Filters */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified-only"
                        checked={filters.verifiedOnly}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({
                            ...prev,
                            verifiedOnly: !!checked,
                          }))
                        }
                      />
                      <Label
                        htmlFor="verified-only"
                        className="text-sm cursor-pointer"
                      >
                        Verified sellers only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="available-only"
                        checked={filters.availableOnly}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({
                            ...prev,
                            availableOnly: !!checked,
                          }))
                        }
                      />
                      <Label
                        htmlFor="available-only"
                        className="text-sm cursor-pointer"
                      >
                        Available items only
                      </Label>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 px-4">
                  <Sliders className="h-4 w-4 mr-2" />
                  Sort
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  <Clock className="h-4 w-4 mr-2" />
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price_low_high")}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price_high_low")}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>
                  <Star className="h-4 w-4 mr-2" />
                  Highest Rated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("popularity")}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Most Popular
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>
            {filters.categories.map((categoryId) => {
              const category = categories.find((c) => c.id === categoryId);
              return (
                <Badge key={categoryId} variant="secondary" className="gap-1">
                  {category?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleCategoryChange(categoryId)}
                  />
                </Badge>
              );
            })}
            {filters.conditions.map((condition) => (
              <Badge key={condition} variant="secondary" className="gap-1">
                {condition.replace("_", " ")}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleConditionChange(condition)}
                />
              </Badge>
            ))}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
              <Badge variant="secondary" className="gap-1">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, priceRange: [0, 1000] }))
                  }
                />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                {filters.location}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, location: "" }))
                  }
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 h-6 px-2"
            >
              Clear all
            </Button>
          </motion.div>
        )}

        {/* Products Grid/List */}
        <div className="min-h-[600px]">
          {loading ? (
            <ProductGridSkeleton />
          ) : filteredProducts.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                <AnimatePresence>
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
