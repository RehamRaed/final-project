"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ProfileActions from "./ProfileActions";
import ProfileRoadmap from "./ProfileRoadmap";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/index";
import { fetchCurrentRoadmap } from "@/store/roadmapSlice";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const currentRoadmap = useSelector((state: RootState) => state.roadmap.current);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>("/avatar.jpg");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!profileData) return;

        setProfile(profileData);
        setImagePreview(profileData.avatar_url || "/avatar.jpg");

        dispatch(fetchCurrentRoadmap());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsEditing(false);

    await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        department: profile.department,
        university_id: profile.university_id,
        bio: profile.bio,
        avatar_url: imagePreview,
        last_active: new Date(),
      })
      .eq("id", profile.id);

    setProfile({ ...profile, avatar_url: imagePreview });
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile?.avatar_url) setImagePreview(profile.avatar_url); 
  };

  if (loading) return <div className="flex justify-center items-center h-[80vh]">
          <LoadingSpinner />
        </div> 

  return (
    <div className="max-w-5xl bg-bg mx-auto px-4 space-y-5">
      <Link
        href="/student/dashboard"
        className="flex items-center gap-1 font-semibold"
        style={{ color: "var(--color-primary)" }}
      >
        <ArrowLeft size={20} /> Back
      </Link>

      <div
        className="p-8 rounded-xl shadow-md border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          borderColor: "var(--color-border)",
        }}
      >
        <h2
          className="text-3xl font-bold border-b pb-4 mb-6"
          style={{
            color: "var(--color-text-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          My Profile
        </h2>

        <ProfileAvatar imagePreview={imagePreview} onChange={handleImageChange} />

        <ProfileForm profile={profile} isEditing={isEditing} handleChange={handleChange} />

        <ProfileActions
          isEditing={isEditing}
          handleSave={handleSave}
          handleCancel={handleCancel}
          setIsEditing={setIsEditing}
        />

        <ProfileRoadmap currentRoadmap={currentRoadmap} />
      </div>
    </div>
  );
}
