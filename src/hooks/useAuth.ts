"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/SessionProvider"
export function useAuth() {
  return useContext(AuthContext);
}
