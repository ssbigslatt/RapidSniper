export const USER_DB = []; // Empty for security. Use backend for authentication.

export const CURRENCY_PAIRS = [
  "BCHUSD", "BTCETH", "BTCUSD", "EURGBP", "EURUSD", "EURCAD", "EURAUD",
  "AUDUSD", "GBPUSD", "GBPAUD", "USDCAD", "GBPJPY", "USDCHF", "USDJPY",
  "EURCHF", "EURJPY",
];

export const DERIV_INDEX_PAIRS = [
  "Volatility 5 Index", "Volatility 5 (1s) Index", "Volatility 10 (1s) Index",
  "Volatility 15 (1s) Index", "Volatility 25 (1s) Index", "Volatility 25 Index",
  "Volatility 30 Index", "Volatility 30 (1s) Index", "Volatility 50 (1s) Index",
  "Volatility 50 Index", "Volatility 75 Index", "Volatility 75 (1s) Index",
  "Volatility 90 (1s) Index", "Volatility 100 (1s) Index", "Volatility 100 Index",
  "Volatility 250 (1s) Index", "Crash 50 Index", "Crash 150 Index",
  "Crash 300 Index", "Boom 500 Index", "Boom 600 Index", "Step Index",
];

export const WELTRADE_INDEX_PAIRS = [
  "FiboX",
  "FX Vol 20", "FX Vol 40", "FX Vol 60", "FX Vol 80", "FX Vol 99",
  "FlipX 1", "FlipX 2", "FlipX 3", "FlipX 4", "FlipX 5",
  "GainX 400", "GainX 600", "GainX 800", "GainX 999", "GainX 1200",
  "PainX 400", "PainX 600", "PainX 800", "PainX 999", "PainX 1200",
];

let _tid = 1;
export const INIT_TRADES = [
  ...CURRENCY_PAIRS.map(pair => ({
    id: _tid++, pair, category: "currency", subcategory: null, result: null, notes: "", pnl: 0,
    date: new Date(Date.now() - _tid * 86400000 * (Math.floor(Math.random() * 3) + 1)).toISOString(),
  })),
  ...DERIV_INDEX_PAIRS.map(pair => ({
    id: _tid++, pair, category: "index", subcategory: "deriv", result: null, notes: "", pnl: 0,
    date: new Date(Date.now() - _tid * 86400000 * (Math.floor(Math.random() * 3) + 1)).toISOString(),
  })),
  ...WELTRADE_INDEX_PAIRS.map(pair => ({
    id: _tid++, pair, category: "index", subcategory: "weltrade", result: null, notes: "", pnl: 0,
    date: new Date(Date.now() - _tid * 86400000 * (Math.floor(Math.random() * 3) + 1)).toISOString(),
  })),
];

export const DEFAULT_CHART_RULES = [
  "Find zones with a high probability CHOCH On",
  "Mark the swing low or high which may change the character — On 15 and sometimes 5min",
  "Choose a fresh zone which broke the structure",
  "Avoid extreme zone which failed to break the structure",
  "Refine the zone in 15 min if the candle is big — if similar, choose 30min zone and vice versa",
];

export const DEFAULT_ENTRY_RULES = [
  "Imbalance fill",
  "Wait for a zone to be retested most of the times",
  "15min confirmation",
  "Wait for the candle to close",
  "Never enter 2 positions on a zone to avoid double losses",
  "Enter on 1min Timeframe with a 15min confirmation",
  "Use Trendline for confirmation and exits if broken",
  "Check if the zone aligns with a trendline for further confirmation",
  "Don't enter when price leaves POI",
  "Stick with 1:3 reward ratio",
  "Find a zone to add a 2nd position",
];

export const DEFAULT_EXIT_RULES = [
  "Preferably exit on the next demand zone or supply zone",
  "Exit when the trendline is broken",
  "Exit when structure is broken even a little",
  "Put trailing stoploss on top of the last high or low",
];
