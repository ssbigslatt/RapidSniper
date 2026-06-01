import { useState, useEffect, useRef } from "react";

/* ─── FONTS & GLOBAL STYLES ─────────────────────────────────────────────────*/
const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap";
document.head.appendChild(_fl);

const _st = document.createElement("style");
_st.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0d0618; }
  ::-webkit-scrollbar-thumb { background: #3d1f6e; border-radius: 3px; }
  @keyframes pulse-glow {
    0%,100% { box-shadow:0 0 20px rgba(139,92,246,0.3),0 0 60px rgba(139,92,246,0.1); }
    50% { box-shadow:0 0 32px rgba(139,92,246,0.55),0 0 90px rgba(139,92,246,0.2); }
  }
  @keyframes float {
    0%,100% { transform:translateY(0px); }
    50% { transform:translateY(-7px); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes popIn {
    0%   { opacity:0; transform:scale(0.88) translateY(10px); }
    70%  { transform:scale(1.02) translateY(-2px); }
    100% { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes slideDown {
    from { opacity:0; transform:translateY(-12px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes warningPulse {
    0%,100% { border-color:rgba(251,191,36,0.4); box-shadow:0 0 0 0 rgba(251,191,36,0.15); }
    50%     { border-color:rgba(251,191,36,0.8); box-shadow:0 0 20px 4px rgba(251,191,36,0.15); }
  }
  @keyframes slideInDown {
    from { opacity:0; transform:translateY(-16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .fade-up  { animation:fadeUp 0.45s ease forwards; }
  .slide-down { animation:slideInDown 0.4s cubic-bezier(0.34,1.2,0.64,1) forwards; }
  .pop-in   { animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .card-hover { transition:all 0.28s cubic-bezier(0.4,0,0.2,1); }
  .card-hover:hover { transform:translateY(-3px); box-shadow:0 18px 56px rgba(139,92,246,0.22),0 0 0 1px rgba(139,92,246,0.28) !important; }
  .btn-hover { transition:all 0.2s cubic-bezier(0.4,0,0.2,1); }
  .btn-hover:hover  { transform:translateY(-1px); filter:brightness(1.15); }
  .btn-hover:active { transform:translateY(0);    filter:brightness(0.92); }
  input::placeholder,textarea::placeholder { color:rgba(167,139,250,0.32); }
  input:focus,textarea:focus {
    border-color:rgba(139,92,246,0.65) !important;
    box-shadow:0 0 0 3px rgba(139,92,246,0.14) !important;
    outline:none;
  }
`;
document.head.appendChild(_st);

/* ─── PALETTE ────────────────────────────────────────────────────────────────*/
const C = {
  bg:"#080412", bg2:"#0d0618",
  card:"rgba(20,8,48,0.75)",
  border:"rgba(139,92,246,0.18)", borderHi:"rgba(139,92,246,0.45)",
  purple:"#8b5cf6", purpleHi:"#a78bfa", purpleDim:"#4c1d95",
  green:"#10b981",  greenHi:"#34d399",  greenDim:"#064e3b",
  cyan:"#06b6d4",
  red:"#f43f5e",    redSoft:"rgba(244,63,94,0.12)",
  amber:"#fbbf24",
  text:"#f0e6ff",   textMid:"#c4b5fd",  muted:"#7c6fa0",
  grad1:"linear-gradient(135deg,#8b5cf6 0%,#10b981 100%)",
};

/* ─── USER DB ────────────────────────────────────────────────────────────────*/
const USER_DB = [{ username:"ssbigslatt", password:"Iseedeadpeople" }];

/* ─── TRADE SEEDS ────────────────────────────────────────────────────────────*/
// Currencies — exact MT5 watchlist order
const CURRENCY_PAIRS = [
  "BCHUSD","BTCETH","BTCUSD","EURGBP","EURUSD","EURCAD","EURAUD",
  "AUDUSD","GBPUSD","GBPAUD","USDCAD","GBPJPY","USDCHF","USDJPY",
  "EURCHF","EURJPY",
];
// Deriv Indices — exact MT5 watchlist order
const DERIV_INDEX_PAIRS = [
  "Volatility 5 Index","Volatility 5 (1s) Index","Volatility 10 (1s) Index",
  "Volatility 15 (1s) Index","Volatility 25 (1s) Index","Volatility 25 Index",
  "Volatility 30 Index","Volatility 30 (1s) Index","Volatility 50 (1s) Index",
  "Volatility 50 Index","Volatility 75 Index","Volatility 75 (1s) Index",
  "Volatility 90 (1s) Index","Volatility 100 (1s) Index","Volatility 100 Index",
  "Volatility 250 (1s) Index","Crash 50 Index","Crash 150 Index",
  "Crash 300 Index","Boom 500 Index","Boom 600 Index","Step Index",
];
// Weltrade Indices — chronological order: FiboX, VolX, FlipX, GainX, PainX
const WELTRADE_INDEX_PAIRS = [
  "FiboX",
  "FX Vol 20","FX Vol 40","FX Vol 60","FX Vol 80","FX Vol 99",
  "FlipX 1","FlipX 2","FlipX 3","FlipX 4","FlipX 5",
  "GainX 400","GainX 600","GainX 800","GainX 999","GainX 1200",
  "PainX 400","PainX 600","PainX 800","PainX 999","PainX 1200",
];

let _tid = 1;
const INIT_TRADES = [
  ...CURRENCY_PAIRS.map(pair => ({
    id:_tid++, pair, category:"currency", subcategory:null, result:null, notes:"", pnl:0,
    date: new Date(Date.now() - _tid*86400000*(Math.floor(Math.random()*3)+1)).toISOString(),
  })),
  ...DERIV_INDEX_PAIRS.map(pair => ({
    id:_tid++, pair, category:"index", subcategory:"deriv", result:null, notes:"", pnl:0,
    date: new Date(Date.now() - _tid*86400000*(Math.floor(Math.random()*3)+1)).toISOString(),
  })),
  ...WELTRADE_INDEX_PAIRS.map(pair => ({
    id:_tid++, pair, category:"index", subcategory:"weltrade", result:null, notes:"", pnl:0,
    date: new Date(Date.now() - _tid*86400000*(Math.floor(Math.random()*3)+1)).toISOString(),
  })),
];

/* ─── FONTS ──────────────────────────────────────────────────────────────────*/
const FD = "'Outfit',sans-serif";
const FM = "'JetBrains Mono',monospace";

/* ─── STYLE HELPERS ──────────────────────────────────────────────────────────*/
const gc = (color=C.purple,extra={}) => ({
  background:"rgba(14,5,36,0.8)",
  backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
  border:`1px solid ${color}45`,
  borderRadius:"16px",
  boxShadow:`0 4px 28px ${color}14, inset 0 1px 0 ${color}20`,
  ...extra,
});

const inputSt = {
  width:"100%", background:"rgba(10,4,24,0.85)",
  border:`1px solid ${C.border}`, borderRadius:"10px",
  padding:"11px 15px", color:C.text, fontSize:"14px",
  fontFamily:FD, transition:"border-color 0.2s,box-shadow 0.2s",
};

const pillStyle = (bg,color,border) => ({
  display:"inline-block", padding:"3px 12px", borderRadius:"20px",
  fontSize:"11px", fontWeight:"600", letterSpacing:"0.4px",
  background:bg, color, border:`1px solid ${border}`, fontFamily:FD,
});

/* ─── BTN ────────────────────────────────────────────────────────────────────*/
function Btn({ children, onClick, variant="primary", style:ex={}, disabled }) {
  const V = {
    primary: { background:C.grad1, color:"#fff", border:"none", boxShadow:`0 4px 18px ${C.purple}40` },
    ghost:   { background:"transparent", color:C.textMid, border:`1px solid ${C.border}` },
    danger:  { background:"linear-gradient(135deg,#f43f5e,#e11d48)", color:"#fff", border:"none", boxShadow:"0 4px 18px rgba(244,63,94,0.35)" },
    success: { background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", border:"none", boxShadow:"0 4px 18px rgba(16,185,129,0.35)" },
    amber:   { background:"linear-gradient(135deg,#fbbf24,#d97706)", color:"#1a0a00", border:"none", boxShadow:"0 4px 18px rgba(251,191,36,0.35)" },
    outline: { background:"rgba(139,92,246,0.09)", color:C.purpleHi, border:`1px solid ${C.borderHi}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} className="btn-hover"
      style={{ fontFamily:FD, fontWeight:"600", fontSize:"13px", letterSpacing:"0.4px",
        padding:"10px 20px", borderRadius:"10px", cursor:disabled?"not-allowed":"pointer", ...V[variant], ...ex }}>
      {children}
    </button>
  );
}

/* ─── CIRCLE STAT ────────────────────────────────────────────────────────────*/
function CircleStat({ value, max, label, sub, color, size=110 }) {
  const pct = max>0 ? Math.min(value/max,1) : 0;
  const r=40; const circ=2*Math.PI*r;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="8"/>
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${pct*circ} ${circ}`} strokeDashoffset={circ/4}
          strokeLinecap="round" style={{ transition:"stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}/>
        <text x="50" y="47" textAnchor="middle" fill={color} fontSize="17" fontWeight="700" fontFamily={FD}>{sub}</text>
        <text x="50" y="62" textAnchor="middle" fill={C.muted} fontSize="9" fontFamily={FD}>{label}</text>
      </svg>
    </div>
  );
}

/* ─── MESH BG ────────────────────────────────────────────────────────────────*/
function MeshBg() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden", pointerEvents:"none" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 18% 10%,rgba(76,29,149,0.38) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 82% 82%,rgba(16,185,129,0.13) 0%,transparent 60%),#080412" }}/>
      <div style={{ position:"absolute", width:"520px", height:"520px", borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.11) 0%,transparent 70%)", top:"-110px", left:"-110px", animation:"float 9s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", width:"420px", height:"420px", borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 70%)", bottom:"-90px", right:"-90px", animation:"float 11s ease-in-out infinite reverse" }}/>
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(139,92,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.04) 1px,transparent 1px)", backgroundSize:"48px 48px" }}/>
    </div>
  );
}

/* ─── MINI STATS CARD (floating top-right) ───────────────────────────────────*/
function MiniStatsCard({ trades }) {
  const rec = trades.filter(t=>t.result);
  const wins = rec.filter(t=>t.result==="win").length;
  const losses = rec.filter(t=>t.result==="loss").length;
  const wr = rec.length>0 ? Math.round((wins/rec.length)*100) : 0;
  const pnl = trades.reduce((a,t)=>a+(parseFloat(t.pnl)||0),0);
  return (
    <div className="slide-down" style={{
      position:"fixed", top:"66px", right:"12px", zIndex:45,
      background:"rgba(8,3,22,0.96)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
      border:`1px solid ${C.border}`, borderRadius:"12px",
      padding:"8px 12px", animation:"slideInDown 0.4s cubic-bezier(0.34,1.2,0.64,1) forwards",
      boxShadow:`0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.2)`,
      display:"flex", gap:"12px", alignItems:"center",
    }}>
      {[
        { l:"WIN RATE", v:`${wr}%`,  c:C.purpleHi },
        { l:"WINS",     v:wins,      c:C.greenHi  },
        { l:"LOSSES",   v:losses,    c:C.red       },
        { l:"PnL",      v:`${pnl>=0?"+":""}$${pnl.toFixed(0)}`, c:pnl>=0?C.greenHi:C.red },
      ].map((s,i) => (
        <div key={s.l} style={{ textAlign:"center", ...(i<3 ? {paddingRight:"14px", borderRight:`1px solid ${C.border}`} : {}) }}>
          <div style={{ fontSize:"9px", fontWeight:"700", color:C.muted, letterSpacing:"0.8px", fontFamily:FD }}>{s.l}</div>
          <div style={{ fontSize:"15px", fontWeight:"900", color:s.c, fontFamily:FM, marginTop:"2px" }}>{s.v}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── GENERIC FLOW MODAL ─────────────────────────────────────────────────────*/
function FlowModal({ title, body, emoji, accentColor=C.purple, actions }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(4,2,14,0.88)", backdropFilter:"blur(14px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:"20px", fontFamily:FD }}>
      <div className="pop-in" style={{ ...gc(accentColor), padding:"36px 32px", maxWidth:"440px", width:"100%", borderColor:`${accentColor}55`, boxShadow:`0 0 60px ${accentColor}22` }}>
        {emoji && <div style={{ fontSize:"44px", textAlign:"center", marginBottom:"14px", animation:"float 2.5s ease-in-out infinite" }}>{emoji}</div>}
        {title && <div style={{ fontSize:"20px", fontWeight:"800", color:C.text, textAlign:"center", marginBottom:"10px", lineHeight:"1.3" }}>{title}</div>}
        {body && <div style={{ color:C.muted, fontSize:"14px", textAlign:"center", lineHeight:"1.8", marginBottom:"26px" }}>{body}</div>}
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          {actions.map((a,i) => (
            <Btn key={i} onClick={a.fn} variant={a.variant||"primary"} style={{ flex:"1 1 0", padding:"13px", fontSize:"13px", ...a.style }}>
              {a.label}
            </Btn>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── STRUCTURE BROKEN MODAL ─────────────────────────────────────────────────*/
function StructureBrokenModal({ onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(4,2,14,0.88)", backdropFilter:"blur(14px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:"20px", fontFamily:FD }}>
      <div className="pop-in" style={{ ...gc(C.amber), padding:"36px 32px", maxWidth:"480px", width:"100%", borderColor:`${C.amber}55`, boxShadow:`0 0 60px rgba(251,191,36,0.18)`, animation:"warningPulse 2.5s ease-in-out infinite, popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
        <div style={{ fontSize:"44px", textAlign:"center", marginBottom:"14px" }}>⚠️</div>
        <div style={{ fontSize:"20px", fontWeight:"900", color:C.amber, textAlign:"center", marginBottom:"16px", letterSpacing:"-0.3px" }}>
          Trend / Structure Broken!
        </div>
        <div style={{ background:"rgba(251,191,36,0.08)", border:`1px solid rgba(251,191,36,0.25)`, borderRadius:"12px", padding:"18px 20px", marginBottom:"20px" }}>
          <div style={{ fontSize:"13px", color:C.text, lineHeight:"1.9", fontWeight:"500" }}>
            🔍 <strong style={{ color:C.amber }}>Analyze carefully:</strong> Is this a{" "}
            <span style={{ color:C.greenHi, fontWeight:"700" }}>fake-out (liquidity sweep)</span> or a{" "}
            <span style={{ color:C.red, fontWeight:"700" }}>true breakout</span>?
          </div>
        </div>
        <div style={{ background:"rgba(139,92,246,0.08)", border:`1px solid ${C.border}`, borderRadius:"12px", padding:"16px 18px", marginBottom:"24px" }}>
          <div style={{ fontSize:"12px", fontWeight:"700", color:C.purpleHi, letterSpacing:"0.8px", marginBottom:"10px" }}>📌 NB — CHECK ON DIFFERENT TIMEFRAMES</div>
          <div style={{ fontSize:"13px", color:C.muted, lineHeight:"1.8" }}>
            Especially check the <span style={{ color:C.text, fontWeight:"700" }}>30-minute chart</span> for confluence before making any decision. Cross-reference with the 15min and 5min for confirmation.
          </div>
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          <Btn onClick={onClose} variant="amber" style={{ flex:1, padding:"13px" }}>Understood — I'll Check 🔍</Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── WIN MODAL ──────────────────────────────────────────────────────────────*/
function WinModal({ onClose, onSave }) {
  const [step,setStep]=useState("ask"); const [notes,setNotes]=useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(4,2,14,0.88)", backdropFilter:"blur(14px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"20px", fontFamily:FD }}>
      <div className="pop-in" style={{ ...gc(C.green), padding:"36px", maxWidth:"440px", width:"100%", borderColor:`${C.green}50` }}>
        {step==="ask" && <>
          <div style={{ fontSize:"44px", textAlign:"center", marginBottom:"12px", animation:"float 2s ease-in-out infinite" }}>🏆</div>
          <div style={{ fontSize:"21px", fontWeight:"800", color:C.greenHi, textAlign:"center", marginBottom:"10px" }}>Congratulations!</div>
          <div style={{ color:C.muted, fontSize:"14px", textAlign:"center", marginBottom:"26px", lineHeight:"1.8" }}>You Won the Trade!<br/>Wanna add possible reasons why the trade was successful?</div>
          <div style={{ display:"flex", gap:"10px" }}>
            <Btn onClick={()=>setStep("notes")} variant="success" style={{ flex:1, padding:"13px" }}>Yes, add notes</Btn>
            <Btn onClick={()=>setStep("celebrate")} variant="ghost" style={{ flex:1, padding:"13px" }}>No thanks</Btn>
          </div>
        </>}
        {step==="notes" && <>
          <div style={{ fontSize:"16px", fontWeight:"800", color:C.greenHi, marginBottom:"6px" }}>✦ Why did this trade win?</div>
          <div style={{ color:C.muted, fontSize:"13px", marginBottom:"14px" }}>Capture what worked for future reference.</div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={5} placeholder="e.g. Zone aligned with trendline, waited for 15min close, clean CHOCH…" style={{ ...inputSt, resize:"vertical", lineHeight:"1.7" }}/>
          <div style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
            <Btn onClick={()=>{ onSave("win",notes); }} variant="success" style={{ flex:1, padding:"12px" }}>Save Notes</Btn>
            <Btn onClick={()=>setStep("ask")} variant="ghost" style={{ padding:"12px" }}>← Back</Btn>
          </div>
        </>}
        {step==="celebrate" && <>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:"50px", marginBottom:"14px", animation:"float 2s ease-in-out infinite" }}>💚</div>
            <div style={{ fontSize:"21px", fontWeight:"800", color:C.greenHi, marginBottom:"12px", lineHeight:"1.4" }}>Keep Trusting Your<br/>Trading System!</div>
            <div style={{ color:C.muted, fontSize:"13px", marginBottom:"26px", lineHeight:"1.8" }}>Discipline and consistency build lasting wealth. Stay in the process.</div>
            <Btn onClick={()=>{ onSave("win",""); }} variant="success" style={{ width:"100%", padding:"14px", fontSize:"14px" }}>OK, let's go! 🚀</Btn>
          </div>
        </>}
      </div>
    </div>
  );
}

/* ─── LOSE MODAL ─────────────────────────────────────────────────────────────*/
function LoseModal({ onClose, onSave }) {
  const [notes,setNotes]=useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(4,2,14,0.88)", backdropFilter:"blur(14px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"20px", fontFamily:FD }}>
      <div className="pop-in" style={{ ...gc(C.red), padding:"36px", maxWidth:"440px", width:"100%", borderColor:`${C.red}45` }}>
        <div style={{ fontSize:"40px", textAlign:"center", marginBottom:"12px" }}>📉</div>
        <div style={{ fontSize:"20px", fontWeight:"800", color:C.red, textAlign:"center", marginBottom:"8px" }}>Trade Lost</div>
        <div style={{ color:C.muted, fontSize:"13px", textAlign:"center", marginBottom:"20px", lineHeight:"1.8" }}>Recording your mistakes is how sniper traders grow.</div>
        <label style={{ fontSize:"12px", fontWeight:"600", color:C.textMid, display:"block", marginBottom:"7px" }}>Possible reasons why trade failed</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={5} placeholder="e.g. Entered too early, no 15min confirmation, zone wasn't fresh…" style={{ ...inputSt, resize:"vertical", lineHeight:"1.7" }}/>
        <div style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
          <Btn onClick={()=>{ onSave("loss",notes); }} variant="danger" style={{ flex:1, padding:"12px" }}>Save & Record</Btn>
          <Btn onClick={onClose} variant="ghost" style={{ padding:"12px" }}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── LOGIN ──────────────────────────────────────────────────────────────────*/
function Login({ onLogin }) {
  const [u,setU]=useState(""); const [p,setP]=useState("");
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const submit = () => {
    if (!u||!p){setErr("All fields required.");return;}
    setLoading(true); setErr("");
    setTimeout(()=>{
      const m=USER_DB.find(x=>x.username===u&&x.password===p);
      if(m) onLogin(m.username); else {setErr("Invalid credentials.");setLoading(false);}
    },750);
  };
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:FD }}>
      <div className="fade-up" style={{ width:"100%", maxWidth:"410px" }}>
        <div style={{ textAlign:"center", marginBottom:"30px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:"62px", height:"62px", borderRadius:"18px", background:C.grad1, boxShadow:`0 8px 28px ${C.purple}50`, marginBottom:"14px", animation:"pulse-glow 3s ease-in-out infinite" }}>
            <span style={{ fontSize:"26px" }}>⚡</span>
          </div>
          <div style={{ fontSize:"26px", fontWeight:"900", background:C.grad1, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.5px" }}>RAPID SNIPER</div>
          <div style={{ color:C.muted, fontSize:"12px", fontWeight:"600", marginTop:"4px", letterSpacing:"2px" }}>TRADING STRATEGY</div>
        </div>
        <div style={{ ...gc(C.purple), padding:"34px 30px" }}>
          <div style={{ fontSize:"18px", fontWeight:"700", color:C.text, marginBottom:"5px" }}>Welcome back</div>
          <div style={{ color:C.muted, fontSize:"13px", marginBottom:"26px" }}>Sign in to your strategy dashboard</div>
          {[["Username","text",u,setU,"ssbigslatt"],["Password","password",p,setP,"••••••••••"]].map(([lbl,type,val,set,ph])=>(
            <div key={lbl} style={{ marginBottom:"15px" }}>
              <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color:C.textMid, marginBottom:"7px", letterSpacing:"0.4px" }}>{lbl}</label>
              <input value={val} type={type} placeholder={ph} onChange={e=>set(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={inputSt}/>
            </div>
          ))}
          {err && <div style={{ background:C.redSoft, border:"1px solid rgba(244,63,94,0.3)", borderRadius:"8px", padding:"9px 13px", color:C.red, fontSize:"13px", marginBottom:"14px" }}>⚠ {err}</div>}
          <Btn onClick={submit} disabled={loading} style={{ width:"100%", padding:"13px", fontSize:"14px", marginTop:"4px" }}>
            {loading?"Authenticating…":"Sign In →"}
          </Btn>
          <div style={{ marginTop:"18px", textAlign:"center", color:C.muted, fontSize:"12px" }}>🔒 Secured · Django JWT ready</div>
        </div>
      </div>
    </div>
  );
}

/* ─── NAV ────────────────────────────────────────────────────────────────────*/
function Nav({ page, setPage, onLogout, user }) {
  const pages = [
    {id:"home",label:"Home",icon:"⌂"},
    {id:"road",label:"Road to Sniper",icon:"🗺"},
    {id:"analysis",label:"Chart Markup",icon:"◈"},
    {id:"entry",label:"Entry Criteria",icon:"⊕"},
    {id:"exit",label:"Closing Criteria",icon:"◎"},
    {id:"trades",label:"Trades (PnL)",icon:"◑"},
    {id:"history",label:"History",icon:"▦"},
    {id:"trading",label:"Trading",icon:"📈"},
    {id:"backtesting",label:"Backtesting",icon:"🔒",soon:true},
  ];
  return (
    <div style={{ background:"rgba(8,4,18,0.9)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderBottom:`1px solid ${C.border}`, padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px", flexWrap:"wrap", minHeight:"58px", position:"sticky", top:0, zIndex:50, fontFamily:FD }}>
      <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
        <div style={{ width:"30px", height:"30px", borderRadius:"8px", background:C.grad1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", boxShadow:`0 4px 12px ${C.purple}40` }}>⚡</div>
        <span style={{ fontWeight:"800", fontSize:"14px", background:C.grad1, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>RAPID SNIPER</span>
      </div>
      <div style={{ display:"flex", gap:"3px", flexWrap:"wrap", padding:"7px 0" }}>
        {pages.map(p=>(
          p.soon ? (
            <div key={p.id} className="btn-hover"
              style={{ fontFamily:FD, fontWeight:"500", fontSize:"12px",
                background:"rgba(251,191,36,0.06)",
                border:"1px solid rgba(251,191,36,0.18)",
                borderRadius:"8px", color:"rgba(251,191,36,0.45)",
                padding:"7px 13px", cursor:"not-allowed",
                display:"flex", alignItems:"center", gap:"5px",
                position:"relative" }}>
              {p.icon} {p.label}
              <span style={{ fontSize:"9px", fontWeight:"700", color:"rgba(251,191,36,0.6)", background:"rgba(251,191,36,0.12)", border:"1px solid rgba(251,191,36,0.25)", borderRadius:"4px", padding:"1px 5px", letterSpacing:"0.5px" }}>SOON</span>
            </div>
          ) : (
          <button key={p.id} onClick={()=>setPage(p.id)} className="btn-hover"
            style={{ fontFamily:FD, fontWeight:page===p.id?"700":"500", fontSize:"12px",
              background:page===p.id?"rgba(139,92,246,0.18)":"transparent",
              border:page===p.id?`1px solid ${C.purple}55`:"1px solid transparent",
              borderRadius:"8px", color:page===p.id?C.purpleHi:C.muted,
              padding:"7px 13px", cursor:"pointer",
              boxShadow:page===p.id?`0 0 10px ${C.purple}22`:"none" }}>
            {p.icon} {p.label}
          </button>
          )
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"7px", background:"rgba(139,92,246,0.09)", border:`1px solid ${C.border}`, borderRadius:"20px", padding:"5px 11px 5px 7px" }}>
          <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:C.grad1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:"700", color:"#fff" }}>{user[0].toUpperCase()}</div>
          <span style={{ color:C.textMid, fontSize:"12px", fontWeight:"600" }}>{user}</span>
        </div>
        <Btn onClick={onLogout} variant="ghost" style={{ padding:"7px 13px", fontSize:"12px", borderColor:"rgba(244,63,94,0.28)", color:C.red }}>Logout</Btn>
      </div>
    </div>
  );
}

/* ─── HOME ───────────────────────────────────────────────────────────────────*/
function Home({ setPage, trades }) {
  const rec=trades.filter(t=>t.result);
  const wins=rec.filter(t=>t.result==="win").length;
  const losses=rec.filter(t=>t.result==="loss").length;
  const pnl=trades.reduce((a,t)=>a+(parseFloat(t.pnl)||0),0);

  const cards=[
    {id:"road",title:"Road to Rapid Sniper",sub:"10-Day Framework",desc:"Your structured journey from mindset to live execution — all 10 phases mapped to this app.",icon:"🗺",c1:"#a78bfa",c2:"#10b981"},
    {id:"analysis",title:"Chart Markup",sub:"Analysis Protocol",desc:"Zone identification, CHOCH mapping, structure confirmation and timeframe refinement.",icon:"◈",c1:"#06b6d4",c2:"#8b5cf6"},
    {id:"entry",title:"Entry Criteria",sub:"Execution Checklist",desc:"Imbalance fills, zone retests, confirmation signals, and reward ratio discipline.",icon:"⊕",c1:"#a78bfa",c2:"#10b981"},
    {id:"exit",title:"Closing Criteria",sub:"Trade Management",desc:"Supply/demand targets, trendline breaks, structure violations and trailing stops.",icon:"◎",c1:"#10b981",c2:"#34d399"},
    {id:"trades",title:"Trades (PnL)",sub:"Performance Tracker",desc:"Record trade outcomes, win/loss reasons, and track your PnL across 10 slots.",icon:"◑",c1:"#8b5cf6",c2:"#f43f5e"},
    {id:"history",title:"History",sub:"Trade Analytics",desc:"Filter by period, view win rate circles, PnL totals, and all trade notes.",icon:"▦",c1:"#c084fc",c2:"#10b981"},
  ];

  return (
    <div style={{ padding:"40px 24px", maxWidth:"1060px", margin:"0 auto", fontFamily:FD }} className="fade-up">
      <div style={{ textAlign:"center", marginBottom:"44px" }}>
        <div style={{ display:"inline-block", padding:"4px 18px", borderRadius:"20px", background:"rgba(139,92,246,0.11)", border:`1px solid ${C.border}`, color:C.purpleHi, fontSize:"11px", fontWeight:"700", letterSpacing:"2px", marginBottom:"18px" }}>SNIPER FRAMEWORK v1.0</div>
        <h1 style={{ fontSize:"clamp(26px,5vw,52px)", fontWeight:"900", letterSpacing:"-1px", lineHeight:1.1, marginBottom:"14px" }}>
          <span style={{ color:C.text }}>RAPID </span>
          <span style={{ background:C.grad1, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>SNIPER</span>
          <br/><span style={{ color:C.text, fontSize:"0.62em", fontWeight:"600", letterSpacing:"2px" }}>TRADING STRATEGY</span>
        </h1>
        <p style={{ color:C.muted, fontSize:"14px", maxWidth:"460px", margin:"0 auto", lineHeight:"1.7" }}>Precision supply & demand framework. CHOCH-driven entries. Structure-based exits.</p>
      </div>

      {/* Nav cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:"14px", marginBottom:"24px" }}>
        {cards.map((c,i)=>(
          <button key={c.id} onClick={()=>setPage(c.id)} className="card-hover"
            style={{ ...gc(c.c1), padding:"24px 20px", textAlign:"left", cursor:"pointer", fontFamily:FD, color:C.text, animationDelay:`${i*0.06}s` }}>
            <div style={{ width:"42px", height:"42px", borderRadius:"12px", background:`linear-gradient(135deg,${c.c1},${c.c2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"19px", marginBottom:"12px", boxShadow:`0 4px 14px ${c.c1}38` }}>{c.icon}</div>
            <div style={{ fontSize:"10px", fontWeight:"700", letterSpacing:"1px", color:c.c1, marginBottom:"4px", textTransform:"uppercase" }}>{c.sub}</div>
            <div style={{ fontSize:"16px", fontWeight:"800", letterSpacing:"-0.2px", marginBottom:"8px" }}>{c.title}</div>
            <div style={{ fontSize:"12px", color:C.muted, lineHeight:"1.7" }}>{c.desc}</div>
            <div style={{ marginTop:"14px", color:c.c1, fontSize:"12px", fontWeight:"600" }}>Open →</div>
          </button>
        ))}
      </div>

      <div style={{ ...gc(), padding:"14px 22px", display:"flex", gap:"28px", flexWrap:"wrap", justifyContent:"center" }}>
        {[{l:"Strategy",v:"SNIPER"},{l:"Framework",v:"Supply & Demand"},{l:"Confirmation",v:"CHOCH + Trendline"},{l:"RR Ratio",v:"1:3"}].map(x=>(
          <div key={x.l} style={{ textAlign:"center" }}>
            <div style={{ fontSize:"9px", fontWeight:"700", letterSpacing:"1px", color:C.muted, textTransform:"uppercase" }}>{x.l}</div>
            <div style={{ fontSize:"13px", fontWeight:"700", color:C.purpleHi, marginTop:"4px" }}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CRITERIA MANAGER MODAL ─────────────────────────────────────────────────*/
function CriteriaManagerModal({ title, items, accentColor, onSave, onClose }) {
  const [localItems, setLocalItems] = useState([...items]);
  const [newItem, setNewItem] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editVal, setEditVal] = useState("");
  const add = () => {
    if(!newItem.trim()) return;
    setLocalItems(prev=>[...prev, newItem.trim()]);
    setNewItem("");
  };

  const remove = (i) => setLocalItems(prev=>prev.filter((_,idx)=>idx!==i));

  const startEdit = (i) => { setEditIdx(i); setEditVal(localItems[i]); };
  const saveEdit = () => {
    if(editVal.trim()) setLocalItems(prev=>prev.map((v,i)=>i===editIdx?editVal.trim():v));
    setEditIdx(null); setEditVal("");
  };

  const moveUp   = (i) => { if(i===0) return; setLocalItems(p=>{const a=[...p];[a[i-1],a[i]]=[a[i],a[i-1]];return a;}); };
  const moveDown = (i) => { if(i===localItems.length-1) return; setLocalItems(p=>{const a=[...p];[a[i],a[i+1]]=[a[i+1],a[i]];return a;}); };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(4,2,14,0.9)", backdropFilter:"blur(16px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:"16px", fontFamily:FD }}>
      <div className="pop-in" style={{ ...gc(accentColor), width:"100%", maxWidth:"580px", maxHeight:"90vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"22px 24px 16px", borderBottom:`1px solid ${accentColor}30`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
            <div>
              <div style={{ fontSize:"10px", fontWeight:"700", color:accentColor, letterSpacing:"1.5px", marginBottom:"4px" }}>✎ CRITERIA MANAGER</div>
              <h3 style={{ fontSize:"18px", fontWeight:"900", color:C.text, margin:0 }}>Manage — {title}</h3>
            </div>
            <button onClick={onClose} className="btn-hover"
              style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:"8px", color:C.muted, padding:"7px 13px", cursor:"pointer", fontFamily:FD, fontSize:"12px", fontWeight:"600" }}>✕</button>
          </div>
          <div style={{ fontSize:"12px", color:C.muted }}>{localItems.length} criteria · drag ↕ to reorder</div>
        </div>

        {/* Add new item */}
        <div style={{ padding:"16px 24px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ display:"flex", gap:"8px" }}>
            <input value={newItem} onChange={e=>setNewItem(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&add()}
              placeholder="Type a new criteria item and press Enter or Add…"
              style={{ ...inputSt, flex:1, padding:"9px 14px", fontSize:"13px" }}/>
            <Btn onClick={add} variant="primary" style={{ padding:"9px 18px", fontSize:"12px", flexShrink:0 }}
              disabled={!newItem.trim()}>
              ➕ Add
            </Btn>
          </div>
        </div>

        {/* Items list */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 24px", display:"flex", flexDirection:"column", gap:"8px" }}>
          {localItems.length===0 && (
            <div style={{ textAlign:"center", color:C.muted, padding:"40px", fontSize:"13px" }}>
              No criteria yet. Add one above.
            </div>
          )}
          {localItems.map((item,i)=>(
            <div key={i} style={{ ...gc(accentColor), padding:"12px 14px", display:"flex", alignItems:"center", gap:"10px", background:"rgba(10,4,24,0.75)" }}>
              {/* Number */}
              <div style={{ fontSize:"11px", fontWeight:"700", color:accentColor, fontFamily:FM, minWidth:"22px" }}>{String(i+1).padStart(2,"0")}</div>

              {/* Text or edit input */}
              {editIdx===i ? (
                <input value={editVal} onChange={e=>setEditVal(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter") saveEdit(); if(e.key==="Escape"){ setEditIdx(null); } }}
                  autoFocus
                  style={{ ...inputSt, flex:1, padding:"6px 10px", fontSize:"13px" }}/>
              ) : (
                <div style={{ flex:1, fontSize:"13px", fontWeight:"500", color:C.text, lineHeight:"1.5" }}>{item}</div>
              )}

              {/* Action buttons */}
              <div style={{ display:"flex", gap:"4px", flexShrink:0 }}>
                {/* Reorder up/down */}
                <button onClick={()=>moveUp(i)} disabled={i===0} className="btn-hover"
                  style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:"6px", color:i===0?C.border:C.muted, padding:"4px 7px", cursor:i===0?"default":"pointer", fontFamily:FD, fontSize:"12px", opacity:i===0?0.3:1 }}>↑</button>
                <button onClick={()=>moveDown(i)} disabled={i===localItems.length-1} className="btn-hover"
                  style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:"6px", color:i===localItems.length-1?C.border:C.muted, padding:"4px 7px", cursor:i===localItems.length-1?"default":"pointer", fontFamily:FD, fontSize:"12px", opacity:i===localItems.length-1?0.3:1 }}>↓</button>
                {/* Edit */}
                {editIdx===i ? (
                  <button onClick={saveEdit} className="btn-hover"
                    style={{ background:`${accentColor}20`, border:`1px solid ${accentColor}50`, borderRadius:"6px", color:accentColor, padding:"4px 10px", cursor:"pointer", fontFamily:FD, fontSize:"11px", fontWeight:"700" }}>Save</button>
                ) : (
                  <button onClick={()=>startEdit(i)} className="btn-hover"
                    style={{ background:"rgba(139,92,246,0.08)", border:`1px solid ${C.border}`, borderRadius:"6px", color:C.muted, padding:"4px 10px", cursor:"pointer", fontFamily:FD, fontSize:"11px", fontWeight:"600" }}>Edit</button>
                )}
                {/* Remove */}
                <button onClick={()=>remove(i)} className="btn-hover"
                  style={{ background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.3)", borderRadius:"6px", color:C.red, padding:"4px 8px", cursor:"pointer", fontFamily:FD, fontSize:"11px", fontWeight:"700" }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding:"16px 24px", borderTop:`1px solid ${C.border}`, display:"flex", gap:"10px", flexShrink:0 }}>
          <Btn onClick={()=>{ if(localItems.length===0){alert("Add at least one criteria item before saving.");return;} onSave(localItems); onClose(); }} variant="primary" style={{ flex:1, padding:"12px" }}>
            ✓ Save Changes ({localItems.length} items)
          </Btn>
          <Btn onClick={onClose} variant="ghost" style={{ padding:"12px 18px" }}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── CHART MARKUP ───────────────────────────────────────────────────────────*/
const DEFAULT_CHART_RULES = [
  "Find zones with a high probability CHOCH On",
  "Mark the swing low or high which may change the character — On 15 and sometimes 5min",
  "Choose a fresh zone which broke the structure",
  "Avoid extreme zone which failed to break the structure",
  "Refine the zone in 15 min if the candle is big — if similar, choose 30min zone and vice versa",
];

function ChartMarkup({ setPage }) {
  const [rules, setRules] = useState(DEFAULT_CHART_RULES);
  const [checked, setChecked] = useState(rules.map(()=>false));
  const [showDone, setShowDone] = useState(false);
  const [showStructure, setShowStructure] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const allDone = checked.every(Boolean);

  useEffect(()=>{ if(allDone && rules.length > 0) setShowDone(true); },[allDone]);

  const toggle = (i) => setChecked(p=>p.map((v,j)=>j===i?!v:v));

  const handleSaveRules = (newRules) => {
    setRules(newRules);
    setChecked(newRules.map(()=>false));
    setShowDone(false);
  };

  const pct = rules.length > 0 ? Math.round((checked.filter(Boolean).length/rules.length)*100) : 0;

  return (
    <div style={{ padding:"40px 24px", maxWidth:"800px", margin:"0 auto", fontFamily:FD }} className="fade-up">
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"inline-block", padding:"3px 14px", borderRadius:"20px", background:"rgba(6,182,212,0.12)", border:"1px solid rgba(6,182,212,0.3)", color:C.cyan, fontSize:"11px", fontWeight:"700", letterSpacing:"1px", marginBottom:"11px" }}>◈ ANALYSIS PROTOCOL</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
          <h2 style={{ fontSize:"30px", fontWeight:"900", letterSpacing:"-0.5px" }}>Chart <span style={{ color:C.cyan }}>Markup</span></h2>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ fontSize:"13px", color:C.muted }}><span style={{ color:C.cyan, fontSize:"17px", fontWeight:"900" }}>{checked.filter(Boolean).length}</span>/{rules.length} done</div>
            <Btn onClick={()=>setShowManage(true)} variant="outline" style={{ padding:"7px 13px", fontSize:"12px" }}>✎ Manage</Btn>
            <Btn onClick={()=>{ setChecked(rules.map(()=>false)); setShowDone(false); }} variant="ghost" style={{ padding:"7px 13px", fontSize:"12px" }}>Reset</Btn>
          </div>
        </div>
        <div style={{ marginTop:"14px" }}>
          <div style={{ height:"4px", background:"rgba(6,182,212,0.1)", borderRadius:"4px", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#06b6d4,#8b5cf6)", transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)", borderRadius:"4px", boxShadow:"0 0 8px #06b6d480" }}/>
          </div>
          <div style={{ fontSize:"11px", color:C.muted, marginTop:"5px", fontWeight:"600" }}>{pct}% Complete</div>
        </div>
      </div>

      <div style={{ display:"grid", gap:"10px", marginBottom:"20px" }}>
        {rules.map((r,i)=>(
          <CheckRow key={i} i={i} text={r} checked={checked[i]} color={C.cyan} onToggle={()=>toggle(i)}/>
        ))}
      </div>

      <div style={{ ...gc(C.amber), padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <div style={{ fontSize:"13px", fontWeight:"700", color:C.amber, marginBottom:"3px" }}>⚠ Trend / Structure Broken?</div>
          <div style={{ fontSize:"12px", color:C.muted }}>Tap to analyze — fake-out or true breakout?</div>
        </div>
        <Btn onClick={()=>setShowStructure(true)} variant="amber" style={{ padding:"10px 18px", fontSize:"12px" }}>Check It →</Btn>
      </div>

      {showManage && <CriteriaManagerModal title="Chart Markup" items={rules} accentColor={C.cyan} onSave={handleSaveRules} onClose={()=>setShowManage(false)}/>}
      {showStructure && <StructureBrokenModal onClose={()=>setShowStructure(false)}/>}
      {showDone && (
        <FlowModal emoji="✅" title="Chart Markup Complete!" body="You've finished the Chart Markup checklist. Wanna proceed to Entry Criteria?" accentColor={C.cyan}
          actions={[
            { label:"Yes, go to Entry Criteria →", variant:"primary", fn:()=>{ setShowDone(false); setPage("entry"); } },
            { label:"Stay here", variant:"ghost", fn:()=>setShowDone(false) },
          ]}/>
      )}
    </div>
  );
}

/* ─── ENTRY CRITERIA ─────────────────────────────────────────────────────────*/
const DEFAULT_ENTRY_RULES = [
  "Imbalance fill",
  "Wait for a zone to be retested most of the times",
  "15min confirmation",
  "Wait for the candle to close",
  "Never enter 2 positions on a zone to avoid double losses",
  "Enter on 1min Timeframe with a 15min confirmation",
  "Use Trendline for confirmation and exits if broken",
  "Check if the zone aligns with a trendline for further confirmation",
  "Don't enter when price leaves POI",
  "Stick with 1:3 reward ratio",
  "Find a zone to add a 2nd position",
];

function EntryCriteria({ setPage }) {
  const [rules, setRules] = useState(DEFAULT_ENTRY_RULES);
  const [checked, setChecked] = useState(rules.map(()=>false));
  const [showDone, setShowDone] = useState(false);
  const [showStructure, setShowStructure] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const allDone = checked.every(Boolean);

  useEffect(()=>{ if(allDone && rules.length > 0) setShowDone(true); },[allDone]);

  const handleSaveRules = (newRules) => {
    setRules(newRules);
    setChecked(newRules.map(()=>false));
    setShowDone(false);
  };

  const pct = rules.length > 0 ? Math.round((checked.filter(Boolean).length/rules.length)*100) : 0;

  return (
    <div style={{ padding:"40px 24px", maxWidth:"800px", margin:"0 auto", fontFamily:FD }} className="fade-up">
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"inline-block", padding:"3px 14px", borderRadius:"20px", background:`${C.purple}15`, border:`1px solid ${C.purple}40`, color:C.purpleHi, fontSize:"11px", fontWeight:"700", letterSpacing:"1px", marginBottom:"11px" }}>⊕ EXECUTION CHECKLIST</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
          <h2 style={{ fontSize:"30px", fontWeight:"900", letterSpacing:"-0.5px" }}>Entry <span style={{ color:C.purpleHi }}>Criteria</span></h2>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ fontSize:"13px", color:C.muted }}><span style={{ color:C.purpleHi, fontSize:"17px", fontWeight:"900" }}>{checked.filter(Boolean).length}</span>/{rules.length} done</div>
            <Btn onClick={()=>setShowManage(true)} variant="outline" style={{ padding:"7px 13px", fontSize:"12px" }}>✎ Manage</Btn>
            <Btn onClick={()=>{ setChecked(rules.map(()=>false)); setShowDone(false); }} variant="ghost" style={{ padding:"7px 13px", fontSize:"12px" }}>Reset</Btn>
          </div>
        </div>
        <div style={{ marginTop:"14px" }}>
          <div style={{ height:"4px", background:`${C.purple}18`, borderRadius:"4px", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${C.purple},${C.green})`, transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)", borderRadius:"4px", boxShadow:`0 0 8px ${C.purple}80` }}/>
          </div>
          <div style={{ fontSize:"11px", color:C.muted, marginTop:"5px", fontWeight:"600" }}>{pct}% Complete</div>
        </div>
      </div>

      <div style={{ display:"grid", gap:"10px", marginBottom:"20px" }}>
        {rules.map((r,i)=>(
          <CheckRow key={i} i={i} text={r} checked={checked[i]} color={C.purple} onToggle={()=>setChecked(p=>p.map((v,j)=>j===i?!v:v))}/>
        ))}
      </div>

      <div style={{ ...gc(C.amber), padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <div style={{ fontSize:"13px", fontWeight:"700", color:C.amber, marginBottom:"3px" }}>⚠ Trend / Structure Broken?</div>
          <div style={{ fontSize:"12px", color:C.muted }}>Tap to analyze — fake-out or true breakout?</div>
        </div>
        <Btn onClick={()=>setShowStructure(true)} variant="amber" style={{ padding:"10px 18px", fontSize:"12px" }}>Check It →</Btn>
      </div>

      {showManage && <CriteriaManagerModal title="Entry Criteria" items={rules} accentColor={C.purple} onSave={handleSaveRules} onClose={()=>setShowManage(false)}/>}
      {showStructure && <StructureBrokenModal onClose={()=>setShowStructure(false)}/>}
      {showDone && (
        <FlowModal emoji="🎯" title="It's time to go to Closing Criteria!" body="Entry Criteria checklist complete. Click OK to continue to Closing Criteria and manage your trade exit." accentColor={C.purple}
          actions={[{ label:"OK — Go to Closing Criteria →", variant:"primary", fn:()=>{ setShowDone(false); setPage("exit"); } }]}/>
      )}
    </div>
  );
}

/* ─── CLOSING CRITERIA ───────────────────────────────────────────────────────*/
const DEFAULT_EXIT_RULES = [
  "Preferably exit on the next demand zone or supply zone",
  "Exit when the trendline is broken",
  "Exit when structure is broken even a little",
  "Put trailing stoploss on top of the last high or low",
];

function ClosingCriteria() {
  const [rules, setRules] = useState(DEFAULT_EXIT_RULES);
  const [checked, setChecked] = useState(rules.map(()=>false));
  const [showStructure, setShowStructure] = useState(false);
  const [showManage, setShowManage] = useState(false);

  const handleSaveRules = (newRules) => {
    setRules(newRules);
    setChecked(newRules.map(()=>false));
  };

  const pct = rules.length > 0 ? Math.round((checked.filter(Boolean).length/rules.length)*100) : 0;

  return (
    <div style={{ padding:"40px 24px", maxWidth:"800px", margin:"0 auto", fontFamily:FD }} className="fade-up">
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"inline-block", padding:"3px 14px", borderRadius:"20px", background:`${C.green}14`, border:`1px solid ${C.green}40`, color:C.greenHi, fontSize:"11px", fontWeight:"700", letterSpacing:"1px", marginBottom:"11px" }}>◎ TRADE MANAGEMENT</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
          <h2 style={{ fontSize:"30px", fontWeight:"900", letterSpacing:"-0.5px" }}>Closing <span style={{ color:C.greenHi }}>Criteria</span></h2>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ fontSize:"13px", color:C.muted }}><span style={{ color:C.greenHi, fontSize:"17px", fontWeight:"900" }}>{checked.filter(Boolean).length}</span>/{rules.length} done</div>
            <Btn onClick={()=>setShowManage(true)} variant="outline" style={{ padding:"7px 13px", fontSize:"12px" }}>✎ Manage</Btn>
            <Btn onClick={()=>setChecked(rules.map(()=>false))} variant="ghost" style={{ padding:"7px 13px", fontSize:"12px" }}>Reset</Btn>
          </div>
        </div>
        <div style={{ marginTop:"14px" }}>
          <div style={{ height:"4px", background:`${C.green}14`, borderRadius:"4px", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${C.green},${C.greenHi})`, transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)", borderRadius:"4px", boxShadow:`0 0 8px ${C.green}80` }}/>
          </div>
          <div style={{ fontSize:"11px", color:C.muted, marginTop:"5px", fontWeight:"600" }}>{pct}% Complete</div>
        </div>
      </div>

      {/* Checklist — now using CheckRow like other pages */}
      <div style={{ display:"grid", gap:"10px", marginBottom:"20px" }}>
        {rules.map((r,i)=>(
          <CheckRow key={i} i={i} text={r} checked={checked[i]} color={C.green} onToggle={()=>setChecked(p=>p.map((v,j)=>j===i?!v:v))}/>
        ))}
      </div>

      <div style={{ ...gc(C.amber), padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"20px" }}>
        <div>
          <div style={{ fontSize:"13px", fontWeight:"700", color:C.amber, marginBottom:"3px" }}>⚠ Trend / Structure Broken?</div>
          <div style={{ fontSize:"12px", color:C.muted }}>Tap to analyze — fake-out or true breakout?</div>
        </div>
        <Btn onClick={()=>setShowStructure(true)} variant="amber" style={{ padding:"10px 18px", fontSize:"12px" }}>Check It →</Btn>
      </div>

      <div style={{ ...gc(), padding:"18px 22px", borderLeft:`3px solid ${C.green}` }}>
        <div style={{ fontSize:"11px", fontWeight:"700", color:C.green, letterSpacing:"1px", marginBottom:"7px" }}>▸ SNIPER NOTE</div>
        <div style={{ fontSize:"13px", color:C.muted, lineHeight:"1.8" }}>Apply exits in order of confluence. Trendline breaks and structure breaks act as early warning signals. Use trailing stop on last swing to lock in profits while letting winners run.</div>
      </div>

      {showManage && <CriteriaManagerModal title="Closing Criteria" items={rules} accentColor={C.green} onSave={handleSaveRules} onClose={()=>setShowManage(false)}/>}
      {showStructure && <StructureBrokenModal onClose={()=>setShowStructure(false)}/>}
    </div>
  );
}

/* ─── TRADES PAGE ────────────────────────────────────────────────────────────*/
/* ─── MANAGE ASSETS MODAL ───────────────────────────────────────────────────*/
function ManageModal({ trades, onAdd, onRemove, onClose }) {
  const [tab, setTab] = useState("view");           // "view" | "add"
  const [filterCat, setFilterCat] = useState("all");
  const [newPair, setNewPair] = useState("");
  const [newCat, setNewCat] = useState("currency");
  const [newSub, setNewSub] = useState("deriv");
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const filtered = trades.filter(t => {
    const catMatch = filterCat==="all" || t.category===filterCat || t.subcategory===filterCat;
    const searchMatch = !search || t.pair.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const catOptions = [
    {id:"all",label:"All",icon:"◉"},
    {id:"currency",label:"Currencies",icon:"💱"},
    {id:"deriv",label:"Deriv",icon:"🔷"},
    {id:"weltrade",label:"Weltrade",icon:"🌐"},
  ];

  const handleAdd = () => {
    if(!newPair.trim()) return;
    const sub = newCat==="index" ? newSub : null;
    onAdd(newPair.trim(), newCat, sub);
    setNewPair("");
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(4,2,14,0.9)", backdropFilter:"blur(16px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:"16px", fontFamily:FD }}>
      <div className="pop-in" style={{ ...gc(C.purple), width:"100%", maxWidth:"560px", maxHeight:"88vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"22px 24px 16px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
            <div>
              <div style={{ fontSize:"10px", fontWeight:"700", color:C.purpleHi, letterSpacing:"1px", marginBottom:"4px" }}>⚙ WATCHLIST MANAGER</div>
              <h3 style={{ fontSize:"20px", fontWeight:"900", color:C.text, margin:0 }}>Manage Assets</h3>
            </div>
            <button onClick={onClose} className="btn-hover"
              style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:"8px", color:C.muted, padding:"8px 14px", cursor:"pointer", fontFamily:FD, fontSize:"12px", fontWeight:"600" }}>✕ Close</button>
          </div>
          {/* Tab switcher */}
          <div style={{ display:"flex", gap:"6px", background:"rgba(10,4,24,0.7)", border:`1px solid ${C.border}`, borderRadius:"10px", padding:"4px", width:"fit-content" }}>
            {[{id:"view",label:"View & Remove",icon:"📋"},{id:"add",label:"Add New",icon:"➕"}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} className="btn-hover"
                style={{ fontFamily:FD, fontWeight:"700", fontSize:"12px", padding:"8px 16px", borderRadius:"7px", cursor:"pointer", border:"none",
                  background:tab===t.id?C.grad1:"transparent", color:tab===t.id?"#fff":C.muted,
                  boxShadow:tab===t.id?`0 4px 14px ${C.purple}40`:"none" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>

          {/* ── VIEW & REMOVE tab ── */}
          {tab==="view" && <>
            {/* Filter row */}
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"14px", alignItems:"center" }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pair…"
                style={{ ...inputSt, flex:"1 1 140px", padding:"8px 12px", fontSize:"13px" }}/>
              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                {catOptions.map(c=>(
                  <button key={c.id} onClick={()=>setFilterCat(c.id)} className="btn-hover"
                    style={{ fontFamily:FD, fontWeight:"700", fontSize:"11px", padding:"7px 12px", borderRadius:"8px", cursor:"pointer", border:"none",
                      background:filterCat===c.id?C.grad1:"rgba(139,92,246,0.08)",
                      color:filterCat===c.id?"#fff":C.muted }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ fontSize:"11px", color:C.muted, marginBottom:"10px" }}>{filtered.length} asset{filtered.length!==1?"s":""}</div>

            {/* Asset list */}
            <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
              {filtered.length===0 && (
                <div style={{ textAlign:"center", color:C.muted, padding:"32px", fontSize:"13px" }}>No assets match this filter.</div>
              )}
              {filtered.map(t=>{
                const catColor = t.category==="currency" ? C.purpleHi : t.subcategory==="weltrade" ? "#c084fc" : C.cyan;
                const catLabel = t.category==="currency" ? "💱 FX" : t.subcategory==="weltrade" ? "🌐 Weltrade" : "🔷 Deriv";
                const isConfirming = confirmId===t.id;
                return (
                  <div key={t.id} style={{ ...gc(catColor), padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px", background: t.result ? `${catColor}08` : "rgba(10,4,24,0.75)" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"14px", fontWeight:"800", color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.pair}</div>
                      <div style={{ fontSize:"10px", color:C.muted, marginTop:"2px", display:"flex", gap:"8px" }}>
                        <span style={{ color:catColor }}>{catLabel}</span>
                        {t.result && <span style={{ color:t.result==="win"?C.green:C.red }}>● {t.result.toUpperCase()}</span>}
                        {!t.result && <span>● OPEN</span>}
                      </div>
                    </div>
                    {!isConfirming ? (
                      <button onClick={()=>setConfirmId(t.id)} className="btn-hover"
                        style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.3)", borderRadius:"8px", color:C.red, padding:"7px 14px", cursor:"pointer", fontFamily:FD, fontSize:"11px", fontWeight:"700", flexShrink:0 }}>
                        Remove
                      </button>
                    ) : (
                      <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                        <button onClick={()=>{ onRemove(t.id); setConfirmId(null); setSearch(""); }} className="btn-hover"
                          style={{ background:"linear-gradient(135deg,#f43f5e,#e11d48)", border:"none", borderRadius:"8px", color:"#fff", padding:"7px 14px", cursor:"pointer", fontFamily:FD, fontSize:"11px", fontWeight:"700" }}>
                          Confirm ✕
                        </button>
                        <button onClick={()=>setConfirmId(null)} className="btn-hover"
                          style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:"8px", color:C.muted, padding:"7px 10px", cursor:"pointer", fontFamily:FD, fontSize:"11px" }}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>}

          {/* ── ADD NEW tab ── */}
          {tab==="add" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
              {/* Pair name */}
              <div>
                <label style={{ fontSize:"12px", fontWeight:"700", color:C.textMid, display:"block", marginBottom:"8px", letterSpacing:"0.4px" }}>Pair / Asset Name</label>
                <input value={newPair} onChange={e=>setNewPair(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleAdd()}
                  placeholder="e.g. GBP/CHF, Boom 1000 Index, FlipX 6…"
                  style={{ ...inputSt, fontSize:"15px", fontFamily:FM, fontWeight:"700" }}/>
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize:"12px", fontWeight:"700", color:C.textMid, display:"block", marginBottom:"8px", letterSpacing:"0.4px" }}>Category</label>
                <div style={{ display:"flex", gap:"8px" }}>
                  {[{id:"currency",label:"Currency",icon:"💱"},{id:"index",label:"Index",icon:"📊"}].map(c=>(
                    <button key={c.id} onClick={()=>setNewCat(c.id)} className="btn-hover"
                      style={{ fontFamily:FD, fontWeight:"700", fontSize:"13px", padding:"11px 20px", borderRadius:"10px", cursor:"pointer", flex:1,
                        background:newCat===c.id?C.grad1:"rgba(139,92,246,0.08)",
                        border:newCat===c.id?"none":`1px solid ${C.border}`,
                        color:newCat===c.id?"#fff":C.muted,
                        boxShadow:newCat===c.id?`0 4px 14px ${C.purple}40`:"none" }}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-category — only for indices */}
              {newCat==="index" && (
                <div>
                  <label style={{ fontSize:"12px", fontWeight:"700", color:C.textMid, display:"block", marginBottom:"8px", letterSpacing:"0.4px" }}>Broker / Sub-category</label>
                  <div style={{ display:"flex", gap:"8px" }}>
                    {[{id:"deriv",label:"Deriv",icon:"🔷"},{id:"weltrade",label:"Weltrade",icon:"🌐"}].map(s=>(
                      <button key={s.id} onClick={()=>setNewSub(s.id)} className="btn-hover"
                        style={{ fontFamily:FD, fontWeight:"700", fontSize:"13px", padding:"11px 20px", borderRadius:"10px", cursor:"pointer", flex:1,
                          background:newSub===s.id?"linear-gradient(135deg,#06b6d4,#0284c7)":"rgba(6,182,212,0.08)",
                          border:newSub===s.id?"none":`1px solid ${C.border}`,
                          color:newSub===s.id?"#fff":C.muted,
                          boxShadow:newSub===s.id?`0 4px 14px #06b6d440`:"none" }}>
                        {s.icon} {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              {newPair.trim() && (
                <div style={{ ...gc(C.green), padding:"14px 18px", display:"flex", alignItems:"center", gap:"12px" }}>
                  <div style={{ fontSize:"13px", color:C.muted }}>Preview:</div>
                  <div style={{ fontSize:"15px", fontWeight:"800", color:C.text, fontFamily:FM }}>{newPair.trim()}</div>
                  <div style={{ fontSize:"11px", color:C.muted }}>·</div>
                  <div style={{ fontSize:"11px", color:newCat==="currency"?C.purpleHi:C.cyan, fontWeight:"700" }}>
                    {newCat==="currency"?"💱 Currency":newSub==="weltrade"?"🌐 Weltrade Index":"🔷 Deriv Index"}
                  </div>
                </div>
              )}

              <Btn onClick={handleAdd} variant="primary" style={{ padding:"14px", fontSize:"14px" }}
                disabled={!newPair.trim()}>
                ➕ Add Asset
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TradeCard({ trade, onResult, pnlInputs, setPnlInputs, setActiveModal }) {
  const bc = trade.result==="win" ? C.green : trade.result==="loss" ? C.red : C.purple;
  const catColor = trade.category==="index" ? C.cyan : C.purpleHi;
  return (
    <div className="card-hover" style={{ ...gc(bc), padding:"18px 16px", display:"flex", flexDirection:"column", gap:"11px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"6px" }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:"10px", fontWeight:"600", color:C.muted, fontFamily:FM, marginBottom:"2px" }}>#{String(trade.id).padStart(2,"0")}</div>
          <div style={{ fontSize:"15px", fontWeight:"900", letterSpacing:"-0.3px", color:C.text, lineHeight:"1.2", wordBreak:"break-word" }}>{trade.pair}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"4px", alignItems:"flex-end", flexShrink:0 }}>
          <div style={pillStyle(
            trade.result==="win"?"rgba(16,185,129,0.14)":trade.result==="loss"?"rgba(244,63,94,0.14)":"rgba(139,92,246,0.14)",
            trade.result==="win"?C.greenHi:trade.result==="loss"?C.red:C.purpleHi,
            trade.result==="win"?`${C.green}45`:trade.result==="loss"?`${C.red}45`:C.border
          )}>{trade.result?trade.result.toUpperCase():"OPEN"}</div>
        </div>
      </div>
      <div>
        <label style={{ fontSize:"10px", fontWeight:"600", color:C.muted, display:"block", marginBottom:"5px" }}>PnL ($)</label>
        <input type="number" placeholder="0.00"
          value={pnlInputs[trade.id]!==undefined?pnlInputs[trade.id]:(trade.pnl||"")}
          onChange={e=>setPnlInputs(p=>({...p,[trade.id]:e.target.value}))}
          onBlur={e=>onResult(trade.id,trade.result,trade.notes,parseFloat(e.target.value)||0)}
          style={{ ...inputSt, padding:"7px 11px", fontSize:"14px", fontFamily:FM, fontWeight:"700" }}/>
      </div>
      {trade.notes&&(
        <div style={{ fontSize:"11px", color:C.muted, background:"rgba(0,0,0,0.28)", padding:"8px 10px", borderRadius:"7px", lineHeight:"1.6", borderLeft:`3px solid ${bc}55` }}>
          {trade.notes.length>70?trade.notes.slice(0,70)+"…":trade.notes}
        </div>
      )}
      {!trade.result?(
        <div style={{ display:"flex", gap:"7px" }}>
          <Btn onClick={()=>setActiveModal({id:trade.id,type:"win"})} variant="success" style={{ flex:1, padding:"9px", fontSize:"12px" }}>✓ Win</Btn>
          <Btn onClick={()=>setActiveModal({id:trade.id,type:"lose"})} variant="danger" style={{ flex:1, padding:"9px", fontSize:"12px" }}>✗ Lose</Btn>
        </div>
      ):(
        <Btn onClick={()=>setActiveModal({id:trade.id,type:trade.result==="win"?"win":"lose"})} variant="ghost" style={{ width:"100%", padding:"8px", fontSize:"12px" }}>Edit Result</Btn>
      )}
    </div>
  );
}

function SubIndexSection({ title, icon, trades, color, catNum, onResult, pnlInputs, setPnlInputs, setActiveModal }) {
  return (
    <div style={{ marginBottom:"28px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px", paddingLeft:"4px" }}>
        <div style={{ width:"30px", height:"30px", borderRadius:"8px", background:`linear-gradient(135deg,${color}70,${color}30)`, border:`1px solid ${color}45`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>{icon}</div>
        <div>
          <div style={{ fontSize:"9px", fontWeight:"700", color:color, letterSpacing:"1px" }}>SUB-CATEGORY {catNum}</div>
          <div style={{ fontSize:"15px", fontWeight:"800", color:C.text }}>{title}</div>
        </div>
        <div style={{ marginLeft:"auto", fontSize:"11px", color:C.muted }}>{trades.filter(t=>t.result).length}/{trades.length}</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"10px" }}>
        {trades.map(trade=>(
          <TradeCard key={trade.id} trade={trade} onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal}/>
        ))}
      </div>
    </div>
  );
}

function Trades({ trades, onResult, onAdd, onRemove }) {
  const [activeModal,setActiveModal]=useState(null);
  const [pnlInputs,setPnlInputs]=useState({});
  const [activeCategory,setActiveCategory]=useState("all");
  const [balance,setBalance]=useState("");
  const [savedBalance,setSavedBalance]=useState(null);
  const [editingBalance,setEditingBalance]=useState(false);
  const [showManage,setShowManage]=useState(false);

  const rec=trades.filter(t=>t.result);
  const wins=rec.filter(t=>t.result==="win").length;
  const losses=rec.filter(t=>t.result==="loss").length;
  const pnl=trades.reduce((a,t)=>a+(parseFloat(t.pnl)||0),0);
  const wr=rec.length>0?Math.round((wins/rec.length)*100):0;

  const currencies=trades.filter(t=>t.category==="currency");
  const allIndices=trades.filter(t=>t.category==="index");
  const derivIndices=trades.filter(t=>t.subcategory==="deriv");
  const weltradeIndices=trades.filter(t=>t.subcategory==="weltrade");

  // Capital growth calculations
  const bal = parseFloat(savedBalance)||0;
  const growthPct = bal>0 ? ((pnl/bal)*100) : 0;
  const projectedBal = bal+pnl;
  const riskPer = bal>0 ? (bal*0.01) : 0;  // 1% risk per trade
  const targetBal = bal>0 ? bal*1.2 : 0;   // 20% growth target

  const handleSave=(result,notes)=>{
    if(!activeModal) return;
    const id=activeModal.id;
    const p=parseFloat(pnlInputs[id])||trades.find(t=>t.id===id)?.pnl||0;
    onResult(id,result,notes,p);
    setActiveModal(null);
  };

  return (
    <div style={{ padding:"32px 24px", maxWidth:"1200px", margin:"0 auto", fontFamily:FD }} className="fade-up">
      {/* Header */}
      <div style={{ marginBottom:"20px" }}>
        <div style={{ display:"inline-block", padding:"3px 14px", borderRadius:"20px", background:`${C.purple}12`, border:`1px solid ${C.border}`, color:C.purpleHi, fontSize:"11px", fontWeight:"700", letterSpacing:"1px", marginBottom:"10px" }}>PERFORMANCE TRACKER</div>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
          <div>
            <h2 style={{ fontSize:"28px", fontWeight:"900", letterSpacing:"-0.5px", marginBottom:"3px" }}>Trades <span style={{ color:C.purpleHi }}>(PnL)</span></h2>
            <div style={{ color:C.muted, fontSize:"13px" }}>{rec.length}/{trades.length} recorded · {currencies.length} FX · {derivIndices.length} Deriv · {weltradeIndices.length} Weltrade</div>
          </div>
          <Btn onClick={()=>setShowManage(true)} variant="outline" style={{ padding:"10px 18px", fontSize:"12px", flexShrink:0 }}>
            ⚙ Manage Assets
          </Btn>
        </div>
      </div>

      {/* ── BALANCE CARD ─────────────────────────────────────────── */}
      <div style={{ ...gc(C.green), padding:"20px 24px", marginBottom:"20px", display:"flex", flexWrap:"wrap", gap:"20px", alignItems:"flex-start" }}>
        {/* Left — input */}
        <div style={{ flex:"1 1 220px", minWidth:"200px" }}>
          <div style={{ fontSize:"10px", fontWeight:"700", color:C.greenHi, letterSpacing:"1.5px", marginBottom:"10px" }}>💰 TRADING BALANCE</div>
          {editingBalance || !savedBalance ? (
            <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
              <div style={{ position:"relative", flex:1 }}>
                <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:C.muted, fontSize:"15px", fontWeight:"700", fontFamily:FM }}>$</span>
                <input type="number" placeholder="0.00" value={balance}
                  onChange={e=>setBalance(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter"){ setSavedBalance(balance); setEditingBalance(false); } }}
                  style={{ ...inputSt, paddingLeft:"28px", fontSize:"18px", fontFamily:FM, fontWeight:"800", color:C.greenHi }}/>
              </div>
              <Btn onClick={()=>{ if(balance){ setSavedBalance(balance); setEditingBalance(false); } }} variant="success" style={{ padding:"11px 18px", fontSize:"12px", flexShrink:0 }}>Save</Btn>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{ fontSize:"32px", fontWeight:"900", color:C.greenHi, fontFamily:FM }}>${parseFloat(savedBalance).toLocaleString()}</div>
              <button onClick={()=>{ setBalance(savedBalance); setEditingBalance(true); }} className="btn-hover"
                style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:"8px", color:C.muted, padding:"6px 12px", fontSize:"11px", cursor:"pointer", fontFamily:FD, fontWeight:"600" }}>Edit</button>
            </div>
          )}
          <div style={{ fontSize:"11px", color:C.muted, marginTop:"6px" }}>Enter your current account balance to see growth analytics</div>
        </div>

        {/* Right — analytics (only shown when balance saved) */}
        {savedBalance && bal>0 && (
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", flex:"2 1 400px" }}>
            {[
              { l:"CURRENT BALANCE", v:`$${bal.toLocaleString()}`, c:C.greenHi, icon:"💰" },
              { l:"NET PnL", v:`${pnl>=0?"+":""}$${pnl.toFixed(0)}`, c:pnl>=0?C.greenHi:C.red, icon:"📈" },
              { l:"PROJECTED BALANCE", v:bal>0?`$${projectedBal.toLocaleString()}`:"—", c:projectedBal>bal?C.greenHi:C.red, icon:"🎯" },
              { l:"GROWTH %", v:`${growthPct>=0?"+":""}${growthPct.toFixed(1)}%`, c:growthPct>=0?C.greenHi:C.red, icon:"📊" },
              { l:"1% RISK / TRADE", v:`$${riskPer.toFixed(2)}`, c:C.purpleHi, icon:"⚠" },
              { l:"20% TARGET", v:`$${targetBal.toLocaleString()}`, c:C.amber, icon:"🏆" },
            ].map(s=>(
              <div key={s.l} style={{ ...gc(), padding:"12px 16px", minWidth:"120px", flex:"1 1 120px", background:"rgba(8,4,20,0.7)" }}>
                <div style={{ fontSize:"9px", fontWeight:"700", color:C.muted, letterSpacing:"1px", marginBottom:"4px" }}>{s.icon} {s.l}</div>
                <div style={{ fontSize:"16px", fontWeight:"900", color:s.c, fontFamily:FM }}>{s.v}</div>
              </div>
            ))}
            {/* Growth progress bar */}
            <div style={{ width:"100%", ...gc(), padding:"12px 16px", background:"rgba(8,4,20,0.7)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                <span style={{ fontSize:"10px", fontWeight:"700", color:C.muted, letterSpacing:"1px" }}>PROGRESS TO 20% TARGET</span>
                <span style={{ fontSize:"11px", fontWeight:"700", color:C.amber, fontFamily:FM }}>{Math.min(Math.max((growthPct/20)*100,0),100).toFixed(0)}%</span>
              </div>
              <div style={{ height:"6px", background:"rgba(139,92,246,0.1)", borderRadius:"6px", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.min(Math.max((growthPct/20)*100,0),100)}%`, background:`linear-gradient(90deg,${C.green},${C.amber})`, borderRadius:"6px", transition:"width 0.5s ease", boxShadow:`0 0 8px ${C.green}80` }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px" }}>
                <span style={{ fontSize:"10px", color:C.muted }}>${bal.toLocaleString()}</span>
                <span style={{ fontSize:"10px", color:C.amber }}>${targetBal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary bar */}
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"18px" }}>
        {[{l:"WINS",v:wins,c:C.green},{l:"LOSSES",v:losses,c:C.red},{l:"WIN RATE",v:rec.length>0?`${wr}%`:"—",c:C.purple},{l:"NET PnL",v:`${pnl>=0?"+":""}$${pnl.toFixed(0)}`,c:pnl>=0?C.greenHi:C.red}].map(s=>(
          <div key={s.l} style={{ ...gc(s.c), padding:"10px 18px", minWidth:"85px" }}>
            <div style={{ fontSize:"10px", fontWeight:"700", color:C.muted, letterSpacing:"1px" }}>{s.l}</div>
            <div style={{ fontSize:"20px", fontWeight:"900", color:s.c, marginTop:"3px", fontFamily:FM }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Category tab switcher */}
      <div style={{ display:"flex", gap:"6px", marginBottom:"24px", background:"rgba(14,5,36,0.8)", border:`1px solid ${C.border}`, borderRadius:"12px", padding:"5px", width:"fit-content", flexWrap:"wrap" }}>
        {[
          { id:"all",       label:`All (${trades.length})`,            icon:"◉" },
          { id:"currency",  label:`Currencies (${currencies.length})`,  icon:"💱" },
          { id:"deriv",     label:`Deriv (${derivIndices.length})`,     icon:"🔷" },
          { id:"weltrade",  label:`Weltrade (${weltradeIndices.length})`,icon:"🌐" },
        ].map(tab=>(
          <button key={tab.id} onClick={()=>setActiveCategory(tab.id)} className="btn-hover"
            style={{ fontFamily:FD, fontWeight:"700", fontSize:"11px", padding:"8px 16px", borderRadius:"9px", cursor:"pointer", border:"none",
              background: activeCategory===tab.id ? C.grad1 : "transparent",
              color: activeCategory===tab.id ? "#fff" : C.muted,
              boxShadow: activeCategory===tab.id ? `0 4px 14px ${C.purple}40` : "none" }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Currencies section */}
      {(activeCategory==="all"||activeCategory==="currency") && (
        <div style={{ marginBottom:"32px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
            <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:`linear-gradient(135deg,${C.purple},${C.purpleHi})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", boxShadow:`0 4px 14px ${C.purple}40` }}>💱</div>
            <div>
              <div style={{ fontSize:"10px", fontWeight:"700", color:C.purpleHi, letterSpacing:"1px" }}>CATEGORY 01</div>
              <div style={{ fontSize:"18px", fontWeight:"900", color:C.text }}>Currencies</div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:"12px", color:C.muted }}>{currencies.filter(t=>t.result).length}/{currencies.length} done</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"10px" }}>
            {currencies.map(trade=>(
              <TradeCard key={trade.id} trade={trade} onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal}/>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {activeCategory==="all" && <div style={{ height:"1px", background:`linear-gradient(90deg,transparent,${C.border},transparent)`, margin:"4px 0 28px" }}/>}

      {/* Indices section */}
      {(activeCategory==="all"||activeCategory==="deriv"||activeCategory==="weltrade") && (
        <div style={{ marginBottom:"8px" }}>
          {(activeCategory==="all"||activeCategory==="deriv"||activeCategory==="weltrade") && (
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
              <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:`linear-gradient(135deg,${C.cyan},#0284c7)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", boxShadow:`0 4px 14px ${C.cyan}40` }}>📊</div>
              <div>
                <div style={{ fontSize:"10px", fontWeight:"700", color:C.cyan, letterSpacing:"1px" }}>CATEGORY 02</div>
                <div style={{ fontSize:"18px", fontWeight:"900", color:C.text }}>Indices</div>
              </div>
              <div style={{ marginLeft:"auto", fontSize:"12px", color:C.muted }}>{allIndices.filter(t=>t.result).length}/{allIndices.length} done</div>
            </div>
          )}

          {/* Deriv sub-section */}
          {(activeCategory==="all"||activeCategory==="deriv") && (
            <div style={{ paddingLeft:"0", marginBottom:"24px" }}>
              <SubIndexSection title="Deriv Indices" icon="🔷" trades={derivIndices} color={C.cyan} catNum="2A"
                onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal}/>
            </div>
          )}

          {activeCategory==="all" && <div style={{ height:"1px", background:`linear-gradient(90deg,transparent,rgba(139,92,246,0.1),transparent)`, margin:"4px 0 20px" }}/>}

          {/* Weltrade sub-section */}
          {(activeCategory==="all"||activeCategory==="weltrade") && (
            <div style={{ marginBottom:"8px" }}>
              <SubIndexSection title="Weltrade Indices" icon="🌐" trades={weltradeIndices} color="#c084fc" catNum="2B"
                onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal}/>
            </div>
          )}
        </div>
      )}

      {showManage&&<ManageModal trades={trades} onAdd={onAdd} onRemove={onRemove} onClose={()=>setShowManage(false)}/>}
      {activeModal?.type==="win"&&<WinModal onClose={()=>setActiveModal(null)} onSave={handleSave}/>}
      {activeModal?.type==="lose"&&<LoseModal onClose={()=>setActiveModal(null)} onSave={handleSave}/>}
    </div>
  );
}

/* ─── HISTORY ────────────────────────────────────────────────────────────────*/
function History({ trades }) {
  const [period,setPeriod]=useState("all");
  const now=new Date(); const sod=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
  const today=sod(now);
  const inP=t=>{
    const d=new Date(t.date);
    if(period==="today") return d>=today;
    if(period==="yesterday"){const y=new Date(today);y.setDate(y.getDate()-1);return d>=y&&d<today;}
    if(period==="this_week"){const w=new Date(today);w.setDate(w.getDate()-w.getDay());return d>=w;}
    if(period==="last_week"){const w=new Date(today);w.setDate(w.getDate()-w.getDay());const lw=new Date(w);lw.setDate(lw.getDate()-7);return d>=lw&&d<w;}
    if(period==="this_month") return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
    if(period==="last_month"){const s=new Date(now.getFullYear(),now.getMonth()-1,1);const e=new Date(now.getFullYear(),now.getMonth(),1);return d>=s&&d<e;}
    return true;
  };
  const f=trades.filter(t=>t.result&&inP(t));
  const wins=f.filter(t=>t.result==="win");
  const losses=f.filter(t=>t.result==="loss");
  const wr=f.length>0?Math.round((wins.length/f.length)*100):0;
  const pnl=f.reduce((a,t)=>a+(t.pnl||0),0);
  const periods=[{id:"all",l:"All Time"},{id:"this_month",l:"This Month"},{id:"last_month",l:"Last Month"},{id:"this_week",l:"This Week"},{id:"last_week",l:"Last Week"},{id:"today",l:"Today"},{id:"yesterday",l:"Yesterday"}];

  return (
    <div style={{ padding:"40px 24px", maxWidth:"1040px", margin:"0 auto", fontFamily:FD }} className="fade-up">
      <div style={{ marginBottom:"24px" }}>
        <div style={{ display:"inline-block", padding:"3px 14px", borderRadius:"20px", background:"rgba(192,132,252,0.1)", border:"1px solid rgba(192,132,252,0.22)", color:"#c084fc", fontSize:"11px", fontWeight:"700", letterSpacing:"1px", marginBottom:"11px" }}>ANALYTICS</div>
        <h2 style={{ fontSize:"30px", fontWeight:"900", letterSpacing:"-0.5px" }}>Trade <span style={{ background:C.grad1, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>History</span></h2>
      </div>

      <div style={{ display:"flex", gap:"7px", flexWrap:"wrap", marginBottom:"28px" }}>
        {periods.map(p=>(
          <button key={p.id} onClick={()=>setPeriod(p.id)} className="btn-hover"
            style={{ fontFamily:FD, fontWeight:"600", fontSize:"12px", padding:"8px 16px", borderRadius:"20px", cursor:"pointer",
              background:period===p.id?C.grad1:"rgba(139,92,246,0.08)",
              border:`1px solid ${period===p.id?"transparent":C.border}`,
              color:period===p.id?"#fff":C.muted,
              boxShadow:period===p.id?`0 4px 14px ${C.purple}38`:"none" }}>
            {p.l}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"28px" }}>
        <div style={{ ...gc(), padding:"26px 32px", display:"flex", gap:"32px", flexWrap:"wrap", justifyContent:"center", alignItems:"center", flex:"1 1 300px" }}>
          <CircleStat value={wr} max={100} label="WIN RATE" sub={`${wr}%`} color={C.purple} size={115}/>
          <CircleStat value={wins.length} max={Math.max(f.length,1)} label="WINS" sub={wins.length} color={C.green} size={115}/>
          <CircleStat value={losses.length} max={Math.max(f.length,1)} label="LOSSES" sub={losses.length} color={C.red} size={115}/>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px", flex:"0 1 175px" }}>
          <div style={{ ...gc(C.green), padding:"20px 22px", flex:1 }}>
            <div style={{ fontSize:"10px", fontWeight:"700", color:C.muted, letterSpacing:"1px" }}>NET PnL</div>
            <div style={{ fontSize:"30px", fontWeight:"900", color:pnl>=0?C.greenHi:C.red, marginTop:"5px", fontFamily:FM }}>{pnl>=0?"+":""}${pnl.toFixed(0)}</div>
          </div>
          <div style={{ ...gc(), padding:"20px 22px", flex:1 }}>
            <div style={{ fontSize:"10px", fontWeight:"700", color:C.muted, letterSpacing:"1px" }}>TOTAL TRADES</div>
            <div style={{ fontSize:"30px", fontWeight:"900", color:C.purpleHi, marginTop:"5px", fontFamily:FM }}>{f.length}</div>
          </div>
        </div>
      </div>

      {f.length===0?(
        <div style={{ ...gc(), padding:"52px", textAlign:"center", color:C.muted, fontSize:"14px", border:`1px dashed ${C.border}` }}>No recorded trades for this period.</div>
      ):(
        <div style={{ display:"grid", gap:"11px" }}>
          {f.map(t=>(
            <div key={t.id} className="card-hover" style={{ ...gc(t.result==="win"?C.green:C.red), padding:"18px 22px", display:"flex", gap:"18px", flexWrap:"wrap", alignItems:"flex-start" }}>
              <div style={{ minWidth:"95px" }}>
                <div style={{ fontSize:"10px", fontWeight:"600", color:C.muted, fontFamily:FM }}>#{String(t.id).padStart(2,"0")}</div>
                <div style={{ fontSize:"19px", fontWeight:"900", marginTop:"3px", letterSpacing:"-0.4px" }}>{t.pair}</div>
                <div style={{ marginTop:"5px" }}>
                  <span style={pillStyle(t.result==="win"?"rgba(16,185,129,0.14)":"rgba(244,63,94,0.14)",t.result==="win"?C.greenHi:C.red,t.result==="win"?`${C.green}45`:`${C.red}45`)}>
                    {t.result==="win"?"✓ WIN":"✗ LOSS"}
                  </span>
                </div>
                <div style={{ fontSize:"11px", color:C.muted, marginTop:"7px" }}>
                  {new Date(t.date).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}
                </div>
              </div>
              <div style={{ flex:1, minWidth:"150px" }}>
                <div style={{ fontSize:"10px", fontWeight:"700", color:t.result==="win"?C.green:C.red, marginBottom:"7px", letterSpacing:"0.5px" }}>
                  {t.result==="win"?"✦ SUCCESS NOTES":"✦ LOSS REASONS"}
                </div>
                <div style={{ fontSize:"13px", color:t.notes?C.text:C.muted, lineHeight:"1.8", fontStyle:t.notes?"normal":"italic" }}>
                  {t.notes||"No notes recorded."}
                </div>
              </div>
              <div style={{ textAlign:"right", minWidth:"75px" }}>
                <div style={{ fontSize:"10px", fontWeight:"600", color:C.muted, letterSpacing:"1px" }}>PnL</div>
                <div style={{ fontSize:"22px", fontWeight:"900", color:(t.pnl||0)>=0?C.greenHi:C.red, marginTop:"3px", fontFamily:FM }}>
                  {(t.pnl||0)>=0?"+":""}${(t.pnl||0).toFixed(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ROAD TO RAPID SNIPER ───────────────────────────────────────────────────*/
function RoadToRapidSniper({ setPage }) {

  const phases = [
    {
      id: "phase1",
      title: "Understanding How Successful Trading Truly Works",
      color: C.cyan,
      color2: "#0284c7",
      icon: "🧠",
      steps: [
        {
          day: 1,
          label: "Mindset & Foundations",
          desc: "Build the psychological base of a disciplined sniper trader. Understand why most traders fail and how to think differently.",
          page: null,
          icon: "🎯",
        },
        {
          day: 2,
          label: "Setting Up",
          desc: "Configure your trading environment, charts, timeframes and watchlist. Get ready for precision execution.",
          page: null,
          icon: "⚙️",
        },
        {
          day: 3,
          label: "System at a Glance",
          desc: "Overview of the full Rapid Sniper framework — supply & demand, CHOCH, zone types and the sniper workflow.",
          page: "home",
          pageLabel: "View Dashboard",
          icon: "🗺️",
        },
      ],
    },
    {
      id: "phase2",
      title: "Mastering the Process of Reading the Market Clearly",
      color: C.purple,
      color2: "#7c3aed",
      icon: "📊",
      steps: [
        {
          day: 4,
          label: "Chart Markup (Narrative Creation)",
          desc: "Learn to identify high-probability CHOCH zones, mark swing highs/lows, and choose fresh zones that broke structure.",
          page: "analysis",
          pageLabel: "Open Chart Markup",
          icon: "◈",
        },
        {
          day: 5,
          label: "Narrative Refinement",
          desc: "Refine zones on 15min and 30min timeframes. Avoid extreme zones that failed to break structure. Perfect your zone selection process.",
          page: "analysis",
          pageLabel: "Refine on Chart Markup",
          icon: "🔬",
        },
      ],
    },
    {
      id: "phase3",
      title: "Turning Narratives into Clear Repeatable High Reward Trades",
      color: C.green,
      color2: "#059669",
      icon: "⚡",
      steps: [
        {
          day: 6,
          label: "Narrative Trading (Entry Criteria)",
          desc: "Apply your narrative to real entries. Wait for zone retests, imbalance fills, 15min confirmations and trendline alignment.",
          page: "entry",
          pageLabel: "Open Entry Criteria",
          icon: "⊕",
        },
        {
          day: 7,
          label: "Execution & Management (Closing Criteria)",
          desc: "Execute with precision on 1min timeframe with 15min confirmation. Manage trades using trailing stops and structure-based exits.",
          page: "exit",
          pageLabel: "Open Closing Criteria",
          icon: "◎",
        },
        {
          day: 8,
          label: "Strategy in Action",
          desc: "Put the full Rapid Sniper system live. Execute trades 1–10 across your watchlist. Apply every checklist step in sequence.",
          page: "trades",
          pageLabel: "Open Trades (PnL)",
          icon: "🎯",
        },
      ],
    },
    {
      id: "phase4",
      title: "Prove Your Ability, Build Conviction & Scale to Real $$$ Payouts",
      color: C.amber,
      color2: "#d97706",
      icon: "🏆",
      steps: [
        {
          day: 9,
          label: "Validation",
          desc: "Review your trade history. Measure your win rate, analyse loss reasons, and validate your system consistency over time.",
          page: "history",
          pageLabel: "Open History",
          icon: "▦",
        },
        {
          day: 10,
          label: "Scaling to Success",
          desc: "With proven consistency, scale your position sizes. Track cumulative PnL, refine entry criteria and pursue funded account targets.",
          page: "trades",
          pageLabel: "Track PnL",
          icon: "📈",
        },
      ],
    },
  ];

  return (
    <div style={{ padding:"40px 24px 60px", maxWidth:"900px", margin:"0 auto", fontFamily:FD }} className="fade-up">

      {/* Header */}
      <div style={{ marginBottom:"44px" }}>
        <div style={{ display:"inline-block", padding:"3px 16px", borderRadius:"20px", background:"rgba(139,92,246,0.11)", border:`1px solid ${C.border}`, color:C.purpleHi, fontSize:"11px", fontWeight:"700", letterSpacing:"2px", marginBottom:"14px" }}>
          10-DAY FRAMEWORK
        </div>
        <h2 style={{ fontSize:"clamp(24px,4vw,38px)", fontWeight:"900", letterSpacing:"-0.8px", lineHeight:1.15, marginBottom:"12px" }}>
          Road to{" "}
          <span style={{ background:C.grad1, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Rapid Sniper
          </span>
        </h2>
        <p style={{ color:C.muted, fontSize:"14px", lineHeight:"1.8", maxWidth:"560px" }}>
          Your structured 10-day journey from foundational mindset to executing live sniper trades with conviction. Each phase builds directly on the last.
        </p>
        <div style={{ width:"50px", height:"3px", background:C.grad1, borderRadius:"3px", marginTop:"18px" }}/>
      </div>

      {/* Phases */}
      <div style={{ display:"flex", flexDirection:"column", gap:"40px" }}>
        {phases.map((phase, pi) => (
          <div key={phase.id}>
            {/* Phase header */}
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"20px" }}>
              <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:`linear-gradient(135deg,${phase.color},${phase.color2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", boxShadow:`0 4px 18px ${phase.color}40`, flexShrink:0 }}>
                {phase.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"10px", fontWeight:"700", color:phase.color, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"3px" }}>
                  PHASE {pi + 1}
                </div>
                <div style={{ fontSize:"15px", fontWeight:"800", color:C.text, lineHeight:"1.3" }}>
                  {phase.title}
                </div>
              </div>
              {/* Phase connector line */}
              <div style={{ width:"40px", height:"2px", background:`linear-gradient(90deg,${phase.color},transparent)`, borderRadius:"2px", flexShrink:0 }}/>
            </div>

            {/* Steps */}
            <div style={{ display:"flex", flexDirection:"column", gap:"0px", paddingLeft:"22px", position:"relative" }}>
              {/* Vertical line */}
              <div style={{ position:"absolute", left:"0", top:"12px", bottom:"12px", width:"2px", background:`linear-gradient(180deg,${phase.color}60,${phase.color}10)`, borderRadius:"2px" }}/>

              {phase.steps.map((step, si) => (
                <div key={step.day} style={{ display:"flex", gap:"0px", alignItems:"stretch" }}>
                  {/* Dot + connector */}
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginRight:"18px", position:"relative" }}>
                    {/* Dot */}
                    <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:`linear-gradient(135deg,${phase.color},${phase.color2})`, border:`2px solid ${phase.color}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"18px", boxShadow:`0 0 12px ${phase.color}50`, zIndex:1 }}>
                      <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#fff" }}/>
                    </div>
                    {/* Down arrow between steps */}
                    {si < phase.steps.length - 1 && (
                      <div style={{ flex:1, width:"2px", background:`${phase.color}25`, minHeight:"16px" }}/>
                    )}
                  </div>

                  {/* Card */}
                  <div className="card-hover" style={{ ...gc(phase.color), flex:1, padding:"18px 20px", marginBottom: si < phase.steps.length - 1 ? "10px" : "0", cursor: step.page ? "pointer" : "default" }}
                    onClick={step.page ? () => setPage(step.page) : undefined}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"12px", flexWrap:"wrap" }}>
                      <div style={{ flex:1, minWidth:"200px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:"26px", height:"26px", borderRadius:"8px", background:`${phase.color}20`, border:`1px solid ${phase.color}40`, fontSize:"13px" }}>
                            {step.icon}
                          </div>
                          <div style={{ fontSize:"10px", fontWeight:"700", color:phase.color, letterSpacing:"1px", fontFamily:FM }}>
                            DAY {String(step.day).padStart(2,"0")}
                          </div>
                        </div>
                        <div style={{ fontSize:"16px", fontWeight:"800", color:C.text, marginBottom:"7px", letterSpacing:"-0.2px" }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize:"13px", color:C.muted, lineHeight:"1.75" }}>
                          {step.desc}
                        </div>
                      </div>
                      {/* Navigate button */}
                      {step.page && (
                        <button onClick={e => { e.stopPropagation(); setPage(step.page); }} className="btn-hover"
                          style={{ fontFamily:FD, fontWeight:"700", fontSize:"11px", padding:"8px 14px", borderRadius:"8px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, marginTop:"2px",
                            background:`${phase.color}18`, border:`1px solid ${phase.color}45`, color:phase.color,
                            letterSpacing:"0.3px" }}>
                          {step.pageLabel} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phase-to-phase arrow (except last) */}
            {pi < phases.length - 1 && (
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"24px", paddingLeft:"22px" }}>
                <div style={{ width:"2px", height:"32px", background:`linear-gradient(180deg,${phase.color}50,${phases[pi+1].color}50)`, borderRadius:"2px" }}/>
                <div style={{ fontSize:"11px", color:C.muted, fontWeight:"600", letterSpacing:"0.5px" }}>
                  Next phase →
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ ...gc(C.purple), marginTop:"44px", padding:"28px 28px", textAlign:"center" }}>
        <div style={{ fontSize:"22px", marginBottom:"10px" }}>🚀</div>
        <div style={{ fontSize:"18px", fontWeight:"800", color:C.text, marginBottom:"8px" }}>Ready to Execute?</div>
        <div style={{ color:C.muted, fontSize:"13px", lineHeight:"1.8", maxWidth:"420px", margin:"0 auto 20px" }}>
          You've seen the full road. Every phase is live in this app. Start with Chart Markup and work your way through.
        </div>
        <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
          <Btn onClick={() => setPage("analysis")} style={{ padding:"11px 22px" }}>Start: Chart Markup →</Btn>
          <Btn onClick={() => setPage("trades")} variant="outline" style={{ padding:"11px 22px" }}>Open Trades (PnL)</Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── SHARED CHECK ROW ───────────────────────────────────────────────────────*/
function CheckRow({ i, text, checked, onToggle, color }) {
  return (
    <div onClick={onToggle} className="card-hover"
      style={{ ...gc(checked?color:C.purple), padding:"15px 18px", display:"flex", alignItems:"center", gap:"13px", cursor:"pointer", userSelect:"none", background:checked?`${color}0a`:"rgba(14,5,36,0.8)" }}>
      <div style={{ width:"22px", height:"22px", minWidth:"22px", borderRadius:"6px", border:`2px solid ${checked?color:C.border}`, background:checked?`linear-gradient(135deg,${color},${color}cc)`:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", color:"#fff", fontWeight:"800", transition:"all 0.2s", boxShadow:checked?`0 0 10px ${color}55`:"" }}>
        {checked&&"✓"}
      </div>
      <div style={{ fontSize:"11px", fontWeight:"700", color:checked?color:C.muted, fontFamily:FM, minWidth:"22px" }}>{String(i+1).padStart(2,"0")}</div>
      <div style={{ fontSize:"14px", fontWeight:checked?"400":"500", color:checked?C.muted:C.text, textDecoration:checked?"line-through":"none", lineHeight:"1.5", transition:"all 0.2s" }}>{text}</div>
    </div>
  );
}

/* ─── TRADING PLATFORMS PAGE ─────────────────────────────────────────────────*/
function TradingPlatforms() {
  const [activeTab, setActiveTab] = useState("tv");

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 58px)", fontFamily:FD }}>
      {/* Header */}
      <div style={{ padding:"20px 28px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"16px" }}>
          <div>
            <div style={{ display:"inline-block", padding:"3px 14px", borderRadius:"20px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.28)", color:C.greenHi, fontSize:"11px", fontWeight:"700", letterSpacing:"1px", marginBottom:"8px" }}>📈 LIVE PLATFORMS</div>
            <h2 style={{ fontSize:"26px", fontWeight:"900", letterSpacing:"-0.5px", color:C.text }}>Trading <span style={{ color:C.greenHi }}>Desk</span></h2>
          </div>
          {/* Tab switcher */}
          <div style={{ display:"flex", gap:"8px", background:"rgba(14,5,36,0.8)", border:`1px solid ${C.border}`, borderRadius:"12px", padding:"5px" }}>
            {[
              { id:"tv", label:"TradingView", icon:"📊" },
              { id:"mt5", label:"MetaTrader 5", icon:"⚡" },
            ].map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)} className="btn-hover"
                style={{ fontFamily:FD, fontWeight:"700", fontSize:"12px", padding:"9px 18px", borderRadius:"9px", cursor:"pointer", border:"none",
                  background: activeTab===t.id ? C.grad1 : "transparent",
                  color: activeTab===t.id ? "#fff" : C.muted,
                  boxShadow: activeTab===t.id ? `0 4px 14px ${C.purple}40` : "none" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Platform embed area */}
      <div style={{ flex:1, padding:"0 28px 20px", display:"flex", flexDirection:"column", gap:"0", minHeight:0 }}>
        {activeTab === "tv" && (
          <div style={{ ...gc(C.green), flex:1, overflow:"hidden", display:"flex", flexDirection:"column", minHeight:0 }}>
            {/* TradingView top bar */}
            <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:"12px", flexShrink:0 }}>
              <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:C.greenHi, boxShadow:`0 0 8px ${C.green}` }}/>
              <span style={{ fontSize:"13px", fontWeight:"700", color:C.greenHi }}>TradingView — Advanced Charts</span>
              <span style={{ fontSize:"11px", color:C.muted, marginLeft:"auto" }}>Free Embed · No login required</span>
            </div>
            {/* TradingView Widget */}
            <div style={{ flex:1, minHeight:0, position:"relative" }}>
              <iframe
                src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_sniper&symbol=EURUSD&interval=15&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=1&saveimage=1&toolbarbg=1a0a36&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&showpopupbutton=1&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=rapidsniper&utm_medium=widget&utm_campaign=chart&utm_term=EURUSD"
                style={{ width:"100%", height:"100%", border:"none", display:"block" }}
                allowFullScreen
                title="TradingView Chart"
              />
            </div>
            {/* Footer note */}
            <div style={{ padding:"10px 18px", borderTop:`1px solid ${C.border}`, fontSize:"11px", color:C.muted, flexShrink:0, display:"flex", alignItems:"center", gap:"8px" }}>
              <span>💡 Tip: Use the symbol search to switch between your watchlist pairs — EUR/USD, XAU/USD, GBP/JPY and more.</span>
              <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer"
                style={{ marginLeft:"auto", color:C.greenHi, fontSize:"11px", fontWeight:"700", textDecoration:"none" }}>Open in TradingView ↗</a>
            </div>
          </div>
        )}

        {activeTab === "mt5" && (
          <div style={{ ...gc(C.purple), flex:1, overflow:"hidden", display:"flex", flexDirection:"column", minHeight:0 }}>
            {/* MT5 top bar */}
            <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:"12px", flexShrink:0 }}>
              <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:C.purpleHi, boxShadow:`0 0 8px ${C.purple}` }}/>
              <span style={{ fontSize:"13px", fontWeight:"700", color:C.purpleHi }}>MetaTrader 5 — Web Terminal</span>
              <span style={{ fontSize:"11px", color:C.muted, marginLeft:"auto" }}>Official MT5 WebTrader</span>
            </div>
            {/* MT5 Web Terminal embed */}
            <div style={{ flex:1, minHeight:0, position:"relative" }}>
              <iframe
                src="https://trade.mql5.com/trade?servers=MetaQuotes-Demo&amp;lang=en&amp;colorScheme=night"
                style={{ width:"100%", height:"100%", border:"none", display:"block" }}
                allowFullScreen
                title="MetaTrader 5 Web Terminal"
              />
            </div>
            {/* Footer note */}
            <div style={{ padding:"10px 18px", borderTop:`1px solid ${C.border}`, fontSize:"11px", color:C.muted, flexShrink:0, display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
              <span>⚡ Log in with your MT5 broker credentials inside the terminal. Demo accounts available via MetaQuotes.</span>
              <a href="https://www.metatrader5.com/en/terminal/help/startworking/acc_opening" target="_blank" rel="noopener noreferrer"
                style={{ marginLeft:"auto", color:C.purpleHi, fontSize:"11px", fontWeight:"700", textDecoration:"none" }}>Get MT5 Account ↗</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────────*/
export default function App() {
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("home");
  const [trades,setTrades]=useState(INIT_TRADES);

  const handleResult=(id,result,notes,pnl)=>{
    setTrades(prev=>prev.map(t=>t.id===id?{...t,result,notes,pnl:pnl??t.pnl??0}:t));
  };

  const handleAddTrade=(pair,category,subcategory)=>{
    setTrades(prev=>{
      const maxId = prev.length>0 ? Math.max(...prev.map(t=>t.id)) : 0;
      return [...prev,{
        id:maxId+1, pair, category, subcategory,
        result:null, notes:"", pnl:0,
        date:new Date().toISOString(),
      }];
    });
  };

  const handleRemoveTrade=(id)=>{
    setTrades(prev=>prev.filter(t=>t.id!==id));
  };

  const appStyle={ minHeight:"100vh", background:C.bg, fontFamily:FD, color:C.text, position:"relative", overflowX:"hidden" };

  if(!user) return (
    <div style={appStyle}><MeshBg/><div style={{ position:"relative", zIndex:1 }}><Login onLogin={setUser}/></div></div>
  );

  const pageMap={
    home:     <Home setPage={setPage} trades={trades}/>,
    road:     <RoadToRapidSniper setPage={setPage}/>,
    analysis: <ChartMarkup setPage={setPage}/>,
    entry:    <EntryCriteria setPage={setPage}/>,
    exit:     <ClosingCriteria/>,
    trades:   <Trades trades={trades} onResult={handleResult} onAdd={handleAddTrade} onRemove={handleRemoveTrade}/>,
    history:  <History trades={trades}/>,
    trading:  <TradingPlatforms/>,
  };

  return (
    <div style={appStyle}>
      <MeshBg/>
      <div style={{ position:"relative", zIndex:1 }}>
        <Nav page={page} setPage={setPage} onLogout={()=>{setUser(null);setPage("home");}} user={user}/>
        <MiniStatsCard trades={trades}/>
        <div style={{ minHeight:"calc(100vh - 58px)", paddingRight:"0" }}>{pageMap[page]}</div>
      </div>
    </div>
  );
}
