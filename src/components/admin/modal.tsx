"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 0.2;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-bruma-light/10 bg-petroleo shadow-2xl"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97 }}
            transition={{ duration, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-bruma-light/10 bg-petroleo px-6 py-5">
              <h2 className="text-lg font-medium text-bruma-light">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="flex size-9 items-center justify-center rounded-full bg-bruma-light/10 text-bruma-light/60 transition hover:bg-bruma-light/15 hover:text-bruma-light"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
