'use client'

import { register } from '@/actions/auth'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Creating account...' : 'Create Account'}
    </button>
  )
}

export function SignupForm() {
  const [error, setError] = useState<string>('')

  async function handleSubmit(formData: FormData) {
    setError('')
    const result = await register(formData)

    if (result && !result.success) {
      setError(result.error ?? result.message ?? 'Registration failed')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4" aria-label="Registration form">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm" role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block font-semibold mb-2">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
          minLength={2}
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-semibold mb-2">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block font-semibold mb-2">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
          minLength={8}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block font-semibold mb-2">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
          minLength={8}
        />
      </div>

      <SubmitButton />
    </form>
  )
}
