import React, { useState } from 'react';
import { HACKCELESTIAL_SLIDES } from '../data/initialData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Check, 
  X,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';

export const HackCelestialPitchDeck: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const slide = HACKCELESTIAL_SLIDES[currentSlideIndex];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : HACKCELESTIAL_SLIDES.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < HACKCELESTIAL_SLIDES.length - 1 ? prev + 1 : 0));
  };

  const handleCopyText = () => {
    const text = `Slide ${slide.slideNumber}: ${slide.title}\n${slide.subtitle}\n\n${
      slide.content.points?.join('\n') || ''
    }\n${slide.content.quote || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Pitch Deck Header Bar */}
      <div className="bg-[#121215] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">
                HackCelestial 3.0 &bull; Official 20-Slide PPT Viewer
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono-code border border-indigo-500/20">
                Slide {slide.slideNumber} / 20
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Complete presentation structured exactly per HackCelestial guidelines
            </p>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-slide-prev"
            onClick={handlePrev}
            className="p-2 rounded-lg bg-[#0c0c0e] hover:bg-[#18181c] text-zinc-300 transition-colors border border-white/5"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            id="btn-slide-next"
            onClick={handleNext}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors border border-indigo-500 shadow-md shadow-indigo-600/30"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            id="btn-copy-slide"
            onClick={handleCopyText}
            className="p-2 rounded-lg bg-[#0c0c0e] hover:bg-[#18181c] text-zinc-300 transition-colors border border-white/5"
            title="Copy slide points to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Card (Presentation View) */}
      <div className="bg-gradient-to-b from-[#121215] via-[#101013] to-[#0A0A0B] border border-white/5 rounded-3xl p-8 shadow-2xl min-h-[500px] flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="border-b border-white/5 pb-5 mb-6">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1 font-mono-code">
            <span className="uppercase tracking-wider text-indigo-400 font-bold">
              {slide.category} &bull; SLIDE {slide.slideNumber} OF 20
            </span>
            <span>HackCelestial 3.0 Pitch</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="text-base text-zinc-400 mt-1">
              {slide.subtitle}
            </p>
          )}
        </div>

        {/* Slide Content Body */}
        <div className="flex-1 space-y-6">
          {/* Quote / Abstract Block */}
          {slide.content.quote && (
            <div className="p-4 bg-indigo-950/20 border-l-4 border-indigo-500 rounded-r-xl text-zinc-200 text-sm leading-relaxed italic">
              &ldquo;{slide.content.quote}&rdquo;
            </div>
          )}

          {/* Points List */}
          {slide.content.points && (
            <ul className="space-y-3">
              {slide.content.points.map((point, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-zinc-200 text-sm leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono-code flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    &bull;
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Diagram: Flowchart (Slide 5) */}
          {slide.content.diagramType === 'FLOWCHART' && (
            <div className="p-4 bg-[#0c0c0e] rounded-xl border border-white/5 font-mono-code text-xs text-zinc-300 overflow-x-auto">
              <div className="text-emerald-400 font-bold mb-2">// LOGICAL DECISION FLOWCHART (SLIDE 5)</div>
              <div className="flex flex-col items-center space-y-1 text-center py-2">
                <div className="px-4 py-1.5 bg-indigo-900/40 border border-indigo-600/60 rounded-lg text-white font-bold">START: Mega-Event Created</div>
                <div className="text-zinc-600">&darr;</div>
                <div className="px-4 py-1.5 bg-[#141418] border border-white/5 rounded-lg">Multi-Domain Ingestion (Hotels + Transit + Venues + Demands)</div>
                <div className="text-zinc-600">&darr;</div>
                <div className="px-4 py-1.5 bg-indigo-950 border border-indigo-600/50 rounded-lg text-indigo-300 font-bold">AI / ML Prediction Engine (Calculates Capacity &amp; Crowd Risk)</div>
                <div className="text-zinc-600">&darr;</div>
                <div className="px-5 py-2 bg-amber-950/40 border border-amber-600/60 rounded-xl text-amber-300 font-bold">Is Risk High? [YES]</div>
                <div className="text-zinc-600">&darr;</div>
                <div className="px-6 py-2 bg-rose-950/40 border border-rose-600/60 rounded-xl text-rose-200 font-bold">
                  AI Recommendation Engine (Reroutes, Hotel Diversion, Staggered Gates)
                </div>
                <div className="text-zinc-600">&darr;</div>
                <div className="flex items-center space-x-6 text-xs">
                  <div className="px-3 py-1 bg-[#141418] rounded border border-white/5">Organizer Command Center</div>
                  <div className="px-3 py-1 bg-[#141418] rounded border border-white/5">Attendee Mobile App</div>
                </div>
                <div className="text-zinc-600">&darr;</div>
                <div className="px-4 py-1.5 bg-emerald-950/40 border border-emerald-600/50 rounded-lg text-emerald-300">
                  Continuous Prediction &amp; Adaptive Feedback Loop
                </div>
              </div>
            </div>
          )}

          {/* Diagram: System Architecture (Slide 6) */}
          {slide.content.diagramType === 'ARCHITECTURE' && (
            <div className="p-4 bg-[#0c0c0e] rounded-xl border border-white/5 font-mono-code text-xs text-zinc-300 overflow-x-auto space-y-2">
              <div className="text-indigo-400 font-bold mb-2">// 5-LAYER SYSTEM ARCHITECTURE (SLIDE 6)</div>
              <div className="grid grid-cols-1 gap-2">
                <div className="p-2.5 bg-[#121215] rounded border border-white/5">
                  <strong className="text-indigo-400 block mb-1">1. DATA SOURCE LAYER:</strong>
                  <span>Hotel Availability APIs &bull; Transport Telemetry &bull; Venue Concourse Sensors &bull; Event Schedules</span>
                </div>
                <div className="p-2.5 bg-[#121215] rounded border border-white/5">
                  <strong className="text-indigo-400 block mb-1">2. DATA PROCESSING &amp; ETL:</strong>
                  <span>Streaming Normalization &bull; Spatial GIS Indexing &bull; Real-time Demand Aggregators</span>
                </div>
                <div className="p-2.5 bg-[#121215] rounded border border-white/5">
                  <strong className="text-purple-400 block mb-1">3. AI / ML ENGINE:</strong>
                  <span>Crowd Density Forecast &bull; Saturation Probability (87%) &bull; Congestion Risk Scoring</span>
                </div>
                <div className="p-2.5 bg-[#121215] rounded border border-white/5">
                  <strong className="text-amber-400 block mb-1">4. RECOMMENDATION ENGINE:</strong>
                  <span>Bipartite Matching for Hotels &bull; Alternative Route Optimizer &bull; Crowd Redistribution</span>
                </div>
                <div className="p-2.5 bg-[#121215] rounded border border-white/5">
                  <strong className="text-emerald-400 block mb-1">5. APPLICATION TIER:</strong>
                  <span>Organizer Command Center (Web) &bull; Attendee Assistant (Mobile)</span>
                </div>
              </div>
            </div>
          )}

          {/* Table (e.g., Slide 8, Slide 16, Slide 17) */}
          {slide.content.table && (
            <div className="overflow-x-auto bg-[#0c0c0e] rounded-xl border border-white/5 p-3">
              <table className="w-full text-left text-xs font-mono-code">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-400 text-[11px]">
                    {slide.content.table.headers.map((h, i) => (
                      <th key={i} className="py-2 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-200">
                  {slide.content.table.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#16161a]">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Callout box */}
          {slide.content.callout && (
            <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 font-medium">
              &bull; {slide.content.callout}
            </div>
          )}
        </div>

        {/* Bottom Slide Bar Navigation */}
        <div className="mt-8 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-1 overflow-x-auto max-w-full pb-1">
            {HACKCELESTIAL_SLIDES.map((s, idx) => (
              <button
                key={s.slideNumber}
                id={`btn-slide-nav-${s.slideNumber}`}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-mono-code font-bold transition-all ${
                  currentSlideIndex === idx
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-[#0c0c0e] hover:bg-[#18181c] text-zinc-400 border border-white/5'
                }`}
                title={`Slide ${s.slideNumber}: ${s.title}`}
              >
                {s.slideNumber}
              </button>
            ))}
          </div>

          <div className="text-xs text-zinc-400 font-mono-code">
            Use &larr; / &rarr; to advance presentation
          </div>
        </div>
      </div>
    </div>
  );
};
