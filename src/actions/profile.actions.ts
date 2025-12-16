'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Tables } from "@/types/database.types";
import { z } from "zod";

// تعريف مخططات التحقق (Zod Schemas)
const ProfileSchema = z.object({
    full_name: z.string().min(3, "Full Name must be at least 3 characters").optional(),
    avatar_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    bio: z.string().max(500, "Bio is too long (max 500 chars)").optional(),
    university_id: z.string().min(5, "University ID is usually longer").optional(),
    department: z.string().min(2, "Department is required").optional(),
});

export type ActionState = {
    success: boolean;
    message: string;
    fieldErrors?: Record<string, string[]>;
};

export async function updateProfile(formData: Partial<Tables<'profiles'>>): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "User not authenticated." };
    }

    // 1. التحقق من البيانات (Server-side Validation)
    const result = ProfileSchema.safeParse(formData);

    if (!result.success) {
        return {
            success: false,
            message: "Validation failed. Please check the fields.",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    // 2. تصفية البيانات (إزالة الحقول غير المعرفة لتجنب مسح البيانات الموجودة)
    const dataToUpdate = result.data;

    // 3. التحديث في قاعدة البيانات
    const { error } = await supabase
        .from("profiles")
        .update({
            ...dataToUpdate,
            last_active: new Date().toISOString(), // تأكد من تحديث وقت التعديل
        })
        .eq("id", user.id);

    if (error) {
        console.error("Error updating profile:", error);
        return { success: false, message: `Failed to save changes: ${error.message}` };
    }

    // 4. إعادة التحقق من الصفحة لتحديث البيانات فوراً
    revalidatePath("/profile");

    return {
        success: true,
        message: "Profile updated successfully!",
        fieldErrors: {}
    };
}

export async function updateCurrentRoadmap(roadmapId: string): Promise<ActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "User not authenticated." };

    const { error } = await supabase
        .from("profiles")
        .update({ current_roadmap_id: roadmapId })
        .eq("id", user.id);

    if (error) {
        return { success: false, message: `Failed to update roadmap: ${error.message}` };
    }

    revalidatePath("/profile");
    return { success: true, message: "Roadmap updated successfully." };
}