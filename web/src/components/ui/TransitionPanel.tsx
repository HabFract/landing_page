'use client';
import {
  AnimatePresence,
  motion,
} from 'motion/react';
import { cn } from '../../lib/utils';
import type { ComponentProps } from 'react';

type MotionVariant = {
  x?: number;
  y?: number;
  opacity?: number;
  scale?: number;
  rotate?: number;
  [key: string]: any;
};

export type TransitionPanelProps = {
  children: React.ReactNode[];
  className?: string;
  transition?: any;
  activeIndex: number;
  variants?: { enter: MotionVariant; center: MotionVariant; exit: MotionVariant };
} & Omit<ComponentProps<typeof motion.div>, 'children'>;

export function TransitionPanel({
  children,
  className,
  transition,
  variants,
  activeIndex,
  ...motionProps
}: TransitionPanelProps) {
  return (
    <div className={cn('relative', className)}>
      <AnimatePresence
        initial={false}
        mode='popLayout'
        custom={motionProps.custom}
      >
        <motion.div
          key={activeIndex}
          variants={variants}
          transition={transition}
          initial='enter'
          animate='center'
          exit='exit'
          {...motionProps}
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
