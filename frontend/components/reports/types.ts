/**
 * Type definitions for content reporting functionality
 */

export type ContentType = "GEM" | "KRAWL";

export type ReportReason =
  | "INACCURATE"
  | "COMMERCIAL"
  | "OFFENSIVE"
  | "SPAM"
  | "OTHER";

export interface CreateReportRequest {
  contentType: ContentType;
  contentId: string;
  reason: ReportReason;
  description?: string;
}

export interface ReportResponse {
  id: string;
  contentType: ContentType;
  contentId: string;
  reason: ReportReason;
  description?: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  reviewedAt?: string;
}

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: ContentType;
  contentId: string;
  contentName: string;
}




