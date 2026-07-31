import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Redline underline on real copy (emphasis without fake slogans). */
export function RedlineEm({ children, className = "" }: Props) {
  return (
    <span className={`redline-underline font-semibold text-ink ${className}`}>
      {children}
    </span>
  );
}

type MetaProps = {
  rows: Array<{ label: string; value: string }>;
  className?: string;
};

/** Title-block meta footer (Drawn / Scale / Site). */
export function TitleBlockMeta({ rows, className = "" }: MetaProps) {
  return (
    <dl
      className={`grid grid-cols-2 gap-x-4 gap-y-1 border-t border-ink/15 pt-4 font-display text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-slate ${className}`}
    >
      {rows.map((row) => (
        <div
          key={`${row.label}-${row.value}`}
          className={rows.length % 2 === 1 && row === rows[rows.length - 1] ? "col-span-2" : undefined}
        >
          <dt className="inline text-ink/45">{row.label} · </dt>
          <dd className="inline text-ink/80">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

type FigProps = {
  children: ReactNode;
  className?: string;
};

/** Figure / plate label — title-block voice, not a marketing eyebrow. */
export function FigLabel({ children, className = "" }: FigProps) {
  return (
    <p
      className={`font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate ${className}`}
    >
      {children}
    </p>
  );
}
