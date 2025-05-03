import { Conversation, Message, Product, User } from "../types";

// Generate mock users with realistic names
export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Emma Rodriguez",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=faces&fit=crop&w=200&h=200",
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
    name: "Liam Chen",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=faces&fit=crop&w=200&h=200",
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
    name: "Olivia Patel",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=faces&fit=crop&w=200&h=200",
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
    name: "Noah Kim",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=faces&fit=crop&w=200&h=200",
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
    name: "Sophia Martinez",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=faces&fit=crop&w=200&h=200",
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
  {
    id: "user6",
    name: "James Nguyen",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.7301,
      longitude: -73.9876,
      address: "321 E 10th St",
      city: "New York",
      university: "NYU",
    },
    rating: 4.7,
    joinedAt: new Date("2023-02-10"),
  },
  {
    id: "user7",
    name: "Ava Thompson",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.7254,
      longitude: -74.0001,
      address: "654 W 14th St",
      city: "New York",
    },
    rating: 4.6,
    joinedAt: new Date("2022-12-01"),
  },
  {
    id: "user8",
    name: "Ethan Brown",
    image:
      "https://images.unsplash.com/photo-1506794778202-6d8d690e6e1a?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.7402,
      longitude: -73.9932,
      address: "987 3rd Ave",
      city: "New York",
      university: "Columbia",
    },
    rating: 4.4,
    joinedAt: new Date("2023-04-05"),
  },
  {
    id: "user9",
    name: "Isabella Lee",
    image:
      "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.7156,
      longitude: -74.0089,
      address: "111 Wall St",
      city: "New York",
    },
    rating: 4.8,
    joinedAt: new Date("2022-09-20"),
  },
  {
    id: "user10",
    name: "Mason Gupta",
    image:
      "https://images.unsplash.com/photo-1503443207922-3a7d9e7a7e7b?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.7378,
      longitude: -74.0054,
      address: "222 Greenwich St",
      city: "New York",
    },
    rating: 4.3,
    joinedAt: new Date("2023-06-15"),
  },
  {
    id: "user11",
    name: "Mia Rivera",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.75,
      longitude: -73.9967,
      address: "1201 6th Ave",
      city: "New York",
    },
    rating: 4.6,
    joinedAt: new Date("2022-10-01"),
  },
  {
    id: "user12",
    name: "Benjamin Clark",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.7433,
      longitude: -74.0072,
      address: "300 Spring St",
      city: "New York",
      university: "Columbia",
    },
    rating: 4.7,
    joinedAt: new Date("2023-01-25"),
  },
  {
    id: "user13",
    name: "Charlotte Wilson",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.758,
      longitude: -73.9855,
      address: "400 Times Sq",
      city: "New York",
    },
    rating: 4.9,
    joinedAt: new Date("2022-07-18"),
  },
  {
    id: "user14",
    name: "Henry Zhao",
    image:
      "https://images.unsplash.com/photo-1603415526960-f7e0328f9440?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.7359,
      longitude: -74.0032,
      address: "987 University Pl",
      city: "New York",
      university: "NYU",
    },
    rating: 4.4,
    joinedAt: new Date("2023-03-03"),
  },
  {
    id: "user15",
    name: "Amelia Scott",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.742,
      longitude: -73.991,
      address: "601 Broadway",
      city: "New York",
    },
    rating: 4.5,
    joinedAt: new Date("2022-06-10"),
  },
  {
    id: "user16",
    name: "Jack Singh",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.726,
      longitude: -73.995,
      address: "50 Wooster St",
      city: "New York",
      university: "Columbia",
    },
    rating: 4.6,
    joinedAt: new Date("2023-02-14"),
  },
  {
    id: "user17",
    name: "Ella Garcia",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.7395,
      longitude: -74.0022,
      address: "303 Lafayette St",
      city: "New York",
    },
    rating: 4.9,
    joinedAt: new Date("2023-01-01"),
  },
  {
    id: "user18",
    name: "Daniel Murphy",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.7109,
      longitude: -74.0061,
      address: "800 Broadway",
      city: "New York",
    },
    rating: 4.2,
    joinedAt: new Date("2022-11-10"),
  },
  {
    id: "user19",
    name: "Harper Adams",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.7295,
      longitude: -73.9965,
      address: "89 Greene St",
      city: "New York",
    },
    rating: 4.3,
    joinedAt: new Date("2022-09-01"),
  },
  {
    id: "user20",
    name: "Logan Davis",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?crop=faces&fit=crop&w=200&h=200",
    location: {
      latitude: 40.741,
      longitude: -74.0048,
      address: "777 Hudson St",
      city: "New York",
    },
    rating: 4.5,
    joinedAt: new Date("2023-03-30"),
  },
];

// Generate mock products with realistic images
export const mockProducts: Product[] = [
  {
    id: "product1",
    title: "iPhone Charger Cable",
    description: "Brand new lightning cable for iPhone.",
    images: [
      "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 5,
    category: "Electronics",
    condition: "new",
    location: mockUsers[0].location,
    owner: mockUsers[0],
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-04-10"),
  },
  {
    id: "product2",
    title: "Winter Jacket",
    description: "Warm winter jacket, size M, black.",
    images: [
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 30,
    category: "Clothing",
    condition: "like new",
    location: mockUsers[1].location,
    owner: mockUsers[1],
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-04-06"),
  },
  {
    id: "product3",
    title: "Desk Lamp",
    description: "Adjustable desk lamp for studying.",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 15,
    category: "Home",
    condition: "good",
    location: mockUsers[2].location,
    owner: mockUsers[2],
    createdAt: new Date("2024-04-08"),
    updatedAt: new Date("2024-04-08"),
  },
  {
    id: "product4",
    title: "Calculus Textbook",
    description: "Calculus textbook for first-year students.",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 25,
    category: "Books",
    condition: "fair",
    location: mockUsers[3].location,
    owner: mockUsers[3],
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-02"),
  },
  {
    id: "product5",
    title: "Tennis Racket",
    description: "Wilson tennis racket, used one season.",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 20,
    category: "Sports",
    condition: "good",
    duration: {
      startDate: new Date("2024-05-15"),
      endDate: new Date("2024-06-15"),
    },
    location: mockUsers[4].location,
    owner: mockUsers[4],
    createdAt: new Date("2024-04-07"),
    updatedAt: new Date("2024-04-07"),
  },
  {
    id: "product6",
    title: "Bluetooth Speaker",
    description: "JBL Bluetooth speaker, great sound.",
    images: [
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 35,
    category: "Electronics",
    condition: "like new",
    location: mockUsers[5].location,
    owner: mockUsers[5],
    createdAt: new Date("2024-04-03"),
    updatedAt: new Date("2024-04-03"),
  },
  {
    id: "product7",
    title: "Mountain Bike",
    description: "Mountain bike, barely used.",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 120,
    category: "Sports",
    condition: "good",
    location: mockUsers[6].location,
    owner: mockUsers[6],
    createdAt: new Date("2024-03-25"),
    updatedAt: new Date("2024-03-28"),
  },
  {
    id: "product8",
    title: "Coffee Maker",
    description: "Programmable coffee maker.",
    images: [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 40,
    category: "Home",
    condition: "good",
    location: mockUsers[7].location,
    owner: mockUsers[7],
    createdAt: new Date("2024-04-12"),
    updatedAt: new Date("2024-04-12"),
  },
  {
    id: "product9",
    title: "Gaming Headset",
    description: "Wireless gaming headset, high quality.",
    images: [
      "https://images.unsplash.com/photo-1585076641399-5c06d1b3365f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 50,
    category: "Electronics",
    condition: "new",
    location: mockUsers[8].location,
    owner: mockUsers[8],
    createdAt: new Date("2024-04-09"),
    updatedAt: new Date("2024-04-09"),
  },
  {
    id: "product10",
    title: "Leather Jacket",
    description: "Black leather jacket, size L.",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 60,
    category: "Clothing",
    condition: "like new",
    location: mockUsers[9].location,
    owner: mockUsers[9],
    createdAt: new Date("2024-04-04"),
    updatedAt: new Date("2024-04-04"),
  },
  {
    id: "product11",
    title: "Yoga Mat",
    description: "Non-slip yoga mat, used lightly.",
    images: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 10,
    category: "Sports",
    condition: "good",
    location: mockUsers[10].location,
    owner: mockUsers[10],
    createdAt: new Date("2024-04-06"),
    updatedAt: new Date("2024-04-06"),
  },
  {
    id: "product12",
    title: "Physics Textbook",
    description: "University physics textbook.",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 30,
    category: "Books",
    condition: "fair",
    location: mockUsers[11].location,
    owner: mockUsers[11],
    createdAt: new Date("2024-04-02"),
    updatedAt: new Date("2024-04-02"),
  },
  {
    id: "product13",
    title: "Portable Charger",
    description: "10,000mAh portable charger.",
    images: [
      "https://images.unsplash.com/photo-1598124146163-36819847286d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 15,
    category: "Electronics",
    condition: "new",
    location: mockUsers[12].location,
    owner: mockUsers[12],
    createdAt: new Date("2024-04-11"),
    updatedAt: new Date("2024-04-11"),
  },
  {
    id: "product14",
    title: "Running Shoes",
    description: "Nike running shoes, size 9.",
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 25,
    category: "Clothing",
    condition: "good",
    location: mockUsers[13].location,
    owner: mockUsers[13],
    createdAt: new Date("2024-04-07"),
    updatedAt: new Date("2024-04-07"),
  },
  {
    id: "product15",
    title: "Microwave Oven",
    description: "Compact microwave, good condition.",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 35,
    category: "Home",
    condition: "good",
    location: mockUsers[14].location,
    owner: mockUsers[14],
    createdAt: new Date("2024-04-03"),
    updatedAt: new Date("2024-04-03"),
  },
  {
    id: "product16",
    title: "Soccer Ball",
    description: "Adidas soccer ball, slightly used.",
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 12,
    category: "Sports",
    condition: "good",
    location: mockUsers[15].location,
    owner: mockUsers[15],
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-04-05"),
  },
  {
    id: "product17",
    title: "Laptop Stand",
    description: "Adjustable laptop stand.",
    images: [
      "https://images.unsplash.com/photo-1599398385082-26c111f477aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 20,
    category: "Electronics",
    condition: "like new",
    location: mockUsers[16].location,
    owner: mockUsers[16],
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-04-10"),
  },
  {
    id: "product18",
    title: "Graphic Novel",
    description: "Popular graphic novel, good condition.",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 8,
    category: "Books",
    condition: "good",
    location: mockUsers[17].location,
    owner: mockUsers[17],
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
  },
  {
    id: "product19",
    title: "Desk Chair",
    description: "Ergonomic desk chair.",
    images: [
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 50,
    category: "Home",
    condition: "good",
    location: mockUsers[18].location,
    owner: mockUsers[18],
    createdAt: new Date("2024-04-08"),
    updatedAt: new Date("2024-04-08"),
  },
  {
    id: "product20",
    title: "Skateboard",
    description: "Used skateboard, good condition.",
    images: [
      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    ],
    price: 30,
    category: "Sports",
    condition: "good",
    location: mockUsers[19].location,
    owner: mockUsers[19],
    createdAt: new Date("2024-04-04"),
    updatedAt: new Date("2024-04-04"),
  },
];
// Generate mock messages
export const mockMessages: Message[] = [
  {
    id: "msg1",
    senderId: "user1",
    receiverId: "user2",
    content: "Is the winter jacket still available?",
    createdAt: new Date("2024-04-11T10:30:00"),
    read: true,
    productId: "product2",
  },
  {
    id: "msg2",
    senderId: "user2",
    receiverId: "user1",
    content: "Yes, it's available! Want to meet?",
    createdAt: new Date("2024-04-11T10:45:00"),
    read: true,
    productId: "product2",
  },
  {
    id: "msg3",
    senderId: "user3",
    receiverId: "user1",
    content: "Is the iPhone charger still for sale?",
    createdAt: new Date("2024-04-12T09:00:00"),
    read: true,
    productId: "product1",
  },
  {
    id: "msg4",
    senderId: "user1",
    receiverId: "user3",
    content: "Yes, it's available!",
    createdAt: new Date("2024-04-12T09:05:00"),
    read: false,
    productId: "product1",
  },
  {
    id: "msg5",
    senderId: "user4",
    receiverId: "user2",
    content: "How's the condition of the mountain bike?",
    createdAt: new Date("2024-04-10T14:00:00"),
    read: true,
    productId: "product7",
  },
  {
    id: "msg6",
    senderId: "user2",
    receiverId: "user4",
    content: "It's in great shape, barely used.",
    createdAt: new Date("2024-04-10T14:15:00"),
    read: true,
    productId: "product7",
  },
  {
    id: "msg7",
    senderId: "user5",
    receiverId: "user3",
    content: "Interested in the desk lamp?",
    createdAt: new Date("2024-04-09T11:00:00"),
    read: true,
    productId: "product3",
  },
  {
    id: "msg8",
    senderId: "user3",
    receiverId: "user5",
    content: "Yes, can we meet tomorrow?",
    createdAt: new Date("2024-04-09T11:30:00"),
    read: false,
    productId: "product3",
  },
  {
    id: "msg9",
    senderId: "user6",
    receiverId: "user4",
    content: "Is the calculus textbook still available?",
    createdAt: new Date("2024-04-08T15:00:00"),
    read: true,
    productId: "product4",
  },
  {
    id: "msg10",
    senderId: "user4",
    receiverId: "user6",
    content: "Yes, it's yours if you want it.",
    createdAt: new Date("2024-04-08T15:20:00"),
    read: true,
    productId: "product4",
  },
  {
    id: "msg11",
    senderId: "user7",
    receiverId: "user5",
    content: "Can I see the tennis racket?",
    createdAt: new Date("2024-04-07T12:00:00"),
    read: true,
    productId: "product5",
  },
  {
    id: "msg12",
    senderId: "user5",
    receiverId: "user7",
    content: "Sure, I'll send more pics.",
    createdAt: new Date("2024-04-07T12:30:00"),
    read: false,
    productId: "product5",
  },
  {
    id: "msg13",
    senderId: "user8",
    receiverId: "user6",
    content: "Is the Bluetooth speaker still for sale?",
    createdAt: new Date("2024-04-06T10:00:00"),
    read: true,
    productId: "product6",
  },
  {
    id: "msg14",
    senderId: "user6",
    receiverId: "user8",
    content: "Yes, it's in great condition.",
    createdAt: new Date("2024-04-06T10:15:00"),
    read: true,
    productId: "product6",
  },
  {
    id: "msg15",
    senderId: "user9",
    receiverId: "user7",
    content: "Interested in the coffee maker?",
    createdAt: new Date("2024-04-05T13:00:00"),
    read: true,
    productId: "product8",
  },
  {
    id: "msg16",
    senderId: "user7",
    receiverId: "user9",
    content: "Yes, it's still available.",
    createdAt: new Date("2024-04-05T13:30:00"),
    read: false,
    productId: "product8",
  },
  {
    id: "msg17",
    senderId: "user10",
    receiverId: "user8",
    content: "Is the gaming headset new?",
    createdAt: new Date("2024-04-04T16:00:00"),
    read: true,
    productId: "product9",
  },
  {
    id: "msg18",
    senderId: "user8",
    receiverId: "user10",
    content: "Brand new, sealed box.",
    createdAt: new Date("2024-04-04T16:20:00"),
    read: true,
    productId: "product9",
  },
  {
    id: "msg19",
    senderId: "user11",
    receiverId: "user9",
    content: "Can I check out the leather jacket?",
    createdAt: new Date("2024-04-03T09:00:00"),
    read: true,
    productId: "product10",
  },
  {
    id: "msg20",
    senderId: "user9",
    receiverId: "user11",
    content: "Sure, available to meet today?",
    createdAt: new Date("2024-04-03T09:30:00"),
    read: false,
    productId: "product10",
  },
];

// Generate mock conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: mockMessages[1],
    updatedAt: new Date("2024-04-11T10:45:00"),
    productId: "product2",
  },
  {
    id: "conv2",
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: mockMessages[3],
    updatedAt: new Date("2024-04-12T09:05:00"),
    productId: "product1",
  },
  {
    id: "conv3",
    participants: [mockUsers[1], mockUsers[3]],
    lastMessage: mockMessages[5],
    updatedAt: new Date("2024-04-10T14:15:00"),
    productId: "product7",
  },
  {
    id: "conv4",
    participants: [mockUsers[2], mockUsers[4]],
    lastMessage: mockMessages[7],
    updatedAt: new Date("2024-04-09T11:30:00"),
    productId: "product3",
  },
  {
    id: "conv5",
    participants: [mockUsers[3], mockUsers[5]],
    lastMessage: mockMessages[9],
    updatedAt: new Date("2024-04-08T15:20:00"),
    productId: "product4",
  },
  {
    id: "conv6",
    participants: [mockUsers[4], mockUsers[6]],
    lastMessage: mockMessages[11],
    updatedAt: new Date("2024-04-07T12:30:00"),
    productId: "product5",
  },
  {
    id: "conv7",
    participants: [mockUsers[5], mockUsers[7]],
    lastMessage: mockMessages[13],
    updatedAt: new Date("2024-04-06T10:15:00"),
    productId: "product6",
  },
  {
    id: "conv8",
    participants: [mockUsers[6], mockUsers[8]],
    lastMessage: mockMessages[15],
    updatedAt: new Date("2024-04-05T13:30:00"),
    productId: "product8",
  },
  {
    id: "conv9",
    participants: [mockUsers[7], mockUsers[9]],
    lastMessage: mockMessages[17],
    updatedAt: new Date("2024-04-04T16:20:00"),
    productId: "product9",
  },
  {
    id: "conv10",
    participants: [mockUsers[8], mockUsers[10]],
    lastMessage: mockMessages[19],
    updatedAt: new Date("2024-04-03T09:30:00"),
    productId: "product10",
  },
  {
    id: "conv11",
    participants: [mockUsers[9], mockUsers[11]],
    lastMessage: mockMessages[19],
    updatedAt: new Date("2024-04-03T09:30:00"),
    productId: "product10",
  },
  {
    id: "conv12",
    participants: [mockUsers[10], mockUsers[12]],
    lastMessage: mockMessages[0],
    updatedAt: new Date("2024-04-11T10:30:00"),
    productId: "product11",
  },
  {
    id: "conv13",
    participants: [mockUsers[11], mockUsers[13]],
    lastMessage: mockMessages[2],
    updatedAt: new Date("2024-04-12T09:00:00"),
    productId: "product12",
  },
  {
    id: "conv14",
    participants: [mockUsers[12], mockUsers[14]],
    lastMessage: mockMessages[4],
    updatedAt: new Date("2024-04-10T14:00:00"),
    productId: "product13",
  },
  {
    id: "conv15",
    participants: [mockUsers[13], mockUsers[15]],
    lastMessage: mockMessages[6],
    updatedAt: new Date("2024-04-09T11:00:00"),
    productId: "product14",
  },
  {
    id: "conv16",
    participants: [mockUsers[14], mockUsers[16]],
    lastMessage: mockMessages[8],
    updatedAt: new Date("2024-04-08T15:00:00"),
    productId: "product15",
  },
  {
    id: "conv17",
    participants: [mockUsers[15], mockUsers[17]],
    lastMessage: mockMessages[10],
    updatedAt: new Date("2024-04-07T12:00:00"),
    productId: "product16",
  },
  {
    id: "conv18",
    participants: [mockUsers[16], mockUsers[18]],
    lastMessage: mockMessages[12],
    updatedAt: new Date("2024-04-06T10:00:00"),
    productId: "product17",
  },
  {
    id: "conv19",
    participants: [mockUsers[17], mockUsers[19]],
    lastMessage: mockMessages[14],
    updatedAt: new Date("2024-04-05T13:00:00"),
    productId: "product18",
  },
  {
    id: "conv20",
    participants: [mockUsers[18], mockUsers[0]],
    lastMessage: mockMessages[16],
    updatedAt: new Date("2024-04-04T16:00:00"),
    productId: "product19",
  },
];

// Mock service functions
export const getProducts = (page = 1, limit = 8, filter?: string) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  let filtered = [...mockProducts];

  if (filter === "nearby") {
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
    filtered = filtered.filter((p) => p.location.city === "New York");
  }

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
  const convIndex = parseInt(conversationId.replace("conv", "")) - 1;
  const msgStart = convIndex * 2;
  return mockMessages.slice(msgStart, msgStart + 2);
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
