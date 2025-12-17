import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/ui/auth/forgot-password-form'
import { KeyRound, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                   
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-primary">
                        Forgot your password?
                    </h1>
                    <p className="text-gray-600 mt-2">Don't worry, we'll help you recover it</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                    <ForgotPasswordForm />

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-primary font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
