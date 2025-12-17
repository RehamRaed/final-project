import Link from 'next/link'
import { LoginForm } from '@/components/ui/auth/login-form'
import { OAuthButtons } from '@/components/ui/auth/oauth-buttons'
import { LogIn } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | StudyMate',
  description: 'Log in to your StudyMate account to continue learning and track your progress.',
  keywords: ['login', 'sign in', 'authentication', 'StudyMate'],
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Log In
          </h1>
          <p className="text-gray-600 mt-2">Welcome back to StudyMate</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
          <LoginForm />

          <div className="mt-6">
            <OAuthButtons />
          </div>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              href="/register"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}