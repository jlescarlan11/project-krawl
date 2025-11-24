import { memo } from "react";
import { cn } from "@/lib/utils";

type TrailIllustrationProps = {
  className?: string;
};

/**
 * Custom illustration for the "Follow Guided Krawls" step (Step 3).
 * Based directly on the provided Container (1).svg artwork.
 */
export const TrailIllustration = memo(function TrailIllustration({
  className,
}: TrailIllustrationProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-center", className)}>
      <div className="relative aspect-square w-full max-w-[420px]">
        <svg
          className="h-full w-full"
          viewBox="0 0 320 320"
          role="img"
          aria-label="Active Krawl cultural trail"
        >
          <style>{`
            .krawl-path {
              stroke-dasharray: 12 12;
              animation: krawl-dash 2s linear infinite;
            }
            .krawl-pulse {
              transform-box: fill-box;
              transform-origin: center;
              animation: krawl-scale 2s ease-in-out infinite;
            }
            .krawl-float {
              animation: krawl-float 3s ease-in-out infinite;
            }
            .krawl-float-delayed {
              animation: krawl-float 3s ease-in-out infinite;
              animation-delay: 1s;
            }
            @keyframes krawl-dash {
              to { stroke-dashoffset: -24; }
            }
            @keyframes krawl-scale {
              0%, 100% {
                transform: scale(1);
                filter: drop-shadow(0 0 0 rgba(255, 107, 53, 0));
              }
              50% {
                transform: scale(1.1);
                filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.5));
              }
            }
            @keyframes krawl-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
          `}</style>

          {/* Background */}
          <rect width="320" height="320" rx="53" fill="#E8F5E9" stroke="#E0F2E4" strokeWidth="2" />

          {/* Animated path */}
          <path
            className="krawl-path"
            d="M60 240 C 110 240, 110 160, 160 160 C 210 160, 210 80, 260 80"
            stroke="#2D7A3E"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Start gem */}
          <g className="krawl-float">
            <rect
              x="42"
              y="222"
              width="36"
              height="36"
              rx="6"
              transform="rotate(-45 60 240)"
              fill="#2D7A3E"
            />
            <circle cx="60" cy="240" r="5" fill="white" />
          </g>

          {/* Active gem */}
          <g className="krawl-pulse">
            <rect
              x="140"
              y="140"
              width="40"
              height="40"
              rx="8"
              transform="rotate(-45 160 160)"
              stroke="#FF6B35"
              strokeWidth="2"
              fill="white"
              fillOpacity="0.1"
            />
            <rect
              x="144"
              y="144"
              width="32"
              height="32"
              rx="6"
              transform="rotate(-45 160 160)"
              fill="#FF6B35"
            />
            <path
              d="M160 152L162 158L168 160L162 162L160 168L158 162L152 160L158 158Z"
              fill="white"
            />
          </g>

          {/* Destination gem */}
          <g className="krawl-float-delayed">
            <rect
              x="242"
              y="62"
              width="36"
              height="36"
              rx="6"
              transform="rotate(-45 260 80)"
              fill="#F7B801"
            />
            <path
              d="M260 72V88"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M260 72L268 76L260 80Z"
              fill="#F7B801"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
});


