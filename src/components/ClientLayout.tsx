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
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

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
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const hideHeaderOn = ["/login", "/register", "/"];

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;
      setLoading(false);

      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('current_roadmap_id')
          .eq('id', currentUser.id)
          .single();

        if (!profile?.current_roadmap_id) {
          if (pathname !== "/roadmaps") {
            toast((t) => (
              <div className="flex flex-col gap-2">
                <span>You haven&apos;t selected a roadmap yet!</span>
                <Link
                  href="/roadmaps"
                  onClick={() => toast.dismiss(t.id)}
                  className="bg-primary text-white px-3 py-1 rounded text-sm text-center"
                >
                  Browse Roadmaps
                </Link>
              </div>
            ), { duration: 6000, icon: '🗺️', id: 'roadmap-reminder' });
          }
        }
      }
    };

    checkUser();
  }, [pathname]);

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