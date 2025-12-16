// ProfileClientWrapper.tsx
"use client";

import { useState, ChangeEvent } from "react";
import { Tables } from "@/types/database.types";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ProfileActions from "./ProfileActions";
import ProfileRoadmap from "./ProfileRoadmap";
import { updateProfile } from "@/actions/profile.actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// تعريف أنواع البيانات المبدئية التي تم تمريرها من السيرفر
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
    const originalProfile = initialProfile; // للاستخدام في الإلغاء

    // 1. معالجة تغيير حقول النموذج
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    // 2. معالجة تغيير الصورة
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // 3. دالة الحفظ التي تستدعي Server Action
    const handleSave = async () => {
        setStatus("saving");

        // ملاحظة: يجب أن تقوم برفع الصورة أولاً وحفظ الـ avatar_url الجديد
        // لتبسيط المثال، سنفترض أننا نستخدم imagePreview مباشرة كـ avatar_url
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
            // هنا يمكن عرض رسالة نجاح
            console.log(result.message);
        } else {
            // هنا يمكن عرض رسالة خطأ
            console.error(result.message);
        }
    };

    // 4. دالة الإلغاء
    const handleCancel = () => {
        // العودة إلى البيانات الأصلية
        setProfileData(originalProfile);
        setImagePreview(originalProfile.avatar_url || "/avatar.jpg");
        setIsEditing(false);
    };

    return (
        <div
            className="p-8 rounded-xl shadow-md border bg-card-bg border-border"
        >
            <Link href="/dashboard" className="flex items-center gap-1 font-semibold text-primary mb-6">
                <ArrowLeft size={20} /> Back to Dashboard
            </Link>

            <h2 className="text-3xl font-bold border-b pb-4 mb-6 text-text-primary border-border">
                My Profile & Settings
            </h2>

            <ProfileAvatar imagePreview={imagePreview} onChange={handleImageChange} isEditing={isEditing} />

            <ProfileForm
                profile={profileData}
                isEditing={isEditing}
                handleChange={handleChange}
            />

            <ProfileActions
                isEditing={isEditing}
                handleSave={handleSave}
                handleCancel={handleCancel}
                setIsEditing={setIsEditing}
                isSaving={status === "saving"}
            />

            <ProfileRoadmap currentRoadmapTitle={currentRoadmapTitle} />

        </div>
    );
}