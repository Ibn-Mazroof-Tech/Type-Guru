"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open:     boolean;
  onClose:  () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative z-10 card p-8 max-w-sm w-[90%] border-brand-cyan/25", className)}>
        <button onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
