'use client';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

type MotionVariant = {
  y?: number;
  x?: number;
  rotateX?: number;
  rotateY?: number;
  opacity?: number;
  scale?: number;
  filter?: string;
  [key: string]: any;
};

interface TextLoopProps {
  children?: React.ReactNode;
  words?: string[];
  className?: string;
  interval?: number;
  transition?: any;
  variants?: {
    initial: MotionVariant;
    animate: MotionVariant;
    exit: MotionVariant;
  };
}

const defaultVariants = {
  initial: {
    y: 20,
    rotateX: 90,
    opacity: 0,
    filter: 'blur(4px)',
  },
  animate: {
    y: 0,
    rotateX: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: {
    y: -20,
    rotateX: -90,
    opacity: 0,
    filter: 'blur(4px)',
  },
};

const defaultTransition = {
  type: 'spring',
  stiffness: 900,
  damping: 80,
  mass: 10,
};

export function TextLoop({
  children,
  words,
  className = '',
  interval = 2000,
  transition = defaultTransition,
  variants = defaultVariants,
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use words prop if provided, otherwise try to parse children
  const items = words || React.Children.toArray(children).filter(
    (child) => {
      if (child === null || child === undefined) return false;
      // Filter out whitespace-only text nodes
      if (typeof child === 'string' && child.trim() === '') return false;
      return true;
    }
  );

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <span className={`inline-flex ${className}`}>
      <AnimatePresence mode='wait'>
        <motion.span
          key={currentIndex}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={transition}
          style={{ display: 'inline-block' }}
        >
          {currentItem}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
