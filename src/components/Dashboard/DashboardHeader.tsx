'use client'

import { Menu, Bell, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface DashboardHeaderProps {
    user: {
        id: string
        email: string
        fullName: string
        avatarUrl: string | null
    }
    onMenuClick: () => void
    sidebarCollapsed?: boolean
}

// Generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
    const segments = pathname.split('/').filter(Boolean)

    const breadcrumbMap: Record<string, string> = {
        dashboard: 'Dashboard',
        roadmaps: 'Roadmaps',
        courses: 'Courses',
        profile: 'Profile',
        tasklist: 'Tasks',
    }

    return segments.map((segment, index) => ({
        label: breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        isLast: index === segments.length - 1
    }))
}

export default function DashboardHeader({ user, onMenuClick, sidebarCollapsed = false }: DashboardHeaderProps) {
    const pathname = usePathname()
    const breadcrumbs = generateBreadcrumbs(pathname)

    return (
        <header className={`fixed top-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 transition-all duration-300 ${sidebarCollapsed ? 'left-0 lg:left-[70px]' : 'left-0 lg:left-64'}`}>
            <div className="h-full px-4 md:px-6 flex items-center justify-between">
                {/* Left: Mobile Menu */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Logo/Title for mobile */}
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white lg:hidden">
                        StudyMate
                    </h1>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Search (optional - can be expanded) */}
                    <button
                        className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* Notifications (placeholder) */}
                    <button
                        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        {/* Notification badge */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    )
}
