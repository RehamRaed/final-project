"use client";

import { useRouter, usePathname } from "next/navigation";

interface ProfileRoadmapProps {
  currentRoadmapTitle: string;
}

export default function ProfileRoadmap({ currentRoadmapTitle }: ProfileRoadmapProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeRoadmap = () => {
    // إذا كنا بالصفحة الرئيسية للبروفايل، نضيف query param للعودة بعد اختيار Roadmap
    if (pathname === "/profile") {
      router.push("/roadmaps?from=profile");
    } else {
      router.push("/roadmaps");
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-md border bg-card-bg border-border mt-6">
      <h3 className="text-xl font-semibold mb-4 text-text-primary">Roadmap Details</h3>
      <div className="flex flex-col md:flex-row justify-between items-center p-4 rounded-lg bg-bg">
        <p className="mb-2 md:mb-0 text-text-secondary font-medium">
          Current Roadmap: {currentRoadmapTitle}
        </p>
        <button
          onClick={handleChangeRoadmap}
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          Change Roadmap
        </button>
      </div>
    </div>
  );
}
