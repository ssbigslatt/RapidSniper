import React, { useState, useEffect } from "react";
import axios from "axios";
import { C, FD, FM, gc, inputSt } from "../constants";
import { Btn } from "../components/Btn";
import { SubIndexSection } from "../components/SubIndexSection";
import { ManageModal } from "../components/ManageModal";
import { WinModal } from "../components/WinModal";
import { LoseModal } from "../components/LoseModal";
import { TradeCard } from "../components/TradeCard";

export function Trades({ trades, sessionTrades, onResult, onAdd, onRemove, user, balance: dbBalance, onBalanceUpdate }) {
  const [activeModal, setActiveModal] = useState(null);
  const [pnlInputs, setPnlInputs] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [startingBalance, setStartingBalance] = useState("");
  const [editingBalance, setEditingBalance] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [riskPercent, setRiskPercent] = useState("1.00");
  const [targetPercent, setTargetPercent] = useState("20.00");
  const [editingAnalytics, setEditingAnalytics] = useState(false);

  // Sync balance and analytics with backend
  useEffect(() => {
    if (dbBalance) {
      setStartingBalance(dbBalance.starting_balance?.toString() || "0");
      setRiskPercent(dbBalance.risk_percent?.toString() || "1.00");
      setTargetPercent(dbBalance.target_percent?.toString() || "20.00");
    }
  }, [dbBalance]);

  const handleUpdateBalance = async (reset = false) => {
    if (!user?.id || startingBalance === "") return;
    try {
      setLoadingBalance(true);
      await axios.post("http://localhost:8000/api/balances/update_balance/", {
        user: user.id,
        starting_balance: parseFloat(startingBalance),
        risk_percent: parseFloat(riskPercent),
        target_percent: parseFloat(targetPercent),
        reset: reset
      });
      onBalanceUpdate(); // Trigger refresh in App.jsx
      setEditingBalance(false);
      setEditingAnalytics(false);
    } catch (err) {
      console.error("Error updating balance:", err);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Use sessionTrades for active metrics
  const rec = sessionTrades.filter(t => t.result === "WIN" || t.result === "LOSS" || t.result === "BE");
  const wins = rec.filter(t => t.result === "WIN").length;
  const losses = rec.filter(t => t.result === "LOSS").length;
  const pnl = rec.reduce((a, t) => a + (parseFloat(t.pnl) || 0), 0);
  const wr = (wins + losses) > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

  // Filter templates for display (trades without a result)

  const templates = trades.filter(t => !t.result);
  
  const currencies = templates.filter(t => t.category === "currency");
  const allIndices = templates.filter(t => t.category === "index");
  const derivIndices = templates.filter(t => t.subcategory === "deriv");
  const weltradeIndices = templates.filter(t => t.subcategory === "weltrade");

  // Capital growth calculations
  const balStart = dbBalance ? parseFloat(dbBalance.starting_balance) : 0;
  const rPct = parseFloat(riskPercent) || 0;
  const tPct = parseFloat(targetPercent) || 0;
  
  const currentBal = balStart + pnl;
  const growthPct = balStart > 0 ? ((pnl / balStart) * 100) : 0;
  const projectedBal = currentBal; // Or maybe targetBal? The user said reset projected balance.
  const riskPer = balStart > 0 ? (balStart * (rPct / 100)) : 0; 
  const targetBal = balStart > 0 ? balStart * (1 + (tPct / 100)) : 0; 

  const handleSave = (result, notes) => {
    if (!activeModal) return;
    const id = activeModal.id;
    let p = pnlInputs[id] !== undefined ? parseFloat(pnlInputs[id]) : (trades.find(t => t.id === id)?.pnl || 0);
    
    // Auto-apply risk amount if result is loss and no PnL was manually entered
    if ((result === "loss" || result === "LOSS") && (p === 0 || pnlInputs[id] === undefined)) {
      p = -riskPer;
    } else if ((result === "loss" || result === "LOSS") && p > 0) {
      // If they entered a positive number for a loss, make it negative
      p = -p;
    }

    onResult(id, result, notes, p);
    setActiveModal(null);
  };

  const tabs = [
    { id: "all", label: `All (${trades.length})`, icon: "◉" },
    { id: "currency", label: `Currencies (${currencies.length})`, icon: "💱" },
    { id: "deriv", label: `Deriv (${derivIndices.length})`, icon: "🔷" },
    { id: "weltrade", label: `Weltrade (${weltradeIndices.length})`, icon: "🌐" },
    
  ];

const handleSeedDefaults = async () => {
    const defaults = [
      { p: 'EURUSD', c: 'currency', s: null },
      { p: 'GBPUSD', c: 'currency', s: null },
      { p: 'XAUUSD (GOLD)', c: 'currency', s: null },
      { p: 'Volatility 75 Index', c: 'index', s: 'deriv' },
      { p: 'Volatility 100 Index', c: 'index', s: 'deriv' },
      { p: 'Step Index', c: 'index', s: 'deriv' },
      { p: 'NAS100', c: 'index', s: 'weltrade' },
      { p: 'US30', c: 'index', s: 'weltrade' },
    ];
    
    setLoadingBalance(true);
    try {
      for (const d of defaults) {
        await onAdd(d.p, d.c, d.s);
      }
    } catch (err) {
      console.error("Error seeding defaults:", err);
    } finally {
      setLoadingBalance(false);
    }
 };

  return (
    <div style={{ padding: "32px 24px", maxWidth: "1200px", margin: "0 auto", fontFamily: FD }} className="fade-up">
      {/* ── Header ── */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "inline-block", padding: "3px 14px", borderRadius: "20px", background: `${C.purple}12`, border: `1px solid ${C.border}`, color: C.purpleHi, fontSize: "11px", fontWeight: "700", letterSpacing: "1px", marginBottom: "10px" }}>
            PERFORMANCE TRACKER
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px", marginBottom: "3px", color: C.text }}>Trades <span style={{ color: C.purpleHi }}>(PnL)</span></h2>
          <div style={{ color: C.muted, fontSize: "13px" }}>{rec.length}/{trades.length} recorded · {currencies.length} FX · {derivIndices.length} Deriv · {weltradeIndices.length} Weltrade</div>
        </div>
      </div>

      {/* ── Empty State ── */}
      {trades.length === 0 && (
        <div style={{ ...gc(C.purple), padding: "60px 40px", textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔭</div>
          <h3 style={{ fontSize: "24px", fontWeight: "900", color: C.text, marginBottom: "12px" }}>Your Watchlist is Empty</h3>
          <p style={{ color: C.muted, maxWidth: "500px", margin: "0 auto 32px", lineHeight: "1.7" }}>
            To see win/lose buttons and track your performance, you need to add some assets to your watchlist first.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={handleSeedDefaults} variant="primary" disabled={loadingBalance}>
              {loadingBalance ? "Setting up..." : "🚀 Load Default Assets"}
            </Btn>
            <Btn onClick={() => setShowManage(true)} variant="outline">
              ⚙ Manual Setup
            </Btn>
          </div>
        </div>
      )}
      {/* ── BALANCE CARD ─────────────────────────────────────────── */}
      <div style={{ ...gc(C.green), padding: "24px 28px", marginBottom: "24px", display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
        {/* Subtle background glow */}
        <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "150px", height: "150px", background: `${C.green}15`, filter: "blur(60px)", borderRadius: "50%", pointerEvents: "none" }} />
        
        {/* Left — Starting Balance (Editable) */}
        <div style={{ flex: "1 1 240px", minWidth: "220px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: C.greenHi, letterSpacing: "1.8px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🏁</span> STARTING BALANCE
          </div>
          
          {editingBalance || !dbBalance ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: C.greenHi, fontSize: "18px", fontWeight: "700", fontFamily: FM }}>$</span>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={startingBalance}
                    onChange={e => setStartingBalance(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { handleUpdateBalance(true); } }}
                    style={{ 
                      ...inputSt, 
                      paddingLeft: "32px", 
                      height: "48px",
                      fontSize: "20px", 
                      fontFamily: FM, 
                      fontWeight: "800", 
                      color: C.greenHi,
                      background: "rgba(16,185,129,0.06)",
                      border: `1px solid ${C.green}40`,
                      boxShadow: `0 0 20px ${C.green}10`,
                      outline: "none"
                    }} 
                  />
                </div>
                <Btn 
                  onClick={() => handleUpdateBalance(true)} 
                  variant="success" 
                  disabled={loadingBalance}
                  style={{ height: "48px", padding: "0 24px", fontSize: "13px", fontWeight: "700", borderRadius: "10px", boxShadow: `0 4px 15px ${C.green}30` }}
                >
                  {loadingBalance ? "SAVING..." : "RESET"}
                </Btn>
              </div>
              <div style={{ fontSize: "11px", color: C.muted, display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ opacity: 0.7 }}>ℹ</span> Press Enter or click Reset to update starting balance and reset session stats
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", background: "rgba(16,185,129,0.04)", padding: "12px 16px", borderRadius: "12px", border: `1px solid ${C.green}15` }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "36px", fontWeight: "900", color: C.greenHi, fontFamily: FM, lineHeight: "1", letterSpacing: "-1px" }}>
                  ${balStart.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <button 
                onClick={() => { setStartingBalance(balStart); setEditingBalance(true); }} 
                className="btn-hover"
                style={{ 
                  background: "rgba(124,111,160,0.1)", 
                  border: `1px solid ${C.border}`, 
                  borderRadius: "8px", 
                  color: C.textMid, 
                  padding: "6px 14px", 
                  fontSize: "11px", 
                  cursor: "pointer", 
                  fontFamily: FD, 
                  fontWeight: "700",
                  transition: "all 0.2s"
                }}
              >
                ✏️ EDIT
              </button>
            </div>
          )}
        </div>

        {/* Right — analytics (Current Balance is non-editable and comes from db/calc) */}
        {dbBalance && (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flex: "2 1 400px" }}>
            {[
              { l: "CURRENT BALANCE", v: `$${currentBal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, c: C.greenHi, icon: "💰" },
              { l: "WIN RATE", v: `${wr}%`, c: C.purpleHi, icon: "🎯" },
              { l: "WINS", v: wins, c: C.greenHi, icon: "✅" },
              { l: "LOSSES", v: losses, c: C.red, icon: "❌" },
              { l: "NET PnL", v: `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(0)}`, c: pnl >= 0 ? C.greenHi : C.red, icon: "�" },
            ].map(s => (
              <div key={s.l} style={{ ...gc(), padding: "12px 16px", minWidth: "120px", flex: "1 1 120px", background: "rgba(8,4,20,0.7)" }}>
                <div style={{ fontSize: "9px", fontWeight: "700", color: C.muted, letterSpacing: "1px", marginBottom: "4px" }}>{s.icon} {s.l}</div>
                <div style={{ fontSize: "16px", fontWeight: "900", color: s.c, fontFamily: FM }}>{s.v}</div>
              </div>
            ))}

            {/* Editable Risk/Target section */}
            <div style={{ ...gc(), padding: "12px 16px", minWidth: "250px", flex: "1 1 250px", background: "rgba(8,4,20,0.7)", position: "relative" }}>
              {!editingAnalytics ? (
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "9px", fontWeight: "700", color: C.muted, letterSpacing: "1px", marginBottom: "4px" }}>⚠ {rPct}% RISK / TRADE</div>
                    <div style={{ fontSize: "16px", fontWeight: "900", color: C.purpleHi, fontFamily: FM }}>${riskPer.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "9px", fontWeight: "700", color: C.muted, letterSpacing: "1px", marginBottom: "4px" }}>🏆 {tPct}% TARGET</div>
                    <div style={{ fontSize: "16px", fontWeight: "900", color: C.cyan, fontFamily: FM }}>${targetBal.toLocaleString(undefined, { minimumFractionDigits: 0 })}</div>
                  </div>
                  <button onClick={() => setEditingAnalytics(true)} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: "12px", opacity: 0.6 }}>✏️</button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "8px", color: C.muted, marginBottom: "2px" }}>RISK %</div>
                    <input type="number" value={riskPercent} onChange={e => setRiskPercent(e.target.value)} style={{ ...inputSt, height: "30px", fontSize: "12px", background: "rgba(0,0,0,0.3)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "8px", color: C.muted, marginBottom: "2px" }}>TARGET %</div>
                    <input type="number" value={targetPercent} onChange={e => setTargetPercent(e.target.value)} style={{ ...inputSt, height: "30px", fontSize: "12px", background: "rgba(0,0,0,0.3)" }} />
                  </div>
                  <Btn onClick={handleUpdateBalance} variant="success" style={{ padding: "5px 10px", fontSize: "10px", height: "30px" }}>SAVE</Btn>
                </div>
              )}
            </div>

            {/* Growth progress bar */}
            <div style={{ width: "100%", ...gc(), padding: "12px 16px", background: "rgba(8,4,20,0.7)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", color: C.muted, letterSpacing: "1px" }}>PROGRESS TO {tPct}% TARGET</span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: C.cyan, fontFamily: FM }}>{Math.min(Math.max((growthPct / tPct) * 100, 0), 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: "6px", background: "rgba(0,0,0,0.3)", borderRadius: "6px", overflow: "hidden", border: `1px solid ${C.border}` }}>
                <div style={{ height: "100%", width: `${Math.min(Math.max((growthPct / tPct) * 100, 0), 100)}%`, background: `linear-gradient(90deg,${C.green},${C.cyan})`, borderRadius: "6px", transition: "width 0.5s ease", boxShadow: `0 0 8px ${C.green}80` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontSize: "10px", color: C.muted }}>$0</span>
                <span style={{ fontSize: "10px", color: C.cyan }}>${targetBal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Category Tabs ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "6px", background: "rgba(14,5,36,0.8)", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "5px", width: "fit-content", flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveCategory(tab.id)} className="btn-hover"
              style={{
                fontFamily: FD, fontWeight: "700", fontSize: "11px", padding: "8px 16px", borderRadius: "9px", cursor: "pointer", border: "none",
                background: activeCategory === tab.id ? C.purple : "transparent",
                color: activeCategory === tab.id ? "#fff" : C.muted,
                boxShadow: activeCategory === tab.id ? `0 4px 14px ${C.purple}40` : "none",
                transition: "all 0.2s"
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <Btn onClick={() => setShowManage(true)} variant="outline" style={{ padding: "10px 18px", fontSize: "12px", flexShrink: 0 }}>
          ⚙ Manage Assets
        </Btn>
      </div>

      {/* Currencies section */}
      {(activeCategory === "all" || activeCategory === "currency") && (
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg,${C.purple},${C.purpleHi})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", boxShadow: `0 4px 14px ${C.purple}40` }}>💱</div>
            <div>
              <div style={{ fontSize: "10px", fontWeight: "700", color: C.purpleHi, letterSpacing: "1px" }}>CATEGORY 01</div>
              <div style={{ fontSize: "18px", fontWeight: "900", color: C.text }}>Currencies</div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: "12px", color: C.muted }}>{currencies.filter(t => t.result).length}/{currencies.length} done</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "10px" }}>
            {currencies.map(trade => (
              <TradeCard key={trade.id} trade={trade} onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal} />
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {activeCategory === "all" && <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,${C.border},transparent)`, margin: "4px 0 28px" }} />}

      {/* Indices section */}
      {(activeCategory === "all" || activeCategory === "deriv" || activeCategory === "weltrade") && (
        <div style={{ marginBottom: "8px" }}>
          {(activeCategory === "all" || activeCategory === "deriv" || activeCategory === "weltrade") && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg,${C.cyan},#0284c7)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", boxShadow: `0 4px 14px ${C.cyan}40` }}>📊</div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: "700", color: C.cyan, letterSpacing: "1px" }}>CATEGORY 02</div>
                <div style={{ fontSize: "18px", fontWeight: "900", color: C.text }}>Indices</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: "12px", color: C.muted }}>{allIndices.filter(t => t.result).length}/{allIndices.length} done</div>
            </div>
          )}

          {/* Deriv sub-section */}
          {(activeCategory === "all" || activeCategory === "deriv") && (
            <div style={{ paddingLeft: "0", marginBottom: "24px" }}>
              <SubIndexSection title="Deriv Indices" icon="🔷" trades={derivIndices} color={C.cyan} catNum="2A"
              
                onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal} />
            </div>
          )}

          {activeCategory === "all" && <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,rgba(139,92,246,0.1),transparent)`, margin: "4px 0 20px" }} />}

          {/* Weltrade sub-section */}
          {(activeCategory === "all" || activeCategory === "weltrade") && (
            <div style={{ marginBottom: "8px" }}>
              <SubIndexSection title="Weltrade Indices" icon="🌐" trades={weltradeIndices} color="#c084fc" catNum="2B"
                onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal} />
            </div>
          )}
        </div>
      )}

      {showManage && <ManageModal trades={trades} onAdd={onAdd} onRemove={onRemove} onClose={() => setShowManage(false)} />}
      {activeModal?.type === "win" && <WinModal onClose={() => setActiveModal(null)} onSave={handleSave} />}
      {activeModal?.type === "lose" && <LoseModal onClose={() => setActiveModal(null)} onSave={handleSave} />}
    </div>
  );
}