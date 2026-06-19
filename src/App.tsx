import { useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CoreParameters from './pages/CoreParameters';
import StationFlow from './pages/StationFlow';
import ExportBible from './pages/ExportBible';
import { useBibleStore } from './lib/store';
import { pb, saveProject, loadProjects } from './lib/pocketbase';

export default function App() {
  const { activeNav, bible, setIsSaving, setSavedBibles } = useBibleStore();

  // SSO token handoff + load saved bibles on mount
  useEffect(() => {
    async function initApp() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        try {
          pb.authStore.save(token, null);
          await pb.collection('users').authRefresh();
        } catch {
          pb.authStore.clear();
        }
        window.history.replaceState({}, '', window.location.pathname);
      }

      const bibles = await loadProjects();
      setSavedBibles(bibles);
    }
    void initApp();
  }, [setSavedBibles]);

  // Auto-save when navigating to the export page
  const persistBible = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    setIsSaving(true);
    try {
      await saveProject(bible);
      const refreshed = await loadProjects();
      setSavedBibles(refreshed);
    } catch (err) {
      console.warn('Production Bible Builder: save failed', err);
    } finally {
      setIsSaving(false);
    }
  }, [bible, setIsSaving, setSavedBibles]);

  useEffect(() => {
    if (activeNav === 'export') {
      void persistBible();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNav]);

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
