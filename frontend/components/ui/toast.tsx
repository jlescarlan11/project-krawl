"use client";

import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { Button } from "@/components";
import { cn } from "@/lib/utils";

/**
 * Toast notification system for displaying temporary messages.
 *
 * Provides toast notifications with variants (success, error, warning, info),
 * auto-dismiss functionality, and action buttons.
 *
 * @example
 * ```tsx
 * const { toast } = useToast()
 * toast.success('Gem created successfully!')
 * toast.error('Failed to upload', 'Please try again')
 * ```
 */

export interface Toast {
  id: string;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const MAX_TOASTS = 5;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Clear timeout if exists
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { ...toast, id };

      setToasts((prev) => {
        // Limit maximum toasts
        if (prev.length >= MAX_TOASTS) {
          // Clear timeout for oldest toast
          const oldestId = prev[0]?.id;
          if (oldestId) {
            const timeout = timeoutsRef.current.get(oldestId);
            if (timeout) {
              clearTimeout(timeout);
              timeoutsRef.current.delete(oldestId);
            }
          }
          return [...prev.slice(1), newToast];
        }
        return [...prev, newToast];
      });

      // Auto-dismiss
      const duration = toast.duration ?? 5000;
      if (duration > 0) {
        const timeout = setTimeout(() => {
          dismiss(id);
          timeoutsRef.current.delete(id);
        }, duration);
        timeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    [dismiss]
  );

  const toast = useCallback(
    (toast: Omit<Toast, "id">) => {
      return addToast(toast);
    },
    [addToast]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      return addToast({ variant: "success", title, description });
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      return addToast({ variant: "error", title, description });
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      return addToast({ variant: "warning", title, description });
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      return addToast({ variant: "info", title, description });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, toast, dismiss, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full md:w-auto md:min-w-[400px] pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const variantIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantStyles = {
  success: "border-l-4 border-success",
  error: "border-l-4 border-error",
  warning: "border-l-4 border-warning",
  info: "border-l-4 border-info",
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const IconComponent = variantIcons[toast.variant];

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-lg border border-bg-medium p-4",
        "min-w-[320px] md:min-w-[400px] max-w-md",
        "pointer-events-auto",
        "toast-enter",
        variantStyles[toast.variant]
      )}
      role="alert"
      aria-live={toast.variant === "error" ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3">
        <IconComponent
          className={cn(
            "w-5 h-5 mt-0.5 flex-shrink-0",
            toast.variant === "success" && "text-success",
            toast.variant === "error" && "text-error",
            toast.variant === "warning" && "text-warning",
            toast.variant === "info" && "text-info"
          )}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">
            {toast.title}
          </p>
          {toast.description && (
            <p className="text-sm text-text-secondary mt-1">
              {toast.description}
            </p>
          )}
          {toast.action && (
            <div className="mt-3">
              <Button
                variant="text"
                size="sm"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
              >
                {toast.action.label}
              </Button>
            </div>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
