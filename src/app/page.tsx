"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  X,
  MapPin,
  Search,
  Repeat,
  Clock,
  ShieldCheck,
  ArrowRight,
  Users,
  BarChart3,
  Send,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// Feature Categories
const categories = [
  { name: "Electronics", count: 245, icon: "💻" },
  { name: "Furniture", count: 189, icon: "🪑" },
  { name: "Books", count: 327, icon: "📚" },
  { name: "Clothing", count: 412, icon: "👕" },
  { name: "Sports", count: 156, icon: "🏀" },
  { name: "Tools", count: 98, icon: "🔧" },
];

// Featured Exchange Items
const featuredItems = [
  {
    id: 1,
    title: "MacBook Pro 2022",
    description: "Great condition, looking to exchange for a gaming laptop",
    user: "Alex K.",
    userAvatar: "/api/placeholder/32/32",
    location: "Midtown, 0.5 miles away",
    type: "Exchange",
    duration: "Permanent",
    image: "/Home/Macbook.jpg",
  },
  {
    id: 2,
    title: "Mountain Bike",
    description: "Hardly used, can exchange for 2 weeks or sell for $120",
    user: "Maya T.",
    userAvatar: "/api/placeholder/32/32",
    location: "Downtown, 1.2 miles away",
    type: "Exchange or Buy",
    duration: "2 weeks or Permanent",
    image: "/Home/MountainBike.jpeg",
  },
  {
    id: 3,
    title: "Professional Camera",
    description: "Need for a weekend photoshoot, can exchange with my drone",
    user: "Sam W.",
    userAvatar: "/api/placeholder/32/32",
    location: "West End, 0.8 miles away",
    type: "Exchange",
    duration: "3 days",
    image: "/Home/Camera.webp",
  },
  {
    id: 4,
    title: "Portable Speaker",
    description:
      "JBL Flip 5, perfect for small gatherings, looking to borrow a projector instead",
    user: "Jordan P.",
    userAvatar: "/api/placeholder/32/32",
    location: "Northside, 1.5 miles away",
    type: "Exchange",
    duration: "Weekend",
    image: "/Home/Speaker.jpeg",
  },
];

// Testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Frequent User",
    content:
      "AkTeraAkMera saved me so much money! I needed a power drill for just one project and was able to exchange my old keyboard for it for a weekend.",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "New User",
    content:
      "The quantum security features give me peace of mind when exchanging valuable items. The location-based matching is incredibly convenient!",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Power User",
    content:
      "I've done over 50 exchanges on this platform. The temporary exchange option is brilliant for trying things before committing to buy.",
    avatar: "/api/placeholder/40/40",
  },
];

// Stats
const stats = [
  { label: "Active Users", value: "10k+", icon: <Users className="h-4 w-4" /> },
  {
    label: "Successful Exchanges",
    value: "25k+",
    icon: <Repeat className="h-4 w-4" />,
  },
  {
    label: "Average Response Time",
    value: "5 min",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    label: "Security Rating",
    value: "99.9%",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Check if user is offline
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  // Detect scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mb-4"
        >
          <Repeat className="h-12 w-12 text-primary" />
        </motion.div>
        <motion.h1
          className="text-2xl font-bold text-primary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          AkTeraAkMera
        </motion.h1>
        <p className="text-muted-foreground mt-2">
          Loading your exchange marketplace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Offline Alert */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <Alert variant="destructive" className="rounded-none border-b">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>You're offline</AlertTitle>
              <AlertDescription>
                Please check your internet connection to continue using
                AkTeraAkMera.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Repeat className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AkTeraAkMera</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-4">
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Exchange
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Near Me
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                How It Works
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Link href={"/login"}> Log In</Link>
              </Button>
              <Button size="sm">
                <Link href={"/register"}>Sign Up</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                      <Repeat className="h-5 w-5 text-primary" />
                      <h2 className="font-bold">AkTeraAkMera</h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-4 py-4">
                    <a
                      href="#"
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Exchange
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Near Me
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      How It Works
                    </a>
                  </nav>
                  <div className="mt-auto flex flex-col gap-2 py-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log In
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10" />

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="flex flex-col gap-6"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Badge variant="outline" className="w-fit">
                  Introducing AkTeraAkMera
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Exchange Items <span className="text-primary">Locally</span>
                  <br />
                  Save Money & Resources
                </h1>
                <p className="text-muted-foreground text-lg max-w-md">
                  Exchange items temporarily or permanently within your
                  neighborhood. Secure, quick, and quantum-protected.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Button size="lg" className="gap-2">
                    Start Exchanging <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    How It Works
                  </Button>
                </div>

                <motion.div
                  className="flex flex-wrap gap-4 mt-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={fadeIn}
                      className="bg-background/80 backdrop-blur-sm border rounded-lg px-4 py-2 flex items-center gap-2"
                    >
                      {stat.icon}
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="font-medium">{stat.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="aspect-square md:aspect-[4/3] bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl overflow-hidden flex items-center justify-center relative">
                  <img
                    src="/Home/Home.avif"
                    alt="People exchanging items"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                  />
                  <div className="relative z-10 flex flex-col items-center gap-6 p-6 text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="bg-background/90 backdrop-blur-lg border rounded-xl p-4 shadow-lg max-w-xs"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="text-primary h-5 w-5" />
                        <h3 className="font-medium">Find Items Near You</h3>
                      </div>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search by location..."
                          className="pr-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="w-full max-w-xs bg-background/90 backdrop-blur-lg rounded-xl border shadow-lg overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage
                              src="/Home/UserAvatar.jpg"
                              alt="Profile"
                            />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Mountain Bike</h3>
                            <p className="text-sm text-muted-foreground">
                              Exchange for 2 weeks
                            </p>
                          </div>
                          <Badge className="ml-auto">0.5 mi</Badge>
                        </div>
                      </div>
                      <div className="h-24 bg-accent flex items-center justify-center">
                        <img
                          src="/Home/MountainBike.jpeg"
                          alt="Mountain Bike"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <motion.section
          className="py-16 md:py-24 bg-muted/50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">
                How AkTeraAkMera Works
              </h2>
              <p className="text-muted-foreground">
                Our quantum-secured platform makes exchanging items with people
                in your area safe and easy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <motion.div
                className="bg-background rounded-xl p-6 border shadow-sm flex flex-col items-center text-center"
                variants={fadeIn}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Find Items</h3>
                <p className="text-muted-foreground">
                  Browse items available for exchange in your neighborhood or
                  post what you're looking for.
                </p>
              </motion.div>

              <motion.div
                className="bg-background rounded-xl p-6 border shadow-sm flex flex-col items-center text-center"
                variants={fadeIn}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Repeat className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Arrange Exchange</h3>
                <p className="text-muted-foreground">
                  Agree on terms - temporary exchange (15 minutes to days) or
                  permanent swap.
                </p>
              </motion.div>

              <motion.div
                className="bg-background rounded-xl p-6 border shadow-sm flex flex-col items-center text-center"
                variants={fadeIn}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Secure Exchange</h3>
                <p className="text-muted-foreground">
                  Meet safely with our verified user system and quantum-secured
                  transaction protocol.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Browse Categories */}
        <motion.section
          className="py-16 md:py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Find exactly what you need or discover new items to exchange
                  in your area.
                </p>
              </div>
              <Button variant="ghost" className="w-fit">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-background border rounded-xl p-6 flex flex-col items-center text-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-medium mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {category.count} items
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Featured Items */}
        <motion.section
          className="py-16 md:py-24 bg-muted/50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Exchanges</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Discover popular items available for exchange in your area.
                </p>
              </div>
              <Tabs defaultValue="nearby" className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="nearby">Nearby</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="h-48 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-background text-foreground">
                        {item.type}
                      </Badge>
                    </div>
                    <CardHeader className="py-4">
                      <div className="flex justify-between items-start">
                        <CardTitle>{item.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mt-1"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {item.location}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="py-0 flex-grow">
                      <p className="text-sm">{item.description}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Duration: {item.duration}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t mt-4 pt-4">
                      <div className="flex items-center gap-2 w-full">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={item.userAvatar} alt={item.user} />
                          <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{item.user}</span>
                        <Button size="sm" variant="default" className="ml-auto">
                          Contact
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex justify-center mt-12">
              <Button>View More Exchanges</Button>
            </div>
          </div>
        </motion.section>

        {/* Map Section */}
        <motion.section
          className="py-16 md:py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Find Exchanges Near You
              </h2>
              <p className="text-muted-foreground">
                Our location-based service connects you with exchange
                opportunities in your neighborhood.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden border shadow-sm h-96 relative"
            >
              <img
                src="/Home/Map.jpg"
                alt="Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-background border rounded-xl p-4 max-w-md mx-auto">
                  <h3 className="text-lg font-medium mb-2">
                    Discover items around you
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <Input
                      type="text"
                      placeholder="Enter your location"
                      className="flex-grow"
                    />
                    <Button>Search</Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-background/80">
                      Electronics
                    </Badge>
                    <Badge variant="outline" className="bg-background/80">
                      Furniture
                    </Badge>
                    <Badge variant="outline" className="bg-background/80">
                      Books
                    </Badge>
                    <Badge variant="outline" className="bg-background/80">
                      More...
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Map markers */}
              <motion.div
                className="absolute top-1/4 left-1/4 h-6 w-6"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatType: "loop",
                }}
              >
                <div className="h-full w-full rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/3 right-1/3 h-6 w-6"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatType: "loop",
                  delay: 0.5,
                }}
              >
                <div className="h-full w-full rounded-full bg-secondary/20 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-secondary" />
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 right-1/4 h-6 w-6"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatType: "loop",
                  delay: 1,
                }}
              >
                <div className="h-full w-full rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          className="py-16 md:py-24 bg-muted/50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="outline" className="mb-4">
                Why Choose AkTeraAkMera
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Quantum-Protected Exchange Platform
              </h2>
              <p className="text-muted-foreground">
                Our platform uses cutting-edge technology to ensure your
                exchanges are safe, secure, and convenient.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <motion.div
                variants={fadeIn}
                className="bg-background rounded-xl p-6 border shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Location-Based Matching
                </h3>
                <p className="text-muted-foreground">
                  Find exchange partners near you to minimize travel and
                  maximize convenience.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="bg-background rounded-xl p-6 border shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Flexible Time Periods
                </h3>
                <p className="text-muted-foreground">
                  Exchange items for as little as 15 minutes or as long as
                  needed, with clear return dates.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="bg-background rounded-xl p-6 border shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Quantum Security</h3>
                <p className="text-muted-foreground">
                  Advanced quantum algorithms protect your data and verify all
                  exchanges with military-grade security.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="bg-background rounded-xl p-6 border shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Verified User Profiles
                </h3>
                <p className="text-muted-foreground">
                  Exchange with confidence through our robust user verification
                  system and reputation scores.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="bg-background rounded-xl p-6 border shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Repeat className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Multiple Exchange Options
                </h3>
                <p className="text-muted-foreground">
                  Temporary borrowing, permanent swaps, or buy options - choose
                  what works for you.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="bg-background rounded-xl p-6 border shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Smart Recommendations
                </h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your preferences to suggest the most relevant
                  exchange opportunities.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          className="py-16 md:py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground">
                Join thousands of satisfied users who are sharing resources and
                saving money.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-background rounded-xl p-6 border shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="italic">{testimonial.content}</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="text-yellow-500">
                        ★
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/10">
          <motion.div
            className="container mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-background rounded-2xl p-8 md:p-12 border shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to Start Exchanging?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Join AkTeraAkMera today and discover a new way to access the
                    things you need while sharing resources with your community.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" className="gap-2">
                      Create Account <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </div>
                </div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden flex items-center justify-center relative">
                    <img
                      src="/api/placeholder/600/400"
                      alt="AkTeraAkMera in action"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                        <div className="h-14 w-14 bg-primary/90 rounded-full flex items-center justify-center">
                          <div className="ml-1 w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Newsletter */}
        <motion.section
          className="py-16 md:py-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-6">
                Get notified about new features, exchange opportunities, and
                tips for better exchanges.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow"
                />
                <Button className="gap-2">
                  Subscribe <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                We respect your privacy and will never share your information.
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Repeat className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">AkTeraAkMera</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                The next generation of item exchange, powered by quantum
                security and community trust.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Temporary Exchange
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Permanent Swap
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Location Matching
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Quantum Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    User Verification
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">
                  support@akteraakmera.com
                </li>
                <li className="text-muted-foreground">+1 (555) 123-4567</li>
                <li className="text-muted-foreground">
                  123 Exchange Street, Tech City
                </li>
              </ul>
              <Button variant="outline" className="mt-4">
                Contact Us
              </Button>
            </div>
          </div>

          <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 AkTeraAkMera. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
