import 'server-only';
import { createServerSupabase } from "@/lib/supabase/server";
import { Tables } from "@/types/database.types";

type Profile = Tables<'profiles'>;
type Roadmap = Tables<'roadmaps'>;

export async function getFullProfileData(): Promise<{ profile: Profile | null, currentRoadmap: Roadmap | null }> {
    const supabase = await createServerSupabase();
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
        return { profile: null, currentRoadmap: null };
    }

    const { roadmaps, ...restProfile } = profileData;
    const currentRoadmap = (roadmaps as unknown as Roadmap) || null;

    return {
        profile: restProfile as Profile,
        currentRoadmap: currentRoadmap,
    };
}