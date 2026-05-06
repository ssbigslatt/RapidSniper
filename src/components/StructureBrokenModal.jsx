import React from "react";
import { C, FD, gc } from "../constants";
import { Btn } from "./Btn";

export function StructureBrokenModal({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(4,2,14,0.88)",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
        padding: "20px",
        fontFamily: FD,
      }}
    >
      <div
        className="pop-in"
        style={{
          ...gc(C.amber),
          padding: "36px 32px",
          maxWidth: "480px",
          width: "100%",
          borderColor: `${C.amber}55`,
          boxShadow: `0 0 60px rgba(251,191,36,0.18)`,
          animation:
            "warningPulse 2.5s ease-in-out infinite, popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <div style={{ fontSize: "44px", textAlign: "center", marginBottom: "14px" }}>
          ⚠️
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "900",
            color: C.amber,
            textAlign: "center",
            marginBottom: "16px",
            letterSpacing: "-0.3px",
          }}
        >
          Trend / Structure Broken!
        </div>
        <div
          style={{
            background: "rgba(251,191,36,0.08)",
            border: `1px solid rgba(251,191,36,0.25)`,
            borderRadius: "12px",
            padding: "18px 20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{ fontSize: "13px", color: C.text, lineHeight: "1.9", fontWeight: "500" }}
          >
            🔍 <strong style={{ color: C.amber }}>Analyze carefully:</strong> Is this a{" "}
            <span style={{ color: C.greenHi, fontWeight: "700" }}>
              fake-out (liquidity sweep)
            </span>{" "}
            or a <span style={{ color: C.red, fontWeight: "700" }}>true breakout</span>?
          </div>
        </div>
        <div
          style={{
            background: "rgba(139,92,246,0.08)",
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            padding: "16px 18px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: C.purpleHi,
              letterSpacing: "0.8px",
              marginBottom: "10px",
            }}
          >
            📌 NB — CHECK ON DIFFERENT TIMEFRAMES
          </div>
          <div style={{ fontSize: "13px", color: C.muted, lineHeight: "1.8" }}>
            Especially check the{" "}
            <span style={{ color: C.text, fontWeight: "700" }}>30-minute chart</span> for
            confluence before making any decision. Cross-reference with the 15min and 5min
            for confirmation.
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Btn onClick={onClose} variant="amber" style={{ flex: 1, padding: "13px" }}>
            Understood — I'll Check 🔍
          </Btn>
        </div>
      </div>
    </div>
  );
}
