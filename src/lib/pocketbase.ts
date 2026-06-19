import PocketBase from 'pocketbase';
import type { ProductionBible } from './types';

export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'https://immersive-kit.pockethost.io');

export interface SavedBibleMeta {
  id: string;          // PocketBase record ID
  externalId: string;  // ProductionBible.parameters.id
  title: string;
  savedAt: string;     // ISO string
  bible: ProductionBible;
}

export async function saveProject(bible: ProductionBible): Promise<string> {
  if (!pb.authStore.isValid) {
    throw new Error('Must be signed in to save projects');
  }

  const userId = pb.authStore.record?.id ?? '';
  const projectId = bible.parameters.id;

  try {
    const existing = await pb.collection('production_builder_projects').getFirstListItem(
      `external_id = "${projectId}" && user_id = "${userId}"`,
      { requestKey: null }
    );
    await pb.collection('production_builder_projects').update(existing.id, { payload: bible });
    return existing.id;
  } catch {
    const record = await pb.collection('production_builder_projects').create({
      external_id: projectId,
      user_id: userId,
      payload: bible,
      archived: false,
    });
    return record.id;
  }
}

export async function loadProjects(): Promise<SavedBibleMeta[]> {
  if (!pb.authStore.isValid) return [];

  const userId = pb.authStore.record?.id ?? '';

  try {
    const records = await pb.collection('production_builder_projects').getList(1, 20, {
      filter: `user_id = "${userId}" && (archived = false || archived = null)`,
      sort: '-updated',
      requestKey: null,
    });

    return records.items.map((r) => ({
      id: r.id,
      externalId: r['external_id'] as string,
      title: (r['payload'] as ProductionBible)?.parameters?.title ?? 'Untitled Production',
      savedAt: r['updated'] as string,
      bible: r['payload'] as ProductionBible,
    }));
  } catch {
    return [];
  }
}
