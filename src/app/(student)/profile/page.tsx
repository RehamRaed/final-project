import { getFullProfileData } from "@/services/profile.service";
import ProfileClientWrapper from "@/components/Profile/ProfileClientWrapper"; // <--- هذا هو الكمبوننت الجديد

export default async function ProfilePage() {
  const { profile, currentRoadmap } = await getFullProfileData();

  if (!profile) {
    return <div className="p-10 text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProfileClientWrapper 
        initialProfile={profile} 
        currentRoadmapTitle={currentRoadmap?.title || "Not selected"} 
      />
    </div>
  );
}
