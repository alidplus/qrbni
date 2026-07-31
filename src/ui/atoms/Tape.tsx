type Props = {
  className?: string;
  /** Rotation in degrees for the tape chip. */
  rotate?: number;
};

/** Masking-tape chip — geometric craft only. */
export function Tape({ className = "", rotate = -2 }: Props) {
  return (
    <span
      aria-hidden
      className={`tape absolute h-3.5 w-14 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  );
}
