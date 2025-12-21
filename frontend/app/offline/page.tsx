"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { ProtectedRoute } from "@/components/navigation";
import { StorageUsage } from "@/components/offline/StorageUsage";
import { DownloadedKrawlsList } from "@/components/offline/DownloadedKrawlsList";
import { useStorageUsage } from "@/hooks/useStorageUsage";

export default function OfflinePage() {
  const { refresh: refreshStorage } = useStorageUsage();

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Offline Downloads
            </h1>
            <p className="text-text-secondary">
              Manage your downloaded Krawls for offline use
            </p>
          </div>

          <StorageUsage />

          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Downloaded Krawls
            </h2>
            <DownloadedKrawlsList onRefresh={refreshStorage} />
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
