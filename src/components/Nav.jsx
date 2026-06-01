import React from "react";
import { C, FD, gc } from "../constants";
import { Btn } from "./Btn";

export function Nav({ page, setPage, onLogout, user }) {
  const pages = [
    { id: "home", label: "Home", icon: "⌂" },
    { id: "road", label: "Road to Sniper", icon: "🗺" },
    { id: "analysis", label: "Chart Markup", icon: "◈" },
    { id: "entry", label: "Entry Criteria", icon: "⊕" },
    { id: "exit", label: "Closing Criteria", icon: "◎" },
    { id: "trades", label: "Trades (PnL)", icon: "◑" },
    { id: "history", label: "History", icon: "▦" },
    { id: "manage_db", label: "Manage DB", icon: "⚙️" },
    { id: "trading", label: "Trading", icon: "📈" },
    { id: "backtesting", label: "Backtesting", icon: "🔒", soon: true },
  ];

  return (
    <div
      style={{
        background: "rgba(8,4,18,0.9)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        flexWrap: "wrap",
        minHeight: "58px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        fontFamily: FD,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: C.grad1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            boxShadow: `0 4px 12px ${C.purple}40`,
          }}
        >
          ⚡
        </div>
        <span
          style={{
            fontWeight: "800",
            fontSize: "14px",
            background: C.grad1,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          RAPID SNIPER
        </span>
      </div>
      <div
        style={{ display: "flex", gap: "3px", flexWrap: "wrap", padding: "7px 0" }}
      >
        {pages.map((p) =>
          p.soon ? (
            <div
              key={p.id}
              className="btn-hover"
              style={{
                fontFamily: FD,
                fontWeight: "500",
                fontSize: "12px",
                background: "rgba(251,191,36,0.06)",
                border: "1px solid rgba(251,191,36,0.18)",
                borderRadius: "8px",
                color: "rgba(251,191,36,0.45)",
                padding: "7px 13px",
                cursor: "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                position: "relative",
              }}
            >
              {p.icon} {p.label}
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: "700",
                  color: "rgba(251,191,36,0.6)",
                  background: "rgba(251,191,36,0.12)",
                  border: "1px solid rgba(251,191,36,0.25)",
                  borderRadius: "4px",
                  padding: "1px 5px",
                  letterSpacing: "0.5px",
                }}
              >
                SOON
              </span>
            </div>
          ) : (
            <button
              key={p.id}
              onClick={() => setPage(p.id)}
              className="btn-hover"
              style={{
                fontFamily: FD,
                fontWeight: page === p.id ? "700" : "500",
                fontSize: "12px",
                background:
                  page === p.id ? "rgba(139,92,246,0.18)" : "transparent",
                border:
                  page === p.id ? `1px solid ${C.purple}55` : "1px solid transparent",
                borderRadius: "8px",
                color: page === p.id ? C.purpleHi : C.muted,
                padding: "7px 13px",
                cursor: "pointer",
                boxShadow: page === p.id ? `0 0 10px ${C.purple}22` : "none",
              }}
            >
              {p.icon} {p.label}
            </button>
          )
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            background: "rgba(139,92,246,0.09)",
            border: `1px solid ${C.border}`,
            borderRadius: "20px",
            padding: "5px 11px 5px 7px",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: C.grad1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            {user[0].toUpperCase()}
          </div>
          <span style={{ color: C.textMid, fontSize: "12px", fontWeight: "600" }}>
            {user}
          </span>
        </div>
        <Btn
          onClick={onLogout}
          variant="ghost"
          style={{
            padding: "7px 13px",
            fontSize: "12px",
            borderColor: "rgba(244,63,94,0.28)",
            color: C.red,
          }}
        >
          Logout
        </Btn>
      </div>
    </div>
  );
}
