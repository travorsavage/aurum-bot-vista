import { useState, useEffect, useCallback, useRef } from 'react';

export interface OhlcTick {
  time: number; // Seconds (unix timestamp) for lightweight-charts
  open: number;
  high: number;
  low: number;
  close: number;
}

const INITIAL_PRICE = 2350.50;
const VOLATILITY = 0.5; 
const DRIFT = 0.02; // Slightly more bullish for "gold" feel

export function usePriceSimulator(intervalMs: number = 3000) {
  const [history, setHistory] = useState<OhlcTick[]>(() => {
    const now = Math.floor(Date.now() / 1000);
    let lastClose = INITIAL_PRICE;
    
    return Array.from({ length: 60 }, (_, i) => {
      const open = lastClose;
      const close = open + (Math.random() - 0.45) * VOLATILITY * 2;
      const high = Math.max(open, close) + Math.random() * 0.5;
      const low = Math.min(open, close) - Math.random() * 0.5;
      lastClose = close;
      
      return {
        time: now - (60 - i) * 60, // 1-minute intervals
        open,
        high,
        low,
        close: Number(close.toFixed(2)),
      };
    });
  });

  const currentCandle = useRef<OhlcTick>(history[history.length - 1]);

  const generateNextTick = useCallback((lastCandle: OhlcTick) => {
    const open = lastCandle.close;
    const change = (Math.random() - 0.48) * VOLATILITY + DRIFT;
    const close = Number((open + change).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * 0.3).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * 0.3).toFixed(2));
    
    return {
      time: lastCandle.time + 60, // Next minute
      open,
      high,
      low,
      close,
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        const next = generateNextTick(last);
        
        const newHistory = [...prev, next];
        if (newHistory.length > 300) {
          return newHistory.slice(newHistory.length - 300);
        }
        return newHistory;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [generateNextTick, intervalMs]);

  return {
    history,
    currentPrice: history[history.length - 1].close,
  };
}
