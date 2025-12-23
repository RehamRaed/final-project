
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Tables } from "@/types/database.types";
import type { ActionResponse } from '@/types/actionResponse';

export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});


const ProfileSchema = z.object({
  full_name: z.string().min(3).optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(500).optional(),
  university_id: z.string().min(5).optional(),
  department: z.string().min(2).optional(),
});

export async function updateProfile(formData: Partial<Tables<'profiles'>>): Promise<ActionResponse<unknown>> {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "User not authenticated." };

  const parsed = ProfileSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...parsed.data,
      last_active: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/profile");

  return { success: true, message: "Profile updated successfully!", fieldErrors: {} };
}

// Course Filter Schema
export const courseFilterSchema = paginationSchema.extend({
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
    search: z.string().optional(),
    category_id: z.string().uuid().optional(),
});

// Resource Schema
export const resourceFilterSchema = paginationSchema.extend({
    subjectId: z.string().uuid(),
    type: z.enum(['Folder', 'File']).optional(),
    category: z.enum(['Books', 'Assignments', 'Labs', 'Slides', 'Projects', 'Other']).optional(),
});

export const createResourceSchema = z.object({
    subject_id: z.string().uuid(),
    title: z.string().min(3),
    description: z.string().optional(),
    type: z.enum(['Folder', 'File']),
    category: z.enum(['Books', 'Assignments', 'Labs', 'Slides', 'Projects', 'Other']).optional(),
    file_url: z.string().url().optional(),
    file_size: z.number().optional(),
    file_extension: z.string().optional(),
    mime_type: z.string().optional(),
});

// Task Schema
export const createTaskSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    subject_id: z.string().uuid().optional(),
    due_date: z.string().datetime().optional(),
    priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
    is_completed: z.boolean().optional(),
    status: z.enum(['Pending', 'InProgress', 'Completed']).optional(),
});
