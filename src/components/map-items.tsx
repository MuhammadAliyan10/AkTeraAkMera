import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useTheme } from "next-themes";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  university: string;
}

interface Owner {
  name: string;
  image: string;
  location: Location;
  rating: number;
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
  owner: Owner;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
  image: string;
  location: Location;
  rating: number;
  joinedAt: Date;
}

const customIcon = new L.Icon({
  iconUrl: "/icons/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapExchange = ({
  products,
  users,
}: {
  products: Product[];
  users: User[];
}) => {
  const { resolvedTheme } = useTheme();
  const center: [number, number] = [40.73061, -73.935242];

  return (
    <div className="w-full h-[40vh]">
      <MapContainer
        center={center}
        zoom={14} // Zoomed in for closer detail
        scrollWheelZoom
        className="h-full w-full rounded-2xl shadow-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
        />

        {users.map((user) => (
          <Marker
            key={user.id}
            position={[user.location.latitude, user.location.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-primary">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.location.university}, {user.location.city}
                    </p>
                  </div>
                </div>
                <p className="flex items-center gap-1 text-yellow-500">
                  <User className="w-4 h-4" /> {user.rating} stars
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {products.map((product) => (
          <Marker
            key={product.id}
            position={[product.location.latitude, product.location.longitude]}
            icon={customIcon}
          >
            <Popup>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="w-64 border bg-background text-foreground">
                  <CardContent className="p-3 space-y-2">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-28 object-cover rounded-md"
                    />
                    <p className="font-semibold truncate text-primary">
                      {product.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">${product.price}</Badge>
                      <Badge variant="default">{product.condition}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={product.owner.image}
                          alt={product.owner.name}
                        />
                        <AvatarFallback>{product.owner.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-muted-foreground">
                        {product.owner.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapExchange;
