/**
 * Component Library - Barrel Exports
 *
 * This file exports all UI components for easy importing.
 *
 * @example
 * ```tsx
 * import { Button, Card, Input } from '@/components'
 * ```
 */

// Button component
export { Button, type ButtonProps } from "./ui/button";

// Card components
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardActions,
  type CardProps,
} from "./ui/card";

// Form components
export { Input, type InputProps } from "./ui/input";
export { Textarea, type TextareaProps } from "./ui/textarea";
export { Select, type SelectProps, type SelectOption } from "./ui/select";
export { Checkbox, type CheckboxProps } from "./ui/checkbox";
export { Radio, type RadioProps } from "./ui/radio";
export { FileUpload, type FileUploadProps } from "./ui/file-upload";

// State components
export { Spinner, type SpinnerProps } from "./ui/spinner";
export {
  LoadingSkeleton,
  type LoadingSkeletonProps,
} from "./ui/loading-skeleton";
export { ProgressBar, type ProgressBarProps } from "./ui/progress-bar";
export { EmptyState, type EmptyStateProps } from "./ui/empty-state";
export { ErrorDisplay, type ErrorDisplayProps } from "./ui/error-display";
export { ToastProvider, useToast, type Toast } from "./ui/toast";

// Layout components
export {
  Container,
  Section,
  PageLayout,
  type ContainerProps,
  type SectionProps,
  type PageLayoutProps,
} from "./layout";

// Landing components
export { FeaturedKrawlsCarousel } from "./landing";

// Guest helpers
export {
  ProtectedActionGate,
  type ProtectedActionGateProps,
  type ProtectedActionGateRenderProps,
  ProtectedFeatureBadge,
  type ProtectedFeatureBadgeProps,
  type ProtectedFeatureBadgeVariant,
} from "./guest";

// Map components
export {
  Map,
  MapLoadingState,
  MapErrorState,
  MapWithBoundary,
  LocationPicker,
  useBoundaryLayer,
  type MapProps,
  type MapWithBoundaryProps,
  type LocationPickerProps,
  type BoundaryLayerOptions,
  type MapError,
  type MapErrorCode,
  type MapState,
  type MapRef,
  type ControlPosition,
  type CebuBounds,
  type MapConfig,
} from "./map";
