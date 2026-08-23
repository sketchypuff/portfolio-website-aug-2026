"use client";

import type { ElementType, ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

type Tag = "div" | "section" | "article" | "li" | "header" | "footer";

/**
 * `motion` types props per element, so a polymorphic `as` can't be expressed
 * without a union that collapses. The props are modelled on the div variant
 * and the element is widened at the call site — the runtime behaviour is
 * identical for the layout tags we allow.
 */
type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode;
  /** Seconds to wait before animating. Use to stagger siblings manually. */
  delay?: number;
  /** Travel distance in px. Keep small — this should read as settling, not sliding. */
  distance?: number;
  as?: Tag;
};

/**
 * Fades content in as it scrolls into view, once.
 *
 * The defaults are deliberately understated: 12px of travel over 500ms. On a
 * minimal layout, anything louder reads as decoration. Honours
 * prefers-reduced-motion by rendering the final state immediately.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 12,
  as = "div",
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as] as ElementType;

  if (reduced) {
    return <Component {...props}>{children}</Component>;
  }

  return (
    <Component
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay, ease: EASE }}
      {...props}
    >
      {children}
    </Component>
  );
}

type GroupProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode;
  stagger?: number;
};

/**
 * Staggers `RevealItem` descendants. Use for lists and grids, where animating
 * each row on its own viewport trigger looks uneven.
 */
export function RevealGroup({ children, stagger = 0.06, ...props }: GroupProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type ItemProps = Omit<HTMLMotionProps<"div">, "children"> & { children?: ReactNode };

export function RevealItem({ children, ...props }: ItemProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
