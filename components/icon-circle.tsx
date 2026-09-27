import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * A 48px muted circle around a 24px icon — the post page's back and prev/next
 * controls (Figma "Blog"). Visual only: wrap it in the link, never make the
 * circle itself the link target.
 */
export function IconCircle({ icon: Icon, className }: { icon: PhosphorIcon; className?: string }) {
  return (
    <span
      className={cn(
        "bg-muted inline-flex size-12 shrink-0 items-center justify-center rounded-full",
        className,
      )}
    >
      <Icon aria-hidden className="size-6" />
    </span>
  );
}
