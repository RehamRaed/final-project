import Tasks from "@/components/ToDos/Tasks";
import { Metadata } from 'next';
import { getAllTasksAction } from '@/actions/tasks.actions';
import { Tables } from '@/types/database.types';

export const metadata: Metadata = {
    title: 'Task Management | Smart Task System',
    description: 'Manage your tasks efficiently with our advanced task management system. Features include multiple views (Grid, Table, Calendar, Matrix), XP rewards, and Focus Mode with Pomodoro timer.',
    keywords: ['task management', 'todo list', 'productivity', 'pomodoro', 'eisenhower matrix', 'task tracker'],
    openGraph: {
        title: 'Smart Task Management System',
        description: 'Organize your tasks with multiple views, track your progress, and stay productive.',
        type: 'website',
    },
}

export default async function TaskList() {

    let initialTasks: Tables<'tasks'>[] = [];
    let fetchError: string | null = null;

    try {
        const result = await getAllTasksAction();

        if (result.success) {
            initialTasks = result.data || [];
        } else {
            fetchError = (result as { success: false; error: string }).error;
        }

    } catch (e) {
        console.error("Server fetch error:", e);
        fetchError = "An unexpected error occurred during data fetching.";
    }

    return (
        <div className="container mx-auto max-w-7xl py-25 px-5 min-h-screen">
            <header className="mb-6">
                <h1 className="text-3xl text-center font-bold text-text-primary mb-1">
                    Smart <span className="bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-700 transition-all duration-300">Task</span> Management
                </h1>
                <p className="text-center text-sm text-text-secondery max-w-2xl mx-auto">
                    Organize, track, and conquer your tasks with style
                </p>
            </header>

            <main>
                {fetchError ? (
                    <div className="p-4 border border-red-400 bg-red-50 text-red-700 rounded-lg">
                        <p className="font-semibold">Data Load Error:</p>
                        <p>{fetchError}</p>
                    </div>
                ) : (
                    <Tasks initialTasks={initialTasks} />
                )}
            </main>
        </div>
    )
}
