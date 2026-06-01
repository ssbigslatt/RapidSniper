import React from "react";
import { C, FD, gc } from "../constants";
import { Btn } from "./Btn";

export function FlowModal({ title, body, emoji, accentColor = C.purple, actions }) {
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
        zIndex: 300,
        padding: "20px",
        fontFamily: FD,
      }}
    >
      <div
        className="pop-in"
        style={{
          ...gc(accentColor),
          padding: "36px 32px",
          maxWidth: "440px",
          width: "100%",
          borderColor: `${accentColor}55`,
          boxShadow: `0 0 60px ${accentColor}22`,
        }}
      >
        {emoji && (
          <div
            style={{
              fontSize: "44px",
              textAlign: "center",
              marginBottom: "14px",
              animation: "float 2.5s ease-in-out infinite",
            }}
          >
            {emoji}
          </div>
        )}
        {title && (
          <div
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: C.text,
              textAlign: "center",
              marginBottom: "10px",
              lineHeight: "1.3",
            }}
          >
            {title}
          </div>
        )}
        {body && (
          <div
            style={{
              color: C.muted,
              fontSize: "14px",
              textAlign: "center",
              lineHeight: "1.8",
              marginBottom: "26px",
            }}
          >
            {body}
          </div>
        )}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {actions.map((a, i) => (
            <Btn
              key={i}
              onClick={a.fn}
              variant={a.variant || "primary"}
              style={{ flex: "1 1 0", padding: "13px", fontSize: "13px", ...a.style }}
            >
              {a.label}
            </Btn>
          ))}
        </div>
      </div>
    </div>
  );
}
