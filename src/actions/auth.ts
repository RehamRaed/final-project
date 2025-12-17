'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { TablesUpdate } from '@/types/database.types'


const registerSchema = z.object({
    fullName: z.string().min(4, 'Full name must be at least 4 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
})

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

export async function register(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    }

    const validation = registerSchema.safeParse(rawData)

    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors
        const firstError = Object.values(errors)[0]?.[0] || 'Validation error'
        return { success: false, error: firstError }
    }

    const { fullName, email, password } = validation.data

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
        },
    })

    if (error) {
        return {
            success: false,
            error: error.message === 'User already registered'
                ? 'This email is already registered'
                : 'Registration failed. Please try again.'
        }
    }

    if (!data.user) {
        return { success: false, error: 'Error creating account' }
    }

    redirect('/verify-email')
}


export async function login(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const validation = loginSchema.safeParse(rawData)

    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors
        const firstError = Object.values(errors)[0]?.[0] || 'Validation error'
        return { success: false, error: firstError }
    }

    const { email, password } = validation.data

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return {
            success: false,
            error: 'Invalid email or password'
        }
    }

    if (!data.user) {
        return { success: false, error: 'Login failed' }
    }

    if (!data.user.email_confirmed_at) {
        redirect('/verify-email')
    }

    redirect('/dashboard')
}


export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}


export async function loginWithOAuth(provider: 'google' | 'github') {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
        },
    })

    if (error) {
        return { success: false, error: 'Login failed' }
    }

    if (data.url) {
        redirect(data.url)
    }

    return { success: false, error: 'Login failed' }
}


export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        email: formData.get('email') as string,
    }

    const validation = forgotPasswordSchema.safeParse(rawData)

    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors
        const firstError = Object.values(errors)[0]?.[0] || 'Validation error'
        return { success: false, error: firstError }
    }

    const { email } = validation.data

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
        return {
            success: false,
            error: 'Error sending password reset link'
        }
    }

    return {
        success: true,
        message: 'Password reset link sent to your email'
    }
}


export async function resetPassword(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    }

    const validation = resetPasswordSchema.safeParse(rawData)

    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors
        const firstError = Object.values(errors)[0]?.[0] || 'Validation error'
        return { success: false, error: firstError }
    }

    const { password } = validation.data

    const { error } = await supabase.auth.updateUser({
        password,
    })

    if (error) {
        return {
            success: false,
            error: 'Error resetting password. Link may be invalid or expired.'
        }
    }

    return {
        success: true,
        message: 'Password reset successfully'
    }
}


export async function resendVerificationEmail() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user || !user.email) {
        return {
            success: false,
            error: 'You must be logged in'
        }
    }

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
        },
    })

    if (error) {
        return {
            success: false,
            error: 'Error resending verification email'
        }
    }

    return {
        success: true,
        message: 'Verification email sent'
    }
}


export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const fullName = formData.get('fullName') as string
    const universityId = formData.get('universityId') as string
    const department = formData.get('department') as string

    const profileUpdate: TablesUpdate<'profiles'> = {
        full_name: fullName,
        university_id: universityId || null,
        department: department || null,
    }

    const { error } = await supabase
        .from('profiles')
        .update(profileUpdate) 
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: 'Failed to update profile data.' }
    }

    await supabase.auth.updateUser({
        data: { full_name: fullName } 
    })

    return { success: true, message: 'Profile updated successfully.' }
}