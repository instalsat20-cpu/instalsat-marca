"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

export function StaggerGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  className,
  children,
  hover = true,
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={itemVariants}
      whileHover={
        hover && !shouldReduceMotion
          ? { scale: 1.01, boxShadow: "0 12px 28px rgba(0,0,0,0.35)" }
          : undefined
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
