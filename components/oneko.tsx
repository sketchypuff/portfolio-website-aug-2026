"use client";

import { useEffect, useRef } from "react";

// Ported from oneko.js by adryd (MIT, https://github.com/adryd325/oneko.js).
// The original is an IIFE that appends to <body> and never removes its
// listeners, so it would outlive the home page; this version mounts and
// cleans up with the component. Sprite: public/oneko.png, the "silversky" skin
// from onekocord (https://github.com/onekocord/onekocord), 8×4 grid of 32px cells.

const SIZE = 32;
const SPEED = 10;
// The original steps every 100ms regardless of refresh rate.
const FRAME_MS = 100;

type Sprite = [number, number];

const sprites: Record<string, Sprite[]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
  scratchWallN: [[0, 0], [0, -1]],
  scratchWallS: [[-7, -1], [-6, -2]],
  scratchWallE: [[-2, -2], [-2, -3]],
  scratchWallW: [[-4, 0], [-4, -1]],
  tired: [[-3, -2]],
  sleeping: [[-2, 0], [-2, -1]],
  N: [[-1, -2], [-1, -3]],
  NE: [[0, -2], [0, -3]],
  E: [[-3, 0], [-3, -1]],
  SE: [[-5, -1], [-5, -2]],
  S: [[-6, -3], [-7, -2]],
  SW: [[-5, -3], [-6, -1]],
  W: [[-4, -2], [-4, -3]],
  NW: [[-1, 0], [-1, -1]],
};

/**
 * A pixel cat that chases the cursor. Home only. Decorative: aria-hidden,
 * ignores pointer events, and renders nothing under reduced motion or on
 * devices without a hovering pointer (there is no cursor to chase).
 */
export function Oneko() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    let x = SIZE;
    let y = SIZE;
    let mouseX = 0;
    let mouseY = 0;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleFrame = 0;
    let last = 0;
    let raf = 0;

    const setSprite = (name: string, frame: number) => {
      const set = sprites[name];
      const [sx, sy] = set[frame % set.length];
      el.style.backgroundPosition = `${sx * SIZE}px ${sy * SIZE}px`;
    };

    const place = () => {
      el.style.transform = `translate(${x - SIZE / 2}px, ${y - SIZE / 2}px)`;
    };

    const resetIdle = () => {
      idleAnimation = null;
      idleFrame = 0;
    };

    const idle = () => {
      idleTime += 1;

      // Roughly every 20 seconds of idling, pick something to do.
      if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation === null) {
        const options = ["sleeping", "scratchSelf"];
        if (x < SIZE) options.push("scratchWallW");
        if (y < SIZE) options.push("scratchWallN");
        if (x > window.innerWidth - SIZE) options.push("scratchWallE");
        if (y > window.innerHeight - SIZE) options.push("scratchWallS");
        idleAnimation = options[Math.floor(Math.random() * options.length)];
      }

      switch (idleAnimation) {
        case "sleeping":
          if (idleFrame < 8) {
            setSprite("tired", 0);
            break;
          }
          setSprite("sleeping", Math.floor(idleFrame / 4));
          if (idleFrame > 192) resetIdle();
          break;
        case "scratchWallN":
        case "scratchWallS":
        case "scratchWallE":
        case "scratchWallW":
        case "scratchSelf":
          setSprite(idleAnimation, idleFrame);
          if (idleFrame > 9) resetIdle();
          break;
        default:
          setSprite("idle", 0);
          return;
      }
      idleFrame += 1;
    };

    const frame = () => {
      frameCount += 1;
      const dx = x - mouseX;
      const dy = y - mouseY;
      const distance = Math.hypot(dx, dy);

      if (distance < 48) {
        idle();
        return;
      }

      resetIdle();

      // Startled: hold the alert pose for a few frames before running.
      if (idleTime > 1) {
        setSprite("alert", 0);
        idleTime = Math.min(idleTime, 7) - 1;
        return;
      }

      let direction = dy / distance > 0.5 ? "N" : "";
      direction += dy / distance < -0.5 ? "S" : "";
      direction += dx / distance > 0.5 ? "W" : "";
      direction += dx / distance < -0.5 ? "E" : "";
      setSprite(direction, frameCount);

      x -= (dx / distance) * SPEED;
      y -= (dy / distance) * SPEED;
      x = Math.min(Math.max(SIZE / 2, x), window.innerWidth - SIZE / 2);
      y = Math.min(Math.max(SIZE / 2, y), window.innerHeight - SIZE / 2);
      place();
    };

    const tick = (t: number) => {
      if (t - last > FRAME_MS) {
        last = t;
        frame();
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Starts sitting in the top-left corner, as the original does.
    setSprite("idle", 0);
    place();
    el.hidden = false;
    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      hidden
      className="pointer-events-none fixed top-0 left-0 z-50 size-8 bg-[url(/oneko.png)] [image-rendering:pixelated]"
    />
  );
}
