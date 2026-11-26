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

function getApiBaseUrl(): string {
  const env = import.meta.env as ImportMetaEnv & {
    VITE_API_URL?: string;
  };
  const configured = (env.VITE_API_URL ?? '').trim();
  return configured.replace(/\/+$/, '');
}

function apiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return path;
  if (!path.startsWith('/')) return `${baseUrl}/${path}`;
  return `${baseUrl}${path}`;
}

export interface SqlConnectStatus {
  configured: boolean;
  engine: 'https' | null;
  mode: 'sync' | 'primary';
}

let cachedStatus: { uid: string; status: SqlConnectStatus } | null = null;
let inflightStatus: Promise<SqlConnectStatus> | null = null;

function isJsonContentType(contentType: string | null): boolean {
  return Boolean(
    contentType &&
      (contentType.includes('application/json') ||
        /application\/[\w.+-]+\+json/i.test(contentType))
  );
}

async function unexpectedResponseError(label: string, res: Response): Promise<Error> {
  if (res.redirected) {
    const redirectPath = new URL(res.url).pathname;
    return new Error(
      `${label} was redirected to ${redirectPath}. Reopen the app in its authenticated browser session and try again.`
    );
  }
  const contentType = res.headers.get('content-type') ?? 'unknown content type';
  let detail = '';
  try {
    const text = await res.text();
    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch?.[1]?.trim()) {
      detail = ` (${titleMatch[1].trim()})`;
    }
  } catch {
    // Ignore body read failure
  }
  return new Error(
    `${label} returned a non-JSON response (${contentType}, status ${res.status}${detail}). Check the hosted API routing and deployment.`
  );
}

async function readApiError(res: Response, label: string): Promise<Error> {
  if (isJsonContentType(res.headers.get('content-type'))) {
    const errPayload = await res.json().catch(() => ({}));
    if (typeof errPayload?.error === 'string') {
      return new Error(errPayload.error);
    }
  } else {
    return unexpectedResponseError(label, res);
  }
  return new Error(`${label} (${res.status}).`);
}

async function readApiJson<T>(res: Response, label: string): Promise<T> {
  if (!isJsonContentType(res.headers.get('content-type'))) {
    throw await unexpectedResponseError(label, res);
  }
  return (await res.json()) as T;
}

async function fetchWithWarmupRetry(
  url: string,
  init: RequestInit,
  attempts = 3
): Promise<Response> {
  let lastRes: Response | null = null;
  for (let i = 0; i < attempts; i += 1) {
    const res = await fetch(url, init);
    lastRes = res;
    const contentType = res.headers.get('content-type') ?? '';
    if (isJsonContentType(contentType)) {
      return res;
    }
    const clone = res.clone();
    const bodyText = await clone.text().catch(() => '');
    const isWarmup =
      contentType.includes('text/html') &&
      (bodyText.includes('Starting Server') || bodyText.includes('warmup'));
    if (!isWarmup || i === attempts - 1) {
      return res;
    }
    await new Promise((resolve) => setTimeout(resolve, 800 * (i + 1)));
  }
  return lastRes!;
}

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
    throw new Error('Authentication required for Firebase Data Connect.');
  }
  if (cachedStatus && cachedStatus.uid === uid) {
    return cachedStatus.status;
  }
  if (inflightStatus) {
    return inflightStatus;
  }

  inflightStatus = (async () => {
    try {
      const headers = await getBearerHeaders();
      const res = await fetchWithWarmupRetry(apiUrl('/api/sql/status'), {
        headers: headers ?? undefined,
        credentials: 'include',
      });
      if (!res.ok) {
        throw await readApiError(res, 'Firebase Data Connect status API error');
      }
      const payload: unknown = await readApiJson(
        res,
        'Firebase Data Connect status API'
      );
      if (
        !payload ||
        typeof payload !== 'object' ||
        !('configured' in payload) ||
        !('engine' in payload) ||
        !('mode' in payload) ||
        payload.configured !== true ||
        payload.engine !== 'https' ||
        payload.mode !== 'primary'
      ) {
        const issue =
          payload &&
          typeof payload === 'object' &&
          'schemaIssue' in payload &&
          typeof (payload as { schemaIssue?: unknown }).schemaIssue === 'string'
            ? (payload as { schemaIssue: string }).schemaIssue
            : null;
        throw new Error(
          issue || 'Firebase Data Connect is not configured as the primary data store.'
        );
      }
      const status = payload as SqlConnectStatus;
      cachedStatus = { uid, status };
      return status;
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
    throw new Error('Authentication required for Firebase Data Connect.');
  }
  const res = await fetchWithWarmupRetry(apiUrl(path), {
    method,
    headers,
    credentials: 'include',
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    throw await readApiError(res, 'Firebase Data Connect API error');
  }
  return readApiJson<T>(res, 'Firebase Data Connect API');
}

export async function mirrorSqlWrite(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: unknown
): Promise<void> {
  const status = await getSqlConnectStatus();
  if (!status.configured) {
    throw new Error('Firebase Data Connect service account is not configured.');
  }
  await requestSqlApi(path, method, body);
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

export async function fetchSqlSystemUsers(): Promise<Array<Record<string, unknown>>> {
  const res = await requestSqlApi<{ users: Array<Record<string, unknown>> }>(
    '/api/sql/system-users',
    'GET'
  );
  return Array.isArray(res.users) ? res.users : [];
}

export async function resolveSqlAuthSession(): Promise<{
  userId: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  appRole?: string;
  scope?: string;
  employeeNumber?: string;
  fullName: string;
}> {
  return requestSqlApi('/api/sql/auth/session', 'GET');
}

export async function unlockSqlSystemUser(id: string, email?: string): Promise<void> {
  await requestSqlApi('/api/sql/system-users/unlock', 'POST', { id, email });
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
  upsertAppSession: (id: string, session: Record<string, unknown>) =>
    mirrorSqlWrite(`/api/sql/sessions/${encodeURIComponent(id)}`, 'PUT', session),
  deleteAppSession: (id: string) =>
    mirrorSqlWrite(`/api/sql/sessions/${encodeURIComponent(id)}`, 'DELETE'),
};
