import React, { useState } from "react";
import { C, FD, gc, inputSt } from "../constants";
import { Btn } from "./Btn";

export function WinModal({ onClose, onSave }) {
  const [step, setStep] = useState("ask");
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
          ...gc(C.green),
          padding: "36px",
          maxWidth: "440px",
          width: "100%",
          borderColor: `${C.green}50`,
        }}
      >
        {step === "ask" && (
          <>
            <div
              style={{
                fontSize: "44px",
                textAlign: "center",
                marginBottom: "12px",
                animation: "float 2s ease-in-out infinite",
              }}
            >
              🏆
            </div>
            <div
              style={{
                fontSize: "21px",
                fontWeight: "800",
                color: C.greenHi,
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              Congratulations!
            </div>
            <div
              style={{
                color: C.muted,
                fontSize: "14px",
                textAlign: "center",
                marginBottom: "26px",
                lineHeight: "1.8",
              }}
            >
              You Won the Trade!
              <br />
              Wanna add possible reasons why the trade was successful?
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn
                onClick={() => setStep("notes")}
                variant="success"
                style={{ flex: 1, padding: "13px" }}
              >
                Yes, add notes
              </Btn>
              <Btn
                onClick={() => setStep("celebrate")}
                variant="ghost"
                style={{ flex: 1, padding: "13px" }}
              >
                No thanks
              </Btn>
            </div>
          </>
        )}
        {step === "notes" && (
          <>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "800",
                color: C.greenHi,
                marginBottom: "6px",
              }}
            >
              ✦ Why did this trade win?
            </div>
            <div style={{ color: C.muted, fontSize: "13px", marginBottom: "14px" }}>
              Capture what worked for future reference.
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="e.g. Zone aligned with trendline, waited for 15min close, clean CHOCH…"
              style={{ ...inputSt, resize: "vertical", lineHeight: "1.7" }}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              <Btn
                onClick={() => {
                  onSave("win", notes);
                }}
                variant="success"
                style={{ flex: 1, padding: "12px" }}
              >
                Save Notes
              </Btn>
              <Btn
                onClick={() => setStep("ask")}
                variant="ghost"
                style={{ padding: "12px" }}
              >
                ← Back
              </Btn>
            </div>
          </>
        )}
        {step === "celebrate" && (
          <>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "50px",
                  marginBottom: "14px",
                  animation: "float 2s ease-in-out infinite",
                }}
              >
                💚
              </div>
              <div
                style={{
                  fontSize: "21px",
                  fontWeight: "800",
                  color: C.greenHi,
                  marginBottom: "12px",
                  lineHeight: "1.4",
                }}
              >
                Keep Trusting Your
                <br />
                Trading System!
              </div>
              <div
                style={{
                  color: C.muted,
                  fontSize: "13px",
                  marginBottom: "26px",
                  lineHeight: "1.8",
                }}
              >
                Discipline and consistency build lasting wealth. Stay in the process.
              </div>
              <Btn
                onClick={() => {
                  onSave("win", "");
                }}
                variant="success"
                style={{ width: "100%", padding: "14px", fontSize: "14px" }}
              >
                OK, let's go! 🚀
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
