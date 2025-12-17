'use client';
import React from 'react';

const ProfileHeader: React.FC = () => {
  return (
    <header
  className="w-full py-4 bg-primary px-4 sm:px-6 lg:px-8 "
  style={{
    boxShadow: 'var(--shadow-appbar)',
  }}
>
  <span className="text-2xl text-white">StudyMATE</span>
</header>

  );
};

export default ProfileHeader;
