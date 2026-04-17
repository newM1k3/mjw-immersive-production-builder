export interface ProjectParameters {
  id: string;
  title: string;
  targetAudience: string;
  totalDurationMinutes: number;
  dispatchIntervalMinutes: number;
  maxGroupSize: number;
  budgetLevel: 'Low-Tech/Durable' | 'Mid-Tier' | 'High-Tech';
}

export interface Station {
  id: string;
  order: number;
  title: string;

  narrativeGoal: string;
  puzzleMechanic: string;
  hintSystem: string[];

  atmosphere: string;
  actorRole: string;
  actorBlocking: string;
  flowControl: string;

  techRequirements: string;
  resetTimeMinutes: number;
  bottleneckRisk: 'Low' | 'Medium' | 'High';
}

export interface ProductionBible {
  parameters: ProjectParameters;
  stations: Station[];
}

export type NavPage = 'dashboard' | 'parameters' | 'station-flow' | 'export';
