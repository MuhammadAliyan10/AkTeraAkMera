"use client";
import { useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  X,
  MapPin,
  DollarSign,
  Tag,
  FileText,
  Truck,
  Mail,
  Phone,
} from "lucide-react";

// Import shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Sample data structures (aligned with search page)
type Location = {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  university: string;
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
  tags: string[];
  specifics: { [key: string]: string };
  deliveryOptions: string[];
  contactPreferences: string[];
};

// Categories, conditions, and other options
const categories = [
  "Electronics",
  "Books",
  "Furniture",
  "Clothing",
  "Home",
  "Sports",
  "Stationery",
];
const conditions = ["New", "Like New", "Used", "Refurbished"];
const universities = ["NYU", "Columbia", "Fordham", "Pace University"];
const deliveryOptions = ["Meetup", "Drop-off", "Shipping"];
const contactPreferences = ["Email", "Phone", "Chat"];
const suggestedTags = [
  "urgent",
  "negotiable",
  "bundle",
  "pickup only",
  "brand new",
];

// Sell Page Component
export default function SellPage() {
  const pathname = usePathname();
  const [formData, setFormData] = useState<Product>({
    id: "",
    title: "",
    description: "",
    images: [],
    price: 0,
    category: "",
    condition: "",
    location: {
      latitude: 0,
      longitude: 0,
      address: "",
      city: "New York",
      university: "",
    },
    tags: [],
    specifics: {},
    deliveryOptions: [],
    contactPreferences: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [customTag, setCustomTag] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "address" || name === "city" || name === "university") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    if (name === "university") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData((prev) => ({ ...prev, price: isNaN(value) ? 0 : value }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 5 - imageFiles.length); // Limit to 5 images
      setImageFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle tags
  const addTag = (tag: string) => {
    if (
      tag.trim() &&
      !formData.tags.includes(tag.trim()) &&
      formData.tags.length < 5
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
      setCustomTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Handle specifics
  const handleSpecificChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifics: { ...prev.specifics, [key]: value },
    }));
  };

  // Handle delivery options and contact preferences
  const handleCheckboxChange = (
    option: string,
    type: "deliveryOptions" | "contactPreferences"
  ) => {
    setFormData((prev) => {
      const currentOptions = prev[type];
      const updatedOptions = currentOptions.includes(option)
        ? currentOptions.filter((o) => o !== option)
        : [...currentOptions, option];
      return { ...prev, [type]: updatedOptions };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.condition ||
      !formData.location.university ||
      imageFiles.length === 0
    ) {
      setError(
        "Please fill in all required fields and upload at least one image."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form
      setFormData({
        id: "",
        title: "",
        description: "",
        images: [],
        price: 0,
        category: "",
        condition: "",
        location: {
          latitude: 0,
          longitude: 0,
          address: "",
          city: "New York",
          university: "",
        },
        tags: [],
        specifics: {},
        deliveryOptions: [],
        contactPreferences: [],
      });
      setImageFiles([]);
      setSuccess(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Redirect to search page with query
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("q", formData.title);
      window.history.pushState({}, "", `/search?${newSearchParams.toString()}`);
    } catch (err) {
      setError("An error occurred while listing your item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <Head>
        <title>List an Item | Campus Market</title>
        <meta
          name="description"
          content="List your items for sale on Campus Market"
        />
      </Head>

      <div className="container mx-auto min-h-screen px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center"
        >
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">List an Item</h1>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Basic Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., iPhone Charger Cable"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your item (condition, features, etc.)"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 min-h-[120px] dark:bg-slate-800"
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="text-sm font-medium">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={formData.price || ""}
                      onChange={handlePriceChange}
                      className="pl-10 dark:bg-slate-800"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* Category & Condition */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Item Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                    value={formData.category}
                  >
                    <SelectTrigger className="mt-1 dark:bg-slate-800">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition" className="text-sm font-medium">
                    Condition <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("condition", value)
                    }
                    value={formData.condition}
                  >
                    <SelectTrigger className="mt-1 dark:bg-slate-800">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-sm font-medium">Tags (up to 5)</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    ref={tagInputRef}
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="Add a tag"
                    className="dark:bg-slate-800"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(customTag);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(customTag)}
                    disabled={!customTag.trim() || formData.tags.length >= 5}
                  >
                    <Tag className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedTags
                    .filter((tag) => !formData.tags.includes(tag))
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* Images */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Images</h2>
              <div>
                <Label className="text-sm font-medium">
                  Upload Images (up to 5, at least 1 required){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="mt-1 flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="dark:bg-slate-800"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">
                    {imageFiles.length}/5
                  </span>
                </div>
                <AnimatePresence>
                  {imageFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-4 mt-4"
                    >
                      {imageFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative h-24 w-24"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* Additional Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Additional Details</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="specifics">
                  <AccordionTrigger>Item Specifics</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {formData.category === "Electronics" && (
                        <>
                          <div>
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                              id="brand"
                              value={formData.specifics.brand || ""}
                              onChange={(e) =>
                                handleSpecificChange("brand", e.target.value)
                              }
                              placeholder="e.g., Apple"
                              className="mt-1 dark:bg-slate-800"
                            />
                          </div>
                          <div>
                            <Label htmlFor="model">Model</Label>
                            <Input
                              id="model"
                              value={formData.specifics.model || ""}
                              onChange={(e) =>
                                handleSpecificChange("model", e.target.value)
                              }
                              placeholder="e.g., iPhone 13"
                              className="mt-1 dark:bg-slate-800"
                            />
                          </div>
                        </>
                      )}
                      {formData.category === "Books" && (
                        <>
                          <div>
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input
                              id="isbn"
                              value={formData.specifics.isbn || ""}
                              onChange={(e) =>
                                handleSpecificChange("isbn", e.target.value)
                              }
                              placeholder="e.g., 978-3-16-148410-0"
                              className="mt-1 dark:bg-slate-800"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edition">Edition</Label>
                            <Input
                              id="edition"
                              value={formData.specifics.edition || ""}
                              onChange={(e) =>
                                handleSpecificChange("edition", e.target.value)
                              }
                              placeholder="e.g., 2nd Edition"
                              className="mt-1 dark:bg-slate-800"
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <Label htmlFor="customSpecific">Custom Specific</Label>
                        <Input
                          id="customSpecific"
                          value={formData.specifics.custom || ""}
                          onChange={(e) =>
                            handleSpecificChange("custom", e.target.value)
                          }
                          placeholder="e.g., Color, Size"
                          className="mt-1 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delivery">
                  <AccordionTrigger>Delivery Options</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {deliveryOptions.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`delivery-${option}`}
                            checked={formData.deliveryOptions.includes(option)}
                            onCheckedChange={() =>
                              handleCheckboxChange(option, "deliveryOptions")
                            }
                          />
                          <Label
                            htmlFor={`delivery-${option}`}
                            className="text-sm"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contact">
                  <AccordionTrigger>Contact Preferences</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {contactPreferences.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`contact-${option}`}
                            checked={formData.contactPreferences.includes(
                              option
                            )}
                            onCheckedChange={() =>
                              handleCheckboxChange(option, "contactPreferences")
                            }
                          />
                          <Label
                            htmlFor={`contact-${option}`}
                            className="text-sm"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* Location */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Location</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="university" className="text-sm font-medium">
                    University <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("university", value)
                    }
                    value={formData.location.university}
                  >
                    <SelectTrigger className="mt-1 dark:bg-slate-800">
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((university) => (
                        <SelectItem key={university} value={university}>
                          {university}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="e.g., 123 Main St"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    className="mt-1 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="e.g., New York"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="mt-1 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-destructive"
                >
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-green-500"
                >
                  <Check className="h-5 w-5" />
                  <p>Item listed successfully! Redirecting to search...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" className="px-8" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Listing...
                  </>
                ) : (
                  "List Item"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
