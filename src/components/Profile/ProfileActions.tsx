"use client";

interface ProfileActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  setIsEditing: (val: boolean) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

export default function ProfileActions({ isEditing, isSaving, setIsEditing, handleSave, handleCancel }: ProfileActionsProps) {
  return (
    <div className="flex gap-4 mt-4">
      {isEditing ? (
        <>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}
