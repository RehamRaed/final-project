import { getFullProfileData } from "@/services/profile.service";
import NewProfileClientWrapper from "@/components/Profile/NewProfileClientWrapper";

export default async function ProfilePage() {
  const { profile, currentRoadmap } = await getFullProfileData();

  if (!profile) {
    return <div className="p-10 text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <NewProfileClientWrapper initialProfile={profile} currentRoadmapTitle={currentRoadmap?.title || "Not selected"} />
    </div>
  );
}