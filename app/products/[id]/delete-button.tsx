"use client";

import { useRouter } from "next/navigation";
import deleteProductAction from "./delete.action";

type Props = {
  productId: number;
};

export default function ProductDeleteButton({ productId }: Props) {
  const router = useRouter();

  async function handleDelete() {
    const res = await deleteProductAction(productId);

    if (res) {
      alert("Deleted");
      router.replace("/products");
    } else {
      alert("Try Again");
    }
  }

  return (
    <button
      className="rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
