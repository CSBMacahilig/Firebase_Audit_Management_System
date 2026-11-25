export {
  deleteDataConnectAppSession,
  deleteSqlSystemUserByEmail,
  deleteSqlUniverseEntity,
  deleteSqlUserProfile,
  ensureSqlSchema,
  fetchSqlMasterDataValue,
  fetchSqlWorkspaceSnapshot,
  findSqlSystemUserByEmail,
  getSqlPublicConfig,
  hasSqlConfig,
  insertSqlActivityLog,
  insertSqlFile,
  listSqlSystemUsers,
  saveSqlFrequencies,
  saveSqlMasterData,
  syncWorkspaceSnapshotToSql,
  upsertDataConnectAppSession,
  upsertSqlEngagement,
  upsertSqlFinding,
  upsertSqlIssue,
  upsertSqlSystemUser,
  upsertSqlTimelineActivity,
  upsertSqlUniverseEntity,
  upsertSqlUserProfile,
  upsertSqlWorkingNote,
} from './dataConnectDb.ts';
export type {
  SqlConnectMode,
  SqlConnectPublicConfig,
  SqlEngine,
  SqlSystemUserRecord,
} from './dataConnectDb.ts';

import { hasSqlConfig, type SqlConnectMode, type SqlEngine } from './dataConnectDb.ts';

export function resolveSqlEngine(): SqlEngine | null {
  return hasSqlConfig() ? 'https' : null;
}

export function resolveSqlMode(): SqlConnectMode {
  return 'primary';
}
