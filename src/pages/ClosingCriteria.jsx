import React, { useState } from "react";
import { C, FD, gc } from "../constants";
import { DEFAULT_EXIT_RULES } from "../data";
import { Btn } from "../components/Btn";
import { CheckRow } from "../components/CheckRow";
import { CriteriaManagerModal } from "../components/CriteriaManagerModal";
import { StructureBrokenModal } from "../components/StructureBrokenModal";

export function ClosingCriteria() {
  const [rules, setRules] = useState(DEFAULT_EXIT_RULES);
  const [checked, setChecked] = useState(rules.map(() => false));
  const [showStructure, setShowStructure] = useState(false);
  const [showManage, setShowManage] = useState(false);

  const handleSaveRules = (newRules) => {
    setRules(newRules);
    setChecked(newRules.map(() => false));
  };

  const pct =
    rules.length > 0
      ? Math.round((checked.filter(Boolean).length / rules.length) * 100)
      : 0;

  return (
    <div
      style={{ padding: "40px 24px", maxWidth: "800px", margin: "0 auto", fontFamily: FD }}
      className="fade-up"
    >
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            display: "inline-block",
            padding: "3px 14px",
            borderRadius: "20px",
            background: `${C.green}14`,
            border: `1px solid ${C.green}40`,
            color: C.greenHi,
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "1px",
            marginBottom: "11px",
          }}
        >
          ◎ TRADE MANAGEMENT
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h2 style={{ fontSize: "30px", fontWeight: "900", letterSpacing: "-0.5px" }}>
            Closing <span style={{ color: C.greenHi }}>Criteria</span>
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ fontSize: "13px", color: C.muted }}>
              <span style={{ color: C.greenHi, fontSize: "17px", fontWeight: "900" }}>
                {checked.filter(Boolean).length}
              </span>
              /{rules.length} done
            </div>
            <Btn
              onClick={() => setShowManage(true)}
              variant="outline"
              style={{ padding: "7px 13px", fontSize: "12px" }}
            >
              ✎ Manage
            </Btn>
            <Btn
              onClick={() => setChecked(rules.map(() => false))}
              variant="ghost"
              style={{ padding: "7px 13px", fontSize: "12px" }}
            >
              Reset
            </Btn>
          </div>
        </div>
        <div style={{ marginTop: "14px" }}>
          <div
            style={{
              height: "4px",
              background: `${C.green}14`,
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: `linear-gradient(90deg,${C.green},${C.greenHi})`,
                transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
                borderRadius: "4px",
                boxShadow: `0 0 8px ${C.green}80`,
              }}
            />
          </div>
          <div style={{ fontSize: "11px", color: C.muted, marginTop: "5px", fontWeight: "600" }}>
            {pct}% Complete
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
        {rules.map((r, i) => (
          <CheckRow
            key={i}
            i={i}
            text={r}
            checked={checked[i]}
            color={C.green}
            onToggle={() =>
              setChecked((p) => p.map((v, j) => (j === i ? !v : v)))
            }
          />
        ))}
      </div>

      <div
        style={{
          ...gc(C.amber),
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: C.amber, marginBottom: "3px" }}>
            ⚠ Trend / Structure Broken?
          </div>
          <div style={{ fontSize: "12px", color: C.muted }}>
            Tap to analyze — fake-out or true breakout?
          </div>
        </div>
        <Btn
          onClick={() => setShowStructure(true)}
          variant="amber"
          style={{ padding: "10px 18px", fontSize: "12px" }}
        >
          Check It →
        </Btn>
      </div>

      <div
        style={{
          ...gc(),
          padding: "18px 22px",
          borderLeft: `3px solid ${C.green}`,
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: C.green,
            letterSpacing: "1px",
            marginBottom: "7px",
          }}
        >
          ▸ SNIPER NOTE
        </div>
        <div style={{ fontSize: "13px", color: C.muted, lineHeight: "1.8" }}>
          Apply exits in order of confluence. Trendline breaks and structure breaks act as early
          warning signals. Use trailing stop on last swing to lock in profits while letting winners
          run.
        </div>
      </div>

      {showManage && (
        <CriteriaManagerModal
          title="Closing Criteria"
          items={rules}
          accentColor={C.green}
          onSave={handleSaveRules}
          onClose={() => setShowManage(false)}
        />
      )}
      {showStructure && <StructureBrokenModal onClose={() => setShowStructure(false)} />}
    </div>
  );
}
