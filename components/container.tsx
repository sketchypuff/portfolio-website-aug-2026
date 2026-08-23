import { cn } from "@/lib/utils";

const WIDTHS = {
  /** Reading column for prose. */
  prose: "max-w-2xl",
  /** Default page width — listings, headers, footer. */
  default: "max-w-3xl",
  /** Grids and image-led layouts. */
  wide: "max-w-5xl",
} as const;

export function Container({
  size = "default",
  className,
  children,
}: {
  size?: keyof typeof WIDTHS;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-6 sm:px-8", WIDTHS[size], className)}>{children}</div>
  );
}
