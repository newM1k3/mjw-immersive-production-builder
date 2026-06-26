// production.ts — Immersive Production Builder on the unified spine (Phase 3).
//
// A production playbook is a room-scoped drawer (tool_key=production_builder, scope=room). The room
// is a platform `experiences` record, resolved via the user's org membership; its venue is the
// parent `projects` record. On a brand-new playbook the parameters are seeded from the room's Story
// (experiences.title/duration/capacity) so it never starts blank. Replaces the retired per-user
// `production_builder_projects` table.

import pb from './pocketbase';
import type { ProductionPlaybook, ProjectParameters } from './types';

type Rec = Record<string, unknown>;

/** A room the signed-in user can build a playbook for, plus its raw Story fields for seeding. */
export interface RoomOption {
  id: string; // experiences record id
  title: string;
  experience: Rec;
}

/** The user's venue + its rooms, resolved from org membership. */
export interface RoomContext {
  orgId: string;
  venueId: string;
  rooms: RoomOption[];
}

/**
 * Resolve the venue + rooms for the signed-in user: the first project under their first active
 * org membership, and that project's non-retired experiences. Mirrors the Corporate Proposal
 * Generator's resolveVenue, extended to return the rooms (room-scoped tools pick one).
 */
export async function resolveRoomContext(): Promise<RoomContext | null> {
  if (!pb.authStore.isValid) return null;
  const uid = pb.authStore.record?.id;
  if (!uid) return null;

  const memberships = await pb.collection('memberships').getFullList({
    filter: `user = '${uid}' && status = 'active'`,
    requestKey: null,
  });
  for (const m of memberships) {
    const orgId = m.organization as string;
    const projects = await pb.collection('projects').getFullList({
      filter: `organization = '${orgId}'`,
      requestKey: null,
    });
    const venue = projects[0];
    if (!venue) continue;

    const exps = await pb.collection('experiences').getFullList({
      filter: `project = '${venue.id}' && status != 'retired'`,
      requestKey: null,
    });
    const rooms: RoomOption[] = exps.map((e) => ({
      id: e.id as string,
      title: (e.title as string) || 'Untitled Room',
      experience: e as Rec,
    }));
    return { orgId, venueId: venue.id, rooms };
  }
  return null;
}

/** Seed a fresh production playbook from a room's Story so it never starts blank. */
export function seedFromRoom(e: Rec): ProductionPlaybook {
  const parameters: ProjectParameters = {
    id: `proj-${Date.now()}`,
    title: (e.title as string) ?? '',
    targetAudience: '',
    totalDurationMinutes: (e.duration_minutes as number) || 75,
    dispatchIntervalMinutes: 8,
    maxGroupSize: (e.capacity_max as number) || 6,
    budgetLevel: 'Mid-Tier',
  };
  return { parameters, stations: [] };
}

/**
 * Load the room's production-playbook drawer, or a Story-seeded blank if none exists yet.
 * One drawer per room (tool_key=production_builder, scope=room).
 */
export async function loadProduction(room: RoomOption): Promise<ProductionPlaybook> {
  try {
    const rec = await pb.collection('drawers').getFirstListItem(
      `tool_key = 'production_builder' && room = '${room.id}'`,
      { requestKey: null },
    );
    return rec.data as ProductionPlaybook;
  } catch {
    return seedFromRoom(room.experience);
  }
}

/** Upsert the room's production-playbook drawer (one row per room). Returns the drawer record id. */
export async function saveProduction(ctx: RoomContext, roomId: string, playbook: ProductionPlaybook): Promise<string> {
  if (!pb.authStore.isValid) throw new Error('Must be signed in to save');

  const body = {
    tool_key: 'production_builder',
    scope_type: 'room',
    organization: ctx.orgId,
    venue: ctx.venueId,
    room: roomId,
    title: playbook.parameters.title || 'Untitled Production',
    data: { ...playbook },
    status: 'active',
  };

  let existingId: string | null = null;
  try {
    const existing = await pb.collection('drawers').getFirstListItem(
      `tool_key = 'production_builder' && room = '${roomId}'`,
      { requestKey: null },
    );
    existingId = existing.id;
  } catch {
    existingId = null; // no drawer for this room yet
  }

  if (existingId) {
    await pb.collection('drawers').update(existingId, body, { requestKey: null });
    return existingId;
  }
  const created = await pb.collection('drawers').create({ ...body, version: 1 }, { requestKey: null });
  return created.id;
}
