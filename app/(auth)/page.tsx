import Link from "next/link";
import "@/lib/db";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="text-9xl">🔥</span>
      </div>

      <div className="flex flex-col items-center gap-3 w-full">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg">
          Join
        </Link>
        <div className="flex gap-2">
          <span>Have an account?</span>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
