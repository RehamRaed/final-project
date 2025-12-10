'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { SignupSchema, SignupType } from '@/lib/validators'

export default function SignUpForm() {
  const [form, setForm] = useState<SignupType>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (field: keyof SignupType, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async () => {
    try {
      const parsed = SignupSchema.parse(form)
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email: parsed.email,
        password: parsed.password,
        options: { data: { full_name: parsed.name } }
      })
      setLoading(false)
      if (error) setMessage(error.message)
      else window.location.href = '/roadmaps'
    } catch (err: any) {
      if (err?.issues?.length) {
        setMessage(err.issues[0].message)
      } else if (err?.message) {
        setMessage(err.message)
      }
    }
  }

  

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: process.env.NEXT_PUBLIC_APP_URL }
    })
    setLoading(false)
    if (error) setMessage(error.message)
  }

  return (
    <div className="card max-w-md mx-auto mt-20 space-y-3 text-center">
      <h2 className="text-2xl font-bold" style={{  color: "var(--color-primary)" }}>
        Create Account
      </h2>

      <input
        type="text"
        placeholder="Full Name"
        value={form.name}
        onChange={e => handleChange('name', e.target.value)}
        className="border p-3 w-full rounded focus:ring-2 focus:outline-none"
        style={{ borderColor: "var(--color-border)" }}
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => handleChange('email', e.target.value)}
        className="border p-3 w-full rounded focus:ring-2 focus:outline-none"
        style={{ borderColor: "var(--color-border)" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => handleChange('password', e.target.value)}
        className="border p-3 w-full rounded focus:ring-2 focus:outline-none"
        style={{ borderColor: "var(--color-border)" }}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={e => handleChange('confirmPassword', e.target.value)}
        className="border p-3 w-full rounded focus:ring-2 focus:outline-none"
        style={{ borderColor: "var(--color-border)" }}
      />

      <div className="h-4 text-red-500 text-sm">{message}</div>

      <button
        onClick={handleSignUp}
        disabled={loading}
        className="btn btn-primary w-full"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="btn btn-secondary w-full"
      >
        Continue with Google
      </button>

      <p className="text-secondary text-sm">
        Already have an account?
        <Link href="/auth/login" className="ml-1 font-semibold">
          Sign In
        </Link>
      </p>
    </div>
  )
}
