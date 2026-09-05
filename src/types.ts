export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ZoneData {
  id: string;
  name: string;
  code: string;
  category: 'STADIUM' | 'TRANSIT' | 'HOTEL_CLUSTER' | 'FAN_ZONE' | 'PERIPHERY';
  x: number; // percentage coordinate 0-100 on city map
  y: number;
  crowdDensity: number; // 0-100%
  transportUtilization: number; // 0-100%
  hotelOccupancy: number; // 0-100%
  venueUtilization: number; // 0-100%
  predictedDemand: number; // 0-100%
  currentVisitors: number;
  capacityLimit: number;
  totalHotels: number;
  availableRooms: number;
  avgRoomPrice: number;
  riskLevel: RiskLevel;
  criticalProbability30m: number;
  connectedZoneIds: string[];
  description: string;
}

export interface CityMetricKPIs {
  totalVisitors: number;
  hotelOccupancyPercent: number;
  transportUtilizationPercent: number;
  venueOccupancyPercent: number;
  cityPressureScore: number;
  activeIncidentsCount: number;
  staggerEfficiencyPercent: number;
}

export interface PredictionSnapshot {
  timeOffsetMin: number; // 0, 15, 30, 45, 60
  label: string;
  zonePressures: Record<string, {
    crowd: number;
    transport: number;
    hotel: number;
    risk: RiskLevel;
    probabilityCritical: number;
  }>;
  aiForecastSummary: string;
}

export interface RecommendationAction {
  id: string;
  title: string;
  category: 'HOTEL' | 'TRANSPORT' | 'CROWD' | 'VENUE';
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  problemStatement: string;
  aiDecision: string;
  recommendedAction: string;
  expectedResult: string;
  targetZoneIds: string[];
  executed: boolean;
  executedAt?: string;
}

export interface SystemAlert {
  id: string;
  zoneId: string;
  zoneName: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  metricTriggered: string;
  recommendedActionId: string;
}

export interface TransitRouteOption {
  id: string;
  name: string;
  mode: 'Metro' | 'Bus' | 'Shuttle' | 'Walk';
  travelTimeMin: number;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  capacityStatus: string;
  cost: string;
  steps: string[];
  whyRecommended: string;
  isAiRecommended: boolean;
}

export interface RecommendedHotel {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  occupancyPercent: number;
  availableRooms: number;
  pricePerNight: number;
  rating: number;
  transitConnection: string;
  perk: string;
  recommendedByAi: boolean;
}

export interface SimulationConfig {
  baseVisitors: number;
  surgeVisitors: number;
  shockEvent: string;
}

export interface SimulationResult {
  totalVisitors: number;
  bottlenecks: {
    area: string;
    status: 'CRITICAL' | 'SATURATED' | 'BALANCED' | 'UNDERUTILIZED';
    impact: string;
    loadPercent: number;
  }[];
  aiPlan: string[];
  metricsComparison: {
    beforeAI: {
      avgWaitTimeMin: number;
      congestionIndex: number;
      hotelSaturationPercent: number;
      incidentRisk: string;
    };
    afterAI: {
      avgWaitTimeMin: number;
      congestionIndex: number;
      hotelSaturationPercent: number;
      incidentRisk: string;
    };
  };
  summaryVerdict: string;
}

export interface PitchDeckSlide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  category: string;
  content: {
    heading?: string;
    points?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    quote?: string;
    diagramType?: 'FLOWCHART' | 'ARCHITECTURE' | 'COMPARISON' | 'HEATMAP' | 'METRICS';
    callout?: string;
  };
}
