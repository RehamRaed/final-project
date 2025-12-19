import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardPage from "@/components/Dashboard/DashboardPage";

export default async function StudentPage() {
    const supabase = await createServerSupabase();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("current_roadmap_id, roadmaps(*)")
        .eq("id", user.id)
        .single();

    const currentRoadmap = profile?.roadmaps || null;

    let courses: any[] = [];
    if (currentRoadmap?.id) {
        const { data: rawCourses } = await supabase
            .from("roadmap_courses")
            .select(`
                course_id,
                order_index,
                courses!inner (
                  title,
                  summary,
                  icon
                )
            `)
            .eq("roadmap_id", currentRoadmap.id)
            .order("order_index");

        if (rawCourses) {
            courses = (rawCourses as any[]).map(item => ({
                course_id: item.course_id,
                title: item.courses.title,
                summary: item.courses.summary || '',
                icon: item.courses.icon || undefined,
            }));
        }
    }

    const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .order('due_date', { ascending: true })
        .limit(5);

    return (
        <DashboardPage
            user={user}
            currentRoadmap={currentRoadmap}
            courses={courses}
            tasks={tasks || []}
        />
    );
}
