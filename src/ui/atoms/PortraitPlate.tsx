import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Measuring plate around the portrait — construction guides only.
 * No dimension numbers (would invent unverified claims).
 */
export function PortraitPlate({ children, className = "" }: Props) {
  return (
    <div
      className={`portrait-frame construction-frame relative overflow-hidden ${className}`}
    >
      {children}
      {/* Outer measure brackets */}
      <span
        aria-hidden
        className="pointer-events-none absolute start-1 top-2 bottom-2 w-px bg-ink/20"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute end-1 top-2 bottom-2 w-px bg-ink/20"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute start-2 end-2 top-1 h-px bg-ink/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute start-2 end-2 bottom-1 h-px bg-ink/15"
      />
      {/* Tick marks */}
      <span
        aria-hidden
        className="pointer-events-none absolute start-1 top-[18%] h-px w-2 bg-redline/70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute start-1 top-1/2 h-px w-2.5 bg-redline/80"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute start-1 top-[78%] h-px w-2 bg-redline/70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute end-1 top-[22%] h-px w-2 bg-ink/35"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute end-1 top-[72%] h-px w-2 bg-ink/35"
      />
    </div>
  );
}
