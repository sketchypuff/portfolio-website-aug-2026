import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

/** Mono uppercase section heading with a trailing 24px Phosphor icon. */
export function SectionLabel({ icon: Icon, children }: { icon: PhosphorIcon; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 font-mono text-sm font-semibold uppercase">
      {children}
      <Icon aria-hidden className="size-6 shrink-0" />
    </h2>
  );
}
