import { error } from "console";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import getSession from "./lib/session";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  console.log(session);
  if (request.nextUrl.pathname === "/profile") {
    return Response.redirect(new URL("/", request.url));
  }
}

// url은 request의 url을 알려주는 string일 뿐임
// nextUrl은 유용하게 쓸 수도 있는 property로 가득 찬 object
// new URL('경로', ) js의 constructor이다
