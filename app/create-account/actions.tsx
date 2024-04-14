"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { escape } from "querystring";
import { z } from "zod";
// Zod를 사용해서 유효성을 간편하게 검사 if~~~등등
// 데이터의 형태나 타입을 설명할 때 Schema 만듬
// 데이타 오브젝트마다 하나하나 다 해줄 필요가 없음

const checkUsername = (username: string) => {
  return !/[!@#$%^&*(),.?":{}|<>]/.test(username);
};
//특수기호가 포함되어 있는지 체크하는 함수

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;
// 비밀번호가 같은지 체크하는 함수

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???",
      })

      .toLowerCase()
      .trim()
      .transform((username) => `🔥 ${username} 🔥`)
      .refine(
        //메서드의 첫 번째 인자는 사용자 정의 검사 함수이고, 두 번째 인자는 해당 검사가 실패할 때 반환할 오류 메시지입니다.
        checkUsername,
        "You can't use special character symbols in your username."
      ),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPassword, {
    message: "Both passwords should be the same!",
    path: ["confirm_password"],
  });
// 1가지 이상의 것을 검사하고 싶을 땐 오브젝트를 묶어주는 것에 refine을 하면 된다.

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
  } else {
    console.log(result.data);
  }

  //   console.log(data);
}
// parse는 데이터 유효성 검사가 실패하면 에러를 throw함
// 그래서 항상 try, catch(e)로 에러를 잡아줘야 함
// safeParse 에러를 throw하지 않지만 유효성 검사의 결과를 얻게 됨
//{ success: false, error: [Getter] }
// flatten() 에러를 간단하게 함축해서 볼 수 있음
