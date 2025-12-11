"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Generic SuccessScreen Props
 *
 * This component is a shared implementation for both Gem and Krawl success screens.
 * It's designed to be highly configurable through props to support different entity types.
 */
export interface SuccessScreenProps {
  /** Type of entity created ('gem' or 'krawl') */
  entityType: 'gem' | 'krawl';

  /** ID of the created entity */
  entityId: string;

  /** Name of the created entity */
  entityName: string;

  /** Success title (e.g., "Gem Created Successfully!") */
  title: string;

  /** Success message (e.g., "has been submitted and is pending review.") */
  message: string;

  /** Text for the view button (e.g., "View Gem") */
  viewButtonText: string;

  /** Text for the create another button (e.g., "Create Another") */
  createButtonText: string;

  /** Function to clear the form */
  onClearForm: () => void;

  /** Route to navigate to when viewing the entity */
  viewRoute: string;

  /** Route to navigate to when creating another entity */
  createRoute: string;

  /** Optional info message to display below the main message */
  infoMessage?: string;
}

/**
 * SuccessScreen Component
 *
 * A generic component for displaying success screens after entity creation.
 * Supports both Gem and Krawl creation flows.
 *
 * Features:
 * - Success icon and title
 * - Entity name display
 * - Custom success message
 * - View entity button (navigates to detail page)
 * - Create another button (clears form and navigates to create page)
 * - Optional info message (e.g., for review/approval notices)
 * - Responsive button layout
 *
 * @example
 * ```tsx
 * <SuccessScreen
 *   entityType="gem"
 *   entityId="gem-123"
 *   entityName="Beautiful Park"
 *   title="Gem Created Successfully!"
 *   message="has been submitted and is pending review."
 *   viewButtonText="View Gem"
 *   createButtonText="Create Another"
 *   onClearForm={clearForm}
 *   viewRoute="/gems/gem-123"
 *   createRoute="/gems/create"
 *   infoMessage="Your Gem will be visible on the map once it's been verified by our team."
 * />
 * ```
 */
export function SuccessScreen({
  entityType,
  entityId,
  entityName,
  title,
  message,
  viewButtonText,
  createButtonText,
  onClearForm,
  viewRoute,
  createRoute,
  infoMessage,
}: SuccessScreenProps) {
  const router = useRouter();

  const handleViewClick = () => {
    router.push(viewRoute);
  };

  const handleCreateAnother = () => {
    // Clear the form first, then navigate
    onClearForm();
    router.push(createRoute);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
        </div>

        {/* Entity Name & Message */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {entityName}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>

        {/* Optional Info Message */}
        {infoMessage && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {infoMessage}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleViewClick}
            className="flex-1 flex items-center justify-center gap-2"
            variant="primary"
          >
            <Eye className="h-4 w-4" />
            {viewButtonText}
          </Button>
          <Button
            onClick={handleCreateAnother}
            className="flex-1 flex items-center justify-center gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            {createButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
