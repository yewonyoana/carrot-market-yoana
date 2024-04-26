"use client";

import { InitialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
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

  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);
  // js에서 document.getElementById()와 비슷하다고 생각하면 됨
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
        rootMargin: "0px 0px -300px 0px",
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}

      {!isLastPage ? (
        <span
          ref={trigger}
          style={{
            marginTop: `${page + 1 * 300}vh`,
          }}
          className="mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "더 보기"}
        </span>
      ) : null}
    </div>
  );
}
