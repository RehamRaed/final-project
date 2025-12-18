import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardPage from "@/components/Dashboard/DashboardPage";

export default async function StudentPage() {
    const supabase = await createClient();

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

    interface DashboardCourse {
        course_id: string;
        title: string;
        summary: string;
        icon?: string;
    }
    let courses: DashboardCourse[] = [];
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
            courses = rawCourses.map(item => {
                const course = item.courses as unknown as { title: string; summary: string | null; icon: string | null };
                return {
                    course_id: item.course_id,
                    title: course.title,
                    summary: course.summary || '',
                    icon: course.icon || undefined,
                };
            });
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
