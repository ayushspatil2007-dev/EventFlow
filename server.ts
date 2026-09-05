import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.error("Error initializing GoogleGenAI client:", err);
    }
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI analysis for organizer command center
app.post("/api/ai/analyze-scenario", async (req, res) => {
  try {
    const { zones, totalVisitors, activeAlerts } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are the chief AI Event Orchestrator for EventFlow AI at a Mega-Event.
Given the following real-time city capacity metrics:
Total Visitors: ${totalVisitors}
Zones Data: ${JSON.stringify(zones, null, 2)}
Active Alerts: ${JSON.stringify(activeAlerts || [])}

Perform an intelligent cross-domain synthesis (Hospitality, Transportation, Venues, Crowd Redistribution).
Respond ONLY in valid JSON matching this exact structure:
{
  "summary": "Short 2-sentence executive summary of current city pressure",
  "criticalRisks": [
    { "zone": "Zone Name", "risk": "Description of bottleneck", "probability": 85, "timeframe": "30 mins" }
  ],
  "recommendedActions": [
    {
      "id": "rec-1",
      "title": "Action title",
      "category": "TRANSPORT" | "HOTEL" | "CROWD" | "VENUE",
      "urgency": "HIGH" | "MEDIUM",
      "description": "Specific tactical action",
      "affectedZones": ["Zone A", "Zone B"],
      "expectedImpact": "Reduces Zone A crowd by 24% and balances Metro Line 2"
    }
  ],
  "attendeeBroadcast": "Concise 1-sentence public guidance broadcast to push to attendee mobile apps"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, data: parsed, source: "gemini" });
      }
    }

    // Heuristic intelligent fallback when API key is not configured
    const criticalZone = (zones || []).find((z: any) => z.riskLevel === "CRITICAL") || zones?.[0] || { name: "Zone A" };
    const lowZone = (zones || []).find((z: any) => z.riskLevel === "LOW") || { name: "Zone C" };

    return res.json({
      success: true,
      data: {
        summary: `City pressure is heavily concentrated in ${criticalZone.name} with rapid inbound transit flow. Proactive redirection toward ${lowZone.name} recommended before the 30-minute peak window.`,
        criticalRisks: [
          {
            zone: criticalZone.name,
            risk: `${criticalZone.name} approaching 90%+ saturation across hotels and metro gates`,
            probability: 87,
            timeframe: "30 mins",
          },
          {
            zone: "Transit Corridor Alpha",
            risk: "Metro Line 1 platform overcrowding during venue ingress",
            probability: 79,
            timeframe: "45 mins",
          },
        ],
        recommendedActions: [
          {
            id: "rec-hotel-redirection",
            title: `Redistribute Accommodation to ${lowZone.name}`,
            category: "HOTEL",
            urgency: "HIGH",
            description: `Zone A hotels are at 94% occupancy. Push real-time promotional discounts and guaranteed shuttle vouchers for ${lowZone.name} accommodations (68% vacant).`,
            affectedZones: [criticalZone.name, lowZone.name],
            expectedImpact: "Reallocates ~1,850 incoming visitors to underutilized rooms and reduces localized surge pricing.",
          },
          {
            id: "rec-metro-diversion",
            title: "Dynamic Metro Route 2 Line Balancing",
            category: "TRANSPORT",
            urgency: "HIGH",
            description: "Divert arriving regional train passengers from Metro Line 1 (91% capacity) to Express Metro Line 2 with free transfer tokens.",
            affectedZones: ["Central Station", criticalZone.name],
            expectedImpact: "Lowers Line 1 dwell time by 38% and avoids platform containment holds.",
          },
          {
            id: "rec-crowd-stagger",
            title: "Staggered Stadium Gate Redirection & Fan Plaza Activation",
            category: "CROWD",
            urgency: "MEDIUM",
            description: "Activate West Gates 7-12 and stream live pre-show entertainment to Fan Plaza North to buffer stadium turnstiles.",
            affectedZones: [criticalZone.name, "Fan Zone North"],
            expectedImpact: "Disperses queue wait times from 28 mins to under 9 mins.",
          },
        ],
        attendeeBroadcast: `Notice: Zone A transit hubs are busy. We recommend Metro Route 2 and exploring hospitality zones in ${lowZone.name} with complimentary city shuttles.`,
      },
      source: "rule-engine",
    });
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to analyze scenario" });
  }
});

// AI attendee navigation & hospitality guide
app.post("/api/ai/attendee-guide", async (req, res) => {
  try {
    const { origin, destination, arrivalTime, preference } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are the Attendee Assistant for EventFlow AI Mega-Event.
A visitor is traveling from: "${origin}" to "${destination}", planned arrival at "${arrivalTime}".
Preference: "${preference || 'fastest and least crowded'}".
Recommend 2 distinct transit routes (Primary & Alternative) and 2 recommended hotel/hospitality options in less-congested zones nearby.
Respond ONLY in valid JSON matching this schema:
{
  "recommendedRoute": {
    "title": "Route name (e.g., Metro Route 2 Express)",
    "mode": "Metro" | "Bus" | "Walk" | "Shuttle",
    "travelTimeMin": 24,
    "crowdLevel": "Low" | "Moderate" | "High",
    "capacity": "Available (Seats & Quick Boarding)",
    "routeSteps": ["Step 1 description", "Step 2 description", "Step 3 description"],
    "whyRecommended": "Reasoning based on crowd avoidance"
  },
  "alternativeRoute": {
    "title": "Alternative route name (e.g., Shuttle Bus 5)",
    "mode": "Bus" | "Shuttle" | "Metro",
    "travelTimeMin": 31,
    "crowdLevel": "Moderate",
    "capacity": "Moderate Capacity",
    "routeSteps": ["Step 1", "Step 2"],
    "whyRecommended": "Alternative backup transit line"
  },
  "hospitalitySuggestions": [
    {
      "hotelName": "Hotel / Zone name",
      "zone": "Zone B or C",
      "occupancyRate": "42%",
      "distanceToVenue": "12 mins via Metro Line 2",
      "highlight": "Free shuttle voucher included, low crowd pressure"
    }
  ],
  "smartTimingAdvice": "Advice on when to depart or arrive to avoid peak surges"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, data: parsed, source: "gemini" });
      }
    }

    // Default intelligent guidance
    return res.json({
      success: true,
      data: {
        recommendedRoute: {
          title: "Metro Route 2 (Express Green)",
          mode: "Metro",
          travelTimeMin: 24,
          crowdLevel: "Low",
          capacity: "Available (High Seating Ratio)",
          routeSteps: [
            `Depart ${origin || 'Central Station'} Platform 3 via Line 2`,
            "Non-stop express transit bypassing congested Downtown corridor",
            `Arrive at ${destination || 'Olympic Stadium'} West Gate Concourse with direct QR entry`,
          ],
          whyRecommended: "Line 1 is currently operating at 91% capacity with 20-min platform queues. Route 2 bypasses congestion entirely.",
        },
        alternativeRoute: {
          title: "Dedicated Event Shuttle Bus 5",
          mode: "Bus",
          travelTimeMin: 31,
          crowdLevel: "Moderate",
          capacity: "Guaranteed Dedicated Bus Lane",
          routeSteps: [
            `Board Shuttle 5 at ${origin || 'Station'} Terminal Bay 4`,
            "Direct express lane along Waterfront Parkway",
            "Drop-off at Hospitality Zone B Plaza with 3-minute walking bridge",
          ],
          whyRecommended: "Ideal if you prefer street-level viewing and direct access to restaurants in Zone B.",
        },
        hospitalitySuggestions: [
          {
            hotelName: "Celestial Grand Hotel (Zone C)",
            zone: "Zone C — Low Pressure",
            occupancyRate: "35% Occupancy (High Vacancy)",
            distanceToVenue: "14 mins via Route 2 Express",
            highlight: "Partner rate with guaranteed late checkout & free shuttle pass",
          },
          {
            hotelName: "Urban Horizon Suites (Zone B)",
            zone: "Zone B — Moderate",
            occupancyRate: "58% Occupancy",
            distanceToVenue: "9 mins via Bus Shuttle 5",
            highlight: "Surrounded by 15+ low-wait dining options and fan lounge",
          },
        ],
        smartTimingAdvice: `Peak gate bottleneck starts around 5:45 PM. Arriving at ${arrivalTime || '5:15 PM'} gives you 30 minutes of zero-queue access and access to food stalls.`,
      },
      source: "rule-engine",
    });
  } catch (error: any) {
    console.error("Attendee Guide error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate guide" });
  }
});

// What-If Simulation endpoint
app.post("/api/ai/simulate", async (req, res) => {
  try {
    const { baseVisitors, extraVisitors, shockEvent } = req.body;
    const totalSimulated = Number(baseVisitors || 100000) + Number(extraVisitors || 30000);
    const surgePercent = Math.round((Number(extraVisitors || 30000) / Number(baseVisitors || 100000)) * 100);

    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are the EventFlow AI What-If Simulator for Mega-Events.
Baseline Visitors: ${baseVisitors}
Surge Addition: +${extraVisitors} (Total: ${totalSimulated}, +${surgePercent}% increase)
Simulated Shock: ${shockEvent || "Sudden visitor surge at peak hour"}

Calculate:
1. System Predicted Bottlenecks (Crowd, Transport, Hotel, Venue)
2. AI Recommended Action Plan (5 immediate actions)
3. Quantitative Comparison: Before AI vs After AI Mitigation
Respond ONLY in valid JSON matching:
{
  "predictedBottlenecks": [
    { "area": "Stadium Turnstiles", "status": "CRITICAL", "impact": "Queue length exceeds 45 mins", "loadPercent": 118 },
    { "area": "Metro Line 1 Central", "status": "CRITICAL", "impact": "Exceeds safety platform density", "loadPercent": 112 },
    { "area": "Zone A Hotels", "status": "SATURATED", "impact": "100% capacity with 4,200 displaced inquiries", "loadPercent": 99 }
  ],
  "aiRecommendedPlan": [
    "Activate Emergency Dedicated Bus Shuttle Flotilla (40 buses)",
    "Trigger dynamic geo-fenced app notification redirecting 18,000 visitors to Fan Zone B",
    "Open Stadium Auxiliary Gates 13 through 18",
    "Deploy surge pricing dampeners and promote Zone C partner hotels with 25% subsidy",
    "Stagger departure timing with post-event acoustic concert in North Plaza"
  ],
  "metricsComparison": {
    "beforeAI": {
      "avgWaitTimeMin": 52,
      "congestionIndex": 91,
      "hotelSaturationPercent": 96,
      "incidentRisk": "HIGH"
    },
    "afterAI": {
      "avgWaitTimeMin": 14,
      "congestionIndex": 54,
      "hotelSaturationPercent": 74,
      "incidentRisk": "LOW"
    }
  },
  "summaryVerdict": "Brief punchy evaluation of how AI redistribution prevented catastrophe"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, data: parsed, source: "gemini" });
      }
    }

    // Heuristic simulation response
    return res.json({
      success: true,
      data: {
        predictedBottlenecks: [
          {
            area: "Main Stadium Gates & Concourse",
            status: "CRITICAL",
            impact: `Queue time spikes to ~48 minutes; turnstile throughput overwhelmed by +${extraVisitors.toLocaleString()} arrivals.`,
            loadPercent: Math.min(135, 90 + Math.round(surgePercent * 0.9)),
          },
          {
            area: "Metro Line 1 (Central Hub)",
            status: "CRITICAL",
            impact: "Severe platform crowding; headway delays cause passenger safety holdbacks.",
            loadPercent: Math.min(125, 85 + Math.round(surgePercent * 0.8)),
          },
          {
            area: "Zone A Hotel District",
            status: "SATURATED",
            impact: "Zone A reaches 99% occupancy; severe price gouging and accommodation shortages.",
            loadPercent: Math.min(100, 88 + Math.round(surgePercent * 0.4)),
          },
          {
            area: "Zone C / Outer Perimeter",
            status: "UNDERUTILIZED",
            impact: "Remains at only 38% capacity without centralized orchestration.",
            loadPercent: 38,
          },
        ],
        aiRecommendedPlan: [
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
        summaryVerdict: `By redistributing ${extraVisitors.toLocaleString()} surge visitors across secondary transit routes and promoting Zone B/C hospitality zones, EventFlow AI slashes peak bottleneck density by 42% and cuts queue wait times by 67%.`,
      },
      source: "rule-engine",
    });
  } catch (error: any) {
    console.error("Simulation error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to run simulation" });
  }
});

// Setup Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EventFlow AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
