"use client";

// This page handles the purchase process for a product, displaying a product summary,
// order total, and a checkout form for billing and payment details. It uses a full-page
// layout for clarity, with a floating chat icon and a confirmation modal after purchase.

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Phone,
  ShoppingCart,
  X,
  CreditCard,
  Loader2,
  Check,
} from "lucide-react";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Toaster, useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { mockProducts } from "@/app/data/mock-data";

// Define TypeScript interfaces
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

// Mock API function
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

export default function PurchasePage() {
  // Extract product ID from URL params
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  // State for product data, loading, chat icon, form submission, confirmation modal, and billing info
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatIconOpen, setChatIconOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "",
  });

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

  // Handle input changes for billing form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle payment method selection
  const handleSelectChange = (value: string) => {
    setBillingInfo((prev) => ({ ...prev, paymentMethod: value }));
  };

  // Handle purchase form submission
  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form fields
    if (
      !billingInfo.fullName ||
      !billingInfo.email ||
      !billingInfo.phone ||
      !billingInfo.address ||
      !billingInfo.city ||
      !billingInfo.zipCode ||
      !billingInfo.paymentMethod
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call for purchase
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowConfirmation(true);
      // Reset form
      setBillingInfo({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        paymentMethod: "",
      });
      toast({
        title: "Purchase Successful",
        description: "Your order has been placed!",
        variant: "success",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process purchase. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading skeleton while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-background ">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-background flex items-center justify-center">
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

      {/* Confirmation Dialog: Shown after successful purchase */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>Purchase Confirmed</DialogTitle>
            <DialogDescription>
              Your order for "{product.title}" has been successfully placed!
              You'll receive a confirmation email soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="dark:bg-slate-700 border-none"
              onClick={() => router.push(`/products/${productId}/chat`)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
            <Button
              onClick={() => {
                setShowConfirmation(false);
                router.push("/products");
              }}
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content: Full-page layout with two-column grid */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Product Summary: Image, title, badges, description, order summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-6"
          >
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                ${product.price.toFixed(2)}
              </Badge>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs capitalize">
                  {product.condition}
                </Badge>
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {product.category}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2 line-clamp-3">
                {product.description}
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <Separator className="dark:bg-slate-700" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full dark:bg-slate-800 border-none"
              onClick={() => router.push(`/products/${productId}/chat`)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with Seller
            </Button>
          </motion.div>

          {/* Checkout Form: Collects billing and payment details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold">Checkout</h2>
            <form onSubmit={handlePurchase} className="space-y-6">
              {/* Billing Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={billingInfo.fullName}
                      onChange={handleInputChange}
                      className="mt-1 dark:bg-slate-700 border-none"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={billingInfo.email}
                      onChange={handleInputChange}
                      className="mt-1 dark:bg-slate-700 border-none"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={billingInfo.phone}
                      onChange={handleInputChange}
                      className="mt-1 dark:bg-slate-700 border-none"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={billingInfo.address}
                      onChange={handleInputChange}
                      className="mt-1 dark:bg-slate-700 border-none"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={billingInfo.city}
                      onChange={handleInputChange}
                      className="mt-1 dark:bg-slate-700 border-none"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={billingInfo.zipCode}
                      onChange={handleInputChange}
                      className="mt-1 dark:bg-slate-700 border-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <Select onValueChange={handleSelectChange} required>
                  <SelectTrigger className="dark:bg-slate-700 border-none">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800">
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cash">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Purchase Now
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
