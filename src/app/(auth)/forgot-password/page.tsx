import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/ui/auth/forgot-password-form'
import { KeyRound, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Forgot your password?
                    </h1>
                    <p className="text-gray-600 mt-2">Don't worry, we'll help you recover it</p>
                </div>

                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                    <ForgotPasswordForm />

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
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
