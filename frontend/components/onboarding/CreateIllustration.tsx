import { memo } from "react";
import { cn } from "@/lib/utils";

type CreateIllustrationProps = {
  className?: string;
};

/**
 * Custom illustration for the "Create & Share" onboarding step.
 * Highlights collaborative trail building and sharing, aligned with brand brief.
 */
export const CreateIllustration = memo(function CreateIllustration({
  className,
}: CreateIllustrationProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-center", className)}>
      <style>{`
        @keyframes dash-flow {
          to {
            stroke-dashoffset: -50;
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes pop {
          0% { opacity: 0; transform: scale(0.6); }
          80% { opacity: 1; transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .trail-path {
          stroke-dasharray: 6;
          animation: dash-flow 2.2s linear infinite;
        }
        .gem-node {
          transform-origin: center;
          animation: pulse 3.5s ease-in-out infinite;
        }
        .pop-card {
          opacity: 0;
          animation: pop 0.8s ease-out 0.2s forwards;
        }
      `}</style>

      <div className="relative aspect-square w-full max-w-[420px]">
        <svg
          className="h-full w-full drop-shadow-sm"
          viewBox="0 0 224 224"
          role="img"
          aria-label="Create and share illustration"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background tile */}
          <rect width="224" height="224" rx="32" fill="#E8F5E9" stroke="#DDEEDC" />

          {/* Secondary gradient blob */}
          <ellipse cx="170" cy="52" rx="35" ry="18" fill="#fff" opacity="0.4" />

          {/* Dotted trail */}
          <path
            className="trail-path"
            d="M40 176C62 150 82 150 90 140C98 130 98 118 112 114C126 110 132 122 142 132C152 142 168 146 186 128"
            stroke="#2D7A3E"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Krawl share arcs */}
          <path
            d="M166 74C178 74 186 82 186 94"
            stroke="#2D7A3E"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M166 66C186 66 198 78 198 98"
            stroke="#FF9800"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />

          {/* Map pins / gems */}
          <circle cx="46" cy="170" r="11" fill="#2D7A3E" className="gem-node" />
          <circle cx="98" cy="132" r="9" fill="#4CAF50" className="gem-node" style={{ animationDelay: "0.4s" }} />
          <circle cx="150" cy="145" r="10" fill="#FFC107" className="gem-node" style={{ animationDelay: "0.8s" }} />

          {/* Connection nodes */}
          <circle cx="184" cy="122" r="7" fill="#FF9800" className="gem-node" style={{ animationDelay: "1s" }} />

          {/* Create card */}
          <g className="pop-card">
            <rect
              x="70"
              y="58"
              width="84"
              height="56"
              rx="10"
              fill="#FFFFFF"
              stroke="#2D7A3E"
              strokeWidth="3"
              opacity="0.95"
            />
            <circle cx="90" cy="86" r="9" fill="#4CAF50" />
            <path d="M96 86H140" stroke="#D7EBD8" strokeWidth="4" strokeLinecap="round" />
            <path d="M96 94H134" stroke="#D7EBD8" strokeWidth="4" strokeLinecap="round" />
            <path d="M96 78H134" stroke="#D7EBD8" strokeWidth="4" strokeLinecap="round" />
            <rect x="110" y="66" width="36" height="24" rx="6" fill="#2D7A3E" opacity="0.08" />
            <path d="M128 72V84" stroke="#2D7A3E" strokeWidth="3" strokeLinecap="round" />
            <path d="M122 78H134" stroke="#2D7A3E" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Plus beacon */}
          <circle cx="164" cy="72" r="14" fill="#FFFFFF" stroke="#2D7A3E" strokeWidth="3" />
          <path d="M164 64V80" stroke="#2D7A3E" strokeWidth="4" strokeLinecap="round" />
          <path d="M156 72H172" stroke="#2D7A3E" strokeWidth="4" strokeLinecap="round" />

          {/* Floating sparkles */}
          <circle cx="56" cy="52" r="5" fill="#FFC107" opacity="0.9" />
          <circle cx="130" cy="188" r="6" fill="#FF9800" opacity="0.8" />
          <circle cx="190" cy="160" r="4" fill="#4CAF50" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
});
















