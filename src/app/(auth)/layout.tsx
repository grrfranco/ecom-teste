"use client";
import Image from "next/image";
import Branding from "@/components/layouts/Branding";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
      <div className="relative w-full bg-white">
        <div className="absolute top-0 bottom-0 left-0 right-0">
          <div className="absolute inset-0" />

          <Branding className="absolute left-8 top-8 z-20" />
        </div>
      </div>

      <main className="container bg-white absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
        {children}
      </main>
    </div>
  );
}
