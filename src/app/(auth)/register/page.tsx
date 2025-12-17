import Link from 'next/link'
import { SignupForm } from '@/components/ui/auth/signup-form'
import { OAuthButton } from '@/components/ui/auth/oauth-buttons'
import { UserPlus } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Account | StudyMate',
    description: 'Join StudyMate today and start your personalized learning journey with roadmaps and courses.',
    keywords: ['register', 'sign up', 'create account', 'StudyMate', 'join'],
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                 
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-primary">
                        Create a New Account
                    </h1>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                    <SignupForm />

                    <div className="mt-6">
                        <OAuthButton />
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm">
                        <span className="text-text-secondary">Already have an account? </span>
                        <Link
                            href="/login"
                            className="text-text-primary font-semibold"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}