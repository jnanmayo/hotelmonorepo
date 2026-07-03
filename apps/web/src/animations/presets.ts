/**
 * Framer Motion animation presets — subtle, premium micro-interactions
 */

export const motionPresets = {
  fadeIn: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  slideRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  slideLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  sidebar: {
    initial: { width: 0, opacity: 0 },
    animate: { width: 'auto', opacity: 1 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  stagger: {
    animate: { transition: { staggerChildren: 0.05 } },
  },
  hoverLift: {
    whileHover: { y: -2, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 },
  },
} as const;

export const springTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};
