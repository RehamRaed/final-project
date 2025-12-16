import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-bg px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <h2 className="text-3xl font-semibold text-text-primary mt-4 mb-2">
                    Page Not Found
                </h2>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-lg transition font-semibold"
                        style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
