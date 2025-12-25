'use server';

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Tables } from "@/types/database.types";
import type { ActionResponse } from '@/types/actionResponse';

const ProfileSchema = z.object({
  full_name: z.string().min(3).or(z.literal("")).optional(),
  avatar_url: z.string().url().or(z.literal("")).optional().nullable(),
  bio: z.string().max(50).or(z.literal("")).optional().nullable(),
  university_id: z.string()
    .refine((val) => val === "" || val.length >= 5, {
      message: "University ID must be at least 5 characters"
    }).optional().nullable(),
  department: z.string()
    .refine((val) => val === "" || val.length >= 2, {
      message: "Department must be at least 2 characters"
    }).optional().nullable(),
});

export async function updateProfile(formData: Partial<Tables<'profiles'>>): Promise<ActionResponse<unknown>> {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "User not authenticated." };

  const parsed = ProfileSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const dataToUpdate = Object.fromEntries(
    Object.entries(parsed.data).filter(([_, value]) => value !== undefined)
  );

  const { error } = await supabase
    .from("profiles")
    .update({
      ...dataToUpdate,
      last_active: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/profile");

  return { success: true, message: "Profile updated successfully!", fieldErrors: {} };
}