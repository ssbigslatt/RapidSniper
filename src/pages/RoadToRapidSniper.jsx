import React from "react";
import { C, FD, FM, gc } from "../constants";
import { Btn } from "../components/Btn";

export function RoadToRapidSniper({ setPage }) {
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
    <div style={{ padding: "40px 24px 60px", maxWidth: "900px", margin: "0 auto", fontFamily: FD }} className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: "44px" }}>
        <div style={{ display: "inline-block", padding: "3px 16px", borderRadius: "20px", background: "rgba(139,92,246,0.11)", border: `1px solid ${C.border}`, color: C.purpleHi, fontSize: "11px", fontWeight: "700", letterSpacing: "2px", marginBottom: "14px" }}>
          10-DAY FRAMEWORK
        </div>
        <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: "900", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: "12px" }}>
          Road to{" "}
          <span style={{ background: C.grad1, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Rapid Sniper
          </span>
        </h2>
        <p style={{ color: C.muted, fontSize: "14px", lineHeight: "1.8", maxWidth: "560px" }}>
          Your structured 10-day journey from foundational mindset to executing live sniper trades with conviction. Each phase builds directly on the last.
        </p>
        <div style={{ width: "50px", height: "3px", background: C.grad1, borderRadius: "3px", marginTop: "18px" }} />
      </div>

      {/* Phases */}
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {phases.map((phase, pi) => (
          <div key={phase.id}>
            {/* Phase header */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: `linear-gradient(135deg,${phase.color},${phase.color2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: `0 4px 18px ${phase.color}40`, flexShrink: 0 }}>
                {phase.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: phase.color, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "3px" }}>
                  PHASE {pi + 1}
                </div>
                <div style={{ fontSize: "15px", fontWeight: "800", color: C.text, lineHeight: "1.3" }}>
                  {phase.title}
                </div>
              </div>
              {/* Phase connector line */}
              <div style={{ width: "40px", height: "2px", background: `linear-gradient(90deg,${phase.color},transparent)`, borderRadius: "2px", flexShrink: 0 }} />
            </div>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0px", paddingLeft: "22px", position: "relative" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: "0", top: "12px", bottom: "12px", width: "2px", background: `linear-gradient(180deg,${phase.color}60,${phase.color}10)`, borderRadius: "2px" }} />

              {phase.steps.map((step, si) => (
                <div key={step.day} style={{ display: "flex", gap: "0px", alignItems: "stretch" }}>
                  {/* Dot + connector */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "18px", position: "relative" }}>
                    {/* Dot */}
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: `linear-gradient(135deg,${phase.color},${phase.color2})`, border: `2px solid ${phase.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "18px", boxShadow: `0 0 12px ${phase.color}50`, zIndex: 1 }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#fff" }} />
                    </div>
                    {/* Down arrow between steps */}
                    {si < phase.steps.length - 1 && (
                      <div style={{ flex: 1, width: "2px", background: `${phase.color}25`, minHeight: "16px" }} />
                    )}
                  </div>

                  {/* Card */}
                  <div className="card-hover" style={{ ...gc(phase.color), flex: 1, padding: "18px 20px", marginBottom: si < phase.steps.length - 1 ? "10px" : "0", cursor: step.page ? "pointer" : "default" }}
                    onClick={step.page ? () => setPage(step.page) : undefined}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "8px", background: `${phase.color}20`, border: `1px solid ${phase.color}40`, fontSize: "13px" }}>
                            {step.icon}
                          </div>
                          <div style={{ fontSize: "10px", fontWeight: "700", color: phase.color, letterSpacing: "1px", fontFamily: FM }}>
                            DAY {String(step.day).padStart(2, "0")}
                          </div>
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: "800", color: C.text, marginBottom: "7px", letterSpacing: "-0.2px" }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize: "13px", color: C.muted, lineHeight: "1.75" }}>
                          {step.desc}
                        </div>
                      </div>
                      {/* Navigate button */}
                      {step.page && (
                        <button onClick={e => { e.stopPropagation(); setPage(step.page); }} className="btn-hover"
                          style={{
                            fontFamily: FD, fontWeight: "700", fontSize: "11px", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, marginTop: "2px",
                            background: `${phase.color}18`, border: `1px solid ${phase.color}45`, color: phase.color,
                            letterSpacing: "0.3px"
                          }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "24px", paddingLeft: "22px" }}>
                <div style={{ width: "2px", height: "32px", background: `linear-gradient(180deg,${phase.color}50,${phases[pi + 1].color}50)`, borderRadius: "2px" }} />
                <div style={{ fontSize: "11px", color: C.muted, fontWeight: "600", letterSpacing: "0.5px" }}>
                  Next phase →
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ ...gc(C.purple), marginTop: "44px", padding: "28px 28px", textAlign: "center" }}>
        <div style={{ fontSize: "22px", marginBottom: "10px" }}>🚀</div>
        <div style={{ fontSize: "18px", fontWeight: "800", color: C.text, marginBottom: "8px" }}>Ready to Execute?</div>
        <div style={{ color: C.muted, fontSize: "13px", lineHeight: "1.8", maxWidth: "420px", margin: "0 auto 20px" }}>
          You've seen the full road. Every phase is live in this app. Start with Chart Markup and work your way through.
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={() => setPage("analysis")} style={{ padding: "11px 22px" }}>Start: Chart Markup →</Btn>
          <Btn onClick={() => setPage("trades")} variant="outline" style={{ padding: "11px 22px" }}>Open Trades (PnL)</Btn>
        </div>
      </div>
    </div>
  );
}
