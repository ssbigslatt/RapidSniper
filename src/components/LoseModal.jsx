import React, { useState } from "react";
import { C, FD, gc, inputSt } from "../constants";
import { Btn } from "./Btn";

export function LoseModal({ onClose, onSave }) {
  const [notes, setNotes] = useState("");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(4,2,14,0.88)",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: "20px",
        fontFamily: FD,
      }}
    >
      <div
        className="pop-in"
        style={{
          ...gc(C.red),
          padding: "36px",
          maxWidth: "440px",
          width: "100%",
          borderColor: `${C.red}45`,
        }}
      >
        <div style={{ fontSize: "40px", textAlign: "center", marginBottom: "12px" }}>
          📉
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "800",
            color: C.red,
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Trade Lost
        </div>
        <div
          style={{
            color: C.muted,
            fontSize: "13px",
            textAlign: "center",
            marginBottom: "20px",
            lineHeight: "1.8",
          }}
        >
          Recording your mistakes is how sniper traders grow.
        </div>
        <label
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: C.textMid,
            display: "block",
            marginBottom: "7px",
          }}
        >
          Possible reasons why trade failed
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="e.g. Entered too early, no 15min confirmation, zone wasn't fresh…"
          style={{ ...inputSt, resize: "vertical", lineHeight: "1.7" }}
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
          <Btn
            onClick={() => {
              onSave("loss", notes);
            }}
            variant="danger"
            style={{ flex: 1, padding: "12px" }}
          >
            Save & Record
          </Btn>
          <Btn onClick={onClose} variant="ghost" style={{ padding: "12px" }}>
            Cancel
          </Btn>
        </div>
      </div>
    </div>
  );
}
