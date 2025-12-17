import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/Dashboard/DashboardLayout'

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, current_roadmap_id')
        .eq('id', user.id)
        .single()

    return (
        <DashboardLayout
            user={{
                id: user.id,
                email: user.email || '',
                fullName: profile?.full_name || user.user_metadata?.full_name || 'Student',
                avatarUrl: profile?.avatar_url || null,
            }}
            currentRoadmapId={profile?.current_roadmap_id}
        >
            {children}
        </DashboardLayout>
    )
}
