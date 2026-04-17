import { BookOpen, AlertTriangle, Copy, CheckCircle, BookMarked } from 'lucide-react';
import { useState } from 'react';
import { useBibleStore } from '../lib/store';
import { Station } from '../lib/types';

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className={`text-xs uppercase tracking-wider font-bold mb-2 ${accent}`}>{title}</h4>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function StationExport({ station, dispatchInterval }: { station: Station; dispatchInterval: number }) {
  const isConflict = station.resetTimeMinutes >= dispatchInterval;
  return (
    <div className="border border-slate-700/60 rounded-xl overflow-hidden mb-6 print:break-inside-avoid">
      <div className={`px-5 py-3 border-b border-slate-700/60 flex items-center justify-between ${isConflict ? 'bg-rose-950/30' : 'bg-slate-800/60'}`}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-500 text-xs">{String(station.order).padStart(2, '0')}</span>
          <h3 className="text-white font-bold text-base">{station.title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-0.5 rounded border font-mono ${
            station.bottleneckRisk === 'High'
              ? 'text-rose-400 border-rose-800 bg-rose-950/60'
              : station.bottleneckRisk === 'Medium'
              ? 'text-amber-400 border-amber-800 bg-amber-950/60'
              : 'text-emerald-400 border-emerald-800 bg-emerald-950/60'
          }`}>
            {station.bottleneckRisk} Risk
          </span>
          {isConflict && (
            <div className="flex items-center gap-1 text-rose-400 text-xs">
              <AlertTriangle size={12} />
              BOTTLENECK
            </div>
          )}
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/40">
        <div>
          <p className="text-violet-400/80 text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
            Storyteller Lens
          </p>
          {station.narrativeGoal && (
            <div className="mb-3">
              <p className="text-slate-500 text-xs mb-1">Narrative Goal</p>
              <p className="text-slate-300 text-xs leading-relaxed">{station.narrativeGoal}</p>
            </div>
          )}
          {station.puzzleMechanic && (
            <div className="mb-3">
              <p className="text-slate-500 text-xs mb-1">Puzzle Mechanic</p>
              <p className="text-slate-300 text-xs leading-relaxed">{station.puzzleMechanic}</p>
            </div>
          )}
          {station.hintSystem.filter(Boolean).length > 0 && (
            <div>
              <p className="text-slate-500 text-xs mb-1">Hints</p>
              <div className="space-y-1">
                {station.hintSystem.filter(Boolean).map((h, i) => (
                  <p key={i} className="text-slate-400 text-xs leading-relaxed">
                    <span className="text-violet-600 font-mono mr-1">H{i + 1}:</span>
                    {h}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-rose-400/80 text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
            Director Lens
          </p>
          {station.atmosphere && (
            <div className="mb-3">
              <p className="text-slate-500 text-xs mb-1">Atmosphere</p>
              <p className="text-slate-300 text-xs leading-relaxed">{station.atmosphere}</p>
            </div>
          )}
          {station.actorRole && (
            <div className="mb-3">
              <p className="text-slate-500 text-xs mb-1">Actor Role</p>
              <p className="text-slate-300 text-xs leading-relaxed">{station.actorRole}</p>
            </div>
          )}
          {station.actorBlocking && (
            <div className="mb-3">
              <p className="text-slate-500 text-xs mb-1">Blocking</p>
              <p className="text-slate-300 text-xs leading-relaxed">{station.actorBlocking}</p>
            </div>
          )}
          {station.flowControl && (
            <div>
              <p className="text-slate-500 text-xs mb-1">Flow Control</p>
              <p className="text-slate-300 text-xs leading-relaxed">{station.flowControl}</p>
            </div>
          )}
        </div>

        <div>
          <p className="text-emerald-400/80 text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Operations Lens
          </p>
          {station.techRequirements && (
            <div className="mb-3">
              <p className="text-slate-500 text-xs mb-1">Tech Requirements</p>
              <p className="text-slate-300 text-xs leading-relaxed">{station.techRequirements}</p>
            </div>
          )}
          <div className="mt-2 bg-slate-800/60 rounded-lg p-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Reset Time</span>
              <span className={`font-mono font-medium ${isConflict ? 'text-rose-400' : 'text-emerald-400'}`}>
                {station.resetTimeMinutes} min
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Risk Level</span>
              <span className={`font-mono font-medium ${
                station.bottleneckRisk === 'High' ? 'text-rose-400' :
                station.bottleneckRisk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {station.bottleneckRisk}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExportBible() {
  const { bible } = useBibleStore();
  const { parameters, stations } = bible;
  const [copied, setCopied] = useState(false);

  const conflicts = stations.filter(
    (s) => s.resetTimeMinutes >= parameters.dispatchIntervalMinutes
  );

  const handleCopy = () => {
    const text = JSON.stringify(bible, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookMarked size={20} className="text-slate-500" />
            <div>
              <h1 className="text-white text-xl font-bold">Production Bible Export</h1>
              <p className="text-slate-500 text-sm">Complete unified document — share with your full production team.</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
          >
            {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <BookOpen size={16} className="text-slate-500" />
              <h2 className="text-white text-2xl font-black tracking-tight">{parameters.title}</h2>
            </div>
            <p className="text-slate-500 text-sm mt-1">Production Bible — Confidential</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Section title="Target Audience" accent="text-slate-400">
              {parameters.targetAudience}
            </Section>
            <Section title="Total Runtime" accent="text-slate-400">
              {parameters.totalDurationMinutes} minutes
            </Section>
            <Section title="Dispatch Interval" accent="text-slate-400">
              Every {parameters.dispatchIntervalMinutes} minutes
            </Section>
            <Section title="Max Group Size" accent="text-slate-400">
              {parameters.maxGroupSize} players
            </Section>
            <Section title="Budget Tier" accent="text-slate-400">
              {parameters.budgetLevel}
            </Section>
            <Section title="Station Count" accent="text-slate-400">
              {stations.length} scenes
            </Section>
          </div>

          {conflicts.length > 0 && (
            <div className="mt-4 bg-rose-950/40 border border-rose-700/50 rounded-lg p-3">
              <p className="text-rose-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle size={12} />
                Unresolved Operational Conflicts ({conflicts.length})
              </p>
              {conflicts.map((s) => (
                <p key={s.id} className="text-rose-300 text-xs mb-1">
                  • Station {s.order} "{s.title}": {s.resetTimeMinutes}m reset vs {parameters.dispatchIntervalMinutes}m dispatch window (+{s.resetTimeMinutes - parameters.dispatchIntervalMinutes}m overflow)
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 mb-2">
          <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold px-1">
            Station Architecture — {stations.length} Scenes
          </h2>
        </div>

        {stations.map((station) => (
          <StationExport
            key={station.id}
            station={station}
            dispatchInterval={parameters.dispatchIntervalMinutes}
          />
        ))}

        <div className="border-t border-slate-800 pt-4 mt-4 text-xs text-slate-700 flex justify-between">
          <span>Generated by Production Bible Builder</span>
          <span className="font-mono">{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
