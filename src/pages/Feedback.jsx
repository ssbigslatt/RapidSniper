import React, { useState } from "react";
import { C, FD, gc, inputSt } from "../constants";
import { Btn } from "../components/Btn";
import { Footer } from "../components/Footer";

export function Feedback({ onSubmit }) {
  const [type, setType] = useState("suggestion");
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    
    setLoading(true);
    setErr("");
    
    try {
      if (onSubmit) {
        await onSubmit({ type, message: msg, email });
      }
      setSubmitted(true);
      setMsg("");
      setEmail("");
    } catch (error) {
      setErr("Failed to submit feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center", fontFamily: FD }} className="fade-up">
        <div style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          justifyContent: "center", 
          width: "80px", 
          height: "80px", 
          borderRadius: "50%", 
          background: "rgba(16,185,129,0.1)", 
          color: C.greenHi, 
          fontSize: "40px", 
          marginBottom: "24px",
          border: `1px solid ${C.green}33`
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: "900", color: C.text, marginBottom: "12px" }}>Thank You!</h2>
        <p style={{ color: C.muted, maxWidth: "400px", margin: "0 auto 32px", lineHeight: "1.7" }}>
          Your feedback has been received. We appreciate your help in making Trading Sniper better.
        </p>
        <Btn onClick={() => setSubmitted(false)} variant="outline">Send Another Response</Btn>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 24px", maxWidth: "600px", margin: "0 auto", fontFamily: FD }} className="fade-up">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "900", color: C.text, marginBottom: "12px", letterSpacing: "-0.5px" }}>
          Share Your Feedback
        </h1>
        <p style={{ color: C.muted, lineHeight: "1.7" }}>
          Have a suggestion or found a bug? Let us know how we can improve your trading experience.
        </p>
      </div>

      <div style={{ ...gc(C.purple), padding: "32px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: C.textMid, marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>
              Feedback Type
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["suggestion", "bug", "feature", "other"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: `1px solid ${type === t ? C.purpleHi : C.border}`,
                    background: type === t ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                    color: type === t ? C.purpleHi : C.muted,
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    transition: "all 0.2s"
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: C.textMid, marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={inputSt}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: C.textMid, marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>
              Message
            </label>
            <textarea
              required
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Tell us what's on your mind..."
              style={{ ...inputSt, minHeight: "150px", resize: "vertical" }}
            />
          </div>

          {err && (
            <div
              style={{
                background: C.redSoft,
                border: "1px solid rgba(244,63,94,0.3)",
                borderRadius: "8px",
                padding: "9px 13px",
                color: C.red,
                fontSize: "13px",
                marginBottom: "14px",
              }}
            >
              ⚠ {err}
            </div>
          )}

          <Btn
            type="submit"
            disabled={loading || !msg.trim()}
            style={{ width: "100%", padding: "14px" }}
          >
            {loading ? "Sending..." : "Submit Feedback →"}
          </Btn>
        </form>
      </div>
    </div>
  );
}
