"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define toast variants
type ToastVariant = "default" | "destructive" | "success";

// Define toast properties
interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

// Define the toast hook return type
interface ToastAction {
  toast: (props: {
    title?: string;
    description?: string;
    variant?: ToastVariant;
  }) => void;
}

// Toaster component to render all active toasts
export function Toaster() {
  // State to manage active toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Automatically remove toast after 3 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Handle manual toast dismissal
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-sm ${
              toast.variant === "destructive"
                ? "bg-red-600 text-white"
                : toast.variant === "success"
                ? "bg-green-600 text-white"
                : "bg-background text-foreground dark:bg-slate-800"
            }`}
          >
            {toast.variant === "destructive" && (
              <AlertCircle className="h-5 w-5 mt-0.5" />
            )}
            {toast.variant === "success" && (
              <CheckCircle className="h-5 w-5 mt-0.5" />
            )}
            <div className="flex-1">
              {toast.title && <h3 className="font-semibold">{toast.title}</h3>}
              {toast.description && (
                <p className="text-sm">{toast.description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeToast(toast.id)}
              aria-label="Close toast"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook to trigger toasts
export function useToast(): ToastAction {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync toasts with Toaster component via window events (since Toaster is global)
  useEffect(() => {
    const handleToast = (event: CustomEvent<Toast>) => {
      setToasts((prev) => [...prev, event.detail]);
    };

    window.addEventListener("add-toast", handleToast as EventListener);
    return () => {
      window.removeEventListener("add-toast", handleToast as EventListener);
    };
  }, []);

  // Function to trigger a new toast
  const toast = ({
    title,
    description,
    variant = "default",
  }: {
    title?: string;
    description?: string;
    variant?: ToastVariant;
  }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toastEvent = new CustomEvent("add-toast", {
      detail: { id, title, description, variant },
    });
    window.dispatchEvent(toastEvent);
  };

  return { toast };
}
