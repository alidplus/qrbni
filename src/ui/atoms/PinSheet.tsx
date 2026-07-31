import type { CSSProperties, ElementType, ReactNode } from "react";
import { PushPin } from "@/ui/atoms/PushPin";
import { RegistrationMarks } from "@/ui/atoms/RegistrationMarks";
import { Tape } from "@/ui/atoms/Tape";

export type PinSheetProps = {
  children: ReactNode;
  className?: string;
  /** CSS rotate for settle + static tilt. */
  rotate?: number;
  settle?: boolean;
  /** Optional delay (ms) for staggered settles. */
  settleDelayMs?: number;
  tapes?: "none" | "top" | "top-bottom" | "strip";
  pins?: boolean;
  registration?: boolean;
  insetRule?: boolean;
  as?: "div" | "li" | "article" | "section";
};

/**
 * Pinned paper sheet — shared Redline Pin-up craft atom.
 * Atmosphere only: no invented claims or doodle annotations.
 */
export function PinSheet({
  children,
  className = "",
  rotate = -0.8,
  settle = true,
  settleDelayMs = 0,
  tapes = "top",
  pins = false,
  registration = true,
  insetRule = true,
  as: Tag = "div",
}: PinSheetProps) {
  const rot = `${rotate}deg`;
  const Shell = Tag as ElementType;

  return (
    <Shell
      className={`pin-sheet relative ${settle ? "pin-settle" : ""} ${className}`}
      style={
        {
          ["--pin-rot"]: rot,
          transform: settle ? undefined : `rotate(${rot})`,
          animationDelay:
            settle && settleDelayMs ? `${settleDelayMs}ms` : undefined,
        } as CSSProperties
      }
    >
      {pins ? (
        <>
          <PushPin className="start-5 -top-1.5" />
          <PushPin className="end-6 -top-1" />
        </>
      ) : null}

      {tapes === "top" || tapes === "top-bottom" ? (
        <>
          <Tape className="-top-2 start-8 w-16" rotate={-3} />
          <Tape className="-top-1 end-10 w-12" rotate={6} />
        </>
      ) : null}
      {tapes === "top-bottom" ? (
        <Tape
          className="-bottom-2 start-1/2 w-20 -translate-x-1/2"
          rotate={1}
        />
      ) : null}
      {tapes === "strip" ? (
        <Tape className="-top-1 start-4 h-3 w-10" rotate={-2} />
      ) : null}

      {insetRule ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-3 border border-ink/10"
        />
      ) : null}

      {registration ? <RegistrationMarks /> : null}

      <div className="relative z-[1]">{children}</div>
    </Shell>
  );
}
