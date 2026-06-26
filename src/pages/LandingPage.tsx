import { Skull, Zap, GitBranch, BookOpen, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { usePlaybookStore } from '../lib/store';

const features = [
  {
    icon: AlertTriangle,
    iconColor: 'text-rose-400',
    title: 'Bottleneck Detection',
    description:
      'Automatically flags every station whose reset time exceeds your dispatch interval — before a single group walks through the door.',
  },
  {
    icon: GitBranch,
    iconColor: 'text-emerald-400',
    title: 'Station Flow Architecture',
    description:
      'Map every scene with three professional lenses: Storyteller, Director, and Operations. Nothing falls through the cracks.',
  },
  {
    icon: BookOpen,
    iconColor: 'text-sky-400',
    title: 'Production Playbook Export',
    description:
      'Generate a complete, unified production document — ready to share with your full team, from tech leads to actors.',
  },
  {
    icon: Zap,
    iconColor: 'text-amber-400',
    title: 'Real-Time Conflict Analysis',
    description:
      'Every parameter change instantly recalculates risk across all stations. Your dashboard stays accurate as your design evolves.',
  },
];

const checklistItems = [
  'Narrative goal & puzzle mechanic per scene',
  'Actor blocking, atmosphere & flow control',
  'Tech requirements & reset time per station',
  'Hint system with tiered delivery',
  'Operational bottleneck risk matrix',
  'Full production document export (JSON + print)',
];

export default function LandingPage() {
  const { setActiveNav } = usePlaybookStore();

  const handleLaunch = () => {
    setActiveNav('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-y-auto">

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-900/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Skull className="text-rose-500" size={32} />
            <span className="text-slate-400 text-sm font-mono tracking-widest uppercase">
              ImmersiveKit Blueprint
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Build your{' '}
            <span className="text-rose-400">Production Playbook.</span>
            <br />
            Catch every bottleneck.
          </h1>

          <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            The Immersive Production Builder is a professional design tool for escape room creators and
            immersive experience producers. Plan station flow, detect operational conflicts, and export
            a complete production document — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLaunch}
              className="inline-flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-colors duration-150 text-base"
            >
              Start Building
              <ArrowRight size={18} />
            </button>
            <a
              href="https://www.immersivekit.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors duration-150 text-base"
            >
              Learn about ImmersiveKit
            </a>
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
          Everything your production team needs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={f.iconColor} size={22} />
                  <h3 className="font-semibold text-white text-base">{f.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── What's Covered ── */}
      <section className="px-6 py-16 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            A Production Playbook that covers every angle
          </h2>
          <p className="text-slate-400 mb-10">
            Every station you design captures six critical dimensions, giving your entire team —
            storytellers, directors, and operations staff — exactly what they need.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
            {checklistItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section className="px-6 py-16 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
          Built for escape room professionals
        </h2>
        <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto mb-12">
          Whether you are designing your first room or managing a multi-venue operation, the
          Immersive Production Builder gives you the structure to think clearly, communicate
          precisely, and operate without surprises.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Escape Room Designers', desc: 'Translate creative vision into an operational plan your whole team can execute.' },
            { label: 'Game Masters & Directors', desc: 'Get precise blocking, flow control, and hint delivery instructions for every scene.' },
            { label: 'Venue Operators', desc: 'Identify reset-time conflicts before they cause queue backups and degrade the guest experience.' },
          ].map((card) => (
            <div key={card.label} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2 text-sm">{card.label}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-xl mx-auto">
          <Skull className="text-rose-500 mx-auto mb-4" size={36} />
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to build?</h2>
          <p className="text-slate-400 mb-8">
            No account required. Start with the demo project and replace it with your own.
          </p>
          <button
            onClick={handleLaunch}
            className="inline-flex items-center gap-2 px-10 py-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-colors duration-150 text-base"
          >
            Open the Builder
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-slate-600 text-xs">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="https://www.immersivekit.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            ImmersiveKit
          </a>
          {' '}— Immersive Production Builder
        </p>
      </footer>
    </div>
  );
}
