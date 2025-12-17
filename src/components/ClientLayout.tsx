"use client";

import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store, AppDispatch } from "@/store";
import { fetchCurrentRoadmap } from "@/store/roadmapSlice";

import { AuthProvider } from "@/context/SessionProvider";
import Header from "./Header/Header";

import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/theme/ThemeToggle";

import { NotificationsProvider } from "@/context/NotificationsContext";

import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation"; // << هنا

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentRoadmap()).finally(() => setReady(true));
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
  const pathname = usePathname();
  const hideHeaderOn = ["/profile", "/login", "/register", "/roadmaps", "/"];

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <ThemeProvider>
      <Provider store={store}>
        <AuthProvider>
          <AppInitializer>
            <NotificationsProvider>
              {!hideHeaderOn.includes(pathname) && (
  <div className="fixed top-0 left-0 w-full z-50">
    <Header />
  </div>
)}

              <div >{children}</div>
            </NotificationsProvider>
          </AppInitializer>
        </AuthProvider>
      </Provider>

      <div className="fixed bottom-5 right-5 z-999">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}
