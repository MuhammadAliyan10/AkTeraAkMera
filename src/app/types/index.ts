export type User = {
  id: string;
  name: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    university?: string;
  };
  rating: number;
  joinedAt: Date;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number | null; // null for free items
  category: string;
  condition: "new" | "like new" | "good" | "fair" | "poor";
  duration?: {
    startDate: Date;
    endDate: Date;
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    university?: string;
  };
  owner: User;
  createdAt: Date;
  updatedAt: Date;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
  productId?: string;
};

export type Conversation = {
  id: string;
  participants: User[];
  lastMessage?: Message;
  updatedAt: Date;
  productId?: string;
};

export type LocationFilter = "nearby" | "area" | "city" | "university";
