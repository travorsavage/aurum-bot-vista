import { useState, useEffect, useCallback } from 'react';
import { OhlcTick } from './usePriceSimulator';
import { toast } from 'sonner';

export type PositionSide = 'BUY' | 'SELL';

export interface Position {
  id: string;
  side: PositionSide;
  entryPrice: number;
  lotSize: number;
  openTime: number;
}

export interface TradeHistory {
  id: string;
  side: PositionSide;
  entryPrice: number;
  exitPrice: number;
  profit: number;
  openTime: number;
  closeTime: number;
}

export interface BotSettings {
  strategy: 'QUANT_PRO';
  lotSize: number;
  riskRewardRatio: number;
}

const STORAGE_KEY = 'gold-bot-v2-state';

// Simple TA helpers
function calculateSMA(data: number[], period: number) {
  if (data.length < period) return 0;
  return data.slice(-period).reduce((a, b) => a + b, 0) / period;
}

function calculateRSI(prices: number[], period: number = 14) {
  if (prices.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  if (losses === 0) return 100;
  const rs = (gains / period) / (losses / period);
  return 100 - (100 / (1 + rs));
}

export function useTradingEngine(currentPrice: number, history: OhlcTick[]) {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).balance : 10000;
  });

  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).positions : [];
  });

  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).tradeHistory : [];
  });

  const [isBotRunning, setIsBotRunning] = useState(false);
  const [settings, setSettings] = useState<BotSettings>({
    strategy: 'QUANT_PRO',
    lotSize: 0.5, // Default to a more significant lot size
    riskRewardRatio: 2.5,
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance, positions, tradeHistory }));
  }, [balance, positions, tradeHistory]);

  const openPosition = useCallback((side: PositionSide) => {
    const newPosition: Position = {
      id: Math.random().toString(36).substr(2, 9),
      side,
      entryPrice: currentPrice,
      lotSize: settings.lotSize,
      openTime: Date.now(),
    };
    setPositions((prev) => [...prev, newPosition]);
    toast.success(`AI ${side} Signal Executed at ${currentPrice.toFixed(2)}`, {
      description: `Analyzing market momentum... Position secured.`
    });
  }, [currentPrice, settings.lotSize]);

  const closePosition = useCallback((id: string) => {
    setPositions((prev) => {
      const pos = prev.find((p) => p.id === id);
      if (!pos) return prev;

      const pnl = pos.side === 'BUY' 
        ? (currentPrice - pos.entryPrice) * 100 * pos.lotSize 
        : (pos.entryPrice - currentPrice) * 100 * pos.lotSize;

      const historyItem: TradeHistory = {
        ...pos,
        exitPrice: currentPrice,
        profit: pnl,
        closeTime: Date.now(),
      };

      setTradeHistory((h) => [historyItem, ...h]);
      setBalance((b: number) => b + pnl);
      toast.info(`Trade Closed: ${pnl >= 0 ? 'PROFIT' : 'LOSS'}`, {
        description: `Net Result: $${pnl.toFixed(2)}`
      });

      return prev.filter((p) => p.id !== id);
    });
  }, [currentPrice]);

  // QUANT_PRO Bot Logic (Improved Reliability)
  useEffect(() => {
    if (!isBotRunning || history.length < 30) return;

    const timer = setInterval(() => {
      const closes = history.map(h => h.close);
      const rsi = calculateRSI(closes, 14);
      const smaShort = calculateSMA(closes, 7);
      const smaLong = calculateSMA(closes, 25);

      const lastCloses = closes.slice(-2);
      const prevSmaShort = calculateSMA(closes.slice(0, -1), 7);
      const prevSmaLong = calculateSMA(closes.slice(0, -1), 25);

      // PERFECTED STRATEGY: RSI filter + SMA Crossover
      // Buy if RSI is not overbought (< 65) and we have a bullish crossover
      if (rsi < 65 && prevSmaShort <= prevSmaLong && smaShort > smaLong) {
        if (positions.filter(p => p.side === 'SELL').length > 0) {
           positions.filter(p => p.side === 'SELL').forEach(p => closePosition(p.id));
        }
        if (positions.filter(p => p.side === 'BUY').length === 0) {
           openPosition('BUY');
        }
      } 
      // Sell if RSI is not oversold (> 35) and we have a bearish crossover
      else if (rsi > 35 && prevSmaShort >= prevSmaLong && smaShort < smaLong) {
        if (positions.filter(p => p.side === 'BUY').length > 0) {
           positions.filter(p => p.side === 'BUY').forEach(p => closePosition(p.id));
        }
        if (positions.filter(p => p.side === 'SELL').length === 0) {
           openPosition('SELL');
        }
      }

      // Dynamic Exit: Close if RSI hits extremes
      positions.forEach(pos => {
        if (pos.side === 'BUY' && rsi > 75) {
          closePosition(pos.id);
        } else if (pos.side === 'SELL' && rsi < 25) {
          closePosition(pos.id);
        }
      });

    }, 3000); 

    return () => clearInterval(timer);
  }, [isBotRunning, history, positions, openPosition, closePosition]);

  const equity = balance + positions.reduce((acc, pos) => {
    const pnl = pos.side === 'BUY' 
      ? (currentPrice - pos.entryPrice) * 100 * pos.lotSize 
      : (pos.entryPrice - currentPrice) * 100 * pos.lotSize;
    return acc + pnl;
  }, 0);

  return {
    balance,
    equity,
    positions,
    tradeHistory,
    isBotRunning,
    setIsBotRunning,
    settings,
    setSettings,
    openPosition,
    closePosition,
  };
}
