'use client';
import { signOut, useSession } from "next-auth/react";

export default function RoadmapSelectPage() {
  const { data: session } = useSession();

  const roadmaps = [
    { id: 1, title: "Web Development" },
    { id: 2, title: "AI" },
    { id: 3, title: "Data Analysis" },
    { id: 4, title: "UX / UI Design" },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg text-left">
      <h1 className="text-2xl font-bold mb-4">Select Your Roadmap</h1>
      <p className="mb-6">Welcome, {session?.user?.name || 'User'}!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        {roadmaps.map((r) => (
          <div key={r.id} className="border p-4 rounded hover:shadow-md">
            {r.title}
          </div>
        ))}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}