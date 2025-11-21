"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { Spinner } from "@/components";

export default function SignOutPage() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  useEffect(() => {
    signOut();
    router.push(ROUTES.HOME);
  }, [signOut, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-text-secondary">Signing out...</p>
      </div>
    </div>
  );
}

