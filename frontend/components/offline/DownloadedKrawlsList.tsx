"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { krawlsDB } from "@/lib/offline/indexedDB";
import { removeDownload } from "@/lib/offline/downloadService";
import { DownloadedKrawlCard } from "./DownloadedKrawlCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import type { KrawlRecord } from "@/lib/offline/schemas";

interface DownloadedKrawlsListProps {
  onRefresh?: () => void;
}

export function DownloadedKrawlsList({ onRefresh }: DownloadedKrawlsListProps) {
  const [krawls, setKrawls] = useState<KrawlRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadKrawls = async () => {
    setIsLoading(true);
    try {
      const downloadedKrawls = await krawlsDB.getAll();
      // Sort by download date (newest first)
      downloadedKrawls.sort(
        (a, b) =>
          new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
      );
      setKrawls(downloadedKrawls);
    } catch (error) {
      console.error("Failed to load downloaded Krawls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKrawls();
  }, []);

  const handleRemove = async (krawlId: string) => {
    setRemovingId(krawlId);
    try {
      await removeDownload(krawlId);
      await loadKrawls();
      onRefresh?.();
    } catch (error) {
      console.error("Failed to remove download:", error);
      alert("Failed to remove download");
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (krawls.length === 0) {
    return (
      <EmptyState
        icon={<Download className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />}
        title="No Downloads"
        description="You haven't downloaded any Krawls for offline use yet. Download Krawls from their detail pages to use them offline."
      />
    );
  }

  return (
    <div className="space-y-4">
      {krawls.map((krawl) => (
        <DownloadedKrawlCard
          key={krawl.id}
          krawl={krawl}
          onRemove={handleRemove}
          isRemoving={removingId === krawl.id}
        />
      ))}
    </div>
  );
}

