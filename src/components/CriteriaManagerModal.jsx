import React, { useState } from "react";
import { C, FD, FM, gc, inputSt } from "../constants";
import { Btn } from "./Btn";

export function CriteriaManagerModal({ title, items, accentColor, onSave, onClose }) {
  const [localItems, setLocalItems] = useState([...items]);
  const [newItem, setNewItem] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editVal, setEditVal] = useState("");

  const add = () => {
    if (newItem.trim()) {
      setLocalItems((p) => [...p, newItem.trim()]);
      setNewItem("");
    }
  };

  const remove = (i) => {
    setLocalItems((p) => p.filter((_, j) => j !== i));
  };

  const startEdit = (i) => {
    setEditIdx(i);
    setEditVal(localItems[i]);
  };

  const saveEdit = () => {
    if (editVal.trim()) {
      setLocalItems((prev) =>
        prev.map((v, i) => (i === editIdx ? editVal.trim() : v))
      );
    }
    setEditIdx(null);
    setEditVal("");
  };

  const moveUp = (i) => {
    if (i === 0) return;
    setLocalItems((p) => {
      const a = [...p];
      [a[i - 1], a[i]] = [a[i], a[i - 1]];
      return a;
    });
  };

  const moveDown = (i) => {
    if (i === localItems.length - 1) return;
    setLocalItems((p) => {
      const a = [...p];
      [a[i], a[i + 1]] = [a[i + 1], a[i]];
      return a;
    });
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
          ...gc(accentColor),
          width: "100%",
          maxWidth: "580px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 24px 16px",
            borderBottom: `1px solid ${accentColor}30`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "6px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: accentColor,
                  letterSpacing: "1.5px",
                  marginBottom: "4px",
                }}
              >
                ✎ CRITERIA MANAGER
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "900", color: C.text, margin: 0 }}>
                Manage — {title}
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
                padding: "7px 13px",
                cursor: "pointer",
                fontFamily: FD,
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: "12px", color: C.muted }}>
            {localItems.length} criteria · drag ↕ to reorder
          </div>
        </div>

        {/* Add new item */}
        <div
          style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Type a new criteria item and press Enter or Add…"
              style={{ ...inputSt, flex: 1, padding: "9px 14px", fontSize: "13px" }}
            />
            <Btn
              onClick={add}
              variant="primary"
              style={{ padding: "9px 18px", fontSize: "12px", flexShrink: 0 }}
              disabled={!newItem.trim()}
            >
              ➕ Add
            </Btn>
          </div>
        </div>

        {/* Items list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {localItems.length === 0 && (
            <div style={{ textAlign: "center", color: C.muted, padding: "40px", fontSize: "13px" }}>
              No criteria yet. Add one above.
            </div>
          )}
          {localItems.map((item, i) => (
            <div
              key={i}
              style={{
                ...gc(accentColor),
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(10,4,24,0.75)",
              }}
            >
              {/* Number */}
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: accentColor,
                  fontFamily: FM,
                  minWidth: "22px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Text or edit input */}
              {editIdx === i ? (
                <input
                  value={editVal}
                  onChange={(e) => setEditVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") {
                      setEditIdx(null);
                    }
                  }}
                  autoFocus
                  style={{ ...inputSt, flex: 1, padding: "6px 10px", fontSize: "13px" }}
                />
              ) : (
                <div
                  style={{
                    flex: 1,
                    fontSize: "13px",
                    fontWeight: "500",
                    color: C.text,
                    lineHeight: "1.5",
                  }}
                >
                  {item}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                {/* Reorder up/down */}
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="btn-hover"
                  style={{
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    borderRadius: "6px",
                    color: i === 0 ? C.border : C.muted,
                    padding: "4px 7px",
                    cursor: i === 0 ? "default" : "pointer",
                    fontFamily: FD,
                    fontSize: "12px",
                    opacity: i === 0 ? 0.3 : 1,
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === localItems.length - 1}
                  className="btn-hover"
                  style={{
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    borderRadius: "6px",
                    color: i === localItems.length - 1 ? C.border : C.muted,
                    padding: "4px 7px",
                    cursor: i === localItems.length - 1 ? "default" : "pointer",
                    fontFamily: FD,
                    fontSize: "12px",
                    opacity: i === localItems.length - 1 ? 0.3 : 1,
                  }}
                >
                  ↓
                </button>
                {/* Edit */}
                {editIdx === i ? (
                  <button
                    onClick={saveEdit}
                    className="btn-hover"
                    style={{
                      background: `${accentColor}20`,
                      border: `1px solid ${accentColor}50`,
                      borderRadius: "6px",
                      color: accentColor,
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontFamily: FD,
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(i)}
                    className="btn-hover"
                    style={{
                      background: "rgba(139,92,246,0.08)",
                      border: `1px solid ${C.border}`,
                      borderRadius: "6px",
                      color: C.muted,
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontFamily: FD,
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    Edit
                  </button>
                )}
                {/* Remove */}
                <button
                  onClick={() => remove(i)}
                  className="btn-hover"
                  style={{
                    background: "rgba(244,63,94,0.08)",
                    border: "1px solid rgba(244,63,94,0.3)",
                    borderRadius: "6px",
                    color: C.red,
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontFamily: FD,
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <Btn
            onClick={() => {
              if (localItems.length === 0) {
                alert("Add at least one criteria item before saving.");
                return;
              }
              onSave(localItems);
              onClose();
            }}
            variant="primary"
            style={{ flex: 1, padding: "12px" }}
          >
            ✓ Save Changes ({localItems.length} items)
          </Btn>
          <Btn onClick={onClose} variant="ghost" style={{ padding: "12px 18px" }}>
            Cancel
          </Btn>
        </div>
      </div>
    </div>
  );
}
