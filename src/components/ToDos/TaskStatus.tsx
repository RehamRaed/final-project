'use client'

import { CheckCircle2, Clock } from 'lucide-react'
import { Tables } from '@/types/database.types'

type Task = Tables<'tasks'>

interface TaskStatusProps {
    tasks: Task[]
}

const TaskStatus = ({ tasks }: TaskStatusProps) => {
    const total = tasks.length
    const completed = tasks.filter(t => t.is_completed).length
    const pending = total - completed
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

    const stats = {
        total,
        completed,
        pending,
    }

    return (
        <div className="bg-bg rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">Total</p>
                            <p className="text-xl font-bold text-primary">{stats.total}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">Done</p>
                            <p className="text-xl font-bold text-accent">{stats.completed}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-secondary flex items-center justify-center">
                            <Clock className="w-5 h-5 text-" />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">Pending</p>
                            <p className="text-xl font-bold text-secondary">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:max-w-xs flex flex-col gap-1">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-medium text-text-secondary">Progress</span>
                        <span className="text-lg font-bold text-primary">{percentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden p-0.5">
                        <div
                            className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p className="text-xs text-text-secondery text-right mt-1 font-medium">
                        {percentage === 100 ? ' All tasks completed! Great job!' : 'Keep going, you got this! '}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TaskStatus