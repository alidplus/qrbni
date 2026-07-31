type Props = {
  className?: string;
  size?: number;
};

/** Title-block crosshair — geometric registration mark. */
export function Crosshair({ className = "", size = 18 }: Props) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`text-ink/50 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 2v5M12 17v5M2 12h5M17 12h5" />
    </svg>
  );
}
