import Link from 'next/link'
import { LoginForm } from '@/components/ui/auth/login-form'
import { OAuthButton } from '@/components/ui/auth/oauth-buttons'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | StudyMate',
  description: 'Log in to your StudyMate account to continue learning and track your progress.',
  keywords: ['login', 'sign in', 'authentication', 'StudyMate'],
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bgbg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">

          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-primary">
            Log In
          </h1>
        </div>

        <div className=" backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
          <LoginForm />

          <div className="mt-6">
            <OAuthButton />
          </div>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-primary font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm">
            <span className="text-text-secondary">Don&apos;t have an account? </span>
            <Link
              href="/register"
              className="text-text-primary font-semibold"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}