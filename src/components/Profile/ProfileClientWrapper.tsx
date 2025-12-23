'use client';

import { useState, useCallback, useTransition, ChangeEvent } from "react";
import ProfileForm from "./ProfileForm";
import ProfileAvatar from "./ProfileAvatar";
import ProfileActions from "./ProfileActions";
import ProfileRoadmap from "./ProfileRoadmap";
import { updateProfile } from "@/actions/profile.actions";
import type { Tables } from "@/types/database.types";

type InitialProfile = Tables<'profiles'>;

interface ProfileClientWrapperProps {
  initialProfile: InitialProfile;
  currentRoadmapTitle: string;
}

export default function ProfileClientWrapper({ initialProfile, currentRoadmapTitle }: ProfileClientWrapperProps) {
  const [profileData, setProfileData] = useState(initialProfile);
  const [imagePreview, setImagePreview] = useState(initialProfile.avatar_url || "/avatar.jpg");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(async () => {
    setErrorMessage(null);
    startTransition(async () => {
      // Sanitize null values
      const sanitizedData = {
        full_name: profileData.full_name ?? "",
        avatar_url: imagePreview ?? "",
        bio: profileData.bio ?? "",
        university_id: profileData.university_id ?? "",
        department: profileData.department ?? "",
      };

      const result = await updateProfile(sanitizedData);
      if (result.success) {
        setIsEditing(false);
      } else {
        let msg = result.message ?? "Failed to save changes.";
        if (result.fieldErrors) {
          const parts: string[] = [];
          for (const [key, val] of Object.entries(result.fieldErrors)) {
            if (Array.isArray(val)) parts.push(`${key}: ${val.join(', ')}`);
            else parts.push(`${key}: ${String(val)}`);
          }
          if (parts.length) msg += " — " + parts.join(" | ");
        }
        setErrorMessage(msg);
      }
    });
  }, [profileData, imagePreview]);

  const handleCancel = useCallback(() => {
    setProfileData(initialProfile);
    setImagePreview(initialProfile.avatar_url || "/avatar.jpg");
    setIsEditing(false);
    setErrorMessage(null);
  }, [initialProfile]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-bg border border-border rounded-xl shadow-md">
      {errorMessage && <div className="text-red-600 bg-red-100 p-3 rounded">{errorMessage}</div>}

      <ProfileAvatar imagePreview={imagePreview} onChange={handleImageChange} isEditing={isEditing} />
      <ProfileForm profile={profileData} handleChange={handleChange} isEditing={isEditing} />

      <ProfileActions
        isEditing={isEditing}
        isSaving={isPending}
        setIsEditing={setIsEditing}
        handleCancel={handleCancel}
        handleSave={handleSave}
      />

      <ProfileRoadmap currentRoadmapTitle={currentRoadmapTitle} />
    </div>
  );
}
