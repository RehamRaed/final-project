"use client";
import LoginForm from "@/components/auth/LoginForm";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login </h2>


      <LoginForm />
    </>
  );
}
