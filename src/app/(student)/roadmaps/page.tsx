import { getRoadmapsListAction } from "@/actions/learning.actions";
import RoadmapSelectionClient from "@/components/Roadmap/RoadmapSelectionClient";
import { getCurrentUser } from "@/lib/auth/helpers";
import { Tables } from "@/types/database.types";
import { Metadata } from "next";
import { redirect } from "next/navigation"; 

interface RoadmapWithStatus extends Tables<'roadmaps'> {
  course_count: number;
  is_current: boolean;
  description: string;
  icon: string | null;
}

export const metadata: Metadata = {
  title: 'Roadmap Selection',
  description: 'Choose the roadmap that fits you to start your learning journey and define your career path.',
  keywords: ['roadmap', 'learning', 'courses', 'path selection'],
};

export default async function RoadmapsPage() {
  const user = await getCurrentUser();
  
  if (!user) redirect('/login'); 


  if (user.current_roadmap_id) {
    redirect('/dashboard');
  }

  const result = await getRoadmapsListAction();
  
  if (!result.success) {
    return (
      <main className="pt-25 px-10 max-w-350 mx-auto" aria-live="assertive">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-12">Choose Your Roadmap</h1>
        <div className="text-center text-red-600 p-8 border border-red-300 rounded-lg">
          <p className="text-lg">
            Sorry, an error occurred while fetching the roadmaps. Please try again later.
          </p>
          <p className="text-sm mt-2">Error details: {result.error}</p>
        </div>
      </main>
    );
  }

  const roadmaps: RoadmapWithStatus[] = (result.data as RoadmapWithStatus[]) || [];

  return (
    <main className="pt-20 px-10 max-w-350 mx-auto" aria-label="Roadmap Selection">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-12" tabIndex={0}>
        Choose Your Roadmap
      </h1>
      <RoadmapSelectionClient initialRoadmaps={roadmaps} />
    </main>
  );
}