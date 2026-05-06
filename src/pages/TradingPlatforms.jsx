import React, { useState } from "react";
import { C, FD, gc } from "../constants";

export function TradingPlatforms() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tvRef = React.useRef(null);
  const mt4Ref = React.useRef(null);
  const mt5Ref = React.useRef(null);

  React.useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = (ref) => {
    if (!ref.current) return;
    if (!document.fullscreenElement) {
      ref.current.requestFullscreen().catch(err => {
        alert(`Error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const platforms = [
    {
      id: "tv",
      title: "TradingView",
      subtitle: "Advanced Charts",
      color: C.green,
      hiColor: C.greenHi,
      icon: "📊",
      url: "https://s.tradingview.com/widgetembed/?symbol=EURUSD&interval=15&hidetoptoolbar=0&symboledit=1&saveimage=1&toolbarbg=%231a0a36&studies=%5B%22EMA%40tv-basicstudies%22%5D&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&showpopupbutton=1&details=1&hotlist=1&locale=en",
      ref: tvRef,
      footer: "💡 Symbol search: EUR/USD, XAU/USD, GBP/JPY...",
      link: "https://www.tradingview.com"
    },
    {
      id: "mt5",
      title: "MT4 WebTerminal",
      faint: "Weltrade",
      subtitle: "Live Terminal",
      color: C.purple,
      hiColor: C.purpleHi,
      icon: "4️⃣",
      url: "https://www.weltrade.com/webterminal/",
      ref: mt5Ref,
      footer: "⚡ Log in with Weltrade MT4 credentials",
      link: "https://www.weltrade.com/webterminal/"
    },
    {
      id: "mt4",
      title: "MT4",
      faint: "Weltrade",
      subtitle: "Demo Terminal",
      color: "#3b82f6",
      hiColor: "#60a5fa",
      icon: "4️⃣",
      url: "https://secure.weltrade.com/trading/demo",
      ref: mt4Ref,
      footer: "⚡ Log in with Weltrade MT4 credentials",
      link: "https://secure.weltrade.com/trading/demo"
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 58px)", fontFamily: FD, padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "inline-block", padding: "3px 14px", borderRadius: "20px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.28)", color: C.greenHi, fontSize: "11px", fontWeight: "700", letterSpacing: "1px", marginBottom: "8px" }}>📈 LIVE PLATFORMS</div>
        <h2 style={{ fontSize: "26px", fontWeight: "900", letterSpacing: "-0.5px", color: C.text }}>Trading <span style={{ color: C.greenHi }}>Desk</span></h2>
      </div>

      {/* Platforms Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "24px", 
        flex: 1 
      }}>
        {platforms.map(p => (
          <div key={p.id} ref={p.ref} style={{ 
            ...gc(p.color), 
            display: "flex", 
            flexDirection: "column", 
            minHeight: "450px", 
            overflow: "hidden",
            position: "relative"
          }}>
            {/* Platform Top Bar */}
            <div style={{ 
              padding: "12px 18px", 
              borderBottom: `1px solid ${C.border}`, 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              flexShrink: 0,
              background: "rgba(0,0,0,0.2)"
            }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.hiColor, boxShadow: `0 0 8px ${p.color}` }} />
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "14px", fontWeight: "800", color: p.hiColor }}>{p.title}</span>
                {p.faint && <span style={{ fontSize: "10px", fontWeight: "600", color: p.hiColor, opacity: 0.4 }}>{p.faint}</span>}
                <span style={{ fontSize: "11px", color: C.muted, fontWeight: "600" }}>— {p.subtitle}</span>
              </div>
              
              <button onClick={() => toggleFullscreen(p.ref)} className="btn-hover"
                style={{ 
                  marginLeft: "auto", 
                  background: `${p.hiColor}15`, 
                  border: `1px solid ${p.hiColor}40`, 
                  color: p.hiColor, 
                  borderRadius: "6px", 
                  padding: "4px 10px", 
                  fontSize: "11px", 
                  fontWeight: "700", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px" 
                }}>
                {isFullscreen ? "❐ Exit" : "⛶ Fullscreen"}
              </button>
            </div>

            {/* Platform Embed */}
            <div style={{ flex: 1, position: "relative", background: "#000" }}>
              <iframe
                src={p.url}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                allowFullScreen
                title={p.title}
              />
            </div>

            {/* Footer */}
            <div style={{ 
              padding: "10px 18px", 
              borderTop: `1px solid ${C.border}`, 
              fontSize: "11px", 
              color: C.muted, 
              flexShrink: 0, 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              background: "rgba(0,0,0,0.1)"
            }}>
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.footer}</span>
              <a href={p.link} target="_blank" rel="noopener noreferrer"
                style={{ color: p.hiColor, fontWeight: "700", textDecoration: "none" }}>Open ↗</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
