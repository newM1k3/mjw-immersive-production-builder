import { useState } from 'react';
import { LayoutDashboard, Settings, GitBranch, BookOpen, Skull, AlertTriangle, FolderOpen, Loader2 } from 'lucide-react';
import { useBibleStore } from '../lib/store';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, sub: 'Health & Conflicts' },
  { id: 'parameters', label: 'Core Parameters', icon: Settings, sub: 'Global Settings' },
  { id: 'station-flow', label: 'Station Flow', icon: GitBranch, sub: 'Scene Architecture' },
  { id: 'export', label: 'Export Bible', icon: BookOpen, sub: 'Full Production Doc' },
];

export default function Sidebar() {
  const { activeNav, setActiveNav, bible, savedBibles, isSaving, setBible } = useBibleStore();
  const [showLoadMenu, setShowLoadMenu] = useState(false);

  const conflictCount = bible.stations.filter(
    (s) => s.resetTimeMinutes >= bible.parameters.dispatchIntervalMinutes
  ).length;

  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5 mb-1">
          <Skull className="text-rose-500" size={20} />
          <span className="text-white font-bold text-sm tracking-widest uppercase">Production Bible</span>
        </div>
        <p className="text-slate-500 text-xs truncate pl-7">{bible.parameters.title}</p>
      </div>

      {conflictCount > 0 && (
        <div className="mx-3 mt-3 px-3 py-2 bg-rose-950/60 border border-rose-700/50 rounded-lg flex items-center gap-2">
          <AlertTriangle size={14} className="text-rose-400 shrink-0" />
          <span className="text-rose-300 text-xs font-medium">
            {conflictCount} operational {conflictCount === 1 ? 'conflict' : 'conflicts'} detected
          </span>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group flex items-center gap-3 ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon
                size={16}
                className={isActive ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-400'}
              />
              <div>
                <div className={`text-sm font-medium leading-tight ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 leading-tight">{item.sub}</div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-3">
        {savedBibles.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowLoadMenu((v) => !v)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-950/50 hover:bg-violet-950/80 border border-violet-700/40 text-violet-400 text-xs font-semibold transition-colors"
            >
              <FolderOpen size={12} />
              Load Saved ({savedBibles.length})
            </button>
            {showLoadMenu && (
              <div className="absolute bottom-full left-0 mb-1 w-full z-50 rounded-xl border border-slate-700 bg-slate-900 shadow-xl py-1">
                {savedBibles.map((meta) => (
                  <button
                    key={meta.id}
                    onClick={() => { setBible(meta.bible); setShowLoadMenu(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors"
                  >
                    <div className="text-xs text-white font-medium truncate">{meta.title || 'Untitled Production'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{new Date(meta.savedAt).toLocaleDateString()}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span>Stations</span>
            <span className="text-slate-400">{bible.stations.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Runtime</span>
            <span className="text-slate-400">{bible.parameters.totalDurationMinutes} min</span>
          </div>
          <div className="flex justify-between">
            <span>Dispatch</span>
            <span className="text-slate-400">/{bible.parameters.dispatchIntervalMinutes} min</span>
          </div>
          {isSaving && (
            <div className="flex items-center gap-1.5 text-slate-500 pt-1">
              <Loader2 size={10} className="animate-spin" />
              <span>Saving…</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
