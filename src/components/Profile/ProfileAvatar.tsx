"use client";

import Image from 'next/image';

interface ProfileAvatarProps {
  imagePreview: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

export default function ProfileAvatar({ imagePreview, onChange, isEditing }: ProfileAvatarProps) {
  return (
    <div className="relative mb-10 mx-auto w-32 h-32">
      <Image
        src={imagePreview}
        alt="Avatar"
        width={128}
        height={128}
        className="w-32 h-32 rounded-full object-cover border border-border"
      />

      {isEditing && (
        <label className="absolute inset-0 bg-black/25 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer">
          <span className="text-white font-semibold text-sm">Change Photo</span>
          <input type="file" accept="image/*" onChange={onChange} className="hidden" />
        </label>
      )}
    </div>
  );
}
