import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
  // notFound response을 trigger함
  // logged out user가 profile page에 접근 할려고 하는데 session ID 없거나 user가 없다면 실행
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <h1>Welcome! {user?.username}!</h1>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}

// form 안에 다른 button이 없다면 use server로 서버액션을 활용할 수 있다.
// 그렇지 않다거나 여러 개 라면 onClick을 이용하여 use client를 사용해야 한다.
// <button type = "submit" value = "Log Out"/> 도 상관은 없다.
