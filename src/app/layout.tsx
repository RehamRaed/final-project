"use client";

import '@/app/globals.css';
import { AuthProvider } from "@/components/SessionProvider";
import "../styles/theme.css";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import Header from '@/components/Header/Header';
import { usePathname } from "next/navigation";


// export const metadata = {
//   title: 'Final Project App',
//   description: 'Roadmap selection and user authentication project.',
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  const pathname = usePathname();

  const hideOn = ["/", "/auth/login", "/auth/register", "/roadmaps"];

  const shouldShowHeader = user && !hideOn.includes(pathname);

    useEffect(() => {
      const load = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
        setLoading(false);
      };
  
      load();
    }, []);
  return (
    <html lang="en" dir="ltr">
      <body>
        <AuthProvider>
          {!loading && shouldShowHeader && user && (
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
