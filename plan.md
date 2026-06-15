# Gold Trading Bot Simulator Plan

Build a comprehensive gold trading bot simulator that allows users to test strategies, monitor real-time (simulated) gold price movements, and view performance metrics. Since this is a frontend-only environment, the "bot" will be a client-side simulation.

## Scope Summary
- **Real-time Chart**: Visual representation of Gold (XAU/USD) price movements using a charting library (Recharts or similar).
- **Trading Bot Engine**: A configurable client-side logic that executes trades based on basic strategies (e.g., Simple Moving Average Crossover, RSI).
- **Dashboard**: Overview of current balance, equity, open positions, and trade history.
- **Controls**: Ability to start/stop the bot, adjust risk parameters, and manually enter/exit trades.
- **Persistence**: User settings and trade history saved to `localStorage`.

## Non-Goals
- Real money trading (no brokerage API integration).
- Real-world backend data fetching (will use a realistic price generator/simulator).
- Multi-user accounts (single-user client-side only).

## Assumptions & Open Questions
- **Assumption**: The user wants to *see* how a bot trades gold, so a simulated environment with high-frequency updates is preferred.
- **Question**: Should we use a real-world API like Alpha Vantage or Finnhub for historical data? *Decision: For better control and offline reliability in this sandbox, we will implement a realistic Brownian motion price generator.*

## Affected Areas
- **Frontend**: All UI components (Charts, Tables, Control Panels).
- **State Management**: React `useState`/`useReducer` or a custom hook for the trading engine state.
- **Data Layer**: Mock price generator and `localStorage` for history.

## Phases

### 1. Core Engine & Data Simulation
- Create a `usePriceSimulator` hook to generate XAU/USD price ticks.
- Implement the `useTradingBot` hook to handle trade execution logic, balance tracking, and position management.
- **Owner**: `frontend_engineer`

### 2. UI Components & Layout
- Design a professional "Trading Terminal" layout.
- Integrate `recharts` for the price chart.
- Create components for:
  - Account Summary (Balance, PnL, Equity).
  - Position Table (Open trades).
  - History Table (Closed trades).
  - Bot Control Panel (Strategy selection, Lot size, Start/Stop).
- **Owner**: `frontend_engineer`

### 3. Strategy Logic & Polishing
- Implement at least two strategies (SMA Crossover and RSI).
- Add "Sonner" notifications for trade entries/exits.
- Ensure responsiveness and dark mode support.
- **Owner**: `frontend_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build the core trading engine, simulator, and the main dashboard UI.

**Per-agent instructions:**
### 1. frontend_engineer
- **Phases:** 1, 2, and 3
- **Scope:** Complete implementation of the Gold Trading Bot Simulator.
- **Key Deliverables:**
  - `src/hooks/usePriceSimulator.ts`: Logic for generating realistic gold price movements.
  - `src/hooks/useTradingEngine.ts`: The central logic for managing balance, positions, and bot execution.
  - `src/components/TradingChart.tsx`: Using Recharts to visualize the price action.
  - `src/App.tsx`: Main dashboard layout integrating all components.
- **Dependencies:** none
- **Acceptance criteria:**
  - User can start/stop the bot.
  - Bot automatically opens/closes trades based on a strategy.
  - Price chart updates in real-time (simulated).
  - Balance and PnL update correctly as prices change.
  - Data persists on page refresh via `localStorage`.

**Do not dispatch:**
- `supabase_engineer` (No database required).
- `quick_fix_engineer` (Initial build is a full feature).
