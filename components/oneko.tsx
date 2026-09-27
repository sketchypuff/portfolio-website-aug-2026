"use client";

import { useEffect, useRef } from "react";

// Ported from oneko.js by adryd (MIT, https://github.com/adryd325/oneko.js).
// The original is an IIFE that appends to <body> and never removes its
// listeners, so it would outlive the home page; this version mounts and
// cleans up with the component. Sprite: public/oneko.png, the "silversky" skin
// from onekocord (https://github.com/onekocord/onekocord), 8×4 grid of 32px cells.

const SIZE = 32;
// Slower than the original's 10px chase: this is a stroll.
const SPEED = 6;
// Each walk heads for a random spot at least this far away, so walks
// aren't cut short by a nearby edge.
const TRIP_MIN = 300;
// Rest 1–3 seconds between walks (in frames).
const REST_MIN = 10;
const REST_MAX = 30;
// Naps last about 6 seconds; the original's 19 kept it sitting too long.
const NAP_FRAMES = 60;
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

const between = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * A pixel cat that wanders the viewport on its own: walks somewhere nearby,
 * sits a while (sometimes scratching or napping), then sets off again. Home
 * only. Decorative: aria-hidden, ignores pointer events, and renders nothing
 * under reduced motion.
 */
export function Oneko() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = SIZE;
    let y = SIZE;
    let targetX: number | null = null;
    let targetY = 0;
    let restFrames = REST_MIN;
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

      // Roughly every 5 seconds of resting, pick something to do.
      if (idleTime > 10 && Math.floor(Math.random() * 50) === 0 && idleAnimation === null) {
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
          if (idleFrame > NAP_FRAMES) resetIdle();
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

    // Keeps the farthest of a few random spots on screen, stopping early
    // once one is TRIP_MIN away (a small viewport may have none that far).
    const pickTarget = () => {
      let best = -1;
      for (let i = 0; i < 10 && best < TRIP_MIN; i++) {
        const tx = between(SIZE / 2, window.innerWidth - SIZE / 2);
        const ty = between(SIZE / 2, window.innerHeight - SIZE / 2);
        const d = Math.hypot(tx - x, ty - y);
        if (d > best) {
          best = d;
          targetX = tx;
          targetY = ty;
        }
      }
    };

    const frame = () => {
      frameCount += 1;

      if (targetX === null) {
        // Resting. Never cut a nap or scratch short.
        if (restFrames > 0 || idleAnimation !== null) {
          restFrames -= 1;
          idle();
          return;
        }
        pickTarget();
      }

      // Perks up for a few frames before setting off.
      if (idleTime > 1) {
        setSprite("alert", 0);
        idleTime = Math.min(idleTime, 4) - 1;
        return;
      }

      const dx = x - targetX!;
      const dy = y - targetY;
      const distance = Math.hypot(dx, dy);

      if (distance <= SPEED) {
        x = targetX!;
        y = targetY;
        place();
        targetX = null;
        restFrames = Math.round(between(REST_MIN, REST_MAX));
        setSprite("idle", 0);
        return;
      }

      let direction = dy / distance > 0.5 ? "N" : "";
      direction += dy / distance < -0.5 ? "S" : "";
      direction += dx / distance > 0.5 ? "W" : "";
      direction += dx / distance < -0.5 ? "E" : "";
      setSprite(direction, frameCount);

      x -= (dx / distance) * SPEED;
      y -= (dy / distance) * SPEED;
      place();
    };

    const tick = (t: number) => {
      if (t - last > FRAME_MS) {
        last = t;
        frame();
      }
      raf = requestAnimationFrame(tick);
    };

    // Starts sitting in the top-left corner, as the original does, and
    // strolls off after a few seconds.
    setSprite("idle", 0);
    place();
    el.hidden = false;
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
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
