"use client";

import { useEffect, useState } from "react";

import { Provider, useDispatch } from "react-redux";
import { store, AppDispatch } from "@/store";
import { fetchCurrentRoadmap } from "@/store/roadmapSlice";

import { AuthProvider } from "@/components/SessionProvider";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import ThemeToggle from "@/components/theme/ThemeToggle";

import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentRoadmap()).then(() => setReady(true));
  }, [dispatch]);

  if (!ready) return null;
  return <>{children}</>;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <ThemeProvider>
      <Provider store={store}>
        <AuthProvider>
          <AppInitializer>
            {children}
          </AppInitializer>
        </AuthProvider>
      </Provider>

      <div className="fixed bottom-5 right-5 z-999">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}
