'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, GraduationCap, Map, ChevronRight, X, UserSquare2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { CompletionWidget } from './CompletionWidget'; // Removed as requested
import { GeneralForm, AcademicForm } from './NewProfileForms';
import { ProfessionalIDCard } from './ProfessionalIDCard';
import type { Tables } from '@/types/database.types';
import { calculateProfileCompletion } from '@/lib/profile-completion';
import ProfileRoadmap from './ProfileRoadmap';
import Link from 'next/link';

type Profile = Tables<'profiles'>;

// Wrapper component to make ProfileRoadmap fit the prop structure
const RoadmapWrapper = ({ currentRoadmapTitle }: { currentRoadmapTitle: string }) => (
    <div className='space-y-8'>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100/50">
            <div className="space-y-1">
                <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2">
                    <Map className="w-5 h-5 text-blue-600" />
                    Current Learning Path
                </h3>
                <p className="text-blue-700/80 text-sm">
                    You are currently enrolled in <span className="font-semibold text-blue-800">"{currentRoadmapTitle}"</span>
                </p>
            </div>
            <Link
                href="/roadmaps"
                className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-white text-blue-600 text-sm font-semibold rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 group"
            >
                Change Plan
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
            </Link>
        </div>

        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 pointer-events-none rounded-xl" />
            <ProfileRoadmap currentRoadmapTitle={currentRoadmapTitle} />
        </div>
    </div>
);

export default function NewProfileClientWrapper({ initialProfile, currentRoadmapTitle }: { initialProfile: Profile, currentRoadmapTitle: string }) {
    const [activeTab, setActiveTab] = useState('general');
    const [showIdCard, setShowIdCard] = useState(false);

    // We still calculate completion just for the "Verified Student" badge status
    const completion = calculateProfileCompletion(initialProfile);
    const isComplete = completion.percentage === 100;

    const tabs = [
        { id: 'general', label: 'General', icon: User, description: 'Basic info & bio', component: GeneralForm },
        { id: 'academic', label: 'Academic', icon: GraduationCap, description: 'University details', component: AcademicForm },
        { id: 'roadmap', label: 'My Roadmap', icon: Map, description: 'Current learning path', component: () => <RoadmapWrapper currentRoadmapTitle={currentRoadmapTitle} /> },
    ];

    const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];
    const ActiveComponent = activeTabObj.component;

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {showIdCard && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                        role="dialog" // دور دلالي
                        aria-modal="true" // يدل على أن المحتوى داخل النافذة
                        aria-labelledby="id-card-title"
                    >
                        {/* الخلفية (Overlay) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowIdCard(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        />

                        {/* نافذة المودال (Dialog Content) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-xl bg-card border border-border rounded-xl shadow-[0_15px_60px_-5px_rgba(0,0,0,0.35)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >

                            {/* رأس المودال (Header) */}
                            <header className="p-6 border-b border-border/70 bg-secondary/30 flex items-center justify-between">
                                <div className="flex flex-col text-left">
                                    <h2 id="id-card-title" className="text-xl font-extrabold text-foreground tracking-tight">
                                        Official Student ID
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        Verified Academic Identity
                                    </p>
                                </div>

                                {/* زر الإغلاق */}
                                <button
                                    onClick={() => setShowIdCard(false)}
                                    className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                                    aria-label="Close ID card dialog"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </header>

                            {/* جسم المودال (Body) */}
                            <div className="p-8 bg-background/90">

                                {/* المكون الفعلي لبطاقة الهوية (نحتفظ به كما هو) */}
                                <ProfessionalIDCard profile={initialProfile} />

                                {/* تذييل المودال (Footer) */}
                                <footer className="mt-8 pt-4 border-t border-border/70 flex justify-end">
                                    <button
                                        onClick={() => setShowIdCard(false)}
                                        className="px-6 py-2 border border-input text-foreground font-medium rounded-lg hover:bg-accent transition-colors shadow-sm"
                                    >
                                        Close
                                    </button>
                                </footer>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl shadow-blue-900/10">
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/20 shadow-inner">
                            <span className={cn("flex h-2 w-2 rounded-full", isComplete ? "bg-green-400 animate-pulse" : "bg-amber-400")}></span>
                            {isComplete ? "Verified Student" : "Profile In Progress"}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Profile Settings</h1>
                        <p className="text-blue-100/90 max-w-xl text-lg leading-relaxed">
                            {isComplete
                                ? "Your profile is fully optimized. You're ready to rock!"
                                : "Customize your academic presence and manage your account details."}
                        </p>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-72 shrink-0 space-y-6">
                    <nav className="flex flex-col gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "group relative flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 text-left border overflow-hidden",
                                    activeTab === tab.id
                                        ? "bg-white border-blue-100 shadow-md shadow-blue-500/5 text-blue-700"
                                        : "bg-transparent border-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-900"
                                )}
                            >
                                {/* Active Indicator Bar */}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 rounded-l-xl"
                                    />
                                )}

                                <div className={cn(
                                    "p-2.5 rounded-lg transition-colors duration-300",
                                    activeTab === tab.id ? "bg-blue-600 text-white shadow-blue-500/20 shadow-lg" : "bg-gray-100 group-hover:bg-white group-hover:shadow-sm"
                                )}>
                                    <tab.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold">{tab.label}</div>
                                    <div className={cn("text-xs font-normal mt-0.5", activeTab === tab.id ? "text-blue-600/70" : "text-gray-400")}>{tab.description}</div>
                                </div>
                                {activeTab === tab.id && (
                                    <ChevronRight className="w-4 h-4 text-blue-600 animate-in slide-in-from-left-2" />
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                        <div className="mb-8 border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                                    {activeTabObj.label}
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    Manage your {activeTabObj.label.toLowerCase()} information.
                                </p>
                            </div>

                            {/* زر عرض الهوية يظهر فقط في تبويب General */}
                            {activeTab === 'general' && (
                                <button
                                    onClick={() => setShowIdCard(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 font-medium text-sm group"
                                >
                                    <UserSquare2 className="w-4 h-4" />
                                    <span>View Official ID</span>
                                    <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                                </button>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <ActiveComponent profile={initialProfile} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}
