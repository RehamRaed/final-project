import type { Metadata } from 'next';
import { createServerSupabase } from "@/lib/supabase/server";
import WelcomeClient from "@/components/WelcomeClient";

export const metadata: Metadata = {
  title: 'Welcome',
  description: 'Welcome to StudyMate - Your personal learning companion',
};

export default async function WelcomePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Student";

  return <WelcomeClient user={user} displayName={displayName} />;
}
