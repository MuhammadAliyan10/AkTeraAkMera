// types.ts
export enum UserRole {
  BUYER = "BUYER",
  SELLER = "SELLER",
}

export enum ProductCondition {
  NEW = "NEW",
  LIKE_NEW = "LIKE_NEW",
  USED = "USED",
  DAMAGED = "DAMAGED",
}

export enum SwapStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum NotificationType {
  MESSAGE = "MESSAGE",
  SWAP_REQUEST = "SWAP_REQUEST",
  SWAP_UPDATE = "SWAP_UPDATE",
}

export type Location = {
  lat: number;
  lng: number;
};

export type User = {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  profileImage?: string | null;
  role: UserRole;
  phoneNumber?: string | null;
  isVerified: boolean;
  termsAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  products?: Product[];
  sentMessages?: Message[];
  receivedMessages?: Message[];
  reviews?: Review[];
  notifications?: Notification[];
};

export type Product = {
  id: string;
  title: string;
  description?: string | null;
  ownerId: string;
  owner: User;
  condition: ProductCondition;
  categoryId: string;
  category: Category;
  desiredItems?: string | null;
  estimatedValue: number;
  location: Location;
  address: string;
  images: ProductImage[];
  tags: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  swapRequestsAsInitiator?: SwapRequest[];
  swapRequestsAsRecipient?: SwapRequest[];
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  order: number;
  createdAt: Date;
};

export type Category = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
};

export type Message = {
  id: string;
  senderId: string;
  sender: User;
  recipientId: string;
  recipient: User;
  content: string;
  createdAt: Date;
  isRead: boolean;
  productId?: string | null;
  product?: Product | null;
};

export type SwapRequest = {
  id: string;
  initiatorId: string;
  initiator: User;
  recipientId: string;
  recipient: User;
  initiatorProductId: string;
  initiatorProduct: Product;
  recipientProductId: string;
  recipientProduct: Product;
  status: SwapStatus;
  createdAt: Date;
  updatedAt: Date;
  message?: string | null;
};

export type Review = {
  id: string;
  reviewerId: string;
  reviewer: User;
  reviewedUserId: string;
  reviewedUser: User;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Notification = {
  id: string;
  userId: string;
  user: User;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedMessageId?: string | null;
  relatedSwapRequestId?: string | null;
};
