import React from 'react';
import { 
  Building2, 
  Compass, 
  Cpu, 
  Presentation, 
  RotateCcw, 
  Sparkles,
  Radio
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'COMMAND_CENTER' | 'ATTENDEE_APP' | 'SIMULATION_LAB' | 'PITCH_DECK';
  onTabChange: (tab: 'COMMAND_CENTER' | 'ATTENDEE_APP' | 'SIMULATION_LAB' | 'PITCH_DECK') => void;
  totalVisitors: number;
  cityPressureScore: number;
  onResetData: () => void;
  executedActionsCount: number;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  totalVisitors,
  cityPressureScore,
  onResetData,
  executedActionsCount,
  hasGeminiKey,
}) => {
  const isHighRisk = cityPressureScore > 75;

  return (
    <header className="bg-[#0e0e11]/90 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Live status */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">EventFlow AI</span>
                <span className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                  Mega-Event Core
                </span>
                <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono-code">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>LIVE</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Mega-Event Hospitality Orchestration &bull; Intelligent Capacity Management
              </p>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <nav className="flex items-center p-1 bg-[#141417] rounded-xl border border-white/5 shadow-inner">
            <button
              id="tab-command-center"
              onClick={() => onTabChange('COMMAND_CENTER')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'COMMAND_CENTER'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Command Center</span>
              {executedActionsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-400/20 text-emerald-300 text-[10px] rounded-full">
                  {executedActionsCount} act
                </span>
              )}
            </button>

            <button
              id="tab-attendee-app"
              onClick={() => onTabChange('ATTENDEE_APP')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'ATTENDEE_APP'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Attendee Assistant</span>
            </button>

            <button
              id="tab-simulation-lab"
              onClick={() => onTabChange('SIMULATION_LAB')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'SIMULATION_LAB'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>What-If Lab</span>
            </button>

            <button
              id="tab-pitch-deck"
              onClick={() => onTabChange('PITCH_DECK')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'PITCH_DECK'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>PPT Deck (20 Slides)</span>
            </button>
          </nav>

          {/* Right Metrics & Reset */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-[11px] text-zinc-400 font-mono-code uppercase tracking-wider">
                Total City Influx
              </div>
              <div className="text-sm font-bold text-white font-mono-code">
                {totalVisitors.toLocaleString()} <span className="text-xs text-zinc-400 font-normal">visitors</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-zinc-400 font-mono-code uppercase tracking-wider">
                Pressure Score
              </div>
              <div className="flex items-center justify-end space-x-1">
                <span className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                <span className={`text-sm font-bold font-mono-code ${isHighRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {cityPressureScore}/100
                </span>
              </div>
            </div>

            <button
              id="btn-reset-telemetry"
              onClick={onResetData}
              title="Reset to default scenario telemetry"
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors border border-white/5"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
