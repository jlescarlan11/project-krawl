"use client";

import { CheckCircle, Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";

/**
 * Props for KrawlSuccessScreen component
 */
export interface KrawlSuccessScreenProps {
  krawlId: string;
  krawlName: string;
}

/**
 * KrawlSuccessScreen Component
 *
 * Displays success message after krawl creation with options to:
 * - View the created krawl
 * - Create another krawl
 *
 * Features:
 * - Success message with krawl name
 * - View Krawl button (navigates to krawl detail page)
 * - Create Another button (resets form and starts new creation)
 * - Mobile-responsive design
 */
export function KrawlSuccessScreen({
  krawlId,
  krawlName,
}: KrawlSuccessScreenProps) {
  const router = useRouter();
  const { clearForm } = useKrawlCreationStore();

  /**
   * Handle viewing the created krawl
   */
  const handleViewKrawl = () => {
    router.push(ROUTES.KRAWL_DETAIL(krawlId));
  };

  /**
   * Handle creating another krawl
   */
  const handleCreateAnother = () => {
    clearForm();
    // Stay on the same page, but reset to step 0
    // The KrawlCreationFlow will handle resetting to step 0
    router.push(ROUTES.KRAWL_CREATE);
  };

  return (
    <div className="flex flex-col h-dvh bg-bg-white">
      {/* Content Area - Centered */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text-primary">
              Krawl Created Successfully!
            </h1>
            <p className="text-base text-text-secondary">
              <span className="font-semibold text-text-primary">
                {krawlName}
              </span>{" "}
              has been created and is now available for others to discover.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleViewKrawl}
              icon={<Eye className="w-5 h-5" />}
              iconPosition="left"
              className="flex-1"
            >
              View Krawl
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleCreateAnother}
              icon={<Plus className="w-5 h-5" />}
              iconPosition="left"
              className="flex-1"
            >
              Create Another
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}







