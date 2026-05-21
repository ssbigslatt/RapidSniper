import { BASE_URL } from "../config";
import React, { useState } from "react";
import axios from "axios";
import { C, FD, gc, inputSt } from "../constants";
import { Btn } from "../components/Btn";
import { Footer } from "../components/Footer";

export function Login({ onLogin, onGoSignup, onGoHome }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!u || !p) {
      setErr("All fields required.");
      return;
    }
    setLoading(true);
    setErr("");
    
    try {
      const response = await axios.post("https://ssbigslatt.pythonanywhere.com/api/login/", {
        username: u,
        password: p
      });
      
      if (response.data && response.data.username) {
        onLogin(response.data); // Pass the whole user object
      }
    } catch (error) {
      if (!error.response) {
        setErr("Backend is unreachable. Please ensure the server is running.");
      } else if (error.response.status === 401) {
        setErr("Invalid credentials.");
      } else {
        setErr(error.response.data?.error || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: FD,
      }}
    >
      <div className="fade-up" style={{ width: "100%", maxWidth: "410px", position: "relative" }}>
        {onGoHome && (
          <button
            onClick={onGoHome}
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${C.border}`,
              color: C.muted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              zIndex: 10,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.1)"; e.currentTarget.style.color = C.red; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = C.muted; }}
          >
            ✕
          </button>
        )}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "62px",
              height: "62px",
              borderRadius: "18px",
              background: C.grad1,
              boxShadow: `0 8px 28px ${C.purple}50`,
              marginBottom: "14px",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: "26px" }}>⚡</span>
          </div>
          <div
            style={{
              fontSize: "26px",
              fontWeight: "900",
              background: C.grad1,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            TRADING SNIPER
          </div>
          <div
            style={{
              color: C.muted,
              fontSize: "12px",
              fontWeight: "600",
              marginTop: "4px",
              letterSpacing: "2px",
            }}
          >
            TRADING STRATEGY BUILDER
          </div>
        </div>
        <div style={{ ...gc(C.purple), padding: "34px 30px", background: "rgba(14, 5, 36, 0.25)", backdropFilter: "blur(8px) saturate(180%)", WebkitBackdropFilter: "blur(8px) saturate(180%)" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: C.text,
              marginBottom: "5px",
            }}
          >
            Welcome back
          </div>
          <div style={{ color: C.muted, fontSize: "13px", marginBottom: "26px" }}>
            Sign in to your strategy dashboard
          </div>
          {[
            ["Username or Email", "text", u, setU, "ssbigslatt"],
            ["Password", "password", p, setP, "••••••••••"],
          ].map(([lbl, type, val, set, ph]) => (
            <div key={lbl} style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: C.textMid,
                  marginBottom: "7px",
                  letterSpacing: "0.4px",
                }}
              >
                {lbl}
              </label>
              <input
                value={val}
                type={type}
                placeholder={ph}
                onChange={(e) => set(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                style={inputSt}
              />
            </div>
          ))}
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
            onClick={submit}
            disabled={loading}
            style={{ width: "100%", padding: "13px", fontSize: "14px", marginTop: "4px" }}
          >
            {loading ? "Authenticating…" : "Sign In →"}
          </Btn>
          <div
            style={{
              marginTop: "18px",
              textAlign: "center",
              color: C.muted,
              fontSize: "12px",
            }}
          >
            New here? Create an account below
          </div>
          <div
            style={{
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            <button
              onClick={() => onGoSignup?.()}
              style={{
                background: "transparent",
                border: "none",
                color: C.purpleHi,
                cursor: "pointer",
                fontFamily: FD,
                fontWeight: 800,
                letterSpacing: "0.3px",
                fontSize: "12px",
              }}
            >
              Go to Sign Up →
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
