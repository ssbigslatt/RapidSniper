import React from "react";
import { C, gc, FM } from "../constants";

export function CheckRow({ i, text, checked, onToggle, color }) {
  return (
    <div onClick={onToggle} className="card-hover"
      style={{ ...gc(checked ? color : C.purple), padding: "15px 18px", display: "flex", alignItems: "center", gap: "13px", cursor: "pointer", userSelect: "none", background: checked ? `${color}0a` : "rgba(14,5,36,0.8)" }}>
      <div style={{ width: "22px", height: "22px", minWidth: "22px", borderRadius: "6px", border: `2px solid ${checked ? color : C.border}`, background: checked ? `linear-gradient(135deg,${color},${color}cc)` : "transparent", display: "flex", alignItems: "center", justifyContent:"center", fontSize: "12px", color: "#fff", fontWeight: "800", transition: "all 0.2s", boxShadow: checked ? `0 0 10px ${color}55` : "" }}>
        {checked && "✓"}
      </div>
      <div style={{ fontSize: "11px", fontWeight: "700", color: checked ? color : C.muted, fontFamily: FM, minWidth: "22px" }}>{String(i + 1).padStart(2, "0")}</div>
      <div style={{ fontSize: "14px", fontWeight: checked ? "400" : "500", color: checked ? C.muted : C.text, textDecoration: checked ? "line-through" : "none", lineHeight: "1.5", transition: "all 0.2s" }}>{text}</div>
    </div>
  );
}
