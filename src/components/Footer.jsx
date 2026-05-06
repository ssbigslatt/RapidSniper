import React from "react";
import { C, FD } from "../constants";

export function Footer() {
  return (
    <footer
      style={{
        marginTop: "80px",
        padding: "40px 24px",
        borderTop: `1px solid ${C.border}`,
        textAlign: "center",
        fontFamily: FD,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: C.purpleHi, fontSize: "16px" }}>📞</span>
          <span style={{ color: C.textMid, fontSize: "13px", fontWeight: "600" }}>+263 788 273 102</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: C.purpleHi, fontSize: "16px" }}>📧</span>
          <a
            href="mailto:mapamulachristian@gmail.com"
            style={{ color: C.textMid, fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
          >
            mapamulachristian@gmail.com
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: C.purpleHi, fontSize: "16px" }}>📍</span>
          <span style={{ color: C.textMid, fontSize: "13px", fontWeight: "600" }}>
            9002 Unit K Seke Chitungwiza
          </span>
        </div>
      </div>
      <div
        style={{
          fontSize: "12px",
          color: C.muted,
          letterSpacing: "1px",
          fontWeight: "700",
          textTransform: "uppercase",
        }}
      >
        © COPYRIGHT 2026 · TRADING SNIPER
      </div>
    </footer>
  );
}
