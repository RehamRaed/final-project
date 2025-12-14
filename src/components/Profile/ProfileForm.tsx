"use client";

export default function ProfileForm({ profile, isEditing, handleChange }: any) {
  const fields = [
    { name: "full_name", label: "Full Name" },
    { name: "email", label: "Email", readOnly: true },
    { name: "university_id", label: "University ID" },
    { name: "department", label: "Department" },
    { name: "bio", label: "Bio", textarea: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
      {fields.map(({ name, label, readOnly, textarea }) => (
        <div key={name} className="flex flex-col">
          <label className="text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>{label}</label>
          {textarea ? (
            <textarea
              name={name}
              value={profile[name] ?? ""}
              onChange={handleChange}
              readOnly={!isEditing}
              disabled={!isEditing}
              rows={4}
              className="p-3 rounded-lg transition duration-150 focus:outline-none"
              style={{
                border: "1px solid",
                borderColor: isEditing ? "#3B82F6" : "var(--color-border)",
                backgroundColor: "var(--color-card-bg)",
                color: isEditing ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                cursor: isEditing ? "text" : "not-allowed",
              }}
            />
          ) : (
            <input
              type={name === "email" ? "email" : "text"}
              name={name}
              value={profile[name] ?? ""}
              onChange={handleChange}
              readOnly={!isEditing || readOnly}
              disabled={!isEditing || readOnly}
              className="p-3 rounded-lg transition duration-150 focus:outline-none"
              style={{
                border: "1px solid",
                borderColor: isEditing && !readOnly ? "#3B82F6" : "var(--color-border)",
                backgroundColor: "var(--color-card-bg)",
                color: !isEditing || readOnly ? "var(--color-text-secondary)" : "var(--color-text-primary)",
                cursor: !isEditing || readOnly ? "not-allowed" : "text",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
