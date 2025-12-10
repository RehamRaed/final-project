"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function RoadmapDetails() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/roadmaps/${id}`);
      const json = await res.json();
      setRoadmap(json.data);
    }
    load();
  }, [id]);

  if (!roadmap) return <p className="p-6 text-text-secondary text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/roadmaps" className="text-primary hover:underline font-medium">
        ← Back
      </Link>

      <div className="relative mt-6 p-8 bg-card-bg border border-border rounded-2xl shadow-lg">
        <div
          className="absolute left-0 top-0 h-full w-2 rounded-l-2xl"
          style={{ backgroundColor: roadmap.color ?? "var(--primary)" }}
        />

        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl">{roadmap.icon}</div>
          <h1 className="text-4xl font-bold text-primary">{roadmap.title}</h1>
        </div>

        <p className="text-text-secondary mt-2">{roadmap.description}</p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-primary">Courses</h3>
        <ul className="space-y-3">
          {roadmap.courses?.map((c: any, i: number) => (
            <li
              key={i}
              className="p-4 border border-border rounded-xl bg-bg text-text-primary hover:bg-primary/5 transition-colors duration-300"
            >
              {c.course.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
