"use client";

import { useRouter } from "next/navigation";
import deleteProductAction from "./delete.action";

type Props = {
  productId: number;
};

export default function ProductDeleteButton({ productId }: Props) {
  const router = useRouter();

  async function handleDelete() {
    // 클라이언트 측에서 deleteProductAction을 호출하여 상품 삭제를 시도합니다.
    const res = await deleteProductAction(productId);

    // 삭제가 성공하면 알림을 띄우고 상품 목록 페이지로 이동합니다.
    if (res) {
      alert("삭제되었습니다");
      router.replace("/products");
    } else {
      // 삭제가 실패하면 알림을 띄웁니다.
      alert("실패했습니다");
    }
  }

  return (
    // 상품 삭제 버튼을 렌더링합니다. 클릭 시 handleDelete 함수가 호출됩니다.
    <button
      className="rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white"
      onClick={handleDelete}
    >
      Delete product
    </button>
  );
}
