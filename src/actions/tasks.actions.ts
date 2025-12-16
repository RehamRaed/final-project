'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import * as tasksService from '@/services/tasks.service'
import { TablesInsert, TablesUpdate } from '@/types/database.types'



async function setupAction() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        throw new Error('Unauthorized - User not authenticated')
    }

    return { supabase, user }
}



export async function getAllTasksAction() {
    try {
        const { supabase, user } = await setupAction()

        const { data, error } = await tasksService.getTasks(supabase, user.id)

        if (error) throw error

        return { success: true, data }
    } catch (e: any) {
        console.error('getAllTasksAction error:', e)
        return { success: false, error: e.message || 'Failed to fetch tasks' }
    }
}


export async function getTaskAction(taskId: string) {
    try {
        const { supabase } = await setupAction()

        const { data, error } = await tasksService.getTaskById(supabase, taskId)

        if (error) throw error

        return { success: true, data }
    } catch (e: any) {
        console.error('getTaskAction error:', e)
        return { success: false, error: e.message || 'Failed to fetch task' }
    }
}



export async function createTaskAction(
    taskData: Omit<TablesInsert<'tasks'>, 'user_id'> // يتم إزالة user_id من البيانات المتوقعة من العميل
) {
    try {
        const { supabase, user } = await setupAction()

        const { data, error } = await tasksService.createTask(supabase, {
            ...taskData,
            user_id: user.id //  💡 يتم إضافة user_id من الخادم (مصدر موثوق)
        })

        if (error) throw error

        revalidatePath('/tasklist')

        return { success: true, data }
    } catch (e: any) {
        console.error('createTaskAction error:', e)
        return { success: false, error: e.message || 'Failed to create task' }
    }
}



export async function updateTaskAction(
    id: string,
    updates: TablesUpdate<'tasks'>
) {
    try {
        const { supabase } = await setupAction()

        const { data, error } = await tasksService.updateTask(supabase, id, updates)

        if (error) throw error

        revalidatePath('/tasklist')

        return { success: true, data }
    } catch (e: any) {
        console.error('updateTaskAction error:', e)
        return { success: false, error: e.message || 'Failed to update task' }
    }
}



export async function deleteTaskAction(taskId: string) {
    try {
        const { supabase } = await setupAction()

        const { data, error } = await tasksService.deleteTask(supabase, taskId)

        if (error) throw error

        revalidatePath('/tasklist')

        return { success: true }
    } catch (e: any) {
        console.error('deleteTaskAction error:', e)
        return { success: false, error: e.message || 'Failed to delete task' }
    }
}


export async function toggleTaskAction(taskId: string) {
    try {
        const { supabase, user } = await setupAction()

        const { data: task, error } = await tasksService.toggleTaskCompletion(supabase, taskId)

        if (error || !task) throw error

        // XP Reward Logic: Award points only when task is completed
        if (task.is_completed) {
            const xpMap: Record<string, number> = {
                'high': 100,
                'medium': 50,
                'low': 20
            }
            // Default to 20 if priority is null or unknown
            const priority = task.priority?.toLowerCase() || 'low'
            const xpReward = xpMap[priority] || 20

            // Fetch current profile XP
            const { data: profile } = await supabase
                .from('profiles')
                .select('xp')
                .eq('id', user.id)
                .single()

            const currentXp = profile?.xp || 0
            const newXp = currentXp + xpReward

            // Update profile with new XP
            const { error: xpError } = await supabase
                .from('profiles')
                .update({ xp: newXp })
                .eq('id', user.id)

            if (xpError) {
                console.error('Failed to update XP:', xpError)
                // We don't throw here to avoid failing the task toggle itself
            }
        }

        revalidatePath('/tasklist')

        return { success: true, data: task }
    } catch (e: any) {
        console.error('toggleTaskAction error:', e)
        return { success: false, error: e.message || 'Failed to toggle task' }
    }
}



export async function completeTaskAction(taskId: string) {
    try {
        const { supabase } = await setupAction()

        const { data, error } = await tasksService.updateTask(supabase, taskId, {
            is_completed: true,
        })

        if (error) throw error

        revalidatePath('/tasklist')

        return { success: true, data }
    } catch (e: any) {
        console.error('completeTaskAction error:', e)
        return { success: false, error: e.message || 'Failed to complete task' }
    }
}



export async function uncompleteTaskAction(taskId: string) {
    try {
        const { supabase } = await setupAction()

        const { data, error } = await tasksService.updateTask(supabase, taskId, {
            is_completed: false,
        })

        if (error) throw error

        revalidatePath('/tasklist')

        return { success: true, data }
    } catch (e: any) {
        console.error('uncompleteTaskAction error:', e)
        return { success: false, error: e.message || 'Failed to uncomplete task' }
    }
}