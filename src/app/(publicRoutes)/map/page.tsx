import { mockProducts } from "@/app/data/mock-data";
import MapExchange from "@/components/map-items";
import React from "react";

const page = () => {
  return (
    <div className="mt-20 mx-3">
      <MapExchange products={mockProducts} users={[]} />;
    </div>
  );
};

export default page;
