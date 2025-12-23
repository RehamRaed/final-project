'use client'

import { login } from '@/actions/auth'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full cursor-pointer bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={pending ? 'Logging in, please wait' : 'Log in to your account'}
        >
            {pending ? 'Logging in...' : 'Login'}
        </button>
    )
}

export function LoginForm() {
    const searchParams = useSearchParams()
    const urlError = searchParams?.get('error')
    const [formError, setFormError] = useState<string>(urlError ?? '')

    async function handleSubmit(formData: FormData) {
        setFormError('')
        const result = await login(formData)

        if (result && !result.success) {
            setFormError(result.error ?? result.message ?? 'Login failed')
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4" aria-label="Login form">
            {formError && (
                <div
                    id="login-error"
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                    role="alert"
                    aria-live="assertive"
                >
                    {formError}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block font-semibold mb-2 text-text-primary">
                    Email 
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@domain.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    aria-required="true"
                    aria-describedby={formError ? 'login-error' : undefined}
                    autoComplete="email"
                />
            </div>

            <div>
                <label htmlFor="password" className="block font-semibold mb-2 text-text-primary">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    aria-required="true"
                    aria-describedby={formError ? 'login-error' : undefined}
                    autoComplete="current-password"
                />
            </div>

            <SubmitButton />
        </form>
    )
}
