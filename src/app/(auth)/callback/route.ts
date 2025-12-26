import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const origin = url.origin;

    if (!code) return NextResponse.redirect(`${origin}/login`);

    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(`${origin}/login?error=Authentication failed`);
    }

    const { data: { user } } = await supabase.auth.getUser();
    const userMetadata = user?.user_metadata || {};
    const hasSelectedRoadmap = userMetadata.has_selected_roadmap === true;

    if (hasSelectedRoadmap) {
        return NextResponse.redirect(`${origin}/dashboard`);
    } else {
        return NextResponse.redirect(`${origin}/roadmaps`);
    }
}
