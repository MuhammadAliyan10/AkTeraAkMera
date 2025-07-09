"use client";

// This component renders an interactive map for the Campus Market app, displaying user avatars
// as markers with animated product carousels in popups. It features a collapsible search/filter
// panel, custom clustering, and distance calculations, with a polished UI and no buttons on the map.

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  MapPin,
  Info,
  Star,
  Clock,
  Tag,
  ChevronRight,
  Search,
  X,
  Filter,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

// Types
interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  university: string;
}

interface User {
  id: string;
  name: string;
  image: string;
  location: Location;
  rating: number;
  joinedAt: Date;
}

interface Product {
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
}

// Custom marker for user avatars
const createUserAvatarIcon = (user: User, productCount: number) => {
  const validImageUrl = user.image || "/default-avatar.png";
  return L.divIcon({
    className: "custom-avatar-marker",
    html: `
      <div class="relative group">
        <div class="avatar-container w-12 h-12 rounded-full border-2 border-primary overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-primary/50">
          <img src="${validImageUrl}" alt="${
      user.name
    }" class="w-full h-full object-cover" />
        </div>
        <div class="absolute top-0 right-0 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
          ${productCount}
        </div>
        <div class="hidden group-hover:block absolute -bottom-2 whitespace-nowrap bg-gradient-to-r from-primary/80 to-primary text-white text-xs py-1 px-3 rounded-full left-1/2 transform -translate-x-1/2 shadow-lg">
          ${user.name} (${productCount} ${
      productCount === 1 ? "item" : "items"
    })
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

// Custom marker for clusters
const createClusterIcon = (count: number) => {
  return L.divIcon({
    className: "custom-cluster-marker",
    html: `
      <div class="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary to-primary/80 text-white font-bold rounded-full border-2 border-white shadow-lg">
        ${count}
      </div>
    `,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  });
};

// Map theme controller for dark/light mode
const MapThemeController = ({ theme }: { theme: string | undefined }) => {
  const map = useMap();

  useEffect(() => {
    if (theme === "dark") {
      map.getContainer().classList.add("dark-map");
    } else {
      map.getContainer().classList.remove("dark-map");
    }
    map.invalidateSize();
  }, [theme, map]);

  return null;
};

// Helper component to get user location and handle map initialization
const MapInitializer = ({
  onLocationFound,
}: {
  onLocationFound: (lat: number, lng: number) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    // Ensure map is fully initialized
    map.invalidateSize();

    // Enable gesture interactions
    map.dragging.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();

    // Locate user
    map.locate({ setView: true, maxZoom: 15 });

    const onLocationFound = (e: L.LocationEvent) => {
      const { lat, lng } = e.latlng;
      onLocationFound(lat, lng);
    };

    map.on("locationfound", onLocationFound);

    // Handle resize to fix movement issues
    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);

    return () => {
      map.off("locationfound", onLocationFound);
      window.removeEventListener("resize", handleResize);
    };
  }, [map, onLocationFound]);

  return null;
};

// Haversine formula for distance calculation (in kilometers)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Clustering algorithm
const clusterUsers = (
  users: User[],
  productsByUser: Map<string, Product[]>,
  zoom: number,
  map: L.Map
): Array<{ position: [number, number]; users: User[] }> => {
  const clusters: Array<{ position: [number, number]; users: User[] }> = [];
  const used = new Set<string>();
  const pixelThreshold = zoom > 16 ? 30 : zoom > 12 ? 50 : 70;

  users.forEach((user) => {
    if (used.has(user.id) || !(productsByUser.get(user.id) || []).length)
      return;

    const userPos = map.latLngToContainerPoint([
      user.location.latitude,
      user.location.longitude,
    ]);
    const clusterUsers: User[] = [user];
    used.add(user.id);

    users.forEach((otherUser) => {
      if (
        used.has(otherUser.id) ||
        !(productsByUser.get(otherUser.id) || []).length
      )
        return;

      const otherPos = map.latLngToContainerPoint([
        otherUser.location.latitude,
        otherUser.location.longitude,
      ]);
      const distance = Math.sqrt(
        Math.pow(userPos.x - otherPos.x, 2) +
          Math.pow(userPos.y - otherPos.y, 2)
      );

      if (distance < pixelThreshold) {
        clusterUsers.push(otherUser);
        used.add(otherUser.id);
      }
    });

    const avgLat =
      clusterUsers.reduce((sum, u) => sum + u.location.latitude, 0) /
      clusterUsers.length;
    const avgLng =
      clusterUsers.reduce((sum, u) => sum + u.location.longitude, 0) /
      clusterUsers.length;

    clusters.push({ position: [avgLat, avgLng], users: clusterUsers });
  });

  return clusters;
};

const MapExchange = ({
  products,
  users,
}: {
  products: Product[];
  users: User[];
}) => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [center, setCenter] = useState<[number, number]>([
    40.73061, -73.935242,
  ]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [mapReady, setMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [quickFilter, setQuickFilter] = useState<string>("all");
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [zoom, setZoom] = useState(14);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Combine users from props and product owners
  const allUsers = useMemo(() => {
    const userMap = new Map<string, User>();
    users.forEach((user) => userMap.set(user.id, user));
    products.forEach((product) => {
      if (!userMap.has(product.owner.id)) {
        userMap.set(product.owner.id, product.owner);
      }
    });
    return Array.from(userMap.values());
  }, [users, products]);

  // Group products by user
  const productsByUser = useMemo(() => {
    const map = new Map<string, Product[]>();
    allUsers.forEach((user) => map.set(user.id, []));
    products.forEach((product) => {
      const userProducts = map.get(product.owner.id) || [];
      userProducts.push(product);
      map.set(product.owner.id, userProducts);
    });
    return map;
  }, [products, allUsers]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const userProducts = productsByUser.get(user.id) || [];
      if (userProducts.length === 0) return false;

      const matchesSearch = userProducts.some(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesCategory =
        selectedCategory === "all" ||
        userProducts.some(
          (product) =>
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        );

      const matchesPrice = userProducts.some(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      const matchesRating = user.rating >= minRating;

      const matchesQuickFilter =
        quickFilter === "all" ||
        (quickFilter === "nearby" &&
          userLocation &&
          calculateDistance(
            userLocation[0],
            userLocation[1],
            user.location.latitude,
            user.location.longitude
          ) < 2) ||
        (quickFilter === "free" &&
          userProducts.some((product) => product.price === 0));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesQuickFilter
      );
    });
  }, [
    allUsers,
    productsByUser,
    searchQuery,
    selectedCategory,
    priceRange,
    minRating,
    quickFilter,
    userLocation,
  ]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>(products.map((product) => product.category));
    return ["all", ...Array.from(cats)];
  }, [products]);

  // Cluster users
  const clusteredUsers = useMemo(() => {
    if (!map) return [];
    return clusterUsers(filteredUsers, productsByUser, zoom, map);
  }, [filteredUsers, productsByUser, zoom, map]);

  // Map style
  const mapStyle = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  };

  const handleLocationFound = useCallback((lat: number, lng: number) => {
    setUserLocation([lat, lng]);
    setCenter([lat, lng]);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleUserClick = useCallback(
    (position: [number, number]) => {
      setCenter(position);
      if (map) {
        map.setView(position, Math.max(map.getZoom(), 16));
      }
    },
    [map]
  );

  // Update zoom level
  const MapZoomController = () => {
    const map = useMap();
    useEffect(() => {
      setMap(map);
      const updateZoom = () => setZoom(map.getZoom());
      map.on("zoomend", updateZoom);
      return () => {
        map.off("zoomend", updateZoom);
      };
    }, [map]);
    return null;
  };

  return (
    <div className="relative w-full h-[100vh] rounded-2xl overflow-hidden">
      {/* Collapsible Search/Filter Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            className="absolute top-4 left-4 z-[1000] w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-4"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Find Products</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsPanelOpen(false)}
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Search products or users..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 bg-transparent border-gray-300 dark:border-gray-600 focus:ring-primary text-sm rounded-full"
                aria-label="Search products or users"
              />
              {searchQuery && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-1 block">
                Quick Filters
              </label>
              <Select value={quickFilter} onValueChange={setQuickFilter}>
                <SelectTrigger className="bg-transparent border-gray-300 dark:border-gray-600 text-sm rounded-full">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="nearby">Nearby (&lt;2km)</SelectItem>
                  <SelectItem value="free">Free Items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-1 block">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="bg-transparent border-gray-300 dark:border-gray-600 text-sm rounded-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="capitalize"
                    >
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-1 block">
                Price Range
              </label>
              <Slider
                value={priceRange}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
                min={0}
                max={1000}
                step={10}
                className="mt-2"
                aria-label="Price range filter"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-xs font-medium mb-1 block">
                Min Rating
              </label>
              <Select
                value={minRating.toString()}
                onValueChange={(value) => setMinRating(Number(value))}
              >
                <SelectTrigger className="bg-transparent border-gray-300 dark:border-gray-600 text-sm rounded-full">
                  <SelectValue placeholder="Min Rating" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating === 0 ? "Any Rating" : `${rating}+ Stars`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel Toggle Icon */}
      <motion.div
        className="absolute top-4 left-4 z-[1000]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          aria-label={isPanelOpen ? "Close filter panel" : "Open filter panel"}
        >
          <Filter className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* User Popup */}
      <AnimatePresence>
        {hoveredUser && (
          <motion.div
            className="absolute bottom-4 right-4 z-[1000] w-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white/95 to-gray-100/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16 border-4 border-primary/50">
                    <AvatarImage
                      src={hoveredUser.image}
                      alt={hoveredUser.name}
                    />
                    <AvatarFallback>{hoveredUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{hoveredUser.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(hoveredUser.rating)
                                ? "fill-yellow-500"
                                : "fill-transparent"
                            }`}
                          />
                        ))}
                      <span className="ml-1 text-sm font-medium">
                        {hoveredUser.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {hoveredUser.location.address},{" "}
                      {hoveredUser.location.city}
                    </span>
                  </div>
                  {userLocation && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        Distance:{" "}
                        {calculateDistance(
                          userLocation[0],
                          userLocation[1],
                          hoveredUser.location.latitude,
                          hoveredUser.location.longitude
                        ).toFixed(1)}{" "}
                        km
                      </span>
                    </div>
                  )}
                  {hoveredUser.location.university && (
                    <div className="flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      <span>{hoveredUser.location.university}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      Member since {format(hoveredUser.joinedAt, "MMM yyyy")}
                    </span>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-3">
                  Listed Products (
                  {(productsByUser.get(hoveredUser.id) || []).length})
                </h4>
                <div className="relative">
                  <motion.div
                    className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(productsByUser.get(hoveredUser.id) || []).map(
                      (product) => (
                        <motion.div
                          key={product.id}
                          className="flex-none w-64 snap-center"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="border-0 bg-white/50 dark:bg-gray-700/50">
                            <div className="relative h-40">
                              <img
                                src={
                                  product.images[0] || "/default-product.png"
                                }
                                alt={product.title}
                                className="w-full h-full object-cover rounded-t-lg"
                              />
                              <Badge className="absolute top-2 right-2 shadow-md">
                                {product.price === 0
                                  ? "Free"
                                  : `$${product.price}`}
                              </Badge>
                            </div>
                            <CardContent className="p-3">
                              <h5 className="text-sm font-semibold truncate">
                                {product.title}
                              </h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {product.category}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {format(product.createdAt, "MMM d, yyyy")}
                                </span>
                              </div>
                              <Link href={`/product/${product.id}`}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="w-full mt-2 h-7 text-xs"
                                >
                                  View Item{" "}
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    )}
                  </motion.div>
                </div>

                <Link href={`/user/${hoveredUser.id}`}>
                  <Button
                    size="sm"
                    className="w-full mt-4 h-8 bg-gradient-to-r from-primary to-primary/80"
                  >
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom
        zoomControl={false}
        dragging
        className="h-full w-full"
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={resolvedTheme === "dark" ? mapStyle.dark : mapStyle.light}
          errorTileUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapReady && (
          <>
            <MapThemeController theme={resolvedTheme} />
            <MapInitializer onLocationFound={handleLocationFound} />
            <MapZoomController />

            {/* Current user location marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={L.divIcon({
                  className: "current-location-marker",
                  html: `
                    <div class="relative">
                      <div class="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg">
                        <div class="w-3 h-3 rounded-full bg-white"></div>
                      </div>
                      <div class="absolute top-0 left-0 w-8 h-8 rounded-full bg-blue-500 opacity-30 animate-ping"></div>
                    </div>
                  `,
                  iconSize: [32, 32],
                  iconAnchor: [16, 16],
                })}
              />
            )}

            {/* Clustered User Markers */}
            {clusteredUsers.map((cluster, index) => {
              if (cluster.users.length === 1) {
                const user = cluster.users[0];
                const userProducts = productsByUser.get(user.id) || [];
                return (
                  <Marker
                    key={user.id}
                    position={[user.location.latitude, user.location.longitude]}
                    icon={createUserAvatarIcon(user, userProducts.length)}
                    eventHandlers={{
                      mouseover: () => setHoveredUser(user),
                      mouseout: () => setHoveredUser(null),
                      click: () =>
                        handleUserClick([
                          user.location.latitude,
                          user.location.longitude,
                        ]),
                    }}
                  >
                    <Popup className="user-popup" closeButton={false}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-80"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-14 w-14 border-4 border-primary/50">
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
                              {user.name}
                            </p>
                            <div className="flex items-center text-yellow-500">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(user.rating)
                                        ? "fill-yellow-500"
                                        : "fill-transparent"
                                    }`}
                                  />
                                ))}
                              <span className="ml-1 text-sm font-medium">
                                {user.rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                          {user.location.university && (
                            <div className="flex items-center">
                              <Info className="w-4 h-4 mr-2" />
                              <span>{user.location.university}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>
                              {user.location.address}, {user.location.city}
                            </span>
                          </div>
                          {userLocation && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>
                                Distance:{" "}
                                {calculateDistance(
                                  userLocation[0],
                                  userLocation[1],
                                  user.location.latitude,
                                  user.location.longitude
                                ).toFixed(1)}{" "}
                                km
                              </span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>
                              Member since {format(user.joinedAt, "MMM yyyy")}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-lg font-semibold mb-3">
                          Listed Products ({userProducts.length})
                        </h4>
                        <div className="relative">
                          <motion.div
                            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
                            initial={{ x: 0 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {userProducts.map((product) => (
                              <motion.div
                                key={product.id}
                                className="flex-none w-64 snap-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Card className="border-0 bg-white/50 dark:bg-gray-700/50">
                                  <div className="relative h-40">
                                    <img
                                      src={
                                        product.images[0] ||
                                        "/default-product.png"
                                      }
                                      alt={product.title}
                                      className="w-full h-full object-cover rounded-t-lg"
                                    />
                                    <Badge className="absolute top-2 right-2 shadow-md">
                                      {product.price === 0
                                        ? "Free"
                                        : `$${product.price}`}
                                    </Badge>
                                  </div>
                                  <CardContent className="p-3">
                                    <h5 className="text-sm font-semibold truncate">
                                      {product.title}
                                    </h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                      {product.description}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs capitalize"
                                      >
                                        {product.category}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        {format(
                                          product.createdAt,
                                          "MMM d, yyyy"
                                        )}
                                      </span>
                                    </div>
                                    <Link href={`/product/${product.id}`}>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="w-full mt-2 h-7 text-xs"
                                      >
                                        View Item{" "}
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                      </Button>
                                    </Link>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>

                        <Link href={`/user/${user.id}`}>
                          <Button
                            size="sm"
                            className="w-full mt-4 h-8 bg-gradient-to-r from-primary to-primary/80"
                          >
                            View Profile
                          </Button>
                        </Link>
                      </motion.div>
                    </Popup>
                  </Marker>
                );
              }

              return (
                <Marker
                  key={`cluster-${index}`}
                  position={cluster.position}
                  icon={createClusterIcon(cluster.users.length)}
                  eventHandlers={{
                    click: () => handleUserClick(cluster.position),
                  }}
                >
                  <Popup className="cluster-popup" closeButton={false}>
                    <div className="w-64">
                      <h4 className="text-lg font-semibold mb-3">
                        {cluster.users.length} Seller
                        {cluster.users.length > 1 ? "s" : ""}
                      </h4>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {cluster.users.map((user) => {
                          const userProducts =
                            productsByUser.get(user.id) || [];
                          return (
                            <div
                              key={user.id}
                              className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 cursor-pointer"
                              onClick={() =>
                                handleUserClick([
                                  user.location.latitude,
                                  user.location.longitude,
                                ])
                              }
                            >
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {userProducts.length} item
                                  {userProducts.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}
      </MapContainer>

      {/* Custom Styles */}
      <style jsx global>{`
        .leaflet-container {
          font-family: inherit;
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
        }

        .dark-map .leaflet-tile {
          filter: brightness(0.8);
        }

        .user-popup .leaflet-popup-content-wrapper,
        .cluster-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
          background: transparent;
        }

        .user-popup .leaflet-popup-content,
        .cluster-popup .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }

        .leaflet-popup-tip {
          background: transparent;
        }

        .dark .leaflet-popup-content-wrapper,
        .dark .leaflet-popup-tip {
          background: transparent;
        }

        .custom-avatar-marker,
        .custom-cluster-marker {
          background: transparent !important;
          border: none !important;
        }

        .avatar-container {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .avatar-container:hover {
          transform: scale(1.15);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }

        .leaflet-container {
          touch-action: auto !important;
        }
      `}</style>
    </div>
  );
};

export default MapExchange;
