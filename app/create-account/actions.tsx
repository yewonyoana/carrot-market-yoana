"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";

import { z } from "zod";
import bcrypt from "bcrypt";

import { redirect } from "next/navigation";
import getSession from "@/lib/session";
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

// const checkUniqueUsername = async (username: string) => {
//   const user = await db.user.findUnique({
//     where: {
//       username,
//     },
//     select: {
//       id: true,
//     },
//     // select는 데이터베이스에 요청할 데이터를 결정할 수 있다.
//   });
//   // if(user){
//   //   return false
//   // }else{
//   //   return true
//   // }
//   return Boolean(user) === false;
// };

// const checkUniqueEmail = async (email: string) => {
//   const user = await db.user.findUnique({
//     where: {
//       email,
//     },
//     select: {
//       id: true,
//     },
//   });
//   return !Boolean(user);
// };

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???",
      })
      .toLowerCase()
      .trim()
      // .transform((username) => `🔥 ${username} 🔥`)
      .refine(
        //메서드의 첫 번째 인자는 사용자 정의 검사 함수이고, 두 번째 인자는 해당 검사가 실패할 때 반환할 오류 메시지입니다.
        checkUsername,
        "You can't use special character symbols in your username."
      ),
    email: z.string().email().toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        // 첫 번째에 함수를 받고 두 번째 인자에 넣어 줄 것들을 설정
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
        // 에러를 보여줄 경로를 설정
        fatal: true,
        // 치명적인 오류가 있다고 설정
      });
      return z.NEVER;
      // 패스의 오류를 발견하고 나머지 검사를 중단하고 싶을 때 사용
      // 슈퍼리파인에 이슈가 있고 Never을 설정하면 뒤 리파인은 검사하지 않음
    }
  })
  // 슈퍼리파인은 좀더 강력하다 첫 번째 인자는 현재 리파인 하고 있는 data를 가져온다.
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
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

  const result = await formSchema.safeParseAsync(data);
  // 함수에 async가 있다면 zod에도 추가를 해줘야 한다.
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    // hash password
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    // save the user to db
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    // log the user in(iron-session을 활용하여 쿠키를 저장 및 보호, 활용)
    const session = await getSession();
    session.id = user.id;
    await session.save();

    // redirect "/home"
    redirect("/profile ");
  }
}
// parse는 데이터 유효성 검사가 실패하면 에러를 throw함
// 그래서 항상 try, catch(e)로 에러를 잡아줘야 함
// safeParse 에러를 throw하지 않지만 유효성 검사의 결과를 얻게 됨
//{ success: false, error: [Getter] }
// flatten() 에러를 간단하게 함축해서 볼 수 있음
