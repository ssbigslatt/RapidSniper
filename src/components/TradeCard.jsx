import React from "react";
import { C, FD, FM, gc, inputSt } from "../constants";

export function TradeCard({ trade, onResult, pnlInputs, setPnlInputs, setActiveModal }) {
  const normalizedResult = trade.result?.toLowerCase();
  const bc = normalizedResult === 'win' ? C.green : normalizedResult === 'loss' ? C.red : C.purple
  return (
    <div className="card-hover" style={{ ...gc(bc), padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '11px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: C.muted, fontFamily: FM, marginBottom: '2px' }}>#{String(trade.id).padStart(2, '0')}</div>
          <div style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '-0.3px', color: C.text, lineHeight: '1.2', wordBreak: 'break-word' }}>{trade.pair}</div>
        </div>
        <button 
          style={{ 
            background: 'rgba(139,92,246,0.1)', 
            border: `1px solid ${C.border}`, 
            borderRadius: '6px', 
            color: trade.result ? (normalizedResult === 'win' ? C.greenHi : C.red) : C.purpleHi, 
            padding: '4px 10px', 
            fontSize: '10px', 
            fontWeight: '700', 
            fontFamily: FD,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="btn-hover"
        >
          {trade.result ? trade.result.toUpperCase() : 'OPEN'}
        </button>
      </div>

      <div>
        <label style={{ fontSize: '10px', fontWeight: '600', color: C.muted, display: 'block', marginBottom: '5px' }}>PnL ($)</label>
        <input type="number" placeholder="0.00"
          value={pnlInputs[trade.id] !== undefined ? pnlInputs[trade.id] : (trade.pnl || '')}
          onChange={e => setPnlInputs(p => ({ ...p, [trade.id]: e.target.value }))}
          onBlur={e => { const v = parseFloat(e.target.value) || 0; if (v !== 0 || trade.pnl !== 0) onResult(trade.id, trade.result, trade.notes, v) }}
          style={{ 
            ...inputSt, 
            padding: '10px 12px', 
            fontSize: '16px', 
            fontFamily: FM, 
            fontWeight: '700',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.3)',
            border: `1px solid ${C.border}`
          }} />
      </div>

      <div style={{ flex: 1, minHeight: 0 }} />

      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button 
          onClick={() => setActiveModal({ id: trade.id, type: 'win' })}
          style={{ 
            flex: 1, 
            padding: '10px', 
            fontSize: '13px', 
            fontWeight: '800', 
            fontFamily: FD, 
            borderRadius: '10px', 
            background: C.green, 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          className="btn-hover"
        >
          ✓ Win
        </button>
        <button 
          onClick={() => setActiveModal({ id: trade.id, type: 'lose' })}
          style={{ 
            flex: 1, 
            padding: '10px', 
            fontSize: '13px', 
            fontWeight: '800', 
            fontFamily: FD, 
            borderRadius: '10px', 
            background: C.red, 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          className="btn-hover"
        >
          ✗ Lose
        </button>
      </div>
    </div>
  );
}