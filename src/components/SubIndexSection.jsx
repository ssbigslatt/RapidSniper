import React from "react";
import { C } from "../constants";
import { TradeCard } from "./TradeCard";

export function SubIndexSection({ title, icon, trades, color, catNum, onResult, pnlInputs, setPnlInputs, setActiveModal }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", paddingLeft: "4px" }}>
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: `linear-gradient(135deg,${color}70,${color}30)`,
          border: `1px solid ${color}45`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px"
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: "9px", fontWeight: "700", color: color, letterSpacing: "1px" }}>SUB-CATEGORY {catNum}</div>
          <div style={{ fontSize: "15px", fontWeight: "800", color: C.text }}>{title}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: "11px", color: C.muted }}>
          {trades.filter(t => t.result).length}/{trades.length}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "10px" }}>
        {trades.map(trade => (
          <TradeCard
            key={trade.id}
            trade={trade}
            onResult={onResult}
            pnlInputs={pnlInputs}
            setPnlInputs={setPnlInputs}
            setActiveModal={setActiveModal}
          />
        ))}
      </div>
    </div>
  );
}
