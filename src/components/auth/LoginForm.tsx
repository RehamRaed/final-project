'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { LoginSchema, LoginType } from '@/lib/validators'

export default function SignInForm() {
  const [form, setForm] = useState<LoginType>({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (field: keyof LoginType, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSignIn = async () => {
    try {
      LoginSchema.parse(form)
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      })
      setLoading(false)
      if (error) setMessage(error.message)
      else window.location.href = '/student/roadmaps'
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
      <h2 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Sign In</h2>

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

      <div className="h-4 text-red-500 text-sm">{message}</div>

      <button
        onClick={handleSignIn}
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="btn btn-secondary w-full"
      >
        Continue with Google
      </button>

      <p className="text-secondary text-sm">
        Don't have an account?
        <Link href="/auth/signup" className="ml-1 font-semibold">
          Create one
        </Link>
      </p>
    </div>
  )
}
