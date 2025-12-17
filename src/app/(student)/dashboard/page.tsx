import StudentHomePage from "@/components/Dashboard/DashboardPage";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Define the shape of the data we're fetching
interface RoadmapCourseData {
    course_id: string;
    order_index: number;
    courses: {
        title: string;
        summary: string | null;
        icon: string | null;
    };
}

export default async function StudentPage() {
    const supabase = await createClient();

    // 1. Get User
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect('/login');
    }

    // 2. Fetch Profile and Current Roadmap
    const { data: profile } = await supabase
        .from("profiles")
        .select("current_roadmap_id, roadmaps(*)")
        .eq("id", user.id)
        .single();

    const currentRoadmap = profile?.roadmaps || null;

    // 3. Fetch Courses for the Roadmap (if exists)
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
            // Safe mapping
            const typedCourses = rawCourses as unknown as RoadmapCourseData[];
            courses = typedCourses.map((item) => ({
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
        <StudentHomePage
            user={user}
            currentRoadmap={currentRoadmap}
            courses={courses}
            tasks={tasks || []}
        />
    );
}
