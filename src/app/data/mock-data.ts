import { Conversation, Message, Product, User } from "../types";

// Generate mock users
export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Jane Smith",
    image: "/api/placeholder/80/80",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Main St",
      city: "New York",
      university: "NYU",
    },
    rating: 4.8,
    joinedAt: new Date("2023-01-15"),
  },
  {
    id: "user2",
    name: "John Doe",
    image: "/api/placeholder/80/80",
    location: {
      latitude: 40.7282,
      longitude: -73.9942,
      address: "456 Broadway",
      city: "New York",
      university: "Columbia",
    },
    rating: 4.5,
    joinedAt: new Date("2023-03-20"),
  },
  {
    id: "user3",
    name: "Alex Johnson",
    image: "/api/placeholder/80/80",
    location: {
      latitude: 40.7195,
      longitude: -73.9988,
      address: "789 Park Ave",
      city: "New York",
    },
    rating: 4.9,
    joinedAt: new Date("2022-11-05"),
  },
  {
    id: "user4",
    name: "Sam Wilson",
    image: "/api/placeholder/80/80",
    location: {
      latitude: 40.735,
      longitude: -74.0123,
      address: "101 Hudson St",
      city: "Jersey City",
    },
    rating: 4.2,
    joinedAt: new Date("2023-05-10"),
  },
  {
    id: "user5",
    name: "Taylor Swift",
    image: "/api/placeholder/80/80",
    location: {
      latitude: 40.7483,
      longitude: -73.9857,
      address: "222 5th Ave",
      city: "New York",
      university: "NYU",
    },
    rating: 5.0,
    joinedAt: new Date("2022-08-13"),
  },
];

// Generate mock products
export const mockProducts: Product[] = [
  {
    id: "product1",
    title: "iPhone Charger Cable",
    description:
      "Brand new lightning cable for iPhone. Works perfectly for all models.",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    price: 5,
    category: "Electronics",
    condition: "new",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Main St",
      city: "New York",
      university: "NYU",
    },
    owner: mockUsers[0],
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-04-10"),
  },
  {
    id: "product2",
    title: "Winter Jacket",
    description: "Warm winter jacket, barely used. Size M, black color.",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    price: 30,
    category: "Clothing",
    condition: "like new",
    location: {
      latitude: 40.7282,
      longitude: -73.9942,
      address: "456 Broadway",
      city: "New York",
      university: "Columbia",
    },
    owner: mockUsers[1],
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-04-06"),
  },
  {
    id: "product3",
    title: "Desk Lamp",
    description: "Adjustable desk lamp, perfect for studying.",
    images: ["/api/placeholder/400/300"],
    price: 15,
    category: "Home",
    condition: "good",
    location: {
      latitude: 40.7195,
      longitude: -73.9988,
      address: "789 Park Ave",
      city: "New York",
    },
    owner: mockUsers[2],
    createdAt: new Date("2024-04-08"),
    updatedAt: new Date("2024-04-08"),
  },
  {
    id: "product4",
    title: "Calculus Textbook",
    description: "Calculus textbook for first-year university students.",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    price: 25,
    category: "Books",
    condition: "fair",
    location: {
      latitude: 40.735,
      longitude: -74.0123,
      address: "101 Hudson St",
      city: "Jersey City",
    },
    owner: mockUsers[3],
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-02"),
  },
  {
    id: "product5",
    title: "Tennis Racket",
    description: "Wilson tennis racket, used for one season.",
    images: ["/api/placeholder/400/300"],
    price: 20,
    category: "Sports",
    condition: "good",
    duration: {
      startDate: new Date("2024-05-15"),
      endDate: new Date("2024-06-15"),
    },
    location: {
      latitude: 40.7483,
      longitude: -73.9857,
      address: "222 5th Ave",
      city: "New York",
      university: "NYU",
    },
    owner: mockUsers[4],
    createdAt: new Date("2024-04-07"),
    updatedAt: new Date("2024-04-07"),
  },
  {
    id: "product6",
    title: "Bluetooth Speaker",
    description: "JBL Bluetooth speaker with great sound quality.",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    price: 35,
    category: "Electronics",
    condition: "like new",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Main St",
      city: "New York",
      university: "NYU",
    },
    owner: mockUsers[0],
    createdAt: new Date("2024-04-03"),
    updatedAt: new Date("2024-04-03"),
  },
  {
    id: "product7",
    title: "Bicycle",
    description: "Mountain bike in great condition, barely used.",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    price: 120,
    category: "Sports",
    condition: "good",
    location: {
      latitude: 40.7282,
      longitude: -73.9942,
      address: "456 Broadway",
      city: "New York",
      university: "Columbia",
    },
    owner: mockUsers[1],
    createdAt: new Date("2024-03-25"),
    updatedAt: new Date("2024-03-28"),
  },
  {
    id: "product8",
    title: "Coffee Maker",
    description: "Programmable coffee maker, makes great coffee.",
    images: ["/api/placeholder/400/300"],
    price: 40,
    category: "Home",
    condition: "good",
    location: {
      latitude: 40.7195,
      longitude: -73.9988,
      address: "789 Park Ave",
      city: "New York",
    },
    owner: mockUsers[2],
    createdAt: new Date("2024-04-12"),
    updatedAt: new Date("2024-04-12"),
  },
];

// Generate mock messages
export const mockMessages: Message[] = [
  {
    id: "msg1",
    senderId: "user1",
    receiverId: "user2",
    content: "Hi, is the winter jacket still available?",
    createdAt: new Date("2024-04-11T10:30:00"),
    read: true,
    productId: "product2",
  },
  {
    id: "msg2",
    senderId: "user2",
    receiverId: "user1",
    content: "Yes, it's still available! When would you like to meet?",
    createdAt: new Date("2024-04-11T10:45:00"),
    read: true,
    productId: "product2",
  },
  {
    id: "msg3",
    senderId: "user1",
    receiverId: "user2",
    content: "Great! How about tomorrow afternoon around 3pm?",
    createdAt: new Date("2024-04-11T11:00:00"),
    read: true,
    productId: "product2",
  },
  {
    id: "msg4",
    senderId: "user2",
    receiverId: "user1",
    content: "That works for me. Let's meet at the campus coffee shop.",
    createdAt: new Date("2024-04-11T11:15:00"),
    read: false,
    productId: "product2",
  },
  {
    id: "msg5",
    senderId: "user3",
    receiverId: "user1",
    content: "Is the iPhone charger still available?",
    createdAt: new Date("2024-04-12T09:00:00"),
    read: true,
    productId: "product1",
  },
  {
    id: "msg6",
    senderId: "user1",
    receiverId: "user3",
    content: "Yes, it is! Are you interested?",
    createdAt: new Date("2024-04-12T09:05:00"),
    read: false,
    productId: "product1",
  },
];

// Generate mock conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: mockMessages[3],
    updatedAt: new Date("2024-04-11T11:15:00"),
    productId: "product2",
  },
  {
    id: "conv2",
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: mockMessages[5],
    updatedAt: new Date("2024-04-12T09:05:00"),
    productId: "product1",
  },
];

// Mock service functions
export const getProducts = (page = 1, limit = 8, filter?: string) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  let filtered = [...mockProducts];

  if (filter === "nearby") {
    // Simple implementation: assuming NYU is the center
    filtered = filtered.filter(
      (p) =>
        p.location.latitude > 40.7 &&
        p.location.latitude < 40.73 &&
        p.location.longitude > -74.01 &&
        p.location.longitude < -73.99
    );
  } else if (filter === "university") {
    filtered = filtered.filter((p) => p.location.university);
  } else if (filter === "city") {
    // Assuming New York is the current city
    filtered = filtered.filter((p) => p.location.city === "New York");
  }

  // Sort by newest first
  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    products: filtered.slice(start, end),
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
  };
};

export const getProductById = (id: string) => {
  return mockProducts.find((p) => p.id === id);
};

export const getUserById = (id: string) => {
  return mockUsers.find((u) => u.id === id);
};

export const getConversations = (userId: string) => {
  return mockConversations.filter((c) =>
    c.participants.some((p) => p.id === userId)
  );
};

export const getMessages = (conversationId: string) => {
  if (conversationId === "conv1") {
    return mockMessages.slice(0, 4);
  } else if (conversationId === "conv2") {
    return mockMessages.slice(4, 6);
  }
  return [];
};

export const searchProducts = (query: string) => {
  query = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
  );
};
