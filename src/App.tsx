import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CoreParameters from './pages/CoreParameters';
import StationFlow from './pages/StationFlow';
import ExportBible from './pages/ExportBible';
import { useBibleStore } from './lib/store';

export default function App() {
  const { activeNav } = useBibleStore();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 flex overflow-hidden">
        {activeNav === 'dashboard' && <Dashboard />}
        {activeNav === 'parameters' && <CoreParameters />}
        {activeNav === 'station-flow' && <StationFlow />}
        {activeNav === 'export' && <ExportBible />}
      </main>
    </div>
  );
}
