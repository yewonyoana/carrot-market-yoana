import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}
// 세션에 id가 없을 수도 있기 때문에 옵셔널을 넣어줌
// 로그인을 한 유저만 id가 있음

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "seto-karrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}
