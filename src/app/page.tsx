import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 p-6">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-4">Welcome to StudyMate</h1>
      <p className="text-xl text-gray-600 mb-10 max-w-lg">
        Explore roadmaps and build your plan. Sign in to continue.
      </p>

      <div className="flex gap-4">
        {session ? (
          <Link
            href="/roadmap/select"
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition font-medium"
          >
            Continue to Roadmap
          </Link>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition font-medium"
          >
            Sign in / Create account
          </Link>
        )}
      </div>

      {session && <p className="mt-4 text-sm text-gray-500">Hello</p>}
    </div>
  );
}
