'use client'
import '@/app/globals.css';
import { AuthProvider } from "@/components/SessionProvider";
import "../styles/theme.css";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Header from '@/components/Header/Header';
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";


export default function RootLayout({ children }: { children: React.ReactNode }) {

const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
const [loadingTags, setLoadingTags] = useState(true);
  
  {console.log(tags)}

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  const pathname = usePathname();

  const hideOn = ["/", "/auth/login", "/auth/register", "/roadmaps"];

  const shouldShowHeader = user && !hideOn.includes(pathname);

  // Fetch tags from Supabase
  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("tags").select("id, name").order("name");
      if (error) console.error(error);
      else setTags(data ?? []);
      setLoadingTags(false);
    };
    fetchTags();
  }, []);

  // Fetch user session
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
              <Header tags={tags}/>
            </div>
          )}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
