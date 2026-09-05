import React, { useState, useEffect } from 'react';
import { 
  ZoneData, 
  RiskLevel, 
  PredictionSnapshot 
} from '../types';
import { 
  Layers, 
  Clock, 
  AlertTriangle, 
  Play, 
  Pause, 
  TrendingUp, 
  Hotel, 
  Train, 
  Users, 
  ShieldAlert,
  ChevronRight,
  Info
} from 'lucide-react';

interface CityHeatmapProps {
  zones: ZoneData[];
  selectedZone: ZoneData | null;
  onSelectZone: (zone: ZoneData) => void;
  predictionTimeline: PredictionSnapshot[];
  activeTimelineIndex: number;
  onTimelineChange: (index: number) => void;
  onExecuteRecommendation?: (actionId: string) => void;
}

type LayerMode = 'PRESSURE' | 'CROWD' | 'HOTEL' | 'TRANSPORT' | 'VENUE';

export const CityHeatmap: React.FC<CityHeatmapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  predictionTimeline,
  activeTimelineIndex,
  onTimelineChange,
}) => {
  const [layerMode, setLayerMode] = useState<LayerMode>('PRESSURE');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play prediction timeline
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        onTimelineChange((activeTimelineIndex + 1) % predictionTimeline.length);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeTimelineIndex, predictionTimeline.length, onTimelineChange]);

  const currentSnapshot = predictionTimeline[activeTimelineIndex] || predictionTimeline[0];

  // Helper to get dynamic value based on layer mode and time offset
  const getZoneMetricValue = (zone: ZoneData) => {
    const predicted = currentSnapshot.zonePressures[zone.id];
    if (!predicted) return zone.crowdDensity;

    switch (layerMode) {
      case 'CROWD':
        return predicted.crowd;
      case 'HOTEL':
        return predicted.hotel;
      case 'TRANSPORT':
        return predicted.transport;
      case 'VENUE':
        return zone.venueUtilization;
      case 'PRESSURE':
      default:
        // Event Pressure Score formula
        return Math.round(
          predicted.crowd * 0.3 +
          predicted.transport * 0.25 +
          predicted.hotel * 0.25 +
          zone.venueUtilization * 0.2
        );
    }
  };

  const getMetricColor = (val: number) => {
    if (val >= 85) return { bg: '#ef4444', text: 'text-rose-400', stroke: '#dc2626', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    if (val >= 65) return { bg: '#f97316', text: 'text-amber-400', stroke: '#ea580c', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    if (val >= 45) return { bg: '#eab308', text: 'text-yellow-400', stroke: '#ca8a04', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' };
    return { bg: '#10b981', text: 'text-emerald-400', stroke: '#059669', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  };

  const activeZone = selectedZone || zones[0];
  const activeZoneMetrics = currentSnapshot.zonePressures[activeZone.id] || {
    crowd: activeZone.crowdDensity,
    transport: activeZone.transportUtilization,
    hotel: activeZone.hotelOccupancy,
    risk: activeZone.riskLevel,
    probabilityCritical: activeZone.criticalProbability30m,
  };

  return (
    <div className="bg-[#121215] rounded-2xl border border-white/5 p-5 shadow-2xl flex flex-col space-y-4">
      {/* Top Map Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Predictive City Capacity Heatmap</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#18181b] text-zinc-300 font-mono-code border border-white/10">
                {currentSnapshot.label}
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Cross-domain GIS view: Stadiums, Hospitality Clusters & Transit Corridors
            </p>
          </div>
        </div>

        {/* Heatmap Layer Selectors */}
        <div className="flex items-center flex-wrap gap-1 bg-[#0c0c0e] p-1 rounded-xl border border-white/5">
          <button
            id="layer-pressure"
            onClick={() => setLayerMode('PRESSURE')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              layerMode === 'PRESSURE'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Combined Pressure
          </button>
          <button
            id="layer-crowd"
            onClick={() => setLayerMode('CROWD')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              layerMode === 'CROWD'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Crowd Density
          </button>
          <button
            id="layer-hotel"
            onClick={() => setLayerMode('HOTEL')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              layerMode === 'HOTEL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Hotel Saturation
          </button>
          <button
            id="layer-transport"
            onClick={() => setLayerMode('TRANSPORT')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              layerMode === 'TRANSPORT'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Transit Load
          </button>
        </div>
      </div>

      {/* Main Interactive Map & Zone Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Vector SVG Heatmap Stage (8 cols) */}
        <div className="lg:col-span-8 bg-[#0a0a0c] rounded-xl border border-white/5 p-3 relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          {/* Map Status Bar & Legend Overlay */}
          <div className="flex items-center justify-between z-10 text-xs px-2 py-1.5 bg-[#121215]/90 backdrop-blur rounded-lg border border-white/5">
            <div className="flex items-center space-x-3">
              <span className="text-zinc-400 font-mono-code">MODE:</span>
              <span className="font-semibold text-white uppercase">{layerMode} HEAT</span>
              <span className="hidden sm:inline-block text-zinc-600">|</span>
              <span className="text-zinc-400 hidden sm:inline-block">Active Influx: Olympic Main Precinct</span>
            </div>

            {/* Heat Gradient Legend */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-zinc-400">Low (0%)</span>
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />
              <span className="text-[10px] text-zinc-400">Critical (100%)</span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[360px] my-auto">
            <svg
              className="w-full h-full select-none"
              viewBox="0 0 1000 600"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* City Grid pattern */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.2)" strokeWidth="1" />
                </pattern>

                {/* River Waterfront Gradient */}
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0369a1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#082f49" stopOpacity="0.4" />
                </linearGradient>

                {/* Radial Heat Gradient for critical zones */}
                <radialGradient id="heatCritical" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatModerate" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatLow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="70%" stopColor="#10b981" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Grid */}
              <rect width="1000" height="600" fill="url(#grid)" />

              {/* Stylized River & Waterfront Feature */}
              <path
                d="M 620 0 Q 640 220 740 340 T 920 600 L 1000 600 L 1000 0 Z"
                fill="url(#riverGrad)"
              />
              <text x="850" y="300" fill="#38bdf8" fillOpacity="0.3" fontSize="14" fontFamily="monospace" transform="rotate(45, 850, 300)">
                CENTRAL WATERFRONT CORRIDOR
              </text>

              {/* Transit Arterial Line: Metro Route 1 (Orange/Red) */}
              <path
                d="M 240 132 Q 360 180 480 228 T 660 180"
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeDasharray="6 4"
                opacity="0.85"
              />
              {/* Transit Arterial Line: Metro Route 2 Express (Green - bypassing congestion) */}
              <path
                d="M 720 408 C 580 400 480 320 480 228"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                opacity="0.9"
              />
              {/* Dedicated Event Shuttle Bus (Blue) */}
              <path
                d="M 320 348 C 500 380 620 440 720 408 C 780 390 820 300 820 252"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="4 4"
                opacity="0.75"
              />

              {/* Transit Line Labels */}
              <text x="320" y="160" fill="#f97316" fontSize="11" fontWeight="600">
                Metro Route 1 (Overloaded 91%)
              </text>
              <text x="560" y="350" fill="#10b981" fontSize="11" fontWeight="600">
                Metro Route 2 Express (Available ✓)
              </text>
              <text x="710" y="440" fill="#38bdf8" fontSize="10">
                Dedicated Shuttle 5
              </text>

              {/* Zones Rendering */}
              {zones.map((zone) => {
                const cx = (zone.x / 100) * 1000;
                const cy = (zone.y / 100) * 600;
                const metricVal = getZoneMetricValue(zone);
                const colorInfo = getMetricColor(metricVal);
                const isSelected = activeZone.id === zone.id;
                const isCritical = metricVal >= 85;

                const heatGradientId = isCritical 
                  ? 'url(#heatCritical)' 
                  : metricVal >= 55 
                    ? 'url(#heatModerate)' 
                    : 'url(#heatLow)';

                return (
                  <g 
                    key={zone.id} 
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => onSelectZone(zone)}
                  >
                    {/* Dynamic Heat Gradient Bubble */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isCritical ? 110 : 85}
                      fill={heatGradientId}
                    />

                    {/* Animated Pulsing Ring for Critical alerts */}
                    {isCritical && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="38"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        className="animate-pulse-ring"
                      />
                    )}

                    {/* Selection Indicator Ring */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="42"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                      />
                    )}

                    {/* Zone Center Circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="28"
                      fill="#0f172a"
                      stroke={colorInfo.stroke}
                      strokeWidth={isSelected ? '4' : '2.5'}
                    />

                    {/* Value Badge inside Zone */}
                    <text
                      x={cx}
                      y={cy - 2}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {metricVal}%
                    </text>
                    <text
                      x={cx}
                      y={cy + 13}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="monospace"
                    >
                      {zone.code}
                    </text>

                    {/* Label Tag Box */}
                    <rect
                      x={cx - 75}
                      y={cy + 34}
                      width="150"
                      height="22"
                      rx="6"
                      fill="#0b0f17"
                      fillOpacity="0.9"
                      stroke={isSelected ? '#60a5fa' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x={cx}
                      y={cy + 48}
                      textAnchor="middle"
                      fill={isSelected ? '#93c5fd' : '#e2e8f0'}
                      fontSize="10"
                      fontWeight="600"
                    >
                      {zone.name.split('—')[0].trim()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Timeline Controls Bottom Bar */}
          <div className="bg-[#121215]/95 rounded-xl p-3 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
            <div className="flex items-center space-x-2">
              <button
                id="btn-play-timeline"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
                title={isPlaying ? "Pause timeline simulation" : "Play forward 60-min timeline"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="flex items-center space-x-1.5 text-xs text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold text-white">Prediction Timeline:</span>
                <span className="font-mono-code text-indigo-400">{currentSnapshot.label}</span>
              </div>
            </div>

            {/* Quick Step Buttons */}
            <div className="flex items-center space-x-1 bg-[#0c0c0e] p-1 rounded-lg border border-white/5">
              {predictionTimeline.map((pt, idx) => (
                <button
                  key={pt.timeOffsetMin}
                  id={`timeline-step-${idx}`}
                  onClick={() => {
                    setIsPlaying(false);
                    onTimelineChange(idx);
                  }}
                  className={`px-2.5 py-1 text-xs rounded font-mono-code transition-all ${
                    activeTimelineIndex === idx
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {pt.timeOffsetMin === 0 ? 'Now' : `+${pt.timeOffsetMin}m`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Zone Deep Dive Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#141417] rounded-xl border border-white/5 p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-zinc-400">
                Zone Inspection
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getMetricColor(activeZoneMetrics.crowd).badge}`}>
                {activeZoneMetrics.risk} RISK
              </span>
            </div>

            <h3 className="text-lg font-bold text-white leading-snug mb-1">
              {activeZone.name}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              {activeZone.description}
            </p>

            {/* Critical Probability Banner (from PPT Slide 9) */}
            <div className="p-3 rounded-xl bg-[#0e0e11] border border-white/5 mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-400 flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                  <span>30-Min Saturation Probability</span>
                </span>
                <span className="font-bold text-rose-400 font-mono-code">
                  {activeZoneMetrics.probabilityCritical}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#1c1c20] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    activeZoneMetrics.probabilityCritical > 75 
                      ? 'bg-rose-500' 
                      : activeZoneMetrics.probabilityCritical > 40 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${activeZoneMetrics.probabilityCritical}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 italic">
                {activeZone.id === 'zone-a'
                  ? '“Zone A has an 87% probability of reaching critical crowd pressure within 30 minutes.”'
                  : activeZone.id === 'zone-c'
                    ? '“Zone C maintains ample buffer with 65%+ available capacity and express transit connectivity.”'
                    : `“Predicted demand trajectory: ${activeZoneMetrics.crowd}% crowd density at peak.”`
                }
              </p>
            </div>

            {/* Metric Bars */}
            <div className="space-y-2.5">
              {/* Crowd Density */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-300 flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Crowd Density</span>
                  </span>
                  <span className="font-mono-code font-bold text-white">{activeZoneMetrics.crowd}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1c1c20] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${activeZoneMetrics.crowd}%` }}
                  />
                </div>
              </div>

              {/* Transport Utilization */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-300 flex items-center space-x-1.5">
                    <Train className="w-3.5 h-3.5 text-amber-400" />
                    <span>Transport Utilization</span>
                  </span>
                  <span className="font-mono-code font-bold text-white">{activeZoneMetrics.transport}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1c1c20] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${activeZoneMetrics.transport}%` }}
                  />
                </div>
              </div>

              {/* Hotel Occupancy */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-300 flex items-center space-x-1.5">
                    <Hotel className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hotel Occupancy</span>
                  </span>
                  <span className="font-mono-code font-bold text-white">{activeZoneMetrics.hotel}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1c1c20] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${activeZoneMetrics.hotel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
              <div className="bg-[#0e0e11] p-2 rounded-lg border border-white/5">
                <div className="text-zinc-400 text-[10px]">CURRENT VISITORS</div>
                <div className="font-mono-code font-bold text-white text-sm">
                  {activeZone.currentVisitors.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#0e0e11] p-2 rounded-lg border border-white/5">
                <div className="text-zinc-400 text-[10px]">AVAILABLE ROOMS</div>
                <div className="font-mono-code font-bold text-emerald-400 text-sm">
                  {activeZone.availableRooms} rooms
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommended Action Callout for this zone */}
          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>AI Tactical Guidance</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {activeZone.riskLevel === 'CRITICAL'
                ? 'Divert arriving visitors toward Zone B/C. Activate secondary gates and push transit discounts for Metro Line 2.'
                : activeZone.riskLevel === 'LOW'
                  ? 'Prime destination for visitor redistribution. Promote hotels and express shuttles to relieve central gridlock.'
                  : 'Maintain balanced monitoring. Ready secondary bus loops if Zone A exceeds 95%.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
