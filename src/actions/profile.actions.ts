'use server';

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Tables } from "@/types/database.types";
import { z } from "zod";
import type { ActionResponse } from '@/types/actionResponse';

const ProfileSchema = z.object({
    full_name: z.string().min(3, "Full Name must be at least 3 characters").optional(),
    avatar_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    bio: z.string().max(500, "Bio is too long (max 500 chars)").optional(),
    university_id: z.string().min(5, "University ID is usually longer").optional(),
    department: z.string().min(2, "Department is required").optional(),
});

export async function updateProfile(formData: Partial<Tables<'profiles'>>): Promise<ActionResponse<unknown>> {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "User not authenticated." };
    }

    const result = ProfileSchema.safeParse(formData);

    if (!result.success) {
        return {
            success: false,
            message: "Validation failed. Please check the fields.",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    const dataToUpdate = result.data;

    const { error } = await supabase
        .from("profiles")
        .update({
            ...dataToUpdate,
            last_active: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        return { success: false, message: `Failed to save changes: ${error.message}` };
    }

    revalidatePath("/profile");

    return {
        success: true,
        message: "Profile updated successfully!",
        fieldErrors: {}
    };
}

export async function updateCurrentRoadmap(roadmapId: string): Promise<ActionResponse<unknown>> {
    const supabase = await createServerSupabase();
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
