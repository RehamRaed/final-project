"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LoginSchema, LoginType } from "@/lib/validation";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginType>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginType>>({});
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setAuthError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    const validation = LoginSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Partial<LoginType> = {};
      validation.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as keyof LoginType] = issue.message;
      });
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result?.error) setAuthError("Login failed. Try test@user.com / 123456");
    else router.push("/roadmap/select");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {authError && <p className="text-red-600">{authError}</p>}
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
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="text-center text-sm mt-2">
        New? <Link href="/signup" className="text-blue-500">Sign up</Link>
      </p>
    </form>
  );
}
