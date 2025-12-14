"use client";

import "@/app/globals.css";
import "../styles/theme.css";
import { AuthProvider } from "@/components/SessionProvider";
import Header from "@/components/Header/Header";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

import { Provider, useDispatch } from "react-redux";
import { store, AppDispatch } from "@/store";
import { fetchCurrentRoadmap } from "@/store/roadmapSlice";

function AppInitializer({ children }: { children: React.ReactNode }) {
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

export default function RootLayout({ children }: { children: React.ReactNode }) {

const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
const [loadingTags, setLoadingTags] = useState(true);
  
  {console.log(tags)}

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const pathname = usePathname();
  const hideOn = ["/", "/auth/login", "/auth/register", "/roadmaps", "/profile"];
  const shouldShowHeader = user && !hideOn.includes(pathname);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    loadUser();
  }, []);

  return (
    <html lang="en" dir="ltr">
      <body>
        <Provider store={store}>
          <AuthProvider>
            {!loading && user && <AppInitializer>{children}</AppInitializer>}

            {!loading && shouldShowHeader && (
              <div
                style={{
                  zIndex: 50,
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                }}
              >
                <Header />
              </div>
            )}

            {!user && children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
