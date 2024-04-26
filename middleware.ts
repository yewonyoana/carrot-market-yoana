import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// import { NextRequest, NextResponse } from "next/server";
// import getSession from "./lib/session";

// interface Routes {
//   [key: string]: boolean;
// }

// const publicOnlyUrls: Routes = {
//   "/": true,
//   "/login": true,
//   "/sms": true,
//   "/create-account": true,
//   "/github/start": true,
//   "/github/complete": true,
// };
// // 퍼블릭으로만 갈 수 있는 세션을 만들어주기 위해 객체 만듬 => 인증되지 않은 user가 갈 수 있는 url목록

// export async function middleware(request: NextRequest) {
//   const session = await getSession();
//   const exists = publicOnlyUrls[request.nextUrl.pathname];
//   // publicOnlyUrls에 특정 url이 포함되어 있는지 검색하는 것
//   if (!session.id) {
//     if (!exists) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   } else {
//     if (exists) {
//       return NextResponse.redirect(new URL("/products", request.url));
//     }
//   }
// }
// // const pathname = request.nextUrl.pathname;
// // if (pathname === "/") {
// //   const response = NextResponse.next();
// //   response.cookies.set("middleware-cookie", "hello!");
// //   return response;
// // }
// // if (pathname === "/profile") {
// //   return NextResponse.redirect(new URL("/", request.url));
// // }
// // 이런식으로 config를 사용하지 않고 하나하나 매치를 해줄 수는 있으나 아래의 매치가 좀 더 간편함

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
//   // 해당 미들웨어가 실행되기 싫은 url을 입력해주는 것
//   // api넥스트스태틱,넥스트이미지,파비콘이미지를 제외한 나머지
// };

// // url은 request의 url을 알려주는 string일 뿐임
// // nextUrl은 유용하게 쓸 수도 있는 property로 가득 찬 object
// // new URL('경로', ) js의 constructor이다
// // pathname은 유저가 가 있는 혹은 갈려고 하는 /xx의 경로일 뿐이다.
// // middleware는 nodejs의 runtime에서 실행되지 않고 edge runtime에서 실행된다.
