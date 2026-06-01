import React from "react";
import { C, FD, FM, gc } from "../constants";
import { Btn } from "./Btn";

export function StatsBar({ trades }) {
  const rec = trades.filter((t) => t.result === "WIN" || t.result === "LOSS" || t.result === "BE");
  const wins = rec.filter((t) => t.result === "WIN").length;
  const losses = rec.filter((t) => t.result === "LOSS").length;
  const wr = (wins + losses) > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;
  const pnl = rec.reduce((a, t) => a + (parseFloat(t.pnl) || 0), 0);

  return (
    <div
      className="slide-down"
      style={{
        position: "fixed",
        top: "66px",
        right: "12px",
        zIndex: 45,
        background: "rgba(8,3,22,0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${C.border}`,
        borderRadius: "12px",
        padding: "8px 12px",
        animation: "slideInDown 0.4s cubic-bezier(0.34,1.2,0.64,1) forwards",
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.2)`,
        display: "flex",
        gap: "12px",
        alignItems: "center",
      }}
    >
      {[
        { l: "WIN RATE", v: `${wr}%`, c: C.purpleHi },
        { l: "WINS", v: wins, c: C.greenHi },
        { l: "LOSSES", v: losses, c: C.red },
        {
          l: "PnL",
          v: `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(0)}`,
          c: pnl >= 0 ? C.greenHi : C.red,
        },
      ].map((s, i) => (
        <div
          key={s.l}
          style={{
            textAlign: "center",
            ...(i < 3
              ? { paddingRight: "14px", borderRight: `1px solid ${C.border}` }
              : {}),
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: "700",
              color: C.muted,
              letterSpacing: "0.8px",
              fontFamily: FD,
            }}
          >
            {s.l}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "900",
              color: s.c,
              fontFamily: FM,
              marginTop: "2px",
            }}
          >
            {s.v}
          </div>
        </div>
      ))}
    </div>
  );
}
