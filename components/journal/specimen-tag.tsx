import { PlaceholderSwatch, type WashColor } from "@/components/journal/placeholder-wash";
import { cn } from "@/lib/utils";

// Each tag lies on the page at its own slight angle. Literal classes so
// Tailwind sees them; cycled by position.
const TILTS = ["-rotate-[0.8deg]", "rotate-[0.5deg]", "rotate-[0.9deg]", "-rotate-[0.4deg]", "rotate-[0.3deg]"];

/**
 * A manila specimen tag, the kind tied to a pressed leaf: a clipped corner,
 * a reinforced hole with its string, one test dab of a wash, and a typed
 * number above the written label. Used for the smaller "loose leaves" work.
 */
export function SpecimenTag({
  index,
  color,
  children,
}: {
  index: number;
  color: WashColor;
  children: React.ReactNode;
}) {
  const number = String(index + 1).padStart(2, "0");
  return (
    <li
      className={cn(
        "bg-tag shadow-tag relative flex gap-4 p-4 pr-12 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,0_100%)]",
        TILTS[index % TILTS.length],
      )}
    >
      {/* The reinforced hole and its string. */}
      <svg aria-hidden viewBox="0 0 40 40" className="absolute top-3 right-3 size-7 overflow-visible">
        <circle cx="20" cy="20" r="7" className="fill-paper stroke-foreground/25" strokeWidth="1" />
        <circle cx="20" cy="20" r="3.5" className="fill-desk" />
        <path
          d="M 23 18 C 36 10, 48 14, 54 30"
          className="stroke-foreground/35"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <PlaceholderSwatch id={`leaf-${number}`} seed={index * 5 + 2} color={color} className="mt-0.5 size-10 shrink-0" />
      <div className="flex flex-col gap-1">
        <span className="label text-muted-foreground">Specimen {number}</span>
        <p className="text-[1.0625rem] leading-snug text-pretty">{children}</p>
      </div>
    </li>
  );
}
