'use client'

import { resendVerificationEmail, logout } from '@/actions/auth'
import { Mail, ArrowRight, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface VerifyEmailClientProps {
    email: string
    emailVerified: boolean
}
// بده نقل ع مكان احسن 
export default function VerifyEmailClient({ email, emailVerified }: VerifyEmailClientProps) {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleResend() {
        setLoading(true)
        setMessage(null)

        const result = await resendVerificationEmail()

        setLoading(false)

        if (result.success) {
            setMessage({ type: 'success', text: result.message || 'Verification email sent' })
        } else {
            setMessage({ type: 'error', text: result.error || 'An error occurred' })
        }
    }

    async function handleLogout() {
        await logout()
    }

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 5000)

        return () => clearInterval(interval)
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                        <Mail className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Verify Your Email
                    </h1>
                    <p className="text-gray-600">
                        We sent a verification email to:
                    </p>
                    <p className="text-indigo-600 font-semibold mt-1">
                        {email}
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                    {message && (
                        <div
                            className={`mb-6 px-4 py-3 rounded-xl text-sm ${message.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4 text-center">
                        <p className="text-gray-700">
                            Click the link in the email to activate your account and start using StudyMate.
                        </p>

                        <p className="text-sm text-gray-500">
                            Didn&apos;t receive the email? Check your spam folder.
                        </p>

                        <button
                            onClick={handleResend}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <ArrowRight className="w-5 h-5" />
                            {loading ? 'Sending...' : 'Resend Verification Email'}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    This page will automatically refresh when your email is verified
                </p>
            </div>
        </div>
    )
}
