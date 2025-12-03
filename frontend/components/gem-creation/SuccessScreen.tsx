"use client";

import { CheckCircle, Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useGemCreationStore } from "@/stores/gem-creation-store";

/**
 * Props for SuccessScreen component
 */
export interface SuccessScreenProps {
  gemId: string;
  gemName: string;
}

/**
 * SuccessScreen Component
 *
 * Displays success message after gem creation with options to:
 * - View the created gem
 * - Create another gem
 *
 * Features:
 * - Success message with gem name
 * - View Gem button (navigates to gem detail page)
 * - Create Another button (resets form and starts new creation)
 * - Mobile-responsive design
 */
export function SuccessScreen({ gemId, gemName }: SuccessScreenProps) {
  const router = useRouter();
  const { clearForm } = useGemCreationStore();

  /**
   * Handle viewing the created gem
   */
  const handleViewGem = () => {
    router.push(ROUTES.GEM_DETAIL(gemId));
  };

  /**
   * Handle creating another gem
   */
  const handleCreateAnother = () => {
    clearForm();
    // Stay on the same page, but reset to step 0
    // The GemCreationFlow will handle resetting to step 0
    router.push(ROUTES.GEM_CREATE);
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
              Gem Created Successfully!
            </h1>
            <p className="text-base text-text-secondary">
              <span className="font-semibold text-text-primary">{gemName}</span>{" "}
              has been submitted and is pending review.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleViewGem}
              icon={<Eye className="w-5 h-5" />}
              iconPosition="left"
              className="flex-1"
            >
              View Gem
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

          {/* Info Message */}
          <div className="pt-4">
            <p className="text-sm text-text-tertiary">
              Your Gem will be visible on the map once it's been verified by our
              team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



