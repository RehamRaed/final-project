'use client'

import { useState, useTransition, useEffect } from 'react'
import {
    getAllTasksAction,
    toggleTaskAction,
    deleteTaskAction
} from '@/actions/tasks.actions'
import GridList from './GridList'
import TaskTable from './TaskTable'
import TaskFilter from './TaskFilter'
import TaskStatus from './TaskStatus'
import MatrixView from './MatrixView'
import Calendar from './Calendar'
import FocusMode from './FocusMode'
import AddTaskModal from './AddTaskModal'
import TaskDetailsModal from './TaskDetailsModal'
import { Tables } from '@/types/database.types'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'

type Task = Tables<'tasks'>
type ViewMode = 'grid' | 'table' | 'calendar' | 'matrix'
type FilterStatus = 'all' | 'pending' | 'completed'
type FilterPriority = 'all' | 'low' | 'medium' | 'high'

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
    const [filterPriority, setFilterPriority] = useState<FilterPriority>('all')
    const [showFocusMode, setShowFocusMode] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isPending, startTransition] = useTransition()

    const fetchTasks = async () => {
        setIsLoading(true)
        const result = await getAllTasksAction()
        if (result.success && result.data) {
            setTasks(result.data)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        // Fetch tasks on mount
        const load = async () => {
            await fetchTasks()
        }
        load()
    }, [])

    const handleToggle = async (id: string) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t))

        const result = await toggleTaskAction(id)
        if (!result.success) {
            // Revert on failure
            setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t))
        }
    }

    const handleDelete = async (id: string) => {
        // Optimistic update
        setTasks(prev => prev.filter(t => t.id !== id))

        const result = await deleteTaskAction(id)
        if (!result.success) {
            // Re-fetch or revert
            await fetchTasks()
        }
    }

    const filteredTasks = tasks.filter(task => {
        const statusMatch =
            filterStatus === 'all' ? true :
                filterStatus === 'completed' ? task.is_completed :
                    !task.is_completed

        const priorityMatch =
            filterPriority === 'all' ? true :
                task.priority?.toLowerCase() === filterPriority

        return statusMatch && priorityMatch
    })

    const renderView = () => {
        const props = {
            tasks: filteredTasks,
            onToggle: handleToggle,
            onDelete: handleDelete,
            onEdit: (task: Task) => setSelectedTask(task)
        }

        switch (viewMode) {
            case 'grid': return <GridList {...props} />
            case 'table': return <TaskTable {...props} />
            case 'calendar': return <Calendar {...props} />
            case 'matrix': return <MatrixView {...props} />
            default: return <GridList {...props} />
        }
    }

    const handleDeleteAll = async () => {
        if (tasks.length === 0) return

        const confirmed = window.confirm(
            `⚠️ Are you sure you want to delete ALL ${tasks.length} tasks?\n\nThis action cannot be undone!`
        )

        if (!confirmed) return

        setIsLoading(true)

        // Delete all tasks one by one
        for (const task of tasks) {
            await deleteTaskAction(task.id)
        }

        await fetchTasks()
        setIsLoading(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
                <button
                    onClick={() => setShowFocusMode(!showFocusMode)}
                    className={`
                        group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                        hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer
                        ${showFocusMode
                            ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-blue-500/50'
                            : 'bg-white text-gray-700 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'}
                    `}
                >
                    <span className="group-hover:rotate-12 transition-transform duration-300">⏱️</span>
                    {showFocusMode ? 'Hide Focus Timer' : 'Show Focus Timer'}
                </button>

                {tasks.length > 0 && (
                    <button
                        onClick={handleDeleteAll}
                        disabled={isLoading}
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                            bg-linear-to-r from-red-500 to-red-600 text-white shadow-md
                            hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                    >
                        <span className="group-hover:rotate-12 transition-transform duration-300">🗑️</span>
                        Delete All ({tasks.length})
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showFocusMode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <FocusMode />
                    </motion.div>
                )}
            </AnimatePresence>

            <TaskStatus tasks={tasks} />

            <TaskFilter
                viewMode={viewMode}
                onViewModeChange={(mode) => setViewMode(mode)}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                filterPriority={filterPriority}
                onFilterPriorityChange={setFilterPriority}
            />

            <div className="flex justify-start mb-4">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="group flex items-center gap-2 px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300
                        bg-linear-to-r from-blue-600 to-blue-700 text-white
                        hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95 cursor-pointer
                        hover:from-blue-700 hover:to-blue-800"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    New Task
                </button>
            </div>

            <AddTaskModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onTaskAdded={fetchTasks}
            />

            <TaskDetailsModal
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                onTaskUpdated={fetchTasks}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.15,
                        ease: "easeInOut"
                    }}
                >
                    {renderView()}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Tasks
