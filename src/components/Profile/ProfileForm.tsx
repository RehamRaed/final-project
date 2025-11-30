"use client";

export default function ProfileForm({ profile, isEditing, handleChange }: any) {
  const fields = [
    "firstName",
    "lastName",
    "email",
    "universityMajor",
    "phone",
    "address",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
      {fields.map((field) => (
        <div key={field} className="flex flex-col">
          <label
            className="text-sm font-medium mb-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {field === "universityMajor"
              ? "University Major"
              : field === "phone"
              ? "Phone Number"
              : field === "address"
              ? "Address"
              : field.replace(/([A-Z])/g, " $1")}
          </label>

          <input
            type={field === "email" ? "email" : "text"}
            name={field}
            value={profile[field] ?? ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className="p-3 rounded-lg transition duration-150 focus:outline-none border"
            style={{
              borderColor: isEditing
                ? "var(--color-primary)"
                : "var(--color-border)",
              backgroundColor: "var(--color-card-bg)",
              color: isEditing
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
              cursor: isEditing ? "text" : "default",
            }}
          />
        </div>
      ))}
    </div>
  );
}
