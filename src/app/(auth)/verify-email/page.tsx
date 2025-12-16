import { getCurrentUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'
import VerifyEmailClient from './verify-email-client'

export default async function VerifyEmailPage() {
    const user = await getCurrentUser()

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
