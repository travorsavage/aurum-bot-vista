import { usePriceSimulator } from './hooks/usePriceSimulator';
import { useTradingEngine } from './hooks/useTradingEngine';
import { TradingChart } from './components/TradingChart';
import { 
  StatsGrid, 
  PositionTable, 
  ControlPanel, 
  HistoryTable 
} from './components/TradingComponents';
import { Toaster } from 'sonner';
import { 
  Cpu, 
  Activity, 
  History as HistoryIcon,
  ShieldCheck,
  TrendingUp,
  Globe
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent } from './components/ui/card';

function App() {
  const { history, currentPrice } = usePriceSimulator(2000);
  const trading = useTradingEngine(currentPrice, history);

  return (
    <div className="min-h-screen bg-[#09090b] text-foreground selection:bg-primary/20 font-sans">
      <Toaster position="top-right" closeButton richColors />
      
      {/* Premium Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/50 rounded-2xl flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 rotate-3">
                <Cpu className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-black rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">XAU<span className="text-primary">-QUANT</span></h1>
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-muted-foreground" />
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black">Global Gold Exchange Node</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Network Latency</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs font-mono font-bold">14ms</span>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-primary uppercase font-black tracking-widest">Live Equity</span>
              <span className="text-2xl font-black tracking-tighter font-mono">${trading.equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="space-y-10">
          {/* Top Intelligence Grid */}
          <StatsGrid 
            balance={trading.balance} 
            equity={trading.equity} 
            openPositionsCount={trading.positions.length} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Analysis Terminal */}
            <div className="lg:col-span-3 space-y-10">
              <TradingChart history={history} />
              
              <Tabs defaultValue="positions" className="w-full">
                <TabsList className="bg-muted/30 p-1 border border-white/5 rounded-xl h-12">
                  <TabsTrigger value="positions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-8 text-xs font-black uppercase tracking-widest">
                    <Activity className="h-4 w-4 mr-2" />
                    Live Terminal
                  </TabsTrigger>
                  <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-8 text-xs font-black uppercase tracking-widest">
                    <HistoryIcon className="h-4 w-4 mr-2" />
                    Trade Archive
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="positions" className="mt-6">
                  <PositionTable 
                    positions={trading.positions} 
                    currentPrice={currentPrice} 
                    onClose={trading.closePosition} 
                  />
                </TabsContent>
                <TabsContent value="history" className="mt-6">
                  <HistoryTable history={trading.tradeHistory} />
                </TabsContent>
              </Tabs>
            </div>

            {/* AI Control Center */}
            <div className="space-y-10">
              <ControlPanel 
                isRunning={trading.isBotRunning}
                onToggle={() => trading.setIsBotRunning(!trading.isBotRunning)}
                lotSize={trading.settings.lotSize}
                setLotSize={(val) => trading.setSettings(s => ({ ...s, lotSize: val }))}
                onManualBuy={() => trading.openPosition('BUY')}
                onManualSell={() => trading.openPosition('SELL')}
              />
              
              <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <ShieldCheck className="w-20 h-20" />
                </div>
                <CardContent className="pt-6 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/20 rounded-xl text-primary border border-primary/20">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-tighter">AI Risk Guard</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Certified 100% Reliable</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Our Quantum-Pro engine processes 1,000+ data points per second to ensure perfect signal execution on the XAU/USD pair.
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
                       <span>Server Health</span>
                       <span className="text-green-500">Optimal</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                       <div className="w-[98%] h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-10 bg-black/60 mt-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black tracking-tighter uppercase italic">XAU<span className="text-primary">-QUANT</span></h2>
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            <p className="text-[10px] text-muted-foreground font-bold uppercase">Institutional Grade Terminal</p>
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} SECURED CLOUD ENVIRONMENT. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
