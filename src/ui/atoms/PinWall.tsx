import type { ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

/** Page shell on the critique wall ground. */
export function PinWall({ className = "", children }: Props) {
  return (
    <div className={`pin-wall flex flex-1 flex-col ${className}`}>
      {children}
    </div>
  );
}
