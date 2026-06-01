import React, { useState } from "react";
import { C, FD, FM, gc, pillStyle } from "../constants";
import { CircleStat } from "../components/CircleStat";
import { WinModal } from "../components/WinModal";
import { LoseModal } from "../components/LoseModal";
import { MiniStatsCard } from "../components/MiniStatsCard";

export function History({ trades = [], balance, onResult }) {
  const [period, setPeriod] = useState("all");
  const [activeModal, setActiveModal] = useState(null);

  const balStart = balance ? parseFloat(balance.starting_balance) : 0;

  const handleSave = (result, notes) => {
    if (!activeModal) return;
    const id = activeModal.id;
    const trade = trades.find(t => t.id === id);
    onResult(id, result, notes, trade?.pnl || 0);
    setActiveModal(null);
  };
  const now = new Date();
  const sod = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = sod(now);

  const inP = t => {
    if (!t.date) return false;
    const d = new Date(t.date);
    if (isNaN(d.getTime())) return false;
    if (period === "today") return d >= today;
    if (period === "yesterday") { const y = new Date(today); y.setDate(y.getDate() - 1); return d >= y && d < today; }
    if (period === "this_week") { const w = new Date(today); w.setDate(w.getDate() - w.getDay()); return d >= w; }
    if (period === "last_week") { const w = new Date(today); w.setDate(w.getDate() - w.getDay()); const lw = new Date(w); lw.setDate(lw.getDate() - 7); return d >= lw && d < w; }
    if (period === "this_month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === "last_month") { const s = new Date(now.getFullYear(), now.getMonth() - 1, 1); const e = new Date(now.getFullYear(), now.getMonth(), 1); return d >= s && d < e; }
    return true;
  };

  const safeTrades = Array.isArray(trades) ? trades : [];
  
  const f = safeTrades.filter(t => (t.result === "WIN" || t.result === "LOSS" || t.result === "BE") && inP(t));
  const wins = f.filter(t => t.result === "WIN");
  const losses = f.filter(t => t.result === "LOSS");
  const be = f.filter(t => t.result === "BE");
  const totalWL = wins.length + losses.length;
  const wr = totalWL > 0 ? Math.round((wins.length / totalWL) * 100) : 0;
  const lossRate = totalWL > 0 ? Math.round((losses.length / totalWL) * 100) : 0;
  const pnl = f.reduce((a, t) => a + (parseFloat(t.pnl) || 0), 0);
  const periods = [
    { id: "all", l: "All Time" },
    { id: "this_month", l: "This Month" },
    { id: "last_month", l: "Last Month" },
    { id: "this_week", l: "This Week" },
    { id: "last_week", l: "Last Week" },
    { id: "today", l: "Today" },
    { id: "yesterday", l: "Yesterday" }
  ];

  return (
    <div style={{ padding: "40px 24px", maxWidth: "1040px", margin: "0 auto", fontFamily: FD }} className="fade-up">
      <MiniStatsCard trades={trades} balance={balance} />
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "inline-block", padding: "3px 14px", borderRadius: "20px", background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.22)", color: "#c084fc", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", marginBottom: "11px" }}>ANALYTICS</div>
        <h2 style={{ fontSize: "30px", fontWeight: "900", letterSpacing: "-0.5px" }}>Trade <span style={{ background: C.grad1, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>History</span></h2>
      </div>

      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "28px" }}>
        {periods.map(p => (
          <button key={p.id} onClick={() => setPeriod(p.id)} className="btn-hover"
            style={{
              fontFamily: FD, fontWeight: "600", fontSize: "12px", padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
              background: period === p.id ? C.grad1 : "rgba(139,92,246,0.08)",
              border: `1px solid ${period === p.id ? "transparent" : C.border}`,
              color: period === p.id ? "#fff" : C.muted,
              boxShadow: period === p.id ? `0 4px 14px ${C.purple}38` : "none"
            }}>
            {p.l}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "28px" }}>
        <div style={{ ...gc(), padding: "26px 32px", display: "flex", gap: "32px", flexWrap: "wrap", justifyContent: "center", alignItems: "center", flex: "1 1 300px" }}>
          <CircleStat value={wr} max={100} label="WIN RATE" sub={`${wr}%`} color={C.purple} size={120} />
          <CircleStat value={wins.length} max={Math.max(totalWL, 1)} label="WINS" sub={`${wins.length}`} color={C.green} size={120} />
          <CircleStat value={losses.length} max={Math.max(totalWL, 1)} label="LOSSES" sub={`${losses.length}`} color={C.red} size={120} />
          {be.length > 0 && (
            <CircleStat value={be.length} max={Math.max(f.length, 1)} label="BREAK EVEN" sub={`${be.length}`} color={C.purpleHi} size={120} />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: "0 1 175px" }}>
          <div style={{ ...gc(C.purple), padding: "20px 22px", flex: 1 }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: C.muted, letterSpacing: "1px" }}>TRADING BALANCE</div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: C.purpleHi, marginTop: "5px", fontFamily: FM }}>${balStart.toLocaleString(undefined, { minimumFractionDigits: 0 })}</div>
          </div>
          <div style={{ ...gc(pnl >= 0 ? C.green : C.red), padding: "20px 22px", flex: 1 }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: C.muted, letterSpacing: "1px" }}>NET PnL</div>
            <div style={{ fontSize: "30px", fontWeight: "900", color: pnl >= 0 ? C.greenHi : C.red, marginTop: "5px", fontFamily: FM }}>{pnl >= 0 ? "+" : ""}${Number(pnl).toFixed(0)}</div>
          </div>
          <div style={{ ...gc(), padding: "20px 22px", flex: 1 }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: C.muted, letterSpacing: "1px" }}>TOTAL TRADES</div>
            <div style={{ fontSize: "30px", fontWeight: "900", color: C.purpleHi, marginTop: "5px", fontFamily: FM }}>{f.length}</div>
          </div>
        </div>
      </div>

      {f.length === 0 ? (
        <div style={{ ...gc(), padding: "52px", textAlign: "center", color: C.muted, fontSize: "14px", border: `1px dashed ${C.border}` }}>No recorded trades for this period.</div>
      ) : (
        <div style={{ display: "grid", gap: "11px" }}>
          {f.map(t => (
            <div key={t.id} className="card-hover" style={{ ...gc(t.result === "WIN" ? C.green : t.result === "BE" ? C.purple : C.red), padding: "18px 22px", display: "flex", gap: "18px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ minWidth: "95px" }}>
                <div style={{ fontSize: "10px", fontWeight: "600", color: C.muted, fontFamily: FM }}>#{String(t.id).padStart(2, "0")}</div>
                <div style={{ fontSize: "19px", fontWeight: "900", marginTop: "3px", letterSpacing: "-0.4px" }}>{t.pair}</div>
                <div style={{ marginTop: "5px" }}>
                  <span style={pillStyle(
                    t.result === "WIN" ? "rgba(16,185,129,0.14)" : t.result === "BE" ? "rgba(167,139,250,0.14)" : "rgba(244,63,94,0.14)", 
                    t.result === "WIN" ? C.greenHi : t.result === "BE" ? C.purpleHi : C.red, 
                    t.result === "WIN" ? `${C.green}45` : t.result === "BE" ? `${C.purple}45` : `${C.red}45`
                  )}>
                    {t.result === "WIN" ? "✓ WIN" : t.result === "BE" ? "○ BE" : "✗ LOSS"}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: C.muted, marginTop: "7px" }}>
                  {new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: "150px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: t.result === "WIN" ? C.green : t.result === "BE" ? C.purple : C.red, marginBottom: "7px", letterSpacing: "0.5px" }}>
                  {t.result === "WIN" ? "✦ SUCCESS NOTES" : t.result === "BE" ? "✦ NEUTRAL NOTES" : "✦ LOSS REASONS"}
                </div>
                <div style={{ fontSize: "13px", color: t.notes ? C.text : C.muted, lineHeight: "1.8", fontStyle: t.notes ? "normal" : "italic" }}>
                  {t.notes || "No notes recorded."}
                </div>
                <button 
                  onClick={() => setActiveModal({ id: t.id, type: t.result === "WIN" ? "win" : "lose" })}
                  className="btn-hover"
                  style={{ 
                    marginTop: "10px", 
                    background: "rgba(124,111,160,0.1)", 
                    border: `1px solid ${C.border}`, 
                    borderRadius: "6px", 
                    color: C.purpleHi, 
                    padding: "4px 10px", 
                    fontSize: "10px", 
                    fontWeight: "700", 
                    cursor: "pointer" 
                  }}
                >
                  ✏️ EDIT RESULT
                </button>
              </div>
              <div style={{ textAlign: "right", minWidth: "75px" }}>
                <div style={{ fontSize: "10px", fontWeight: "600", color: C.muted, letterSpacing: "1px" }}>PnL</div>
                <div style={{ fontSize: "22px", fontWeight: "900", color: (parseFloat(t.pnl) || 0) >= 0 ? C.greenHi : C.red, marginTop: "3px", fontFamily: FM }}>
                  {(parseFloat(t.pnl) || 0) >= 0 ? "+" : ""}${(parseFloat(t.pnl) || 0).toFixed(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeModal?.type === "win" && <WinModal onClose={() => setActiveModal(null)} onSave={handleSave} />}
      {activeModal?.type === "lose" && <LoseModal onClose={() => setActiveModal(null)} onSave={handleSave} />}
    </div>
  );
}
