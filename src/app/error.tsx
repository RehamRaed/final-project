'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error boundary caught:', error)
        }
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg px-4">
            <div className="max-w-md w-full bg-card-bg shadow-lg rounded-lg p-8 text-center border border-border">
                <div className="mb-4">
                    <svg
                        className="mx-auto h-12 w-12 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Oops! Something went wrong
                </h2>
                <p className="text-text-secondary mb-6">
                    We encountered an error while loading this page. Please try again.
                </p>
                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-left">
                        <p className="text-sm text-red-800 font-mono break-all">
                            {error.message}
                        </p>
                    </div>
                )}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-2 rounded-lg transition"
                        style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                    >
                        Try again
                    </button>
                    <a
                        href="/"
                        className="px-6 py-2 bg-gray-200 text-text-primary rounded-lg  transition"
                    >
                        Go home
                    </a>
                </div>
            </div>
        </div>
    )
}
