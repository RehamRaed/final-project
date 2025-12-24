import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    const next = requestUrl.searchParams.get('next') ?? '/dashboard';
    
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createServerSupabase();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            return NextResponse.redirect(
                `${origin}/login?error=Authentication failed. Please try again.`
            );
        }
    }

    return NextResponse.redirect(`${origin}/login`);
}