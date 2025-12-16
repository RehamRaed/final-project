'use client'

import { Tables } from '@/types/database.types'
import { ChevronLeft, ChevronRight, GripHorizontal } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'

type Task = Tables<'tasks'>

interface CalendarProps {
    tasks: Task[]
    onToggle: (id: string) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onEdit?: (task: Task) => void
}

const Calendar = ({ tasks, onToggle, onDelete, onEdit }: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date())

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const days = new Date(year, month + 1, 0).getDate()
        const firstDay = new Date(year, month, 1).getDay()
        return { days, firstDay }
    }

    const { days, firstDay } = getDaysInMonth(currentDate)

    const daysArray = Array.from({ length: days }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const getTasksForDay = (day: number) => {
        return tasks.filter(task => {
            if (!task.due_date) return false
            const taskDate = new Date(task.due_date)
            return taskDate.getDate() === day &&
                taskDate.getMonth() === currentDate.getMonth() &&
                taskDate.getFullYear() === currentDate.getFullYear()
        })
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 dark:bg-gray-700 gap-px">
                {emptyDays.map(i => (
                    <div key={`empty-${i}`} className="bg-white dark:bg-gray-800 min-h-[120px]" />
                ))}

                {daysArray.map(day => {
                    const dayTasks = getTasksForDay(day)
                    const isToday =
                        day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear()

                    return (
                        <div key={day} className={`bg-white dark:bg-gray-800 p-2 min-h-[120px] relative group ${isToday ? 'bg-blue-50/30' : ''}`}>
                            <span className={`
                                w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1
                                ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}
                            `}>
                                {day}
                            </span>

                            <div className="space-y-1">
                                {dayTasks.map(task => (
                                    <motion.div
                                        key={task.id}
                                        layoutId={task.id}
                                        className={`
                                            text-xs p-1.5 rounded border truncate cursor-pointer hover:opacity-80
                                            ${task.is_completed
                                                ? 'bg-green-50 text-green-700 border-green-200 line-through'
                                                : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }
                                        `}
                                        onClick={() => onEdit?.(task)}
                                    >
                                        {task.title}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Calendar