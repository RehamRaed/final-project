import Tasks from "@/components/ToDos/Tasks";
import { Metadata } from 'next'

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
    return (
        <div className="container mx-auto px-4 py-6 min-h-screen">
            <header className="mb-6">
                <h1 className="text-3xl text-center font-bold text-gray-900 dark:text-white mb-1">
                    Smart <span className="bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-700 transition-all duration-300">Task</span> Management
                </h1>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Organize, track, and conquer your tasks with style
                </p>
            </header>

            <main>
                <Tasks />
            </main>
        </div>
    )
}