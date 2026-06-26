import { AlertTriangle, CheckCircle, Clock, Users, DollarSign, Timer, TrendingUp, Layers, Zap, Shield } from 'lucide-react';
import { usePlaybookStore } from '../lib/store';
import { Station } from '../lib/types';

function RiskBadge({ risk }: { risk: Station['bottleneckRisk'] }) {
  const styles = {
    Low: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    Medium: 'bg-amber-950 text-amber-400 border-amber-800',
    High: 'bg-rose-950 text-rose-400 border-rose-800',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-mono font-medium ${styles[risk]}`}>
      {risk}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'slate',
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
}) {
  const accentMap: Record<string, string> = {
    slate: 'text-slate-400',
    rose: 'text-rose-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    sky: 'text-sky-400',
  };
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-medium mb-1">{label}</p>
          <p className="text-white text-2xl font-bold leading-none">{value}</p>
          {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
        </div>
        <Icon size={18} className={accentMap[accent] ?? 'text-slate-400'} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { playbook, setActiveNav } = usePlaybookStore();
  const { parameters, stations } = playbook;

  const conflicts = stations.filter(
    (s) => s.resetTimeMinutes >= parameters.dispatchIntervalMinutes
  );

  const totalResetBurden = stations.reduce((sum, s) => sum + s.resetTimeMinutes, 0);
  const highRisk = stations.filter((s) => s.bottleneckRisk === 'High').length;
  const mediumRisk = stations.filter((s) => s.bottleneckRisk === 'Medium').length;

  const overallHealth =
    conflicts.length === 0 && highRisk === 0
      ? 'OPTIMAL'
      : conflicts.length > 0 || highRisk > 1
      ? 'CRITICAL'
      : 'WARNING';

  const healthStyles = {
    OPTIMAL: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50',
    WARNING: 'text-amber-400 bg-amber-950/60 border-amber-700/50',
    CRITICAL: 'text-rose-400 bg-rose-950/60 border-rose-700/50',
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">{parameters.title}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{parameters.targetAudience}</p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold tracking-wider ${healthStyles[overallHealth]}`}
          >
            {overallHealth === 'OPTIMAL' ? (
              <CheckCircle size={15} />
            ) : (
              <AlertTriangle size={15} />
            )}
            PRODUCTION HEALTH: {overallHealth}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Total Runtime"
            value={`${parameters.totalDurationMinutes}m`}
            sub="target experience"
            icon={Timer}
            accent="sky"
          />
          <StatCard
            label="Dispatch Interval"
            value={`${parameters.dispatchIntervalMinutes}m`}
            sub="between groups"
            icon={Clock}
            accent="amber"
          />
          <StatCard
            label="Max Group Size"
            value={parameters.maxGroupSize}
            sub="players/group"
            icon={Users}
            accent="emerald"
          />
          <StatCard
            label="Budget Tier"
            value={parameters.budgetLevel.split('/')[0]}
            sub={parameters.budgetLevel}
            icon={DollarSign}
            accent="slate"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Total Stations"
            value={stations.length}
            sub="scenes in flow"
            icon={Layers}
            accent="sky"
          />
          <StatCard
            label="Reset Burden"
            value={`${totalResetBurden}m`}
            sub="total reset time"
            icon={TrendingUp}
            accent={totalResetBurden > parameters.totalDurationMinutes ? 'rose' : 'slate'}
          />
          <StatCard
            label="High Risk Stations"
            value={highRisk}
            sub={`+ ${mediumRisk} medium risk`}
            icon={Zap}
            accent={highRisk > 0 ? 'rose' : 'emerald'}
          />
        </div>

        {conflicts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-400" />
              <h2 className="text-rose-400 font-bold text-sm uppercase tracking-wider">
                Critical Operational Bottlenecks
              </h2>
              <span className="bg-rose-900/60 text-rose-300 text-xs px-2 py-0.5 rounded-full font-mono">
                {conflicts.length} FLAGGED
              </span>
            </div>
            {conflicts.map((s) => (
              <div
                key={s.id}
                className="bg-rose-950/40 border border-rose-700/60 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-bold text-sm">{s.title}</span>
                      <span className="text-slate-500 font-mono text-xs">Station {s.order}</span>
                    </div>
                    <p className="text-rose-200 text-sm">
                      <span className="font-bold text-rose-300">CRITICAL OPERATIONAL BOTTLENECK:</span>{' '}
                      <span className="font-semibold">"{s.title}"</span> requires{' '}
                      <span className="font-bold text-rose-300 bg-rose-900/60 px-1 rounded">
                        {s.resetTimeMinutes} min
                      </span>{' '}
                      to reset, but groups arrive every{' '}
                      <span className="font-bold text-rose-300 bg-rose-900/60 px-1 rounded">
                        {parameters.dispatchIntervalMinutes} min
                      </span>
                      . This will cause a queue backup and degrade every subsequent group's experience.
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span>Reset: <span className="text-rose-400 font-mono">{s.resetTimeMinutes}m</span></span>
                      <span>Dispatch: <span className="text-rose-400 font-mono">{parameters.dispatchIntervalMinutes}m</span></span>
                      <span>Overflow: <span className="text-rose-400 font-mono">+{s.resetTimeMinutes - parameters.dispatchIntervalMinutes}m per group</span></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {conflicts.length === 0 && (
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-400" />
            <div>
              <p className="text-emerald-300 font-semibold text-sm">No Operational Bottlenecks</p>
              <p className="text-slate-500 text-xs">
                All stations reset within the {parameters.dispatchIntervalMinutes}-minute dispatch window.
              </p>
            </div>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-slate-300 font-semibold text-sm flex items-center gap-2">
              <Shield size={14} className="text-slate-500" />
              Station Risk Matrix
            </h2>
            <button
              onClick={() => setActiveNav('station-flow')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Edit Stations →
            </button>
          </div>
          <div className="divide-y divide-slate-800/60">
            {stations.map((s) => {
              const isConflict = s.resetTimeMinutes >= parameters.dispatchIntervalMinutes;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-4 px-4 py-3 text-sm ${
                    isConflict ? 'bg-rose-950/20' : ''
                  }`}
                >
                  <span className="font-mono text-slate-600 text-xs w-6">{s.order}</span>
                  <span className="text-slate-300 flex-1 truncate">{s.title}</span>
                  <span className="font-mono text-xs text-slate-500 w-20 text-right">
                    reset: {s.resetTimeMinutes}m
                  </span>
                  <RiskBadge risk={s.bottleneckRisk} />
                  {isConflict && (
                    <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
