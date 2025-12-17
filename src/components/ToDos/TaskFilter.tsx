'use client'

import { Grid3x3, List, Calendar, Filter, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

type ViewMode = 'grid' | 'table' | 'calendar' | 'matrix'
type FilterStatus = 'all' | 'pending' | 'completed'
type FilterPriority = 'all' | 'low' | 'medium' | 'high'

interface TaskFilterProps {
    viewMode: ViewMode
    onViewModeChange: (mode: ViewMode) => void
    filterStatus?: FilterStatus
    onFilterStatusChange?: (status: FilterStatus) => void
    filterPriority?: FilterPriority
    onFilterPriorityChange?: (priority: FilterPriority) => void
}

const TaskFilter = ({
    viewMode,
    onViewModeChange,
    filterStatus = 'all',
    onFilterStatusChange,
    filterPriority = 'all',
    onFilterPriorityChange
}: TaskFilterProps) => {
    const [showFilters, setShowFilters] = useState(false)

    const viewButtons = [
        { mode: 'grid' as ViewMode, icon: Grid3x3, label: 'grid' },
        { mode: 'table' as ViewMode, icon: List, label: 'table' },
        { mode: 'calendar' as ViewMode, icon: Calendar, label: 'calendar' },
        { mode: 'matrix' as ViewMode, icon: LayoutDashboard, label: 'matrix' }
    ]

    const statusFilters = [
        { value: 'all' as FilterStatus, label: 'all', color: 'bg-gray-100 text-gray-800' },
        { value: 'pending' as FilterStatus, label: 'pending', color: 'bg-blue-100 text-blue-800' },
        { value: 'completed' as FilterStatus, label: 'completed', color: 'bg-green-100 text-green-800' }
    ]

    const priorityFilters = [
        { value: 'all' as FilterPriority, label: 'all', color: 'bg-gray-100 text-gray-800' },
        { value: 'low' as FilterPriority, label: 'low', color: 'bg-red-100 text-red-800' },
        { value: 'medium' as FilterPriority, label: 'medium', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'high' as FilterPriority, label: 'high', color: 'bg-green-100 text-green-800' }
    ]

    return (
        <div className="bg-bg rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-secondary ml-2">
                        View Mode:
                    </span>
                    <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-bg ">
                        {viewButtons.map(({ mode, icon: Icon, label }) => (
                            <button
                                key={mode}
                                onClick={() => onViewModeChange(mode)}
                                className={`
                                    inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                                    transition-all duration-200 cursor-pointer
                                    ${viewMode === mode
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-text-secondery'
                                    }
                                `}
                                title={label}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             text-text-secondary hover:bg-gray-50/50 cursor-pointer
                             transition-colors duration-200"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    <span className={`transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </button>
            </div>

            {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    
                    {onFilterStatusChange && (
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Status:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {statusFilters.map(({ value, label, color }) => (
                                    <button
                                        key={value}
                                        onClick={() => onFilterStatusChange(value)}
                                        className={`
                                            px-4 py-2 rounded-full text-sm font-medium
                                            transition-all duration-200 cursor-pointer
                                            ${filterStatus === value
                                                ? `${color} ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800`
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700  hover:bg-gray-200 '
                                            }
                                        `}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {onFilterPriorityChange && (
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Priority:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {priorityFilters.map(({ value, label, color }) => (
                                    <button
                                        key={value}
                                        onClick={() => onFilterPriorityChange(value)}
                                        className={`
                                            px-4 py-2 rounded-full text-sm font-medium
                                            transition-all duration-200 cursor-pointer
                                            ${filterPriority === value
                                                ? `${color} ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800`
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 hover:bg-gray-200 '
                                            }
                                        `}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default TaskFilter