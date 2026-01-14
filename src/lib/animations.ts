// Framer Motion animation variants and configuration
// Centralized animation system for consistent motion across the site

// Smooth easing curves (Framer-style)
export const easings = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  smoothOut: [0, 0, 0.2, 1] as const,
  smoothIn: [0.4, 0, 1, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  snappy: [0.25, 0.46, 0.45, 0.94] as const,
};

// Duration presets
export const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  slower: 0.8,
};

// Basic fade variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.slow, ease: easings.smooth }
  },
};

// Slide up with fade
export const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.smooth }
  },
};

// Slide down with fade
export const slideDown = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.smooth }
  },
};

// Slide from left
export const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easings.smooth }
  },
};

// Slide from right
export const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easings.smooth }
  },
};

// Scale in with bounce
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easings.bounce }
  },
};

// Scale in subtle (no bounce)
export const scaleInSubtle = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.smooth }
  },
};

// Stagger container for lists/grids
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    },
  },
};

// Stagger container - faster
export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    },
  },
};

// Stagger item (use inside stagger container)
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.smooth }
  },
};

// Stagger item from scale
export const staggerItemScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.smooth }
  },
};

// Hover animations for cards
export const cardHover = {
  rest: {
    y: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    transition: { duration: 0.3, ease: easings.smooth }
  },
};

// Button hover animation
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

// Image zoom on hover
export const imageZoom = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.4, ease: easings.smooth }
  },
};

// Rotate in
export const rotateIn = {
  hidden: { opacity: 0, rotate: -10 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: { duration: durations.slow, ease: easings.smooth }
  },
};

// Blur in
export const blurIn = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: durations.slow, ease: easings.smooth }
  },
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easings.smooth }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: easings.smoothIn }
  },
};

// Mobile menu variants
export const menuSlide = {
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: easings.smooth }
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.4, ease: easings.smooth }
  },
};

// Menu item stagger
export const menuItemVariants = {
  closed: { opacity: 0, x: -20 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easings.smooth }
  },
};

// Drawer slide (cart, mobile menu)
export const drawerSlide = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 }
  },
  exit: {
    x: "100%",
    transition: { duration: 0.3, ease: easings.smoothIn }
  },
};

// Backdrop fade
export const backdropFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

// Number counter spring config
export const counterSpring = {
  type: "spring" as const,
  damping: 30,
  stiffness: 100,
};

// Tooltip/popover
export const popover = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: easings.smooth }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 }
  },
};
