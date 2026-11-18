"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/** Redraw interval for the noise, in ms (~12fps reads as film grain, not static). */
const FRAME_MS = 80;

/**
 * Full-viewport film grain: random gray noise on a canvas, laid over the page
 * at 15% opacity in `soft-light`. It redraws every few frames so the texture
 * crawls; under reduced motion it draws once and holds still.
 *
 * Drawn at CSS-pixel resolution (not device pixels): finer grain disappears on
 * retina screens, and it keeps the per-frame cost to one viewport of pixels.
 */
export function Grain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let image: ImageData | null = null;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // A zero-size viewport (a hidden pane, a collapsed iframe) makes
      // createImageData throw; skip until there's something to draw.
      image = canvas.width && canvas.height ? ctx.createImageData(canvas.width, canvas.height) : null;
      draw();
    };
    const draw = () => {
      if (!image) return;
      const data = new Uint32Array(image.data.buffer);
      for (let i = 0; i < data.length; i++) {
        const v = (Math.random() * 255) | 0;
        // ABGR on little-endian: opaque gray.
        data[i] = 0xff000000 | (v << 16) | (v << 8) | v;
      }
      ctx.putImageData(image, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    const timer = reduced ? undefined : window.setInterval(draw, FRAME_MS);
    return () => {
      window.removeEventListener("resize", resize);
      window.clearInterval(timer);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-10 size-full opacity-15 mix-blend-soft-light"
    />
  );
}
