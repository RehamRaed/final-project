// profile.service.ts
import 'server-only';
import { createClient } from "@/lib/supabase/server"; // يفترض وجود عميل للسيرفر
import { Tables, Database } from "@/types/database.types"; // استيراد الأنواع

type Profile = Tables<'profiles'>;
type Roadmap = Tables<'roadmaps'>;


export async function getFullProfileData(): Promise<{ profile: Profile | null, currentRoadmap: Roadmap | null }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { profile: null, currentRoadmap: null };
    }

    const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*, roadmaps(title)")
        .eq("id", user.id)
        .single();

    if (error || !profileData) {
        console.error("Error fetching profile:", error);
        return { profile: null, currentRoadmap: null };
    }

    const { roadmaps, ...restProfile } = profileData;
    const currentRoadmap = (roadmaps as Pick<Roadmap, 'title'>) || null; // التأكد من نوع البيانات

    return {
        profile: restProfile as Profile,
        currentRoadmap: currentRoadmap as Roadmap | null,
    };
}