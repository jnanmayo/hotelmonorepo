'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

import { motionPresets } from './presets';

type MotionPresetKey = 'fadeIn' | 'fade' | 'slideRight' | 'slideLeft' | 'scaleIn';

interface MotionBoxProps extends HTMLMotionProps<'div'> {
  preset?: MotionPresetKey;
}

export function MotionBox({ preset = 'fadeIn', children, ...props }: MotionBoxProps) {
  const { initial, animate, exit, transition } = motionPresets[preset];
  return (
    <motion.div initial={initial} animate={animate} exit={exit} transition={transition} {...props}>
      {children}
    </motion.div>
  );
}

export { motion, motionPresets };
