'use server'

import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { ActionResponse } from '@/types/actionResponse';
import { registerSchema, loginSchema } from '@/lib/validators/validation';

const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export async function register(formData: FormData): Promise<ActionResponse<unknown> | void> {
  const supabase = await createServerSupabase();

  const rawData = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const validation = registerSchema.safeParse(rawData);
  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0] || 'Validation error';
    return { success: false, error: firstError };
  }

  const { fullName, email, password } = validation.data;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        has_selected_roadmap: false,
        isNewUser: true, 
      },
      emailRedirectTo: `${getBaseUrl()}/callback?next=/`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message === 'User already registered'
        ? 'This email is already registered'
        : 'Registration failed. Please try again.',
    };
  }

  redirect('/');
}

export async function login(formData: FormData): Promise<ActionResponse<unknown> | void> {
  const supabase = await createServerSupabase();

  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0] || 'Validation error';
    return { success: false, error: firstError };
  }

  const { email, password } = validation.data;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error || !data.user) return { success: false, error: 'Invalid email or password' };

  const userMetadata = data.user.user_metadata || {};
  const hasSelectedRoadmap = userMetadata.has_selected_roadmap as boolean ?? false;

  if (hasSelectedRoadmap) {
    redirect('/dashboard'); 
  } else {
    redirect('/'); 
  }
}

export async function loginWithOAuth(provider: 'google' | 'github'): Promise<ActionResponse<unknown> | void> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getBaseUrl()}/callback`,
    },
  });

  if (error) return { success: false, error: 'Login failed' };
  if (data.url) redirect(data.url);
}

export async function logout(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function forgotPassword(formData: FormData): Promise<ActionResponse<unknown>> {
  const supabase = await createServerSupabase();

  const email = formData.get('email') as string;
  if (!email) return { success: false, error: 'Email is required' };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getBaseUrl()}/auth/callback?next=/reset-password`,
  });

  if (error) return { success: false, error: 'Error sending password reset link' };

  return { success: true, message: 'Password reset link sent to your email' };
}

// ================= RESET PASSWORD =================
export async function resetPassword(formData: FormData): Promise<ActionResponse<unknown>> {
  const supabase = await createServerSupabase()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) return { success: false, error: 'Both fields are required' }
  if (password !== confirmPassword) return { success: false, error: 'Passwords do not match' }

  const { data, error } = await supabase.auth.updateUser({ password })

  if (error) return { success: false, error: error.message }
  if (!data.user) return { success: false, error: 'Failed to reset password' }

  return { success: true, message: 'Password has been reset successfully' }
}

export async function resendVerificationEmail(): Promise<ActionResponse<unknown>> {
  const supabase = await createServerSupabase()

  const { data, error: sessionError } = await supabase.auth.getUser()
  const user = data.user

  if (sessionError || !user || !user.email) {
    return { success: false, error: 'You must be logged in' }
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: user.email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback?next=/verify-email`,
    }
  })

  if (error) return { success: false, error: error.message }

  return { success: true, message: 'Verification email sent' }
}