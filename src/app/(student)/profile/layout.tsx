"use client";
import React from "react";
import Header from "@/components/Header/Header";

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header profile={true} />
      <main className="max-w-5xl mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;
