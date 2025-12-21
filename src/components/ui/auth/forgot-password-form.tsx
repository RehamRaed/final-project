'use client'

import { forgotPassword } from '@/actions/auth'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
            {pending ? 'Sending...' : 'Send Reset Link'}
        </button>
    )
}

export function ForgotPasswordForm() {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    async function handleSubmit(formData: FormData) {
        setMessage(null)
        const result = await forgotPassword(formData)

        if (result && result.success) {
            setMessage({ type: 'success', text: result.message ?? 'Sent successfully' })
        } else if (result) {
            setMessage({ type: 'error', text: result.error ?? result.message ?? 'An error occurred' })
        } else {
            setMessage({ type: 'error', text: 'An error occurred' })
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            {message && (
                <div
                    className={`px-4 py-3 rounded-xl text-sm ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block font-semibold mb-2 text-text-primary ">
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
                <p className="text-sm text-text-secondary mt-2">
                    We will send you a password reset link
                </p>
            </div>

            <SubmitButton />
        </form>
    )
}
