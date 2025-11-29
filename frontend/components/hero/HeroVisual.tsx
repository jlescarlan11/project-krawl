"use client";

import Image from "next/image";
import { useState } from "react";

export function HeroVisual() {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex justify-end">
      <div className="relative w-full overflow-hidden rounded-[38px] border border-bg-medium bg-gradient-to-br from-primary-green/10 to-accent-orange/15 shadow-elevation-4">
        {hasError ? (
          <div className="flex min-h-[320px] w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#eaf7eb] to-[#fff5eb] px-4 py-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-text-tertiary/70">
              Hero illustration
            </p>
            <p className="max-w-sm text-lg font-semibold text-text-secondary">
              Cebu City culture is loading. Keep exploring while we warm up the visuals.
            </p>
          </div>
        ) : (
          <Image
            src="/hero-cebu.svg"
            alt="Illustrated view of Cebu City culture with landmarks and rich textures"
            width={800}
            height={600}
            sizes="(max-width: 1024px) 100vw, 640px"
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/70" />
      </div>
    </div>
  );
}





