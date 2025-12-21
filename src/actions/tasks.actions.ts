"use server";

import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabase/server';
import * as tasksService from '@/services/tasks.service';
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types';
import type { ActionResponse } from '@/types/actionResponse';


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

<<<<<<< HEAD
export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function handleActionError(
  error: unknown,
  defaultMessage: string
): ActionResponse<never> {
  let errorMessage = defaultMessage;
=======
function handleActionError(error: unknown, defaultMessage: string): { success: false; error: string } {
    let errorMessage = defaultMessage;
>>>>>>> main

  if (error instanceof Error) {
    errorMessage = error.message;
  }

  console.error('Server Action Error:', error);
  return { success: false, error: errorMessage };
}


export async function getAllTasksAction(): Promise<
  ActionResponse<Tables<'tasks'>[] | null>
> {
  try {
    const { supabase, user } = await setupAction();
    const { data, error } = await tasksService.getTasks(supabase, user.id);
    if (error) throw error;

    return { success: true, data };
  } catch (e) {
    return handleActionError(e, 'Failed to fetch tasks');
  }
}

<<<<<<< HEAD
export async function getTaskAction(
  taskId: string
): Promise<ActionResponse<Tables<'tasks'> | null>> {
  try {
    const { supabase } = await setupAction();
    const { data, error } = await tasksService.getTaskById(supabase, taskId);
    if (error) throw error;

    return { success: true, data };
  } catch (e) {
    return handleActionError(e, 'Failed to fetch task');
  }
}

export async function createTaskAction(
  taskData: Omit<TablesInsert<'tasks'>, 'user_id'>
): Promise<ActionResponse<Tables<'tasks'> | null>> {
  try {
    const { supabase, user } = await setupAction();
    const { data, error } = await tasksService.createTask(supabase, {
      ...taskData,
      user_id: user.id,
    });

    if (error) throw error;

    invalidateTaskListCache();
    return { success: true, data };
  } catch (e) {
    return handleActionError(e, 'Failed to create task');
  }
}

export async function updateTaskAction(
  id: string,
  updates: TablesUpdate<'tasks'>
): Promise<ActionResponse<Tables<'tasks'> | null>> {
  try {
    const { supabase } = await setupAction();
    const { data, error } = await tasksService.updateTask(
      supabase,
      id,
      updates
    );

    if (error) throw error;

    invalidateTaskListCache();
    return { success: true, data };
  } catch (e) {
    return handleActionError(e, 'Failed to update task');
  }
}

export async function deleteTaskAction(
  taskId: string
): Promise<ActionResponse<null>> {
  try {
    const { supabase } = await setupAction();
    const { error } = await tasksService.deleteTask(supabase, taskId);

    if (error) throw error;

    invalidateTaskListCache();
    return { success: true, data: null };
  } catch (e) {
    return handleActionError(e, 'Failed to delete task');
  }
}

export async function toggleTaskAction(
  taskId: string
): Promise<ActionResponse<Tables<'tasks'> | null>> {
  try {
    const { supabase, user } = await setupAction();
    const { data: task, error } =
      await tasksService.toggleTaskCompletion(supabase, taskId);
=======
export async function getTaskAction(taskId: string): Promise<ActionResponse<Tables<'tasks'> | null>> {
    try {
        const { supabase } = await setupAction();
        const { data, error } = await tasksService.getTaskById(supabase, taskId);
        if (error) throw error;
        return { success: true, data };
    } catch (e: unknown) {
        return handleActionError(e, 'Failed to fetch task');
    }
}

export async function createTaskAction(taskData: Omit<TablesInsert<'tasks'>, 'user_id'>): Promise<ActionResponse<Tables<'tasks'>>> {
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

export async function updateTaskAction(id: string, updates: TablesUpdate<'tasks'>): Promise<ActionResponse<Tables<'tasks'>>> {
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

export async function deleteTaskAction(taskId: string): Promise<ActionResponse<null>> {
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

export async function toggleTaskAction(taskId: string): Promise<ActionResponse<Tables<'tasks'>>> {
    try {
        const { supabase, user } = await setupAction();
        const { data: task, error } = await tasksService.toggleTaskCompletion(supabase, taskId);
        if (error || !task) throw new Error(error?.message || "Task update failed.");
>>>>>>> main

    if (error || !task) {
      throw new Error(error?.message || 'Task toggle failed');
    }

<<<<<<< HEAD
    if (task.is_completed) {
      const xpMap: Record<string, number> = {
        high: 100,
        medium: 50,
        low: 20,
      };

      const priority = task.priority?.toLowerCase() || 'low';
      const xpReward = xpMap[priority] ?? 20;

      const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', user.id)
        .single<{ xp: number }>();

      const currentXp = profile?.xp ?? 0;
      await supabase
        .from('profiles')
        .update({ xp: currentXp + xpReward })
        .eq('id', user.id);
=======
export async function completeTaskAction(taskId: string): Promise<ActionResponse<Tables<'tasks'>>> {
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

export async function uncompleteTaskAction(taskId: string): Promise<ActionResponse<Tables<'tasks'>>> {
    try {
        const { supabase } = await setupAction();
        const { data, error } = await tasksService.updateTask(supabase, taskId, { is_completed: false });
        if (error) throw error;
        invalidateTaskListCache();
        return { success: true, data };
    } catch (e: unknown) {
        return handleActionError(e, 'Failed to uncomplete task');
>>>>>>> main
    }

    invalidateTaskListCache();
    return { success: true, data: task };
  } catch (e) {
    return handleActionError(e, 'Failed to toggle task');
  }
}
