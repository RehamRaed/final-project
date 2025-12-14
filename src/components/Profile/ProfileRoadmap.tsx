"use client";

import { useRouter } from "next/navigation";

export default function ProfileRoadmap({ currentRoadmap }: any) {
  const router = useRouter();

  return (
    <div
      className="p-6 rounded-xl shadow-md border mt-6"
      style={{ backgroundColor: "var(--color-card-bg)", borderColor: "var(--color-border)" }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>
        Roadmap Details
      </h3>

      <div
        className="flex flex-col md:flex-row justify-between items-center p-4 rounded-lg"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <p
          style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}
          className="mb-2 md:mb-0"
        >
          Current Roadmap: {currentRoadmap ? currentRoadmap.title : "Not selected"}
        </p>

        <button
          onClick={() => router.push("/roadmaps")}
          className="px-4 py-2 font-semibold rounded-lg transition text-sm"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          Change Roadmap
        </button>
      </div>
    </div>
  );
}
