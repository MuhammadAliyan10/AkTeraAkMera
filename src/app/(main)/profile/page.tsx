"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit,
  Save,
  X,
  Star,
  DollarSign,
  Users,
  Tag,
  Check,
  AlertCircle,
  Loader2,
  Link,
} from "lucide-react";

// Import shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample user data structure
type Location = {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  university: string;
};

type Review = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
};

type UserProfile = {
  fullName: string;
  email: string;
  username: string;
  phoneNumber: string;
  age: number;
  cnic: string;
  passportNumber: string;
  location: Location;
  bio: string;
  profilePic: string;
  coverImage: string;
  socialLinks: { platform: string; url: string }[];
  totalFriends: number;
  totalSales: number;
  totalEarned: number;
  totalSpent: number;
  rating: number;
  reviews: Review[];
  joinedDate: string;
  isVerified: boolean;
};

// Mock user data
const mockUser: UserProfile = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  username: "johndoe123",
  phoneNumber: "+1 (555) 123-4567",
  age: 22,
  cnic: "12345-6789012-3",
  passportNumber: "AB1234567",
  location: {
    latitude: 40.7128,
    longitude: -74.006,
    address: "123 Main St",
    city: "New York",
    university: "NYU",
  },
  bio: "Student at NYU, passionate about tech and sustainability.",
  profilePic: "/Home/Camera.webp",
  coverImage: "/Home/Camera.webp",
  socialLinks: [
    { platform: "Twitter", url: "https://twitter.com/johndoe" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
  ],
  totalFriends: 45,
  totalSales: 12,
  totalEarned: 1500.75,
  totalSpent: 320.5,
  rating: 4.8,
  reviews: [
    {
      id: "review1",
      reviewerName: "Jane Smith",
      rating: 5,
      comment: "Great seller, item was exactly as described!",
      date: "2024-04-15",
    },
    {
      id: "review2",
      reviewerName: "Mike Johnson",
      rating: 4,
      comment: "Good communication, prompt delivery.",
      date: "2024-04-10",
    },
  ],
  joinedDate: "2023-01-10",
  isVerified: true,
};

// Profile Page Component
export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserProfile>(mockUser);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

  // Handle live location
  const handleLiveLocation = () => {
    if (navigator.geolocation) {
      setIsSaving(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
          setSuccess(true);
          setIsSaving(false);
          setTimeout(() => setSuccess(false), 3000);
        },
        (err) => {
          setError("Failed to fetch location. Please try again.");
          setIsSaving(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

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

  // Handle social link changes
  const handleSocialLinkChange = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    setFormData((prev) => {
      const newSocialLinks = [...prev.socialLinks];
      newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
      return { ...prev, socialLinks: newSocialLinks };
    });
  };

  // Add social link
  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  // Remove social link
  const removeSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  // Handle image upload
  const handleImageUpload = (
    type: "profilePic" | "coverImage",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "profilePic") {
        setProfilePicFile(file);
      } else {
        setCoverImageFile(file);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSaving(true);

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.username) {
      setError("Full name, email, and username are required.");
      setIsSaving(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update user data
      setUser({
        ...formData,
        profilePic: profilePicFile
          ? URL.createObjectURL(profilePicFile)
          : formData.profilePic,
        coverImage: coverImageFile
          ? URL.createObjectURL(coverImageFile)
          : formData.coverImage,
      });
      setProfilePicFile(null);
      setCoverImageFile(null);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        "An error occurred while saving your profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (isEditing) {
      setFormData(user);
      setProfilePicFile(null);
      setCoverImageFile(null);
    }
    setIsEditing(!isEditing);
  };

  return (
    <>
      <Head>
        <title>Profile | Campus Market</title>
        <meta
          name="description"
          content="Manage your profile on Campus Market"
        />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-80 w-full overflow-hidden"
        >
          <Image
            src={
              coverImageFile
                ? URL.createObjectURL(coverImageFile)
                : user.coverImage
            }
            alt="Cover"
            fill
            className="object-cover"
          />
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-background/90 hover:bg-background dark:bg-slate-800 dark:hover:bg-slate-700"
              onClick={() => coverImageRef.current?.click()}
            >
              <Camera className="h-4 w-4 mr-2" />
              Change Cover
            </Button>
          )}
          <input
            ref={coverImageRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload("coverImage", e)}
            className="hidden"
          />
        </motion.div>

        <div className="container mx-auto px-4 -mt-20">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex items-end">
              <div className="relative">
                <Avatar className="h-40 w-40 border-4 border-background">
                  <AvatarImage
                    src={
                      profilePicFile
                        ? URL.createObjectURL(profilePicFile)
                        : user.profilePic
                    }
                  />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-2 right-2 bg-background/90 hover:bg-background dark:bg-slate-800 dark:hover:bg-slate-700"
                    onClick={() => profilePicRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
                <input
                  ref={profilePicRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("profilePic", e)}
                  className="hidden"
                />
              </div>
              <div className="ml-4 mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{user.fullName}</h1>
                  {user.isVerified && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 bg-primary text-primary-foreground"
                    >
                      <Check className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-lg">
                  @{user.username}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={toggleEdit}
              className="mt-4 sm:mt-0 bg-background/90 hover:bg-background dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </motion.div>

          {/* Profile Content */}
          <div className="max-w-4xl mx-auto mt-6">
            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-background border-b dark:border-slate-800 dark:bg-slate-900">
                <TabsTrigger value="overview" className="text-base">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="details" className="text-base">
                  Details
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-base">
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-8">
                  {/* Bio */}
                  <div>
                    {isEditing ? (
                      <div>
                        <Label htmlFor="bio" className="text-sm font-medium">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Tell us about yourself"
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                    ) : (
                      <p className="text-lg text-muted-foreground">
                        {user.bio || "No bio provided."}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-background p-6 rounded-lg dark:bg-slate-900 shadow-sm">
                    <div className="text-center">
                      <Users className="h-6 w-6 mx-auto text-primary" />
                      <p className="mt-2 text-xl font-semibold">
                        {user.totalFriends}
                      </p>
                      <p className="text-sm text-muted-foreground">Friends</p>
                    </div>
                    <div className="text-center">
                      <Tag className="h-6 w-6 mx-auto text-primary" />
                      <p className="mt-2 text-xl font-semibold">
                        {user.totalSales}
                      </p>
                      <p className="text-sm text-muted-foreground">Sales</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="h-6 w-6 mx-auto text-primary" />
                      <p className="mt-2 text-xl font-semibold">
                        ${user.totalEarned.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Earned</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="h-6 w-6 mx-auto text-primary" />
                      <p className="mt-2 text-xl font-semibold">
                        ${user.totalSpent.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Spent</p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Connect</h3>
                    {isEditing ? (
                      <div className="space-y-4">
                        {formData.socialLinks.map((link, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder="Platform (e.g., Twitter)"
                              value={link.platform}
                              onChange={(e) =>
                                handleSocialLinkChange(
                                  index,
                                  "platform",
                                  e.target.value
                                )
                              }
                              className="dark:bg-slate-800 border-none"
                            />
                            <Input
                              placeholder="URL"
                              value={link.url}
                              onChange={(e) =>
                                handleSocialLinkChange(
                                  index,
                                  "url",
                                  e.target.value
                                )
                              }
                              className="dark:bg-slate-800 border-none"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeSocialLink(index)}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addSocialLink}
                          className="dark:bg-slate-800 border-none"
                        >
                          <Link className="h-4 w-4 mr-2" />
                          Add Link
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        {user.socialLinks.length > 0 ? (
                          user.socialLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <Link className="h-4 w-4" />
                              {link.platform}
                            </a>
                          ))
                        ) : (
                          <p className="text-muted-foreground">
                            No social links provided.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Joined Date */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <p>
                      Joined{" "}
                      {new Date(user.joinedDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-8 bg-background p-6 rounded-lg dark:bg-slate-900 shadow-sm"
                >
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="username"
                          className="text-sm font-medium"
                        >
                          Username
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="phoneNumber"
                          className="text-sm font-medium"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                      <div>
                        <Label htmlFor="age" className="text-sm font-medium">
                          Age
                        </Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Identification */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Identification</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cnic" className="text-sm font-medium">
                          CNIC
                        </Label>
                        <Input
                          id="cnic"
                          name="cnic"
                          value={formData.cnic}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="passportNumber"
                          className="text-sm font-medium"
                        >
                          Passport Number
                        </Label>
                        <Input
                          id="passportNumber"
                          name="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="university"
                          className="text-sm font-medium"
                        >
                          University
                        </Label>
                        <Input
                          id="university"
                          name="university"
                          value={formData.location.university}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="address"
                          className="text-sm font-medium"
                        >
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.location.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.location.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 dark:bg-slate-800 border-none"
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleLiveLocation}
                          disabled={isSaving}
                          className="dark:bg-slate-800 border-none"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          {isSaving
                            ? "Fetching Location..."
                            : "Use Live Location"}
                        </Button>
                        {(formData.location.latitude !== 0 ||
                          formData.location.longitude !== 0) && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Latitude: {formData.location.latitude.toFixed(4)},
                            Longitude: {formData.location.longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-8 bg-background p-6 rounded-lg dark:bg-slate-900 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-semibold">
                      {user.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-lg">
                      ({user.reviews.length} reviews)
                    </span>
                  </div>
                  {user.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {user.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-4 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {review.reviewerName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">
                                {review.reviewerName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {review.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-lg">
                      No reviews yet.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed bottom-4 right-4 flex items-center gap-2 text-destructive bg-background/90 p-4 rounded-lg shadow-lg dark:bg-slate-800"
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
                  className="fixed bottom-4 right-4 flex items-center gap-2 text-green-500 bg-background/90 p-4 rounded-lg shadow-lg dark:bg-slate-800"
                >
                  <Check className="h-5 w-5" />
                  <p>Profile updated successfully!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
