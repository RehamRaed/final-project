import Link from 'next/link'
import { SignupForm } from '@/components/ui/auth/signup-form'
import { OAuthButtons } from '@/components/ui/auth/oauth-buttons'
import { UserPlus } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Account | StudyMate',
    description: 'Join StudyMate today and start your personalized learning journey with roadmaps and courses.',
    keywords: ['register', 'sign up', 'create account', 'StudyMate', 'join'],
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Create a New Account
                    </h1>
                    <p className="text-gray-600 mt-2">Join StudyMate now</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                    <SignupForm />

                    <div className="mt-6">
                        <OAuthButtons />
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link
                            href="/login"
                            className="text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}