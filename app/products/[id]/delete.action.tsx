"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function deleteProductAction(productId: number) {
  // 현재 세션 정보를 가져옵니다.
  const session = await getSession();
  const userId = session.id;

  // 세션에 사용자 정보가 없으면 삭제를 거부합니다.
  if (!userId) {
    return false;
  }

  // 상품을 삭제하고 성공 여부를 반환합니다.
  const deleted = await db.product.delete({
    where: {
      id: productId,
      userId,
    },
  });
  // 삭제가 성공하면 true, 실패하면 false를 반환합니다.
  return !!deleted;
}
