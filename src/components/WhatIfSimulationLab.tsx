import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { SimulationResult } from '../types';
import confetti from 'canvas-confetti';

interface WhatIfSimulationLabProps {
  onApplySimulatedPlan: (actionsCount: number) => void;
}

export const WhatIfSimulationLab: React.FC<WhatIfSimulationLabProps> = ({
  onApplySimulatedPlan,
}) => {
  const [baseVisitors, setBaseVisitors] = useState<number>(100000);
  const [surgeVisitors, setSurgeVisitors] = useState<number>(30000);
  const [shockScenario, setShockScenario] = useState<string>('VISITOR_SPIKE');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>({
    totalVisitors: 130000,
    bottlenecks: [
      {
        area: "Main Stadium Gates & Concourse",
        status: "CRITICAL",
        impact: "Queue time spikes to ~48 minutes; turnstiles overwhelmed by +30,000 arrivals.",
        loadPercent: 118,
      },
      {
        area: "Metro Line 1 (Central Hub)",
        status: "CRITICAL",
        impact: "Severe platform crowding; headway delays cause passenger safety holdbacks.",
        loadPercent: 112,
      },
      {
        area: "Zone A Hotel District",
        status: "SATURATED",
        impact: "Zone A reaches 99% occupancy; severe price gouging and accommodation shortages.",
        loadPercent: 99,
      },
      {
        area: "Zone C / Outer Perimeter",
        status: "UNDERUTILIZED",
        impact: "Remains at only 38% capacity without centralized orchestration.",
        loadPercent: 38,
      },
    ],
    aiPlan: [
      "Activate Metro Line 2 auxiliary express trains at 3-minute headways",
      "Deploy 45 on-demand city shuttle buses between Central Station and Zone C",
      "Broadcast push alerts redirecting non-ticketed fans to Fan Zone B Live Screen Park",
      "Open secondary stadium perimeter gates 7 through 14 with fast-track digital passes",
      "Distribute dynamic hotel vouchers to shift 4,500 overnight guests toward Zone B and C",
    ],
    metricsComparison: {
      beforeAI: {
        avgWaitTimeMin: 48,
        congestionIndex: 94,
        hotelSaturationPercent: 98,
        incidentRisk: "CRITICAL",
      },
      afterAI: {
        avgWaitTimeMin: 16,
        congestionIndex: 58,
        hotelSaturationPercent: 72,
        incidentRisk: "LOW",
      },
    },
    summaryVerdict: "By redistributing 30,000 surge visitors across secondary transit routes and promoting Zone B/C hospitality zones, EventFlow AI slashes peak bottleneck density by 42% and cuts queue wait times by 67%.",
  });

  const [deployed, setDeployed] = useState<boolean>(false);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setDeployed(false);

    try {
      const res = await fetch('/api/ai/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseVisitors,
          extraVisitors: surgeVisitors,
          shockEvent: shockScenario,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSimulationResult({
          totalVisitors: baseVisitors + surgeVisitors,
          ...data.data,
        });
      }
    } catch (err) {
      console.error("Simulation API error:", err);
    } finally {
      setIsSimulating(false);
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleDeploy = () => {
    setDeployed(true);
    onApplySimulatedPlan(5);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
    });
  };

  const totalSimulated = baseVisitors + surgeVisitors;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Simulation Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-[#141417] to-indigo-950/30 border border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>HackCelestial 3.0 Core Feature &bull; What-If Simulation Engine (Slide 13)</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Mega-Event Stress Testing &amp; Capacity Surge Simulator
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mt-1">
              Test &ldquo;What happens if 30,000 additional visitors arrive?&rdquo; Observe predicted failure points across hotels and transit lines, then trigger automated AI multi-agency mitigation.
            </p>
          </div>

          <div className="text-right font-mono-code bg-[#0c0c0e] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-zinc-400 block">TOTAL SIMULATED INFLUX</span>
            <span className="text-2xl font-black text-amber-400">{totalSimulated.toLocaleString()}</span>
            <span className="text-[11px] text-zinc-500 block">+{Math.round((surgeVisitors / baseVisitors) * 100)}% Surge Spike</span>
          </div>
        </div>
      </div>

      {/* Simulator Control Inputs (Slide 13) */}
      <div className="bg-[#121215] rounded-2xl border border-white/5 p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Baseline Visitors */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-zinc-300">Expected Base Visitors</label>
              <span className="text-xs font-mono-code font-bold text-indigo-400">
                {baseVisitors.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              id="slider-base-visitors"
              min={50000}
              max={150000}
              step={5000}
              value={baseVisitors}
              onChange={(e) => setBaseVisitors(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-[#1c1c20] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono-code mt-1">
              <span>50,000</span>
              <span>100,000 (Default)</span>
              <span>150,000</span>
            </div>
          </div>

          {/* Surge Visitors (The Slider in Slide 13: 100k -> 130k) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-zinc-300">Surge Influx Addition</label>
              <span className="text-xs font-mono-code font-bold text-rose-400">
                +{surgeVisitors.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              id="slider-surge-visitors"
              min={5000}
              max={60000}
              step={5000}
              value={surgeVisitors}
              onChange={(e) => setSurgeVisitors(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-[#1c1c20] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono-code mt-1">
              <span>+5,000</span>
              <span>+30,000 (Slide 13)</span>
              <span>+60,000</span>
            </div>
          </div>

          {/* Simulated Shock Condition */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-2">
              Inject Shock Condition
            </label>
            <select
              id="select-shock"
              value={shockScenario}
              onChange={(e) => setShockScenario(e.target.value)}
              className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="VISITOR_SPIKE">Standard Visitor Surge (+30,000 Spike)</option>
              <option value="METRO_DELAY">Metro Line 1 Signal Failure (40% Transit Halt)</option>
              <option value="HEAVY_RAIN">Sudden Torrential Downpour (Outdoor crowd flushes inside)</option>
              <option value="VIP_CONVOY">VIP Convoy &amp; Primary Arterial Road Closures</option>
            </select>
          </div>
        </div>

        {/* Run Button */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            Calculates cross-domain load across all 6 city sectors in real time.
          </div>
          <button
            id="btn-run-simulation"
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-amber-600/30 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Computing AI Stress Matrix...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>[ RUN WHAT-IF SIMULATION ]</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Results Display (Slide 13) */}
      {simulationResult && (
        <div className="space-y-6">
          {/* Top Columns: System Predicts vs AI Recommends (Slide 13) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Predicts (Slide 13: 🔴 Stadium congestion, 🔴 Metro overload, 🟠 Hotel saturation) */}
            <div className="bg-[#121215] rounded-2xl border border-rose-900/30 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <h3 className="text-base font-bold text-white">
                    System Predicts (Slide 13)
                  </h3>
                </div>
                <span className="text-[10px] font-mono-code text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 font-bold">
                  UNMITIGATED STATUS
                </span>
              </div>

              <div className="space-y-3">
                {simulationResult.bottlenecks.map((bn, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#0c0c0e] rounded-xl border border-white/5 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          bn.status === 'CRITICAL' ? 'bg-rose-500' :
                          bn.status === 'SATURATED' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <span>{bn.area}</span>
                      </span>
                      <span className={`text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded ${
                        bn.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                        bn.status === 'SATURATED' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {bn.loadPercent}% LOAD &bull; {bn.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {bn.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommends Action Plan (Slide 13) */}
            <div className="bg-[#121215] rounded-2xl border border-emerald-900/30 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    AI Recommends Action Plan (Slide 13)
                  </h3>
                </div>
                <span className="text-[10px] font-mono-code text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold">
                  PROACTIVE INTERVENTION
                </span>
              </div>

              <div className="space-y-2.5">
                {simulationResult.aiPlan.map((planStep, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-800/30 flex items-start space-x-3 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-200 font-medium leading-relaxed">
                      {planStep}
                    </span>
                  </div>
                ))}
              </div>

              {/* Deploy Plan Button */}
              <button
                id="btn-deploy-simulation-plan"
                onClick={handleDeploy}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                  deployed
                    ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-600/40'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20'
                }`}
              >
                {deployed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Mitigation Plan Synced to Command Center ✓</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Apply AI Mitigation Plan to Command Center</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quantitative Impact Comparison: Before AI vs After AI (Slide 13 Result) */}
          <div className="bg-[#121215] rounded-2xl border border-white/5 p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Quantitative Comparison: Before AI vs After AI Mitigation (Slide 13)
              </h3>
              <p className="text-xs text-zinc-400">
                Localized overcrowding vs intelligent city-wide redistribution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Metric 1: Avg Wait Time */}
              <div className="bg-[#0c0c0e] p-4 rounded-xl border border-white/5 text-center">
                <span className="text-[11px] font-mono-code text-zinc-400 block mb-1">
                  AVG QUEUE WAIT TIME
                </span>
                <div className="flex items-center justify-center space-x-3 my-1">
                  <span className="text-rose-400 font-bold text-lg font-mono-code line-through opacity-80">
                    {simulationResult.metricsComparison.beforeAI.avgWaitTimeMin}m
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                  <span className="text-emerald-400 font-black text-2xl font-mono-code">
                    {simulationResult.metricsComparison.afterAI.avgWaitTimeMin}m
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  -67% Reduction in Wait
                </span>
              </div>

              {/* Metric 2: Congestion Index */}
              <div className="bg-[#0c0c0e] p-4 rounded-xl border border-white/5 text-center">
                <span className="text-[11px] font-mono-code text-zinc-400 block mb-1">
                  CONGESTION INDEX
                </span>
                <div className="flex items-center justify-center space-x-3 my-1">
                  <span className="text-rose-400 font-bold text-lg font-mono-code line-through opacity-80">
                    {simulationResult.metricsComparison.beforeAI.congestionIndex}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                  <span className="text-emerald-400 font-black text-2xl font-mono-code">
                    {simulationResult.metricsComparison.afterAI.congestionIndex}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Safe Operating Range
                </span>
              </div>

              {/* Metric 3: Hotel Saturation */}
              <div className="bg-[#0c0c0e] p-4 rounded-xl border border-white/5 text-center">
                <span className="text-[11px] font-mono-code text-zinc-400 block mb-1">
                  HOTEL PEAK SATURATION
                </span>
                <div className="flex items-center justify-center space-x-3 my-1">
                  <span className="text-rose-400 font-bold text-lg font-mono-code line-through opacity-80">
                    {simulationResult.metricsComparison.beforeAI.hotelSaturationPercent}%
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                  <span className="text-emerald-400 font-black text-2xl font-mono-code">
                    {simulationResult.metricsComparison.afterAI.hotelSaturationPercent}%
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Balanced into Zone B/C
                </span>
              </div>

              {/* Metric 4: Incident Risk */}
              <div className="bg-[#0c0c0e] p-4 rounded-xl border border-white/5 text-center">
                <span className="text-[11px] font-mono-code text-zinc-400 block mb-1">
                  CROWD INCIDENT RISK
                </span>
                <div className="flex items-center justify-center space-x-3 my-1">
                  <span className="text-rose-400 font-bold text-sm font-mono-code line-through opacity-80">
                    {simulationResult.metricsComparison.beforeAI.incidentRisk}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                  <span className="text-emerald-400 font-black text-xl font-mono-code">
                    {simulationResult.metricsComparison.afterAI.incidentRisk}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Prevented Bottleneck Crash
                </span>
              </div>
            </div>

            {/* Verdict Box */}
            <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
              <strong className="font-bold text-white block mb-0.5">Simulation Verdict:</strong>
              <p className="leading-relaxed text-[11px]">
                {simulationResult.summaryVerdict}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
