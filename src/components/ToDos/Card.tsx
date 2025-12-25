'use client'

import { Tables } from '@/types/database.types'
import { Calendar, CheckCircle2, Circle, Clock, MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'

type Task = Tables<'tasks'>

interface CardProps {
    task: Task
    onToggle: (id: string) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onEdit?: (task: Task) => void
}

const Card = ({ task, onToggle, onDelete, onEdit }: CardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const priorityColors = {
        High: 'bg-red-100/50 text-red-700 border-red-200',
        Medium: 'bg-yellow-100/50 text-yellow-700 border-yellow-200',
        Low: 'bg-green-100/50 text-green-700 border-green-200'
    }

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsLoading(true)
        await onToggle(task.id)
        setIsLoading(false)
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsMenuOpen(false)
        setIsLoading(true)
        await onDelete(task.id)
        setIsLoading(false)
    }

    const handleCardClick = () => {
        if (onEdit) {
            onEdit(task)
        }
    }

    return (
        <div
            onClick={handleCardClick}
            className={`
            group relative bg-bg rounded-xl p-5 
            border transition-all duration-300 hover:shadow-xl cursor-pointer
            ${task.is_completed
                    ? 'border-green-200  bg-green-50/30 '
                    : 'border-gray-200  hover:border-blue-300 hover:-translate-y-1'}
            ${isLoading ? 'opacity-70 pointer-events-none' : ''}
        `}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${task.title}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick()
                }
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <span className={`
                    px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wide
                    ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Medium}
                `}>
                    {task.priority || 'Medium'}
                </span>

                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsMenuOpen(!isMenuOpen)
                        }}
                        className="p-1.5 rounded-lg transition-colors text-text-primary cursor-pointer"
                        aria-label="Task options"
                    >
                        <MoreVertical className="w-4 h-4 " />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-40 bg-bg rounded-lg shadow-lg border border-gray-200  py-1 z-10">
                            <button
                                onClick={handleDelete}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 cursor-pointer  flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <h3 className={`
                    text-lg font-semibold mb-2 line-clamp-2
                    ${task.is_completed ? 'text-text-primary line-through' : 'text-text-primary'}
                `}>
                    {task.title}
                </h3>
                {task.description && (
                    <p className="text-sm text-text-secondary line-clamp-2">
                        {task.description}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 ">
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                    {task.due_date && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                </div>

                <button
                    onClick={handleToggle}
                    className={`
                        p-2 rounded-full transition-all duration-300 transform active:scale-95
                        ${task.is_completed
                            ? 'bg-green-100 text-green-600 hover:bg-green-200  dark:text-green-400'
                            : ' text-text-secondary hover:bg-blue-100 hover:text-blue-600  '}
                    `}
                    title={task.is_completed ? "Mark as incomplete" : "Mark as complete"}
                    aria-label={task.is_completed ? "Mark as incomplete" : "Mark as complete"}
                >
                    {task.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>
            </div>
        </div>
    )
}

export default Card