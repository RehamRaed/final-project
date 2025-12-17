import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
    title?: string;
    message: string;
    details?: string;
    fullScreen?: boolean;
    onRetry?: () => void;
}

export default function ErrorState({
    title = "Error",
    message,
    details,
    fullScreen = false,
    onRetry
}: ErrorStateProps) {
    const containerClass = fullScreen
        ? "fixed inset-0 flex items-center justify-center bg-bg backdrop-blur-sm z-50"
        : "py-20";

    return (
        <div className={containerClass} role="alert" aria-live="assertive">
            <div className="max-w-md mx-auto text-center px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-lg text-gray-700 mb-4">{message}</p>

                {details && (
                    <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {details}
                    </p>
                )}

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}
