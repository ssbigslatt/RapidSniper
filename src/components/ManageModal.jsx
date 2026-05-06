import React, { useState } from "react";
import { C, FD, FM, gc, inputSt } from "../constants";
import { Btn } from "./Btn";

export function ManageModal({ trades, onAdd, onRemove, onClose }) {
  const [tab, setTab] = useState("view"); // "view" | "add"
  const [filterCat, setFilterCat] = useState("all");
  const [newPair, setNewPair] = useState("");
  const [newCat, setNewCat] = useState("currency");
  const [newSub, setNewSub] = useState("deriv");
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const filtered = trades.filter((t) => {
    const catMatch =
      filterCat === "all" || t.category === filterCat || t.subcategory === filterCat;
    const searchMatch = !search || t.pair.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const catOptions = [
    { id: "all", label: "All", icon: "◉" },
    { id: "currency", label: "Currencies", icon: "💱" },
    { id: "deriv", label: "Deriv", icon: "🔷" },
    { id: "weltrade", label: "Weltrade", icon: "🌐" },
  ];

  const handleAdd = () => {
    if (!newPair.trim()) return;
    const sub = newCat === "index" ? newSub : null;
    onAdd(newPair.trim(), newCat, sub);
    setNewPair("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(4,2,14,0.9)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
        padding: "16px",
        fontFamily: FD,
      }}
    >
      <div
        className="pop-in"
        style={{
          ...gc(C.purple),
          width: "100%",
          maxWidth: "560px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 24px 16px",
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: C.purpleHi,
                  letterSpacing: "1px",
                  marginBottom: "4px",
                }}
              >
                ⚙ WATCHLIST MANAGER
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "900", color: C.text, margin: 0 }}>
                Manage Assets
              </h3>
            </div>
            <button
              onClick={onClose}
              className="btn-hover"
              style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
                color: C.muted,
                padding: "8px 14px",
                cursor: "pointer",
                fontFamily: FD,
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              ✕ Close
            </button>
          </div>
          {/* Tab switcher */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "rgba(10,4,24,0.7)",
              border: `1px solid ${C.border}`,
              borderRadius: "10px",
              padding: "4px",
              width: "fit-content",
            }}
          >
            {[
              { id: "view", label: "View & Remove", icon: "📋" },
              { id: "add", label: "Add New", icon: "➕" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="btn-hover"
                style={{
                  fontFamily: FD,
                  fontWeight: "700",
                  fontSize: "12px",
                  padding: "8px 16px",
                  borderRadius: "7px",
                  cursor: "pointer",
                  border: "none",
                  background: tab === t.id ? C.grad1 : "transparent",
                  color: tab === t.id ? "#fff" : C.muted,
                  boxShadow: tab === t.id ? `0 4px 14px ${C.purple}40` : "none",
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* ── VIEW & REMOVE tab ── */}
          {tab === "view" && (
            <>
              {/* Filter row */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "14px",
                  alignItems: "center",
                }}
              >
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pair…"
                  style={{ ...inputSt, flex: "1 1 140px", padding: "8px 12px", fontSize: "13px" }}
                />
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {catOptions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setFilterCat(c.id)}
                      className="btn-hover"
                      style={{
                        fontFamily: FD,
                        fontWeight: "700",
                        fontSize: "11px",
                        padding: "7px 12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "none",
                        background: filterCat === c.id ? C.grad1 : "rgba(139,92,246,0.08)",
                        color: filterCat === c.id ? "#fff" : C.muted,
                      }}
                    >
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: "11px", color: C.muted, marginBottom: "10px" }}>
                {filtered.length} asset{filtered.length !== 1 ? "s" : ""}
              </div>

              {/* Asset list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {filtered.length === 0 && (
                  <div style={{ textAlign: "center", color: C.muted, padding: "32px", fontSize: "13px" }}>
                    No assets match this filter.
                  </div>
                )}
                {filtered.map((t) => {
                  const catColor =
                    t.category === "currency"
                      ? C.purpleHi
                      : t.subcategory === "weltrade"
                      ? "#c084fc"
                      : C.cyan;
                  const catLabel =
                    t.category === "currency"
                      ? "💱 FX"
                      : t.subcategory === "weltrade"
                      ? "🌐 Weltrade"
                      : "🔷 Deriv";
                  const isConfirming = confirmId === t.id;
                  return (
                    <div
                      key={t.id}
                      style={{
                        ...gc(catColor),
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: t.result ? `${catColor}08` : "rgba(10,4,24,0.75)",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "800",
                            color: C.text,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {t.pair}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: C.muted,
                            marginTop: "2px",
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <span style={{ color: catColor }}>{catLabel}</span>
                          {t.result && (
                            <span style={{ color: t.result === "win" ? C.green : C.red }}>
                              ● {t.result.toUpperCase()}
                            </span>
                          )}
                          {!t.result && <span>● OPEN</span>}
                        </div>
                      </div>
                      {!isConfirming ? (
                        <button
                          onClick={() => setConfirmId(t.id)}
                          className="btn-hover"
                          style={{
                            background: "rgba(244,63,94,0.1)",
                            border: "1px solid rgba(244,63,94,0.3)",
                            borderRadius: "8px",
                            color: C.red,
                            padding: "7px 14px",
                            cursor: "pointer",
                            fontFamily: FD,
                            fontSize: "11px",
                            fontWeight: "700",
                            flexShrink: 0,
                          }}
                        >
                          Remove
                        </button>
                      ) : (
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                          <button
                            onClick={() => {
                              onRemove(t.id);
                              setConfirmId(null);
                              setSearch("");
                            }}
                            className="btn-hover"
                            style={{
                              background: "linear-gradient(135deg,#f43f5e,#e11d48)",
                              border: "none",
                              borderRadius: "8px",
                              color: "#fff",
                              padding: "7px 14px",
                              cursor: "pointer",
                              fontFamily: FD,
                              fontSize: "11px",
                              fontWeight: "700",
                            }}
                          >
                            Confirm ✕
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="btn-hover"
                            style={{
                              background: "transparent",
                              border: `1px solid ${C.border}`,
                              borderRadius: "8px",
                              color: C.muted,
                              padding: "7px 10px",
                              cursor: "pointer",
                              fontFamily: FD,
                              fontSize: "11px",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── ADD NEW tab ── */}
          {tab === "add" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Pair name */}
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: C.textMid,
                    display: "block",
                    marginBottom: "8px",
                    letterSpacing: "0.4px",
                  }}
                >
                  Pair / Asset Name
                </label>
                <input
                  value={newPair}
                  onChange={(e) => setNewPair(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="e.g. GBP/CHF, Boom 1000 Index, FlipX 6…"
                  style={{ ...inputSt, fontSize: "15px", fontFamily: FM, fontWeight: "700" }}
                />
              </div>

              {/* Category */}
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: C.textMid,
                    display: "block",
                    marginBottom: "8px",
                    letterSpacing: "0.4px",
                  }}
                >
                  Category
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { id: "currency", label: "Currency", icon: "💱" },
                    { id: "index", label: "Index", icon: "📊" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setNewCat(c.id)}
                      className="btn-hover"
                      style={{
                        fontFamily: FD,
                        fontWeight: "700",
                        fontSize: "13px",
                        padding: "11px 20px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        flex: 1,
                        background: newCat === c.id ? C.grad1 : "rgba(139,92,246,0.08)",
                        border: newCat === c.id ? "none" : `1px solid ${C.border}`,
                        color: newCat === c.id ? "#fff" : C.muted,
                        boxShadow: newCat === c.id ? `0 4px 14px ${C.purple}40` : "none",
                      }}
                    >
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-category — only for indices */}
              {newCat === "index" && (
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: C.textMid,
                      display: "block",
                      marginBottom: "8px",
                      letterSpacing: "0.4px",
                    }}
                  >
                    Broker / Sub-category
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { id: "deriv", label: "Deriv", icon: "🔷" },
                      { id: "weltrade", label: "Weltrade", icon: "🌐" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setNewSub(s.id)}
                        className="btn-hover"
                        style={{
                          fontFamily: FD,
                          fontWeight: "700",
                          fontSize: "13px",
                          padding: "11px 20px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          flex: 1,
                          background:
                            newSub === s.id
                              ? "linear-gradient(135deg,#06b6d4,#0284c7)"
                              : "rgba(6,182,212,0.08)",
                          border: newSub === s.id ? "none" : `1px solid ${C.border}`,
                          color: newSub === s.id ? "#fff" : C.muted,
                          boxShadow: newSub === s.id ? `0 4px 14px #06b6d440` : "none",
                        }}
                      >
                        {s.icon} {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              {newPair.trim() && (
                <div
                  style={{
                    ...gc(C.green),
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div style={{ fontSize: "13px", color: C.muted }}>Preview:</div>
                  <div
                    style={{ fontSize: "15px", fontWeight: "800", color: C.text, fontFamily: FM }}
                  >
                    {newPair.trim()}
                  </div>
                  <div style={{ fontSize: "11px", color: C.muted }}>·</div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: newCat === "currency" ? C.purpleHi : C.cyan,
                      fontWeight: "700",
                    }}
                  >
                    {newCat === "currency"
                      ? "💱 Currency"
                      : newSub === "weltrade"
                      ? "🌐 Weltrade Index"
                      : "🔷 Deriv Index"}
                  </div>
                </div>
              )}

              <Btn
                onClick={handleAdd}
                variant="primary"
                style={{ padding: "14px", fontSize: "14px" }}
                disabled={!newPair.trim()}
              >
                ➕ Add Asset
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
