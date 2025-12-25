import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createServerSupabase();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const { data: { user } } = await supabase.auth.getUser();

            const userMetadata = user?.user_metadata || {};
            const hasSelectedRoadmap = userMetadata.has_selected_roadmap as boolean ?? false;

            if (hasSelectedRoadmap) {
                return NextResponse.redirect(`${origin}/dashboard`);
            } else {
                return NextResponse.redirect(`${origin}/`);
            }
        } else {
            return NextResponse.redirect(
                `${origin}/login?error=Authentication failed. Please try again.`
            );
        }
    }

    return NextResponse.redirect(`${origin}/login`);
}