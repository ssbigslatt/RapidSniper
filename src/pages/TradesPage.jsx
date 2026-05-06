import { useState } from 'react'

// ─── THEME ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#080412', card: 'rgba(20,8,48,0.75)',
  border: 'rgba(139,92,246,0.18)', borderHi: 'rgba(139,92,246,0.45)',
  purple: '#8b5cf6', purpleHi: '#a78bfa',
  green: '#10b981', greenHi: '#34d399',
  cyan: '#06b6d4', red: '#f43f5e', amber: '#fbbf24',
  text: '#f0e6ff', textMid: '#c4b5fd', muted: '#7c6fa0',
  grad1: 'linear-gradient(135deg,#8b5cf6 0%,#10b981 100%)',
}
const FD = "'Outfit',sans-serif"
const FM = "'JetBrains Mono',monospace"

const gc = (color = '#8b5cf6', extra = {}) => ({
  background: 'rgba(14,5,36,0.8)',
  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${color}45`, borderRadius: '16px',
  boxShadow: `0 4px 28px ${color}14, inset 0 1px 0 ${color}20`,
  ...extra,
})

const inputSt = {
  width: '100%', background: 'rgba(10,4,24,0.85)',
  border: '1px solid rgba(139,92,246,0.18)', borderRadius: '10px',
  padding: '11px 15px', color: '#f0e6ff', fontSize: '14px',
  fontFamily: FD, transition: 'border-color 0.2s,box-shadow 0.2s',
  outline: 'none',
}

const pillStyle = (bg, color, border) => ({
  display: 'inline-block', padding: '3px 12px', borderRadius: '20px',
  fontSize: '11px', fontWeight: '600', letterSpacing: '0.4px',
  background: bg, color, border: `1px solid ${border}`, fontFamily: FD,
})

// ─── BTN ────────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = 'primary', style: ex = {}, disabled }) {
  const V = {
    primary: { background: C.grad1, color: '#fff', border: 'none', boxShadow: `0 4px 18px ${C.purple}40` },
    ghost:   { background: 'transparent', color: C.textMid, border: `1px solid ${C.border}` },
    danger:  { background: 'linear-gradient(135deg,#f43f5e,#e11d48)', color: '#fff', border: 'none' },
    success: { background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', border: 'none' },
    outline: { background: 'rgba(139,92,246,0.09)', color: C.purpleHi, border: `1px solid ${C.borderHi}` },
  }
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ fontFamily: FD, fontWeight: '600', fontSize: '13px', letterSpacing: '0.4px',
        padding: '10px 20px', borderRadius: '10px', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s', ...V[variant], ...ex }}>
      {children}
    </button>
  )
}

// ─── WIN MODAL ──────────────────────────────────────────────────────────────
function WinModal({ onClose, onSave }) {
  const [step, setStep] = useState('ask')
  const [notes, setNotes] = useState('')
  const overlay = { position: 'fixed', inset: 0, background: 'rgba(4,2,14,0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px', fontFamily: FD }
  const box = { ...gc(C.green), padding: '36px', maxWidth: '440px', width: '100%', borderColor: `${C.green}50` }

  return (
    <div style={overlay}>
      <div style={box}>
        {step === 'ask' && <>
          <div style={{ fontSize: '44px', textAlign: 'center', marginBottom: '12px' }}>🏆</div>
          <div style={{ fontSize: '21px', fontWeight: '800', color: C.greenHi, textAlign: 'center', marginBottom: '10px' }}>Congratulations!</div>
          <div style={{ color: C.muted, fontSize: '14px', textAlign: 'center', marginBottom: '26px', lineHeight: '1.8' }}>You Won the Trade!<br />Wanna add possible reasons why the trade was successful?</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Btn onClick={() => setStep('notes')} variant="success" style={{ flex: 1, padding: '13px' }}>Yes, add notes</Btn>
            <Btn onClick={() => setStep('celebrate')} variant="ghost" style={{ flex: 1, padding: '13px' }}>No thanks</Btn>
          </div>
        </>}
        {step === 'notes' && <>
          <div style={{ fontSize: '16px', fontWeight: '800', color: C.greenHi, marginBottom: '6px' }}>✦ Why did this trade win?</div>
          <div style={{ color: C.muted, fontSize: '13px', marginBottom: '14px' }}>Capture what worked for future reference.</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5}
            placeholder="e.g. Zone aligned with trendline, waited for 15min close, clean CHOCH…"
            style={{ ...inputSt, resize: 'vertical', lineHeight: '1.7' }} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <Btn onClick={() => onSave('win', notes)} variant="success" style={{ flex: 1, padding: '12px' }}>Save Notes</Btn>
            <Btn onClick={() => setStep('ask')} variant="ghost" style={{ padding: '12px' }}>← Back</Btn>
          </div>
        </>}
        {step === 'celebrate' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '14px' }}>💚</div>
            <div style={{ fontSize: '21px', fontWeight: '800', color: C.greenHi, marginBottom: '12px', lineHeight: '1.4' }}>Keep Trusting Your<br />Trading System!</div>
            <div style={{ color: C.muted, fontSize: '13px', marginBottom: '26px', lineHeight: '1.8' }}>Discipline and consistency build lasting wealth.</div>
            <Btn onClick={() => onSave('win', '')} variant="success" style={{ width: '100%', padding: '14px', fontSize: '14px' }}>OK, let's go! 🚀</Btn>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── LOSE MODAL ─────────────────────────────────────────────────────────────
function LoseModal({ onClose, onSave }) {
  const [notes, setNotes] = useState('')
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,2,14,0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px', fontFamily: FD }}>
      <div style={{ ...gc(C.red), padding: '36px', maxWidth: '440px', width: '100%', borderColor: `${C.red}45` }}>
        <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '12px' }}>📉</div>
        <div style={{ fontSize: '20px', fontWeight: '800', color: C.red, textAlign: 'center', marginBottom: '8px' }}>Trade Lost</div>
        <div style={{ color: C.muted, fontSize: '13px', textAlign: 'center', marginBottom: '20px', lineHeight: '1.8' }}>Recording your mistakes is how sniper traders grow.</div>
        <label style={{ fontSize: '12px', fontWeight: '600', color: C.textMid, display: 'block', marginBottom: '7px' }}>Possible reasons why trade failed</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5}
          placeholder="e.g. Entered too early, no 15min confirmation, zone wasn't fresh…"
          style={{ ...inputSt, resize: 'vertical', lineHeight: '1.7' }} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
          <Btn onClick={() => onSave('loss', notes)} variant="danger" style={{ flex: 1, padding: '12px' }}>Save & Record</Btn>
          <Btn onClick={onClose} variant="ghost" style={{ padding: '12px' }}>Cancel</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── MANAGE MODAL ───────────────────────────────────────────────────────────
function ManageModal({ trades, onAdd, onRemove, onClose }) {
  const [tab, setTab] = useState('view')
  const [filterCat, setFilterCat] = useState('all')
  const [newPair, setNewPair] = useState('')
  const [newCat, setNewCat] = useState('currency')
  const [newSub, setNewSub] = useState('deriv')
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const filtered = trades.filter(t => {
    const catMatch = filterCat === 'all' || t.category === filterCat || t.subcategory === filterCat
    const searchMatch = !search || t.pair.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  const catOptions = [
    { id: 'all', label: 'All', icon: '◉' },
    { id: 'currency', label: 'Currencies', icon: '💱' },
    { id: 'deriv', label: 'Deriv', icon: '🔷' },
    { id: 'weltrade', label: 'Weltrade', icon: '🌐' },
  ]

  const handleAdd = () => {
    if (!newPair.trim()) return
    const sub = newCat === 'index' ? newSub : null
    onAdd(newPair.trim(), newCat, sub)
    setNewPair('')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,2,14,0.9)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '16px', fontFamily: FD }}>
      <div style={{ ...gc(C.purple), width: '100%', maxWidth: '560px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '22px 24px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: C.purpleHi, letterSpacing: '1px', marginBottom: '4px' }}>⚙ WATCHLIST MANAGER</div>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: C.text, margin: 0 }}>Manage Assets</h3>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.muted, padding: '8px 14px', cursor: 'pointer', fontFamily: FD, fontSize: '12px', fontWeight: '600' }}>✕ Close</button>
          </div>
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(10,4,24,0.7)', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
            {[{ id: 'view', label: 'View & Remove', icon: '📋' }, { id: 'add', label: 'Add New', icon: '➕' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ fontFamily: FD, fontWeight: '700', fontSize: '12px', padding: '8px 16px', borderRadius: '7px', cursor: 'pointer', border: 'none', background: tab === t.id ? C.grad1 : 'transparent', color: tab === t.id ? '#fff' : C.muted }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* View & Remove tab */}
          {tab === 'view' && <>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px', alignItems: 'center' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pair…"
                style={{ ...inputSt, flex: '1 1 140px', padding: '8px 12px', fontSize: '13px' }} />
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {catOptions.map(c => (
                  <button key={c.id} onClick={() => setFilterCat(c.id)}
                    style={{ fontFamily: FD, fontWeight: '700', fontSize: '11px', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: filterCat === c.id ? C.grad1 : 'rgba(139,92,246,0.08)', color: filterCat === c.id ? '#fff' : C.muted }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '11px', color: C.muted, marginBottom: '10px' }}>{filtered.length} asset{filtered.length !== 1 ? 's' : ''}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {filtered.length === 0 && <div style={{ textAlign: 'center', color: C.muted, padding: '32px', fontSize: '13px' }}>No assets match this filter.</div>}
              {filtered.map(t => {
                const catColor = t.category === 'currency' ? C.purpleHi : t.subcategory === 'weltrade' ? '#c084fc' : C.cyan
                const catLabel = t.category === 'currency' ? '💱 FX' : t.subcategory === 'weltrade' ? '🌐 Weltrade' : '🔷 Deriv'
                const isConfirming = confirmId === t.id
                return (
                  <div key={t.id} style={{ ...gc(catColor), padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.pair}</div>
                      <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px', display: 'flex', gap: '8px' }}>
                        <span style={{ color: catColor }}>{catLabel}</span>
                        <span style={{ color: t.result === 'win' ? C.green : t.result === 'loss' ? C.red : C.muted }}>● {t.result ? t.result.toUpperCase() : 'OPEN'}</span>
                      </div>
                    </div>
                    {!isConfirming
                      ? <button onClick={() => setConfirmId(t.id)} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', color: C.red, padding: '7px 14px', cursor: 'pointer', fontFamily: FD, fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>Remove</button>
                      : <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                          <button onClick={() => { onRemove(t.id); setConfirmId(null); setSearch('') }} style={{ background: 'linear-gradient(135deg,#f43f5e,#e11d48)', border: 'none', borderRadius: '8px', color: '#fff', padding: '7px 14px', cursor: 'pointer', fontFamily: FD, fontSize: '11px', fontWeight: '700' }}>Confirm ✕</button>
                          <button onClick={() => setConfirmId(null)} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.muted, padding: '7px 10px', cursor: 'pointer', fontFamily: FD, fontSize: '11px' }}>Cancel</button>
                        </div>
                    }
                  </div>
                )
              })}
            </div>
          </>}

          {/* Add New tab */}
          {tab === 'add' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: C.textMid, display: 'block', marginBottom: '8px' }}>Pair / Asset Name</label>
                <input value={newPair} onChange={e => setNewPair(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  placeholder="e.g. GBP/CHF, Boom 1000 Index, FlipX 6…"
                  style={{ ...inputSt, fontSize: '15px', fontFamily: FM, fontWeight: '700' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: C.textMid, display: 'block', marginBottom: '8px' }}>Category</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[{ id: 'currency', label: 'Currency', icon: '💱' }, { id: 'index', label: 'Index', icon: '📊' }].map(c => (
                    <button key={c.id} onClick={() => setNewCat(c.id)}
                      style={{ fontFamily: FD, fontWeight: '700', fontSize: '13px', padding: '11px 20px', borderRadius: '10px', cursor: 'pointer', flex: 1, background: newCat === c.id ? C.grad1 : 'rgba(139,92,246,0.08)', border: newCat === c.id ? 'none' : `1px solid ${C.border}`, color: newCat === c.id ? '#fff' : C.muted }}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              {newCat === 'index' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: C.textMid, display: 'block', marginBottom: '8px' }}>Broker</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[{ id: 'deriv', label: 'Deriv', icon: '🔷' }, { id: 'weltrade', label: 'Weltrade', icon: '🌐' }].map(s => (
                      <button key={s.id} onClick={() => setNewSub(s.id)}
                        style={{ fontFamily: FD, fontWeight: '700', fontSize: '13px', padding: '11px 20px', borderRadius: '10px', cursor: 'pointer', flex: 1, background: newSub === s.id ? 'linear-gradient(135deg,#06b6d4,#0284c7)' : 'rgba(6,182,212,0.08)', border: newSub === s.id ? 'none' : `1px solid ${C.border}`, color: newSub === s.id ? '#fff' : C.muted }}>
                        {s.icon} {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {newPair.trim() && (
                <div style={{ ...gc(C.green), padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '13px', color: C.muted }}>Preview:</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: C.text, fontFamily: FM }}>{newPair.trim()}</div>
                  <div style={{ fontSize: '11px', color: newCat === 'currency' ? C.purpleHi : C.cyan, fontWeight: '700', marginLeft: 'auto' }}>
                    {newCat === 'currency' ? '💱 Currency' : newSub === 'weltrade' ? '🌐 Weltrade' : '🔷 Deriv'}
                  </div>
                </div>
              )}
              <Btn onClick={handleAdd} variant="primary" style={{ padding: '14px', fontSize: '14px' }} disabled={!newPair.trim()}>
                ➕ Add Asset
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── TRADE CARD ──────────────────────────────────────────────────────────────
function TradeCard({ trade, onResult, pnlInputs, setPnlInputs, setActiveModal }) {
  const bc = trade.result === 'win' ? C.green : trade.result === 'loss' ? C.red : C.purple
  return (
    <div style={{ ...gc(bc), padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: C.muted, fontFamily: FM, marginBottom: '2px' }}>#{String(trade.id).padStart(2, '0')}</div>
          <div style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '-0.3px', color: C.text, lineHeight: '1.2', wordBreak: 'break-word' }}>{trade.pair}</div>
        </div>
        <div style={pillStyle(
          trade.result === 'win' ? 'rgba(16,185,129,0.14)' : trade.result === 'loss' ? 'rgba(244,63,94,0.14)' : 'rgba(139,92,246,0.14)',
          trade.result === 'win' ? C.greenHi : trade.result === 'loss' ? C.red : C.purpleHi,
          trade.result === 'win' ? `${C.green}45` : trade.result === 'loss' ? `${C.red}45` : C.border
        )}>
          {trade.result ? trade.result.toUpperCase() : 'OPEN'}
        </div>
      </div>

      <div>
        <label style={{ fontSize: '10px', fontWeight: '600', color: C.muted, display: 'block', marginBottom: '5px' }}>PnL ($)</label>
        <input type="number" placeholder="0.00"
          value={pnlInputs[trade.id] !== undefined ? pnlInputs[trade.id] : (trade.pnl || '')}
          onChange={e => setPnlInputs(p => ({ ...p, [trade.id]: e.target.value }))}
          onBlur={e => { const v = parseFloat(e.target.value) || 0; if (v !== 0 || trade.pnl !== 0) onResult(trade.id, trade.result, trade.notes, v) }}
          style={{ ...inputSt, padding: '7px 11px', fontSize: '14px', fontFamily: FM, fontWeight: '700' }} />
      </div>

      {trade.notes && (
        <div style={{ fontSize: '11px', color: C.muted, background: 'rgba(0,0,0,0.28)', padding: '8px 10px', borderRadius: '7px', lineHeight: '1.6', borderLeft: `3px solid ${bc}55` }}>
          {trade.notes.length > 70 ? trade.notes.slice(0, 70) + '…' : trade.notes}
        </div>
      )}

      {!trade.result
        ? <div style={{ display: 'flex', gap: '7px' }}>
            <Btn onClick={() => setActiveModal({ id: trade.id, type: 'win' })} variant="success" style={{ flex: 1, padding: '9px', fontSize: '12px' }}>✓ Win</Btn>
            <Btn onClick={() => setActiveModal({ id: trade.id, type: 'lose' })} variant="danger" style={{ flex: 1, padding: '9px', fontSize: '12px' }}>✗ Lose</Btn>
          </div>
        : <Btn onClick={() => setActiveModal({ id: trade.id, type: trade.result === 'win' ? 'win' : 'lose' })} variant="ghost" style={{ width: '100%', padding: '8px', fontSize: '12px' }}>Edit Result</Btn>
      }
    </div>
  )
}

// ─── SUB INDEX SECTION ───────────────────────────────────────────────────────
function SubIndexSection({ title, icon, trades, color, catNum, onResult, pnlInputs, setPnlInputs, setActiveModal }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg,${color}70,${color}30)`, border: `1px solid ${color}45`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '9px', fontWeight: '700', color: color, letterSpacing: '1px' }}>SUB-CATEGORY {catNum}</div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: C.text }}>{title}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: C.muted }}>{trades.filter(t => t.result).length}/{trades.length}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '10px' }}>
        {trades.map(trade => (
          <TradeCard key={trade.id} trade={trade} onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal} />
        ))}
      </div>
    </div>
  )
}

// ─── TRADES PAGE (main export) ───────────────────────────────────────────────
export default function TradesPage({ trades, onResult, onAdd, onRemove }) {
  const [activeModal, setActiveModal] = useState(null)
  const [pnlInputs, setPnlInputs] = useState({})
  const [activeCategory, setActiveCategory] = useState('all')
  const [balance, setBalance] = useState('')
  const [savedBalance, setSavedBalance] = useState(null)
  const [editingBalance, setEditingBalance] = useState(false)
  const [showManage, setShowManage] = useState(false)

  const rec = trades.filter(t => t.result)
  const wins = rec.filter(t => t.result === 'win').length
  const losses = rec.filter(t => t.result === 'loss').length
  const pnl = trades.reduce((a, t) => a + (parseFloat(t.pnl) || 0), 0)
  const wr = rec.length > 0 ? Math.round((wins / rec.length) * 100) : 0

  const currencies = trades.filter(t => t.category === 'currency')
  const allIndices = trades.filter(t => t.category === 'index')
  const derivIndices = trades.filter(t => t.subcategory === 'deriv')
  const weltradeIndices = trades.filter(t => t.subcategory === 'weltrade')

  const bal = parseFloat(savedBalance) || 0
  const growthPct = bal > 0 ? (pnl / bal) * 100 : 0
  const projectedBal = bal + pnl
  const riskPer = bal > 0 ? bal * 0.01 : 0
  const targetBal = bal > 0 ? bal * 1.2 : 0

  const handleSave = (result, notes) => {
    if (!activeModal) return
    const id = activeModal.id
    const p = parseFloat(pnlInputs[id]) || trades.find(t => t.id === id)?.pnl || 0
    onResult(id, result, notes, p)
    setActiveModal(null)
  }

  const tabs = [
    { id: 'all',      label: `All (${trades.length})`,             icon: '◉' },
    { id: 'currency', label: `Currencies (${currencies.length})`,  icon: '💱' },
    { id: 'deriv',    label: `Deriv (${derivIndices.length})`,     icon: '🔷' },
    { id: 'weltrade', label: `Weltrade (${weltradeIndices.length})`,icon: '🌐' },
  ]

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', fontFamily: FD }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'inline-block', padding: '3px 14px', borderRadius: '20px', background: `${C.purple}12`, border: `1px solid ${C.border}`, color: C.purpleHi, fontSize: '11px', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px' }}>PERFORMANCE TRACKER</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '3px', color: C.text }}>Trades <span style={{ color: C.purpleHi }}>(PnL)</span></h2>
            <div style={{ color: C.muted, fontSize: '13px' }}>{rec.length}/{trades.length} recorded · {currencies.length} FX · {derivIndices.length} Deriv · {weltradeIndices.length} Weltrade</div>
          </div>
          <Btn onClick={() => setShowManage(true)} variant="outline" style={{ padding: '10px 18px', fontSize: '12px', flexShrink: 0 }}>⚙ Manage Assets</Btn>
        </div>
      </div>

      {/* ── Balance Card ────────────────────────────────────────────────────── */}
      <div style={{ ...gc(C.green), padding: '20px 24px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 220px', minWidth: '200px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: C.greenHi, letterSpacing: '1.5px', marginBottom: '10px' }}>💰 TRADING BALANCE</div>
          {editingBalance || !savedBalance
            ? <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: C.muted, fontSize: '15px', fontWeight: '700', fontFamily: FM }}>$</span>
                  <input type="number" placeholder="0.00" value={balance}
                    onChange={e => setBalance(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && balance) { setSavedBalance(balance); setEditingBalance(false) } }}
                    style={{ ...inputSt, paddingLeft: '28px', fontSize: '18px', fontFamily: FM, fontWeight: '800', color: C.greenHi }} />
                </div>
                <Btn onClick={() => { if (balance) { setSavedBalance(balance); setEditingBalance(false) } }} variant="success" style={{ padding: '11px 18px', fontSize: '12px', flexShrink: 0 }}>Save</Btn>
              </div>
            : <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: C.greenHi, fontFamily: FM }}>${parseFloat(savedBalance).toLocaleString()}</div>
                <button onClick={() => { setBalance(savedBalance); setEditingBalance(true) }} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.muted, padding: '6px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: FD, fontWeight: '600' }}>Edit</button>
              </div>
          }
          <div style={{ fontSize: '11px', color: C.muted, marginTop: '6px' }}>Enter your balance to see growth analytics</div>
        </div>

        {savedBalance && bal > 0 && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: '2 1 400px' }}>
            {[
              { l: 'CURRENT BALANCE',    v: `$${bal.toLocaleString()}`,                                c: C.greenHi, icon: '💰' },
              { l: 'NET PnL',            v: `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(0)}`,               c: pnl >= 0 ? C.greenHi : C.red, icon: '📈' },
              { l: 'PROJECTED BALANCE',  v: `$${projectedBal.toLocaleString()}`,                       c: projectedBal > bal ? C.greenHi : C.red, icon: '🎯' },
              { l: 'GROWTH %',           v: `${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(1)}%`,   c: growthPct >= 0 ? C.greenHi : C.red, icon: '📊' },
              { l: '1% RISK / TRADE',    v: `$${riskPer.toFixed(2)}`,                                  c: C.purpleHi, icon: '⚠' },
              { l: '20% TARGET',         v: `$${targetBal.toLocaleString()}`,                          c: C.cyan, icon: '🏆' },
            ].map(s => (
              <div key={s.l} style={{ ...gc(), padding: '12px 16px', minWidth: '120px', flex: '1 1 120px', background: 'rgba(8,4,20,0.7)' }}>
                <div style={{ fontSize: '9px', fontWeight: '700', color: C.muted, letterSpacing: '1px', marginBottom: '4px' }}>{s.icon} {s.l}</div>
                <div style={{ fontSize: '16px', fontWeight: '900', color: s.c, fontFamily: FM }}>{s.v}</div>
              </div>
            ))}
            {/* Progress bar */}
            <div style={{ width: '100%', ...gc(), padding: '12px 16px', background: 'rgba(8,4,20,0.7)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: C.muted, letterSpacing: '1px' }}>PROGRESS TO 20% TARGET</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: C.cyan, fontFamily: FM }}>{Math.min(Math.max((growthPct / 20) * 100, 0), 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(139,92,246,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(Math.max((growthPct / 20) * 100, 0), 100)}%`, background: `linear-gradient(90deg,${C.green},${C.cyan})`, borderRadius: '6px', transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', color: C.muted }}>${bal.toLocaleString()}</span>
                <span style={{ fontSize: '10px', color: C.cyan }}>${targetBal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Summary Bar ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
        {[
          { l: 'WINS',     v: wins,                                           c: C.green },
          { l: 'LOSSES',   v: losses,                                         c: C.red },
          { l: 'WIN RATE', v: rec.length > 0 ? `${wr}%` : '—',              c: C.purple },
          { l: 'NET PnL',  v: `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(0)}`,  c: pnl >= 0 ? C.greenHi : C.red },
        ].map(s => (
          <div key={s.l} style={{ ...gc(s.c), padding: '10px 18px', minWidth: '85px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: C.muted, letterSpacing: '1px' }}>{s.l}</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: s.c, marginTop: '3px', fontFamily: FM }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* ── Category Tabs ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', background: 'rgba(14,5,36,0.8)', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '5px', width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveCategory(tab.id)}
            style={{ fontFamily: FD, fontWeight: '700', fontSize: '11px', padding: '8px 16px', borderRadius: '9px', cursor: 'pointer', border: 'none', background: activeCategory === tab.id ? C.grad1 : 'transparent', color: activeCategory === tab.id ? '#fff' : C.muted, boxShadow: activeCategory === tab.id ? `0 4px 14px ${C.purple}40` : 'none', transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Currencies ──────────────────────────────────────────────────────── */}
      {(activeCategory === 'all' || activeCategory === 'currency') && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg,${C.purple},${C.purpleHi})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💱</div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: C.purpleHi, letterSpacing: '1px' }}>CATEGORY 01</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: C.text }}>Currencies</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '12px', color: C.muted }}>{currencies.filter(t => t.result).length}/{currencies.length} done</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '10px' }}>
            {currencies.map(trade => <TradeCard key={trade.id} trade={trade} onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal} />)}
          </div>
        </div>
      )}

      {activeCategory === 'all' && <div style={{ height: '1px', background: `linear-gradient(90deg,transparent,${C.border},transparent)`, margin: '4px 0 28px' }} />}

      {/* ── Indices ─────────────────────────────────────────────────────────── */}
      {(activeCategory === 'all' || activeCategory === 'deriv' || activeCategory === 'weltrade') && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg,${C.cyan},#0284c7)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📊</div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: C.cyan, letterSpacing: '1px' }}>CATEGORY 02</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: C.text }}>Indices</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '12px', color: C.muted }}>{allIndices.filter(t => t.result).length}/{allIndices.length} done</div>
          </div>

          {(activeCategory === 'all' || activeCategory === 'deriv') && (
            <div style={{ marginBottom: '24px' }}>
              <SubIndexSection title="Deriv Indices" icon="🔷" trades={derivIndices} color={C.cyan} catNum="2A" onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal} />
            </div>
          )}

          {activeCategory === 'all' && <div style={{ height: '1px', background: `linear-gradient(90deg,transparent,rgba(139,92,246,0.1),transparent)`, margin: '4px 0 20px' }} />}

          {(activeCategory === 'all' || activeCategory === 'weltrade') && (
            <SubIndexSection title="Weltrade Indices" icon="🌐" trades={weltradeIndices} color="#c084fc" catNum="2B" onResult={onResult} pnlInputs={pnlInputs} setPnlInputs={setPnlInputs} setActiveModal={setActiveModal} />
          )}
        </div>
      )}

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {showManage && <ManageModal trades={trades} onAdd={onAdd} onRemove={onRemove} onClose={() => setShowManage(false)} />}
      {activeModal?.type === 'win'  && <WinModal  onClose={() => setActiveModal(null)} onSave={handleSave} />}
      {activeModal?.type === 'lose' && <LoseModal onClose={() => setActiveModal(null)} onSave={handleSave} />}
    </div>
  )
}
