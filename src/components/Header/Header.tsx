"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchCourses } from "@/lib/search";
import SearchResults, { CourseSearchResult } from "./SearchResults";
import { useNotifications } from "@/context/NotificationsContext";
import { supabase } from "@/lib/supabase/client";
import Loading from "@/app/loading";

import {
  Menu as MenuIcon,
  Search as SearchIcon,
  User,
  Bell,
  CheckSquare,
  LogOut,
} from "lucide-react";
import LogoutConfirmModal from "./LogoutConfirmModal";

/* ================== Types ================== */

interface HeaderProps {
  currentRoadmapId?: string | null;
}

export default function Header({ currentRoadmapId }: HeaderProps) {
  const router = useRouter();
  const { notifications } = useNotifications();
  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [res, setRes] = useState<CourseSearchResult[]>([]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setRes([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {;
      setTimeout(() => router.replace("/login"), 300);
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
              <button
                className="md:hidden p-2 rounded hover:bg-white/20"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <MenuIcon size={24} />
              </button>

              <Link href="/dashboard" className="text-2xl">
                StudyMATE
              </Link>

              <div className="hidden md:flex relative ml-4" ref={searchRef}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                  <SearchIcon size={20} />
                </span>
                <input
                  type="text"
                  className="bg-white/20 placeholder-white text-white rounded-md pl-10 pr-4 py-2 w-72 focus:outline-none focus:bg-white/30"
                  placeholder="Search courses…"
                  value={searchQuery}
                  onChange={async (e) => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    if (!q) return setRes([]);
                    setRes(await fetchCourses({ query: q }));
                  }}
                />
                {res.length > 0 && (
                  <div className="absolute top-10 left-0 w-72 bg-bg text-text-secondary rounded-md shadow-lg max-h-96 overflow-auto z-50 p-2">
                    <SearchResults res={res} onResultClick={clearSearch} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full cursor-pointer hover:bg-white/20">
                <Bell size={22} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-200 text-xs rounded-full px-1">
                    {notifications.length}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-2 rounded-full cursor-pointer hover:bg-white/20 flex items-center"
                >
                  <User size={25} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 w-38 bg-bg text-text-secondary rounded-md shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/profile");
                      }}
                      className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 "
                    >
                      <User size={18} /> My Profile
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/tasklist");
                      }}
                      className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                    >
                      <CheckSquare size={18} /> My Tasks
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setConfirmLogoutOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 cursor-pointer hover:bg-red-100 font-semibold flex items-center gap-2"
                    >
                      <LogOut size=
      await supabase.auth.signOut();
      setConfirmLogoutOpen(false){18} /> Logout
                    </button>
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
