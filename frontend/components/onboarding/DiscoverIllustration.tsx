import { memo } from "react";
import { cn } from "@/lib/utils";

type DiscoverIllustrationProps = {
  className?: string;
};

/**
 * Custom illustration for the "Discover Cultural Gems" step.
 * Represents Krawl's "Living Map" concept.
 * * Animations:
 * - Dotted lines flow to simulate a "Krawl" (trail).
 * - Pins float to represent "Living" points of interest.
 */
export const DiscoverIllustration = memo(function DiscoverIllustration({
  className,
}: DiscoverIllustrationProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-center", className)}>
      {/* Injecting local styles for specific SVG animations to keep the component self-contained.
        These utilize standard CSS keyframes for dash-offsets and floating.
      */}
      <style>
        {`
          @keyframes dash-flow {
            to {
              stroke-dashoffset: -20;
            }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          @keyframes float-medium {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes pulse-soft {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          .krawl-path {
            stroke-dasharray: 4;
            animation: dash-flow 1s linear infinite;
          }
          .gem-float-1 {
            animation: float-slow 3s ease-in-out infinite;
          }
          .gem-float-2 {
            animation: float-medium 4s ease-in-out infinite;
            transform-origin: center;
          }
          .gem-float-3 {
            animation: float-slow 3.5s ease-in-out infinite;
            animation-delay: 0.5s;
          }
        `}
      </style>
      
      <div className="relative aspect-square w-full max-w-[420px]">
        <svg
          className="h-full w-full drop-shadow-sm"
          viewBox="0 0 256 256"
          role="img"
          aria-label="Discover cultural gems illustration"
        >
          {/* Background Card */}
          <rect
            width="256"
            height="256"
            rx="43"
            fill="#E8F5E9"
            stroke="#E0F2E4"
            strokeWidth="1.5"
          />
          
          {/* Animated Trails (The "Krawl")
            The class 'krawl-path' applies the dash offset animation defined in the style block.
          */}
          <g className="opacity-60">
            <path
              className="krawl-path"
              d="M127.107 130C127.107 130 114.107 135 109.107 145C104.107 155 107.107 168 107.107 168"
              stroke="#2D7A3E"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              className="krawl-path"
              d="M128 130C128 130 141 135 146 145C151 155 148 168 148 168"
              stroke="#2D7A3E"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              style={{ animationDirection: "reverse" }} 
            />
          </g>

          {/* Central Green Landmass */}
          <path
            d="M83 100C83 75.1472 103.147 55 128 55C152.853 55 173 75.1472 173 100C173 124.853 152.853 145 128 145C103.147 145 83 124.853 83 100Z"
            fill="#2D7A3E"
          />

          {/* Decorative Trees/Foliage (Static background elements) */}
          <g>
             <path
              d="M140 180C140 171.163 147.163 164 156 164C164.837 164 172 171.163 172 180C172 188.837 164.837 196 156 196C147.163 196 140 188.837 140 180Z"
              fill="#81C784"
            />
            <path
              d="M156 171L159.5 180L169 181.5L162.5 188L164 197.5L156 193L148 197.5L149.5 188L143 181.5L152.5 180L156 171Z"
              fill="#81C784"
            />
          </g>

          {/* Central Map Feature (Base for the main pin) */}
          <path
            d="M128 60L138 85L165 89L146.5 107L151 134L128 121L105 134L109.5 107L91 89L118 85L128 60Z"
            fill="#2D7A3E"
            className="opacity-20"
          />
          <path
            d="M120 100C120 95.5817 123.582 92 128 92C132.418 92 136 95.5817 136 100C136 104.418 132.418 108 128 108C123.582 108 120 104.418 120 100Z"
            fill="#2D7A3E"
          />
          <path
            d="M128 108V120"
            stroke="#2D7A3E"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Left Gem (Green Pin) - Floating Animation 1 */}
          <g className="gem-float-1">
            <path
              d="M50 140C50 128.954 58.9543 120 70 120C81.0457 120 90 128.954 90 140C90 151.046 81.0457 160 70 160C58.9543 160 50 151.046 50 140Z"
              fill="#4CAF50"
            />
            <path
              d="M70 128L75 140L87 142L78.5 150L80.5 162L70 156L59.5 162L61.5 150L53 142L65 140L70 128Z"
              fill="#4CAF50"
            />
          </g>

          {/* Right Gem (Orange Pin) - Floating Animation 3 (Delayed) */}
          <g className="gem-float-3">
            <path
              d="M166 140C166 128.954 174.954 120 186 120C197.046 120 206 128.954 206 140C206 151.046 197.046 160 186 160C174.954 160 166 151.046 166 140Z"
              fill="#FF9800"
            />
            <path
              d="M186 128L191 140L203 142L194.5 150L196.5 162L186 156L175.5 162L177.5 150L169 142L181 140L186 128Z"
              fill="#FF9800"
            />
          </g>

          {/* Center Gem (Gold/Star) - Pulse + Float Animation 2 */}
          <g className="gem-float-2">
            <g style={{ transformOrigin: "100px 180px", animation: "pulse-soft 2s ease-in-out infinite" }}>
                <path
                d="M84 180C84 171.163 91.1634 164 100 164C108.837 164 116 171.163 116 180C116 188.837 108.837 196 100 196C91.1634 196 84 188.837 84 180Z"
                fill="#FFC107"
                />
                <path
                d="M100 171L103.5 180L113 181.5L106.5 188L108 197.5L100 193L92 197.5L93.5 188L87 181.5L96.5 180L100 171Z"
                fill="#FFC107"
                />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
});
