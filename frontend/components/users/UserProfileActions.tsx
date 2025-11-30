"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components";
import { ROUTES } from "@/lib/routes";
import { useAuthUser } from "@/stores";

interface UserProfileActionsProps {
  userId: string;
}

export function UserProfileActions({ userId }: UserProfileActionsProps) {
  const user = useAuthUser();
  const router = useRouter();

  const isOwner = user?.id === userId;
  if (!isOwner) {
    return null;
  }

  const handleSettings = () => {
    router.push(ROUTES.USER_SETTINGS);
  };

  return (
    <div className="mt-6 flex justify-end">
      <Button variant="secondary" size="sm" onClick={handleSettings}>
        Settings
      </Button>
    </div>
  );
}






