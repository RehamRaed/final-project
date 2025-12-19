'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabase/server';
import * as tasksService from '@/services/tasks.service';
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types';

async function setupAction() {
    const supabase = await createServerSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error('Unauthorized - User not authenticated');
    }

    return { supabase, user };
}

function invalidateTaskListCache() {
    revalidatePath('/tasklist');
}

export type ActionResponse<T> =
    | { success: true; data: T; error?: undefined }
    | { success: false; error: string; data?: undefined };

function handleActionError(error: unknown, defaultMessage: string): { success: false; error: string } {
    let errorMessage = defaultMessage;

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as { message: string }).message;
    }

    console.error('Server Action Error:', errorMessage, error);
    return { success: false, error: errorMessage };
}

export async function getAllTasksAction(): Promise<ActionResponse<Tables<'tasks'>[] | null>> {
    try {
        const { supabase, user } = await setupAction();
        const { data, error } = await tasksService.getTasks(supabase, user.id);
        if (error) throw error;
        return { success: true, data };
    } catch (e: unknown) {
        return handleActionError(e, 'Failed to fetch tasks');
    }
}

export async function getTaskAction(taskId: string) {
    try {
        const { supabase } = await setupAction();
        const { data, error } = await tasksService.getTaskById(supabase, taskId);
        if (error) throw error;
        return { success: true, data };
    } catch (e: unknown) {
        return handleActionError(e, 'Failed to fetch task');
    }
}

export async function createTaskAction(taskData: Omit<TablesInsert<'tasks'>, 'user_id'>) {
    try {
        const { supabase, user } = await setupAction();
        const { data, error } = await tasksService.createTask(supabase, { ...taskData, user_id: user.id });
        if (error) throw error;
        invalidateTaskListCache();
        return { success: true, data };
    } catch (e: unknown) {
        return handleActionError(e, 'Failed to create task');
    }
}

export async function updateTaskAction(id: string, updates: TablesUpdate<'tasks'>) {
    try {
        const { supabase } = await setupAction();
        const { data, error } = await tasksService.updateTask(supabase, id, updates);
        if (error) throw error;
        invalidateTaskListCache();
        return { success: true, data };
    } catch (e: unknown) {
        return handleActionError(e, 'Failed to update task');
    }
}

export async function deleteTaskAction(taskId: string) {
    try {
        const { supabase } = await setupAction();
        const { error } = await tasksService.deleteTask(supabase, taskId);
        if (error) throw error;
        invalidateTaskListCache();
        return { success: true };
    } catch (e: unknown) {
        return handleActionError(e, 'Failed to delete task');
    }
}

export async function toggleTaskAction(taskId: string) {
    try {
        const { supabase, user } = await setupAction();
        const { data: task, error } = await tasksService.toggleTaskCompletion(supabase, taskId);
        if (error || !task) throw new Error(error?.message || "Task update failed.");

        if (task.is_completed) {
            const xpMap: Record<string, number> = { high: 100, medium: 50, low: 20 };
            const priority = task.priority?.toLowerCase() || 'low';
            const xpReward = xpMap[priority] || 20;

            const { data: profile, error: fetchProfileError } = await supabase
                .from('profiles')
                .select('xp')
                .eq('id', user.id)
                .single() as { data: { xp: number } | null, error: Error };

            if (!fetchProfileError) {
                const currentXp = profile?.xp || 0;
                const newXp = currentXp + xpReward;
                await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id);
            }
        }

        invalidateTaskListCache();
        return { success: true, data: task };
    } catch (e: unknown) {
        return handleActionError(e, 'Failed to toggle task');
    }
}

export async function completeTaskAction(taskId: string) {
    try {
        const { supabase } = await setupAction();
        const { data, error } = await tasksService.updateTask(supabase, taskId, { is_completed: true });
        if (error) throw error;
        invalidateTaskListCache();
        return { success: true, data };
    } catch (e: unknown) {
        return handleActionError(e, 'Failed to complete task');
    }
}

export async function uncompleteTaskAction(taskId: string) {
    try {
        const { supabase } = await setupAction();
        const { data, error } = await tasksService.updateTask(supabase, taskId, { is_completed: false });
        if (error) throw error;
        invalidateTaskListCache();
        return { success: true, data };
    } catch (e: unknown) {
        return handleActionError(e, 'Failed to uncomplete task');
    }
}
