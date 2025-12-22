'use client'

import { Tables } from '@/types/database.types'
import Card from './Card'
import { motion } from 'framer-motion'
import { AlertCircle, Calendar, Zap, Coffee } from 'lucide-react'

type Task = Tables<'tasks'>

interface MatrixViewProps {
    tasks: Task[]
    onToggle: (id: string) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onEdit?: (task: Task) => void
}

const MatrixView = ({ tasks, onToggle, onDelete, onEdit }: MatrixViewProps) => {

    const isUrgentDate = (dateString: string | null) => {
        if (!dateString) return false
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = date.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 2 // Today, tomorrow, or overdue
    }

    const quadrants = {
        q1: {
            title: 'Urgent & Important',
            subtitle: 'Do it now!',
            icon: Zap,
            color: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800',
            textColor: 'text-red-700 dark:text-red-400',
            tasks: tasks.filter(t => isUrgentDate(t.due_date) && t.priority === 'High')
        },
        q2: {
            title: 'Important, Not Urgent',
            subtitle: 'Schedule it',
            icon: Calendar,
            color: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800',
            textColor: 'text-blue-700 dark:text-blue-400',
            tasks: tasks.filter(t => !isUrgentDate(t.due_date) && t.priority === 'High')
        },
        q3: {
            title: 'Urgent, Not Important',
            subtitle: 'Delegate it',
            icon: AlertCircle,
            color: 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800',
            textColor: 'text-orange-700 dark:text-orange-400',
            tasks: tasks.filter(t => isUrgentDate(t.due_date) && t.priority !== 'High')
        },
        q4: {
            title: 'Not Urgent & Not Important',
            subtitle: 'Delete it',
            icon: Coffee,
            color: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800',
            textColor: 'text-green-700 dark:text-green-400',
            tasks: tasks.filter(t => !isUrgentDate(t.due_date) && t.priority !== 'High')
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
            {Object.entries(quadrants).map(([key, q], index) => {
                const Icon = q.icon
                return (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-2xl border-2 p-6 min-h-100 flex flex-col ${q.color}`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-lg bg-bg shadow-sm ${q.textColor}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${q.textColor}`}>{q.title}</h3>
                                <p className="text-sm opacity-80 dark:text-gray-300">{q.subtitle}</p>
                            </div>
                            <span className="ml-auto bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full text-sm font-bold">
                                {q.tasks.length}
                            </span>
                        </div>

                        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {q.tasks.length > 0 ? (
                                q.tasks.map(task => (
                                    <div key={task.id} className="transform scale-90 origin-top-left w-full hover:scale-100 transition-transform duration-200">
                                        <Card task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center border-2 border-dashed border-black/5 dark:border-white/10 rounded-xl">
                                    <p className="text-sm opacity-50">Empty Quadrant</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}

export default MatrixView