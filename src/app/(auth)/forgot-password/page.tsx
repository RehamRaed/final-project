'use client';

import { ForgotPasswordForm } from '@/components/ui/auth/forgot-password-form';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-primary">
                        Forgot your password?
                    </h1>
                    <p className="text-text-secondary mt-2">Don&apos;t worry, we&apos;ll help you recover it</p>
                </div>

                <div className="bg-bg backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                    <ForgotPasswordForm />

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-primary font-medium cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
