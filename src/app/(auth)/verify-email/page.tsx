import { getCurrentUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'
import VerifyEmailClient from './verify-email-client'

interface UserWithEmailConfirmation {
  id: string
  email: string
  full_name: string
  avatar_url?: string | null
  badges: string[]
  bio?: string | null
  current_roadmap_id?: string | null
  current_semester: number
  department: string
  last_active: string
  xp: number
  email_confirmed_at?: string | null 
  [key: string]: any
}

export default async function VerifyEmailPage() {
  const user: UserWithEmailConfirmation | null = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.email_confirmed_at) {
    redirect('/dashboard')
  }

  return (
    <VerifyEmailClient
      email={user.email || ''}
      emailVerified={!!user.email_confirmed_at}
    />
  )
}
