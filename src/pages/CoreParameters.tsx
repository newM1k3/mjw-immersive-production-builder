import { Settings } from 'lucide-react';
import { useBibleStore } from '../lib/store';
import { ProjectParameters } from '../lib/types';

function Field({
  label,
  sub,
  children,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-1">{label}</label>
      {sub && <p className="text-slate-600 text-xs mb-2">{sub}</p>}
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors';

export default function CoreParameters() {
  const { bible, updateParameters } = useBibleStore();
  const { parameters } = bible;

  const update = (key: keyof ProjectParameters, value: string | number) => {
    updateParameters({ [key]: value } as Partial<ProjectParameters>);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Settings size={18} className="text-slate-500" />
          <div>
            <h1 className="text-white text-xl font-bold">Core Parameters</h1>
            <p className="text-slate-500 text-sm">Global production constraints. These values drive all conflict analysis.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
          <div className="p-5 space-y-5">
            <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Production Identity</h2>
            <Field label="Production Title" sub="The working title of this immersive experience.">
              <input
                type="text"
                value={parameters.title}
                onChange={(e) => update('title', e.target.value)}
                className={inputCls}
                placeholder="e.g., Project SkyHarvest"
              />
            </Field>
            <Field label="Target Audience" sub="Age range, experience level, content sensitivities.">
              <input
                type="text"
                value={parameters.targetAudience}
                onChange={(e) => update('targetAudience', e.target.value)}
                className={inputCls}
                placeholder="e.g., Adults 18+, horror enthusiasts"
              />
            </Field>
            <Field label="Budget Tier" sub="Drives technology and material recommendations.">
              <select
                value={parameters.budgetLevel}
                onChange={(e) =>
                  update('budgetLevel', e.target.value as ProjectParameters['budgetLevel'])
                }
                className={inputCls}
              >
                <option value="Low-Tech/Durable">Low-Tech / Durable</option>
                <option value="Mid-Tier">Mid-Tier</option>
                <option value="High-Tech">High-Tech</option>
              </select>
            </Field>
          </div>

          <div className="p-5 space-y-5">
            <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Operational Parameters</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Total Duration (minutes)"
                sub="Target time for the full experience."
              >
                <input
                  type="number"
                  value={parameters.totalDurationMinutes}
                  onChange={(e) => update('totalDurationMinutes', Number(e.target.value))}
                  min={1}
                  className={inputCls + ' font-mono'}
                />
              </Field>
              <Field
                label="Max Group Size"
                sub="Maximum players dispatched together."
              >
                <input
                  type="number"
                  value={parameters.maxGroupSize}
                  onChange={(e) => update('maxGroupSize', Number(e.target.value))}
                  min={1}
                  className={inputCls + ' font-mono'}
                />
              </Field>
            </div>
            <Field
              label="Dispatch Interval (minutes)"
              sub="How often a new group enters the experience. This is the critical threshold for bottleneck detection."
            >
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={parameters.dispatchIntervalMinutes}
                  onChange={(e) => update('dispatchIntervalMinutes', Number(e.target.value))}
                  min={1}
                  className={inputCls + ' font-mono max-w-[120px]'}
                />
                <div className="flex-1 bg-slate-800/40 border border-slate-700/40 rounded-lg px-3 py-2 text-xs text-slate-500">
                  Any station with a reset time &ge;{' '}
                  <span className="text-amber-400 font-mono">{parameters.dispatchIntervalMinutes}m</span>{' '}
                  will trigger a critical conflict warning on the Dashboard.
                </div>
              </div>
            </Field>
          </div>
        </div>

        <div className="mt-4 bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 text-xs text-slate-500 space-y-1">
          <p className="text-slate-400 font-medium mb-2">Auto-save enabled</p>
          <p>Changes are applied immediately to the Zustand store and reflected across all views.</p>
          <p>In a production deployment, changes would sync to PocketBase on each field update.</p>
        </div>
      </div>
    </div>
  );
}
