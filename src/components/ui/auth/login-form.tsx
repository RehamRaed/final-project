'use client'

import { login } from '@/actions/auth'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
            {pending ? 'Logging in...' : 'Login'}
        </button>
    )
}

export function LoginForm() {
    const [error, setError] = useState<string>('')

    async function handleSubmit(formData: FormData) {
        setError('')
        const result = await login(formData)

        if (result && !result.success) {
            setError(result.error || 'Login failed')
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block font-semibold mb-2 text-gray-700">
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@domain.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                />
            </div>

            <div>
                <label htmlFor="password" className="block font-semibold mb-2 text-gray-700">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                />
            </div>

            <SubmitButton />
        </form>
    )
}