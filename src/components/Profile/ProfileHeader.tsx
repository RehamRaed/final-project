import React from 'react';
import Link from 'next/link';

const ProfileHeader: React.FC = () => {
  return (
    <header
  className="w-full py-4 bg-primary px-4 sm:px-6 lg:px-8 "
  style={{
    boxShadow: 'var(--shadow-appbar)',
  }}
>
  <Link href="/dashboard" className="text-2xl text-white">StudyMATE</Link>
</header>

  );
};

export default ProfileHeader;
