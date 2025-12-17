'use client'

import { useState, ReactNode } from 'react'
import Sidebar from "@/components/Dashboard/Sidebar"
import DashboardHeader from './DashboardHeader'

interface DashboardLayoutProps {
    children: ReactNode
    user: {
        id: string
        email: string
        fullName: string
        avatarUrl: string | null
    }
    currentRoadmapId?: string | null
}

export default function DashboardLayout({ children, user, currentRoadmapId }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar
                user={user}
                isOpen={sidebarOpen}
                isCollapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                currentRoadmapId={currentRoadmapId}
            />

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-[70px]' : 'lg:pl-64'
                    }`}
            >
                {/* Header */}
                <DashboardHeader
                    user={user}
                    onMenuClick={() => setSidebarOpen(true)}
                    sidebarCollapsed={sidebarCollapsed}
                />

                {/* Page Content */}
                <main className="p-4 md:p-6 lg:p-8 pt-20">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    )
}
