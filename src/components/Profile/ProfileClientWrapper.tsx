'use client';

import { useState, useCallback, useTransition, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { Tables } from "@/types/database.types";
import { ArrowLeft } from "lucide-react";
import { useNotifications } from "@/context/NotificationsContext";
import ProfileForm from "./ProfileForm";
import ProfileAvatar from "./ProfileAvatar";
import ProfileActions from "./ProfileActions";
import ProfileRoadmap from "./ProfileRoadmap";
import { updateProfile } from "@/actions/profile.actions";

type InitialProfile = Tables<'profiles'>;

interface ProfileClientWrapperProps {
  initialProfile: InitialProfile;
  currentRoadmapTitle: string;
}

export default function ProfileClientWrapper({ initialProfile, currentRoadmapTitle }: ProfileClientWrapperProps) {
  const router = useRouter();
  const { addNotification } = useNotifications();

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
      const result = await updateProfile({
        full_name: profileData.full_name || "",
        avatar_url: imagePreview, 
        bio: profileData.bio || "",
        university_id: profileData.university_id || "",
        department: profileData.department || "",
      });

      if (result.success) {
        setIsEditing(false);
        addNotification("Profile updated successfully!");
        router.refresh();
      } else {
        let msg = result.message ?? "Failed to save changes.";
        if (result.fieldErrors) {
          const parts: string[] = [];
          for (const [key, val] of Object.entries(result.fieldErrors)) {
            const fieldName = key.replace('_', ' ');
            if (Array.isArray(val)) parts.push(`${fieldName}: ${val.join(', ')}`);
            else parts.push(`${fieldName}: ${String(val)}`);
          }
          if (parts.length) msg += " — " + parts.join(" | ");
        }
        setErrorMessage(msg);
      }
    });
  }, [profileData, imagePreview, router, addNotification]);

  const handleCancel = useCallback(() => {
    setProfileData(initialProfile);
    setImagePreview(initialProfile.avatar_url || "/avatar.jpg");
    setIsEditing(false);
    setErrorMessage(null);
  }, [initialProfile]);

  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 font-semibold text-primary mb-5 cursor-pointer hover:underline transition-all"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="max-w-5xl mx-auto p-6 space-y-6 bg-card-bg border border-border rounded-xl shadow-md">
        {errorMessage && (
          <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
            ⚠️ {errorMessage}
          </div>
        )}

        <ProfileAvatar 
          imagePreview={imagePreview} 
          onChange={handleImageChange} 
          isEditing={isEditing} 
        />
        
        <ProfileForm 
          profile={profileData} 
          handleChange={handleChange} 
          isEditing={isEditing} 
        />

        <ProfileActions
          isEditing={isEditing}
          isSaving={isPending}
          setIsEditing={setIsEditing}
          handleCancel={handleCancel}
          handleSave={handleSave}
        />

        <ProfileRoadmap currentRoadmapTitle={currentRoadmapTitle} />
      </div>
    </>
  );
}
