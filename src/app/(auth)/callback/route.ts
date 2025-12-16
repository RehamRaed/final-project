import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()

        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            // Redirect to login with error
            return NextResponse.redirect(`${origin}/login?error=حدث خطأ في تسجيل الدخول`)
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${origin}/dashboard`)
}
