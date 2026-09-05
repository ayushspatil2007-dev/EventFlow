import React, { useState } from 'react';
import { 
  ZoneData, 
  RecommendationAction, 
  SystemAlert, 
  CityMetricKPIs 
} from '../types';
import { 
  Users, 
  Hotel, 
  Train, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  AlertOctagon, 
  ArrowRight, 
  Activity,
  Zap,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrganizerCommandCenterProps {
  zones: ZoneData[];
  kpis: CityMetricKPIs;
  recommendations: RecommendationAction[];
  alerts: SystemAlert[];
  onExecuteAction: (actionId: string) => void;
  onSelectZone: (zone: ZoneData) => void;
  selectedZone: ZoneData | null;
  onRefreshGeminiAnalysis: () => Promise<void>;
  geminiAnalysis: {
    summary?: string;
    attendeeBroadcast?: string;
    source?: string;
  } | null;
  isAnalyzing: boolean;
}

export const OrganizerCommandCenter: React.FC<OrganizerCommandCenterProps> = ({
  zones,
  kpis,
  recommendations,
  alerts,
  onExecuteAction,
  onSelectZone,
  selectedZone,
  onRefreshGeminiAnalysis,
  geminiAnalysis,
  isAnalyzing,
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'HOTEL' | 'TRANSPORT' | 'CROWD'>('ALL');

  const filteredRecommendations = recommendations.filter(
    r => filterCategory === 'ALL' || r.category === filterCategory
  );

  const handleExecute = (action: RecommendationAction) => {
    onExecuteAction(action.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#10b981', '#f59e0b'],
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* KPI 1: Total Visitors */}
        <div className="bg-[#121215] border border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Visitors</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-white font-mono-code tracking-tight">
              {kpis.totalVisitors.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
              <span>+14% vs normal capacity</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 border-t border-white/5 pt-1.5">
            City Ingress Peak: 5:45 PM
          </div>
        </div>

        {/* KPI 2: Hotel Occupancy */}
        <div className="bg-[#121215] border border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Hotel Occupancy</span>
            <Hotel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-amber-400 font-mono-code tracking-tight">
              {kpis.hotelOccupancyPercent}%
            </div>
            <div className="text-[11px] text-zinc-400">
              Zone A at 92% (Critical)
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 border-t border-white/5 pt-1.5">
            Zone C Vacancy: 65% available
          </div>
        </div>

        {/* KPI 3: Transport Utilization */}
        <div className="bg-[#121215] border border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Transport Utilization</span>
            <Train className="w-4 h-4 text-orange-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-orange-400 font-mono-code tracking-tight">
              {kpis.transportUtilizationPercent}%
            </div>
            <div className="text-[11px] text-zinc-400">
              Metro 1: 88% | Metro 2: 42%
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 border-t border-white/5 pt-1.5">
            Headway: 3.5 min intervals
          </div>
        </div>

        {/* KPI 4: Venue Occupancy */}
        <div className="bg-[#121215] border border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Venue Occupancy</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-rose-400 font-mono-code tracking-tight">
              {kpis.venueOccupancyPercent}%
            </div>
            <div className="text-[11px] text-rose-400">
              Stadium gates bottlenecked
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 border-t border-white/5 pt-1.5">
            Avg Turnstile wait: 28 mins
          </div>
        </div>

        {/* KPI 5: Event Pressure Score (from Slide 8) */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-b from-[#16161a] to-[#111114] border border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Event Pressure Score</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className={`text-2xl font-black font-mono-code tracking-tight ${
              kpis.cityPressureScore > 75 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {kpis.cityPressureScore}/100
            </div>
            <div className="text-[10px] text-zinc-400 leading-tight">
              Crowd + Transport + Hotel + Venue Load
            </div>
          </div>
          <div className="text-[10px] font-mono-code text-indigo-400 border-t border-white/5 pt-1.5 flex items-center justify-between">
            <span>AI Status:</span>
            <span className="font-bold">{kpis.cityPressureScore > 75 ? 'ACTION REQUIRED' : 'STABILIZED'}</span>
          </div>
        </div>
      </div>

      {/* AI Real-Time Synthesis Broadcast Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-violet-950/30 to-[#121215] border border-indigo-500/20 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              AI Command Brain &bull; Real-Time Strategic Synthesis
            </span>
            {geminiAnalysis?.source === 'gemini' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono-code border border-indigo-500/30">
                Gemini 3.8 Flash Online
              </span>
            )}
          </div>
          <p className="text-sm text-slate-200">
            {geminiAnalysis?.summary || 
              "Zone A may reach critical capacity within 30 minutes. Recommended Action: Redirect visitors toward Zone B/C and promote available accommodation and transport there."}
          </p>
          {geminiAnalysis?.attendeeBroadcast && (
            <div className="text-xs text-indigo-300 font-mono-code pt-1 flex items-center space-x-1.5">
              <span className="px-1.5 py-0.5 bg-indigo-500/20 rounded text-[10px] font-bold">ATTENDEE PUSH:</span>
              <span>{geminiAnalysis.attendeeBroadcast}</span>
            </div>
          )}
        </div>

        <button
          id="btn-refresh-ai-analysis"
          onClick={onRefreshGeminiAnalysis}
          disabled={isAnalyzing}
          className="self-start md:self-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 whitespace-nowrap"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isAnalyzing ? 'Analyzing City Influx...' : 'Re-compute AI Mitigation'}</span>
        </button>
      </div>

      {/* Main Content Grid: Zone Capacity Matrix (Left) & AI Recommendation Engine + Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Intelligent Capacity Management Zone Breakdown Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#121215] rounded-2xl border border-white/5 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Intelligent Capacity Management (Slide 8)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Real-time multi-domain capacity score across city zones
                </p>
              </div>
              <span className="text-xs font-mono-code text-zinc-400">
                Formula: Crowd + Transport + Hotel + Venue + Demand
              </span>
            </div>

            {/* Zone Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-400 uppercase font-mono-code text-[10px]">
                    <th className="py-2.5 px-3">Zone</th>
                    <th className="py-2.5 px-2">Hotel</th>
                    <th className="py-2.5 px-2">Transport</th>
                    <th className="py-2.5 px-2">Crowd</th>
                    <th className="py-2.5 px-2">Pressure</th>
                    <th className="py-2.5 px-2">Risk Level</th>
                    <th className="py-2.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono-code">
                  {zones.map((zone) => {
                    const isSelected = selectedZone?.id === zone.id;
                    const pressure = Math.round(
                      zone.crowdDensity * 0.3 + 
                      zone.transportUtilization * 0.25 + 
                      zone.hotelOccupancy * 0.25 + 
                      zone.venueUtilization * 0.2
                    );

                    return (
                      <tr 
                        key={zone.id}
                        onClick={() => onSelectZone(zone)}
                        className={`hover:bg-white/[0.04] cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-950/25' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-sans font-semibold text-white">
                          <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${
                              zone.riskLevel === 'CRITICAL' ? 'bg-rose-500 animate-pulse' :
                              zone.riskLevel === 'HIGH' ? 'bg-amber-500' :
                              zone.riskLevel === 'MODERATE' ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`} />
                            <span>{zone.name.split('—')[0]}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={zone.hotelOccupancy >= 85 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {zone.hotelOccupancy}%
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={zone.transportUtilization >= 85 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {zone.transportUtilization}%
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={zone.crowdDensity >= 85 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {zone.crowdDensity}%
                          </span>
                        </td>
                        <td className="py-3 px-2 font-bold text-white">
                          {pressure}%
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            zone.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            zone.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            zone.riskLevel === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {zone.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            id={`btn-inspect-${zone.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectZone(zone);
                            }}
                            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Live Alerts Feed (from Slide 12) */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-300 flex items-center space-x-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                <span>Live Priority Alerts</span>
              </span>
              <span className="text-[11px] text-zinc-500">
                {alerts.length} active system triggers
              </span>
            </div>

            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                    alert.severity === 'CRITICAL' 
                      ? 'bg-rose-950/20 border-rose-800/30 text-slate-200' 
                      : 'bg-amber-950/20 border-amber-800/30 text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      <span className="font-bold text-white">{alert.title}</span>
                      <span className="text-[10px] text-zinc-400 font-mono-code">({alert.timestamp})</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {alert.message}
                    </p>
                    <div className="text-[10px] font-mono-code text-zinc-500">
                      Trigger: {alert.metricTriggered}
                    </div>
                  </div>

                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Recommendation Engine (Slide 10 Problem → AI Decision → Action) (5 cols) */}
        <div className="lg:col-span-5 bg-[#121215] rounded-2xl border border-white/5 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-400" />
                  <span>AI Recommendation Engine</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Problem &rarr; AI Decision &rarr; Executable Action (Slide 10)
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-1 bg-[#0c0c0e] p-1 rounded-lg border border-white/5 text-[11px]">
                <button
                  id="filter-rec-all"
                  onClick={() => setFilterCategory('ALL')}
                  className={`px-2 py-0.5 rounded ${filterCategory === 'ALL' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  All
                </button>
                <button
                  id="filter-rec-hotel"
                  onClick={() => setFilterCategory('HOTEL')}
                  className={`px-2 py-0.5 rounded ${filterCategory === 'HOTEL' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  Hotel
                </button>
                <button
                  id="filter-rec-transport"
                  onClick={() => setFilterCategory('TRANSPORT')}
                  className={`px-2 py-0.5 rounded ${filterCategory === 'TRANSPORT' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  Transit
                </button>
              </div>
            </div>

            {/* List of Actions */}
            <div className="space-y-3.5">
              {filteredRecommendations.map((action) => (
                <div
                  key={action.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    action.executed
                      ? 'bg-[#0e0e11] border-emerald-800/30 opacity-90'
                      : action.urgency === 'CRITICAL'
                        ? 'bg-rose-950/15 border-rose-800/30 hover:border-rose-700/50'
                        : 'bg-[#151518] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span className={`px-1.5 py-0.5 text-[9px] font-mono-code font-bold rounded uppercase ${
                        action.category === 'HOTEL' ? 'bg-amber-500/20 text-amber-300' :
                        action.category === 'TRANSPORT' ? 'bg-indigo-500/20 text-indigo-300' :
                        action.category === 'CROWD' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {action.category}
                      </span>
                      <span>{action.title}</span>
                    </span>

                    {action.executed ? (
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>EXECUTED</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold font-mono-code text-rose-400 px-1.5 py-0.5 bg-rose-500/10 rounded">
                        {action.urgency}
                      </span>
                    )}
                  </div>

                  {/* Problem & AI Decision details */}
                  <div className="text-xs space-y-1.5 mb-3">
                    <div className="text-zinc-400">
                      <strong className="text-zinc-300">Problem:</strong> {action.problemStatement}
                    </div>
                    <div className="text-indigo-300 bg-indigo-950/30 p-2 rounded-lg border border-indigo-900/30 text-[11px]">
                      <strong className="text-indigo-200">AI Decision:</strong> {action.aiDecision}
                    </div>
                    <div className="text-zinc-300 text-[11px]">
                      <strong>Action:</strong> {action.recommendedAction}
                    </div>
                    <div className="text-emerald-400 text-[11px] font-mono-code">
                      &bull; Expected: {action.expectedResult}
                    </div>
                  </div>

                  {/* Execution Trigger Button */}
                  <button
                    id={`btn-exec-${action.id}`}
                    onClick={() => handleExecute(action)}
                    disabled={action.executed}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                      action.executed
                        ? 'bg-emerald-900/20 text-emerald-400 cursor-default border border-emerald-700/30'
                        : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/25 active:scale-[0.98]'
                    }`}
                  >
                    {action.executed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mitigation Deployed ({action.executedAt || 'Active'})</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                        <span>Deploy AI Action &amp; Rebalance Capacity</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Executing actions will dynamically redistribute visitor flow across zones.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
