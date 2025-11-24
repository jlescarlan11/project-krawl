import { memo } from "react";
import { cn } from "@/lib/utils";

type CelebrateIllustrationProps = {
  className?: string;
};

/**
 * Celebrate illustration used on the permissions step.
 * Matches the sizing and layout conventions of other onboarding illustrations.
 */
export const CelebrateIllustration = memo(function CelebrateIllustration({
  className,
}: CelebrateIllustrationProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-center", className)}>
      <style>
        {`
          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes pop {
            0% { opacity: 0; transform: scale(0.5); }
            70% { transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-draw {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: draw 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-pop {
            opacity: 0;
            transform-origin: center;
            animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          .origin-center { transform-origin: 112px 112px; }
        `}
      </style>
      <div className="relative aspect-square w-full max-w-[420px]">
        <svg
          className="h-full w-full drop-shadow-sm"
          viewBox="0 0 224 224"
          role="img"
          aria-label="Celebrate permissions illustration"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_celebrate)">
            {/* Background Card */}
            <rect
              width="224"
              height="224"
              rx="40"
              fill="#E8F5E9"
              stroke="#E0F2E4"
              strokeWidth="1.5"
            />
            
            {/* Dashed Ring - Slowly Rotating */}
            <path
              d="M52 112C52 78.8629 78.8629 52 112 52C145.137 52 172 78.8629 172 112C172 145.137 145.137 172 112 172C78.8629 172 52 145.137 52 112Z"
              fill="white"
              stroke="#2D7A3E"
              strokeWidth="3"
              strokeDasharray="8 6"
              className="origin-center"
              style={{ animation: 'spin-slow 60s linear infinite' }}
            />

            {/* Shield Background - Pops in */}
            <path
              d="M106 112C106 108.686 108.686 106 112 106C115.314 106 118 108.686 118 112C118 115.314 115.314 118 112 118C108.686 118 106 115.314 106 112Z"
              fill="#2D7A3E"
              className="animate-pop"
              style={{ animationDelay: '0.1s' }}
            />

            {/* Checkmark - Draws itself */}
            <path
              d="M112 82V112L132 132"
              stroke="#2D7A3E"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
              className="animate-draw"
              style={{ animationDelay: '0.3s' }}
            />

            {/* Confetti Lines - Pop in with stagger */}
            <g className="animate-pop" style={{ animationDelay: '0.5s' }}>
                <line
                x1="150"
                y1="74"
                x2="142"
                y2="82"
                stroke="#FF9800"
                strokeWidth="3"
                strokeLinecap="round"
                />
            </g>
            <g className="animate-pop" style={{ animationDelay: '0.55s' }}>
                <line
                x1="74"
                y1="74"
                x2="82"
                y2="82"
                stroke="#FF9800"
                strokeWidth="3"
                strokeLinecap="round"
                />
            </g>
            <g className="animate-pop" style={{ animationDelay: '0.6s' }}>
                <line
                x1="74"
                y1="150"
                x2="82"
                y2="142"
                stroke="#FF9800"
                strokeWidth="3"
                strokeLinecap="round"
                />
            </g>
            <g className="animate-pop" style={{ animationDelay: '0.65s' }}>
                <line
                x1="150"
                y1="150"
                x2="142"
                y2="142"
                stroke="#FF9800"
                strokeWidth="3"
                strokeLinecap="round"
                />
            </g>

            {/* Crosshairs - Static background elements */}
            <path
              d="M112 30V45M112 179V194M30 112H45M179 112H194"
              stroke="#2D7A3E"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Circles - Pop in only (no float) */}
            <g className="animate-pop" style={{ animationDelay: '0.7s' }}>
                <circle cx="52" cy="112" r="8" fill="#4CAF50" />
            </g>
            <g className="animate-pop" style={{ animationDelay: '0.75s' }}>
                <circle cx="172" cy="112" r="8" fill="#FFC107" />
            </g>
            <g className="animate-pop" style={{ animationDelay: '0.8s' }}>
                <circle cx="112" cy="52" r="8" fill="#FF9800" />
            </g>
            <g className="animate-pop" style={{ animationDelay: '0.85s' }}>
                <circle cx="112" cy="172" r="8" fill="#81C784" />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_celebrate">
              <rect width="224" height="224" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
});