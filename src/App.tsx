import { useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CoreParameters from './pages/CoreParameters';
import StationFlow from './pages/StationFlow';
import ExportBible from './pages/ExportBible';
import { useBibleStore } from './lib/store';
import { pb } from './lib/pocketbase';
import { resolveRoomContext, loadProduction, saveProduction } from './lib/production';

export default function App() {
  const { activeNav, bible, roomCtx, activeRoomId, setIsSaving, setBible, setRoomCtx, setActiveRoomId } = useBibleStore();

  // SSO token handoff + resolve the venue's rooms, then load the active room's bible.
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
      }
      // Optional ?room= deep-link (forward-compatible with the dash launcher).
      const roomParam = params.get('room');
      window.history.replaceState({}, '', window.location.pathname);

      const resolved = await resolveRoomContext();
      if (!resolved) return; // not signed in / no venue → stays on the demo bible
      setRoomCtx(resolved);

      const room = resolved.rooms.find((r) => r.id === roomParam) ?? resolved.rooms[0] ?? null;
      if (room) {
        setActiveRoomId(room.id);
        setBible(await loadProduction(room));
      }
    }
    void initApp();
  }, [setRoomCtx, setActiveRoomId, setBible]);

  // Auto-save when navigating to the export page
  const persistBible = useCallback(async () => {
    if (!pb.authStore.isValid || !roomCtx || !activeRoomId) return;
    setIsSaving(true);
    try {
      await saveProduction(roomCtx, activeRoomId, bible);
    } catch (err) {
      console.warn('Production Bible Builder: save failed', err);
    } finally {
      setIsSaving(false);
    }
  }, [bible, roomCtx, activeRoomId, setIsSaving]);

  useEffect(() => {
    if (activeNav === 'export') {
      void persistBible();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNav]);

  // Show the landing page without the sidebar
  if (activeNav === 'landing') {
    return <LandingPage />;
  }

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
