"use client";

import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store, AppDispatch } from "@/store";

// Redux Thunk action to fetch the current roadmap
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
  const dispatch = useDispatch<AppDispatch>();  //dispatch actions to the Redux store
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // trigger Redux Thunk action and fetch the user's current roadmap from Supabase
    dispatch(fetchCurrentRoadmap()).finally(() => setReady(true)); // even if fetch fails, we set ready to true
  }, [dispatch]);

  // Wait until the roadmap is loaded (ready = true)
  if (!ready) return null;

  // Renders children only when data is ready
  return <>{children}</>;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const hideHeaderOn = ["/login", "/register", "/", "/roadmaps", "/profile"]; 
  
  // after the component mounts and when pathname changes, to check: authentication, whether user has selected a roadmap and show toast if not
  useEffect(() => {
    // Check if user is authenticated
    // read Supabase session, query profile for current roadmap, show toast if none selected.
    const checkUser = async () => {
      // 1. Get current session
      const { data } = await supabase.auth.getSession(); // from coockies and local storage
      const currentUser = data.session?.user ?? null; // if session extract user, if not currentUser = null
      setLoading(false); // stop loading once we have session info

      // 2. If user is logged in, check if they have a selected roadmap
      if (currentUser) {
        // fetch profile to get current_roadmap_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('current_roadmap_id')
          .eq('id', currentUser.id)
          .single();

        // 3. check if current_roadmap_id is null and show toast if so
        // this condition is true when user exists but has not selected any roadmap yet
        if (!profile?.current_roadmap_id) {
          if (pathname !== "/roadmaps") { // avoid showing toast on the roadmap selection page itself
            toast((t) => (
              <div className="flex flex-col gap-2">
                <span>You haven&apos;t selected a roadmap yet!</span>
                <Link
                  href="/roadmaps" // to navigate to roadmaps again
                  onClick={() => toast.dismiss(t.id)}
                  className="bg-primary text-white px-3 py-1 rounded text-sm text-center"
                >
                  Browse Roadmaps
                </Link>
              </div>
            ), { duration: 6000, icon: '🗺️', id: 'roadmap-reminder' }); // show toast for 6 sec
          }
        }
      }
    };

    checkUser(); // execute the async function
  }, [pathname]); // pathname dependency to re-run on route changes (user goes to /dashboard or /tasks etc)

  // While checking auth and profile, avoid rendering layout
  if (loading) return null;

  return (
    <ThemeProvider> {/* wrap everything visually rendered */}
      <Provider store={store}>
        <AuthProvider>
          <AppInitializer>
            <NotificationsProvider>
              {!hideHeaderOn.includes(pathname) && (
                <div className="fixed top-0 left-0 w-full z-50">
                  <Header profile={false}/>
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