'use client'

import { Tables } from '@/types/database.types'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, MoreVertical, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react'
import { useState } from 'react'

type Task = Tables<'tasks'>

interface TaskTableProps {
    tasks: Task[]
    onToggle: (id: string) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onEdit?: (task: Task) => void
}

const TaskTable = ({ tasks, onToggle, onDelete, onEdit }: TaskTableProps) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Task; direction: 'asc' | 'desc' } | null>(null)

    const sortedTasks = [...tasks].sort((a, b) => {
        if (!sortConfig) return 0
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === bValue) return 0

        if (aValue === null) return 1
        if (bValue === null) return -1

        const compare = aValue < bValue ? -1 : 1
        return sortConfig.direction === 'asc' ? compare : -compare
    })

    const handleSort = (key: keyof Task) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-20 bg-bg rounded-xl border border-dashed border-gray-300 ">
                <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
            </div>
        )
    }

    return (
        <div className="bg-card-bg rounded-xl shadow-sm border border-gray-200  overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 ">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 w-12">
                                <span className="sr-only">Status</span>
                            </th>
                            <th
                                onClick={() => handleSort('title')}
                                className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                Task
                            </th>
                            <th
                                onClick={() => handleSort('priority')}
                                className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                Priority
                            </th>
                            <th
                                onClick={() => handleSort('due_date')}
                                className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                Due Date
                            </th>
                            <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        <AnimatePresence mode='popLayout'>
                            {sortedTasks.map((task) => (
                                <motion.tr
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`
                                        group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50
                                        ${task.is_completed ? 'bg-gray-50/50 dark:bg-gray-900/30' : ''}
                                    `}
                                >
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => onToggle(task.id)}
                                            className={`
                                                transition-colors duration-200
                                                ${task.is_completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}
                                            `}
                                        >
                                            {task.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                            {task.title}
                                        </span>
                                        {task.description && (
                                            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                                                {task.description}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.priority && (
                                            <span className={`
                                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${task.priority === 'High' || task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                    task.priority === 'Medium' || task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}
                                            `}>
                                                {task.priority.toLowerCase()}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.due_date && (
                                            <div className={`flex items-center text-sm ${new Date(task.due_date) < new Date() && !task.is_completed
                                                    ? 'text-red-600 dark:text-red-400 font-medium'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(task.due_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onDelete(task.id)}
                                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete task"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TaskTable