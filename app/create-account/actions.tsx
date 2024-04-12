"use server";

import { z } from "zod";
// Zod를 사용해서 유효성을 간편하게 검사 if~~~등등
// 데이터의 형태나 타입을 설명할 때 Schema 만듬
// 데이타 오브젝트마다 하나하나 다 해줄 필요가 없음

const formSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.string().email(),
  password: z.string().min(5),
  confirm_password: z.string().min(5),
});

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  //   console.log(data);
}

// parse는 데이터 유효성 검사가 실패하면 에러를 throw함
// 그래서 항상 try, catch(e)로 에러를 잡아줘야 함
// safeParse 에러를 throw하지 않지만 유효성 검사의 결과를 얻게 됨
//{ success: false, error: [Getter] }
// flatten() 에러를 간단하게 함축해서 볼 수 있음
