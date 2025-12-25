'use client'

import { useState, useTransition } from 'react'
import { createTaskAction } from '@/actions/tasks.actions'
import type { ActionResponse } from '@/types/actionResponse'
import type { TablesInsert, Tables } from '@/types/database.types'
import { X, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface AddTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onTaskAdded: () => void
}

const AddTaskModal = ({ isOpen, onClose, onTaskAdded }: AddTaskModalProps) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
    const [dueDate, setDueDate] = useState('')
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!title.trim()) return

        startTransition(async () => {
            const taskData: Omit<TablesInsert<'tasks'>, 'user_id'> = {
                title,
                description,
                priority,
                due_date: dueDate ? new Date(dueDate).toISOString() : null,
                is_completed: false
            }

            const result = await createTaskAction(taskData) as ActionResponse<Tables<'tasks'>>

            if (result && result.success) {
                setTitle('')
                setDescription('')
                setPriority('Medium')
                setDueDate('')
                onTaskAdded()
                onClose()
            } else {
                setError(result.error ?? result.message ?? 'Failed to create task')
            }
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-bg rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-primary">Add New Task</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-text-primary" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary  mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="w-full px-3 py-2 border text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details..."
                            rows={3}
                            className="w-full px-3 py-2 border text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                                className="w-full px-3 py-2 border text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary  mb-1">
                                Due Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3 py-2 border text-text-primary border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                                />
                                <CalendarIcon className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !title.trim()}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isPending ? 'Adding...' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default AddTaskModal