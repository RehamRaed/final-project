import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardPage from "@/components/Dashboard/DashboardPage";
<<<<<<< HEAD
import type { Database } from "@/types/database.types";

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
=======
>>>>>>> 7c8cf06d41b54fa3408dc94f77d4f9b13c266a45

interface DashboardCourse {
    course_id: string;
    title: string;
    summary: string;
    icon?: string;
}

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

    const currentRoadmap = (profile as any)?.roadmaps as Tables<'roadmaps'> | null;

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