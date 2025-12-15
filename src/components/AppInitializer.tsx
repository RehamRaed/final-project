"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { fetchCurrentRoadmap } from "@/store/roadmapSlice";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await dispatch(fetchCurrentRoadmap());
      setReady(true);
    };
    init();
  }, [dispatch]);

  if (!ready) return null;

  return <>{children}</>;
}
