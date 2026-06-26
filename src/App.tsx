import { useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CoreParameters from './pages/CoreParameters';
import StationFlow from './pages/StationFlow';
import ExportPlaybook from './pages/ExportPlaybook';
import { usePlaybookStore } from './lib/store';
import { pb } from './lib/pocketbase';
import { resolveRoomContext, loadProduction, saveProduction } from './lib/production';

export default function App() {
  const { activeNav, playbook, roomCtx, activeRoomId, setIsSaving, setPlaybook, setRoomCtx, setActiveRoomId, setActiveNav } = usePlaybookStore();

  // SSO token handoff + resolve the venue's rooms, then load the active room's playbook.
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
      // A token means this is a dashboard launch, not an organic visit — drop the
      // user straight into the builder rather than the marketing landing page.
      if (token) setActiveNav('dashboard');

      // Optional ?room= deep-link (forward-compatible with the dash launcher).
      const roomParam = params.get('room');
      window.history.replaceState({}, '', window.location.pathname);

      const resolved = await resolveRoomContext();
      if (!resolved) return; // not signed in / no venue → stays on the demo playbook
      setRoomCtx(resolved);
      setActiveNav('dashboard'); // already authed (cookie session) → skip landing

      const room = resolved.rooms.find((r) => r.id === roomParam) ?? resolved.rooms[0] ?? null;
      if (room) {
        setActiveRoomId(room.id);
        setPlaybook(await loadProduction(room));
      }
    }
    void initApp();
  }, [setRoomCtx, setActiveRoomId, setPlaybook, setActiveNav]);

  // Auto-save when navigating to the export page
  const persistPlaybook = useCallback(async () => {
    if (!pb.authStore.isValid || !roomCtx || !activeRoomId) return;
    setIsSaving(true);
    try {
      await saveProduction(roomCtx, activeRoomId, playbook);
    } catch (err) {
      console.warn('Production Playbook Builder: save failed', err);
    } finally {
      setIsSaving(false);
    }
  }, [playbook, roomCtx, activeRoomId, setIsSaving]);

  useEffect(() => {
    if (activeNav === 'export') {
      void persistPlaybook();
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
        {activeNav === 'export' && <ExportPlaybook />}
      </main>
    </div>
  );
}
