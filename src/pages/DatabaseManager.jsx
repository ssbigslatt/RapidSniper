import React, { useState } from "react";
import axios from "axios";
import { C, FD, FM, gc, pillStyle } from "../constants";

export function DatabaseManager({ trades, onClearAll }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const totalTrades = trades.length;
  const completedTrades = trades.filter(t => t.result).length;
  const pendingTrades = totalTrades - completedTrades;
  
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trades, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "rapidsniper_trades_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete all your trades? This cannot be undone.")) return;
    
    setLoading(true);
    try {
      await onClearAll();
      setMessage("All trades have been successfully cleared.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error clearing trades:", err);
      setMessage("Failed to clear trades.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 24px", maxWidth: "800px", margin: "0 auto", fontFamily: FD }} className="fade-up">
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "inline-block", padding: "3px 14px", borderRadius: "20px", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.22)", color: C.red, fontSize: "11px", fontWeight: "700", letterSpacing: "1px", marginBottom: "11px" }}>SYSTEM</div>
        <h2 style={{ fontSize: "30px", fontWeight: "900", letterSpacing: "-0.5px" }}>Database <span style={{ background: C.grad1, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Management</span></h2>
        <p style={{ color: C.muted, fontSize: "14px", marginTop: "8px" }}>Manage your trade records, export data, and maintain system integrity.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div style={{ ...gc(), padding: "24px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: C.muted, letterSpacing: "1px" }}>TOTAL RECORDS</div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: C.purpleHi, marginTop: "8px", fontFamily: FM }}>{totalTrades}</div>
        </div>
        <div style={{ ...gc(C.green), padding: "24px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: C.muted, letterSpacing: "1px" }}>COMPLETED</div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: C.greenHi, marginTop: "8px", fontFamily: FM }}>{completedTrades}</div>
        </div>
        <div style={{ ...gc(C.amber), padding: "24px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: C.muted, letterSpacing: "1px" }}>PENDING</div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: C.amber, marginTop: "8px", fontFamily: FM }}>{pendingTrades}</div>
        </div>
      </div>

      <div style={{ ...gc(), padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Data Operations</h3>
          <p style={{ color: C.muted, fontSize: "13px" }}>Perform administrative actions on your trading data.</p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button 
            onClick={handleExport}
            className="btn-hover"
            style={{ 
              padding: "12px 24px", borderRadius: "10px", background: "rgba(139,92,246,0.1)", border: `1px solid ${C.purple}40`, 
              color: C.purpleHi, fontWeight: "700", cursor: "pointer", fontFamily: FD, fontSize: "14px",
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <span>📥</span> Export to JSON
          </button>

          <button 
            onClick={handleClear}
            disabled={loading || totalTrades === 0}
            className="btn-hover"
            style={{ 
              padding: "12px 24px", borderRadius: "10px", background: "rgba(244,63,94,0.1)", border: `1px solid ${C.red}40`, 
              color: C.red, fontWeight: "700", cursor: totalTrades === 0 ? "not-allowed" : "pointer", fontFamily: FD, fontSize: "14px",
              display: "flex", alignItems: "center", gap: "8px",
              opacity: (loading || totalTrades === 0) ? 0.5 : 1
            }}
          >
            <span>🗑️</span> Clear All Trades
          </button>
        </div>

        {message && (
          <div style={{ 
            padding: "12px 16px", borderRadius: "8px", background: message.includes("Failed") ? "rgba(244,63,94,0.1)" : "rgba(16,185,129,0.1)", 
            border: `1px solid ${message.includes("Failed") ? C.red : C.green}40`, color: message.includes("Failed") ? C.red : C.greenHi,
            fontSize: "13px", fontWeight: "600"
          }}>
            {message}
          </div>
        )}
      </div>

      <div style={{ marginTop: "32px", ...gc(), padding: "24px", borderStyle: "dashed", borderColor: "rgba(139,92,246,0.2)" }}>
        <h4 style={{ fontSize: "14px", fontWeight: "800", color: C.purpleHi, marginBottom: "12px" }}>System Information</h4>
        <div style={{ display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span style={{ color: C.muted }}>Database Engine</span>
            <span style={{ color: C.text, fontWeight: "600" }}>MySQL (XAMPP)</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span style={{ color: C.muted }}>Backend Framework</span>
            <span style={{ color: C.text, fontWeight: "600" }}>Django REST Framework</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span style={{ color: C.muted }}>Connected Database</span>
            <span style={{ color: C.text, fontWeight: "600" }}>rapidsniper_db</span>
          </div>
        </div>
      </div>
    </div>
  );
}
