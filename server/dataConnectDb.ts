import {
  DATA_CONNECT_CONFIG,
  getAdminDataConnect,
  getFirebaseAdminApp,
  hasServiceAccountKey,
} from './firebaseAdmin.ts';

export type SqlEngine = 'https';
export type SqlConnectMode = 'primary';

export interface SqlConnectPublicConfig {
  configured: boolean;
  engine: SqlEngine | null;
  mode: SqlConnectMode;
}

export interface SqlSystemUserRecord {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  appRole?: string;
  scope?: string;
  employeeNumber?: string;
  isActive: boolean;
  isLocked: boolean;
  lastLogin?: string | null;
  modifiedAt?: string;
}

type GqlTypeRef = {
  name: string | null;
  kind: string;
  ofType?: GqlTypeRef | null;
};

type GqlFieldDef = {
  name: string;
  args?: Array<{ name: string; type: GqlTypeRef }>;
  type: GqlTypeRef;
};

type GqlInputFieldDef = {
  name: string;
  type: GqlTypeRef;
};

type GqlTypeDef = {
  name: string;
  kind: string;
  fields?: GqlFieldDef[] | null;
  inputFields?: GqlInputFieldDef[] | null;
};

interface IntrospectedTableMeta {
  tableKey: TableKey;
  queryFieldName: string;
  selectClause: string;
  upsertMutationName: string | null;
  upsertDataArgName: string;
  upsertInputTypeName: string | null;
  upsertInputFields: Map<string, GqlTypeRef>;
  deleteMutationName: string | null;
  deleteArgs: Array<{ name: string; type: GqlTypeRef; keyInputFields?: Map<string, GqlTypeRef> }>;
}

interface IntrospectedSchemaCache {
  tables: Map<TableKey, IntrospectedTableMeta>;
  typesByName: Map<string, GqlTypeDef>;
}

type TableKey =
  | 'userProfiles'
  | 'systemUsers'
  | 'engagements'
  | 'workingNotes'
  | 'findings'
  | 'timelineActivities'
  | 'engagementFiles'
  | 'activityLogs'
  | 'issueRegisters'
  | 'universeEntities'
  | 'sizingConfigs'
  | 'auditFrequencies'
  | 'masterDatas'
  | 'auditDivisionRiskScales'
  | 'appSessions';

const TABLE_OPERATIONS: Record<
  TableKey,
  { query: string; upsert: string; delete: string }
> = {
  userProfiles: { query: 'userProfiles', upsert: 'userProfile_upsert', delete: 'userProfile_delete' },
  systemUsers: { query: 'systemUsers', upsert: 'systemUser_upsert', delete: 'systemUser_delete' },
  engagements: { query: 'engagements', upsert: 'engagement_upsert', delete: 'engagement_delete' },
  workingNotes: { query: 'workingNotes', upsert: 'workingNote_upsert', delete: 'workingNote_delete' },
  findings: { query: 'findings', upsert: 'finding_upsert', delete: 'finding_delete' },
  timelineActivities: {
    query: 'timelineActivities',
    upsert: 'timelineActivity_upsert',
    delete: 'timelineActivity_delete',
  },
  engagementFiles: {
    query: 'engagementFiles',
    upsert: 'engagementFile_upsert',
    delete: 'engagementFile_delete',
  },
  activityLogs: { query: 'activityLogs', upsert: 'activityLog_upsert', delete: 'activityLog_delete' },
  issueRegisters: {
    query: 'issueRegisters',
    upsert: 'issueRegister_upsert',
    delete: 'issueRegister_delete',
  },
  universeEntities: {
    query: 'universeEntities',
    upsert: 'universeEntity_upsert',
    delete: 'universeEntity_delete',
  },
  sizingConfigs: { query: 'sizingConfigs', upsert: 'sizingConfig_upsert', delete: 'sizingConfig_delete' },
  auditFrequencies: {
    query: 'auditFrequencies',
    upsert: 'auditFrequency_upsert',
    delete: 'auditFrequency_delete',
  },
  masterDatas: { query: 'masterDatas', upsert: 'masterData_upsert', delete: 'masterData_delete' },
  auditDivisionRiskScales: {
    query: 'auditDivisionRiskScales',
    upsert: 'auditDivisionRiskScale_upsert',
    delete: 'auditDivisionRiskScale_delete',
  },
  appSessions: { query: 'appSessions', upsert: 'appSession_upsert', delete: 'appSession_delete' },
};

const INTROSPECTION_QUERY = `
  query IntrospectDataConnectSchema {
    __schema {
      queryType {
        name
        fields {
          name
          args {
            name
            type { name kind ofType { name kind ofType { name kind } } }
          }
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType { name kind }
              }
            }
          }
        }
      }
      mutationType {
        name
        fields {
          name
          args {
            name
            type { name kind ofType { name kind ofType { name kind } } }
          }
        }
      }
      types {
        name
        kind
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType { name kind }
              }
            }
          }
        }
        inputFields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType { name kind }
              }
            }
          }
        }
      }
    }
  }
`;

declare global {
  var _amsDcSchemaCache: IntrospectedSchemaCache | undefined;
  var _amsDcSchemaPromise: Promise<IntrospectedSchemaCache> | undefined;
}

function clampStr(val: unknown, maxLen: number, fallback = ''): string {
  if (typeof val !== 'string') return fallback;
  return val.trim().slice(0, maxLen);
}

function clampNum(val: unknown, min: number, max: number, fallback: number): number {
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function sanitizeId(raw: unknown, fallback = 'id'): string {
  const str = typeof raw === 'string' ? raw : fallback;
  const cleaned = str.trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  return (cleaned || fallback).slice(0, 128);
}

function normalizeName(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function unwrapType(typeRef: GqlTypeRef | null | undefined): {
  baseName: string | null;
  baseKind: string;
  isNonNull: boolean;
  isList: boolean;
} {
  let cur: GqlTypeRef | null | undefined = typeRef;
  const isNonNull = cur?.kind === 'NON_NULL';
  let isList = false;
  while (cur && (cur.kind === 'NON_NULL' || cur.kind === 'LIST')) {
    if (cur.kind === 'LIST') isList = true;
    cur = cur.ofType;
  }
  return {
    baseName: cur?.name ?? null,
    baseKind: cur?.kind ?? 'SCALAR',
    isNonNull,
    isList,
  };
}

function toFriendlyDataConnectError(err: unknown): Error {
  const rawMsg = err instanceof Error ? err.message : String(err ?? 'Unknown error');
  if (
    rawMsg.includes('PERMISSION_DENIED') ||
    rawMsg.includes('Permission') ||
    rawMsg.includes('denied') ||
    rawMsg.includes('403')
  ) {
    return new Error(
      `Firebase Data Connect permission denied on service ${DATA_CONNECT_CONFIG.serviceId} (${DATA_CONNECT_CONFIG.location}). Ensure the Firebase Admin service account has the Firebase Data Connect Admin role (roles/firebasedataconnect.admin) in Google Cloud IAM.`
    );
  }
  return err instanceof Error ? err : new Error(rawMsg);
}

export function hasSqlConfig(): boolean {
  return hasServiceAccountKey();
}

export function getSqlPublicConfig(): SqlConnectPublicConfig {
  const configured = hasSqlConfig();
  return {
    configured,
    engine: configured ? 'https' : null,
    mode: 'primary',
  };
}

async function getSchemaCache(): Promise<IntrospectedSchemaCache> {
  if (globalThis._amsDcSchemaCache) {
    return globalThis._amsDcSchemaCache;
  }
  if (!globalThis._amsDcSchemaPromise) {
    globalThis._amsDcSchemaPromise = (async () => {
      getFirebaseAdminApp();
      const dc = getAdminDataConnect();
      try {
        const resp = await dc.executeGraphqlRead<{
          __schema?: {
            queryType?: { fields?: GqlFieldDef[] };
            mutationType?: { fields?: GqlFieldDef[] };
            types?: GqlTypeDef[];
          };
        }, Record<string, never>>(INTROSPECTION_QUERY);

        const schema = resp.data?.__schema;
        const queryFields = schema?.queryType?.fields ?? [];
        const mutationFields = schema?.mutationType?.fields ?? [];
        const allTypes = schema?.types ?? [];

        const typesByName = new Map<string, GqlTypeDef>();
        for (const t of allTypes) {
          if (t.name) typesByName.set(t.name, t);
        }

        const tables = new Map<TableKey, IntrospectedTableMeta>();

        (Object.keys(TABLE_OPERATIONS) as TableKey[]).forEach((tableKey) => {
          const operation = TABLE_OPERATIONS[tableKey];
          const matchedQuery = queryFields.find((field) => field.name === operation.query);
          const matchedUpsert = mutationFields.find((field) => field.name === operation.upsert);
          const matchedDelete = mutationFields.find((field) => field.name === operation.delete);
          if (!matchedQuery || !matchedUpsert || !matchedDelete) {
            const missingOperations = [
              !matchedQuery ? operation.query : '',
              !matchedUpsert ? operation.upsert : '',
              !matchedDelete ? operation.delete : '',
            ].filter(Boolean);
            throw new Error(
              `Firebase Data Connect schema is missing expected operations: ${missingOperations.join(', ')}.`
            );
          }

          const returnTypeInfo = unwrapType(matchedQuery.type);
          const objType = returnTypeInfo.baseName ? typesByName.get(returnTypeInfo.baseName) : undefined;
          const selectParts: string[] = [];

          for (const field of objType?.fields ?? []) {
            const ft = unwrapType(field.type);
            if (ft.baseKind === 'SCALAR' || ft.baseKind === 'ENUM') {
              selectParts.push(field.name);
            } else if (ft.baseKind === 'OBJECT' && ft.baseName && !ft.isList) {
              const relType = typesByName.get(ft.baseName);
              const idField = relType?.fields?.find((rf) => rf.name === 'id');
              if (idField) {
                selectParts.push(`${field.name} { id }`);
              }
            }
          }

          if (selectParts.length === 0) {
            selectParts.push('id');
          }

          let upsertDataArgName = 'data';
          let upsertInputTypeName: string | null = null;
          const upsertInputFields = new Map<string, GqlTypeRef>();
          if (matchedUpsert?.args?.length) {
            const dataArg =
              matchedUpsert.args.find((a) => a.name === 'data') ?? matchedUpsert.args[0];
            upsertDataArgName = dataArg.name;
            const argTypeInfo = unwrapType(dataArg.type);
            upsertInputTypeName = argTypeInfo.baseName;
            if (upsertInputTypeName) {
              const inputDef = typesByName.get(upsertInputTypeName);
              for (const inf of inputDef?.inputFields ?? []) {
                upsertInputFields.set(inf.name, inf.type);
              }
            }
          }

          const deleteArgs = (matchedDelete?.args ?? []).map((a) => {
            const info = unwrapType(a.type);
            let keyInputFields: Map<string, GqlTypeRef> | undefined;
            if (info.baseKind === 'INPUT_OBJECT' && info.baseName) {
              const kDef = typesByName.get(info.baseName);
              keyInputFields = new Map<string, GqlTypeRef>();
              for (const kf of kDef?.inputFields ?? []) {
                keyInputFields.set(kf.name, kf.type);
              }
            }
            return { name: a.name, type: a.type, keyInputFields };
          });

          tables.set(tableKey, {
            tableKey,
            queryFieldName: matchedQuery.name,
            selectClause: selectParts.join(' '),
            upsertMutationName: matchedUpsert?.name ?? null,
            upsertDataArgName,
            upsertInputTypeName,
            upsertInputFields,
            deleteMutationName: matchedDelete?.name ?? null,
            deleteArgs,
          });
        });

        const missingTables = (Object.keys(TABLE_OPERATIONS) as TableKey[]).filter(
          (tableKey) => !tables.has(tableKey)
        );
        if (missingTables.length > 0) {
          throw new Error(
            `Firebase Data Connect schema is missing expected table operations: ${missingTables.join(', ')}.`
          );
        }

        const built: IntrospectedSchemaCache = { tables, typesByName };
        globalThis._amsDcSchemaCache = built;
        return built;
      } catch (err) {
        throw toFriendlyDataConnectError(err);
      } finally {
        globalThis._amsDcSchemaPromise = undefined;
      }
    })();
  }
  return globalThis._amsDcSchemaPromise;
}

function buildFieldAliases(canonical: Record<string, unknown>): Map<string, unknown> {
  const map = new Map<string, unknown>();
  for (const [k, v] of Object.entries(canonical)) {
    map.set(k, v);
    map.set(normalizeName(k), v);
  }
  return map;
}

function coerceValueForInputField(
  rawVal: unknown,
  typeRef: GqlTypeRef,
  typesByName: Map<string, GqlTypeDef>,
  fallbackForRequired: boolean
): unknown {
  const info = unwrapType(typeRef);
  if (rawVal === undefined || rawVal === null) {
    if (!fallbackForRequired && !info.isNonNull) return undefined;
    if (info.baseName === 'Int' || info.baseName === 'Float') return 0;
    if (info.baseName === 'Boolean') return false;
    if (info.baseName === 'Timestamp') return new Date().toISOString();
    if (info.baseName === 'Date') return new Date().toISOString().slice(0, 10);
    if (info.baseName === 'String') return '';
    return undefined;
  }

  if (info.baseKind === 'INPUT_OBJECT' && info.baseName) {
    const keyDef = typesByName.get(info.baseName);
    const idField = keyDef?.inputFields?.find((f) => f.name === 'id');
    if (idField && typeof rawVal === 'string') {
      return { id: rawVal };
    }
    if (typeof rawVal === 'object' && !Array.isArray(rawVal)) {
      return rawVal;
    }
    return undefined;
  }

  if (info.baseName === 'Int') {
    const n = Number(rawVal);
    return Number.isFinite(n) ? Math.round(n) : 0;
  }
  if (info.baseName === 'Float') {
    const n = Number(rawVal);
    return Number.isFinite(n) ? n : 0;
  }
  if (info.baseName === 'Boolean') {
    return Boolean(rawVal);
  }
  if (info.baseName === 'Timestamp') {
    if (typeof rawVal === 'string' && rawVal.trim()) {
      const parsed = Date.parse(rawVal);
      if (Number.isFinite(parsed)) return new Date(parsed).toISOString();
    }
    return new Date().toISOString();
  }
  if (info.baseName === 'Date') {
    if (typeof rawVal === 'string' && rawVal.trim()) {
      return rawVal.trim().slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  }
  if (info.baseName === 'String' || info.baseName === 'UUID') {
    if (typeof rawVal === 'string') return rawVal;
    if (typeof rawVal === 'object') return JSON.stringify(rawVal);
    return String(rawVal);
  }
  return rawVal;
}

async function listTableRows(tableKey: TableKey): Promise<Record<string, unknown>[]> {
  const cache = await getSchemaCache();
  const meta = cache.tables.get(tableKey);
  if (!meta) {
    throw new Error(`Firebase Data Connect query for "${tableKey}" is not available.`);
  }

  const dc = getAdminDataConnect();
  const query = `query List_${tableKey} { ${meta.queryFieldName} { ${meta.selectClause} } }`;
  try {
    const res = await dc.executeGraphqlRead<Record<string, unknown[]>, Record<string, never>>(
      query
    );
    const rows = res.data?.[meta.queryFieldName];
    return Array.isArray(rows) ? (rows as Record<string, unknown>[]) : [];
  } catch (err) {
    throw toFriendlyDataConnectError(err);
  }
}

async function upsertTableRow(
  tableKey: TableKey,
  canonicalPayload: Record<string, unknown>
): Promise<void> {
  const cache = await getSchemaCache();
  const meta = cache.tables.get(tableKey);
  if (!meta || !meta.upsertMutationName || !meta.upsertInputTypeName) {
    throw new Error(`Firebase Data Connect table "${tableKey}" upsert mutation is not available.`);
  }

  const aliasMap = buildFieldAliases(canonicalPayload);
  const dataPayload: Record<string, unknown> = {};
  const expressionBases = new Set(
    Array.from(meta.upsertInputFields.keys())
      .filter((name) => /^(createdAt|updatedAt|modifiedAt)_expr$/.test(name))
      .map((name) => name.slice(0, -5))
  );

  for (const [fieldName, fieldType] of meta.upsertInputFields.entries()) {
    if (/^(createdAt|updatedAt|modifiedAt)_expr$/.test(fieldName)) {
      dataPayload[fieldName] = 'request.time';
      continue;
    }
    if (expressionBases.has(fieldName)) continue;

    let rawVal = aliasMap.get(fieldName);
    if (rawVal === undefined) {
      rawVal = aliasMap.get(normalizeName(fieldName));
    }
    if (rawVal === undefined && fieldName === 'engagement') {
      rawVal = aliasMap.get('engagementId');
    }
    const info = unwrapType(fieldType);
    const coerced = coerceValueForInputField(rawVal, fieldType, cache.typesByName, info.isNonNull);
    if (coerced !== undefined) {
      dataPayload[fieldName] = coerced;
    }
  }

  const dc = getAdminDataConnect();
  const mutation = `
    mutation Upsert_${tableKey}($data: ${meta.upsertInputTypeName}!) {
      ${meta.upsertMutationName}(${meta.upsertDataArgName}: $data)
    }
  `;

  try {
    await dc.executeGraphql(mutation, { variables: { data: dataPayload } });
  } catch (err) {
    throw toFriendlyDataConnectError(err);
  }
}

async function deleteTableRowById(
  tableKey: TableKey,
  keyValues: Record<string, string>
): Promise<void> {
  const cache = await getSchemaCache();
  const meta = cache.tables.get(tableKey);
  if (!meta || !meta.deleteMutationName || meta.deleteArgs.length === 0) {
    throw new Error(`Firebase Data Connect table "${tableKey}" delete mutation is not available.`);
  }

  const varDefs: string[] = [];
  const callArgs: string[] = [];
  const variables: Record<string, unknown> = {};

  for (const arg of meta.deleteArgs) {
    const info = unwrapType(arg.type);
    if (!info.baseName) continue;
    const typeSuffix = info.isNonNull ? '!' : '';

    if (arg.keyInputFields) {
      const keyObj: Record<string, unknown> = {};
      for (const [kName] of arg.keyInputFields.entries()) {
        const val =
          keyValues[kName] ??
          keyValues[normalizeName(kName)] ??
          keyValues.id ??
          Object.values(keyValues)[0];
        if (val !== undefined) keyObj[kName] = val;
      }
      varDefs.push(`$${arg.name}: ${info.baseName}${typeSuffix}`);
      callArgs.push(`${arg.name}: $${arg.name}`);
      variables[arg.name] = keyObj;
    } else {
      const val =
        keyValues[arg.name] ??
        keyValues[normalizeName(arg.name)] ??
        keyValues.id ??
        Object.values(keyValues)[0];
      if (val !== undefined) {
        varDefs.push(`$${arg.name}: ${info.baseName}${typeSuffix}`);
        callArgs.push(`${arg.name}: $${arg.name}`);
        variables[arg.name] = val;
      }
    }
  }

  if (callArgs.length === 0) return;

  const dc = getAdminDataConnect();
  const mutation = `
    mutation Delete_${tableKey}(${varDefs.join(', ')}) {
      ${meta.deleteMutationName}(${callArgs.join(', ')})
    }
  `;

  try {
    await dc.executeGraphql(mutation, { variables });
  } catch (err) {
    throw toFriendlyDataConnectError(err);
  }
}

function strField(row: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  }
  return '';
}

function optStrField(row: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === 'string' && v.trim()) return v;
  }
  return undefined;
}

function numField(row: Record<string, unknown>, fallback: number, ...keys: string[]): number {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && Number.isFinite(Number(v))) return Number(v);
  }
  return fallback;
}

function boolField(row: Record<string, unknown>, fallback: boolean, ...keys: string[]): boolean {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === 'boolean') return v;
  }
  return fallback;
}

function relId(row: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === 'string' && v.trim()) return v;
    if (v && typeof v === 'object' && 'id' in v && typeof (v as { id?: unknown }).id === 'string') {
      return String((v as { id: string }).id);
    }
  }
  return '';
}

export async function ensureSqlSchema(force = false): Promise<void> {
  if (!hasSqlConfig()) return;
  if (force) {
    globalThis._amsDcSchemaCache = undefined;
  }
  await getSchemaCache();
}

export async function listSqlSystemUsers(): Promise<SqlSystemUserRecord[]> {
  if (!hasSqlConfig()) return [];
  const rows = await listTableRows('systemUsers');
  return rows.map((r) => ({
    id: strField(r, 'id'),
    username: strField(r, 'username'),
    fullName: strField(r, 'fullName', 'full_name'),
    email: strField(r, 'email').toLowerCase(),
    role: strField(r, 'role') === 'admin' ? 'admin' : 'user',
    appRole: optStrField(r, 'appRole', 'app_role'),
    scope: optStrField(r, 'scope'),
    employeeNumber: optStrField(r, 'employeeNumber', 'employee_number'),
    isActive: boolField(r, true, 'isActive', 'is_active'),
    isLocked: boolField(r, false, 'isLocked', 'is_locked'),
    lastLogin: optStrField(r, 'lastLogin', 'last_login') ?? null,
    modifiedAt: optStrField(r, 'modifiedAt', 'modified_at'),
  }));
}

export async function findSqlSystemUserByEmail(
  email: string
): Promise<SqlSystemUserRecord | null> {
  if (!hasSqlConfig()) return null;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  const users = await listSqlSystemUsers();
  return users.find((u) => u.email.trim().toLowerCase() === normalized) ?? null;
}

export async function upsertSqlSystemUser(user: {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  appRole?: string;
  scope?: string;
  employeeNumber?: string;
  isActive: boolean;
  isLocked: boolean;
}): Promise<void> {
  if (!hasSqlConfig()) return;
  const mail = clampStr(user.email.toLowerCase(), 160);
  if (!mail) return;
  const safeId = sanitizeId(user.id || mail.replace(/[^a-z0-9]/g, '_'));
  const nowIso = new Date().toISOString();
  const existing = (await listTableRows('systemUsers')).find(
    (row) => strField(row, 'email').trim().toLowerCase() === mail
  );

  await upsertTableRow('systemUsers', {
    id: safeId,
    username: clampStr(user.username || mail.split('@')[0], 80),
    fullName: clampStr(user.fullName || mail.split('@')[0], 160),
    email: mail,
    role: user.role === 'admin' ? 'admin' : 'user',
    passwordHash: strField(existing ?? {}, 'passwordHash'),
    isActive: Boolean(user.isActive),
    isLocked: Boolean(user.isLocked),
    failedLoginCount: numField(existing ?? {}, 0, 'failedLoginCount'),
    requiresPasswordChange: boolField(existing ?? {}, false, 'requiresPasswordChange'),
    modifiedAt: nowIso,
  });
}

export async function deleteSqlSystemUserByEmail(email: string): Promise<void> {
  if (!hasSqlConfig()) return;
  const mail = clampStr(email.toLowerCase(), 160);
  if (!mail) return;
  const existing = await findSqlSystemUserByEmail(mail);
  const safeId = existing?.id || sanitizeId(`sys_${mail.replace(/[^a-z0-9_-]+/g, '_')}`);
  await deleteTableRowById('systemUsers', { id: safeId, email: mail });
}

export async function upsertSqlUserProfile(
  profile: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeId = sanitizeId(profile.id, 'user');
  const nowIso = new Date().toISOString();
  const existing = Array.isArray(profile.passwordHistory)
    ? undefined
    : (await listTableRows('userProfiles')).find((row) => strField(row, 'id') === safeId);

  await upsertTableRow('userProfiles', {
    id: safeId,
    name: clampStr(profile.name, 160, 'User'),
    roleTitle: clampStr(profile.roleTitle, 160),
    fullLabel: clampStr(profile.fullLabel, 240),
    headerSubtitle: clampStr(profile.headerSubtitle, 160),
    department: clampStr(profile.department, 160),
    canApproveHead: Boolean(profile.canApproveHead),
    canApproveIndependent: Boolean(profile.canApproveIndependent),
    canApproveCae: Boolean(profile.canApproveCAE),
    employeeNumber: typeof profile.employeeNumber === 'string' ? clampStr(profile.employeeNumber, 64) : null,
    lastLoginDate: typeof profile.lastLoginDate === 'string' ? clampStr(profile.lastLoginDate, 64) : null,
    accountModifiedAt: typeof profile.accountModifiedAt === 'string' ? clampStr(profile.accountModifiedAt, 64) : null,
    passwordHistory: (Array.isArray(profile.passwordHistory)
      ? profile.passwordHistory
      : Array.isArray(existing?.passwordHistory)
        ? existing.passwordHistory
        : []
    ).filter((item): item is string => typeof item === 'string'),
    accountStatus: clampStr(profile.accountStatus, 40, 'Active'),
    failedLoginCount: Math.round(clampNum(profile.failedLoginCount ?? 0, 0, 100, 0)),
    isLocked: Boolean(profile.isLocked),
    requiresPasswordChange: Boolean(profile.requiresPasswordChange),
    mfaEnabled: Boolean(profile.mfaEnabled),
    isPrivileged: Boolean(profile.isPrivileged),
    addedBy: clampStr(profile.addedBy ?? actorEmail, 160),
    modifiedBy: clampStr(actorEmail, 160),
    modifiedAt: nowIso,
  });
}

export async function deleteSqlUserProfile(id: string): Promise<void> {
  if (!hasSqlConfig()) return;
  await deleteTableRowById('userProfiles', { id: sanitizeId(id) });
}

export async function upsertSqlEngagement(
  eng: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeId = sanitizeId(eng.id, 'eng');
  const nowIso = new Date().toISOString();

  await upsertTableRow('engagements', {
    id: safeId,
    ref: clampStr(eng.ref, 40),
    year: Math.round(clampNum(eng.year, 2000, 2100, 2026)),
    title: clampStr(eng.title, 240, 'Untitled Engagement'),
    category: clampStr(eng.category, 120),
    department: clampStr(eng.department, 160),
    auditDivisionId:
      typeof eng.auditDivisionId === 'string' && eng.auditDivisionId.trim()
        ? clampStr(eng.auditDivisionId, 64)
        : null,
    entityName: clampStr(eng.entityName, 240),
    likelihood: Math.round(clampNum(eng.likelihood, 1, 5, 3)),
    impact: Math.round(clampNum(eng.impact, 1, 5, 3)),
    riskScore: Math.round(clampNum(eng.riskScore, 1, 25, 9)),
    riskLevel: clampStr(eng.riskLevel, 20, 'Medium'),
    lead: clampStr(eng.lead, 160),
    headReviewer: clampStr(eng.headReviewer, 160),
    independentReviewer: clampStr(eng.independentReviewer, 160, 'Not needed'),
    startDate: clampStr(eng.startDate, 64),
    endDate: clampStr(eng.endDate, 64),
    objectives: typeof eng.objectives === 'string' ? clampStr(eng.objectives, 4000) : null,
    scope: typeof eng.scope === 'string' ? clampStr(eng.scope, 4000) : null,
    criteria: typeof eng.criteria === 'string' ? clampStr(eng.criteria, 4000) : null,
    addresseeName: typeof eng.addresseeName === 'string' ? clampStr(eng.addresseeName, 200) : null,
    addresseeTitle: typeof eng.addresseeTitle === 'string' ? clampStr(eng.addresseeTitle, 200) : null,
    copyFurnished: typeof eng.copyFurnished === 'string' ? clampStr(eng.copyFurnished, 500) : null,
    durationDays: Math.round(clampNum(eng.durationDays ?? 0, 0, 3650, 0)),
    budgetedHours: Math.round(clampNum(eng.budgetedHours ?? 0, 0, 100000, 0)),
    status: clampStr(eng.status, 64, 'Planned'),
    readyRatio: clampStr(eng.readyRatio, 40, '0/9 ready'),
    lifecycleStage: Math.round(clampNum(eng.lifecycleStage ?? 1, 1, 10, 1)),
    fieldworkPct: Math.round(clampNum(eng.fieldworkPct ?? 0, 0, 100, 0)),
    fieldworkDayCurrent: Math.round(clampNum(eng.fieldworkDayCurrent ?? 0, 0, 3650, 0)),
    fieldworkDayTotal: Math.round(clampNum(eng.fieldworkDayTotal ?? 0, 0, 3650, 0)),
    reportStatus: clampStr(eng.reportStatus, 40, 'Draft'),
    reportRating: typeof eng.reportRating === 'string' ? clampStr(eng.reportRating, 80) : null,
    reportRef: clampStr(eng.reportRef, 80),
    executiveSummary: clampStr(eng.executiveSummary, 8000),
    addedBy: clampStr(eng.addedBy ?? actorEmail, 160),
    modifiedBy: clampStr(actorEmail, 160),
    modifiedAt: nowIso,
  });
}

export async function upsertSqlWorkingNote(
  engagementId: string,
  note: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeEngId = sanitizeId(engagementId, 'eng');
  const safeNoteId = sanitizeId(note.id, 'wn');
  const nowIso = new Date().toISOString();

  await upsertTableRow('workingNotes', {
    id: safeNoteId,
    engagementId: safeEngId,
    ref: clampStr(note.ref, 40),
    title: clampStr(note.title, 240, 'Working Note'),
    controlArea: clampStr(note.controlArea, 160),
    author: clampStr(note.author, 160),
    status: clampStr(note.status, 40, 'Draft'),
    hasException: Boolean(note.hasException),
    updatedAt: clampStr(note.updatedAt, 64, nowIso.slice(0, 10)),
    testingProcedure: clampStr(note.testingProcedure, 8000),
    observations: typeof note.observations === 'string' ? clampStr(note.observations, 8000) : null,
    conclusion: clampStr(note.conclusion, 4000),
    reviewerComments:
      typeof note.reviewerComments === 'string' ? clampStr(note.reviewerComments, 4000) : null,
    addedBy: clampStr(note.addedBy ?? actorEmail, 160),
    modifiedBy: clampStr(actorEmail, 160),
    modifiedAt: nowIso,
  });
}

export async function upsertSqlFinding(
  engagementId: string,
  finding: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeEngId = sanitizeId(engagementId, 'eng');
  const safeFindingId = sanitizeId(finding.id, 'fnd');
  const nowIso = new Date().toISOString();

  await upsertTableRow('findings', {
    id: safeFindingId,
    engagementId: safeEngId,
    ref: clampStr(finding.ref, 40),
    title: clampStr(finding.title, 240, 'Finding'),
    severity: clampStr(finding.severity, 32, 'Medium'),
    category: typeof finding.category === 'string' ? clampStr(finding.category, 120) : null,
    condition: clampStr(finding.condition, 8000),
    criteria: clampStr(finding.criteria, 4000),
    cause: clampStr(finding.cause, 4000),
    effect: clampStr(finding.effect, 4000),
    recommendation: clampStr(finding.recommendation, 8000),
    owner: clampStr(finding.owner, 160),
    targetDate: clampStr(finding.targetDate, 64),
    status: clampStr(finding.status, 40, 'Open'),
    linkedNoteRef: clampStr(finding.linkedNoteRef, 40),
    addedBy: clampStr(finding.addedBy ?? actorEmail, 160),
    modifiedBy: clampStr(actorEmail, 160),
    modifiedAt: nowIso,
  });
}

export async function upsertSqlTimelineActivity(
  engagementId: string,
  activity: Record<string, unknown>
): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeEngId = sanitizeId(engagementId, 'eng');
  const safeActId = sanitizeId(activity.id, 'ta');

  await upsertTableRow('timelineActivities', {
    id: safeActId,
    engagementId: safeEngId,
    name: clampStr(activity.name, 240),
    roleResponsible: clampStr(activity.roleResponsible, 160),
    dueDate: clampStr(activity.dueDate, 64),
    completedDate: typeof activity.completedDate === 'string' ? clampStr(activity.completedDate, 64) : null,
    status: clampStr(activity.status, 40, 'Pending'),
    stageId: Math.round(clampNum(activity.stageId ?? 1, 1, 10, 1)),
  });
}

export async function insertSqlFile(
  engagementId: string,
  file: Record<string, unknown>
): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeEngId = sanitizeId(engagementId, 'eng');
  const safeFileId = sanitizeId(file.id, `file-${Date.now()}`);

  await upsertTableRow('engagementFiles', {
    id: safeFileId,
    engagementId: safeEngId,
    name: clampStr(file.name, 200),
    folder: clampStr(file.folder, 120),
    size: clampStr(file.size, 40),
    uploadedBy: clampStr(file.uploadedBy, 160),
    uploadedAt: clampStr(file.uploadedAt, 64),
  });
}

export async function insertSqlActivityLog(
  engagementId: string,
  log: Record<string, unknown>
): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeEngId = sanitizeId(engagementId, 'eng');
  const safeLogId = sanitizeId(log.id, `log-${Date.now()}`);

  await upsertTableRow('activityLogs', {
    id: safeLogId,
    engagementId: safeEngId,
    timestamp: clampStr(log.timestamp, 64),
    actor: clampStr(log.actor, 160),
    action: clampStr(log.action, 400),
    detail: typeof log.detail === 'string' ? clampStr(log.detail, 1000) : null,
  });
}

export async function upsertSqlIssue(
  issue: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeId = sanitizeId(issue.id, 'iss');
  const nowIso = new Date().toISOString();

  await upsertTableRow('issueRegisters', {
    id: safeId,
    ref: clampStr(issue.ref, 40),
    title: clampStr(issue.title, 240, 'Issue'),
    auditRef: clampStr(issue.auditRef, 40),
    auditTitle: clampStr(issue.auditTitle, 240),
    severity: clampStr(issue.severity, 32, 'Medium'),
    owner: clampStr(issue.owner, 160),
    ownerUnit: clampStr(issue.ownerUnit, 160),
    originalDue: clampStr(issue.originalDue, 64),
    currentDue: clampStr(issue.currentDue, 64),
    extensionCount: Math.round(clampNum(issue.extensionCount ?? 0, 0, 100, 0)),
    daysStatus: clampStr(issue.daysStatus, 80),
    isOverdue: Boolean(issue.isOverdue),
    isDueSoon: Boolean(issue.isDueSoon),
    status: clampStr(issue.status, 40, 'Open'),
    actionPlanSummary: clampStr(issue.actionPlanSummary, 4000),
    evidenceNote: typeof issue.evidenceNote === 'string' ? clampStr(issue.evidenceNote, 4000) : null,
    extensionReason: typeof issue.extensionReason === 'string' ? clampStr(issue.extensionReason, 2000) : null,
    addedBy: clampStr(issue.addedBy ?? actorEmail, 160),
    modifiedBy: clampStr(actorEmail, 160),
    modifiedAt: nowIso,
  });
}

export async function upsertSqlUniverseEntity(
  entity: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeId = sanitizeId(entity.id, 'au');
  const nowIso = new Date().toISOString();

  await upsertTableRow('universeEntities', {
    id: safeId,
    code: clampStr(entity.code, 40),
    name: clampStr(entity.name, 240, 'Entity'),
    division: clampStr(entity.division, 160),
    auditDivisionId:
      typeof entity.auditDivisionId === 'string' && entity.auditDivisionId.trim()
        ? clampStr(entity.auditDivisionId, 64)
        : null,
    category: clampStr(entity.category, 120),
    likelihood: Math.round(clampNum(entity.likelihood, 1, 5, 3)),
    impact: Math.round(clampNum(entity.impact, 1, 5, 3)),
    riskScore: Math.round(clampNum(entity.riskScore, 1, 25, 9)),
    riskLevel: clampStr(entity.riskLevel, 20, 'Medium'),
    lastAudited: clampStr(entity.lastAudited, 64),
    nextDue: clampStr(entity.nextDue, 64),
    cycleMonths: Math.round(clampNum(entity.cycleMonths ?? 12, 1, 120, 12)),
    defaultLead: clampStr(entity.defaultLead, 160),
    riskNotes: typeof entity.riskNotes === 'string' ? clampStr(entity.riskNotes, 2000) : null,
    addedBy: clampStr(entity.addedBy ?? actorEmail, 160),
    modifiedBy: clampStr(actorEmail, 160),
    modifiedAt: nowIso,
  });
}

export async function deleteSqlUniverseEntity(id: string): Promise<void> {
  if (!hasSqlConfig()) return;
  await deleteTableRowById('universeEntities', { id: sanitizeId(id) });
}

export async function saveSqlFrequencies(
  freq: { high: number; medium: number; low: number },
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  const nowIso = new Date().toISOString();
  const high = Math.round(clampNum(freq.high, 1, 120, 12));
  const medium = Math.round(clampNum(freq.medium, 1, 120, 36));
  const low = Math.round(clampNum(freq.low, 1, 120, 48));

  await upsertTableRow('auditFrequencies', {
    id: 'global',
    high,
    medium,
    low,
    addedBy: clampStr(actorEmail, 160),
    modifiedBy: clampStr(actorEmail, 160),
    updatedAt: nowIso,
    modifiedAt: nowIso,
  });
}

export async function saveSqlMasterData(
  key: string,
  value: unknown,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeKey = sanitizeId(key);
  const nowIso = new Date().toISOString();
  await getSchemaCache();

  if (safeKey === 'sizing_configs' && Array.isArray(value)) {
    for (let idx = 0; idx < value.length; idx += 1) {
      const item = value[idx];
      if (!item || typeof item !== 'object') continue;
      const rec = item as Record<string, unknown>;
      const rowId = sanitizeId(rec.id, `sizing-${idx + 1}`);
      await upsertTableRow('sizingConfigs', {
        ...rec,
        id: rowId,
        addedBy: clampStr(rec.addedBy ?? actorEmail, 160),
        modifiedBy: clampStr(actorEmail, 160),
        modifiedAt: nowIso,
        updatedAt: nowIso,
      });
    }
  }

  if (
    safeKey === 'audit_division_risk_scales' &&
    Array.isArray(value)
  ) {
    for (let idx = 0; idx < value.length; idx += 1) {
      const item = value[idx];
      if (!item || typeof item !== 'object') continue;
      const rec = item as Record<string, unknown>;
      const rowId = sanitizeId(rec.id, `scale-${idx + 1}`);
      await upsertTableRow('auditDivisionRiskScales', {
        ...rec,
        id: rowId,
        addedBy: clampStr(rec.addedBy ?? actorEmail, 160),
        modifiedBy: clampStr(actorEmail, 160),
        modifiedAt: nowIso,
        updatedAt: nowIso,
      });
    }
  }

  await upsertTableRow('masterDatas', {
    id: safeKey,
    data: value === null || value === undefined ? 'null' : value,
    addedBy: clampStr(actorEmail, 160),
    modifiedBy: clampStr(actorEmail, 160),
    modifiedAt: nowIso,
    updatedAt: nowIso,
  });
}

export async function fetchSqlMasterDataValue(key: string): Promise<unknown> {
  if (!hasSqlConfig()) return null;
  const safeKey = sanitizeId(key);
  await getSchemaCache();

  if (safeKey === 'sizing_configs') {
    const rows = await listTableRows('sizingConfigs');
    if (rows.length > 0) {
      return rows;
    }
  }

  if (safeKey === 'audit_division_risk_scales') {
    const rows = await listTableRows('auditDivisionRiskScales');
    if (rows.length > 0) {
      return rows;
    }
  }

  const rows = await listTableRows('masterDatas');
  const match = rows.find((r) => {
    const k = strField(r, 'id');
    return k === safeKey || k === key;
  });
  if (!match) return null;

  const raw = match.data;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw ?? null;
}

export async function upsertDataConnectAppSession(session: {
  id: string;
  userId?: string;
  email?: string;
  role?: string;
  appRole?: string;
  issuedAt?: string;
  expiresAt?: string;
}): Promise<void> {
  if (!hasSqlConfig()) return;
  await getSchemaCache();
  const nowIso = new Date().toISOString();
  await upsertTableRow('appSessions', {
    tokenHash: sanitizeId(session.id, `sess-${Date.now()}`),
    userId: clampStr(session.userId ?? '', 128),
    expiresAt: session.expiresAt || nowIso,
  });
}

export async function deleteDataConnectAppSession(id: string): Promise<void> {
  if (!hasSqlConfig()) return;
  await getSchemaCache();
  await deleteTableRowById('appSessions', { tokenHash: sanitizeId(id) });
}

export async function fetchSqlWorkspaceSnapshot(includeAdminEmails: boolean): Promise<{
  engagements: Record<string, unknown>[];
  issues: Record<string, unknown>[];
  universe: Record<string, unknown>[];
  userProfiles: Record<string, unknown>[];
  frequencies: { high: number; medium: number; low: number };
}> {
  if (!hasSqlConfig()) {
    throw new Error('Firebase Data Connect service account is not configured.');
  }

  await ensureSqlSchema();

  const [engRows, wnRows, fndRows, taRows, fileRows, logRows, issueRows, uniRows, profileRows, freqRows] =
    await Promise.all([
      listTableRows('engagements'),
      listTableRows('workingNotes'),
      listTableRows('findings'),
      listTableRows('timelineActivities'),
      listTableRows('engagementFiles'),
      listTableRows('activityLogs'),
      listTableRows('issueRegisters'),
      listTableRows('universeEntities'),
      listTableRows('userProfiles'),
      listTableRows('auditFrequencies'),
    ]);

  const groupByEng = <T>(
    rows: Record<string, unknown>[],
    mapFn: (r: Record<string, unknown>) => T
  ) => {
    const map = new Map<string, T[]>();
    for (const r of rows) {
      const eid = relId(r, 'engagementId', 'engagement_id', 'engagement');
      const list = map.get(eid) ?? [];
      list.push(mapFn(r));
      map.set(eid, list);
    }
    return map;
  };

  const wnMap = groupByEng(wnRows, (r) => ({
    id: strField(r, 'id'),
    ref: strField(r, 'ref'),
    title: strField(r, 'title'),
    controlArea: strField(r, 'controlArea', 'control_area'),
    author: strField(r, 'author'),
    status: strField(r, 'status') || 'Draft',
    hasException: boolField(r, false, 'hasException', 'has_exception'),
    updatedAt: strField(r, 'updatedAt', 'updated_at'),
    testingProcedure: strField(r, 'testingProcedure', 'testing_procedure'),
    observations: optStrField(r, 'observations'),
    conclusion: strField(r, 'conclusion'),
    reviewerComments: optStrField(r, 'reviewerComments', 'reviewer_comments'),
    addedBy: optStrField(r, 'addedBy', 'added_by'),
    modifiedBy: optStrField(r, 'modifiedBy', 'modified_by'),
    modifiedAt: optStrField(r, 'modifiedAt', 'modified_at'),
  }));

  const fndMap = groupByEng(fndRows, (r) => ({
    id: strField(r, 'id'),
    ref: strField(r, 'ref'),
    title: strField(r, 'title'),
    severity: strField(r, 'severity') || 'Medium',
    category: optStrField(r, 'category') ?? 'General',
    condition: strField(r, 'condition'),
    criteria: strField(r, 'criteria'),
    cause: strField(r, 'cause'),
    effect: strField(r, 'effect'),
    recommendation: strField(r, 'recommendation'),
    owner: strField(r, 'owner'),
    targetDate: strField(r, 'targetDate', 'target_date'),
    status: strField(r, 'status') || 'Open',
    linkedNoteRef: strField(r, 'linkedNoteRef', 'linked_note_ref'),
    addedBy: optStrField(r, 'addedBy', 'added_by'),
    modifiedBy: optStrField(r, 'modifiedBy', 'modified_by'),
    modifiedAt: optStrField(r, 'modifiedAt', 'modified_at'),
  }));

  const taMap = groupByEng(taRows, (r) => ({
    id: strField(r, 'id'),
    name: strField(r, 'name'),
    roleResponsible: strField(r, 'roleResponsible', 'role_responsible'),
    dueDate: strField(r, 'dueDate', 'due_date'),
    completedDate: optStrField(r, 'completedDate', 'completed_date'),
    status: strField(r, 'status') || 'Pending',
    stageId: numField(r, 1, 'stageId', 'stage_id'),
  }));

  const fileMap = groupByEng(fileRows, (r) => ({
    id: strField(r, 'id'),
    name: strField(r, 'name'),
    folder: strField(r, 'folder'),
    size: strField(r, 'size'),
    uploadedBy: strField(r, 'uploadedBy', 'uploaded_by'),
    uploadedAt: strField(r, 'uploadedAt', 'uploaded_at'),
  }));

  const logMap = groupByEng(logRows, (r) => ({
    id: strField(r, 'id'),
    timestamp: strField(r, 'timestamp'),
    actor: strField(r, 'actor'),
    action: strField(r, 'action'),
    detail: optStrField(r, 'detail'),
  }));

  const engagements = engRows
    .map((r) => {
      const id = strField(r, 'id');
      return {
        id,
        ref: strField(r, 'ref'),
        year: numField(r, 2026, 'year'),
        title: strField(r, 'title'),
        category: strField(r, 'category'),
        department: strField(r, 'department'),
        auditDivisionId: optStrField(r, 'auditDivisionId', 'audit_division_id'),
        entityName: strField(r, 'entityName', 'entity_name'),
        likelihood: numField(r, 3, 'likelihood'),
        impact: numField(r, 3, 'impact'),
        riskScore: numField(r, 9, 'riskScore', 'risk_score'),
        riskLevel: strField(r, 'riskLevel', 'risk_level') || 'Medium',
        lead: strField(r, 'lead'),
        headReviewer: strField(r, 'headReviewer', 'head_reviewer'),
        independentReviewer:
          strField(r, 'independentReviewer', 'independent_reviewer') || 'Not needed',
        startDate: strField(r, 'startDate', 'start_date'),
        endDate: strField(r, 'endDate', 'end_date'),
        objectives: strField(r, 'objectives'),
        scope: strField(r, 'scope'),
        criteria: strField(r, 'criteria'),
        addresseeName: strField(r, 'addresseeName', 'addressee_name'),
        addresseeTitle: strField(r, 'addresseeTitle', 'addressee_title'),
        copyFurnished: strField(r, 'copyFurnished', 'copy_furnished'),
        durationDays: numField(r, 0, 'durationDays', 'duration_days'),
        budgetedHours: numField(r, 0, 'budgetedHours', 'budgeted_hours'),
        status: strField(r, 'status') || 'Planned',
        readyRatio: strField(r, 'readyRatio', 'ready_ratio') || '0/9 ready',
        lifecycleStage: numField(r, 1, 'lifecycleStage', 'lifecycle_stage'),
        fieldworkPct: numField(r, 0, 'fieldworkPct', 'fieldwork_pct'),
        fieldworkDayCurrent: numField(r, 0, 'fieldworkDayCurrent', 'fieldwork_day_current'),
        fieldworkDayTotal: numField(r, 0, 'fieldworkDayTotal', 'fieldwork_day_total'),
        reportStatus: strField(r, 'reportStatus', 'report_status') || 'Draft',
        reportRating: optStrField(r, 'reportRating', 'report_rating'),
        reportRef: strField(r, 'reportRef', 'report_ref'),
        executiveSummary: strField(r, 'executiveSummary', 'executive_summary'),
        addedBy: optStrField(r, 'addedBy', 'added_by'),
        modifiedBy: optStrField(r, 'modifiedBy', 'modified_by'),
        modifiedAt: optStrField(r, 'modifiedAt', 'modified_at'),
        workingNotes: wnMap.get(id) ?? [],
        findings: fndMap.get(id) ?? [],
        timelineActivities: taMap.get(id) ?? [],
        files: fileMap.get(id) ?? [],
        activityLog: logMap.get(id) ?? [],
      };
    })
    .sort((a, b) => a.ref.localeCompare(b.ref));

  const issues = issueRows
    .map((r) => ({
      id: strField(r, 'id'),
      ref: strField(r, 'ref'),
      title: strField(r, 'title'),
      auditRef: strField(r, 'auditRef', 'audit_ref'),
      auditTitle: strField(r, 'auditTitle', 'audit_title'),
      severity: strField(r, 'severity') || 'Medium',
      owner: strField(r, 'owner'),
      ownerUnit: strField(r, 'ownerUnit', 'owner_unit'),
      originalDue: strField(r, 'originalDue', 'original_due'),
      currentDue: strField(r, 'currentDue', 'current_due'),
      extensionCount: numField(r, 0, 'extensionCount', 'extension_count'),
      daysStatus: strField(r, 'daysStatus', 'days_status'),
      isOverdue: boolField(r, false, 'isOverdue', 'is_overdue'),
      isDueSoon: boolField(r, false, 'isDueSoon', 'is_due_soon'),
      status: strField(r, 'status') || 'Open',
      actionPlanSummary: strField(r, 'actionPlanSummary', 'action_plan_summary'),
      evidenceNote: optStrField(r, 'evidenceNote', 'evidence_note'),
      extensionReason: optStrField(r, 'extensionReason', 'extension_reason'),
      addedBy: optStrField(r, 'addedBy', 'added_by'),
      modifiedBy: optStrField(r, 'modifiedBy', 'modified_by'),
      modifiedAt: optStrField(r, 'modifiedAt', 'modified_at'),
    }))
    .sort((a, b) => a.ref.localeCompare(b.ref));

  const universe = uniRows
    .map((r) => ({
      id: strField(r, 'id'),
      code: strField(r, 'code'),
      name: strField(r, 'name'),
      division: strField(r, 'division'),
      auditDivisionId: optStrField(r, 'auditDivisionId', 'audit_division_id'),
      category: strField(r, 'category'),
      likelihood: numField(r, 3, 'likelihood'),
      impact: numField(r, 3, 'impact'),
      riskScore: numField(r, 9, 'riskScore', 'risk_score'),
      riskLevel: strField(r, 'riskLevel', 'risk_level') || 'Medium',
      lastAudited: strField(r, 'lastAudited', 'last_audited'),
      nextDue: strField(r, 'nextDue', 'next_due'),
      cycleMonths: numField(r, 12, 'cycleMonths', 'cycle_months'),
      defaultLead: strField(r, 'defaultLead', 'default_lead'),
      riskNotes: strField(r, 'riskNotes', 'risk_notes'),
      addedBy: optStrField(r, 'addedBy', 'added_by'),
      modifiedBy: optStrField(r, 'modifiedBy', 'modified_by'),
      modifiedAt: optStrField(r, 'modifiedAt', 'modified_at'),
    }))
    .sort((a, b) => a.code.localeCompare(b.code));

  const userProfiles = profileRows.map((r) => ({
    id: strField(r, 'id'),
    name: strField(r, 'name'),
    email: includeAdminEmails ? optStrField(r, 'email') : undefined,
    roleTitle: strField(r, 'roleTitle', 'role_title'),
    fullLabel: strField(r, 'fullLabel', 'full_label'),
    headerSubtitle: strField(r, 'headerSubtitle', 'header_subtitle'),
    department: strField(r, 'department'),
    canApproveHead: boolField(r, false, 'canApproveHead', 'can_approve_head'),
    canApproveIndependent: boolField(r, false, 'canApproveIndependent', 'can_approve_independent'),
    canApproveCAE: boolField(r, false, 'canApproveCae'),
    employeeNumber: optStrField(r, 'employeeNumber', 'employee_number'),
    lastLoginDate: optStrField(r, 'lastLoginDate', 'last_login_date'),
    accountModifiedAt: optStrField(r, 'accountModifiedAt', 'account_modified_at'),
    accountStatus: strField(r, 'accountStatus', 'account_status') || 'Active',
    failedLoginCount: numField(r, 0, 'failedLoginCount', 'failed_login_count'),
    isLocked: boolField(r, false, 'isLocked', 'is_locked'),
    requiresPasswordChange: boolField(
      r,
      false,
      'requiresPasswordChange',
      'requires_password_change'
    ),
    passwordHistory: Array.isArray(r.passwordHistory)
      ? r.passwordHistory.filter((item): item is string => typeof item === 'string')
      : [],
    mfaEnabled: boolField(r, false, 'mfaEnabled', 'mfa_enabled'),
    isPrivileged: boolField(r, false, 'isPrivileged', 'is_privileged'),
  }));

  const freqRow = freqRows.find((r) => strField(r, 'id') === 'global') ?? freqRows[0];
  const frequencies = {
    high: freqRow ? numField(freqRow, 12, 'high') : 12,
    medium: freqRow ? numField(freqRow, 36, 'medium') : 36,
    low: freqRow ? numField(freqRow, 48, 'low') : 48,
  };

  return { engagements, issues, universe, userProfiles, frequencies };
}

export async function syncWorkspaceSnapshotToSql(
  snapshot: {
    engagements?: Record<string, unknown>[];
    issues?: Record<string, unknown>[];
    universe?: Record<string, unknown>[];
    userProfiles?: Record<string, unknown>[];
    systemUsers?: Record<string, unknown>[];
    frequencies?: { high: number; medium: number; low: number };
    masterData?: Record<string, unknown>;
  },
  actorEmail: string
): Promise<{ syncedCount: number }> {
  if (!hasSqlConfig()) {
    throw new Error('Firebase Data Connect service account is not configured.');
  }
  await ensureSqlSchema();

  let syncedCount = 0;

  if (snapshot.frequencies) {
    await saveSqlFrequencies(snapshot.frequencies, actorEmail);
    syncedCount += 1;
  }

  for (const sysUser of snapshot.systemUsers ?? []) {
    const email = typeof sysUser.email === 'string' ? sysUser.email.trim().toLowerCase() : '';
    if (!email) continue;
    await upsertSqlSystemUser({
      id: String(sysUser.id ?? ''),
      username: String(sysUser.username ?? email.split('@')[0]),
      fullName: String(sysUser.fullName ?? email.split('@')[0]),
      email,
      role: sysUser.role === 'admin' ? 'admin' : 'user',
      appRole: typeof sysUser.appRole === 'string' ? sysUser.appRole : undefined,
      scope: typeof sysUser.scope === 'string' ? sysUser.scope : undefined,
      employeeNumber: typeof sysUser.employeeNumber === 'string' ? sysUser.employeeNumber : undefined,
      isActive: sysUser.isActive !== false,
      isLocked: sysUser.isLocked === true,
    });
    syncedCount += 1;
  }

  for (const profile of snapshot.userProfiles ?? []) {
    await upsertSqlUserProfile(profile, actorEmail);
    syncedCount += 1;
  }

  for (const entity of snapshot.universe ?? []) {
    await upsertSqlUniverseEntity(entity, actorEmail);
    syncedCount += 1;
  }

  for (const issue of snapshot.issues ?? []) {
    await upsertSqlIssue(issue, actorEmail);
    syncedCount += 1;
  }

  for (const eng of snapshot.engagements ?? []) {
    await upsertSqlEngagement(eng, actorEmail);
    const engId = String(eng.id ?? '');
    if (engId) {
      for (const wn of Array.isArray(eng.workingNotes)
        ? (eng.workingNotes as Record<string, unknown>[])
        : []) {
        await upsertSqlWorkingNote(engId, wn, actorEmail);
      }
      for (const fnd of Array.isArray(eng.findings)
        ? (eng.findings as Record<string, unknown>[])
        : []) {
        await upsertSqlFinding(engId, fnd, actorEmail);
      }
      for (const ta of Array.isArray(eng.timelineActivities)
        ? (eng.timelineActivities as Record<string, unknown>[])
        : []) {
        await upsertSqlTimelineActivity(engId, ta);
      }
      for (const fl of Array.isArray(eng.files)
        ? (eng.files as Record<string, unknown>[])
        : []) {
        await insertSqlFile(engId, fl);
      }
      for (const lg of Array.isArray(eng.activityLog)
        ? (eng.activityLog as Record<string, unknown>[])
        : []) {
        await insertSqlActivityLog(engId, lg);
      }
    }
    syncedCount += 1;
  }

  if (snapshot.masterData && typeof snapshot.masterData === 'object') {
    for (const [k, v] of Object.entries(snapshot.masterData)) {
      await saveSqlMasterData(k, v, actorEmail);
      syncedCount += 1;
    }
  }

  return { syncedCount };
}
