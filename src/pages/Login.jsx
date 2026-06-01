import React, { useState } from "react";
import axios from "axios";
import { C, FD, gc, inputSt } from "../constants";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
import { Btn } from "../components/Btn";

export function Login({ onLogin, setPage }) {
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
      const response = await axios.post(`${API_BASE}/login/`, {
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
      <div className="fade-up" style={{ width: "100%", maxWidth: "410px" }}>
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
            RAPID SNIPER
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
            TRADING STRATEGY
          </div>
        </div>
        <div style={{ ...gc(C.purple), padding: "34px 30px" }}>
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
            ["Username", "text", u, setU, "ssbigslatt"],
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
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <button
              onClick={() => setPage && setPage('signup')}
              style={{
                background: 'transparent',
                border: 'none',
                color: C.purpleHi,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13
              }}
            >
              Create an account
            </button>
          </div>
          <div
            style={{
              marginTop: "18px",
              textAlign: "center",
              color: C.muted,
              fontSize: "12px",
            }}
          >
            🔒 Secured · Django JWT ready
          </div>
        </div>
      </div>
    </div>
  );
}
