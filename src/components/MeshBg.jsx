import React from "react";

export function MeshBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 18% 10%,rgba(76,29,149,0.38) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 82% 82%,rgba(16,185,129,0.13) 0%,transparent 60%),#080412" }} />
      <div style={{ position: "absolute", width: "520px", height: "520px", borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.11) 0%,transparent 70%)", top: "-110px", left: "-110px", animation: "float 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 70%)", bottom: "-90px", right: "-90px", animation: "float 11s ease-in-out infinite reverse" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.04) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
    </div>
  );
}
