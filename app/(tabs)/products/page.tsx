import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;
// prisma에게 이 함수가 return할 type이 무엇인지 알려주는 것

export default async function Products() {
  const initialProducts = await getInitialProducts();

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
    </div>
  );
}
