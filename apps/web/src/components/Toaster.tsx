"use client";

import { useEffect, useState } from "react";
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

  if (toasts.length === 0) {
    return null;
  }
  return (
    <div className="toasts">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.level}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
