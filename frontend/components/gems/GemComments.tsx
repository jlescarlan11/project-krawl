"use client";

import { Comments } from "@/components/shared/Comments";

interface GemCommentsProps {
  gemId: string;
}

export function GemComments({ gemId }: GemCommentsProps) {
  return <Comments entityType="gem" entityId={gemId} />;
}
