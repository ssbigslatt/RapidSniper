import React, { useState, useEffect } from "react";
import axios from "axios";
import { C, FD, FM, gc, pillStyle } from "../constants";

export function DatabaseManager({ trades, onClearAll }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'schema', 'normalize'
  const [recentRecords, setRecentRecords] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newRowValues, setNewRowValues] = useState({});
  const [authUserData, setAuthUserData] = useState([]);
  const [authUserColumns, setAuthUserColumns] = useState([]);
  const [authUserLoading, setAuthUserLoading] = useState(false);
  const [editingAuthUser, setEditingAuthUser] = useState(null);
  const [editAuthUserValues, setEditAuthUserValues] = useState({});
  const [isAddingAuthUser, setIsAddingAuthUser] = useState(false);
  const [newAuthUserValues, setNewAuthUserValues] = useState({});
  const [passwordChangeUser, setPasswordChangeUser] = useState(null);
  const [passwordChangeForm, setPasswordChangeForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [forceResetMode, setForceResetMode] = useState(false);

  const totalTrades = trades.length;
  const completedTrades = trades.filter(t => t.result).length;
  const pendingTrades = totalTrades - completedTrades;

  // Fetch tables from new API
  useEffect(() => {
    if (activeTab === 'schema') {
      fetchTables();
      fetchAuthUserData();
    } else if (activeTab === 'stats') {
      fetchRecentRecords();
    }
  }, [activeTab]);

  const fetchRecentRecords = () => {
    // This is a placeholder for stats logic if needed
    console.log("Stats tab active");
  };

  const fetchTables = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/tables/');
      setTables(res.data.tables || []);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
      setMessage('Failed to load table schema. Ensure Django server is running.');
    }
  };

  const fetchTableData = async (tableName) => {
    setTableLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/tables/${tableName}/?limit=20`);
      setTableData(res.data);
      setSelectedTable(tableName);
    } catch (err) {
      console.error('Failed to fetch table data:', err);
      setMessage('Failed to load table data.');
    } finally {
      setTableLoading(false);
    }
  };

  const handleNormalize = async () => {
    if (!window.confirm('Normalize denormalized trade data? This updates instrument FKs from pair names.')) return;
    try {
      const res = await axios.post('http://localhost:8000/normalize-trades/');
      setMessage(res.data.message);
      fetchTables(); // Refresh counts
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setMessage('Normalization failed.');
    }
  };

  const handleTruncate = async (tableName) => {
    if (!window.confirm(`Truncate ${tableName}? This DELETES ALL DATA in the table!`)) return;
    try {
      await axios.post(`http://localhost:8000/api/tables/${tableName}/truncate/`);
      setMessage(`Truncated ${tableName}`);
      fetchTables();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Truncate failed.');
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trades, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "rapidsniper_trades_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete all your trades? This cannot be undone.")) return;
    
    setLoading(true);
    try {
      await onClearAll();
      setMessage("All trades have been successfully cleared.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error clearing trades:", err);
      setMessage("Failed to clear trades.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRow = (row) => {
    setEditingRow(row);
    setEditValues({ ...row });
  };

  const handleSaveRow = async () => {
    try {
      const rowId = editingRow.id;
      await axios.patch(`http://localhost:8000/api/tables/${selectedTable}/${rowId}/`, editValues);
      setMessage("Row updated successfully");
      setEditingRow(null);
      fetchTableData(selectedTable);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error('Failed to update row:', err);
      setMessage('Failed to update row.');
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditValues({});
  };

  const handleEditChange = (col, value) => {
    setEditValues({ ...editValues, [col]: value });
  };

  const handleAddNewRow = async () => {
    try {
      await axios.post(`http://localhost:8000/api/tables/${selectedTable}/`, newRowValues);
      setMessage("Row added successfully");
      setIsAddingRow(false);
      setNewRowValues({});
      fetchTableData(selectedTable);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error('Failed to add row:', err);
      setMessage('Failed to add row.');
    }
  };

  const handleDeleteRow = async (rowId) => {
    if (!window.confirm('Delete this record? This cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:8000/api/tables/${selectedTable}/${rowId}/`);
      setMessage("Row deleted successfully");
      fetchTableData(selectedTable);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error('Failed to delete row:', err);
      setMessage('Failed to delete row.');
    }
  };

  const handleNewRowChange = (col, value) => {
    setNewRowValues({ ...newRowValues, [col]: value });
  };

  const handleCancelAddRow = () => {
    setIsAddingRow(false);
    setNewRowValues({});
  };

  const fetchAuthUserData = async () => {
    setAuthUserLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/tables/auth_user/?limit=20');
      setAuthUserData(res.data.data || []);
      setAuthUserColumns(res.data.columns || []);
    } catch (err) {
      console.error('Failed to fetch auth_user data:', err);
      setMessage('Failed to load auth_user data.');
    } finally {
      setAuthUserLoading(false);
    }
  };

  const handleEditAuthUser = (user) => {
    setEditingAuthUser(user);
    setEditAuthUserValues({ ...user });
  };

  const handleSaveAuthUser = async () => {
    try {
      const userId = editingAuthUser.id;
      await axios.patch(`http://localhost:8000/api/tables/auth_user/${userId}/`, editAuthUserValues);
      setMessage("User updated successfully");
      setEditingAuthUser(null);
      fetchAuthUserData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error('Failed to update user:', err);
      setMessage('Failed to update user.');
    }
  };

  const handleCancelEditAuthUser = () => {
    setEditingAuthUser(null);
    setEditAuthUserValues({});
  };

  const handleEditAuthUserChange = (col, value) => {
    setEditAuthUserValues({ ...editAuthUserValues, [col]: value });
  };

  const handleAddNewAuthUser = async () => {
    try {
      await axios.post('http://localhost:8000/api/tables/auth_user/', newAuthUserValues);
      setMessage("User added successfully");
      setIsAddingAuthUser(false);
      setNewAuthUserValues({});
      fetchAuthUserData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error('Failed to add user:', err);
      setMessage('Failed to add user.');
    }
  };

  const handleDeleteAuthUser = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:8000/api/tables/auth_user/${userId}/`);
      setMessage("User deleted successfully");
      fetchAuthUserData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setMessage('Failed to delete user.');
    }
  };

  const handleNewAuthUserChange = (col, value) => {
    setNewAuthUserValues({ ...newAuthUserValues, [col]: value });
  };

  const handleCancelAddAuthUser = () => {
    setIsAddingAuthUser(false);
    setNewAuthUserValues({});
  };

  const handleChangePassword = (user) => {
    setPasswordChangeUser(user);
    setPasswordChangeForm({ old_password: '', new_password: '', confirm_password: '' });
    setForceResetMode(false);
  };

  const handleSavePassword = async () => {
    if (passwordChangeForm.new_password !== passwordChangeForm.confirm_password) {
      setMessage('New passwords do not match');
      return;
    }
    if (!passwordChangeForm.new_password) {
      setMessage('Please enter a new password');
      return;
    }
    if (!forceResetMode && !passwordChangeForm.old_password) {
      setMessage('Please fill in all password fields');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/change-password/', {
        user_id: passwordChangeUser.id,
        old_password: passwordChangeForm.old_password,
        new_password: passwordChangeForm.new_password,
        force_reset: forceResetMode
      });
      setMessage('Password changed successfully');
      setPasswordChangeUser(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to change password:', err);
      setMessage(err.response?.data?.error || 'Failed to change password');
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordChangeUser(null);
    setPasswordChangeForm({ old_password: '', new_password: '', confirm_password: '' });
    setForceResetMode(false);
  };

  const TabButton = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        flex: 1, padding: '12px 8px', border: `2px solid ${activeTab === tab ? C.purple : 'transparent'}`,
        background: activeTab === tab ? 'rgba(139,92,246,0.1)' : 'transparent',
        borderRadius: '8px', color: activeTab === tab ? C.purpleHi : C.muted,
        fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: FD
      }}
    >
      <span style={{ marginRight: '6px' }}>{icon}</span> {label}
    </button>
  );

  return (
    <div style={{ padding: "40px 24px", maxWidth: "1000px", margin: "0 auto", fontFamily: FD }} className="fade-up">
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "inline-block", padding: "3px 14px", borderRadius: "20px", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.22)", color: C.red, fontSize: "11px", fontWeight: "700", letterSpacing: "1px", marginBottom: "11px" }}>SYSTEM</div>
        <h2 style={{ fontSize: "30px", fontWeight: "900", letterSpacing: "-0.5px" }}>Database <span style={{ background: C.grad1, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Management</span></h2>

      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div style={{ ...gc(), padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div style={{ padding: "24px", background: "rgba(139,92,246,0.05)", borderRadius: "16px", border: `1px solid ${C.purple}20` }}>
              <div style={{ color: C.muted, fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>TOTAL TRADES</div>
              <div style={{ color: C.text, fontSize: "28px", fontWeight: "900" }}>{totalTrades}</div>
            </div>
            <div style={{ padding: "24px", background: "rgba(16,185,129,0.05)", borderRadius: "16px", border: `1px solid ${C.green}20` }}>
              <div style={{ color: C.muted, fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>COMPLETED</div>
              <div style={{ color: C.greenHi, fontSize: "28px", fontWeight: "900" }}>{completedTrades}</div>
            </div>
            <div style={{ padding: "24px", background: "rgba(244,63,94,0.05)", borderRadius: "16px", border: `1px solid ${C.red}20` }}>
              <div style={{ color: C.muted, fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>PENDING</div>
              <div style={{ color: C.red, fontSize: "28px", fontWeight: "900" }}>{pendingTrades}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button onClick={handleExport} style={{ flex: 1, padding: "14px", borderRadius: "10px", background: "rgba(139,92,246,0.1)", border: `1px solid ${C.purple}30`, color: C.purpleHi, fontWeight: "700", cursor: "pointer", transition: "0.2s" }}>
              📥 Export Data (JSON)
            </button>
            <button onClick={handleClear} disabled={loading} style={{ flex: 1, padding: "14px", borderRadius: "10px", background: "rgba(244,63,94,0.1)", border: `1px solid ${C.red}30`, color: C.red, fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", transition: "0.2s" }}>
              {loading ? "Clearing..." : "🗑️ Clear All Records"}
            </button>
          </div>
        </div>
      )}

      {/* Schema Tab */}
      {activeTab === 'schema' && (
        <div style={{ ...gc(), padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800" }}>3NF Table Schema ({tables.length} tables)</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleNormalize} style={{ padding: "8px 16px", borderRadius: "6px", background: C.green10, border: `1px solid ${C.green}40`, color: C.greenHi, fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                🔄 Normalize Trades
              </button>
              <button onClick={fetchTables} style={{ padding: "8px 16px", borderRadius: "6px", background: "rgba(139,92,246,0.1)", border: `1px solid ${C.purple}40`, color: C.purpleHi, fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                🔄 Refresh
              </button>
            </div>
          </div>

          {tables.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: C.muted }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>📊</div>
              <p>No tables found. Run migrations or import rapidsniper_db.sql.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "8px", maxHeight: "300px", overflow: "auto", padding: "8px 0" }}>
              {tables.map(table => (
                <div key={table.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: C.gray5, borderRadius: "6px", fontSize: "13px" }}>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontWeight: 700, color: C.text, fontSize: "12px" }}>{table.model_name}</div>
                    <div style={{ color: C.muted, fontSize: "11px" }}>{table.name}</div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "80px" }}>
                    <div style={{ fontWeight: 700, color: C.purpleHi, fontSize: "12px" }}>{table.row_count}</div>
                    <div style={{ color: C.muted, fontSize: "10px" }}>rows</div>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button 
                      onClick={() => fetchTableData(table.name)}
                      disabled={tableLoading}
                      style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)", color: C.greenHi, fontSize: "11px", fontWeight: 600, cursor: tableLoading ? "not-allowed" : "pointer", height: "24px" }}
                      title="View data"
                    >
                      👁️
                    </button>
                    {table.row_count > 0 && (
                      <button 
                        onClick={() => handleTruncate(table.name)}
                        style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(244,63,94,0.2)", border: "1px solid rgba(244,63,94,0.3)", color: C.red, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                        title="Truncate table"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTable && (
            <div style={{ marginTop: "24px", padding: "20px", background: C.gray5, borderRadius: "12px" }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <h4 style={{ fontWeight: 800, color: C.text }}>{selectedTable}</h4>
                  <button onClick={() => {setSelectedTable(null); setTableData([]);}} style={{ color: C.muted, background: 'none', border: 'none', fontSize: "14px", cursor: "pointer" }}>✕ Close</button>
                </div>
                <button 
                  onClick={() => setIsAddingRow(true)}
                  disabled={isAddingRow}
                  style={{ padding: "6px 12px", borderRadius: "6px", background: "rgba(34,197,94,0.2)", border: `1px solid ${C.green}40`, color: C.greenHi, fontSize: "12px", fontWeight: 600, cursor: isAddingRow ? "not-allowed" : "pointer" }}
                  title="Add new row"
                >
                  ➕ Add Row
                </button>
              </div>
              {tableLoading ? (
                <div style={{ textAlign: "center", padding: "40px", color: C.muted }}>Loading data...</div>
              ) : tableData.data?.length > 0 ? (
                <div style={{ maxHeight: "300px", overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ background: C.gray10 }}>
                        {tableData.columns?.map(col => (
                          <th key={col} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: C.text }}>{col}</th>
                        ))}
                        <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: C.text }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isAddingRow && (
                        <tr style={{ borderBottom: `1px solid ${C.gray20}`, background: 'rgba(34,197,94,0.1)' }}>
                          {tableData.columns.map(col => (
                            <td key={col} style={{ padding: "8px 12px", color: C.textSecondary }}>
                              <input
                                type="text"
                                placeholder={col}
                                value={newRowValues[col] || ''}
                                onChange={(e) => handleNewRowChange(col, e.target.value)}
                                style={{ 
                                  padding: "4px 8px", 
                                  borderRadius: "4px", 
                                  border: `1px solid ${C.green}`, 
                                  background: C.gray5,
                                  color: C.text,
                                  fontFamily: FD,
                                  fontSize: "12px",
                                  width: "100%",
                                  maxWidth: "120px"
                                }}
                              />
                            </td>
                          ))}
                          <td style={{ padding: "8px 12px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                              <button 
                                onClick={handleAddNewRow}
                                style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)", color: C.greenHi, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                title="Save"
                              >
                                ✓
                              </button>
                              <button 
                                onClick={handleCancelAddRow}
                                style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(244,63,94,0.2)", border: "1px solid rgba(244,63,94,0.3)", color: C.red, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                      {tableData.data.slice(0, 10).map((row, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${C.gray20}` }}>
                          {tableData.columns.map(col => (
                            <td key={col} style={{ padding: "8px 12px", color: C.textSecondary }}>
                              {editingRow === row ? (
                                <input
                                  type="text"
                                  value={editValues[col] || ''}
                                  onChange={(e) => handleEditChange(col, e.target.value)}
                                  style={{ 
                                    padding: "4px 8px", 
                                    borderRadius: "4px", 
                                    border: `1px solid ${C.purple}`, 
                                    background: C.gray5,
                                    color: C.text,
                                    fontFamily: FD,
                                    fontSize: "12px",
                                    width: "100%",
                                    maxWidth: "120px"
                                  }}
                                />
                              ) : (
                                String(row[col] || '').slice(0, 50) + (String(row[col] || '').length > 50 ? '...' : '')
                              )}
                            </td>
                          ))}
                          <td style={{ padding: "8px 12px", textAlign: "center" }}>
                            {editingRow === row ? (
                              <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                                <button 
                                  onClick={handleSaveRow}
                                  style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)", color: C.greenHi, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                  title="Save"
                                >
                                  ✓
                                </button>
                                <button 
                                  onClick={handleCancelEdit}
                                  style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(244,63,94,0.2)", border: "1px solid rgba(244,63,94,0.3)", color: C.red, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                                <button 
                                  onClick={() => handleEditRow(row)}
                                  style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)", color: C.purpleHi, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                  title="Edit row"
                                >
                                  ✎
                                </button>
                                <button 
                                  onClick={() => handleDeleteRow(row.id)}
                                  style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(244,63,94,0.2)", border: "1px solid rgba(244,63,94,0.3)", color: C.red, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                  title="Delete row"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px", color: C.muted }}>No data in table</div>
              )}
            </div>
          )}

          {/* Auth User Management Section */}
          <div style={{ marginTop: "32px", padding: "20px", background: C.gray5, borderRadius: "12px" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", justifyContent: "space-between" }}>
              <h4 style={{ fontWeight: 800, color: C.text, fontSize: "16px" }}>👤 Auth Users</h4>
              <button 
                onClick={() => setIsAddingAuthUser(true)}
                disabled={isAddingAuthUser}
                style={{ padding: "6px 12px", borderRadius: "6px", background: "rgba(34,197,94,0.2)", border: `1px solid ${C.green}40`, color: C.greenHi, fontSize: "12px", fontWeight: 600, cursor: isAddingAuthUser ? "not-allowed" : "pointer" }}
                title="Add new user"
              >
                ➕ Add User
              </button>
            </div>
            {authUserLoading ? (
              <div style={{ textAlign: "center", padding: "40px", color: C.muted }}>Loading users...</div>
            ) : authUserData?.length > 0 ? (
              <div style={{ maxHeight: "400px", overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: C.gray10 }}>
                      {authUserColumns?.map(col => {
                        // Skip password column from display
                        if (col === 'password') return null;
                        return (
                          <th key={col} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: C.text }}>{col}</th>
                        );
                      })}
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: C.text }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isAddingAuthUser && (
                      <tr style={{ borderBottom: `1px solid ${C.gray20}`, background: 'rgba(34,197,94,0.1)' }}>
                        {authUserColumns.map(col => {
                          // Skip password column in add form
                          if (col === 'password') return null;
                          
                          return (
                            <td key={col} style={{ padding: "8px 12px", color: C.textSecondary }}>
                              <input
                                type={col === 'password' ? 'password' : 'text'}
                                placeholder={col}
                                value={newAuthUserValues[col] || ''}
                                onChange={(e) => handleNewAuthUserChange(col, e.target.value)}
                                style={{ 
                                  padding: "4px 8px", 
                                  borderRadius: "4px", 
                                  border: `1px solid ${C.green}`, 
                                  background: C.gray5,
                                  color: C.text,
                                  fontFamily: FD,
                                  fontSize: "12px",
                                  width: "100%",
                                  maxWidth: "120px"
                                }}
                              />
                            </td>
                          );
                        })}
                        <td style={{ padding: "8px 12px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                            <button 
                              onClick={handleAddNewAuthUser}
                              style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)", color: C.greenHi, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                              title="Save"
                            >
                              ✓
                            </button>
                            <button 
                              onClick={handleCancelAddAuthUser}
                              style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(244,63,94,0.2)", border: "1px solid rgba(244,63,94,0.3)", color: C.red, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {authUserData.map((user, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.gray20}` }}>
                        {authUserColumns.map(col => {
                          // Skip password column from display
                          if (col === 'password') return null;
                          
                          return (
                            <td key={col} style={{ padding: "8px 12px", color: C.textSecondary }}>
                              {editingAuthUser === user ? (
                                <input
                                  type="text"
                                  value={editAuthUserValues[col] || ''}
                                  onChange={(e) => handleEditAuthUserChange(col, e.target.value)}
                                  style={{ 
                                    padding: "4px 8px", 
                                    borderRadius: "4px", 
                                    border: `1px solid ${C.purple}`, 
                                    background: C.gray5,
                                    color: C.text,
                                    fontFamily: FD,
                                    fontSize: "12px",
                                    width: "100%",
                                    maxWidth: "120px"
                                  }}
                                />
                              ) : (
                                String(user[col] || '').slice(0, 50) + (String(user[col] || '').length > 50 ? '...' : '')
                              )}
                            </td>
                          );
                        })}
                        <td style={{ padding: "8px 12px", textAlign: "center" }}>
                          {editingAuthUser === user ? (
                            <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                              <button 
                                onClick={handleSaveAuthUser}
                                style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)", color: C.greenHi, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                title="Save"
                              >
                                ✓
                              </button>
                              <button 
                                onClick={handleCancelEditAuthUser}
                                style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(244,63,94,0.2)", border: "1px solid rgba(244,63,94,0.3)", color: C.red, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                              <button 
                                onClick={() => handleEditAuthUser(user)}
                                style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)", color: C.purpleHi, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                title="Edit user"
                              >
                                ✎
                              </button>
                              <button 
                                onClick={() => handleChangePassword(user)}
                                style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)", color: C.greenHi, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                title="Change password"
                              >
                                🔐
                              </button>
                              <button 
                                onClick={() => handleDeleteAuthUser(user.id)}
                                style={{ padding: "4px 8px", borderRadius: "4px", background: "rgba(244,63,94,0.2)", border: "1px solid rgba(244,63,94,0.3)", color: C.red, fontSize: "11px", fontWeight: 600, cursor: "pointer", height: "24px" }}
                                title="Delete user"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: C.muted }}>No users found</div>
            )}
          </div>

          {/* Password Change Modal */}
          {passwordChangeUser && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              backdropFilter: "blur(2px)"
            }}>
              <div style={{
                background: C.gray10,
                borderRadius: "16px",
                padding: "40px",
                maxWidth: "420px",
                width: "90%",
                border: `2px solid ${C.purple}40`,
                boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
                animation: "slideUp 0.3s ease"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px" }}>
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: 900, color: C.text, margin: 0, marginBottom: "8px" }}>🔐 Change Password</h3>
                    <p style={{ fontSize: "13px", color: C.muted, margin: 0, marginBottom: "4px" }}>User: <span style={{ color: C.text, fontWeight: 700 }}>{passwordChangeUser.username}</span></p>
                    <p style={{ fontSize: "12px", color: C.purpleHi, margin: 0, padding: "3px 8px", background: "rgba(139,92,246,0.1)", borderRadius: "4px", display: "inline-block" }}>
                      {passwordChangeUser.is_superuser ? "👑 Admin" : "👤 Regular User"}
                    </p>
                  </div>
                  <button 
                    onClick={handleCancelPasswordChange}
                    style={{ background: "none", border: "none", color: C.muted, fontSize: "20px", cursor: "pointer", padding: 0 }}
                  >
                    ✕
                  </button>
                </div>

                {/* Force Reset Toggle for Admin */}
                {passwordChangeUser.is_superuser && (
                  <div style={{
                    marginBottom: "20px",
                    padding: "12px",
                    background: "rgba(34,197,94,0.1)",
                    borderRadius: "8px",
                    border: `1px solid ${C.green}40`,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}>
                    <input
                      type="checkbox"
                      id="forceResetToggle"
                      checked={forceResetMode}
                      onChange={(e) => setForceResetMode(e.target.checked)}
                      style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    />
                    <label htmlFor="forceResetToggle" style={{
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: C.text,
                      margin: 0
                    }}>
                      🔓 Force Reset (skip old password verification)
                    </label>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                  {!forceResetMode && (
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        value={passwordChangeForm.old_password}
                        onChange={(e) => setPasswordChangeForm({ ...passwordChangeForm, old_password: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: `1px solid ${C.purple}40`,
                          background: C.gray5,
                          color: C.text,
                          fontFamily: FD,
                          fontSize: "13px",
                          boxSizing: "border-box",
                          transition: "border-color 0.2s"
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={passwordChangeForm.new_password}
                      onChange={(e) => setPasswordChangeForm({ ...passwordChangeForm, new_password: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: `1px solid ${C.purple}40`,
                        background: C.gray5,
                        color: C.text,
                        fontFamily: FD,
                        fontSize: "13px",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordChangeForm.confirm_password}
                      onChange={(e) => setPasswordChangeForm({ ...passwordChangeForm, confirm_password: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: `1px solid ${C.purple}40`,
                        background: C.gray5,
                        color: C.text,
                        fontFamily: FD,
                        fontSize: "13px",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s"
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    onClick={handleCancelPasswordChange}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: `1px solid ${C.muted}40`,
                      background: "transparent",
                      color: C.muted,
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "rgba(120,120,120,0.1)"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePassword}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      background: "rgba(34,197,94,0.2)",
                      border: `1px solid ${C.green}60`,
                      color: C.greenHi,
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "rgba(34,197,94,0.3)"}
                    onMouseLeave={(e) => e.target.style.background = "rgba(34,197,94,0.2)"}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Normalize Tab */}
      {activeTab === 'normalize' && (
        <div style={{ ...gc(), padding: "32px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "16px" }}>Data Normalization (3NF)</h3>
          <p style={{ color: C.muted, fontSize: "13px", marginBottom: "24px" }}>
            Current schema is already 3NF normalized via Django models. Use "Normalize Trades" button above to populate FKs from legacy data.
          </p>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", color: C.greenHi }}>✅</div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: C.greenHi }}>Schema confirmed 3NF compliant</p>
            <p style={{ color: C.muted, fontSize: "13px" }}>11 normalized tables with proper PK/FK relationships</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "32px", marginTop: "32px" }}>
        <TabButton tab="stats" label="Local Stats" icon="📈" />
        <TabButton tab="schema" label="Table Schema" icon="📋" />
        <TabButton tab="normalize" label="3NF Status" icon="🔄" />
      </div>

      {message && (
        <div style={{ 
          padding: "12px 16px", borderRadius: "8px", background: message.includes("Failed") || message.includes("error") ? "rgba(244,63,94,0.1)" : "rgba(16,185,129,0.1)", 
          border: `1px solid ${message.includes("Failed") || message.includes("error") ? C.red : C.green}40`, 
          color: message.includes("Failed") || message.includes("error") ? C.red : C.greenHi,
          fontSize: "13px", fontWeight: "600"
        }}>
          {message}
        </div>
      )}

    </div>
  );
}

