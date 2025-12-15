"use client";

import "@/app/globals.css";
import "../styles/theme.css";
import { AuthProvider } from "@/components/SessionProvider";
import Header from "@/components/Header/Header";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store, AppDispatch } from "@/store";
import { fetchCurrentRoadmap } from "@/store/roadmapSlice";
import { RootState } from "@/store";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <Provider store={store}>
          <AuthProvider>
            <AppWithRedux>{children}</AppWithRedux>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
function AppWithRedux({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const hideOn = ["/", "/auth/login", "/auth/register", "/roadmaps", "/profile"];
  const shouldShowHeader = user && !hideOn.includes(pathname);

  const currentRoadmap = useSelector((state: RootState) => state.roadmap.current);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    loadUser();
  }, []);

  useEffect(() => {
    dispatch(fetchCurrentRoadmap());
  }, [dispatch]);

  return (
    <>
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
          <Header currentRoadmapId={currentRoadmap?.id} />
        </div>
      )}
      {children}
    </>
  );
}
