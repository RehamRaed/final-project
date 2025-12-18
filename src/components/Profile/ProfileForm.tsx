"use client";

interface ProfileFormProps {
  profile: any;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function ProfileForm({ profile, isEditing, handleChange }: ProfileFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="w-full">
        <label className="block mb-1 text-sm font-medium text-text-secondary">Full Name</label>
        <input
          type="text"
          name="full_name"
          value={profile.full_name || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 sm:p-3 border border-border rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition"
        />
      </div>

      <div className="w-full">
        <label className="block mb-1 text-sm font-medium text-text-secondary">Department</label>
        <input
          type="text"
          name="department"
          value={profile.department || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 sm:p-3 border border-border rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition"
        />
      </div>

      <div className="w-full">
        <label className="block mb-1 text-sm font-medium text-text-secondary">University ID</label>
        <input
          type="text"
          name="university_id"
          value={profile.university_id || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 sm:p-3 border border-border rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition"
        />
      </div>

      <div className="col-span-1 sm:col-span-2">
        <label className="block mb-1 text-sm font-medium text-text-secondary">Bio</label>
        <textarea
          name="bio"
          value={profile.bio || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 sm:p-3 border border-border rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition"
          rows={4}
        />
      </div>
    </div>
  );
}
