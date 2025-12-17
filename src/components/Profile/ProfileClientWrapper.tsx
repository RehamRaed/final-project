"use client";

import { useState, ChangeEvent } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ProfileActions from "./ProfileActions";
import ProfileRoadmap from "./ProfileRoadmap";
import { updateProfile } from "@/actions/profile.actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Tables } from "@/types/database.types";

type InitialProfile = Tables<'profiles'>;

interface ProfileClientWrapperProps {
  initialProfile: InitialProfile;
  currentRoadmapTitle: string;
}

export default function ProfileClientWrapper({ initialProfile, currentRoadmapTitle }: ProfileClientWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfile);
  const [imagePreview, setImagePreview] = useState(initialProfile.avatar_url || "/avatar.jpg");
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const originalProfile = initialProfile;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setStatus("saving");
    const dataToUpdate = {
      full_name: profileData.full_name,
      department: profileData.department,
      university_id: profileData.university_id,
      bio: profileData.bio,
      avatar_url: imagePreview,
    };

    const result = await updateProfile(dataToUpdate);

    setStatus("idle");
    if (result.success) {
      setIsEditing(false);
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  };

  const handleCancel = () => {
    setProfileData(originalProfile);
    setImagePreview(originalProfile.avatar_url || "/avatar.jpg");
    setIsEditing(false);
  };

  return (
    
    <>
    <Link href="/dashboard" className="flex items-center gap-1 font-semibold text-primary mb-5">
        <ArrowLeft size={20} /> Back
      </Link>
    <div className="max-w-5xl mx-auto bg-bg p-8 rounded-xl shadow-md border border-border space-y-6">

      <h2 className="text-3xl font-bold border-b pb-4 mb-6 text-text-primary border-border">
        My Profile
      </h2>

      <ProfileAvatar imagePreview={imagePreview} onChange={handleImageChange} isEditing={isEditing} />

      <ProfileForm profile={profileData} isEditing={isEditing} handleChange={handleChange} />

      <ProfileActions
        isEditing={isEditing}
        handleSave={handleSave}
        handleCancel={handleCancel}
        setIsEditing={setIsEditing}
        isSaving={status === "saving"}
      />

      <ProfileRoadmap currentRoadmapTitle={currentRoadmapTitle} />
    </div>
    </>
  );
}
