'use client';
import React from 'react';
import ProfileHeader from "@/components/Profile/ProfileHeader";

const TodosLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg">
      <ProfileHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
};

export default TodosLayout;
