export const C = {
  bg: "#080412",
  bg2: "#0d0618",
  card: "rgba(20,8,48,0.75)",
  border: "rgba(139,92,246,0.18)",
  borderHi: "rgba(139,92,246,0.45)",
  purple: "#8b5cf6",
  purpleHi: "#a78bfa",
  purpleDim: "#4c1d95",
  green: "#10b981",
  greenHi: "#34d399",
  greenDim: "#064e3b",
  cyan: "#06b6d4",
  red: "#f43f5e",
  redSoft: "rgba(244,63,94,0.12)",
  amber: "#fbbf24",
  text: "#f0e6ff",
  textMid: "#c4b5fd",
  muted: "#7c6fa0",
  grad1: "linear-gradient(135deg,#8b5cf6 0%,#10b981 100%)",
};

export const FD = "'Outfit',sans-serif";
export const FM = "'JetBrains Mono',monospace";

export const gc = (color = C.purple, extra = {}) => ({
  background: "rgba(14,5,36,0.8)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${color}45`,
  borderRadius: "16px",
  boxShadow: `0 4px 28px ${color}14, inset 0 1px 0 ${color}20`,
  ...extra,
});

export const inputSt = {
  width: "100%",
  background: "rgba(10,4,24,0.85)",
  border: `1px solid ${C.border}`,
  borderRadius: "10px",
  padding: "11px 15px",
  color: C.text,
  fontSize: "14px",
  fontFamily: FD,
  transition: "border-color 0.2s,box-shadow 0.2s",
};

export const pillStyle = (bg, color, border) => ({
  display: "inline-block",
  padding: "3px 12px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.4px",
  background: bg,
  color,
  border: `1px solid ${border}`,
  fontFamily: FD,
});
