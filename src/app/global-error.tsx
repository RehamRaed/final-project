'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Something went wrong!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We apologize for the inconvenience. An unexpected error occurred.
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
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Try again
                            </button>
                            <a
                                href="/"
                                className="px-6 py-2 bg-gray-200 text-text-primary rounded-lg transition"
                            >
                                Go home
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
