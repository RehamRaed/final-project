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
      className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold hover:shadow-xl  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed "
      aria-label={pending ? 'Creating account, please wait' : 'Create your account'}
    >
      {pending ? 'Creating account...' : 'Create Account'}
    </button>
  )
}

export function SignupForm() {
  const [error, setError] = useState<string>('')
  const [password, setPassword] = useState('')

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
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block font-semibold mb-2 text-text-primary">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          placeholder="John Doe"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
          minLength={4}
          aria-required="true"
          autoComplete="name"
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
          minLength={8}
          aria-required="true"
          aria-describedby="password-strength"
          autoComplete="new-password"
        />

        
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block font-semibold mb-2 text-text-primary">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
          minLength={8}
          aria-required="true"
          autoComplete="new-password"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
