"use server";

import { z } from "zod";
import validator from "validator";

const phoneSchema = z.string().trim().refine(validator.isMobilePhone);

const tokenSchema = z.coerce.number().min(100000).max(999999);
// coerce는 타입을 강제시킬 수 있다.

export async function smsLogin(prevState: any, formData: FormData) {
  const data = {
    phone: formData.get("phone"),
    token: formData.get("token"),
  };
  console.log(typeof formData.get("token"));
  console.log(typeof tokenSchema.parse(formData.get("token")));
}
// const data = {
//     ...Object.fromEntries(formData.entries()),
//     }
// 두 코드의 차이점 노션 정리 참고
