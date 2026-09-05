import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Train, 
  Bus, 
  ShieldCheck, 
  Sparkles, 
  Hotel, 
  Utensils, 
  QrCode, 
  Check, 
  AlertCircle,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { ATTENDEE_HOTELS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface AttendeeAppProps {
  onGuideRequest?: (origin: string, destination: string, time: string) => void;
}

export const AttendeeApp: React.FC<AttendeeAppProps> = () => {
  const [origin, setOrigin] = useState<string>('Railway Station');
  const [destination, setDestination] = useState<string>('Olympic Stadium (West Gate)');
  const [arrivalTime, setArrivalTime] = useState<string>('6:00 PM');
  const [preference, setPreference] = useState<'LEAST_CROWDED' | 'FASTEST' | 'CHEAPEST'>('LEAST_CROWDED');
  const [passClaimed, setPassClaimed] = useState<boolean>(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  const handleClaimPass = () => {
    setPassClaimed(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Attendee App Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/50 via-slate-900/60 to-[#121215] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 animate-spin" />
            <span>EventFlow AI &bull; Personalized Attendee Companion (Slide 11)</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Smart Transit &amp; Zero-Queue Hospitality Navigator
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl mt-1">
            Real-time crowd-aware routing. Avoid packed Metro Route 1 platforms, skip 45-minute turnstile lines, and discover comfortable hotels in under-saturated city zones.
          </p>
        </div>
      </div>

      {/* Grid: Route Planner Form & AI Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#121215] rounded-2xl border border-white/5 p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono-code text-zinc-300 border-b border-white/5 pb-2">
            Plan Your Journey
          </h3>

          {/* Current Location */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Current Location (Origin)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-indigo-400 absolute left-3 top-3" />
              <select
                id="select-origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Railway Station">Central Railway Station (Platform 1-8)</option>
                <option value="International Airport">Airport Terminal 2 (Zone D)</option>
                <option value="Midtown Hotel Cluster">Midtown Cultural Quarter (Zone B)</option>
                <option value="Waterfront Promenade">Waterfront District (Zone C)</option>
                <option value="East Innovation Park">East Innovation Park &amp; Ride (Zone F)</option>
              </select>
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Event Destination
            </label>
            <div className="relative">
              <Compass className="w-4 h-4 text-indigo-400 absolute left-3 top-3" />
              <select
                id="select-destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Olympic Stadium (West Gate)">Olympic Stadium — Main Concourse (Zone A)</option>
                <option value="Olympic Arena & Fan Plaza">Fan Plaza Live Concert Arena (Zone E)</option>
                <option value="Exhibition Conference Center">Mega-Exhibition Convention Hall</option>
              </select>
            </div>
          </div>

          {/* Arrival Time */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Desired Arrival Time
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
              <select
                id="select-arrival-time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono-code"
              >
                <option value="5:00 PM">5:00 PM (Recommended: Lowest Queues)</option>
                <option value="5:30 PM">5:30 PM (Moderate Turnstile Load)</option>
                <option value="6:00 PM">6:00 PM (Peak Surge Window)</option>
                <option value="6:30 PM">6:30 PM (Pre-Kickoff Capacity Limit)</option>
              </select>
            </div>
          </div>

          {/* Preference */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Optimization Priority
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                id="pref-least-crowd"
                onClick={() => setPreference('LEAST_CROWDED')}
                className={`py-2 px-2 rounded-lg font-medium border text-center transition-all ${
                  preference === 'LEAST_CROWDED'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#0c0c0e] border-white/5 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Lowest Crowd
              </button>
              <button
                type="button"
                id="pref-fastest"
                onClick={() => setPreference('FASTEST')}
                className={`py-2 px-2 rounded-lg font-medium border text-center transition-all ${
                  preference === 'FASTEST'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#0c0c0e] border-white/5 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Fastest
              </button>
              <button
                type="button"
                id="pref-cheapest"
                onClick={() => setPreference('CHEAPEST')}
                className={`py-2 px-2 rounded-lg font-medium border text-center transition-all ${
                  preference === 'CHEAPEST'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#0c0c0e] border-white/5 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Cheapest
              </button>
            </div>
          </div>

          {/* Smart Timing Advice Callout (Slide 11) */}
          <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl text-xs space-y-1">
            <div className="text-amber-400 font-bold flex items-center space-x-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Smart Arrival Timing Advice</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Main gate bottleneck reaches peak 95% throughput between 5:45 PM and 6:15 PM. Arriving before 5:20 PM cuts wait time from 28 mins to under 4 mins!
            </p>
          </div>
        </div>

        {/* Right: AI Recommendation Results & Travel Options (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Primary Recommended Transit Option (Slide 11 Metro Route 2) */}
          <div className="bg-[#121215] rounded-2xl border-2 border-emerald-500/50 p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
              AI Primary Recommendation
            </div>

            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Metro Route 2 (Express Green Line)
                    </h4>
                    <span className="text-xs text-zinc-400">
                      Bypasses congested Downtown corridor directly to West Concourse
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Matrix */}
            <div className="grid grid-cols-3 gap-2 my-3 p-3 bg-[#0c0c0e] rounded-xl border border-white/5 font-mono-code text-center text-xs">
              <div>
                <div className="text-[10px] text-zinc-400">TRAVEL TIME</div>
                <div className="font-bold text-emerald-400 text-sm">24 min</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400">CROWD PRESSURE</div>
                <div className="font-bold text-emerald-400 text-sm">Low (32%)</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400">CAPACITY</div>
                <div className="font-bold text-emerald-400 text-sm">Available Seats</div>
              </div>
            </div>

            {/* Why Recommended */}
            <div className="text-xs text-slate-300 bg-emerald-950/20 border border-emerald-800/30 p-3 rounded-xl mb-3 space-y-1">
              <strong className="text-emerald-300 font-bold block">Why EventFlow AI Recommends This:</strong>
              <p className="text-[11px] leading-relaxed">
                Metro Route 1 is currently operating at 91% capacity with a 22-minute platform queue at Central Station. Metro Route 2 has dedicated 4-minute express intervals with zero queue delay.
              </p>
            </div>

            {/* Route Steps */}
            <div className="space-y-1.5 text-xs text-slate-300 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono-code flex items-center justify-center font-bold">1</span>
                <span>Board Metro Route 2 at Station Platform 4 (Express Concourse)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono-code flex items-center justify-center font-bold">2</span>
                <span>Direct express transit past saturated Zone A Downtown core</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono-code flex items-center justify-center font-bold">3</span>
                <span>Arrive at Stadium West Concourse with direct QR turnstile lane</span>
              </div>
            </div>

            {/* Claim Free Digital Fast-Track Pass */}
            <button
              id="btn-claim-transit-pass"
              onClick={handleClaimPass}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              {passClaimed ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Digital Pass Activated &bull; QR Code Ready</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>Generate Free Fast-Track Digital Transit Pass</span>
                </>
              )}
            </button>
          </div>

          {/* Alternative Transit Option (Slide 11 Bus Route 5) */}
          <div className="bg-[#121215] rounded-xl border border-white/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Alternative: Dedicated Event Shuttle Bus 5
                  </h4>
                  <span className="text-[11px] text-zinc-400">
                    Scenic Waterfront busway with guaranteed express lane
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono-code text-zinc-400">31 min travel</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2 bg-[#0c0c0e] rounded-lg border border-white/5 font-mono-code">
              <span className="text-zinc-300">Crowd: Moderate (52%)</span>
              <span className="text-zinc-300">Capacity: Available</span>
              <span className="text-indigo-400">Fare: Included in Event Ticket</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Hospitality Discovery (Slide 10 & 11) */}
      <div className="bg-[#121215] rounded-2xl border border-white/5 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Hotel className="w-4 h-4 text-amber-400" />
              <span>Smart Hospitality &amp; Hotel Recommendations (Slide 10)</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Avoid 94% saturated Zone A hotels. AI highlights Zone C hotels with 68% vacancy and express transit links.
            </p>
          </div>
          <span className="text-xs font-mono-code text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Save up to 60% vs surge pricing
          </span>
        </div>

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ATTENDEE_HOTELS.map((hotel) => {
            const isSelected = selectedHotelId === hotel.id;
            return (
              <div
                key={hotel.id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  hotel.recommendedByAi
                    ? 'bg-[#0e1111] border-emerald-500/40 shadow-md shadow-emerald-500/5'
                    : 'bg-[#0c0c0e] border-white/5 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono-code uppercase text-zinc-400">
                      {hotel.zoneName}
                    </span>
                    {hotel.recommendedByAi && (
                      <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                        AI Recommended
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {hotel.name}
                  </h4>
                  <div className="text-xs text-zinc-400 mt-1">
                    {hotel.transitConnection}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Occupancy:</span>
                    <span className={`font-mono-code font-bold ${
                      hotel.occupancyPercent > 80 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {hotel.occupancyPercent}% ({hotel.availableRooms} rooms left)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Nightly Rate:</span>
                    <span className="font-mono-code font-bold text-white">
                      ${hotel.pricePerNight} <span className="text-[10px] text-zinc-500">/night</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-indigo-300 font-medium">
                    &bull; {hotel.perk}
                  </div>
                </div>

                <button
                  id={`btn-book-${hotel.id}`}
                  onClick={() => {
                    setSelectedHotelId(hotel.id);
                    confetti({ particleCount: 25, spread: 40 });
                  }}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : hotel.recommendedByAi
                        ? 'bg-[#18181c] hover:bg-[#202026] text-zinc-200 border border-white/10'
                        : 'bg-[#121215] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isSelected ? '✓ Reserved Room Lock' : 'Reserve Partner Rate'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
