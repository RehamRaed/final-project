"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface WelcomeClientProps {
    user: User | null;
    displayName: string;
}

export default function WelcomeClient({ user, displayName }: WelcomeClientProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <h1 className="text-5xl font-extrabold mb-4 text-primary">
                Welcome to StudyMate
            </h1>

            <p className="text-xl mb-10 max-w-lg text-primary-primary">
                Explore roadmaps and build your plan — let's get started!
            </p>

            <Link
                href={user ? "/dashboard" : "/auth/login"}
                className="px-8 py-3 rounded-xl shadow-lg transition font-semibold text-lg"
                style={{
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                }}
            >
                Continue
            </Link>

            {user && (
                <p
                    className="mt-4 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                >
                    Logged in as <span className="font-semibold">{displayName}</span>
                </p>
            )}
        </div>
    );
}
