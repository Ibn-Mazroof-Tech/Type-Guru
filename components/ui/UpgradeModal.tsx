"use client";
import { useRouter } from "next/navigation";
import { Modal } from "./Modal";

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl mb-3">🔒</div>
        <h2 className="font-brand text-brand-cyan text-lg mb-2">PRO MODE</h2>
        <p className="text-text-muted text-sm mb-5 leading-relaxed">
          Unlock Coding Typing, Arabic/Urdu, AI Coach & unlimited tests
        </p>
        <div className="font-mono text-3xl font-bold text-brand-gold mb-1">
          ₹11<span className="text-base text-text-muted">/day</span>
        </div>
        <p className="text-text-muted text-xs mb-5">or ₹299/month · 7-day free trial</p>
        <button
          onClick={() => { onClose(); router.push("/pricing"); }}
          className="btn-primary w-full text-sm mb-2">
          🚀 Start Free Trial
        </button>
        <button onClick={onClose} className="text-text-muted text-xs cursor-pointer hover:text-text-primary transition-colors">
          Maybe later
        </button>
      </div>
    </Modal>
  );
}
