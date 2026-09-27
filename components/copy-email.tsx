"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckIcon } from "@phosphor-icons/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Pre-Clipboard-API copy, for browsers or contexts that refuse `writeText`.
function legacyCopy(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.append(el);
  el.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    el.remove();
  }
}

/**
 * The tooltip's label. It lives inside the (portaled, mount-on-open) content
 * so its width is measured once the bubble exists. Same morph as
 * `ProfessionPill`: the old label lifts out, the new one rises in with a light
 * blur, and the width follows on a zero-bounce spring. The bubble re-centres
 * on the trigger as it resizes.
 *
 * The first measurement is applied instantly: springing it would resize, and
 * so re-centre, the bubble during its entrance, which reads as a nudge as the
 * zoom settles. Sizes come from the ResizeObserver's border box, which (unlike
 * `getBoundingClientRect`) ignores that zoom's scale and isn't rounded like
 * `offsetWidth`, so the measured width matches the natural one exactly.
 */
function MorphLabel({ copied }: { copied: boolean }) {
  const [size, setSize] = useState<{ width: number; animate: boolean } | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.borderBoxSize[0].inlineSize;
      setSize((prev) => ({ width, animate: prev !== null }));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.span
      className="relative inline-flex overflow-hidden"
      animate={{ width: size?.width ?? "auto" }}
      initial={false}
      transition={
        reduced || !size?.animate ? { duration: 0 } : { type: "spring", duration: 0.35, bounce: 0 }
      }
    >
      <span ref={measureRef} className="inline-flex w-max">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "copied" : "idle"}
            className="inline-flex items-center gap-1 whitespace-nowrap"
            initial={reduced ? false : { opacity: 0, y: 8, filter: "blur(3px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.25, ease: EASE_OUT },
            }}
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: -8, filter: "blur(3px)", transition: { duration: 0.15, ease: "easeIn" } }
            }
          >
            {copied && <CheckIcon aria-hidden weight="bold" className="size-3 shrink-0" />}
            {copied ? "Copied" : "Click to copy"}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.span>
  );
}

/**
 * The home Contact list's "Email". Hover shows "Click to copy"; a click
 * copies the address and the same tooltip morphs into a green "Copied" until
 * the pointer leaves. On touch there's no hover, so a tap shows "Copied" and
 * it closes itself after a moment.
 *
 * Radix closes a tooltip on pointerdown and click on the trigger, and counts
 * that pointerdown as a press outside the bubble too. `preventDefault` in all
 * three handlers keeps the one bubble open so it can morph, rather than
 * closing and replaying its entrance. If the Clipboard API
 * refuses (an insecure context, a denied permission) it tries the legacy
 * copy, and only if that fails too does it open the mail app instead.
 */
export function CopyEmail() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const touch = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function onOpenChange(next: boolean) {
    // A fresh hover starts from "Click to copy" again.
    if (next) setCopied(false);
    setOpen(next);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.social.email);
    } catch {
      if (!legacyCopy(site.social.email)) {
        window.location.href = `mailto:${site.social.email}`;
        return;
      }
    }
    setCopied(true);
    // Hover and focus already hold the tooltip open, so only a tap needs to
    // open it. Forcing it open for a mouse would strand it on screen if the
    // copy resolves after the pointer has left.
    if (touch.current) {
      setOpen(true);
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => setOpen(false), 1500);
    }
  }

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger
          ref={triggerRef}
          onPointerDown={(e) => {
            touch.current = e.pointerType === "touch";
            e.preventDefault();
          }}
          onClick={(e) => {
            e.preventDefault();
            copy();
          }}
          className="hover:text-muted-foreground cursor-pointer transition-colors"
        >
          Email
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            "transition-colors duration-200 motion-reduce:animate-none",
            copied && "bg-success text-success-foreground",
          )}
          arrowClassName={cn("transition-colors duration-200", copied && "bg-success fill-success")}
          onPointerDownOutside={(e) => {
            if (triggerRef.current?.contains(e.target as Node)) e.preventDefault();
          }}
        >
          <MorphLabel copied={copied} />
        </TooltipContent>
      </Tooltip>
      <span aria-live="polite" className="sr-only">
        {copied ? `${site.social.email} copied to clipboard` : ""}
      </span>
    </TooltipProvider>
  );
}
