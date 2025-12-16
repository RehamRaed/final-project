"use client";

interface ProfileActionsProps {
  isEditing: boolean;
  handleSave: () => void;
  handleCancel: () => void;
  setIsEditing: (value: boolean) => void;
}

interface ProfileActionsProps {
  isEditing: boolean;
  handleSave: () => void;
  handleCancel: () => void;
  setIsEditing: (value: boolean) => void;
  isSaving: boolean; // إضافة خاصية حالة الحفظ
}

export default function ProfileActions({ isEditing, handleSave, handleCancel, setIsEditing, isSaving }: ProfileActionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-border">
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="px-6 py-3 font-semibold rounded-lg shadow-md flex items-center transition bg-primary text-white hover:opacity-90"
        >
          <i className="fas fa-edit mr-2"></i> Edit Profile
        </button>
      ) : (
        <>
          <button
            onClick={handleSave}
            disabled={isSaving} // تعطيل الزر أثناء الحفظ
            className={`px-6 py-3 rounded-lg shadow-md flex items-center transition ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent text-white hover:opacity-90'}`}
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i> Save Changes
              </>
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={isSaving}
            className={`px-6 py-3 rounded-lg shadow-md flex items-center transition bg-secondary text-white hover:opacity-90 ${isSaving ? 'opacity-50' : ''}`}
          >
            <i className="fas fa-times mr-2"></i> Cancel
          </button>
        </>
      )}
    </div>
  );
}
