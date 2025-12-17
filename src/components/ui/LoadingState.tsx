import LoadingSpinner from "./LoadingSpinner";

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
}

export default function LoadingState({
    message = "Loading...",
    fullScreen = false
}: LoadingStateProps) {
    const containerClass = fullScreen
        ? "fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50"
        : "flex flex-col items-center justify-center py-20";

    return (
        <div className={containerClass} role="status" aria-live="polite">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
        </div>
    );
}
