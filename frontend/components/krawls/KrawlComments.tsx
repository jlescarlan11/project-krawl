"use client";

import { Comments } from "@/components/shared/Comments";

interface KrawlCommentsProps {
  krawlId: string;
}

export function KrawlComments({ krawlId }: KrawlCommentsProps) {
  return <Comments entityType="krawl" entityId={krawlId} />;
}
