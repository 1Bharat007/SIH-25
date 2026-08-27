import {
  QueuedSyncAction,
  enqueueSyncAction,
  getPendingSyncActions,
  updateSyncAction,
  removeSyncAction,
} from '../lib/indexed-db';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface SyncFlushResult {
  total: number;
  synced: number;
  failed: number;
  items: {
    id: string;
    actionType: string;
    success: boolean;
    error?: string;
  }[];
}

export async function queueOfflineSOS(payload: Record<string, unknown>): Promise<QueuedSyncAction> {
  return enqueueSyncAction({
    actionType: 'SOS_DISPATCH',
    endpoint: `${API_BASE}/safety/sos`,
    payload,
  });
}

export async function queueOfflineChatQuery(payload: Record<string, unknown>): Promise<QueuedSyncAction> {
  return enqueueSyncAction({
    actionType: 'CHAT_QUERY',
    endpoint: `${API_BASE}/chat/message`,
    payload,
  });
}

export async function queueOfflineBookmark(payload: Record<string, unknown>): Promise<QueuedSyncAction> {
  return enqueueSyncAction({
    actionType: 'PLACE_BOOKMARK',
    endpoint: `${API_BASE}/places/bookmark`,
    payload,
  });
}

export async function flushSyncQueue(): Promise<SyncFlushResult> {
  const pending = await getPendingSyncActions();
  const result: SyncFlushResult = {
    total: pending.length,
    synced: 0,
    failed: 0,
    items: [],
  };

  if (pending.length === 0) {
    return result;
  }

  for (const action of pending) {
    // Mark as syncing
    action.status = 'syncing';
    await updateSyncAction(action);

    try {
      const res = await fetch(action.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Offline-Queued-At': action.timestamp,
        },
        body: JSON.stringify(action.payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }

      // Success: Remove from queue
      await removeSyncAction(action.id);
      result.synced += 1;
      result.items.push({
        id: action.id,
        actionType: action.actionType,
        success: true,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown network failure';
      action.status = 'failed';
      action.retryCount += 1;
      action.errorMessage = errorMsg;
      await updateSyncAction(action);

      result.failed += 1;
      result.items.push({
        id: action.id,
        actionType: action.actionType,
        success: false,
        error: errorMsg,
      });
    }
  }

  return result;
}
