"use client";

import { useState, ChangeEvent, useCallback, useRef, useTransition } from "react";
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
  // keep original profile in a ref to avoid costly deep clones on each render
  const originalProfileRef = useRef<InitialProfile>(initialProfile);
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
    setStatus("saving");

    const dataToUpdate = {
      full_name: profileData.full_name,
      department: profileData.department,
      university_id: profileData.university_id,
      bio: profileData.bio,
      avatar_url: imagePreview,
    };

    try {
      // use transition to keep UI responsive
      startTransition(async () => {
        const result = await updateProfile(dataToUpdate as Partial<InitialProfile>);
        setStatus("idle");
        if (result && result.success) {
          setIsEditing(false);
          // show a friendly toast instead of console.log in production
          if (process.env.NODE_ENV === 'development') console.info(result.message ?? 'Profile updated');
        } else if (result) {
          // Format validation errors nicely for the user
          let msg = result.message ?? 'Validation failed. Please check the fields.';
          if (result.fieldErrors && typeof result.fieldErrors === 'object') {
            try {
              const parts: string[] = [];
              for (const [key, val] of Object.entries(result.fieldErrors)) {
                if (Array.isArray(val)) parts.push(`${key}: ${val.join(', ')}`);
                else parts.push(`${key}: ${String(val)}`);
              }
              if (parts.length) msg += ' — ' + parts.join(' | ');
            } catch {
              /* ignore formatting errors */
            }
          }
          setErrorMessage(msg);
          if (process.env.NODE_ENV === 'development') console.warn('Profile update validation:', result.fieldErrors ?? result);
        } else {
          setErrorMessage('Unknown error while updating profile.');
          if (process.env.NODE_ENV === 'development') console.error('Unknown result from updateProfile', result);
        }
      });
    } catch (err) {
      setStatus("idle");
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
      console.error('Failed to update profile:', err);
    }
  }, [profileData, imagePreview]);

  const handleCancel = useCallback(() => {
    setProfileData(originalProfileRef.current);
    setImagePreview(originalProfileRef.current.avatar_url || "/avatar.jpg");
    setIsEditing(false);
  }, []);

  return (
    
    <>
    <Link href="/dashboard" className="flex items-center gap-1 font-semibold text-primary mb-5">
        <ArrowLeft size={20} /> Back
      </Link>
    <div className="max-w-5xl mx-auto bg-bg p-8 rounded-xl shadow-md border border-border space-y-6">

      <h2 className="text-3xl font-bold border-b pb-4 mb-6 text-text-primary border-border">
        My Profile
      </h2>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4" role="alert">
          {errorMessage}
        </div>
      )}

      <ProfileAvatar imagePreview={imagePreview} onChange={handleImageChange} isEditing={isEditing} />

      <ProfileForm profile={profileData} isEditing={isEditing} handleChange={handleChange} />

      <ProfileActions
        isEditing={isEditing}
        handleSave={handleSave}
        handleCancel={handleCancel}
        setIsEditing={setIsEditing}
        isSaving={status === "saving" || isPending}
      />

      <ProfileRoadmap currentRoadmapTitle={currentRoadmapTitle} />
    </div>
    </>
  );
}
