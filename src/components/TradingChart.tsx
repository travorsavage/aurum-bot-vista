import { useEffect, useRef } from 'react';
import { 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  CandlestickData, 
  ColorType, 
  Time,
  CandlestickSeries
} from 'lightweight-charts';
import { OhlcTick } from '../hooks/usePriceSimulator';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface TradingChartProps {
  history: OhlcTick[];
}

export function TradingChart({ history }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: 'rgba(197, 203, 206, 0.1)' },
        horzLines: { color: 'rgba(197, 203, 206, 0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.2)',
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && history.length > 0) {
      const data: CandlestickData<Time>[] = history.map((h) => ({
        time: h.time as Time,
        open: h.open,
        high: h.high,
        low: h.low,
        close: h.close,
      }));
      seriesRef.current.setData(data);
    }
  }, [history]);

  const latest = history[history.length - 1];

  return (
    <Card className="col-span-1 lg:col-span-3 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
        <div className="flex flex-col">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            GOLD / USD (1m)
          </CardTitle>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">Real-time Advanced Engine</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
             <span className="text-[10px] text-muted-foreground font-bold">LATEST PRICE</span>
             <span className={`text-xl font-black ${latest?.close >= latest?.open ? 'text-green-500' : 'text-red-500'}`}>
               ${latest?.close.toFixed(2)}
             </span>
           </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={chartContainerRef} className="w-full h-[400px]" />
      </CardContent>
    </Card>
  );
}
