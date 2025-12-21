'use client'

import { Tables } from '@/types/database.types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

type Task = Tables<'tasks'>

interface CalendarProps {
    tasks: Task[]
    onToggle: (id: string) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onEdit?: (task: Task) => void
}

const Calendar = ({ tasks, onEdit }: CalendarProps) => {
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
        <div className="bg-bg rounded-xl shadow-sm border border-gray-200  overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-200 ">
                <h2 className="text-xl font-bold text-text-primary">
                    {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100  rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100  rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-200  bg-bg">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-4 text-center text-sm font-semibold text-text-secondery">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-fr bg-bg gap-px">
                {emptyDays.map(i => (
                    <div key={`empty-${i}`} className="bg-bg min-h-30" />
                ))}

                {daysArray.map(day => {
                    const dayTasks = getTasksForDay(day)
                    const isToday =
                        day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear()

                    return (
                        <div key={day} className={`bg-bg p-2 min-h-30 relative group ${isToday ? 'bg-blue-50/30' : ''}`}>
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