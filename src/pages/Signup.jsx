import React, { useMemo, useState } from "react";
import axios from "axios";
import { C, FD, gc, inputSt } from "../constants";
import { Btn } from "../components/Btn";
import { Footer } from "../components/Footer";

function validatePassword(pw) {
  // 8-18 chars, at least one special, one number, one uppercase, one lowercase
  // special = any non-alphanumeric
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,18}$/;
  return re.test(pw);
}

export function Signup({ onSignedUp, onGoLogin, onGoHome }) {
  const [u, setU] = useState("");
  const [email, setEmail] = useState("");
  const [p, setP] = useState("");
  const [p2, setP2] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const passwordHelp = useMemo(
    () => "Password: 8-18 chars with uppercase, lowercase, number, and special char.",
    []
  );

  const submit = async () => {
    setErr("");

    if (!u || !email || !p || !p2) {
      setErr("All fields are required.");
      return;
    }

    const usernameTrimmed = u.trim();
    if (usernameTrimmed.length < 3) {
      setErr("Username must be at least 3 characters.");
      return;
    }

    if (/\s/.test(usernameTrimmed)) {
      setErr("Username cannot contain spaces.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }

    if (p !== p2) {
      setErr("Passwords do not match.");
      return;
    }

    if (!validatePassword(p)) {
      setErr("Password must be 8-18 chars with uppercase, lowercase, number, and special character.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/signup/", {
        username: u,
        email: email,
        password: p,
      });

      alert(
        "Account created successfully! Please log in with your credentials."
      );

      // After successful signup, redirect user back to Login screen
      if (onSignedUp) onSignedUp(res.data);
    } catch (error) {
      if (!error.response) {
        setErr("Backend is unreachable. Please ensure the server is running.");
      } else {
        const errorData = error.response.data;
        if (typeof errorData === "string") {
          setErr(`Server Error: ${errorData.slice(0, 100)}...`);
        } else {
          setErr(errorData?.error || "An unexpected error occurred.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Google signup/login option (stub-friendly)
  // Uses "Google HTML API"-style approach: when configured, Google can return a credential.
  // Here we simply trigger the token flow hook; if backend is not configured,
  // it will respond with a clear message.
  const handleGoogle = async () => {
    setErr("");
    setGoogleLoading(true);
    try {
      // If Google Identity Services is wired on the page, developers typically provide
      // a global prompt/credential via their own callback.
      // For now, show a direct instruction so it doesn't silently fail.
      if (typeof window.google === "undefined" || !window.google.accounts) {
        throw new Error(
          "Google Identity Services not loaded. Add the Google script snippet to your app index.html to enable the Google button."
        );
      }

      // If you later wire google.accounts.id with a real callback,
      // call backend /api/google-signin/ with the returned credential.
      // For now, we fall back to a clear message.
      alert(
        "Google signup button is present. Wire Google Identity Services (HTML/JS) to fetch a credential and POST it to /api/google-signin/."
      );
    } catch (e) {
      setErr(e?.message || "Google sign-in is not configured yet.");
    } finally {
      setGoogleLoading(false);
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
            Create Account
          </div>
          <div style={{ color: C.muted, fontSize: "13px", marginBottom: "26px" }}>
            Sign up to access your strategy dashboard
          </div>

          <div style={{ marginBottom: "15px" }}>
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
              Username
            </label>
            <input
              value={u}
              type="text"
              placeholder="your_username"
              onChange={(e) => setU(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={inputSt}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
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
              Email Address
            </label>
            <input
              value={email}
              type="email"
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={inputSt}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
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
              Password
            </label>
            <input
              value={p}
              type="password"
              placeholder="********"
              onChange={(e) => setP(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={inputSt}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
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
              Confirm Password
            </label>
            <input
              value={p2}
              type="password"
              placeholder="********"
              onChange={(e) => setP2(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={inputSt}
            />
          </div>

          <div style={{ color: C.muted, fontSize: "11px", marginBottom: "16px", lineHeight: 1.6 }}>
            {passwordHelp}
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
            onClick={submit}
            disabled={loading}
            style={{ width: "100%", padding: "13px", fontSize: "14px", marginTop: "4px" }}
          >
            {loading ? "Creating…" : "Create Account →"}
          </Btn>

          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <div style={{ height: 1, background: "rgba(139,92,246,0.18)", flex: 1 }} />
              <div style={{ color: C.muted, fontSize: "11px", fontWeight: 700 }}>OR</div>
              <div style={{ height: 1, background: "rgba(139,92,246,0.18)", flex: 1 }} />
            </div>

            <Btn
              onClick={handleGoogle}
              disabled={googleLoading}
              variant="outline"
              style={{ width: "100%", padding: "13px", fontSize: "14px" }}
            >
              {googleLoading ? "Google…" : "Continue with Google"}
            </Btn>
          </div>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button
              onClick={() => (onGoLogin ? onGoLogin({}) : null)}
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
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

