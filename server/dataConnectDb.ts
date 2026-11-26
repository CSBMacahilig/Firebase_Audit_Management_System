import {
  DATA_CONNECT_CONFIG,
  getAdminDataConnect,
  getFirebaseAdminApp,
  getServiceAccountConfigError,
  hasServiceAccountKey,
} from './firebaseAdmin.ts';
import {
  deleteActivityLog,
  deleteAppSession,
  deleteAuditDivisionRiskScale,
  deleteAuditFrequency,
  deleteEngagement,
  deleteEngagementFile,
  deleteFinding,
  deleteIssueRegister,
  deleteMasterData,
  deleteSizingConfig,
  deleteSystemUser,
  deleteTimelineActivity,
  deleteUniverseEntity,
  deleteUserProfile,
  deleteWorkingNote,
  upsertActivityLog,
  upsertAppSession,
  upsertAuditDivisionRiskScale,
  upsertAuditFrequency,
  upsertEngagement,
  upsertEngagementFile,
  upsertFinding,
  upsertIssueRegister,
  upsertMasterData,
  upsertSizingConfig,
  upsertSystemUser,
  upsertTimelineActivity,
  upsertUniverseEntity,
  upsertUserProfile,
  upsertWorkingNote,
} from '../src/dataconnect-admin-generated/esm/index.esm.js';
import type {
  UpsertActivityLogVariables,
  UpsertAppSessionVariables,
  UpsertAuditDivisionRiskScaleVariables,
  UpsertAuditFrequencyVariables,
  UpsertEngagementFileVariables,
  UpsertEngagementVariables,
  UpsertFindingVariables,
  UpsertIssueRegisterVariables,
  UpsertMasterDataVariables,
  UpsertSizingConfigVariables,
  UpsertSystemUserVariables,
  UpsertTimelineActivityVariables,
  UpsertUniverseEntityVariables,
  UpsertUserProfileVariables,
  UpsertWorkingNoteVariables,
} from '../src/dataconnect-admin-generated/index.d.ts';

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
  singularQueryFieldName: string | null;
  singularKeyArgName: string | null;
  singularKeyInputFields?: Map<string, GqlTypeRef>;
  singularKeyArgType?: GqlTypeRef;
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
  { queries: string[]; upserts: string[]; deletes: string[] }
> = {
  userProfiles: {
    queries: ['userProfiles', 'userProfileList'],
    upserts: ['userProfile_upsert'],
    deletes: ['userProfile_delete'],
  },
  systemUsers: {
    queries: ['systemUsers', 'systemUserList'],
    upserts: ['systemUser_upsert'],
    deletes: ['systemUser_delete'],
  },
  engagements: {
    queries: ['engagements', 'engagementList'],
    upserts: ['engagement_upsert'],
    deletes: ['engagement_delete'],
  },
  workingNotes: {
    queries: ['workingNotes', 'workingNoteList'],
    upserts: ['workingNote_upsert'],
    deletes: ['workingNote_delete'],
  },
  findings: {
    queries: ['findings', 'findingList'],
    upserts: ['finding_upsert'],
    deletes: ['finding_delete'],
  },
  timelineActivities: {
    queries: ['timelineActivities', 'timelineActivityList'],
    upserts: ['timelineActivity_upsert'],
    deletes: ['timelineActivity_delete'],
  },
  engagementFiles: {
    queries: ['engagementFiles', 'engagementFileList'],
    upserts: ['engagementFile_upsert'],
    deletes: ['engagementFile_delete'],
  },
  activityLogs: {
    queries: ['activityLogs', 'activityLogList'],
    upserts: ['activityLog_upsert'],
    deletes: ['activityLog_delete'],
  },
  issueRegisters: {
    queries: ['issueRegisters', 'issueRegister', 'issuesRegisters', 'issueRegisterList'],
    upserts: ['issueRegister_upsert', 'issuesRegister_upsert'],
    deletes: ['issueRegister_delete', 'issuesRegister_delete'],
  },
  universeEntities: {
    queries: ['universeEntities', 'universeEntityList'],
    upserts: ['universeEntity_upsert'],
    deletes: ['universeEntity_delete'],
  },
  sizingConfigs: {
    queries: ['sizingConfigs', 'sizingConfigList'],
    upserts: ['sizingConfig_upsert'],
    deletes: ['sizingConfig_delete'],
  },
  auditFrequencies: {
    queries: ['auditFrequencies', 'auditFrequencyList'],
    upserts: ['auditFrequency_upsert'],
    deletes: ['auditFrequency_delete'],
  },
  masterDatas: {
    queries: ['masterDatas', 'masterData', 'masterDataList'],
    upserts: ['masterData_upsert'],
    deletes: ['masterData_delete'],
  },
  auditDivisionRiskScales: {
    queries: ['auditDivisionRiskScales', 'auditDivisionRiskScaleList'],
    upserts: ['auditDivisionRiskScale_upsert'],
    deletes: ['auditDivisionRiskScale_delete'],
  },
  appSessions: {
    queries: ['appSessions', 'appSessionList'],
    upserts: ['appSession_upsert'],
    deletes: ['appSession_delete'],
  },
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
          args { name }
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

export class DataConnectHttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'DataConnectHttpError';
    this.statusCode = statusCode;
  }
}

function isOperationNotFoundError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err ?? '')).toLowerCase();
  const code =
    err && typeof err === 'object' && 'code' in err
      ? String((err as { code?: unknown }).code ?? '').toLowerCase()
      : '';
  return (
    code.includes('not-found') ||
    code.includes('unimplemented') ||
    msg.includes('operation') && (msg.includes('not found') || msg.includes('does not exist')) ||
    msg.includes('unknown operation')
  );
}

function toFriendlyDataConnectError(err: unknown): DataConnectHttpError {
  if (err instanceof DataConnectHttpError) return err;
  const rawMsg = err instanceof Error ? err.message : String(err ?? 'Unknown error');
  const lower = rawMsg.toLowerCase();

  if (
    rawMsg.includes('PERMISSION_DENIED') ||
    lower.includes('permission denied') ||
    rawMsg.includes('403')
  ) {
    return new DataConnectHttpError(
      `Firebase Data Connect permission denied on service ${DATA_CONNECT_CONFIG.serviceId} (${DATA_CONNECT_CONFIG.location}). Ensure the Firebase Admin service account has the Firebase Data Connect Admin role (roles/firebasedataconnect.admin) in Google Cloud IAM.`,
      403
    );
  }
  if (
    lower.includes('duplicate key') ||
    lower.includes('unique constraint') ||
    lower.includes('already exists') ||
    rawMsg.includes('ALREADY_EXISTS') ||
    rawMsg.includes('23505')
  ) {
    return new DataConnectHttpError(
      `Conflict saving to Firebase Data Connect: a record with the same unique code, reference, or username already exists. (${rawMsg})`,
      409
    );
  }
  if (
    lower.includes('invalid_argument') ||
    lower.includes('cannot return null') ||
    lower.includes('expected type') ||
    lower.includes('must not be null') ||
    lower.includes('not-null constraint') ||
    rawMsg.includes('23502')
  ) {
    return new DataConnectHttpError(
      `Invalid data for Firebase Data Connect schema: ${rawMsg}`,
      400
    );
  }
  return new DataConnectHttpError(rawMsg || 'Firebase Data Connect request failed.', 500);
}

export function hasSqlConfig(): boolean {
  return hasServiceAccountKey() && getServiceAccountConfigError() === null;
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
          const findQueryField = (): GqlFieldDef | undefined => {
            for (const candidate of operation.queries) {
              const f = queryFields.find((field) => field.name === candidate);
              if (f && unwrapType(f.type).isList) return f;
            }
            const normalizedCandidates = new Set(operation.queries.map(normalizeName));
            const normalizedListMatch = queryFields.find(
              (field) =>
                normalizedCandidates.has(normalizeName(field.name)) &&
                unwrapType(field.type).isList
            );
            if (normalizedListMatch) return normalizedListMatch;
            for (const candidate of operation.queries) {
              const f = queryFields.find((field) => field.name === candidate);
              if (f) return f;
            }
            return undefined;
          };
          const findMutationField = (candidates: string[]): GqlFieldDef | undefined => {
            for (const candidate of candidates) {
              const f = mutationFields.find((field) => field.name === candidate);
              if (f) return f;
            }
            return undefined;
          };

          const findSingularQueryField = (listFieldName: string): GqlFieldDef | undefined => {
            const singularBase = listFieldName.endsWith('ies')
              ? `${listFieldName.slice(0, -3)}y`
              : listFieldName.endsWith('s')
                ? listFieldName.slice(0, -1)
                : listFieldName;
            const match = queryFields.find(
              (f) =>
                !unwrapType(f.type).isList &&
                (f.name === singularBase || normalizeName(f.name) === normalizeName(singularBase)) &&
                Boolean(f.args?.length)
            );
            return match;
          };

          const matchedQuery = findQueryField();
          const matchedUpsert = findMutationField(operation.upserts);
          const matchedDelete = findMutationField(operation.deletes);
          if (!matchedQuery || !matchedUpsert || !matchedDelete) {
            const missingOperations = [
              !matchedQuery ? operation.queries[0] : '',
              !matchedUpsert ? operation.upserts[0] : '',
              !matchedDelete ? operation.deletes[0] : '',
            ].filter(Boolean);
            throw new Error(
              `Firebase Data Connect schema is missing expected operations: ${missingOperations.join(', ')}.`
            );
          }

          const matchedSingularQuery = findSingularQueryField(matchedQuery.name);
          const singularKeyArg = matchedSingularQuery?.args?.find((a) => {
            const info = unwrapType(a.type);
            return info.baseKind === 'INPUT_OBJECT' || a.name === 'id' || a.name === 'tokenHash';
          });
          let singularKeyInputFields: Map<string, GqlTypeRef> | undefined;
          if (singularKeyArg) {
            const sInfo = unwrapType(singularKeyArg.type);
            if (sInfo.baseKind === 'INPUT_OBJECT' && sInfo.baseName) {
              const sDef = typesByName.get(sInfo.baseName);
              singularKeyInputFields = new Map<string, GqlTypeRef>();
              for (const sf of sDef?.inputFields ?? []) {
                singularKeyInputFields.set(sf.name, sf.type);
              }
            }
          }

          const returnTypeInfo = unwrapType(matchedQuery.type);
          const objType = returnTypeInfo.baseName ? typesByName.get(returnTypeInfo.baseName) : undefined;
          const selectParts: string[] = [];

          for (const field of objType?.fields ?? []) {
            if (
              field.name.startsWith('_') ||
              /_(count|min|max|sum|avg)$/i.test(field.name) ||
              (field.args && field.args.length > 0)
            ) {
              continue;
            }
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
            singularQueryFieldName: matchedSingularQuery?.name ?? null,
            singularKeyArgName: singularKeyArg?.name ?? null,
            singularKeyInputFields,
            singularKeyArgType: singularKeyArg?.type,
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
  if (info.isList) {
    if (rawVal === undefined || rawVal === null) {
      return fallbackForRequired || info.isNonNull ? [] : undefined;
    }
    const items = Array.isArray(rawVal) ? rawVal : [];
    const elemType: GqlTypeRef = { name: info.baseName, kind: info.baseKind };
    return items
      .map((item) => coerceValueForInputField(item, elemType, typesByName, true))
      .filter((item) => item !== undefined);
  }
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
    return fallbackForRequired || info.isNonNull ? new Date().toISOString() : undefined;
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

async function readTableRowByKey(
  tableKey: TableKey,
  keyField: string,
  keyValue: string
): Promise<Record<string, unknown> | null> {
  const cache = await getSchemaCache();
  const meta = cache.tables.get(tableKey);
  if (!meta) {
    throw new DataConnectHttpError(
      `Firebase Data Connect query for "${tableKey}" is not available.`,
      500
    );
  }

  const dc = getAdminDataConnect();
  if (meta.singularQueryFieldName && meta.singularKeyArgName && meta.singularKeyArgType) {
    const info = unwrapType(meta.singularKeyArgType);
    if (info.baseName) {
      const typeSuffix = info.isNonNull ? '!' : '';
      const argVar =
        meta.singularKeyInputFields && meta.singularKeyInputFields.size > 0
          ? { [keyField]: keyValue }
          : keyValue;
      const query = `query Get_${tableKey}($${meta.singularKeyArgName}: ${info.baseName}${typeSuffix}) { ${meta.singularQueryFieldName}(${meta.singularKeyArgName}: $${meta.singularKeyArgName}) { ${meta.selectClause} } }`;
      try {
        const res = await dc.executeGraphqlRead<
          Record<string, Record<string, unknown> | null>,
          Record<string, unknown>
        >(query, { variables: { [meta.singularKeyArgName]: argVar } });
        const row = res.data?.[meta.singularQueryFieldName];
        return row && typeof row === 'object' ? row : null;
      } catch {
        // Fall back to listTableRows below if singular lookup fails
      }
    }
  }

  const rows = await listTableRows(tableKey);
  return rows.find((row) => strField(row, keyField) === keyValue) ?? null;
}

async function verifyRowPersisted(
  tableKey: TableKey,
  keyField: string,
  keyValue: string
): Promise<Record<string, unknown>> {
  const row = await readTableRowByKey(tableKey, keyField, keyValue);
  if (!row) {
    throw new DataConnectHttpError(
      `Write verification failed: "${keyValue}" in ${tableKey} was not persisted in Firebase Data Connect.`,
      500
    );
  }
  return row;
}

async function verifyRowDeleted(
  tableKey: TableKey,
  keyField: string,
  keyValue: string
): Promise<void> {
  const row = await readTableRowByKey(tableKey, keyField, keyValue);
  if (row) {
    throw new DataConnectHttpError(
      `Delete verification failed: "${keyValue}" in ${tableKey} still exists in Firebase Data Connect.`,
      500
    );
  }
}

async function resolveAddedBy(
  tableKey: TableKey,
  keyField: string,
  keyValue: string,
  incomingAddedBy: unknown,
  actorEmail: string
): Promise<string> {
  if (typeof incomingAddedBy === 'string' && incomingAddedBy.trim()) {
    return clampStr(incomingAddedBy, 160);
  }
  try {
    const existing = await readTableRowByKey(tableKey, keyField, keyValue);
    const existingAddedBy = existing ? optStrField(existing, 'addedBy', 'added_by') : undefined;
    if (existingAddedBy) return existingAddedBy;
  } catch {
    // Fall back to actorEmail if pre-read fails
  }
  return clampStr(actorEmail, 160) || 'system';
}

async function upsertTableRow(
  tableKey: TableKey,
  canonicalPayload: Record<string, unknown>
): Promise<void> {
  const cache = await getSchemaCache();
  const meta = cache.tables.get(tableKey);
  if (!meta || !meta.upsertMutationName || !meta.upsertInputTypeName) {
    throw new DataConnectHttpError(
      `Firebase Data Connect table "${tableKey}" upsert mutation is not available.`,
      500
    );
  }

  const aliasMap = buildFieldAliases(canonicalPayload);
  const dataPayload: Record<string, unknown> = {};
  const nowIso = new Date().toISOString();

  for (const [fieldName, fieldType] of meta.upsertInputFields.entries()) {
    // Never pass *_expr fields inside GraphQL runtime variables; use explicit Timestamp strings instead.
    if (fieldName.endsWith('_expr')) continue;

    let rawVal = aliasMap.get(fieldName);
    if (rawVal === undefined) {
      rawVal = aliasMap.get(normalizeName(fieldName));
    }
    if (rawVal === undefined && fieldName === 'engagement') {
      rawVal = aliasMap.get('engagementId');
    }
    if (
      rawVal === undefined &&
      (fieldName === 'createdAt' || fieldName === 'updatedAt' || fieldName === 'modifiedAt')
    ) {
      rawVal = nowIso;
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
    const res = await dc.executeGraphql<Record<string, unknown>, { data: Record<string, unknown> }>(
      mutation,
      { variables: { data: dataPayload } }
    );
    const resultKey = res.data?.[meta.upsertMutationName];
    if (!resultKey) {
      throw new DataConnectHttpError(
        `Firebase Data Connect ${meta.upsertMutationName} returned no key.`,
        500
      );
    }
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
    throw new DataConnectHttpError(
      `Firebase Data Connect table "${tableKey}" delete mutation is not available.`,
      500
    );
  }

  const varDefs: string[] = [];
  const callArgs: string[] = [];
  const variables: Record<string, unknown> = {};

  // Data Connect delete mutations fail if both `id` and `key` arguments are passed.
  // Prefer `key` (INPUT_OBJECT) when present, otherwise pass the scalar key argument(s).
  const keyArg = meta.deleteArgs.find((a) => Boolean(a.keyInputFields));
  const selectedArgs = keyArg ? [keyArg] : meta.deleteArgs;

  for (const arg of selectedArgs) {
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

async function executeVerifiedSdkUpsert<TData extends Record<string, unknown>>(
  tableKey: TableKey,
  keyField: string,
  keyValue: string,
  sdkCall: (dc: ReturnType<typeof getAdminDataConnect>) => Promise<{ data: TData }>,
  fallbackPayload: Record<string, unknown>
): Promise<void> {
  const dc = getAdminDataConnect();
  try {
    const res = await sdkCall(dc);
    const keyEntries = Object.values(res.data ?? {}).filter((v) => v !== null && v !== undefined);
    if (keyEntries.length === 0) {
      throw new DataConnectHttpError(
        `Firebase Data Connect ${tableKey} upsert returned an empty response.`,
        500
      );
    }
  } catch (err) {
    if (!isOperationNotFoundError(err)) {
      throw toFriendlyDataConnectError(err);
    }
    await upsertTableRow(tableKey, fallbackPayload);
  }
  await verifyRowPersisted(tableKey, keyField, keyValue);
}

async function executeVerifiedSdkDelete<TData extends Record<string, unknown>>(
  tableKey: TableKey,
  keyField: string,
  keyValue: string,
  sdkCall: (dc: ReturnType<typeof getAdminDataConnect>) => Promise<{ data: TData }>,
  fallbackKeyValues: Record<string, string>
): Promise<void> {
  const dc = getAdminDataConnect();
  try {
    await sdkCall(dc);
  } catch (err) {
    if (!isOperationNotFoundError(err)) {
      throw toFriendlyDataConnectError(err);
    }
    await deleteTableRowById(tableKey, fallbackKeyValues);
  }
  await verifyRowDeleted(tableKey, keyField, keyValue);
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

export async function inspectDataConnectTables(): Promise<{
  serviceId: string;
  location: string;
  connector: string;
  tables: Array<{ key: TableKey; queryFieldName: string; rowCount: number }>;
}> {
  if (!hasSqlConfig()) {
    throw new Error('Firebase Data Connect service account is not configured.');
  }
  const cache = await getSchemaCache();
  const tableKeys = Object.keys(TABLE_OPERATIONS) as TableKey[];
  const counts = await Promise.all(
    tableKeys.map(async (key) => {
      const rows = await listTableRows(key);
      const meta = cache.tables.get(key);
      return {
        key,
        queryFieldName: meta?.queryFieldName ?? key,
        rowCount: rows.length,
      };
    })
  );
  return {
    serviceId: DATA_CONNECT_CONFIG.serviceId,
    location: DATA_CONNECT_CONFIG.location,
    connector: DATA_CONNECT_CONFIG.connector,
    tables: counts,
  };
}

async function getRegistryRolesMap(): Promise<
  Map<string, { appRole?: string; scope?: string; employeeNumber?: string; name?: string }>
> {
  const map = new Map<
    string,
    { appRole?: string; scope?: string; employeeNumber?: string; name?: string }
  >();
  try {
    const raw = await fetchSqlMasterDataValue('access_users_registry');
    if (Array.isArray(raw)) {
      for (const item of raw) {
        if (!item || typeof item !== 'object') continue;
        const rec = item as Record<string, unknown>;
        const mail = typeof rec.email === 'string' ? rec.email.trim().toLowerCase() : '';
        if (!mail) continue;
        const roles = Array.isArray(rec.roles) ? rec.roles : [];
        const firstRole = typeof roles[0] === 'string' ? roles[0].trim() : undefined;
        map.set(mail, {
          appRole: firstRole,
          scope: typeof rec.scope === 'string' ? rec.scope : undefined,
          employeeNumber: typeof rec.employeeNumber === 'string' ? rec.employeeNumber : undefined,
          name: typeof rec.name === 'string' ? rec.name : undefined,
        });
      }
    }
  } catch {
    // Optional enrichment only
  }
  return map;
}

export async function listSqlSystemUsers(): Promise<SqlSystemUserRecord[]> {
  if (!hasSqlConfig()) return [];
  const [rows, registryMap] = await Promise.all([
    listTableRows('systemUsers'),
    getRegistryRolesMap(),
  ]);
  return rows.map((r) => {
    const email = strField(r, 'email').toLowerCase();
    const reg = registryMap.get(email);
    return {
      id: strField(r, 'id'),
      username: strField(r, 'username'),
      fullName: strField(r, 'fullName', 'full_name'),
      email,
      role: strField(r, 'role') === 'admin' ? 'admin' : 'user',
      appRole: optStrField(r, 'appRole', 'app_role') ?? reg?.appRole,
      scope: optStrField(r, 'scope') ?? reg?.scope,
      employeeNumber: optStrField(r, 'employeeNumber', 'employee_number') ?? reg?.employeeNumber,
      isActive: boolField(r, true, 'isActive', 'is_active'),
      isLocked: boolField(r, false, 'isLocked', 'is_locked'),
      lastLogin: optStrField(r, 'lastLogin', 'last_login') ?? null,
      modifiedAt: optStrField(r, 'modifiedAt', 'modified_at'),
    };
  });
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
  failedLoginCount?: number;
  lastLogin?: string | null;
}, actorEmail = 'system'): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const mail = clampStr(user.email.toLowerCase(), 160);
  if (!mail) {
    throw new DataConnectHttpError('System user email is required.', 400);
  }
  const existing = (await listTableRows('systemUsers')).find(
    (row) => strField(row, 'email').trim().toLowerCase() === mail
  );
  const safeId = sanitizeId(
    optStrField(existing ?? {}, 'id') ||
      user.id ||
      `sys_${mail.replace(/[^a-z0-9]/g, '_')}`
  );
  const nowIso = new Date().toISOString();
  const addedBy = optStrField(existing ?? {}, 'addedBy', 'added_by') ?? clampStr(actorEmail, 160);
  const modifiedBy = clampStr(actorEmail, 160);

  const vars: UpsertSystemUserVariables = {
    id: safeId,
    username: clampStr(
      user.username || optStrField(existing ?? {}, 'username') || mail.split('@')[0],
      80
    ),
    fullName: clampStr(
      user.fullName || optStrField(existing ?? {}, 'fullName', 'full_name') || mail.split('@')[0],
      160
    ),
    email: mail,
    role: user.role === 'admin' ? 'admin' : 'user',
    passwordHash: strField(existing ?? {}, 'passwordHash', 'password_hash') || '',
    isActive: Boolean(user.isActive),
    isLocked: Boolean(user.isLocked),
    failedLoginCount:
      typeof user.failedLoginCount === 'number'
        ? Math.max(0, Math.round(user.failedLoginCount))
        : numField(existing ?? {}, 0, 'failedLoginCount', 'failed_login_count'),
    requiresPasswordChange: boolField(
      existing ?? {},
      false,
      'requiresPasswordChange',
      'requires_password_change'
    ),
    addedBy,
    modifiedBy,
  };

  await executeVerifiedSdkUpsert(
    'systemUsers',
    'id',
    safeId,
    (dc) => upsertSystemUser(dc, vars),
    {
      ...vars,
      lastLogin:
        user.lastLogin !== undefined
          ? user.lastLogin
          : optStrField(existing ?? {}, 'lastLogin', 'last_login') ?? null,
      createdAt: optStrField(existing ?? {}, 'createdAt', 'created_at') ?? nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function unlockSqlSystemUser(id: string, email: string | undefined, actorEmail: string): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const rows = await listTableRows('systemUsers');
  const normEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const match =
    rows.find((r) => strField(r, 'id') === id) ??
    (normEmail ? rows.find((r) => strField(r, 'email').trim().toLowerCase() === normEmail) : undefined);
  if (!match) {
    throw new DataConnectHttpError('System user not found in Firebase Data Connect.', 404);
  }
  const safeId = strField(match, 'id');
  const nowIso = new Date().toISOString();
  const vars: UpsertSystemUserVariables = {
    id: safeId,
    username: strField(match, 'username'),
    fullName: strField(match, 'fullName', 'full_name'),
    email: strField(match, 'email').toLowerCase(),
    role: strField(match, 'role') === 'admin' ? 'admin' : 'user',
    passwordHash: strField(match, 'passwordHash', 'password_hash') || '',
    isActive: boolField(match, true, 'isActive', 'is_active'),
    isLocked: false,
    failedLoginCount: 0,
    requiresPasswordChange: boolField(
      match,
      false,
      'requiresPasswordChange',
      'requires_password_change'
    ),
    addedBy: optStrField(match, 'addedBy', 'added_by') ?? clampStr(actorEmail, 160),
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'systemUsers',
    'id',
    safeId,
    (dc) => upsertSystemUser(dc, vars),
    {
      ...vars,
      lastLogin: optStrField(match, 'lastLogin', 'last_login') ?? null,
      createdAt: optStrField(match, 'createdAt', 'created_at') ?? nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function recordSqlUserLogin(email: string): Promise<void> {
  if (!hasSqlConfig()) return;
  const mail = email.trim().toLowerCase();
  if (!mail) return;
  const existing = (await listTableRows('systemUsers')).find(
    (row) => strField(row, 'email').trim().toLowerCase() === mail
  );
  if (!existing) return;
  const safeId = strField(existing, 'id');
  const nowIso = new Date().toISOString();
  await upsertTableRow('systemUsers', {
    id: safeId,
    username: strField(existing, 'username'),
    fullName: strField(existing, 'fullName', 'full_name'),
    email: mail,
    role: strField(existing, 'role') === 'admin' ? 'admin' : 'user',
    passwordHash: strField(existing, 'passwordHash', 'password_hash') || '',
    isActive: boolField(existing, true, 'isActive', 'is_active'),
    isLocked: boolField(existing, false, 'isLocked', 'is_locked'),
    failedLoginCount: 0,
    requiresPasswordChange: boolField(
      existing,
      false,
      'requiresPasswordChange',
      'requires_password_change'
    ),
    lastLogin: nowIso,
    addedBy: optStrField(existing, 'addedBy', 'added_by') ?? mail,
    modifiedBy: mail,
    createdAt: optStrField(existing, 'createdAt', 'created_at') ?? nowIso,
    modifiedAt: nowIso,
  });
  await verifyRowPersisted('systemUsers', 'id', safeId);
}

export async function deleteSqlSystemUserByEmail(email: string): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const mail = clampStr(email.toLowerCase(), 160);
  if (!mail) return;
  const existing = await findSqlSystemUserByEmail(mail);
  if (!existing) return;
  const safeId = existing.id;
  await executeVerifiedSdkDelete(
    'systemUsers',
    'id',
    safeId,
    (dc) => deleteSystemUser(dc, { id: safeId }),
    { id: safeId, email: mail }
  );
}

export async function upsertSqlUserProfile(
  profile: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeId = sanitizeId(profile.id, 'user');
  const nowIso = new Date().toISOString();
  const existing = await readTableRowByKey('userProfiles', 'id', safeId);
  const existingAddedBy = existing ? optStrField(existing, 'addedBy', 'added_by') : undefined;
  const passwordHistory = (
    Array.isArray(profile.passwordHistory)
      ? profile.passwordHistory
      : Array.isArray(existing?.passwordHistory)
        ? existing.passwordHistory
        : []
  ).filter((item): item is string => typeof item === 'string');

  const vars: UpsertUserProfileVariables = {
    id: safeId,
    name: clampStr(profile.name, 160, 'User') || 'User',
    roleTitle: clampStr(profile.roleTitle, 160),
    fullLabel: clampStr(profile.fullLabel, 240),
    headerSubtitle: clampStr(profile.headerSubtitle, 160),
    department: clampStr(profile.department, 160),
    canApproveHead: Boolean(profile.canApproveHead),
    canApproveIndependent: Boolean(profile.canApproveIndependent),
    canApproveCae: Boolean(profile.canApproveCAE ?? profile.canApproveCae),
    employeeNumber:
      typeof profile.employeeNumber === 'string' && profile.employeeNumber.trim()
        ? clampStr(profile.employeeNumber, 64)
        : null,
    accountStatus: clampStr(profile.accountStatus, 40, 'Active') || 'Active',
    failedLoginCount: Math.round(clampNum(profile.failedLoginCount ?? 0, 0, 100, 0)),
    isLocked: Boolean(profile.isLocked),
    requiresPasswordChange: Boolean(profile.requiresPasswordChange),
    passwordHistory,
    mfaEnabled: Boolean(profile.mfaEnabled),
    isPrivileged: Boolean(profile.isPrivileged),
    addedBy:
      typeof profile.addedBy === 'string' && profile.addedBy.trim()
        ? clampStr(profile.addedBy, 160)
        : existingAddedBy ?? clampStr(actorEmail, 160),
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'userProfiles',
    'id',
    safeId,
    (dc) => upsertUserProfile(dc, vars),
    {
      ...vars,
      createdAt: (existing ? optStrField(existing, 'createdAt', 'created_at') : undefined) ?? nowIso,
      updatedAt: nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function deleteSqlUserProfile(id: string): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeId = sanitizeId(id);
  await executeVerifiedSdkDelete(
    'userProfiles',
    'id',
    safeId,
    (dc) => deleteUserProfile(dc, { id: safeId }),
    { id: safeId }
  );
}

export async function upsertSqlEngagement(
  eng: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeId = sanitizeId(eng.id, 'eng');
  const ref = clampStr(eng.ref, 40);
  const title = clampStr(eng.title, 240, 'Untitled Engagement') || 'Untitled Engagement';
  if (!ref) {
    throw new DataConnectHttpError('Engagement reference (ref) is required.', 400);
  }
  const nowIso = new Date().toISOString();
  const addedBy = await resolveAddedBy('engagements', 'id', safeId, eng.addedBy, actorEmail);

  const vars: UpsertEngagementVariables = {
    id: safeId,
    ref,
    year: Math.round(clampNum(eng.year, 2000, 2100, 2026)),
    title,
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
    riskLevel: clampStr(eng.riskLevel, 20, 'Medium') || 'Medium',
    lead: clampStr(eng.lead, 160),
    headReviewer: clampStr(eng.headReviewer, 160),
    independentReviewer: clampStr(eng.independentReviewer, 160, 'Not needed') || 'Not needed',
    startDate: clampStr(eng.startDate, 64),
    endDate: clampStr(eng.endDate, 64),
    objectives: clampStr(eng.objectives, 4000),
    scope: clampStr(eng.scope, 4000),
    criteria: clampStr(eng.criteria, 4000),
    addresseeName: clampStr(eng.addresseeName, 200),
    addresseeTitle: clampStr(eng.addresseeTitle, 200),
    copyFurnished: clampStr(eng.copyFurnished, 500),
    durationDays: Math.round(clampNum(eng.durationDays ?? 0, 0, 3650, 0)),
    budgetedHours: Math.round(clampNum(eng.budgetedHours ?? 0, 0, 100000, 0)),
    status: clampStr(eng.status, 64, 'Planned') || 'Planned',
    readyRatio: clampStr(eng.readyRatio, 40, '0/9 ready') || '0/9 ready',
    lifecycleStage: Math.round(clampNum(eng.lifecycleStage ?? 1, 1, 10, 1)),
    fieldworkPct: Math.round(clampNum(eng.fieldworkPct ?? 0, 0, 100, 0)),
    fieldworkDayCurrent: Math.round(clampNum(eng.fieldworkDayCurrent ?? 0, 0, 3650, 0)),
    fieldworkDayTotal: Math.round(clampNum(eng.fieldworkDayTotal ?? 0, 0, 3650, 0)),
    reportStatus: clampStr(eng.reportStatus, 40, 'Draft') || 'Draft',
    reportRating:
      typeof eng.reportRating === 'string' && eng.reportRating.trim()
        ? clampStr(eng.reportRating, 80)
        : null,
    reportRef: clampStr(eng.reportRef, 80),
    executiveSummary: clampStr(eng.executiveSummary, 8000),
    addedBy,
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'engagements',
    'id',
    safeId,
    (dc) => upsertEngagement(dc, vars),
    {
      ...vars,
      createdAt: nowIso,
      updatedAt: nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function upsertSqlWorkingNote(
  engagementId: string,
  note: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeEngId = sanitizeId(engagementId, 'eng');
  const safeNoteId = sanitizeId(note.id, 'wn');
  const nowIso = new Date().toISOString();
  const addedBy = await resolveAddedBy('workingNotes', 'id', safeNoteId, note.addedBy, actorEmail);

  const vars: UpsertWorkingNoteVariables = {
    id: safeNoteId,
    engagementId: safeEngId,
    ref: clampStr(note.ref, 40),
    title: clampStr(note.title, 240, 'Working Note') || 'Working Note',
    controlArea: clampStr(note.controlArea, 160),
    author: clampStr(note.author, 160),
    status: clampStr(note.status, 40, 'Draft') || 'Draft',
    hasException: Boolean(note.hasException),
    updatedAt: clampStr(note.updatedAt, 64, nowIso.slice(0, 10)) || nowIso.slice(0, 10),
    testingProcedure: clampStr(note.testingProcedure, 8000),
    observations: clampStr(note.observations, 8000),
    conclusion: clampStr(note.conclusion, 4000),
    reviewerComments:
      typeof note.reviewerComments === 'string' && note.reviewerComments.trim()
        ? clampStr(note.reviewerComments, 4000)
        : null,
    addedBy,
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'workingNotes',
    'id',
    safeNoteId,
    (dc) => upsertWorkingNote(dc, vars),
    {
      ...vars,
      createdAt: nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function upsertSqlFinding(
  engagementId: string,
  finding: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeEngId = sanitizeId(engagementId, 'eng');
  const safeFindingId = sanitizeId(finding.id, 'fnd');
  const nowIso = new Date().toISOString();
  const addedBy = await resolveAddedBy('findings', 'id', safeFindingId, finding.addedBy, actorEmail);

  const vars: UpsertFindingVariables = {
    id: safeFindingId,
    engagementId: safeEngId,
    ref: clampStr(finding.ref, 40),
    title: clampStr(finding.title, 240, 'Finding') || 'Finding',
    severity: clampStr(finding.severity, 32, 'Medium') || 'Medium',
    category: clampStr(finding.category, 120, 'General') || 'General',
    condition: clampStr(finding.condition, 8000),
    criteria: clampStr(finding.criteria, 4000),
    cause: clampStr(finding.cause, 4000),
    effect: clampStr(finding.effect, 4000),
    recommendation: clampStr(finding.recommendation, 8000),
    owner: clampStr(finding.owner, 160),
    targetDate: clampStr(finding.targetDate, 64),
    status: clampStr(finding.status, 40, 'Open') || 'Open',
    linkedNoteRef: clampStr(finding.linkedNoteRef, 40),
    addedBy,
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'findings',
    'id',
    safeFindingId,
    (dc) => upsertFinding(dc, vars),
    {
      ...vars,
      createdAt: nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function upsertSqlTimelineActivity(
  engagementId: string,
  activity: Record<string, unknown>,
  actorEmail = 'system'
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeEngId = sanitizeId(engagementId, 'eng');
  const safeActId = sanitizeId(activity.id, 'ta');
  const nowIso = new Date().toISOString();
  const addedBy = await resolveAddedBy(
    'timelineActivities',
    'id',
    safeActId,
    activity.addedBy,
    actorEmail
  );

  const vars: UpsertTimelineActivityVariables = {
    id: safeActId,
    engagementId: safeEngId,
    name: clampStr(activity.name, 240),
    roleResponsible: clampStr(activity.roleResponsible, 160),
    dueDate: clampStr(activity.dueDate, 64),
    completedDate:
      typeof activity.completedDate === 'string' && activity.completedDate.trim()
        ? clampStr(activity.completedDate, 64)
        : null,
    status: clampStr(activity.status, 40, 'Pending') || 'Pending',
    stageId: Math.round(clampNum(activity.stageId ?? 1, 1, 10, 1)),
    addedBy,
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'timelineActivities',
    'id',
    safeActId,
    (dc) => upsertTimelineActivity(dc, vars),
    {
      ...vars,
      createdAt: nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function insertSqlFile(
  engagementId: string,
  file: Record<string, unknown>,
  actorEmail = 'system'
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeEngId = sanitizeId(engagementId, 'eng');
  const safeFileId = sanitizeId(file.id, `file-${Date.now()}`);
  const nowIso = new Date().toISOString();
  const addedBy = clampStr(file.addedBy ?? actorEmail, 160);

  const vars: UpsertEngagementFileVariables = {
    id: safeFileId,
    engagementId: safeEngId,
    name: clampStr(file.name, 200),
    folder: clampStr(file.folder, 120),
    size: clampStr(file.size, 40),
    uploadedBy: clampStr(file.uploadedBy, 160),
    uploadedAt: clampStr(file.uploadedAt, 64),
    addedBy,
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'engagementFiles',
    'id',
    safeFileId,
    (dc) => upsertEngagementFile(dc, vars),
    {
      ...vars,
      createdAt: nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function insertSqlActivityLog(
  engagementId: string,
  log: Record<string, unknown>,
  actorEmail = 'system'
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeEngId = sanitizeId(engagementId, 'eng');
  const safeLogId = sanitizeId(log.id, `log-${Date.now()}`);
  const nowIso = new Date().toISOString();
  const addedBy = clampStr(log.addedBy ?? actorEmail, 160);

  const vars: UpsertActivityLogVariables = {
    id: safeLogId,
    engagementId: safeEngId,
    timestamp: clampStr(log.timestamp, 64),
    actor: clampStr(log.actor, 160),
    action: clampStr(log.action, 400),
    detail:
      typeof log.detail === 'string' && log.detail.trim() ? clampStr(log.detail, 1000) : null,
    addedBy,
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'activityLogs',
    'id',
    safeLogId,
    (dc) => upsertActivityLog(dc, vars),
    {
      ...vars,
      createdAt: nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function upsertSqlIssue(
  issue: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeId = sanitizeId(issue.id, 'iss');
  const ref = clampStr(issue.ref, 40);
  if (!ref) {
    throw new DataConnectHttpError('Issue reference (ref) is required.', 400);
  }
  const nowIso = new Date().toISOString();
  const addedBy = await resolveAddedBy('issueRegisters', 'id', safeId, issue.addedBy, actorEmail);

  const vars: UpsertIssueRegisterVariables = {
    id: safeId,
    ref,
    title: clampStr(issue.title, 240, 'Issue') || 'Issue',
    auditRef: clampStr(issue.auditRef, 40),
    auditTitle: clampStr(issue.auditTitle, 240),
    severity: clampStr(issue.severity, 32, 'Medium') || 'Medium',
    owner: clampStr(issue.owner, 160),
    ownerUnit: clampStr(issue.ownerUnit, 160),
    originalDue: clampStr(issue.originalDue, 64),
    currentDue: clampStr(issue.currentDue, 64),
    extensionCount: Math.round(clampNum(issue.extensionCount ?? 0, 0, 100, 0)),
    daysStatus: clampStr(issue.daysStatus, 80),
    isOverdue: Boolean(issue.isOverdue),
    isDueSoon: Boolean(issue.isDueSoon),
    status: clampStr(issue.status, 40, 'Open') || 'Open',
    actionPlanSummary: clampStr(issue.actionPlanSummary, 4000),
    evidenceNote:
      typeof issue.evidenceNote === 'string' && issue.evidenceNote.trim()
        ? clampStr(issue.evidenceNote, 4000)
        : null,
    extensionReason: clampStr(issue.extensionReason, 2000),
    addedBy,
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'issueRegisters',
    'id',
    safeId,
    (dc) => upsertIssueRegister(dc, vars),
    {
      ...vars,
      createdAt: nowIso,
      updatedAt: nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function upsertSqlUniverseEntity(
  entity: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeId = sanitizeId(entity.id, 'au');
  const code = clampStr(entity.code, 40);
  const name = clampStr(entity.name, 240);
  if (!code || !name) {
    throw new DataConnectHttpError('Audit Universe entity code and name are required.', 400);
  }
  const nowIso = new Date().toISOString();
  const addedBy = await resolveAddedBy(
    'universeEntities',
    'id',
    safeId,
    entity.addedBy,
    actorEmail
  );

  const vars: UpsertUniverseEntityVariables = {
    id: safeId,
    code,
    name,
    division: clampStr(entity.division, 160),
    auditDivisionId:
      typeof entity.auditDivisionId === 'string' && entity.auditDivisionId.trim()
        ? clampStr(entity.auditDivisionId, 64)
        : null,
    category: clampStr(entity.category, 120),
    likelihood: Math.round(clampNum(entity.likelihood, 1, 5, 3)),
    impact: Math.round(clampNum(entity.impact, 1, 5, 3)),
    riskScore: Math.round(clampNum(entity.riskScore, 1, 25, 9)),
    riskLevel: clampStr(entity.riskLevel, 20, 'Medium') || 'Medium',
    lastAudited: clampStr(entity.lastAudited, 64),
    nextDue: clampStr(entity.nextDue, 64),
    cycleMonths: Math.round(clampNum(entity.cycleMonths ?? 12, 1, 120, 12)),
    defaultLead: clampStr(entity.defaultLead, 160),
    riskNotes: clampStr(entity.riskNotes, 2000),
    addedBy,
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'universeEntities',
    'id',
    safeId,
    (dc) => upsertUniverseEntity(dc, vars),
    {
      ...vars,
      createdAt: nowIso,
      updatedAt: nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function deleteSqlUniverseEntity(id: string): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeId = sanitizeId(id);
  await executeVerifiedSdkDelete(
    'universeEntities',
    'id',
    safeId,
    (dc) => deleteUniverseEntity(dc, { id: safeId }),
    { id: safeId }
  );
}

export async function saveSqlFrequencies(
  freq: { high: number; medium: number; low: number },
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const nowIso = new Date().toISOString();
  const high = Math.round(clampNum(freq.high, 1, 120, 12));
  const medium = Math.round(clampNum(freq.medium, 1, 120, 36));
  const low = Math.round(clampNum(freq.low, 1, 120, 48));
  const addedBy = await resolveAddedBy('auditFrequencies', 'id', 'global', undefined, actorEmail);

  const vars: UpsertAuditFrequencyVariables = {
    id: 'global',
    high,
    medium,
    low,
    addedBy,
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'auditFrequencies',
    'id',
    'global',
    (dc) => upsertAuditFrequency(dc, vars),
    {
      ...vars,
      updatedAt: nowIso,
      modifiedAt: nowIso,
    }
  );
}

export async function saveSqlMasterData(
  key: string,
  value: unknown,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  const safeKey = sanitizeId(key);
  const nowIso = new Date().toISOString();
  await getSchemaCache();
  let normalizedStoredValue: unknown = value;

  if (safeKey === 'sizing_configs' && Array.isArray(value)) {
    const usedCodes = new Set<string>();
    const normalizedItems: UpsertSizingConfigVariables[] = [];
    const keptIds = new Set<string>();

    for (let idx = 0; idx < value.length; idx += 1) {
      const item = value[idx];
      if (!item || typeof item !== 'object') continue;
      const rec = item as Record<string, unknown>;
      const rowId = sanitizeId(rec.id, `sizing-${idx + 1}`);
      const sizeName = clampStr(rec.sizeName ?? rec.size, 80, `Size ${idx + 1}`) || `Size ${idx + 1}`;
      const baseCode = clampStr(
        rec.code,
        16,
        sizeName.slice(0, 3).toUpperCase() || `SZ${idx + 1}`
      ).toUpperCase();
      let code = baseCode || `SZ${idx + 1}`;
      let suffix = 2;
      while (usedCodes.has(code)) {
        code = `${baseCode.slice(0, 10)}-${suffix}`;
        suffix += 1;
      }
      usedCodes.add(code);
      keptIds.add(rowId);

      const workingDays = Math.round(clampNum(rec.workingDays, 1, 365, 20));
      const hoursPerDay = Math.round(clampNum(rec.hoursPerDay ?? 8, 1, 24, 8));
      const auditors = Math.round(clampNum(rec.auditors ?? rec.fieldTeam, 1, 100, 3));
      const budgetedHours = Math.round(
        clampNum(rec.budgetedHours ?? rec.standardHours, 1, 100000, workingDays * hoursPerDay * auditors)
      );
      const calendarSpan =
        clampStr(rec.calendarSpan, 64) || `${Math.max(1, Math.round(workingDays / 5))} weeks`;
      const typicalUse = clampStr(rec.typicalUse ?? rec.whenToUse, 400);

      normalizedItems.push({
        id: rowId,
        sizeName,
        code,
        workingDays,
        calendarSpan,
        auditors,
        hoursPerDay,
        budgetedHours,
        typicalUse,
        addedBy: clampStr(rec.addedBy ?? actorEmail, 160),
        modifiedBy: clampStr(actorEmail, 160),
      });
    }

    if (keptIds.size > 0) {
      const existingSizing = await listTableRows('sizingConfigs');
      for (const row of existingSizing) {
        const rid = strField(row, 'id');
        if (rid && !keptIds.has(rid)) {
          await executeVerifiedSdkDelete(
            'sizingConfigs',
            'id',
            rid,
            (dc) => deleteSizingConfig(dc, { id: rid }),
            { id: rid }
          );
        }
      }
    }

    for (const vars of normalizedItems) {
      await executeVerifiedSdkUpsert(
        'sizingConfigs',
        'id',
        vars.id,
        (dc) => upsertSizingConfig(dc, vars),
        {
          ...vars,
          createdAt: nowIso,
          updatedAt: nowIso,
          modifiedAt: nowIso,
        }
      );
    }
    normalizedStoredValue = normalizedItems;
  }

  if (safeKey === 'audit_division_risk_scales' && Array.isArray(value)) {
    const usedNames = new Set<string>();
    const normalizedScales: UpsertAuditDivisionRiskScaleVariables[] = [];
    const keptIds = new Set<string>();

    for (let idx = 0; idx < value.length; idx += 1) {
      const item = value[idx];
      if (!item || typeof item !== 'object') continue;
      const rec = item as Record<string, unknown>;
      const rowId = sanitizeId(rec.id, `scale-${idx + 1}`);
      const name = clampStr(rec.name, 120);
      if (!name) {
        throw new DataConnectHttpError('Audit division name is required.', 400);
      }
      const lowerName = name.toLowerCase();
      if (usedNames.has(lowerName)) {
        throw new DataConnectHttpError(`An audit division named "${name}" already exists.`, 400);
      }
      usedNames.add(lowerName);
      keptIds.add(rowId);

      const mediumMinScore = clampNum(rec.mediumMinScore, 0, 9.99, 4);
      const highMinScore = clampNum(rec.highMinScore, Math.max(0.01, mediumMinScore + 0.01), 10, 7);

      normalizedScales.push({
        id: rowId,
        name,
        highMinScore,
        mediumMinScore,
        highCycleMonths: Math.round(clampNum(rec.highCycleMonths, 1, 60, 12)),
        mediumCycleMonths: Math.round(clampNum(rec.mediumCycleMonths, 1, 60, 24)),
        lowCycleMonths: Math.round(clampNum(rec.lowCycleMonths, 1, 60, 36)),
        highFieldworkWeeks: Math.round(clampNum(rec.highFieldworkWeeks, 1, 52, 5)),
        mediumFieldworkWeeks: Math.round(clampNum(rec.mediumFieldworkWeeks, 1, 52, 4)),
        lowFieldworkWeeks: Math.round(clampNum(rec.lowFieldworkWeeks, 1, 52, 3)),
        addedBy: clampStr(rec.addedBy ?? actorEmail, 160),
        modifiedBy: clampStr(actorEmail, 160),
      });
    }

    if (keptIds.size > 0) {
      const existingScales = await listTableRows('auditDivisionRiskScales');
      for (const row of existingScales) {
        const rid = strField(row, 'id');
        if (rid && !keptIds.has(rid)) {
          await executeVerifiedSdkDelete(
            'auditDivisionRiskScales',
            'id',
            rid,
            (dc) => deleteAuditDivisionRiskScale(dc, { id: rid }),
            { id: rid }
          );
        }
      }
    }

    for (const vars of normalizedScales) {
      await executeVerifiedSdkUpsert(
        'auditDivisionRiskScales',
        'id',
        vars.id,
        (dc) => upsertAuditDivisionRiskScale(dc, vars),
        {
          ...vars,
          createdAt: nowIso,
          updatedAt: nowIso,
          modifiedAt: nowIso,
        }
      );
    }
    normalizedStoredValue = normalizedScales;
  }

  const addedBy = await resolveAddedBy('masterDatas', 'id', safeKey, undefined, actorEmail);
  const masterVars: UpsertMasterDataVariables = {
    id: safeKey,
    data:
      normalizedStoredValue === null || normalizedStoredValue === undefined
        ? 'null'
        : normalizedStoredValue,
    addedBy,
    modifiedBy: clampStr(actorEmail, 160),
  };

  await executeVerifiedSdkUpsert(
    'masterDatas',
    'id',
    safeKey,
    (dc) => upsertMasterData(dc, masterVars),
    {
      ...masterVars,
      createdAt: nowIso,
      updatedAt: nowIso,
      modifiedAt: nowIso,
    }
  );
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
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  await getSchemaCache();
  const nowIso = new Date().toISOString();
  const tokenHash = sanitizeId(session.id, `sess-${Date.now()}`);
  const vars: UpsertAppSessionVariables = {
    tokenHash,
    userId: clampStr(session.userId ?? '', 128),
    expiresAt: session.expiresAt || nowIso,
    revokedAt: null,
  };
  await executeVerifiedSdkUpsert(
    'appSessions',
    'tokenHash',
    tokenHash,
    (dc) => upsertAppSession(dc, vars),
    {
      ...vars,
      createdAt: nowIso,
    }
  );
}

export async function deleteDataConnectAppSession(id: string): Promise<void> {
  if (!hasSqlConfig()) {
    throw new DataConnectHttpError('Firebase Data Connect service account is not configured.', 500);
  }
  await getSchemaCache();
  const tokenHash = sanitizeId(id);
  await executeVerifiedSdkDelete(
    'appSessions',
    'tokenHash',
    tokenHash,
    (dc) => deleteAppSession(dc, { tokenHash }),
    { tokenHash }
  );
}

export async function fetchSqlWorkspaceSnapshot(
  includeAdminEmails: boolean,
  currentUserEmail?: string
): Promise<{
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

  const [
    engRows,
    wnRows,
    fndRows,
    taRows,
    fileRows,
    logRows,
    issueRows,
    uniRows,
    profileRows,
    freqRows,
    sysUserRows,
    accessRegistryRaw,
  ] = await Promise.all([
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
    listTableRows('systemUsers').catch(() => [] as Record<string, unknown>[]),
    fetchSqlMasterDataValue('access_users_registry').catch(() => null),
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

  const emailByProfileId = new Map<string, string>();
  const emailByEmpNo = new Map<string, string>();
  const emailByName = new Map<string, string>();

  for (const row of sysUserRows) {
    const mail = strField(row, 'email').trim().toLowerCase();
    if (!mail) continue;
    const fullName = strField(row, 'fullName', 'full_name').trim().toLowerCase();
    const empNo = strField(row, 'employeeNumber', 'employee_number').trim().toLowerCase();
    if (fullName && !emailByName.has(fullName)) emailByName.set(fullName, mail);
    if (empNo && !emailByEmpNo.has(empNo)) emailByEmpNo.set(empNo, mail);
  }
  if (Array.isArray(accessRegistryRaw)) {
    for (const item of accessRegistryRaw) {
      if (!item || typeof item !== 'object') continue;
      const rec = item as Record<string, unknown>;
      const mail = typeof rec.email === 'string' ? rec.email.trim().toLowerCase() : '';
      if (!mail) continue;
      const rid = typeof rec.id === 'string' ? rec.id.trim() : '';
      const empNo = typeof rec.employeeNumber === 'string' ? rec.employeeNumber.trim().toLowerCase() : '';
      const name = typeof rec.name === 'string' ? rec.name.trim().toLowerCase() : '';
      if (rid) emailByProfileId.set(rid, mail);
      if (empNo) emailByEmpNo.set(empNo, mail);
      if (name) emailByName.set(name, mail);
    }
  }
  const normalizedCurrentEmail = currentUserEmail?.trim().toLowerCase() ?? '';

  const userProfiles = profileRows.map((r) => {
    const id = strField(r, 'id');
    const name = strField(r, 'name');
    const empNo = optStrField(r, 'employeeNumber', 'employee_number');
    const resolvedEmail =
      optStrField(r, 'email')?.trim().toLowerCase() ||
      emailByProfileId.get(id) ||
      (empNo ? emailByEmpNo.get(empNo.trim().toLowerCase()) : undefined) ||
      (name ? emailByName.get(name.trim().toLowerCase()) : undefined);
    const exposedEmail =
      includeAdminEmails || (resolvedEmail && normalizedCurrentEmail && resolvedEmail === normalizedCurrentEmail)
        ? resolvedEmail
        : undefined;

    return {
      id,
      name,
      email: exposedEmail,
      roleTitle: strField(r, 'roleTitle', 'role_title'),
      fullLabel: strField(r, 'fullLabel', 'full_label'),
      headerSubtitle: strField(r, 'headerSubtitle', 'header_subtitle'),
      department: strField(r, 'department'),
      canApproveHead: boolField(r, false, 'canApproveHead', 'can_approve_head'),
      canApproveIndependent: boolField(r, false, 'canApproveIndependent', 'can_approve_independent'),
      canApproveCAE: boolField(r, false, 'canApproveCae'),
      employeeNumber: empNo,
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
    };
  });

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
