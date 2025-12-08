"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Gem, Navigation } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ProtectedActionGate } from "@/components/guest";

interface CreateMenuProps {
  /**
   * Variant determines the visual style and layout
   * - "header": For Header navigation (horizontal, text button)
   * - "sidebar": For Sidebar navigation (icon-only, vertical)
   * - "mobile": For BottomNav (icon button, shows modal/bottom sheet)
   */
  variant?: "header" | "sidebar" | "mobile";
  /**
   * Custom className for the trigger button
   */
  className?: string;
}

/**
 * CreateMenu component
 * 
 * Shows a dropdown menu with options to create a Gem or Krawl.
 * Handles guest users by showing sign-in prompt.
 * 
 * @example
 * ```tsx
 * <CreateMenu variant="header" />
 * <CreateMenu variant="sidebar" />
 * <CreateMenu variant="mobile" />
 * ```
 */
export function CreateMenu({ variant = "header", className }: CreateMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [arrowLeft, setArrowLeft] = useState(0);
  const [tooltipHovered, setTooltipHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [guestTooltipHovered, setGuestTooltipHovered] = useState(false);
  const [guestTooltipPosition, setGuestTooltipPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const guestButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Track mount state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate tooltip position for sidebar variant (authenticated)
  useLayoutEffect(() => {
    if (tooltipHovered && variant === "sidebar" && triggerRef.current && !isOpen) {
      const updatePosition = () => {
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          const sidebarGap = 16;
          setTooltipPosition({
            top: rect.top + rect.height / 2,
            left: rect.right + sidebarGap,
          });
        }
      };
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [tooltipHovered, variant, isOpen]);

  // Calculate tooltip position for sidebar variant (guest)
  useLayoutEffect(() => {
    if (guestTooltipHovered && variant === "sidebar" && guestButtonRef.current) {
      const updatePosition = () => {
        if (guestButtonRef.current) {
          const rect = guestButtonRef.current.getBoundingClientRect();
          const sidebarGap = 16;
          setGuestTooltipPosition({
            top: rect.top + rect.height / 2,
            left: rect.right + sidebarGap,
          });
        }
      };
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [guestTooltipHovered, variant]);

  // Calculate menu position based on trigger button position
  // Use useLayoutEffect to calculate position synchronously before paint to prevent visual jump
  useLayoutEffect(() => {
    if (isOpen && (variant === "sidebar" || variant === "header") && triggerRef.current) {
      const updatePosition = () => {
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          if (variant === "sidebar") {
            // Position menu aligned with the top of the button, to the right
            // Arrow will be positioned at top-6 (24px) which aligns with button center
            const sidebarGap = 16; // Increased gap for better separation
            setMenuPosition({
              top: rect.top,
              left: rect.right + sidebarGap, // Gap between button and menu
            });
          } else if (variant === "header") {
            // Position menu below the button, slightly offset to the right
            // Arrow will be positioned at top-0 to point to the button
            const buttonCenter = rect.left + rect.width / 2;
            const menuLeftOffset = 12; // Offset menu to the right
            setMenuPosition({
              top: rect.bottom + 8, // 8px gap below button
              left: rect.left + menuLeftOffset, // Offset to the right
            });
            // Calculate arrow position relative to menu's left edge
            // Arrow should point to button center
            setArrowLeft(buttonCenter - (rect.left + menuLeftOffset));
          }
        }
      };

      // Calculate position immediately (synchronously before paint)
      updatePosition();
      
      // Update on scroll/resize (these can use regular event listeners)
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    } else if (!isOpen) {
      // Reset position when closed to prevent stale position on next open
      setMenuPosition({ top: 0, left: 0 });
      setArrowLeft(0);
    }
  }, [isOpen, variant]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      // Use a slight delay to avoid immediate close on click
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  const handleCreateGem = () => {
    setIsOpen(false);
    router.push(ROUTES.GEM_CREATE);
  };

  const handleCreateKrawl = () => {
    setIsOpen(false);
    router.push(ROUTES.KRAWL_CREATE);
  };

  // Trigger button styles based on variant
  const triggerClasses = {
    header: cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
      "text-base font-medium transition-colors",
      "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2",
      "text-text-primary hover:bg-light-green/10 hover:text-primary-green",
      className
    ),
    sidebar: cn(
      "flex items-center justify-center px-3 py-3 rounded-xl",
      "text-base font-medium transition-all duration-200",
      "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2",
      "text-text-primary hover:bg-primary-green/10 hover:text-primary-green hover:scale-105 active:scale-95",
      "w-full justify-center",
      className
    ),
    mobile: cn(
      "flex flex-col items-center justify-center",
      "w-14 h-14 rounded-full",
      "bg-primary-green text-white",
      "shadow-elevation-2 hover:shadow-elevation-3",
      "transition-all",
      className
    ),
  };

  // Menu dropdown styles
  const menuClasses = {
    header: "", // Will be applied inline with dynamic positioning via portal
    sidebar: "", // Will be applied inline with dynamic positioning
    mobile: cn(
      "fixed inset-x-0 bottom-0 z-[1300]",
      "bg-bg-white rounded-t-2xl shadow-elevation-4",
      "border-t border-[var(--color-border-subtle)]",
      "p-4 pb-safe",
      "animate-in slide-in-from-bottom duration-300"
    ),
  };

  return (
    <ProtectedActionGate
      context="create"
      message="Sign in to unlock creator tools"
      promptOptions={{
        redirectTo: ROUTES.GEM_CREATE,
        preserveFilters: false,
      }}
    >
      {({ isGuest, requestSignIn, promptId, promptMessage, Prompt }) => {
        if (isGuest) {
          // Guest user - show sign-in button
          if (variant === "mobile") {
            return (
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => requestSignIn()}
                  aria-describedby={promptId}
                  title={promptMessage}
                  aria-disabled="true"
                  className={cn(
                    "flex flex-col items-center justify-center",
                    "w-14 h-14 rounded-full",
                    "bg-primary-green text-white",
                    "shadow-elevation-2",
                    "transition-all",
                    "opacity-70"
                  )}
                  aria-label="Sign in to create"
                >
                  <Plus className="w-6 h-6" aria-hidden="true" />
                </button>
                <span className="sr-only">{Prompt}</span>
              </div>
            );
          }

          if (variant === "sidebar") {
            return (
              <>
                <button
                  ref={guestButtonRef}
                  type="button"
                  className={triggerClasses.sidebar}
                  onClick={() => requestSignIn()}
                  onMouseEnter={() => setGuestTooltipHovered(true)}
                  onMouseLeave={() => setGuestTooltipHovered(false)}
                  aria-describedby={promptId}
                >
                  <Plus className="w-5 h-5 shrink-0" />
                </button>
                <span className="sr-only">{Prompt}</span>
                {guestTooltipHovered && mounted && (
                  createPortal(
                    <div
                      className={cn(
                        "fixed z-[1000]",
                        "bg-bg-white rounded-lg shadow-elevation-3",
                        "border border-[var(--color-border-subtle)]",
                        "px-3 py-2",
                        "text-sm font-medium text-text-primary",
                        "whitespace-nowrap"
                      )}
                      style={{
                        top: `${guestTooltipPosition.top}px`,
                        left: `${guestTooltipPosition.left}px`,
                        transform: "translateY(-50%)",
                      }}
                      role="tooltip"
                      aria-hidden="true"
                    >
                      <div
                        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 flex items-center"
                        aria-hidden="true"
                      >
                        <div
                          className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-bg-white"
                        />
                      </div>
                      {promptMessage}
                    </div>,
                    document.body
                  )
                )}
              </>
            );
          }

          // Header variant
          return (
            <div className="flex flex-col items-start gap-1">
              <button
                type="button"
                className={triggerClasses.header}
                onClick={() => requestSignIn()}
                aria-describedby={promptId}
                title={promptMessage}
              >
                <span>Create</span>
              </button>
              <span className="sr-only">{Prompt}</span>
            </div>
          );
        }

        // Authenticated user - show menu
        return (
          <>
            <div className={variant === "sidebar" || variant === "header" ? undefined : "relative"}>
              <button
                ref={triggerRef}
                type="button"
                className={triggerClasses[variant]}
                onMouseEnter={() => variant === "sidebar" && !isOpen && setTooltipHovered(true)}
                onMouseLeave={() => variant === "sidebar" && setTooltipHovered(false)}
                onClick={() => {
                  if (!isOpen && triggerRef.current) {
                    // Calculate position synchronously before opening to prevent visual jump
                    const rect = triggerRef.current.getBoundingClientRect();
                    if (variant === "header") {
                      const buttonCenter = rect.left + rect.width / 2;
                      const menuLeftOffset = 12; // Offset menu to the right
                      setMenuPosition({
                        top: rect.bottom + 8,
                        left: rect.left + menuLeftOffset,
                      });
                      setArrowLeft(buttonCenter - (rect.left + menuLeftOffset));
                    } else if (variant === "sidebar") {
                      const sidebarGap = 16; // Increased gap for better separation
                      setMenuPosition({
                        top: rect.top,
                        left: rect.right + sidebarGap,
                      });
                    }
                  }
                  setIsOpen(!isOpen);
                  setTooltipHovered(false); // Hide tooltip when menu opens
                }}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Create menu"
              >
                {variant === "mobile" ? (
                  <Plus className="w-6 h-6" aria-hidden="true" />
                ) : variant === "sidebar" ? (
                  <Plus className="w-5 h-5 shrink-0" />
                ) : (
                  <span>Create</span>
                )}
              </button>

              {/* Render menu */}
              {isOpen && (
                <>
                  {/* Backdrop for mobile */}
                  {variant === "mobile" && (
                    <div
                      className="fixed inset-0 bg-black/50 z-[1200]"
                      onClick={() => setIsOpen(false)}
                      aria-hidden="true"
                    />
                  )}

                  {/* Menu */}
                  {(variant === "sidebar" || variant === "header") && mounted ? (
                    createPortal(
                      <div
                        ref={menuRef}
                        className={cn(
                          "fixed z-[1000]",
                          "bg-bg-white rounded-lg shadow-elevation-3",
                          "border border-[var(--color-border-subtle)]",
                          variant === "header" ? "min-w-[200px]" : "min-w-[280px]",
                          "py-2 px-2"
                          // No animation - instant pop up
                        )}
                        style={{
                          top: `${menuPosition.top}px`,
                          left: `${menuPosition.left}px`,
                        }}
                      >
                        {/* Arrow pointer pointing to the Create icon/button */}
                        {variant === "header" ? (
                          <div
                            className="absolute top-0 -translate-y-full flex items-center"
                            aria-hidden="true"
                            style={{ left: `${arrowLeft}px` }}
                          >
                            {/* Arrow fill */}
                            <div
                              className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-bg-white"
                            />
                          </div>
                        ) : (
                          <div
                            className="absolute left-0 top-6 -translate-x-full flex items-center"
                            aria-hidden="true"
                          >
                            {/* Arrow fill */}
                            <div
                              className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-bg-white"
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={handleCreateGem}
                            className={cn(
                              "flex items-center gap-3 px-3 py-3 text-left",
                              "text-base font-medium text-text-primary",
                              "hover:bg-light-green/10 hover:text-primary-green",
                              "transition-colors rounded-lg",
                              "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2"
                            )}
                            aria-label="Create Gem"
                          >
                            <Gem className="w-5 h-5 shrink-0 text-primary-green" />
                            <div className="flex flex-col">
                              <span>Create Gem</span>
                              <span className="text-sm text-text-secondary">
                                Add a new location
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={handleCreateKrawl}
                            className={cn(
                              "flex items-center gap-3 px-3 py-3 text-left",
                              "text-base font-medium text-text-primary",
                              "hover:bg-light-green/10 hover:text-primary-green",
                              "transition-colors rounded-lg",
                              "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2"
                            )}
                            aria-label="Create Krawl"
                          >
                            <Navigation className="w-5 h-5 shrink-0 text-primary-green" />
                            <div className="flex flex-col">
                              <span>Create Krawl</span>
                              <span className="text-sm text-text-secondary">
                                Build a trail route
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>,
                      document.body
                    )
                  ) : (
                    <div ref={menuRef} className={menuClasses[variant]}>
                      {variant === "mobile" && (
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-text-primary">
                            Create
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-text-secondary hover:text-text-primary"
                            aria-label="Close menu"
                          >
                            <Plus className="w-5 h-5 rotate-45" />
                          </button>
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={handleCreateGem}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-left",
                            "text-base font-medium text-text-primary",
                            "hover:bg-light-green/10 hover:text-primary-green",
                            "transition-colors rounded-lg",
                            "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2"
                          )}
                          aria-label="Create Gem"
                        >
                          <Gem className="w-5 h-5 shrink-0 text-primary-green" />
                          <div className="flex flex-col">
                            <span>Create Gem</span>
                            <span className="text-sm text-text-secondary">
                              Add a new location
                            </span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={handleCreateKrawl}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-left",
                            "text-base font-medium text-text-primary",
                            "hover:bg-light-green/10 hover:text-primary-green",
                            "transition-colors rounded-lg",
                            "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2"
                          )}
                          aria-label="Create Krawl"
                        >
                          <Navigation className="w-5 h-5 shrink-0 text-primary-green" />
                          <div className="flex flex-col">
                            <span>Create Krawl</span>
                            <span className="text-sm text-text-secondary">
                              Build a trail route
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Tooltip for sidebar variant */}
              {tooltipHovered && variant === "sidebar" && !isOpen && mounted && (
                createPortal(
                  <div
                    className={cn(
                      "fixed z-[1000]",
                      "bg-bg-white rounded-lg shadow-elevation-3",
                      "border border-[var(--color-border-subtle)]",
                      "px-3 py-2",
                      "text-sm font-medium text-text-primary",
                      "whitespace-nowrap"
                    )}
                    style={{
                      top: `${tooltipPosition.top}px`,
                      left: `${tooltipPosition.left}px`,
                      transform: "translateY(-50%)",
                    }}
                    role="tooltip"
                    aria-hidden="true"
                  >
                    <div
                      className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 flex items-center"
                      aria-hidden="true"
                    >
                      <div
                        className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-bg-white"
                      />
                    </div>
                    Create
                  </div>,
                  document.body
                )
              )}
            </div>
          </>
        );
      }}
    </ProtectedActionGate>
  );
}

