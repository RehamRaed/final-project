// components/Title/title.tsx
import React from "react";

export default function Title({ title }: { title: string }) {
  return <h1 className="text-2xl font-bold text-gray-900">{title}</h1>;
}
