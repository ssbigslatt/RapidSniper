import React from "react";
import { C, FD } from "../constants";

export function CircleStat({ value, max, label, sub, color, size = 110 }) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = 40; const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="10" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${pct * circ} ${circ}`} strokeDashoffset={circ / 4}
          strokeLinecap="round" style={{ 
            transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)",
            filter: `drop-shadow(0 0 3px ${color}44)`
          }} />
        <text x="50" y="47" textAnchor="middle" fill={color} fontSize="17" fontWeight="700" fontFamily={FD}>{sub}</text>
        <text x="50" y="62" textAnchor="middle" fill={C.muted} fontSize="9" fontFamily={FD}>{label}</text>
      </svg>
    </div>
  );
}
