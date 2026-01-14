"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, ElementType, ComponentPropsWithoutRef } from "react";
import { easings } from "@/lib/animations";

type TextRevealProps<T extends ElementType = "h1"> = {
  text: string;
  as?: T;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "children">;

export function TextReveal<T extends ElementType = "h1">({
  text,
  as,
  className,
  delay = 0,
  staggerDelay = 0.03,
  once = true,
  ...props
}: TextRevealProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const Component = as || "h1";

  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: easings.smooth,
      },
    },
  };

  return (
    <Component ref={ref} className={className} {...props}>
      <motion.span
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="inline"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}

// Character-by-character reveal variant
interface CharRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function CharReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.02,
}: CharRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const chars = text.split("");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const charVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: easings.smooth,
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Line-by-line reveal for paragraphs
interface LineRevealProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  staggerDelay?: number;
}

export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  staggerDelay = 0.1,
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easings.smooth,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {lines.map((line, i) => (
        <motion.p key={i} variants={lineVariants} className={lineClassName}>
          {line}
        </motion.p>
      ))}
    </motion.div>
  );
}
