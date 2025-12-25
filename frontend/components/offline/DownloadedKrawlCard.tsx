"use client";

import { Trash2, MapPin, Calendar, HardDrive } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/offline/storageUtils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { KrawlRecord } from "@/lib/offline/schemas";

interface DownloadedKrawlCardProps {
  krawl: KrawlRecord;
  onRemove: (krawlId: string) => Promise<void>;
  isRemoving?: boolean;
}

export function DownloadedKrawlCard({
  krawl,
  onRemove,
  isRemoving = false,
}: DownloadedKrawlCardProps) {
  const handleRemove = async () => {
    if (
      !confirm(
        `Remove "${krawl.data.name}" from downloads? You'll need to download it again to use it offline.`
      )
    ) {
      return;
    }

    await onRemove(krawl.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody className="p-4">
        <div className="flex gap-4">
          {/* Cover Image */}
          {krawl.data.coverImage && (
            <div className="flex-shrink-0">
              <img
                src={krawl.data.coverImage}
                alt={krawl.data.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Link
                  href={ROUTES.KRAWL_DETAIL(krawl.id)}
                  className="block group"
                >
                  <h3 className="font-semibold text-text-primary group-hover:text-primary-green transition-colors truncate">
                    {krawl.data.name}
                  </h3>
                </Link>

                {krawl.data.description && (
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {krawl.data.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-text-secondary">
                  {krawl.data.gems && krawl.data.gems.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{krawl.data.gems.length} Gems</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Downloaded {formatDistanceToNow(new Date(krawl.downloadedAt), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    <span>{formatBytes(krawl.size)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Link href={ROUTES.KRAWL_DETAIL(krawl.id)}>
                  <Button variant="primary" size="sm">
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isRemoving}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}




