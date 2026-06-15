import { Position, TradeHistory } from '../hooks/useTradingEngine';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Play, 
  Pause, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Clock,
  Settings as SettingsIcon,
  X,
  Target,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';

export function StatsGrid({ 
  balance, 
  equity, 
  openPositionsCount 
}: { 
  balance: number; 
  equity: number; 
  openPositionsCount: number;
}) {
  const pnl = equity - balance;
  const pnlPercent = (pnl / balance) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-[10px] text-muted-foreground font-mono mt-1">AVAILABLE CAPITAL</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-blue-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Equity</CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black">${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className={`text-xs flex items-center gap-1 mt-1 font-bold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {pnl >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-orange-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Exposure</CardTitle>
          <Target className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black">{openPositionsCount}</div>
          <p className="text-[10px] text-muted-foreground font-mono mt-1">ACTIVE SIGNALS</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-green-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Engine</CardTitle>
          <Zap className="h-4 w-4 text-green-500 fill-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black text-green-500">100%</div>
          <p className="text-[10px] text-muted-foreground font-mono mt-1">RELIABILITY INDEX</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function PositionTable({ 
  positions, 
  currentPrice, 
  onClose 
}: { 
  positions: Position[]; 
  currentPrice: number; 
  onClose: (id: string) => void;
}) {
  return (
    <Card className="shadow-lg border-t-0">
      <CardContent className="p-0">
        {positions.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Activity className="text-muted-foreground h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">No Active Signals</p>
              <p className="text-xs text-muted-foreground">The bot is waiting for high-probability setups.</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold text-[10px] uppercase">Asset / Side</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-center">Entry</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-center">Size</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-center">Profit/Loss</TableHead>
                <TableHead className="text-right font-bold text-[10px] uppercase">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos) => {
                const profit = pos.side === 'BUY' 
                  ? (currentPrice - pos.entryPrice) * 100 * pos.lotSize 
                  : (pos.entryPrice - currentPrice) * 100 * pos.lotSize;
                
                return (
                  <TableRow key={pos.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-black">XAU/USD</span>
                        <Badge variant={pos.side === 'BUY' ? 'default' : 'destructive'} className="w-fit text-[9px] h-4 mt-1 px-1">
                          {pos.side}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">${pos.entryPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-center font-mono text-xs">{pos.lotSize.toFixed(2)}</TableCell>
                    <TableCell className={`text-center font-black ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${profit.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold" onClick={() => onClose(pos.id)}>
                        EXIT
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export function ControlPanel({ 
  isRunning, 
  onToggle, 
  lotSize, 
  setLotSize,
  onManualBuy,
  onManualSell
}: { 
  isRunning: boolean; 
  onToggle: () => void;
  lotSize: number;
  setLotSize: (val: number) => void;
  onManualBuy: () => void;
  onManualSell: () => void;
}) {
  return (
    <Card className="shadow-lg border-primary/20 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tighter">
          <div className={`p-1 rounded ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}>
             <SettingsIcon className="h-4 w-4 text-white" />
          </div>
          Quantum Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Execution Size</Label>
            <span className="text-[10px] font-mono font-bold">{lotSize} LOTS</span>
          </div>
          <Input 
            type="number" 
            step="0.1" 
            min="0.1"
            value={lotSize} 
            onChange={(e) => setLotSize(parseFloat(e.target.value))} 
            disabled={isRunning}
            className="font-mono"
          />
        </div>
        
        <div className="space-y-3 pt-2">
           <Button 
            className={`w-full h-12 text-sm font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
              isRunning ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
            }`}
            onClick={onToggle}
          >
            {isRunning ? (
              <><Pause className="mr-2 h-5 w-5 fill-current" /> Deactivate Bot</>
            ) : (
              <><Play className="mr-2 h-5 w-5 fill-current" /> Activate Quant-Pro</>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-10 text-xs font-bold text-green-500 border-green-500/50 hover:bg-green-500/10 uppercase" onClick={onManualBuy}>
              Direct Buy
            </Button>
            <Button variant="outline" className="h-10 text-xs font-bold text-red-500 border-red-500/50 hover:bg-red-500/10 uppercase" onClick={onManualSell}>
              Direct Sell
            </Button>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">v2.0-PRO</Badge>
            <span className="text-[10px] font-bold uppercase">Strategy Matrix</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Utilizing high-fidelity <span className="font-bold text-foreground">RSI Momentum</span> + <span className="font-bold text-foreground">SMA Crossover</span> with 100% execution reliability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function HistoryTable({ history }: { history: TradeHistory[] }) {
  return (
    <Card className="shadow-lg border-t-0">
      <CardContent className="p-0">
        {history.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-2">
             <HistoryIcon className="text-muted-foreground h-6 w-6 opacity-20" />
             <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Archive Empty</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold text-[10px] uppercase">Execution</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-center">Price Delta</TableHead>
                <TableHead className="text-right font-bold text-[10px] uppercase">Net Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((trade) => (
                <TableRow key={trade.id} className="hover:bg-muted/10">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-muted-foreground">{format(trade.closeTime, 'HH:mm:ss')}</span>
                      <span className={`text-[10px] font-black ${trade.side === 'BUY' ? 'text-blue-500' : 'text-orange-500'}`}>
                        {trade.side}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                       <span className="text-[10px] font-mono">${trade.entryPrice.toFixed(1)}</span>
                       <span className="text-[10px] opacity-30">→</span>
                       <span className="text-[10px] font-mono font-bold">${trade.exitPrice.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-black ${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${trade.profit.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

import { Activity, History as HistoryIcon } from 'lucide-react';
