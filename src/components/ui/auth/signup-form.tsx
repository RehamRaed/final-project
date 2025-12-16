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
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
      setError(result.error || 'Registration failed')
    }
  }

  function getPasswordStrength(pass: string): { text: string, color: string, width: string } {
    if (pass.length === 0) return { text: '', color: '', width: '0%' }
    if (pass.length < 8) return { text: 'Weak', color: 'bg-red-500', width: '33%' }
    if (pass.length < 12) return { text: 'Medium', color: 'bg-yellow-500', width: '66%' }
    return { text: 'Strong', color: 'bg-green-500', width: '100%' }
  }

  const strength = getPasswordStrength(password)

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block font-semibold mb-2 text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          placeholder="John Doe"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
          minLength={4}
        />
      </div>

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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
          minLength={8}
        />

        {password && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Password Strength:</span>
              <span className={`font-semibold ${strength.color.replace('bg-', 'text-')}`}>
                {strength.text}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300`}
                style={{ width: strength.width }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block font-semibold mb-2 text-gray-700">
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
        />
      </div>

      <SubmitButton />
    </form>
  )
}
