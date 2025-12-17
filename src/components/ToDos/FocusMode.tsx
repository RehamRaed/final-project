'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Timer, Trophy } from 'lucide-react'

const FocusMode = () => {
    const [minutes, setMinutes] = useState(25)
    const [seconds, setSeconds] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work')

    const toggle = () => setIsActive(!isActive)

    const reset = () => {
        setIsActive(false)
        setSeconds(0)
        if (mode === 'work') setMinutes(25)
        else if (mode === 'shortBreak') setMinutes(5)
        else setMinutes(15)
    }

    const setTimerMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
        setMode(newMode)
        setIsActive(false)
        setSeconds(0)
        if (newMode === 'work') setMinutes(25)
        else if (newMode === 'shortBreak') setMinutes(5)
        else setMinutes(15)
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        setIsActive(false)
                    } else {
                        setMinutes(minutes - 1)
                        setSeconds(59)
                    }
                } else {
                    setSeconds(seconds - 1)
                }
            }, 1000)
        } else if (!isActive && seconds !== 0 && interval) {
            clearInterval(interval)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, seconds, minutes])

    return (
        <div className="bg-bg rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Timer className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Focus Mode</h2>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">
                    <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">XP Boost Active</span>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setTimerMode('work')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'work'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                    >
                        Pomodoro
                    </button>
                    <button
                        onClick={() => setTimerMode('shortBreak')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'shortBreak'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                    >
                        Short Break
                    </button>
                </div>

                <div className="text-6xl font-bold text-text-primary mb-8 font-mono tracking-wider">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggle}
                        className={`
                            flex items-center justify-center w-14 h-14 rounded-full transition-all transform active:scale-95
                            ${isActive
                                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 border-2 border-amber-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                            }
                        `}
                    >
                        {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </button>

                    <button
                        onClick={reset}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FocusMode
