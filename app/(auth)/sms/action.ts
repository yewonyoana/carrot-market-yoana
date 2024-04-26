"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import { error } from "console";
import getSession from "@/lib/session";
import twilio from "twilio";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}
// user가 작성한 token이 존재하는지 확인

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.");
// coerce는 타입을 강제시킬 수 있다.

interface ActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    // 해당 토큰이 있는 db에서 서치
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
    // 토큰이 이미 존재 한다면 위 함수가 다시 실행
  } else {
    return token;
    // 없다면 토큰 발사
  }
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      // delete previous token => user have only onetoken
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      // create token
      const token = await getToken();
      await db.sMSToken.create({
        // 사용자가 유효한 전화번호를 보내주면 해당 번호를 가진 User와 연결된 모든 token을 삭제하고 새로 생성
        // 해당 전화번호를 가지고있는 user가 존재한다면 연결함, 존재하지 않는다면 랜덤유저네임을 주고 새롭게 생성
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      // send the token using twilio
      const client = twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `Your Karrot verification code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.TWILIO_MY_PHONE_NUMBER!,
        // to: result.data 원래는 이거여야 함
      });
      return {
        token: true,
      };
    }
  } else {
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      // get the userId of token
      const token = await db.sMSToken.findUnique({
        //올바른 토큰을 받았을 떄
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      const session = await getSession();
      session.id = token!.userId;
      await session.save();
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });

      // log the user in
      redirect("/profile");
    }
  }
}
// const data = {
//     ...Object.fromEntries(formData.entries()),
//     }
// 두 코드의 차이점 노션 정리 참고
