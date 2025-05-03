"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Search,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";

// Import shadcn components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockProducts, mockUsers } from "@/app/data/mock-data";
import { Product, User } from "@/app/types";

// Placeholder data for demo purposes
const mockUser: User[] = mockUsers;

const products: Product[] = mockProducts;

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer"
    >
      <Card className="h-full overflow-hidden border shadow-sm dark:bg-slate-900">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={product.images[0] || product.images[1]}
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
            <span>{product.location.city}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Product Slider Component
const ProductSlider = ({
  title,
  products,
  icon: Icon,
  viewAllLink,
}: {
  title: string;
  products: Product[];
  icon: React.ElementType;
  viewAllLink: string;
}) => {
  return (
    <section className="py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <Link href={viewAllLink} passHref>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            See All <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative pb-8 pt-16"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <motion.h1
              className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Find What You Need <span className="text-primary">On Campus</span>
            </motion.h1>
            <motion.p
              className="mb-6 text-lg text-muted-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Buy, sell, and discover items from students around your
              university. The easiest way to get what you need or make some
              extra cash.
            </motion.p>
            <motion.div
              className="flex w-full flex-col gap-4 sm:flex-row"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search for items..." className="pl-10" />
              </div>
              <Button className="shrink-0">Find Items</Button>
            </motion.div>
          </div>
          <motion.div
            className="relative hidden md:block"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="aspect-square overflow-hidden rounded-lg">
              <Image
                src="/Home/Home.avif"
                alt="Marketplace items"
                width={600}
                height={600}
                className="object-cover"
              />
            </div>
            <div className="absolute -left-8 -top-8 h-40 w-40 overflow-hidden rounded-xl">
              <Image
                src="/Home/Home.avif"
                alt="Featured item"
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 h-32 w-32 overflow-hidden rounded-full border-4 border-background">
              <Image
                src="/Home/Home.avif"
                alt="Featured item"
                width={150}
                height={150}
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// Category Tabs Component
const CategoryTabs = () => {
  const categories = [
    { id: "all", label: "All" },
    { id: "electronics", label: "Electronics" },
    { id: "books", label: "Books" },
    { id: "furniture", label: "Furniture" },
    { id: "clothing", label: "Clothing" },
    { id: "home", label: "Home" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex w-full justify-start overflow-x-auto pb-2">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="min-w-max"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Campus Marketplace - Buy & Sell Student Items</title>
        <meta
          name="description"
          content="Buy and sell items around your university campus"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <HeroSection />

        <div className="container mx-auto px-4">
          <CategoryTabs />

          <ProductSlider
            title="For You"
            products={products}
            icon={Star}
            viewAllLink="/categories/for-you"
          />

          <ProductSlider
            title="Near You"
            products={products.slice(2, 7).concat(products[0])}
            icon={MapPin}
            viewAllLink="/categories/near-you"
          />

          <ProductSlider
            title="Trending"
            products={products.slice(1, 6).concat(products[0])}
            icon={TrendingUp}
            viewAllLink="/categories/trending"
          />

          <ProductSlider
            title="Recently Added"
            products={products.slice(3).concat(products.slice(0, 2))}
            icon={Clock}
            viewAllLink="/categories/recent"
          />

          <ProductSlider
            title="Best Rated"
            products={products.slice(4).concat(products.slice(0, 3))}
            icon={BadgeCheck}
            viewAllLink="/categories/best-rated"
          />
        </div>
      </main>
    </>
  );
}
