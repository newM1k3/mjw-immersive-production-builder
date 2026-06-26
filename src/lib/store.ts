import { create } from 'zustand';
import { ProductionBible, ProjectParameters, Station } from './types';
import type { RoomContext } from './production';

const dummyBible: ProductionBible = {
  parameters: {
    id: 'proj-001',
    title: 'Project SkyHarvest',
    targetAudience: 'Adults 18+, horror enthusiasts, puzzle lovers',
    totalDurationMinutes: 75,
    dispatchIntervalMinutes: 8,
    maxGroupSize: 6,
    budgetLevel: 'Mid-Tier',
  },
  stations: [
    {
      id: 'station-001',
      order: 1,
      title: 'The Arrival — Silo Entry',
      narrativeGoal:
        'Establish dread and disorientation. Players learn they have stumbled upon an abandoned agricultural research facility. A radio broadcast (pre-recorded) cryptically warns them to "leave before the harvest begins."',
      puzzleMechanic:
        'Environmental storytelling puzzle. Players must find 3 faded access codes scattered across propaganda posters and a rotting logbook to unlock the inner silo door. No physical manipulation — observation-only.',
      hintSystem: [
        'Hint 1: Direct players to look at the year stamps on the posters.',
        'Hint 2: The logbook entry on page 7 contains the third digit highlighted in red ink.',
        'Hint 3: Full combination is displayed on the underside of the radio prop.',
      ],
      atmosphere:
        'Lighting: Single flickering sodium-vapor fixture overhead, warm amber-to-black cycle every 90 seconds. Sound: Low-frequency drone (40–60Hz) layered with distant mechanical clanking. Smell: Petrichor and damp hay diffuser placed behind the entry vent.',
      actorRole:
        'No actor in this room. Audio-only presence via the pre-recorded radio broadcast voice (The Overseer).',
      actorBlocking:
        'N/A — pure environmental. Ensure radio prop is facing the entry door so audio hits players immediately on entry.',
      flowControl:
        'Speed Up: The Overseer radio loop shortens to 30s intervals, increasing urgency. Slow Down: Game master activates "static break" audio that buys 45 seconds of ambient silence, allowing players to recalibrate.',
      techRequirements:
        'Raspberry Pi 3B+ running looped MP3 audio for radio broadcast. Lutron Caseta smart dimmer for flickering light effect. Keypad lock (Schlage BE365) on the inner door. Diffuser on a 90-second timer relay.',
      resetTimeMinutes: 4,
      bottleneckRisk: 'Low',
    },
    {
      id: 'station-002',
      order: 2,
      title: 'The Laboratory — Cold Storage',
      narrativeGoal:
        'Reveal the true horror: the facility was not growing crops — they were growing something else. Players discover a wall of specimen jars and a partially completed research journal that implies human experimentation. The narrative goal is to force a moral decision: proceed deeper or find an "escape" door (a false choice that locks behind them).',
      puzzleMechanic:
        'Multi-stage logic puzzle. Players must correctly sequence 5 specimen jars (labeled with dates and cryptic subject IDs) on a lighted shelf to match the research journal\'s "harvesting order." When correctly ordered, a UV blacklight embedded in the shelf activates, revealing a 4-digit code written on the wall in UV-reactive paint.',
      hintSystem: [
        'Hint 1: The research journal\'s index page lists subjects by "yield date" — this is your order.',
        'Hint 2: Subject "SH-04" appears twice in the journal. Use the FIRST occurrence.',
        'Hint 3: The code is already on the wall. You need to change the way you see the room.',
      ],
      atmosphere:
        'Lighting: Cold blue-white overhead fluorescents (4000K, full intensity) to contrast the warm entry. One tube flickers on a 45-second cycle. Sound: Refrigeration unit hum (authentic, sourced recording). A subtle ticking metronome sound at 60BPM to create subtle anxiety. Smell: Clean antiseptic/hospital diffuser blend.',
      actorRole:
        'Actor "The Subject" — crawls beneath the research table and can make scratching sounds or briefly reach out from under the tablecloth on GM cue.',
      actorBlocking:
        'Actor enters through the hidden panel on Stage Left when groups are mid-puzzle (approx 4 minutes in). Actor must NEVER stand — remains prone or crouched to maintain creature aesthetic. Safe word for actor discomfort: "Calibrate."',
      flowControl:
        'Speed Up: GM activates the UV light prematurely via hidden switch to guide eyes to the wall. Slow Down: Actor performs extended physical performance (slow crawl across the floor) to buy 60–90 seconds.',
      techRequirements:
        'Lighted shelf unit with 5 RFID-tagged pedestals and an Arduino Mega reading the tag sequence. UV blacklight strip embedded under the upper shelf lip, triggered by Arduino on correct sequence. Hidden panel (spring-loaded, 3/4" plywood). Research journal (custom printed, laminated, weather-distressed). Specimen jar props (resin casts with ethanol-safe dye).',
      resetTimeMinutes: 11,
      bottleneckRisk: 'High',
    },
    {
      id: 'station-003',
      order: 3,
      title: 'The Harvest Chamber — The Decision',
      narrativeGoal:
        'Climactic confrontation. Players discover the Overseer (the actor, now fully revealed) is not a villain — they are the last surviving researcher trying to STOP the automated harvest system. Players must choose to either shut down the system (cooperative ending) or extract the data drive and run (selfish ending). Both choices trigger different theatrical conclusions.',
      puzzleMechanic:
        'Dual-path physical puzzle. Path A (Shutdown): Players must simultaneously hold 4 pressure plates on different walls while a fifth player enters a 6-digit shutdown code. Requires all group members and true cooperation. Path B (Extract): Players find a hidden data drive behind a false panel opened by a combination they discovered in Station 2. Single player can complete this while others are distracted.',
      hintSystem: [
        'Hint 1 (for Path A): The shutdown code is the 6-digit subject ID of "SH-01" from the cold storage journal.',
        'Hint 2 (for Path A): All four plates must be held simultaneously — the system counts pressure events.',
        'Hint 3 (for Path B): The panel is where you\'d least expect to find something valuable. Think like a researcher hiding their work.',
      ],
      atmosphere:
        'Lighting: Red emergency lighting (100% red gels on all fixtures) with a strobing white light triggered when countdown timer reaches 2 minutes. Sound: Escalating industrial alarm, rising in pitch every 30 seconds. Smell: Subtle smoke/ozone from a haze machine (low output, never obscures vision). Temperature: HVAC drops 5 degrees Fahrenheit on room entry for visceral cold effect.',
      actorRole:
        'The Overseer — fully costumed (hazmat suit, damaged) center stage. Actor performs a pre-scripted monologue (~90 seconds) on group entry. Transitions to reactive performance: panicked, urgent, physically directing players toward the pressure plates.',
      actorBlocking:
        'Entry: Actor stands at Stage Right, facing away from players. Turns on first sound of players entering. Monologue position: Center, stationary. During puzzle: Actor moves freely but stays within the marked "play space" floor tape (never crosses the Red Line near the exit). Exit: Actor collapses dramatically when countdown reaches zero regardless of outcome.',
      flowControl:
        'Speed Up: Overseer actor directly hands players the shutdown code "as a dying act" — in-character delivery. Slow Down: Actor delivers extended backstory monologue, adding 90-120 seconds organically. Timer can also be paused remotely by GM (hidden 10-second hold button on control panel).',
      techRequirements:
        'Four FSR (Force Sensitive Resistor) pressure mats connected to Arduino Uno, wired to a central relay. Custom countdown timer display (7-segment LED, 6" digits). Red gel theatrical fixtures (4x PAR64). Fog/haze machine (Chauvet Hurricane 700). HVAC integration via smart thermostat relay. Actor comm earpiece for GM cues. Hidden panel with magnetic catch (Sugatsune HG-HB100).',
      resetTimeMinutes: 14,
      bottleneckRisk: 'High',
    },
    {
      id: 'station-004',
      order: 4,
      title: 'Debrief Corridor — The Aftermath',
      narrativeGoal:
        "Narrative denouement. Players walk a one-way corridor lined with \"newspaper clippings\" and \"government documents\" that retroactively contextualize the story. Each ending (Shutdown vs. Extract) has a different final document that either praises or condemns the players' choice. Emotional cooldown and world-building payoff.",
      puzzleMechanic:
        'No puzzle. Pure narrative delivery. Players are guided single-file through the corridor. The exit is a standard door, always unlocked.',
      hintSystem: ['N/A — no puzzle in this station.'],
      atmosphere:
        'Lighting: Warm, desaturated tungsten (2700K) to signal the experience is ending. Gradual increase in brightness as players near the exit. Sound: Sparse, mournful piano score (original composition). No ambient dread. Smell: Neutral — diffuser is off.',
      actorRole: 'No actor in this space.',
      actorBlocking: 'N/A',
      flowControl:
        'Speed Up: Corridor length is fixed at 40 feet. Throughput is self-regulating. Slow Down: N/A.',
      techRequirements:
        'Printed and framed document props (36 unique pieces, two sets — one per ending). Lighting on a simple dimmer. Bluetooth speaker for ambient music, triggered by a door-open sensor at the entry.',
      resetTimeMinutes: 2,
      bottleneckRisk: 'Low',
    },
  ],
};

interface BibleStore {
  bible: ProductionBible;
  activeNav: string;
  roomCtx: RoomContext | null;
  activeRoomId: string | null;
  isSaving: boolean;
  setActiveNav: (nav: string) => void;
  setBible: (bible: ProductionBible) => void;
  setRoomCtx: (ctx: RoomContext | null) => void;
  setActiveRoomId: (id: string | null) => void;
  setIsSaving: (saving: boolean) => void;
  updateParameters: (params: Partial<ProjectParameters>) => void;
  addStation: () => void;
  updateStation: (id: string, updates: Partial<Station>) => void;
  deleteStation: (id: string) => void;
  reorderStations: (fromIndex: number, toIndex: number) => void;
}

export const useBibleStore = create<BibleStore>((set) => ({
  bible: dummyBible,
  activeNav: 'landing',
  roomCtx: null,
  activeRoomId: null,
  isSaving: false,

  setActiveNav: (nav) => set({ activeNav: nav }),
  setBible: (bible) => set({ bible }),
  setRoomCtx: (roomCtx) => set({ roomCtx }),
  setActiveRoomId: (activeRoomId) => set({ activeRoomId }),
  setIsSaving: (isSaving) => set({ isSaving }),

  updateParameters: (params) =>
    set((state) => ({
      bible: {
        ...state.bible,
        parameters: { ...state.bible.parameters, ...params },
      },
    })),

  addStation: () =>
    set((state) => {
      const newOrder = state.bible.stations.length + 1;
      const newStation: Station = {
        id: `station-${Date.now()}`,
        order: newOrder,
        title: `Station ${newOrder} — Untitled`,
        narrativeGoal: '',
        puzzleMechanic: '',
        hintSystem: [''],
        atmosphere: '',
        actorRole: '',
        actorBlocking: '',
        flowControl: '',
        techRequirements: '',
        resetTimeMinutes: 5,
        bottleneckRisk: 'Low',
      };
      return {
        bible: {
          ...state.bible,
          stations: [...state.bible.stations, newStation],
        },
      };
    }),

  updateStation: (id, updates) =>
    set((state) => ({
      bible: {
        ...state.bible,
        stations: state.bible.stations.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      },
    })),

  deleteStation: (id) =>
    set((state) => {
      const filtered = state.bible.stations
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, order: i + 1 }));
      return { bible: { ...state.bible, stations: filtered } };
    }),

  reorderStations: (fromIndex, toIndex) =>
    set((state) => {
      const stations = [...state.bible.stations];
      const [moved] = stations.splice(fromIndex, 1);
      stations.splice(toIndex, 0, moved);
      const reordered = stations.map((s, i) => ({ ...s, order: i + 1 }));
      return { bible: { ...state.bible, stations: reordered } };
    }),
}));
