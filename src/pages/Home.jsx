import React from "react";
import { C, FD, FM, gc } from "../constants";
import { Footer } from "../components/Footer";

export function Home({ setPage, trades, balance }) {
  const rec = trades.filter((t) => t.result === "WIN" || t.result === "LOSS" || t.result === "BE");
  const wins = rec.filter((t) => t.result === "WIN").length;
  const losses = rec.filter((t) => t.result === "LOSS").length;
  const pnl = rec.reduce((a, t) => a + (parseFloat(t.pnl) || 0), 0);

  const balStart = balance ? parseFloat(balance.starting_balance) : 0;
  const currentBal = balStart + pnl;

  const cards = [
    {
      id: "road",
      title: "Road to Rapid Sniper",
      sub: "10-Day Framework",
      desc: "Your structured journey from mindset to live execution — all 10 phases mapped to this app.",
      icon: "🗺",
      c1: "#a78bfa",
      c2: "#10b981",
    },
    {
      id: "analysis",
      title: "Chart Markup",
      sub: "Analysis Protocol",
      desc: "Zone identification, CHOCH mapping, structure confirmation and timeframe refinement.",
      icon: "◈",
      c1: "#06b6d4",
      c2: "#8b5cf6",
    },
    {
      id: "entry",
      title: "Entry Criteria",
      sub: "Execution Checklist",
      desc: "Imbalance fills, zone retests, confirmation signals, and reward ratio discipline.",
      icon: "⊕",
      c1: "#a78bfa",
      c2: "#10b981",
    },
    {
      id: "exit",
      title: "Closing Criteria",
      sub: "Trade Management",
      desc: "Supply/demand targets, trendline breaks, structure violations and trailing stops.",
      icon: "◎",
      c1: "#10b981",
      c2: "#34d399",
    },
    {
      id: "trades",
      title: "Trades (PnL)",
      sub: "Performance Tracker",
      desc: "Record trade outcomes, win/loss reasons, and track your PnL across 10 slots.",
      icon: "◑",
      c1: "#8b5cf6",
      c2: "#f43f5e",
    },
    {
      id: "history",
      title: "History",
      sub: "Trade Analytics",
      desc: "Filter by period, view win rate circles, PnL totals, and all trade notes.",
      icon: "▦",
      c1: "#c084fc",
      c2: "#10b981",
    },
  ];

  return (
    <div
      style={{ padding: "40px 24px", maxWidth: "1060px", margin: "0 auto", fontFamily: FD }}
      className="fade-up"
    >
      <div style={{ textAlign: "center", marginBottom: "44px" }}>
        <div
          style={{
            display: "inline-block",
            padding: "4px 18px",
            borderRadius: "20px",
            background: "rgba(139,92,246,0.11)",
            border: `1px solid ${C.border}`,
            color: C.purpleHi,
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "2px",
            marginBottom: "18px",
          }}
        >
          SNIPER FRAMEWORK v1.0
        </div>
        <h1
          style={{
            fontSize: "clamp(26px,5vw,52px)",
            fontWeight: "900",
            letterSpacing: "-1px",
            lineHeight: 1.1,
            marginBottom: "14px",
          }}
        >
          <span style={{ color: C.text }}>RAPID </span>
          <span
            style={{
              background: C.grad1,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SNIPER
          </span>
          <br />
          <span
            style={{ color: C.text, fontSize: "0.62em", fontWeight: "600", letterSpacing: "2px" }}
          >
            TRADING STRATEGY BUILDER
          </span>
        </h1>
        <p
          style={{
            color: "#0ea5e9", // Skyblue
            fontSize: "14px",
            maxWidth: "460px",
            margin: "0 auto",
            lineHeight: "1.7",
            fontWeight: "700",
            letterSpacing: "0.5px"
          }}
        >
          SNIPER OF THE SNIPEST
          <br />
          <span style={{ 
            fontSize: "11px", 
            fontStyle: "italic", 
            background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)", // Purple-blue gradient
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "700",
            letterSpacing: "0.5px" 
          }}>
            "Dont Take it Unless its a Sniper"
          </span>
        </p>
      </div>

      {/* Session Stats Summary */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "32px", justifyContent: "center" }}>
        {[
          { l: "WIN RATE", v: `${(wins + losses) > 0 ? Math.round((wins / (wins + losses)) * 100) : 0}%`, c: C.purple },
          { l: "WINS", v: wins, c: C.green },
          { l: "LOSSES", v: losses, c: C.red },
          { l: "NET PnL", v: `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(0)}`, c: pnl >= 0 ? C.greenHi : C.red },
          { l: "BALANCE", v: `$${currentBal.toLocaleString(undefined, { minimumFractionDigits: 0 })}`, c: C.greenHi }
        ].map(s => (
          <div key={s.l} style={{ ...gc(s.c), padding: "12px 24px", minWidth: "140px", textAlign: "center", background: "rgba(20,8,48,0.5)" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: C.muted, letterSpacing: "1px" }}>{s.l}</div>
            <div style={{ fontSize: "20px", fontWeight: "900", color: s.c, marginTop: "4px", fontFamily: FM }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Nav cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          marginBottom: "60px",
          maxWidth: "800px",
          margin: "0 auto 60px",
        }}
      >
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setPage(c.id)}
            className="card-hover"
            style={{
              ...gc(c.c1),
              padding: "40px 32px",
              textAlign: "left",
              cursor: "pointer",
              fontFamily: FD,
              color: C.text,
              animationDelay: `${i * 0.06}s`,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "32px",
              minHeight: "180px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "18px",
                background: `linear-gradient(135deg, ${c.c1}, ${c.c2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                flexShrink: 0,
                boxShadow: `0 10px 25px ${c.c1}50`,
              }}
            >
              {c.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "800",
                  color: c.c1,
                  letterSpacing: "2px",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                {c.sub}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "900",
                  marginBottom: "12px",
                  letterSpacing: "-0.5px",
                  color: C.text,
                }}
              >
                {c.title}
              </div>
              <div style={{ fontSize: "15px", color: C.muted, lineHeight: "1.7", maxWidth: "600px" }}>
                {c.desc}
              </div>
              <div style={{ marginTop: "20px", color: c.c1, fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                Explore Module <span style={{ fontSize: "18px" }}>→</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <Footer />
    </div>
  );
}
