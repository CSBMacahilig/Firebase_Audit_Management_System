import { auth } from '../firebase';
import type {
  ActivityLogItem,
  AuditEngagement,
  AuditFile,
  AuditFinding,
  IssueRegisterItem,
  TimelineActivity,
  UniverseEntity,
  UserProfile,
  WorkingNote,
} from '../data/auditData';

export interface SqlConnectStatus {
  configured: boolean;
  engine: 'postgres' | 'mssql' | 'mysql' | 'http' | null;
  mode: 'sync' | 'primary';
}

let cachedStatus: { uid: string; status: SqlConnectStatus; checkedAt: number } | null = null;
let inflightStatus: Promise<SqlConnectStatus> | null = null;
const UNCONFIGURED_RETRY_MS = 5000;

async function getBearerHeaders(): Promise<Record<string, string> | null> {
  const user = auth.currentUser;
  if (!user) return null;
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export function clearSqlStatusCache(): void {
  cachedStatus = null;
  inflightStatus = null;
}

export async function getSqlConnectStatus(): Promise<SqlConnectStatus> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    return { configured: false, engine: null, mode: 'sync' };
  }
  if (
    cachedStatus &&
    cachedStatus.uid === uid &&
    (cachedStatus.status.configured || Date.now() - cachedStatus.checkedAt < UNCONFIGURED_RETRY_MS)
  ) {
    return cachedStatus.status;
  }
  if (inflightStatus) {
    return inflightStatus;
  }

  inflightStatus = (async () => {
    try {
      const headers = await getBearerHeaders();
      if (!headers) return { configured: false, engine: null, mode: 'sync' as const };
      const res = await fetch('/api/sql/status', { headers });
      if (!res.ok) return { configured: false, engine: null, mode: 'sync' as const };
      const status = (await res.json()) as SqlConnectStatus;
      cachedStatus = { uid, status, checkedAt: Date.now() };
      return status;
    } catch {
      return { configured: false, engine: null, mode: 'sync' as const };
    } finally {
      inflightStatus = null;
    }
  })();

  return inflightStatus;
}

async function requestSqlApi<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: unknown
): Promise<T> {
  const headers = await getBearerHeaders();
  if (!headers) {
    throw new Error('Authentication required for SQL Connect.');
  }
  const res = await fetch(path, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const errPayload = await res.json().catch(() => ({}));
    throw new Error(
      typeof errPayload?.error === 'string'
        ? errPayload.error
        : `SQL Connect API error (${res.status}).`
    );
  }
  return (await res.json()) as T;
}

export async function mirrorSqlWrite(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: unknown
): Promise<void> {
  const status = await getSqlConnectStatus();
  if (!status.configured) return;
  try {
    await requestSqlApi(path, method, body);
  } catch (err) {
    if (status.mode === 'primary') {
      throw err;
    }
    console.warn('SQL Connect background sync warning:', err);
  }
}

export async function fetchSqlWorkspace(): Promise<{
  engagements: AuditEngagement[];
  issues: IssueRegisterItem[];
  universe: UniverseEntity[];
  userProfiles: UserProfile[];
  frequencies: { high: number; medium: number; low: number };
}> {
  return requestSqlApi('/api/sql/workspace', 'GET');
}

export async function fetchSqlMasterData<T>(key: string): Promise<T | null> {
  const res = await requestSqlApi<{ value: T | null }>(
    `/api/sql/master-data/${encodeURIComponent(key)}`,
    'GET'
  );
  return res.value ?? null;
}

export async function syncSnapshotToSql(snapshot: {
  engagements?: AuditEngagement[];
  issues?: IssueRegisterItem[];
  universe?: UniverseEntity[];
  userProfiles?: UserProfile[];
  systemUsers?: Array<Record<string, unknown>>;
  frequencies?: { high: number; medium: number; low: number };
  masterData?: Record<string, unknown>;
}): Promise<{ syncedCount: number }> {
  return requestSqlApi('/api/sql/sync-from-workspace', 'POST', snapshot);
}

export const sqlMirrorHelpers = {
  upsertEngagement: (eng: AuditEngagement) =>
    mirrorSqlWrite(`/api/sql/engagements/${encodeURIComponent(eng.id)}`, 'PUT', eng),
  upsertWorkingNote: (engagementId: string, note: WorkingNote) =>
    mirrorSqlWrite(
      `/api/sql/engagements/${encodeURIComponent(engagementId)}/working-notes/${encodeURIComponent(note.id)}`,
      'PUT',
      note
    ),
  upsertFinding: (engagementId: string, finding: AuditFinding) =>
    mirrorSqlWrite(
      `/api/sql/engagements/${encodeURIComponent(engagementId)}/findings/${encodeURIComponent(finding.id)}`,
      'PUT',
      finding
    ),
  upsertTimelineActivity: (engagementId: string, activity: TimelineActivity) =>
    mirrorSqlWrite(
      `/api/sql/engagements/${encodeURIComponent(engagementId)}/timeline/${encodeURIComponent(activity.id)}`,
      'PUT',
      activity
    ),
  insertFile: (engagementId: string, file: AuditFile) =>
    mirrorSqlWrite(
      `/api/sql/engagements/${encodeURIComponent(engagementId)}/files`,
      'POST',
      file
    ),
  insertActivityLog: (engagementId: string, log: ActivityLogItem) =>
    mirrorSqlWrite(
      `/api/sql/engagements/${encodeURIComponent(engagementId)}/activity-log`,
      'POST',
      log
    ),
  upsertIssue: (issue: IssueRegisterItem) =>
    mirrorSqlWrite(`/api/sql/issues/${encodeURIComponent(issue.id)}`, 'PUT', issue),
  upsertUniverseEntity: (entity: UniverseEntity) =>
    mirrorSqlWrite(`/api/sql/universe/${encodeURIComponent(entity.id)}`, 'PUT', entity),
  deleteUniverseEntity: (id: string) =>
    mirrorSqlWrite(`/api/sql/universe/${encodeURIComponent(id)}`, 'DELETE'),
  upsertUserProfile: (profile: UserProfile) =>
    mirrorSqlWrite(`/api/sql/user-profiles/${encodeURIComponent(profile.id)}`, 'PUT', profile),
  deleteUserProfile: (id: string) =>
    mirrorSqlWrite(`/api/sql/user-profiles/${encodeURIComponent(id)}`, 'DELETE'),
  saveFrequencies: (freq: { high: number; medium: number; low: number }) =>
    mirrorSqlWrite('/api/sql/frequencies', 'PUT', freq),
  saveMasterData: (key: string, value: unknown) =>
    mirrorSqlWrite(`/api/sql/master-data/${encodeURIComponent(key)}`, 'PUT', { value }),
  upsertSystemUser: (user: Record<string, unknown>) =>
    mirrorSqlWrite('/api/sql/system-users', 'PUT', user),
  deleteSystemUser: (email: string) =>
    mirrorSqlWrite('/api/sql/system-users', 'DELETE', { email }),
};
