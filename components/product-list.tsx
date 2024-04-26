"use client";

import { InitialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/action";

interface ProductListProps {
  initialProducts: InitialProducts;
}
// 이렇게 하면 선언에 무엇을 추가하던 간에 prisma가 자동으로 추론해준다
// page에서 type을 선언하고 export 해주는 것과 같음
// interface ProductListProps {
//   initialProducts: {
//     id: number;
//     title: string;
//     price: number;
//     photo: string;
//     created_at: Date;
//   }[];
// }

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(1);
    setProducts((prev) => [...prev, ...newProducts]);
    setIsLoading(false);
  };
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      <button
        onClick={onLoadMoreClick}
        disabled={isLoading}
        className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
      >
        {isLoading ? "로딩 중" : "더 보기"}
      </button>
    </div>
  );
}
