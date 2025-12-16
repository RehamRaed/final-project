'use client'

import { Tables } from '@/types/database.types'
import Card from './Card'
import { motion, AnimatePresence } from 'framer-motion'

type Task = Tables<'tasks'>

interface GridListProps {
    tasks: Task[]
    onToggle: (id: string) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onEdit?: (task: Task) => void
}

const GridList = ({ tasks, onToggle, onDelete, onEdit }: GridListProps) => {
    if (tasks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700"
            >
                <p className="text-gray-500 dark:text-gray-400 text-lg">No tasks found</p>
                <p className="text-gray-400 text-sm mt-2">Create a new task to get started!</p>
            </motion.div>
        )
    }

    // Professional shuffle animation - like dealing cards
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    }

    const cardVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            rotateX: -15
        },
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: 'spring' as const,
                damping: 20,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: -20,
            transition: {
                duration: 0.2
            }
        }
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <AnimatePresence mode='popLayout'>
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        layout
                        variants={cardVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                    >
                        <Card
                            task={task}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    )
}

export default GridList