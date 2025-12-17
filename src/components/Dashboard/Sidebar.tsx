'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
    Home,
    Map,
    BookOpen,
    User,
    CheckSquare,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp
} from 'lucide-react'
import { logout } from '@/actions/auth'

interface SidebarProps {
    user: {
        id: string
        email: string
        fullName: string
        avatarUrl: string | null
    }
    isOpen: boolean
    isCollapsed: boolean
    onClose: () => void
    onToggleCollapse: () => void
    currentRoadmapId?: string | null
}

const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Roadmaps', href: '/roadmaps', icon: Map, hasDropdown: true },
    { name: 'Tasks', href: '/tasklist', icon: CheckSquare },
    { name: 'Profile', href: '/profile', icon: User },
]

export default function Sidebar({
    user,
    isOpen,
    isCollapsed,
    onClose,
    onToggleCollapse,
    currentRoadmapId,
}: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [roadmapDropdownOpen, setRoadmapDropdownOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
            >
                {/* Logo & Toggle */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    {!isCollapsed && (
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                StudyMate
                            </span>
                        </Link>
                    )}
                    <button
                        onClick={onToggleCollapse}
                        className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigationItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                        // Roadmaps dropdown
                        if (item.hasDropdown && item.name === 'Roadmaps') {
                            return (
                                <div key={item.name}>
                                    <button
                                        onClick={() => !isCollapsed && setRoadmapDropdownOpen(!roadmapDropdownOpen)}
                                        className={`
                                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                                            ${isActive
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }
                                            ${isCollapsed ? 'justify-center' : ''}
                                        `}
                                        title={isCollapsed ? item.name : undefined}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        {!isCollapsed && (
                                            <>
                                                <span className="font-medium flex-1 text-left">{item.name}</span>
                                                {roadmapDropdownOpen ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {!isCollapsed && roadmapDropdownOpen && (
                                        <div className="ml-8 mt-2 space-y-1">
                                            <Link
                                                href="/roadmaps"
                                                onClick={() => onClose()}
                                                className="block px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                Browse All
                                            </Link>
                                            {currentRoadmapId && (
                                                <Link
                                                    href={`/roadmaps/${currentRoadmapId}/courses`}
                                                    onClick={() => onClose()}
                                                    className="block px-3 py-2 text-sm rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium"
                                                >
                                                    📚 My Roadmap
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => onClose()}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="font-medium">{item.name}</span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    {!isCollapsed ? (
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {user.fullName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
              text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 
              transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
                        title={isCollapsed ? 'Logout' : undefined}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    )
}
