import React, { useState, useEffect, useMemo } from 'react';
import { 
  INITIAL_ZONES, 
  INITIAL_RECOMMENDATIONS, 
  INITIAL_ALERTS, 
  PREDICTION_TIMELINE 
} from './data/initialData';
import { 
  ZoneData, 
  RecommendationAction, 
  SystemAlert, 
  CityMetricKPIs, 
  PredictionSnapshot 
} from './types';
import { Header } from './components/Header';
import { CityHeatmap } from './components/CityHeatmap';
import { OrganizerCommandCenter } from './components/OrganizerCommandCenter';
import { AttendeeApp } from './components/AttendeeApp';
import { WhatIfSimulationLab } from './components/WhatIfSimulationLab';
import { HackCelestialPitchDeck } from './components/HackCelestialPitchDeck';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'COMMAND_CENTER' | 'ATTENDEE_APP' | 'SIMULATION_LAB' | 'PITCH_DECK'>('COMMAND_CENTER');
  const [zones, setZones] = useState<ZoneData[]>(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(INITIAL_ZONES[0]);
  const [recommendations, setRecommendations] = useState<RecommendationAction[]>(INITIAL_RECOMMENDATIONS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(0);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<{
    summary?: string;
    attendeeBroadcast?: string;
    source?: string;
  } | null>(null);

  // Check health and Gemini key availability on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(() => {
        // Dev server health check fallback
      });
  }, []);

  // Compute live city KPIs
  const kpis: CityMetricKPIs = useMemo(() => {
    const totalVisitors = zones.reduce((acc, z) => acc + z.currentVisitors, 0);
    const avgHotel = Math.round(zones.reduce((acc, z) => acc + z.hotelOccupancy, 0) / zones.length);
    const avgTransport = Math.round(zones.reduce((acc, z) => acc + z.transportUtilization, 0) / zones.length);
    const avgVenue = Math.round(zones.reduce((acc, z) => acc + z.venueUtilization, 0) / zones.length);
    const avgCrowd = Math.round(zones.reduce((acc, z) => acc + z.crowdDensity, 0) / zones.length);

    // Event Pressure Score from Slide 8:
    // Event Pressure Score = Crowd Density + Transport Utilization + Hotel Occupancy + Venue Utilization + Predicted Demand
    const rawScore = Math.round(avgCrowd * 0.28 + avgTransport * 0.26 + avgHotel * 0.24 + avgVenue * 0.22);
    const cityPressureScore = Math.min(100, Math.max(10, rawScore));

    return {
      totalVisitors,
      hotelOccupancyPercent: avgHotel,
      transportUtilizationPercent: avgTransport,
      venueOccupancyPercent: avgVenue,
      cityPressureScore,
      activeIncidentsCount: alerts.length,
      staggerEfficiencyPercent: 88,
    };
  }, [zones, alerts]);

  // Execute AI action and redistribute load across zones
  const handleExecuteAction = (actionId: string) => {
    const action = recommendations.find((r) => r.id === actionId);
    if (!action || action.executed) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Mark as executed
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === actionId ? { ...r, executed: true, executedAt: nowStr } : r
      )
    );

    // Update zones based on action logic
    setZones((prevZones) =>
      prevZones.map((z) => {
        if (actionId === 'rec-hotel-zone-c') {
          if (z.id === 'zone-a') {
            return {
              ...z,
              hotelOccupancy: Math.max(68, z.hotelOccupancy - 18),
              availableRooms: z.availableRooms + 350,
              riskLevel: z.crowdDensity > 85 ? 'HIGH' : 'MODERATE',
            };
          }
          if (z.id === 'zone-c') {
            return {
              ...z,
              hotelOccupancy: Math.min(65, z.hotelOccupancy + 22),
              availableRooms: Math.max(1200, z.availableRooms - 400),
            };
          }
        }

        if (actionId === 'rec-transport-metro-2') {
          if (z.id === 'zone-a') {
            return {
              ...z,
              transportUtilization: Math.max(62, z.transportUtilization - 24),
              riskLevel: z.hotelOccupancy > 85 ? 'HIGH' : 'MODERATE',
            };
          }
          if (z.id === 'zone-b' || z.id === 'zone-c') {
            return {
              ...z,
              transportUtilization: Math.min(68, z.transportUtilization + 12),
            };
          }
        }

        if (actionId === 'rec-crowd-stadium-gates') {
          if (z.id === 'zone-a') {
            return {
              ...z,
              crowdDensity: Math.max(68, z.crowdDensity - 20),
              currentVisitors: Math.max(30000, z.currentVisitors - 6500),
              criticalProbability30m: 38,
              riskLevel: 'MODERATE',
            };
          }
          if (z.id === 'zone-e') {
            return {
              ...z,
              crowdDensity: Math.min(75, z.crowdDensity - 12),
            };
          }
        }

        if (actionId === 'rec-fan-village-buffer') {
          if (z.id === 'zone-e') {
            return {
              ...z,
              venueUtilization: 72,
              riskLevel: 'MODERATE',
            };
          }
        }

        return z;
      })
    );

    // Resolve corresponding alert
    setAlerts((prevAlerts) =>
      prevAlerts.filter((a) => a.recommendedActionId !== actionId)
    );
  };

  // Reset to initial telemetry
  const handleResetData = () => {
    setZones(INITIAL_ZONES);
    setSelectedZone(INITIAL_ZONES[0]);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setAlerts(INITIAL_ALERTS);
    setActiveTimelineIndex(0);
    setGeminiAnalysis(null);
  };

  // Apply simulated plan from What-If Lab
  const handleApplySimulatedPlan = () => {
    recommendations.forEach((r) => {
      if (!r.executed) {
        handleExecuteAction(r.id);
      }
    });
  };

  // Trigger server-side Gemini AI analysis
  const handleRefreshGeminiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zones,
          totalVisitors: kpis.totalVisitors,
          activeAlerts: alerts,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeminiAnalysis({
          summary: data.data.summary,
          attendeeBroadcast: data.data.attendeeBroadcast,
          source: data.source,
        });
      }
    } catch (err) {
      console.error('Gemini analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executedCount = recommendations.filter((r) => r.executed).length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        totalVisitors={kpis.totalVisitors}
        cityPressureScore={kpis.cityPressureScore}
        onResetData={handleResetData}
        executedActionsCount={executedCount}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {currentTab === 'COMMAND_CENTER' && (
          <div className="space-y-6">
            {/* Interactive City Heatmap Component (Slide 9 & Slide 8) */}
            <CityHeatmap
              zones={zones}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              predictionTimeline={PREDICTION_TIMELINE}
              activeTimelineIndex={activeTimelineIndex}
              onTimelineChange={setActiveTimelineIndex}
              onExecuteRecommendation={handleExecuteAction}
            />

            {/* Organizer KPIs, Live Matrix & Recommendation Engine (Slide 8, 10, 12) */}
            <OrganizerCommandCenter
              zones={zones}
              kpis={kpis}
              recommendations={recommendations}
              alerts={alerts}
              onExecuteAction={handleExecuteAction}
              onSelectZone={setSelectedZone}
              selectedZone={selectedZone}
              onRefreshGeminiAnalysis={handleRefreshGeminiAnalysis}
              geminiAnalysis={geminiAnalysis}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {currentTab === 'ATTENDEE_APP' && (
          <AttendeeApp />
        )}

        {currentTab === 'SIMULATION_LAB' && (
          <WhatIfSimulationLab
            onApplySimulatedPlan={handleApplySimulatedPlan}
          />
        )}

        {currentTab === 'PITCH_DECK' && (
          <HackCelestialPitchDeck />
        )}
      </main>

      {/* Bottom Status Ticker */}
      <footer className="bg-[#09090b] border-t border-white/5 py-3.5 text-xs text-zinc-500 font-mono-code">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>EventFlow AI Orchestration Node Active</span>
            </span>
            <span className="text-zinc-700">|</span>
            <span>HackCelestial 3.0 Edition</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-zinc-400">
              Status: <span className="text-emerald-400 font-bold">OPTIMAL</span>
            </span>
            <span>AI: Gemini 3.8 Flash Hybrid Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
