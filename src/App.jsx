import React, { useState, useEffect } from "react";


import axios from "axios";
import { C, FD, gc } from "./constants";
import { MeshBg } from "./components/MeshBg";
import { Nav } from "./components/Nav";
import { MiniStatsCard } from "./components/MiniStatsCard";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { RoadToRapidSniper } from "./pages/RoadToRapidSniper";
import { ChartMarkup } from "./pages/ChartMarkup";
import { EntryCriteria } from "./pages/EntryCriteria";
import { ClosingCriteria } from "./pages/ClosingCriteria";
import { Trades } from "./pages/Trades";
import { History } from "./pages/History";
import { DatabaseManager } from "./pages/DatabaseManager";
import { TradingPlatforms } from "./pages/TradingPlatforms";

const API_BASE = "http://localhost:8000/api/trades/";

export default function App() {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [page, setPage] = useState("home");
  const [trades, setTrades] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch balance from backend
  const fetchBalance = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`http://localhost:8000/api/balances/?user=${user.id}`);
      if (res.data.length > 0) {
        setBalance(res.data[0]);
      } else {
        // Create balance if not exists
        const createRes = await axios.post(`http://localhost:8000/api/balances/update_balance/`, {
          user: user.id,
          starting_balance: 0
        });
        setBalance(createRes.data);
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  // Fetch trades from backend
  const fetchTrades = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}?user=${user.id}`);
      setTrades(res.data);
    } catch (err) {
      console.error("Error fetching trades:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchTrades();
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleResult = async (id, result, notes, pnl) => {
    try {
      // Map frontend results to backend choices (WIN, LOSS, BE)
      let mappedResult = result;
      if (result === 'win') mappedResult = 'WIN';
      if (result === 'loss' || result === 'lose') mappedResult = 'LOSS';
      if (result === 'be') mappedResult = 'BE';

      const tradeToUpdate = trades.find(t => t.id === id);
      
      if (tradeToUpdate.result) {
        // If the trade ALREADY has a result, it's an EDIT operation on an existing history record
        await axios.patch(`${API_BASE}${id}/`, {
          result: mappedResult,
          pnl: pnl ?? 0,
          notes: notes
        });
      } else {
        // If it has NO result, it's a NEW trade being recorded from a template
        const newTradeRecord = {
          user: user.id,
          pair: tradeToUpdate.pair,
          category: tradeToUpdate.category,
          subcategory: tradeToUpdate.subcategory,
          result: mappedResult,
          pnl: pnl ?? 0,
          notes: notes,
          date: new Date().toISOString().split('T')[0]
        };
        await axios.post(API_BASE, newTradeRecord);
      }
      
      fetchTrades();
    } catch (err) {
      console.error('Error saving trade result:', err);
    }
  };

  const handleAddTrade = async (pair, category, subcategory) => {
    if (!user?.id) return;
    try {
      const newTrade = {
        user: user.id,
        pair,
        category,
        subcategory,
        result: null,
        notes: "",
        pnl: 0,
      };
      const res = await axios.post(API_BASE, newTrade);
      setTrades(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding trade:", err);
    }
  };

  const handleRemoveTrade = async (id) => {
    try {
      await axios.delete(`${API_BASE}${id}/`);
      setTrades(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Error removing trade:", err);
    }
  };

  const handleClearAll = async () => {
    if (!user?.id) return;
    try {
      await axios.delete(`${API_BASE}clear_all/?user=${user.id}`);
      setTrades([]);
    } catch (err) {
      console.error("Error clearing all trades:", err);
      throw err;
    }
  };

  const appStyle = {
    minHeight: "100vh",
    background: C.bg,
    fontFamily: FD,
    color: C.text,
    position: "relative",
    overflowX: "hidden",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch", // Smooth scroll on iOS
  };


  if (!user) return (
    <div style={appStyle}>
      <MeshBg />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Login onLogin={setUser} />
      </div>
    </div>
  );

  const sessionTrades = balance 
    ? trades.filter(t => {
        const tDate = new Date(t.created_at || t.date).getTime();
        const rDate = new Date(balance.last_reset_at).getTime();
        return tDate >= rDate;
      }) 
    : trades;

  const pageMap = {
    home: <Home setPage={setPage} trades={sessionTrades} balance={balance} />,
    road: <RoadToRapidSniper setPage={setPage} />,
    analysis: <ChartMarkup setPage={setPage} />,
    entry: <EntryCriteria setPage={setPage} />,
    exit: <ClosingCriteria />,
    trades: <Trades trades={trades} sessionTrades={sessionTrades} balance={balance} onResult={handleResult} onAdd={handleAddTrade} onRemove={handleRemoveTrade} user={user} onBalanceUpdate={fetchBalance} />,
    history: <History trades={trades} balance={balance} onResult={handleResult} />,
    manage_db: <DatabaseManager trades={trades} onClearAll={handleClearAll} />,
    trading: <TradingPlatforms />,
  };

  return (
    <div style={appStyle}>
      <MeshBg />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav page={page} setPage={setPage} onLogout={() => { setUser(null); setPage("home"); }} user={user.username} />
        <div
          style={{
            minHeight: "calc(100vh - 58px)",
            paddingRight: "0",
            paddingLeft: isMobile ? "0" : "0",
            paddingTop: isMobile ? "0" : "0",
            overflowX: "hidden",
          }}
        >

          {pageMap[page]}
        </div>

      </div>
    </div>
  );
}