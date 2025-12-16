'use client'

import { useState, useTransition } from 'react'
import { updateTaskAction } from '@/actions/tasks.actions'
import { X, Calendar as CalendarIcon, Loader2, Edit2, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Tables, TablesUpdate } from '@/types/database.types'

type Task = Tables<'tasks'>

interface TaskDetailsModalProps {
    task: Task | null
    isOpen: boolean
    onClose: () => void
    onTaskUpdated: () => void
}

const TaskDetailsModal = ({ task, isOpen, onClose, onTaskUpdated }: TaskDetailsModalProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
    const [dueDate, setDueDate] = useState('')
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState('')

    // Initialize form when task changes
    useState(() => {
        if (task) {
            setTitle(task.title)
            setDescription(task.description || '')
            setPriority((task.priority as 'Low' | 'Medium' | 'High') || 'Medium')
            setDueDate(task.due_date ? task.due_date.split('T')[0] : '')
        }
    })

    const handleEdit = () => {
        if (task) {
            setTitle(task.title)
            setDescription(task.description || '')
            setPriority((task.priority as 'Low' | 'Medium' | 'High') || 'Medium')
            setDueDate(task.due_date ? task.due_date.split('T')[0] : '')
            setIsEditing(true)
        }
    }

    const handleSave = async () => {
        if (!task || !title.trim()) return

        setError('')
        startTransition(async () => {
            const updates: TablesUpdate<'tasks'> = {
                title,
                description,
                priority,
                due_date: dueDate ? new Date(dueDate).toISOString() : null
            }

            const result = await updateTaskAction(task.id, updates)

            if (result.success) {
                setIsEditing(false)
                onTaskUpdated()
            } else {
                setError(result.error || 'Failed to update task')
            }
        })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setError('')
    }

    if (!isOpen || !task) return null

    const priorityColors = {
        High: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        Low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700  from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? 'Edit Task' : 'Task Details'}
                    </h2>
                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <button
                                onClick={handleEdit}
                                className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                aria-label="Edit task"
                            >
                                <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {isEditing ? (
                        // Edit Mode
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                                    {error}
                                </div>
                            )}
                        </>
                    ) : (
                        // View Mode
                        <>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {task.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Priority</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Medium}`}>
                                        {task.priority || 'Medium'}
                                    </span>
                                </div>

                                {task.due_date && (
                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Due Date</p>
                                        <div className="flex items-center text-gray-900 dark:text-white">
                                            <CalendarIcon className="w-4 h-4 mr-2" />
                                            {new Date(task.due_date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${task.is_completed
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                    {task.is_completed ? 'Completed' : 'In Progress'}
                                </span>
                            </div>

                            <div className="text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-700">
                                Created {new Date(task.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                {isEditing && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isPending || !title.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default TaskDetailsModal
