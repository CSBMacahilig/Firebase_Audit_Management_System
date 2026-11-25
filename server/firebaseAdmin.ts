import { cert, getApp, getApps, initializeApp, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDataConnect, type DataConnect } from 'firebase-admin/data-connect';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

export const DATA_CONNECT_CONFIG = {
  serviceId: 'csb-ams-2-service',
  location: 'asia-southeast1',
  connector: 'example',
} as const;

let cachedApp: App | null = null;
let cachedDataConnect: DataConnect | null = null;
let serviceAccountActive = false;

export function hasServiceAccountKey(): boolean {
  return Boolean((process.env.FIREBASE_SERVICE_ACCOUNT_KEY ?? '').trim());
}

export function isServiceAccountActive(): boolean {
  return serviceAccountActive;
}

function escapeRawNewlinesInJsonStrings(input: string): string {
  let out = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }
    if (ch === '\\' && inString) {
      out += ch;
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      out += ch;
      continue;
    }
    if (inString && ch === '\n') {
      out += '\\n';
      continue;
    }
    if (inString && ch === '\r') {
      continue;
    }
    out += ch;
  }
  return out;
}

function normalizePemPrivateKey(rawPem: string): string {
  const unescaped = rawPem
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  const pemMatch = unescaped.match(
    /(-----BEGIN [A-Z0-9 ]+-----)([\s\S]*?)(-----END [A-Z0-9 ]+-----)/
  );
  if (!pemMatch) {
    return unescaped;
  }

  const header = pemMatch[1].trim();
  const body = pemMatch[2].replace(/\s+/g, '');
  const footer = pemMatch[3].trim();
  const wrappedLines = body.match(/.{1,64}/g) ?? [body];
  return `${header}\n${wrappedLines.join('\n')}\n${footer}\n`;
}

type ParsedServiceAccount = ServiceAccount & {
  project_id?: string;
  private_key?: string;
  client_email?: string;
};

function tryParseServiceAccountJson(raw: string): ParsedServiceAccount | null {
  let candidate = raw
    .replace(/^\uFEFF/, '')
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .trim();
  if (!candidate) return null;

  // Strip accidental single/double outer wrapper quotes from .env or copy-paste
  if (
    (candidate.startsWith("'") && candidate.endsWith("'")) ||
    (candidate.startsWith('"') && candidate.endsWith('"'))
  ) {
    const inner = candidate.slice(1, -1).trim();
    if (inner.startsWith('{') || inner.startsWith('{\\"')) {
      candidate = inner;
    }
  }

  const attempts = new Set<string>([candidate]);
  if (candidate.includes('\\"')) {
    attempts.add(candidate.replace(/\\"/g, '"'));
  }

  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const sliced = candidate.slice(firstBrace, lastBrace + 1);
    attempts.add(sliced);
    if (sliced.includes('\\"')) {
      attempts.add(sliced.replace(/\\"/g, '"'));
    }
  } else if (candidate.includes('"private_key"') || candidate.includes('"client_email"')) {
    attempts.add(`{${candidate}}`);
  }

  if (!candidate.includes('{')) {
    try {
      const decoded = Buffer.from(candidate, 'base64').toString('utf8').trim();
      if (decoded.includes('{')) {
        attempts.add(decoded);
      }
    } catch {
      // Ignore invalid base64
    }
  }

  for (const item of attempts) {
    const variants = [
      item,
      escapeRawNewlinesInJsonStrings(item),
      item.replace(/,\s*([}\]])/g, '$1'),
      escapeRawNewlinesInJsonStrings(item).replace(/,\s*([}\]])/g, '$1'),
    ];
    for (const variant of variants) {
      try {
        let parsed: unknown = JSON.parse(variant);
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const obj = { ...(parsed as ParsedServiceAccount) };
          const rawPrivateKey =
            typeof obj.private_key === 'string'
              ? obj.private_key
              : typeof obj.privateKey === 'string'
                ? obj.privateKey
                : '';
          const clientEmail =
            typeof obj.client_email === 'string'
              ? obj.client_email.trim()
              : typeof obj.clientEmail === 'string'
                ? obj.clientEmail.trim()
                : '';
          const projectId =
            (typeof obj.project_id === 'string' && obj.project_id.trim()) ||
            (typeof obj.projectId === 'string' && obj.projectId.trim()) ||
            firebaseConfig.projectId;

          if (rawPrivateKey && clientEmail) {
            const normalizedPem = normalizePemPrivateKey(rawPrivateKey);
            obj.private_key = normalizedPem;
            obj.privateKey = normalizedPem;
            obj.client_email = clientEmail;
            obj.clientEmail = clientEmail;
            obj.project_id = projectId;
            obj.projectId = projectId;
            return obj;
          }
        }
      } catch {
        // Try next normalization variant
      }
    }
  }

  return null;
}

export function getFirebaseAdminApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().length > 0) {
    cachedApp = getApp();
    return cachedApp;
  }

  const rawKey = (process.env.FIREBASE_SERVICE_ACCOUNT_KEY ?? '').trim();
  if (rawKey) {
    let parsed: ParsedServiceAccount | null = null;
    try {
      parsed = tryParseServiceAccountJson(rawKey);
      if (!parsed) {
        const diag = `len=${rawKey.length}, hasBraces=${rawKey.includes('{') && rawKey.includes('}')}, hasType=${rawKey.includes('service_account')}, hasPrivateKey=${rawKey.includes('private_key')}, hasClientEmail=${rawKey.includes('client_email')}`;
        throw new Error(`Invalid service account JSON structure (${diag})`);
      }
      cachedApp = initializeApp({
        credential: cert(parsed),
        projectId: parsed.project_id || firebaseConfig.projectId,
      });
      serviceAccountActive = true;
      return cachedApp;
    } catch (err) {
      serviceAccountActive = false;
      const safeMsg =
        err instanceof Error &&
        (err.message.startsWith('Invalid service account JSON structure') ||
          err.message.startsWith('Service account') ||
          err.message.startsWith('Failed to parse private key'))
          ? err.message
          : err instanceof Error
            ? err.name
            : 'Error';
      console.error(
        `[firebaseAdmin] Could not initialize with FIREBASE_SERVICE_ACCOUNT_KEY; falling back to projectId-only mode (${safeMsg})`
      );
    }
  }

  cachedApp = initializeApp({
    projectId: firebaseConfig.projectId,
  });
  return cachedApp;
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDataConnect(): DataConnect {
  if (!cachedDataConnect) {
    cachedDataConnect = getDataConnect(
      {
        serviceId: DATA_CONNECT_CONFIG.serviceId,
        location: DATA_CONNECT_CONFIG.location,
        connector: DATA_CONNECT_CONFIG.connector,
      },
      getFirebaseAdminApp()
    );
  }
  return cachedDataConnect;
}
