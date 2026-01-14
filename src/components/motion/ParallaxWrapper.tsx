"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ParallaxWrapperProps {
  children: ReactNode;
  speed?: number; // Negative = move slower, Positive = move faster
  className?: string;
  offset?: ["start end" | "start start" | "end start" | "end end", "start end" | "start start" | "end start" | "end end"];
}

export function ParallaxWrapper({
  children,
  speed = 0.5,
  className,
  offset = ["start end", "end start"],
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [100 * speed, -100 * speed]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

// Horizontal parallax variant
interface ParallaxHorizontalProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxHorizontal({
  children,
  speed = 0.3,
  className,
}: ParallaxHorizontalProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [100 * speed, -100 * speed]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ x }}>
        {children}
      </motion.div>
    </div>
  );
}

// Opacity-based parallax (fade as you scroll)
interface ParallaxFadeProps {
  children: ReactNode;
  className?: string;
}

export function ParallaxFade({
  children,
  className,
}: ParallaxFadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.95, 1, 1, 0.95]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ opacity, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
