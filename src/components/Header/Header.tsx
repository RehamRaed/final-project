"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchCourses, CourseSearchResult } from "@/lib/search";
import SearchResults from "./SearchResults";
import { useNotifications } from "@/context/NotificationsContext";
import { supabase } from "@/lib/supabase/client";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";

import {
  Search as SearchIcon,
  User,
  Bell,
  CheckSquare,
  LogOut,
} from "lucide-react";
import LogoutConfirmModal from "./LogoutConfirmModal";


interface HeaderProps {
  currentRoadmapId?: string | null;
}

export default function Header({ currentRoadmapId }: HeaderProps) {
  const router = useRouter();
  const { notifications } = useNotifications();
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentRoadmap = useSelector((state: RootState) => state.roadmap.current);
  const activeRoadmapId = currentRoadmap?.id || currentRoadmapId;

  const [searchQuery, setSearchQuery] = useState("");
  const [res, setRes] = useState<CourseSearchResult[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    avatarUrl: string | null;
    initials: string | null;
    currentRoadmapId?: string | null;
  }>({
    avatarUrl: null,
    initials: null,
    currentRoadmapId: null
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url, full_name, current_roadmap_id")
          .eq("id", user.id)
          .single();

        const avatarUrl = data?.avatar_url || null;
        let initials = null;
        if (data?.full_name) {
          const names = data.full_name.trim().split(" ");
          if (names.length === 1) {
            initials = names[0].charAt(0).toUpperCase();
          } else if (names.length > 1) {
            initials =
              (names[0].charAt(0) +
                names[names.length - 1].charAt(0)).toUpperCase();
          }
        }

        setUserInfo({
          avatarUrl,
          initials,
          currentRoadmapId: data?.current_roadmap_id
        });
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setRes([]);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      // clear server-side cookies first
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      // clear client session store as well
      await supabase.auth.signOut().catch(() => {});
      // navigate with full reload to ensure client state and cache are cleared
      setTimeout(() => {
        try {
          window.location.href = '/login';
        } catch {
          router.replace('/login');
        }
      }, 300);
    } catch (e) {
      console.error(e);
      setIsLoggingOut(false);
    }
  };

  const clearSearch = () => {
    setRes([]);
    setSearchQuery("");
  };

  if (isLoggingOut) return <Loading />;

  return (
    <>
      <header className="bg-primary text-white shadow-md">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-2xl font-bold">
                StudyMATE
              </Link>

              <div className="hidden md:flex relative ml-4" ref={searchRef}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                  <SearchIcon size={20} />
                </span>
                <input
                  type="text"
                  className="bg-white/20 placeholder-white text-white rounded-md pl-10 pr-4 py-2 w-72 focus:outline-none focus:bg-white/30 transition-colors"
                  placeholder={
                    activeRoadmapId
                      ? "Search in your roadmap..."
                      : "Search courses..."
                  }
                  value={searchQuery}
                  onChange={async (e) => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    if (!q) return setRes([]);
                    setRes(
                      await fetchCourses({
                        query: q,
                        roadmapId: activeRoadmapId || undefined
                      })
                    );
                  }}
                />
                {res.length > 0 && (
                  <div className="absolute top-12 left-0 w-72 bg-bg  rounded-md shadow-xl max-h-96 overflow-auto z-50 p-2">
                    <SearchResults
                      res={res}
                      onResultClick={clearSearch}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
                <Bell size={22} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-1 rounded-full cursor-pointer hover:bg-white/20 flex items-center justify-center transition-colors focus:outline-none"
                >
                  {userInfo.avatarUrl ? (
                    <Image
                      src={userInfo.avatarUrl}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover border-2 border-white/50"
                    />
                  ) : userInfo.initials ? (
                    <div className="w-9 h-9 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm border-2 border-white/50">
                      {userInfo.initials}
                    </div>
                  ) : (
                    <div className="bg-white/20 p-1.5 rounded-full">
                      <User size={20} />
                    </div>
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-40 bg-bg text-gray-500 rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-200">
                    <div >
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/profile");
                        }}
                        className="w-full text-left px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <User size={18} className="text-gray-500" />
                        <span>My Profile</span>
                      </button>

                      {/* 
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/roadmaps"); // ← Browse Roadmaps navigation
                        }}
                        className="w-full text-left px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <MapIcon size={18} className="text-gray-500" />
                        <span>Browse Roadmaps</span>
                      </button>
                       */}

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/tasklist");
                        }}
                        className="w-full text-left px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100"
                      >
                        <CheckSquare size={18} className="text-gray-500" />
                        <span>My Tasks</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          setConfirmLogoutOpen(true);
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 cursor-pointer hover:bg-red-50 font-medium flex items-center gap-3 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <LogoutConfirmModal
        open={confirmLogoutOpen}
        loading={isLoggingOut}
        onClose={() => setConfirmLogoutOpen(false)} 
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
