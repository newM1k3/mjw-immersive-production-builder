import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Plus,
  Trash2,
  BookOpen,
  Film,
  Wrench,
  ChevronRight,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useBibleStore } from '../lib/store';
import { Station } from '../lib/types';

type EditorTab = 'story' | 'director' | 'ops';

function HintEditor({
  hints,
  onChange,
}: {
  hints: string[];
  onChange: (hints: string[]) => void;
}) {
  const update = (i: number, val: string) => {
    const next = [...hints];
    next[i] = val;
    onChange(next);
  };
  const add = () => onChange([...hints, '']);
  const remove = (i: number) => onChange(hints.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {hints.map((h, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="text-violet-500/60 text-xs font-mono pt-2.5 w-16 shrink-0">
            HINT {i + 1}
          </span>
          <textarea
            value={h}
            onChange={(e) => update(i, e.target.value)}
            rows={2}
            className="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-violet-600/60 transition-colors"
            placeholder="Enter hint text..."
          />
          <button
            onClick={() => remove(i)}
            className="mt-1.5 text-slate-600 hover:text-rose-400 transition-colors p-1"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="text-xs text-violet-500/70 hover:text-violet-400 transition-colors flex items-center gap-1 ml-16"
      >
        <Plus size={12} /> Add Hint
      </button>
    </div>
  );
}

function StorytellerTab({ station, update }: { station: Station; update: (u: Partial<Station>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-violet-400/80 text-xs uppercase tracking-wider font-semibold mb-1.5">
          Narrative Goal
        </label>
        <textarea
          value={station.narrativeGoal}
          onChange={(e) => update({ narrativeGoal: e.target.value })}
          rows={4}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-violet-600/60 transition-colors"
          placeholder="What must players understand, feel, or believe after this scene?"
        />
      </div>
      <div>
        <label className="block text-violet-400/80 text-xs uppercase tracking-wider font-semibold mb-1.5">
          Puzzle Mechanic
        </label>
        <textarea
          value={station.puzzleMechanic}
          onChange={(e) => update({ puzzleMechanic: e.target.value })}
          rows={4}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-violet-600/60 transition-colors"
          placeholder="Describe the core puzzle logic and player interaction model."
        />
      </div>
      <div>
        <label className="block text-violet-400/80 text-xs uppercase tracking-wider font-semibold mb-1.5">
          Hint System
        </label>
        <HintEditor hints={station.hintSystem} onChange={(hints) => update({ hintSystem: hints })} />
      </div>
    </div>
  );
}

function DirectorTab({ station, update }: { station: Station; update: (u: Partial<Station>) => void }) {
  const fields: { key: keyof Station; label: string; rows: number; placeholder: string }[] = [
    {
      key: 'atmosphere',
      label: 'Atmosphere',
      rows: 3,
      placeholder: 'Lighting, sound design, smell, temperature — the full sensory blueprint.',
    },
    {
      key: 'actorRole',
      label: 'Actor Role',
      rows: 2,
      placeholder: 'Character name, archetype, relationship to the narrative.',
    },
    {
      key: 'actorBlocking',
      label: 'Actor Blocking',
      rows: 3,
      placeholder: 'Entry position, movement constraints, cue-based behaviors, safe words.',
    },
    {
      key: 'flowControl',
      label: 'Flow Control',
      rows: 3,
      placeholder: 'How do you speed up slow groups? How do you slow down fast groups?',
    },
  ];

  return (
    <div className="space-y-5">
      {fields.map(({ key, label, rows, placeholder }) => (
        <div key={key}>
          <label className="block text-rose-400/80 text-xs uppercase tracking-wider font-semibold mb-1.5">
            {label}
          </label>
          <textarea
            value={station[key] as string}
            onChange={(e) => update({ [key]: e.target.value })}
            rows={rows}
            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-rose-700/60 transition-colors"
            placeholder={placeholder}
          />
        </div>
      ))}
    </div>
  );
}

function OperationsTab({
  station,
  update,
  dispatchInterval,
}: {
  station: Station;
  update: (u: Partial<Station>) => void;
  dispatchInterval: number;
}) {
  const isConflict = station.resetTimeMinutes >= dispatchInterval;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-emerald-400/80 text-xs uppercase tracking-wider font-semibold mb-1.5">
          Tech Requirements
        </label>
        <textarea
          value={station.techRequirements}
          onChange={(e) => update({ techRequirements: e.target.value })}
          rows={4}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-emerald-700/60 transition-colors"
          placeholder="Hardware, microcontrollers, software, props, sensors — everything a tech lead needs."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-emerald-400/80 text-xs uppercase tracking-wider font-semibold mb-1.5">
            Reset Time (minutes)
          </label>
          <input
            type="number"
            value={station.resetTimeMinutes}
            onChange={(e) => update({ resetTimeMinutes: Number(e.target.value) })}
            min={0}
            className={`w-full bg-slate-800/60 border rounded-lg px-3 py-2.5 text-sm font-mono text-slate-200 focus:outline-none transition-colors ${
              isConflict
                ? 'border-rose-700 focus:border-rose-500 text-rose-300'
                : 'border-slate-700 focus:border-emerald-700/60'
            }`}
          />
          {isConflict && (
            <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
              <AlertTriangle size={11} />
              Exceeds {dispatchInterval}m dispatch interval
            </p>
          )}
        </div>
        <div>
          <label className="block text-emerald-400/80 text-xs uppercase tracking-wider font-semibold mb-1.5">
            Bottleneck Risk
          </label>
          <select
            value={station.bottleneckRisk}
            onChange={(e) =>
              update({ bottleneckRisk: e.target.value as Station['bottleneckRisk'] })
            }
            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-700/60 transition-colors"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3 space-y-1.5 text-xs text-slate-500">
        <p className="text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
          <Clock size={12} className="text-emerald-500" />
          Operational Window Analysis
        </p>
        <div className="flex justify-between">
          <span>Global dispatch interval</span>
          <span className="font-mono text-slate-400">{dispatchInterval} min</span>
        </div>
        <div className="flex justify-between">
          <span>This station reset time</span>
          <span className={`font-mono ${isConflict ? 'text-rose-400' : 'text-emerald-400'}`}>
            {station.resetTimeMinutes} min
          </span>
        </div>
        <div className="flex justify-between border-t border-slate-700/40 pt-1.5">
          <span>Margin</span>
          <span
            className={`font-mono font-semibold ${
              isConflict ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {isConflict ? '-' : '+'}
            {Math.abs(dispatchInterval - station.resetTimeMinutes)} min
          </span>
        </div>
      </div>
    </div>
  );
}

function StationCard({
  station,
  isSelected,
  onSelect,
  dispatchInterval,
}: {
  station: Station;
  isSelected: boolean;
  onSelect: () => void;
  dispatchInterval: number;
}) {
  const { deleteStation } = useBibleStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: station.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isConflict = station.resetTimeMinutes >= dispatchInterval;

  const riskColors = {
    Low: 'text-emerald-400 bg-emerald-950/40',
    Medium: 'text-amber-400 bg-amber-950/40',
    High: 'text-rose-400 bg-rose-950/40',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border transition-all duration-150 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${
        isSelected
          ? 'border-slate-600 bg-slate-800/70 shadow-lg shadow-black/30'
          : isConflict
          ? 'border-rose-800/50 bg-rose-950/20 hover:border-rose-700/60'
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-center gap-3 px-3 py-3">
        <button
          {...attributes}
          {...listeners}
          className="text-slate-700 hover:text-slate-500 cursor-grab active:cursor-grabbing transition-colors shrink-0"
        >
          <GripVertical size={16} />
        </button>

        <span className="text-slate-600 font-mono text-xs w-5 shrink-0">{station.order}</span>

        <button className="flex-1 text-left min-w-0" onClick={onSelect}>
          <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
            {station.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${riskColors[station.bottleneckRisk]}`}>
              {station.bottleneckRisk} Risk
            </span>
            <span className="text-slate-600 text-xs font-mono">{station.resetTimeMinutes}m reset</span>
            {isConflict && <AlertTriangle size={11} className="text-rose-400" />}
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {isSelected && <ChevronRight size={14} className="text-slate-500" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteStation(station.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-rose-400 transition-all p-1"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StationFlow() {
  const { bible, addStation, updateStation, reorderStations } = useBibleStore();
  const { stations, parameters } = bible;
  const [selectedId, setSelectedId] = useState<string | null>(stations[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState<EditorTab>('story');

  const selectedStation = stations.find((s) => s.id === selectedId) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const fromIndex = stations.findIndex((s) => s.id === active.id);
      const toIndex = stations.findIndex((s) => s.id === over.id);
      reorderStations(fromIndex, toIndex);
    },
    [stations, reorderStations]
  );

  const update = useCallback(
    (updates: Partial<Station>) => {
      if (selectedId) updateStation(selectedId, updates);
    },
    [selectedId, updateStation]
  );

  const tabs: { id: EditorTab; label: string; icon: React.ElementType; color: string; activeColor: string; borderColor: string }[] = [
    {
      id: 'story',
      label: 'Storyteller',
      icon: BookOpen,
      color: 'text-slate-500 hover:text-violet-400',
      activeColor: 'text-violet-400',
      borderColor: 'border-violet-500',
    },
    {
      id: 'director',
      label: 'Director',
      icon: Film,
      color: 'text-slate-500 hover:text-rose-400',
      activeColor: 'text-rose-400',
      borderColor: 'border-rose-500',
    },
    {
      id: 'ops',
      label: 'Operations',
      icon: Wrench,
      color: 'text-slate-500 hover:text-emerald-400',
      activeColor: 'text-emerald-400',
      borderColor: 'border-emerald-500',
    },
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-80 shrink-0 border-r border-slate-800 bg-slate-950 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-slate-300 font-semibold text-sm">Station Flow</h2>
          <button
            onClick={() => {
              addStation();
              const newId = `station-${Date.now()}`;
              setTimeout(() => {
                const last = useBibleStore.getState().bible.stations.at(-1);
                if (last) setSelectedId(last.id);
              }, 50);
            }}
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={13} />
            Add Station
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={stations.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {stations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  isSelected={selectedId === station.id}
                  onSelect={() => setSelectedId(station.id)}
                  dispatchInterval={parameters.dispatchIntervalMinutes}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-slate-950">
        {selectedStation ? (
          <>
            <div className="border-b border-slate-800 px-6 py-4">
              <input
                value={selectedStation.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full bg-transparent text-white text-lg font-bold focus:outline-none placeholder-slate-700 border-b border-transparent focus:border-slate-600 transition-colors pb-0.5"
                placeholder="Station Title"
              />
              <p className="text-slate-600 text-xs mt-1 font-mono">
                Station {selectedStation.order} of {stations.length}
              </p>
            </div>

            <div className="flex border-b border-slate-800">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all ${
                      isActive
                        ? `${tab.activeColor} ${tab.borderColor}`
                        : `${tab.color} border-transparent`
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'story' && (
                <StorytellerTab station={selectedStation} update={update} />
              )}
              {activeTab === 'director' && (
                <DirectorTab station={selectedStation} update={update} />
              )}
              {activeTab === 'ops' && (
                <OperationsTab
                  station={selectedStation}
                  update={update}
                  dispatchInterval={parameters.dispatchIntervalMinutes}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-slate-600 text-sm">Select a station to begin editing</p>
              <p className="text-slate-700 text-xs mt-1">or create a new station in the left panel</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
