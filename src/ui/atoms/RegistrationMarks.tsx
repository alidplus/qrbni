type Props = {
  /** Which corners get L-brackets. */
  corners?: Array<"start-top" | "end-top" | "start-bottom" | "end-bottom">;
  className?: string;
};

const cornerClass: Record<NonNullable<Props["corners"]>[number], string> = {
  "start-top": "start-4 top-4 border-s-2 border-t-2",
  "end-top": "end-4 top-4 border-e-2 border-t-2",
  "start-bottom": "start-4 bottom-4 border-b-2 border-s-2",
  "end-bottom": "end-4 bottom-4 border-b-2 border-e-2",
};

/** Title-block registration corners in redline. */
export function RegistrationMarks({
  corners = ["start-bottom", "end-bottom"],
  className = "",
}: Props) {
  return (
    <>
      {corners.map((corner) => (
        <span
          key={corner}
          aria-hidden
          className={`pointer-events-none absolute h-5 w-5 border-redline ${cornerClass[corner]} ${className}`}
        />
      ))}
    </>
  );
}
