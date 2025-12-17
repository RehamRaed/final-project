import { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database.types'
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js"

type Task = Tables<"tasks">;
type TaskInsert = TablesInsert<"tasks">;
type TaskUpdate = TablesUpdate<"tasks">;

type ServiceResponse<T> = { data: T | null; error: PostgrestError | null }



export async function getTasks(
    client: SupabaseClient<Database>,
    userId: string
): Promise<ServiceResponse<Task[]>> {
    const { data, error } = await client
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) {
        console.error('Error fetching tasks:', error)
        return { data: null, error }
    }
    return { data, error: null }
}


export async function getTaskById(
    client: SupabaseClient<Database>,
    taskId: string
): Promise<ServiceResponse<Task>> {
    const { data, error } = await client
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single()

    if (error) {
        console.error('Error fetching task:', error)
        return { data: null, error }
    }

    return { data, error: null }
}



export async function createTask(
    client: SupabaseClient<Database>,
    newTaskData: TaskInsert
): Promise<ServiceResponse<Task>> {
    const { data, error } = await client
        .from('tasks')
        .insert(newTaskData)
        .select()
        .single()

    if (error) {
        console.error('Error creating task:', error)
        return { data: null, error }
    }

    return { data, error: null }
}


export async function updateTask(
    client: SupabaseClient<Database>,
    id: string,
    updatedTask: TaskUpdate
): Promise<ServiceResponse<Task>> {

    const payload: TaskUpdate = { ...updatedTask };

    if (payload.is_completed !== undefined) {
        const isCompleted = payload.is_completed === true;
        payload.completed_at = isCompleted ? new Date().toISOString() : null;
    }

    const { data, error } = await client
        .from("tasks")
        .update(payload)
        .select("*")
        .eq("id", id)
        .single()

    if (error) {
        console.error('Error updating task:', error)
        return { data: null, error }
    }

    return { data, error: null }
}



export async function deleteTask(
    client: SupabaseClient<Database>,
    taskId: string
): Promise<ServiceResponse<true>> {
    const { error } = await client
        .from('tasks')
        .delete()
        .eq('id', taskId)

    if (error) {
        console.error('Error deleting task:', error)
        return { data: null, error }
    }

    return { data: true, error: null }
}


export async function toggleTaskCompletion(
    client: SupabaseClient<Database>,
    taskId: string
): Promise<ServiceResponse<Task>> {
    const { data: currentTask, error: fetchError } = await client
        .from("tasks")
        .select("is_completed")
        .eq("id", taskId)
        .single()

    if (fetchError) {
        console.error('Error fetching task for toggle:', fetchError)
        return { data: null, error: fetchError }
    }

    const newCompletionStatus = !currentTask.is_completed

    return updateTask(client, taskId, { is_completed: newCompletionStatus })
}