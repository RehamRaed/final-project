"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignupSchema, SignupType } from "@/lib/validation";

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupType>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<SignupType>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = SignupSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Partial<SignupType> = {};
      validation.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as keyof SignupType] = issue.message;
      });
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    await new Promise((res) => setTimeout(res, 1000));
    router.push("/login?message=AccountCreated");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
      <p className="text-center text-sm mt-2">
        Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
      </p>
    </form>
  );
}
