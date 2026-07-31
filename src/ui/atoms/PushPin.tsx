type Props = {
  className?: string;
};

/** Red push-pin — crisp geometry, not illustration. */
export function PushPin({ className = "" }: Props) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 inline-flex h-3.5 w-3.5 items-center justify-center ${className}`}
    >
      <span className="absolute h-3.5 w-3.5 rounded-full bg-redline shadow-[0_2px_4px_color-mix(in_srgb,var(--ink)_25%,transparent)]" />
      <span className="absolute h-1.5 w-1.5 rounded-full bg-paper/80" />
    </span>
  );
}
