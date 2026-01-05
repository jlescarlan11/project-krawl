import { memo } from "react";
import { cn } from "@/lib/utils";

type WelcomeIllustrationProps = {
  className?: string;
};

/**
 * Custom illustration for Step 1 of onboarding.
 * Animated to represent the "Living Map" concept of Krawl.
 */
export const WelcomeIllustration = memo(function WelcomeIllustration({
  className,
}: WelcomeIllustrationProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-center", className)}>
      {/* Internal styles for self-contained animations. 
        This prevents the need for complex tailwind.config setup for specific keyframes.
      */}
      <style>{`
        @keyframes drawPath {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUpFade {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        .krawl-path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: drawPath 2s ease-out forwards;
        }
        
        .krawl-gem {
          transform-origin: center;
          opacity: 0; /* Start hidden */
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .krawl-card {
          opacity: 0;
          animation: slideUpFade 0.8s ease-out 1.2s forwards, float 4s ease-in-out 2s infinite;
        }
      `}</style>

      <div className="relative aspect-square w-full max-w-[420px]">
        <svg
          className="h-full w-full drop-shadow-sm"
          viewBox="0 0 192 192"
          role="img"
          aria-label="Community insights illustration"
        >
          {/* Background Map Tile */}
          <rect
            width="192"
            height="192"
            rx="32"
            fill="#E8F5E9"
            stroke="#E0F2E4"
            className="transition-colors duration-500"
          />

          {/* Primary Trail (Dark Green) */}
          <polyline
            points="36 112 58 86 83 98 104 78 126 97 146 74"
            fill="none"
            stroke="#2D7A3E"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="krawl-path"
            style={{ animationDelay: '0.2s' }}
          />

          {/* Secondary Trail (Light Green) */}
          <polyline
            points="64 122 88 110 108 128 134 114 154 130"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="krawl-path"
            style={{ animationDelay: '0.6s' }} 
          />

          {/* Info Card (Pop up last) */}
          <g className="krawl-card">
            <rect
              x="64"
              y="138"
              width="64"
              height="28"
              rx="4.5"
              fill="#FFFFFF"
              stroke="#2D7A3E"
              strokeWidth="3"
            />
            {/* Tiny lines representing text on the card */}
            <line x1="72" y1="148" x2="100" y2="148" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" />
            <line x1="72" y1="156" x2="110" y2="156" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Gems (Circles) - Staggered animation delays */}
          {/* Top Trail Gems */}
          <circle cx="64" cy="84" r="7" fill="#FF9800" className="krawl-gem" style={{ animationDelay: '0.5s' }} />
          <circle cx="92" cy="70" r="9" fill="#2D7A3E" className="krawl-gem" style={{ animationDelay: '0.7s' }} />
          <circle cx="112" cy="62" r="6" fill="#4CAF50" className="krawl-gem" style={{ animationDelay: '0.9s' }} />
          <circle cx="128" cy="90" r="6" fill="#81C784" className="krawl-gem" style={{ animationDelay: '1.1s' }} />
          
          {/* Bottom Trail Gems */}
          <circle cx="108" cy="120" r="7" fill="#FFC107" className="krawl-gem" style={{ animationDelay: '1.3s' }} />
          <circle cx="82" cy="126" r="5" fill="#2D7A3E" className="krawl-gem" style={{ animationDelay: '1.0s' }} />
        </svg>
      </div>
    </div>
  );
});
