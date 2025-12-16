"use client";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-bg">
            <div className="text-center">
                <div className="inline-block relative w-20 h-20">
                    <div className="absolute border-4 border-solid rounded-full animate-spin"
                        style={{
                            width: '64px',
                            height: '64px',
                            borderColor: 'var(--primary) transparent transparent transparent',
                            animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
                        }}></div>
                    <div className="absolute border-4 border-solid rounded-full animate-spin"
                        style={{
                            width: '64px',
                            height: '64px',
                            borderColor: 'var(--primary) transparent transparent transparent',
                            animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
                            animationDelay: '-0.45s'
                        }}></div>
                    <div className="absolute border-4 border-solid rounded-full animate-spin"
                        style={{
                            width: '64px',
                            height: '64px',
                            borderColor: 'var(--primary) transparent transparent transparent',
                            animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
                            animationDelay: '-0.3s'
                        }}></div>
                </div>
                <p className="mt-4 text-text-secondary font-medium">Loading...</p>
            </div>
            <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}
