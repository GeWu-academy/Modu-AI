"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NOTIFY_EVENT, type NotifyDetail } from "@/host/webHost";

interface Toast {
  id: number;
  level: NotifyDetail["level"];
  message: string;
}

const DISMISS_AFTER_MS = 4000;

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let counter = 0;
    function onNotify(event: Event) {
      const detail = (event as CustomEvent<NotifyDetail>).detail;
      const id = ++counter;
      setToasts((previous) => [...previous, { id, ...detail }]);
      window.setTimeout(() => {
        setToasts((previous) => previous.filter((toast) => toast.id !== id));
      }, DISMISS_AFTER_MS);
    }
    window.addEventListener(NOTIFY_EVENT, onNotify);
    return () => window.removeEventListener(NOTIFY_EVENT, onNotify);
  }, []);

  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.92, transition: { duration: 0.16 } }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className={`toast toast-${toast.level}`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
