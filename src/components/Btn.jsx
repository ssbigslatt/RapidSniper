import React from "react";
import { C, FD } from "../constants";

export function Btn({ children, onClick, variant = "primary", style: ex = {}, disabled }) {
  const V = {
    primary: { background: C.grad1, color: "#fff", border: "none", boxShadow: `0 4px 18px ${C.purple}40` },
    ghost: { background: "transparent", color: C.textMid, border: `1px solid ${C.border}` },
    danger: { background: "linear-gradient(135deg,#f43f5e,#e11d48)", color: "#fff", border: "none", boxShadow: "0 4px 18px rgba(244,63,94,0.35)" },
    success: { background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", boxShadow: "0 4px 18px rgba(16,185,129,0.35)" },
    amber: { background: "linear-gradient(135deg,#fbbf24,#d97706)", color: "#1a0a00", border: "none", boxShadow: "0 4px 18px rgba(251,191,36,0.35)" },
    outline: { background: "rgba(139,92,246,0.09)", color: C.purpleHi, border: `1px solid ${C.borderHi}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} className="btn-hover"
      style={{
        fontFamily: FD, fontWeight: "600", fontSize: "13px", letterSpacing: "0.4px",
        padding: "10px 20px", borderRadius: "10px", cursor: disabled ? "not-allowed" : "pointer", ...V[variant], ...ex
      }}>
      {children}
    </button>
  );
}
