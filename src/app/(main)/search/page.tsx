"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import {
  Search as SearchIcon,
  X,
  MapPin,
  ArrowLeft,
  Filter,
  ChevronDown,
  Sliders,
  AlertCircle,
  Clock,
  Loader2,
  History,
  TrendingUp,
} from "lucide-react";

// Import shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { mockProducts, mockUsers } from "@/app/data/mock-data";

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
  email?: string; // Made email optional
  image: string;
};

type Product = {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number | null;
  category: string;
  condition: string;
  location: Location;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
};

// Mock data
const mockUser: User[] = mockUsers;

const products: Product[] = mockProducts;

// Search suggestions
const popularSearches = [
  "macbook pro",
  "textbooks",
  "iphone charger",
  "desk lamp",
  "headphones",
  "calculator",
  "monitor",
];

const recentSearches = ["laptop", "iphone", "desk chair", "textbook"];

// Popular categories
const popularCategories = [
  { name: "Electronics", icon: "⚡️" },
  { name: "Books", icon: "📚" },
  { name: "Furniture", icon: "🪑" },
  { name: "Clothing", icon: "👕" },
  { name: "Home", icon: "🏠" },
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

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const handleClick = () => {
    window.location.href = `/products/${product.id}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Card className="h-full overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md dark:bg-slate-900 dark:hover:bg-slate-800">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge className="absolute right-2 top-2 bg-primary">
            ${product.price}
          </Badge>
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium line-clamp-1">{product.title}</h3>
            <Badge variant="outline" className="ml-2 text-xs capitalize">
              {product.condition}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <div className="flex items-center space-x-2">
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
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// SearchSuggestion component
const SearchSuggestion = ({
  term,
  onClick,
  icon: Icon,
}: {
  term: string;
  onClick: () => void;
  icon: React.ElementType;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent"
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
        <span>{term}</span>
      </div>
    </motion.div>
  );
};

// Main search page component
export default function SearchPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with query param if exists
  useEffect(() => {
    const queryValue = searchParams.get("q");
    if (queryValue) {
      setSearchValue(queryValue);
      performSearch(queryValue);
    }
  }, [searchParams]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      performSearch(term);
    }, 500),
    []
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.length > 1) {
      setShowSuggestions(true);
      debouncedSearch(value);
    } else {
      setShowSuggestions(false);
    }
  };

  // Perform search
  const performSearch = (term: string) => {
    if (!term) return;

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Filter products by search term
      const results = products.filter(
        (product) =>
          product.title.toLowerCase().includes(term.toLowerCase()) ||
          product.description.toLowerCase().includes(term.toLowerCase()) ||
          product.category.toLowerCase().includes(term.toLowerCase())
      );

      setFilteredProducts(results);
      setIsLoading(false);
      setHasSearched(true);
      setShowSuggestions(false);

      // Update URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("q", term);
      window.history.pushState(
        {},
        "",
        `${pathname}?${newSearchParams.toString()}`
      );
    }, 800);
  };

  // Handle search form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue) {
      performSearch(searchValue);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (term: string) => {
    setSearchValue(term);
    performSearch(term);
  };

  // Clear search
  const clearSearch = () => {
    setSearchValue("");
    setHasSearched(false);
    setFilteredProducts([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    window.history.pushState({}, "", pathname);
  };

  // Filter by price range
  const applyPriceFilter = (range: [number, number]) => {
    setPriceRange(range);

    if (!hasSearched) return;

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const results = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchValue.toLowerCase()) &&
          product.price >= range[0] &&
          product.price <= range[1]
      );

      setFilteredProducts(results);
      setIsLoading(false);
    }, 500);
  };

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setSearchValue(category);
    performSearch(category);
  };

  return (
    <>
      <Head>
        <title>Search Products | Campus Market</title>
        <meta
          name="description"
          content="Search for products on Campus Market"
        />
      </Head>

      <div className="container mx-auto min-h-screen px-4 py-6">
        {/* Search Header */}
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative flex-1" ref={suggestionRef}>
            <form onSubmit={handleSubmit} className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for anything..."
                className="pl-10 pr-10"
                value={searchValue}
                onChange={handleInputChange}
                onFocus={() =>
                  searchValue.length > 1 && setShowSuggestions(true)
                }
              />
              {searchValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </form>

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 mt-1 w-full rounded-md border bg-background p-2 shadow-lg"
                >
                  {/* Match suggestions */}
                  <div className="mb-2">
                    <h3 className="px-3 py-1 text-xs font-medium text-muted-foreground">
                      {isLoading ? "Searching..." : "Suggestions"}
                    </h3>

                    {isLoading && (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}

                    {!isLoading &&
                      popularSearches
                        .filter((term) =>
                          term.includes(searchValue.toLowerCase())
                        )
                        .slice(0, 3)
                        .map((term, index) => (
                          <SearchSuggestion
                            key={index}
                            term={term}
                            icon={SearchIcon}
                            onClick={() => handleSuggestionClick(term)}
                          />
                        ))}
                  </div>

                  {/* Recent searches */}
                  <div>
                    <h3 className="px-3 py-1 text-xs font-medium text-muted-foreground">
                      Recent Searches
                    </h3>
                    {recentSearches.slice(0, 3).map((term, index) => (
                      <SearchSuggestion
                        key={index}
                        term={term}
                        icon={History}
                        onClick={() => handleSuggestionClick(term)}
                      />
                    ))}
                  </div>

                  {/* Popular searches */}
                  <div className="mt-2">
                    <h3 className="px-3 py-1 text-xs font-medium text-muted-foreground">
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2 px-3 py-2">
                      {popularSearches.slice(0, 5).map((term, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleSuggestionClick(term)}
                        >
                          <TrendingUp className="mr-1 h-3 w-3" />
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <Sliders className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Results</SheetTitle>
                <SheetDescription>
                  Refine your search results with these filters.
                </SheetDescription>
              </SheetHeader>

              <div className="py-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="category">
                    <AccordionTrigger>Category</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {[
                          "Electronics",
                          "Books",
                          "Furniture",
                          "Clothing",
                          "Home",
                        ].map((category) => (
                          <div
                            key={category}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox id={`category-${category}`} />
                            <label
                              htmlFor={`category-${category}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="condition">
                    <AccordionTrigger>Condition</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {["New", "Like New", "Used", "Refurbished"].map(
                          (condition) => (
                            <div
                              key={condition}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox id={`condition-${condition}`} />
                              <label
                                htmlFor={`condition-${condition}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {condition}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6">
                        <div>
                          <Slider
                            defaultValue={[0, 1500]}
                            min={0}
                            max={1500}
                            step={10}
                            onValueChange={(value) =>
                              applyPriceFilter(value as [number, number])
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <span className="text-xs text-muted-foreground">
                              Min
                            </span>
                            <p className="font-medium">${priceRange[0]}</p>
                          </div>
                          <div className="text-center">
                            <span className="text-xs text-muted-foreground">
                              Max
                            </span>
                            <p className="font-medium">${priceRange[1]}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="location">
                    <AccordionTrigger>Location</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select University" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nyu">NYU</SelectItem>
                            <SelectItem value="columbia">Columbia</SelectItem>
                            <SelectItem value="fordham">Fordham</SelectItem>
                            <SelectItem value="pace">
                              Pace University
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="location-nearby" />
                          <label
                            htmlFor="location-nearby"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Only show items near me
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    className="w-full"
                    onClick={() => applyPriceFilter(priceRange)}
                  >
                    Apply Filters
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search controls - Sort and View options */}
        {hasSearched && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">
                {isLoading
                  ? "Searching..."
                  : `Search results for "${searchValue}" (${filteredProducts.length})`}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    Sort by <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem>Newest First</DropdownMenuItem>
                  <DropdownMenuItem>Distance</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tabs defaultValue="grid" className="w-[160px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        )}

        {/* Search results */}
        <div className="min-h-[400px]">
          {isLoading ? (
            // Loading skeletons
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : hasSearched ? (
            filteredProducts.length > 0 ? (
              // Search results
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              // No results
              <motion.div
                className="flex flex-col items-center justify-center py-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4 rounded-full bg-muted p-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">No results found</h2>
                <p className="mb-6 text-muted-foreground">
                  We couldn't find any items matching "{searchValue}"
                </p>
                <div className="space-y-4">
                  <Button onClick={clearSearch}>Clear Search</Button>
                  <div>
                    <p className="mb-2 text-sm font-medium">Popular searches</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {popularSearches.slice(0, 5).map((term, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleSuggestionClick(term)}
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          ) : (
            // Initial state
            <motion.div
              className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 rounded-full bg-muted p-4">
                <SearchIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">
                Find what you're looking for
              </h2>
              <p className="mb-6 max-w-md text-muted-foreground">
                Start typing in the search box above to find items from students
                around your campus.
              </p>
              <div className="w-full max-w-md">
                <h3 className="mb-3 text-sm font-medium">Popular categories</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {popularCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer rounded-lg border bg-card p-4 text-center transition-colors hover:bg-accent"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <span className="text-2xl mb-2 block">
                        {category.icon}
                      </span>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
