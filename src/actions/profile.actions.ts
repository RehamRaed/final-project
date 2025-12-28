'use server';

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/types/database.types";
import type { ActionResponse } from '@/types/actionResponse';
import { ProfileSchema } from "@/lib/validators/index";

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