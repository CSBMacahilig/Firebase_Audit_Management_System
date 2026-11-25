import { Pool as PgPool } from 'pg';
import mssql from 'mssql';
import mysql from 'mysql2/promise';

export type SqlEngine = 'postgres' | 'mssql' | 'mysql' | 'http';
export type SqlConnectMode = 'sync' | 'primary';

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
}

declare global {
  var _amsPgPool: PgPool | undefined;
  var _amsMssqlPool: mssql.ConnectionPool | undefined;
  var _amsMysqlPool: mysql.Pool | undefined;
  var _amsSqlSchemaEnsured: boolean | undefined;
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

export function resolveSqlEngine(): SqlEngine | null {
  const explicit = (process.env.SQL_CONNECT_ENGINE ?? '').trim().toLowerCase();
  if (explicit === 'postgres' || explicit === 'postgresql' || explicit === 'pg') return 'postgres';
  if (explicit === 'mssql' || explicit === 'sqlserver' || explicit === 'sql_server') return 'mssql';
  if (explicit === 'mysql' || explicit === 'mariadb') return 'mysql';
  if (explicit === 'http' || explicit === 'rest' || explicit === 'api') return 'http';
  if ((process.env.SQL_CONNECT_API_URL ?? '').trim()) return 'http';
  if ((process.env.SQL_CONNECT_HOST ?? '').trim() && (process.env.SQL_CONNECT_DATABASE ?? '').trim()) {
    return 'postgres';
  }
  return null;
}

export function resolveSqlMode(): SqlConnectMode {
  return (process.env.SQL_CONNECT_MODE ?? '').trim().toLowerCase() === 'primary' ? 'primary' : 'sync';
}

export function hasSqlConfig(): boolean {
  const engine = resolveSqlEngine();
  if (!engine) return false;
  if (engine === 'http') {
    return Boolean((process.env.SQL_CONNECT_API_URL ?? '').trim());
  }
  return Boolean(
    (process.env.SQL_CONNECT_HOST ?? '').trim() &&
      (process.env.SQL_CONNECT_DATABASE ?? '').trim() &&
      (process.env.SQL_CONNECT_USER ?? '').trim() &&
      (process.env.SQL_CONNECT_PASSWORD ?? '').trim()
  );
}

export function getSqlPublicConfig(): SqlConnectPublicConfig {
  const configured = hasSqlConfig();
  return {
    configured,
    engine: configured ? resolveSqlEngine() : null,
    mode: resolveSqlMode(),
  };
}

function getPgPool(): PgPool {
  if (!globalThis._amsPgPool) {
    const sslEnabled = (process.env.SQL_CONNECT_SSL ?? 'true').trim().toLowerCase() !== 'false';
    const port = Number((process.env.SQL_CONNECT_PORT ?? '').trim() || 5432);
    globalThis._amsPgPool = new PgPool({
      host: (process.env.SQL_CONNECT_HOST ?? '').trim(),
      port: Number.isFinite(port) ? port : 5432,
      database: (process.env.SQL_CONNECT_DATABASE ?? '').trim(),
      user: (process.env.SQL_CONNECT_USER ?? '').trim(),
      password: process.env.SQL_CONNECT_PASSWORD,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      max: 10,
      connectionTimeoutMillis: 15000,
    });
    globalThis._amsPgPool.on('error', (err) => {
      console.error('SQL Connect PostgreSQL pool error:', err.message);
    });
  }
  return globalThis._amsPgPool;
}

async function getMssqlPool(): Promise<mssql.ConnectionPool> {
  if (!globalThis._amsMssqlPool) {
    const sslEnabled = (process.env.SQL_CONNECT_SSL ?? 'true').trim().toLowerCase() !== 'false';
    const port = Number((process.env.SQL_CONNECT_PORT ?? '').trim() || 1433);
    const pool = new mssql.ConnectionPool({
      server: (process.env.SQL_CONNECT_HOST ?? '').trim(),
      port: Number.isFinite(port) ? port : 1433,
      database: (process.env.SQL_CONNECT_DATABASE ?? '').trim(),
      user: (process.env.SQL_CONNECT_USER ?? '').trim(),
      password: String(process.env.SQL_CONNECT_PASSWORD || ''),
      options: {
        encrypt: sslEnabled,
        trustServerCertificate: false,
      },
      pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
      connectionTimeout: 15000,
      requestTimeout: 30000,
    });
    await pool.connect();
    globalThis._amsMssqlPool = pool;
  } else if (!globalThis._amsMssqlPool.connected) {
    await globalThis._amsMssqlPool.connect();
  }
  return globalThis._amsMssqlPool;
}

function getMysqlPool(): mysql.Pool {
  if (!globalThis._amsMysqlPool) {
    const sslEnabled = (process.env.SQL_CONNECT_SSL ?? 'true').trim().toLowerCase() !== 'false';
    const port = Number((process.env.SQL_CONNECT_PORT ?? '').trim() || 3306);
    globalThis._amsMysqlPool = mysql.createPool({
      host: (process.env.SQL_CONNECT_HOST ?? '').trim(),
      port: Number.isFinite(port) ? port : 3306,
      database: (process.env.SQL_CONNECT_DATABASE ?? '').trim(),
      user: (process.env.SQL_CONNECT_USER ?? '').trim(),
      password: process.env.SQL_CONNECT_PASSWORD,
      ssl: sslEnabled ? { rejectUnauthorized: true } : undefined,
      connectionLimit: 10,
      connectTimeout: 15000,
    });
  }
  return globalThis._amsMysqlPool;
}

function validateGatewayUrl(rawUrl: string): URL {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('SQL Connect HTTP gateway must use http or https.');
  }
  const host = parsed.hostname.toLowerCase();
  if (host === '169.254.169.254' || host === 'metadata.google.internal') {
    throw new Error('Blocked metadata endpoint for SQL Connect gateway.');
  }
  return parsed;
}

async function callHttpGateway<T>(operation: string, payload: Record<string, unknown>): Promise<T> {
  const rawUrl = (process.env.SQL_CONNECT_API_URL ?? '').trim();
  const token = (process.env.SQL_CONNECT_API_TOKEN ?? '').trim();
  const parsedUrl = validateGatewayUrl(rawUrl);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(parsedUrl.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ operation, payload }),
  });

  if (!response.ok) {
    throw new Error(`SQL Connect gateway returned HTTP ${response.status}.`);
  }
  return (await response.json()) as T;
}

async function execQuery<T extends Record<string, unknown>>(
  statements: { postgres: string; mssql: string; mysql: string },
  params: unknown[] = []
): Promise<T[]> {
  const engine = resolveSqlEngine();
  if (!engine || !hasSqlConfig()) {
    throw new Error('SQL Connect is not configured.');
  }

  try {
    if (engine === 'postgres') {
      const pool = getPgPool();
      const result = await pool.query(statements.postgres, params);
      return result.rows as T[];
    }

    if (engine === 'mssql') {
      const pool = await getMssqlPool();
      const req = pool.request();
      params.forEach((val, idx) => {
        req.input(`p${idx + 1}`, val ?? null);
      });
      const result = await req.query(statements.mssql);
      return (result.recordset ?? []) as T[];
    }

    if (engine === 'mysql') {
      const pool = getMysqlPool();
      const boundParams = params.map((v) =>
        v === undefined ? null : (v as string | number | boolean | null)
      );
      const [rows] = await pool.execute(statements.mysql, boundParams);
      return (Array.isArray(rows) ? rows : []) as T[];
    }

    throw new Error('Unsupported direct SQL engine.');
  } catch (err) {
    console.error('SQL Connect query execution failed:', err);
    throw new Error('SQL Connect database operation failed.', { cause: err });
  }
}

export async function ensureSqlSchema(force = false): Promise<void> {
  if (!hasSqlConfig()) return;
  if (globalThis._amsSqlSchemaEnsured && !force) return;

  const engine = resolveSqlEngine();
  if (engine === 'http') {
    await callHttpGateway('ensureSchema', {});
    globalThis._amsSqlSchemaEnsured = true;
    return;
  }

  if (engine === 'postgres') {
    const ddl = `
      CREATE TABLE IF NOT EXISTS user_profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        role_title TEXT NOT NULL,
        full_label TEXT NOT NULL,
        header_subtitle TEXT NOT NULL,
        department TEXT NOT NULL,
        can_approve_head BOOLEAN NOT NULL DEFAULT FALSE,
        can_approve_independent BOOLEAN NOT NULL DEFAULT FALSE,
        can_approve_cae BOOLEAN NOT NULL DEFAULT FALSE,
        employee_number TEXT,
        last_login_date TEXT,
        account_modified_at TEXT,
        account_status TEXT NOT NULL DEFAULT 'Active',
        failed_login_count INT NOT NULL DEFAULT 0,
        is_locked BOOLEAN NOT NULL DEFAULT FALSE,
        requires_password_change BOOLEAN NOT NULL DEFAULT FALSE,
        mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        is_privileged BOOLEAN NOT NULL DEFAULT FALSE,
        added_by TEXT,
        modified_by TEXT,
        modified_at TEXT
      );
      CREATE TABLE IF NOT EXISTS system_users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'user',
        app_role TEXT,
        scope TEXT,
        employee_number TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        is_locked BOOLEAN NOT NULL DEFAULT FALSE,
        last_login TEXT,
        modified_at TEXT
      );
      CREATE TABLE IF NOT EXISTS engagements (
        id TEXT PRIMARY KEY,
        ref TEXT NOT NULL,
        year INT NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        department TEXT NOT NULL,
        audit_division_id TEXT,
        entity_name TEXT NOT NULL,
        likelihood INT NOT NULL,
        impact INT NOT NULL,
        risk_score INT NOT NULL,
        risk_level TEXT NOT NULL,
        lead TEXT NOT NULL,
        head_reviewer TEXT NOT NULL,
        independent_reviewer TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        objectives TEXT,
        scope TEXT,
        criteria TEXT,
        addressee_name TEXT,
        addressee_title TEXT,
        copy_furnished TEXT,
        duration_days INT NOT NULL DEFAULT 0,
        budgeted_hours INT NOT NULL DEFAULT 0,
        status TEXT NOT NULL,
        ready_ratio TEXT NOT NULL,
        lifecycle_stage INT NOT NULL DEFAULT 1,
        fieldwork_pct INT NOT NULL DEFAULT 0,
        fieldwork_day_current INT NOT NULL DEFAULT 0,
        fieldwork_day_total INT NOT NULL DEFAULT 0,
        report_status TEXT NOT NULL DEFAULT 'Draft',
        report_rating TEXT,
        report_ref TEXT NOT NULL DEFAULT '',
        executive_summary TEXT NOT NULL DEFAULT '',
        added_by TEXT,
        modified_by TEXT,
        modified_at TEXT
      );
      CREATE TABLE IF NOT EXISTS working_notes (
        id TEXT PRIMARY KEY,
        engagement_id TEXT NOT NULL,
        ref TEXT NOT NULL,
        title TEXT NOT NULL,
        control_area TEXT NOT NULL,
        author TEXT NOT NULL,
        status TEXT NOT NULL,
        has_exception BOOLEAN NOT NULL DEFAULT FALSE,
        updated_at TEXT NOT NULL,
        testing_procedure TEXT NOT NULL DEFAULT '',
        observations TEXT,
        conclusion TEXT NOT NULL DEFAULT '',
        reviewer_comments TEXT,
        added_by TEXT,
        modified_by TEXT,
        modified_at TEXT
      );
      CREATE TABLE IF NOT EXISTS findings (
        id TEXT PRIMARY KEY,
        engagement_id TEXT NOT NULL,
        ref TEXT NOT NULL,
        title TEXT NOT NULL,
        severity TEXT NOT NULL,
        category TEXT,
        condition_text TEXT NOT NULL DEFAULT '',
        criteria_text TEXT NOT NULL DEFAULT '',
        cause_text TEXT NOT NULL DEFAULT '',
        effect_text TEXT NOT NULL DEFAULT '',
        recommendation TEXT NOT NULL DEFAULT '',
        owner TEXT NOT NULL DEFAULT '',
        target_date TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'Open',
        linked_note_ref TEXT NOT NULL DEFAULT '',
        added_by TEXT,
        modified_by TEXT,
        modified_at TEXT
      );
      CREATE TABLE IF NOT EXISTS timeline_activities (
        id TEXT PRIMARY KEY,
        engagement_id TEXT NOT NULL,
        name TEXT NOT NULL,
        role_responsible TEXT NOT NULL,
        due_date TEXT NOT NULL,
        completed_date TEXT,
        status TEXT NOT NULL,
        stage_id INT NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS engagement_files (
        id TEXT PRIMARY KEY,
        engagement_id TEXT NOT NULL,
        name TEXT NOT NULL,
        folder TEXT NOT NULL,
        size_label TEXT NOT NULL,
        uploaded_by TEXT NOT NULL,
        uploaded_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        engagement_id TEXT NOT NULL,
        timestamp_label TEXT NOT NULL,
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        detail TEXT
      );
      CREATE TABLE IF NOT EXISTS issues_register (
        id TEXT PRIMARY KEY,
        ref TEXT NOT NULL,
        title TEXT NOT NULL,
        audit_ref TEXT NOT NULL,
        audit_title TEXT NOT NULL,
        severity TEXT NOT NULL,
        owner TEXT NOT NULL,
        owner_unit TEXT NOT NULL,
        original_due TEXT NOT NULL,
        current_due TEXT NOT NULL,
        extension_count INT NOT NULL DEFAULT 0,
        days_status TEXT NOT NULL,
        is_overdue BOOLEAN NOT NULL DEFAULT FALSE,
        is_due_soon BOOLEAN NOT NULL DEFAULT FALSE,
        status TEXT NOT NULL,
        action_plan_summary TEXT NOT NULL DEFAULT '',
        evidence_note TEXT,
        extension_reason TEXT,
        added_by TEXT,
        modified_by TEXT,
        modified_at TEXT
      );
      CREATE TABLE IF NOT EXISTS universe_entities (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        division TEXT NOT NULL,
        audit_division_id TEXT,
        category TEXT NOT NULL,
        likelihood INT NOT NULL,
        impact INT NOT NULL,
        risk_score INT NOT NULL,
        risk_level TEXT NOT NULL,
        last_audited TEXT NOT NULL,
        next_due TEXT NOT NULL,
        cycle_months INT NOT NULL,
        default_lead TEXT NOT NULL,
        risk_notes TEXT,
        added_by TEXT,
        modified_by TEXT,
        modified_at TEXT
      );
      CREATE TABLE IF NOT EXISTS audit_frequencies (
        id TEXT PRIMARY KEY,
        high_months INT NOT NULL DEFAULT 12,
        medium_months INT NOT NULL DEFAULT 36,
        low_months INT NOT NULL DEFAULT 48,
        added_by TEXT,
        modified_by TEXT,
        modified_at TEXT
      );
      CREATE TABLE IF NOT EXISTS master_data (
        data_key TEXT PRIMARY KEY,
        data_json TEXT NOT NULL,
        added_by TEXT,
        modified_by TEXT,
        modified_at TEXT
      );
    `;
    await getPgPool().query(ddl);
    globalThis._amsSqlSchemaEnsured = true;
    return;
  }

  if (engine === 'mssql') {
    const pool = await getMssqlPool();
    const ddl = `
      IF OBJECT_ID('dbo.user_profiles', 'U') IS NULL CREATE TABLE dbo.user_profiles (
        id NVARCHAR(128) PRIMARY KEY, name NVARCHAR(160) NOT NULL, email NVARCHAR(160) NULL,
        role_title NVARCHAR(160) NOT NULL, full_label NVARCHAR(240) NOT NULL, header_subtitle NVARCHAR(160) NOT NULL,
        department NVARCHAR(160) NOT NULL, can_approve_head BIT NOT NULL DEFAULT 0,
        can_approve_independent BIT NOT NULL DEFAULT 0, can_approve_cae BIT NOT NULL DEFAULT 0,
        employee_number NVARCHAR(64) NULL, last_login_date NVARCHAR(64) NULL, account_modified_at NVARCHAR(64) NULL,
        account_status NVARCHAR(32) NOT NULL DEFAULT 'Active', failed_login_count INT NOT NULL DEFAULT 0,
        is_locked BIT NOT NULL DEFAULT 0, requires_password_change BIT NOT NULL DEFAULT 0,
        mfa_enabled BIT NOT NULL DEFAULT 0, is_privileged BIT NOT NULL DEFAULT 0,
        added_by NVARCHAR(160) NULL, modified_by NVARCHAR(160) NULL, modified_at NVARCHAR(64) NULL
      );
      IF OBJECT_ID('dbo.system_users', 'U') IS NULL CREATE TABLE dbo.system_users (
        id NVARCHAR(128) PRIMARY KEY, username NVARCHAR(80) NOT NULL, full_name NVARCHAR(160) NOT NULL,
        email NVARCHAR(160) NOT NULL UNIQUE, role NVARCHAR(16) NOT NULL DEFAULT 'user',
        app_role NVARCHAR(80) NULL, scope NVARCHAR(240) NULL, employee_number NVARCHAR(64) NULL,
        is_active BIT NOT NULL DEFAULT 1, is_locked BIT NOT NULL DEFAULT 0,
        last_login NVARCHAR(64) NULL, modified_at NVARCHAR(64) NULL
      );
      IF OBJECT_ID('dbo.engagements', 'U') IS NULL CREATE TABLE dbo.engagements (
        id NVARCHAR(128) PRIMARY KEY, ref NVARCHAR(40) NOT NULL, year INT NOT NULL,
        title NVARCHAR(240) NOT NULL, category NVARCHAR(120) NOT NULL, department NVARCHAR(160) NOT NULL,
        audit_division_id NVARCHAR(64) NULL, entity_name NVARCHAR(240) NOT NULL,
        likelihood INT NOT NULL, impact INT NOT NULL, risk_score INT NOT NULL, risk_level NVARCHAR(24) NOT NULL,
        lead NVARCHAR(160) NOT NULL, head_reviewer NVARCHAR(160) NOT NULL, independent_reviewer NVARCHAR(160) NOT NULL,
        start_date NVARCHAR(40) NOT NULL, end_date NVARCHAR(40) NOT NULL,
        objectives NVARCHAR(MAX) NULL, scope NVARCHAR(MAX) NULL, criteria NVARCHAR(MAX) NULL,
        addressee_name NVARCHAR(160) NULL, addressee_title NVARCHAR(160) NULL, copy_furnished NVARCHAR(500) NULL,
        duration_days INT NOT NULL DEFAULT 0, budgeted_hours INT NOT NULL DEFAULT 0,
        status NVARCHAR(64) NOT NULL, ready_ratio NVARCHAR(32) NOT NULL, lifecycle_stage INT NOT NULL DEFAULT 1,
        fieldwork_pct INT NOT NULL DEFAULT 0, fieldwork_day_current INT NOT NULL DEFAULT 0, fieldwork_day_total INT NOT NULL DEFAULT 0,
        report_status NVARCHAR(40) NOT NULL DEFAULT 'Draft', report_rating NVARCHAR(64) NULL, report_ref NVARCHAR(64) NOT NULL DEFAULT '',
        executive_summary NVARCHAR(MAX) NOT NULL DEFAULT '',
        added_by NVARCHAR(160) NULL, modified_by NVARCHAR(160) NULL, modified_at NVARCHAR(64) NULL
      );
      IF OBJECT_ID('dbo.working_notes', 'U') IS NULL CREATE TABLE dbo.working_notes (
        id NVARCHAR(128) PRIMARY KEY, engagement_id NVARCHAR(128) NOT NULL, ref NVARCHAR(40) NOT NULL,
        title NVARCHAR(240) NOT NULL, control_area NVARCHAR(160) NOT NULL, author NVARCHAR(160) NOT NULL,
        status NVARCHAR(40) NOT NULL, has_exception BIT NOT NULL DEFAULT 0, updated_at NVARCHAR(64) NOT NULL,
        testing_procedure NVARCHAR(MAX) NOT NULL DEFAULT '', observations NVARCHAR(MAX) NULL,
        conclusion NVARCHAR(MAX) NOT NULL DEFAULT '', reviewer_comments NVARCHAR(2000) NULL,
        added_by NVARCHAR(160) NULL, modified_by NVARCHAR(160) NULL, modified_at NVARCHAR(64) NULL
      );
      IF OBJECT_ID('dbo.findings', 'U') IS NULL CREATE TABLE dbo.findings (
        id NVARCHAR(128) PRIMARY KEY, engagement_id NVARCHAR(128) NOT NULL, ref NVARCHAR(40) NOT NULL,
        title NVARCHAR(240) NOT NULL, severity NVARCHAR(40) NOT NULL, category NVARCHAR(120) NULL,
        condition_text NVARCHAR(MAX) NOT NULL DEFAULT '', criteria_text NVARCHAR(MAX) NOT NULL DEFAULT '',
        cause_text NVARCHAR(MAX) NOT NULL DEFAULT '', effect_text NVARCHAR(MAX) NOT NULL DEFAULT '',
        recommendation NVARCHAR(MAX) NOT NULL DEFAULT '', owner NVARCHAR(160) NOT NULL DEFAULT '',
        target_date NVARCHAR(64) NOT NULL DEFAULT '', status NVARCHAR(40) NOT NULL DEFAULT 'Open',
        linked_note_ref NVARCHAR(40) NOT NULL DEFAULT '',
        added_by NVARCHAR(160) NULL, modified_by NVARCHAR(160) NULL, modified_at NVARCHAR(64) NULL
      );
      IF OBJECT_ID('dbo.timeline_activities', 'U') IS NULL CREATE TABLE dbo.timeline_activities (
        id NVARCHAR(128) PRIMARY KEY, engagement_id NVARCHAR(128) NOT NULL, name NVARCHAR(240) NOT NULL,
        role_responsible NVARCHAR(160) NOT NULL, due_date NVARCHAR(64) NOT NULL, completed_date NVARCHAR(64) NULL,
        status NVARCHAR(32) NOT NULL, stage_id INT NOT NULL DEFAULT 1
      );
      IF OBJECT_ID('dbo.engagement_files', 'U') IS NULL CREATE TABLE dbo.engagement_files (
        id NVARCHAR(128) PRIMARY KEY, engagement_id NVARCHAR(128) NOT NULL, name NVARCHAR(200) NOT NULL,
        folder NVARCHAR(120) NOT NULL, size_label NVARCHAR(40) NOT NULL,
        uploaded_by NVARCHAR(160) NOT NULL, uploaded_at NVARCHAR(64) NOT NULL
      );
      IF OBJECT_ID('dbo.activity_logs', 'U') IS NULL CREATE TABLE dbo.activity_logs (
        id NVARCHAR(128) PRIMARY KEY, engagement_id NVARCHAR(128) NOT NULL, timestamp_label NVARCHAR(64) NOT NULL,
        actor NVARCHAR(160) NOT NULL, action NVARCHAR(400) NOT NULL, detail NVARCHAR(1000) NULL
      );
      IF OBJECT_ID('dbo.issues_register', 'U') IS NULL CREATE TABLE dbo.issues_register (
        id NVARCHAR(128) PRIMARY KEY, ref NVARCHAR(40) NOT NULL, title NVARCHAR(240) NOT NULL,
        audit_ref NVARCHAR(40) NOT NULL, audit_title NVARCHAR(240) NOT NULL, severity NVARCHAR(40) NOT NULL,
        owner NVARCHAR(160) NOT NULL, owner_unit NVARCHAR(160) NOT NULL,
        original_due NVARCHAR(64) NOT NULL, current_due NVARCHAR(64) NOT NULL,
        extension_count INT NOT NULL DEFAULT 0, days_status NVARCHAR(64) NOT NULL,
        is_overdue BIT NOT NULL DEFAULT 0, is_due_soon BIT NOT NULL DEFAULT 0, status NVARCHAR(40) NOT NULL,
        action_plan_summary NVARCHAR(MAX) NOT NULL DEFAULT '', evidence_note NVARCHAR(2000) NULL,
        extension_reason NVARCHAR(2000) NULL, added_by NVARCHAR(160) NULL, modified_by NVARCHAR(160) NULL, modified_at NVARCHAR(64) NULL
      );
      IF OBJECT_ID('dbo.universe_entities', 'U') IS NULL CREATE TABLE dbo.universe_entities (
        id NVARCHAR(128) PRIMARY KEY, code NVARCHAR(32) NOT NULL, name NVARCHAR(240) NOT NULL,
        division NVARCHAR(160) NOT NULL, audit_division_id NVARCHAR(64) NULL, category NVARCHAR(120) NOT NULL,
        likelihood INT NOT NULL, impact INT NOT NULL, risk_score INT NOT NULL, risk_level NVARCHAR(24) NOT NULL,
        last_audited NVARCHAR(64) NOT NULL, next_due NVARCHAR(64) NOT NULL, cycle_months INT NOT NULL,
        default_lead NVARCHAR(160) NOT NULL, risk_notes NVARCHAR(2000) NULL,
        added_by NVARCHAR(160) NULL, modified_by NVARCHAR(160) NULL, modified_at NVARCHAR(64) NULL
      );
      IF OBJECT_ID('dbo.audit_frequencies', 'U') IS NULL CREATE TABLE dbo.audit_frequencies (
        id NVARCHAR(64) PRIMARY KEY, high_months INT NOT NULL DEFAULT 12,
        medium_months INT NOT NULL DEFAULT 36, low_months INT NOT NULL DEFAULT 48,
        added_by NVARCHAR(160) NULL, modified_by NVARCHAR(160) NULL, modified_at NVARCHAR(64) NULL
      );
      IF OBJECT_ID('dbo.master_data', 'U') IS NULL CREATE TABLE dbo.master_data (
        data_key NVARCHAR(128) PRIMARY KEY, data_json NVARCHAR(MAX) NOT NULL,
        added_by NVARCHAR(160) NULL, modified_by NVARCHAR(160) NULL, modified_at NVARCHAR(64) NULL
      );
    `;
    await pool.request().query(ddl);
    globalThis._amsSqlSchemaEnsured = true;
    return;
  }

  if (engine === 'mysql') {
    const pool = getMysqlPool();
    const statements = [
      `CREATE TABLE IF NOT EXISTS user_profiles (
        id VARCHAR(128) PRIMARY KEY, name VARCHAR(160) NOT NULL, email VARCHAR(160) NULL,
        role_title VARCHAR(160) NOT NULL, full_label VARCHAR(240) NOT NULL, header_subtitle VARCHAR(160) NOT NULL,
        department VARCHAR(160) NOT NULL, can_approve_head TINYINT(1) NOT NULL DEFAULT 0,
        can_approve_independent TINYINT(1) NOT NULL DEFAULT 0, can_approve_cae TINYINT(1) NOT NULL DEFAULT 0,
        employee_number VARCHAR(64) NULL, last_login_date VARCHAR(64) NULL, account_modified_at VARCHAR(64) NULL,
        account_status VARCHAR(32) NOT NULL DEFAULT 'Active', failed_login_count INT NOT NULL DEFAULT 0,
        is_locked TINYINT(1) NOT NULL DEFAULT 0, requires_password_change TINYINT(1) NOT NULL DEFAULT 0,
        mfa_enabled TINYINT(1) NOT NULL DEFAULT 0, is_privileged TINYINT(1) NOT NULL DEFAULT 0,
        added_by VARCHAR(160) NULL, modified_by VARCHAR(160) NULL, modified_at VARCHAR(64) NULL
      )`,
      `CREATE TABLE IF NOT EXISTS system_users (
        id VARCHAR(128) PRIMARY KEY, username VARCHAR(80) NOT NULL, full_name VARCHAR(160) NOT NULL,
        email VARCHAR(160) NOT NULL UNIQUE, role VARCHAR(16) NOT NULL DEFAULT 'user',
        app_role VARCHAR(80) NULL, scope VARCHAR(240) NULL, employee_number VARCHAR(64) NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1, is_locked TINYINT(1) NOT NULL DEFAULT 0,
        last_login VARCHAR(64) NULL, modified_at VARCHAR(64) NULL
      )`,
      `CREATE TABLE IF NOT EXISTS engagements (
        id VARCHAR(128) PRIMARY KEY, ref VARCHAR(40) NOT NULL, year INT NOT NULL,
        title VARCHAR(240) NOT NULL, category VARCHAR(120) NOT NULL, department VARCHAR(160) NOT NULL,
        audit_division_id VARCHAR(64) NULL, entity_name VARCHAR(240) NOT NULL,
        likelihood INT NOT NULL, impact INT NOT NULL, risk_score INT NOT NULL, risk_level VARCHAR(24) NOT NULL,
        lead VARCHAR(160) NOT NULL, head_reviewer VARCHAR(160) NOT NULL, independent_reviewer VARCHAR(160) NOT NULL,
        start_date VARCHAR(40) NOT NULL, end_date VARCHAR(40) NOT NULL,
        objectives TEXT NULL, scope TEXT NULL, criteria TEXT NULL,
        addressee_name VARCHAR(160) NULL, addressee_title VARCHAR(160) NULL, copy_furnished VARCHAR(500) NULL,
        duration_days INT NOT NULL DEFAULT 0, budgeted_hours INT NOT NULL DEFAULT 0,
        status VARCHAR(64) NOT NULL, ready_ratio VARCHAR(32) NOT NULL, lifecycle_stage INT NOT NULL DEFAULT 1,
        fieldwork_pct INT NOT NULL DEFAULT 0, fieldwork_day_current INT NOT NULL DEFAULT 0, fieldwork_day_total INT NOT NULL DEFAULT 0,
        report_status VARCHAR(40) NOT NULL DEFAULT 'Draft', report_rating VARCHAR(64) NULL, report_ref VARCHAR(64) NOT NULL DEFAULT '',
        executive_summary LONGTEXT NOT NULL,
        added_by VARCHAR(160) NULL, modified_by VARCHAR(160) NULL, modified_at VARCHAR(64) NULL
      )`,
      `CREATE TABLE IF NOT EXISTS working_notes (
        id VARCHAR(128) PRIMARY KEY, engagement_id VARCHAR(128) NOT NULL, ref VARCHAR(40) NOT NULL,
        title VARCHAR(240) NOT NULL, control_area VARCHAR(160) NOT NULL, author VARCHAR(160) NOT NULL,
        status VARCHAR(40) NOT NULL, has_exception TINYINT(1) NOT NULL DEFAULT 0, updated_at VARCHAR(64) NOT NULL,
        testing_procedure LONGTEXT NOT NULL, observations LONGTEXT NULL,
        conclusion LONGTEXT NOT NULL, reviewer_comments TEXT NULL,
        added_by VARCHAR(160) NULL, modified_by VARCHAR(160) NULL, modified_at VARCHAR(64) NULL
      )`,
      `CREATE TABLE IF NOT EXISTS findings (
        id VARCHAR(128) PRIMARY KEY, engagement_id VARCHAR(128) NOT NULL, ref VARCHAR(40) NOT NULL,
        title VARCHAR(240) NOT NULL, severity VARCHAR(40) NOT NULL, category VARCHAR(120) NULL,
        condition_text LONGTEXT NOT NULL, criteria_text LONGTEXT NOT NULL,
        cause_text LONGTEXT NOT NULL, effect_text LONGTEXT NOT NULL,
        recommendation LONGTEXT NOT NULL, owner VARCHAR(160) NOT NULL,
        target_date VARCHAR(64) NOT NULL, status VARCHAR(40) NOT NULL DEFAULT 'Open',
        linked_note_ref VARCHAR(40) NOT NULL,
        added_by VARCHAR(160) NULL, modified_by VARCHAR(160) NULL, modified_at VARCHAR(64) NULL
      )`,
      `CREATE TABLE IF NOT EXISTS timeline_activities (
        id VARCHAR(128) PRIMARY KEY, engagement_id VARCHAR(128) NOT NULL, name VARCHAR(240) NOT NULL,
        role_responsible VARCHAR(160) NOT NULL, due_date VARCHAR(64) NOT NULL, completed_date VARCHAR(64) NULL,
        status VARCHAR(32) NOT NULL, stage_id INT NOT NULL DEFAULT 1
      )`,
      `CREATE TABLE IF NOT EXISTS engagement_files (
        id VARCHAR(128) PRIMARY KEY, engagement_id VARCHAR(128) NOT NULL, name VARCHAR(200) NOT NULL,
        folder VARCHAR(120) NOT NULL, size_label VARCHAR(40) NOT NULL,
        uploaded_by VARCHAR(160) NOT NULL, uploaded_at VARCHAR(64) NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(128) PRIMARY KEY, engagement_id VARCHAR(128) NOT NULL, timestamp_label VARCHAR(64) NOT NULL,
        actor VARCHAR(160) NOT NULL, action VARCHAR(400) NOT NULL, detail TEXT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS issues_register (
        id VARCHAR(128) PRIMARY KEY, ref VARCHAR(40) NOT NULL, title VARCHAR(240) NOT NULL,
        audit_ref VARCHAR(40) NOT NULL, audit_title VARCHAR(240) NOT NULL, severity VARCHAR(40) NOT NULL,
        owner VARCHAR(160) NOT NULL, owner_unit VARCHAR(160) NOT NULL,
        original_due VARCHAR(64) NOT NULL, current_due VARCHAR(64) NOT NULL,
        extension_count INT NOT NULL DEFAULT 0, days_status VARCHAR(64) NOT NULL,
        is_overdue TINYINT(1) NOT NULL DEFAULT 0, is_due_soon TINYINT(1) NOT NULL DEFAULT 0, status VARCHAR(40) NOT NULL,
        action_plan_summary LONGTEXT NOT NULL, evidence_note TEXT NULL,
        extension_reason TEXT NULL, added_by VARCHAR(160) NULL, modified_by VARCHAR(160) NULL, modified_at VARCHAR(64) NULL
      )`,
      `CREATE TABLE IF NOT EXISTS universe_entities (
        id VARCHAR(128) PRIMARY KEY, code VARCHAR(32) NOT NULL, name VARCHAR(240) NOT NULL,
        division VARCHAR(160) NOT NULL, audit_division_id VARCHAR(64) NULL, category VARCHAR(120) NOT NULL,
        likelihood INT NOT NULL, impact INT NOT NULL, risk_score INT NOT NULL, risk_level VARCHAR(24) NOT NULL,
        last_audited VARCHAR(64) NOT NULL, next_due VARCHAR(64) NOT NULL, cycle_months INT NOT NULL,
        default_lead VARCHAR(160) NOT NULL, risk_notes TEXT NULL,
        added_by VARCHAR(160) NULL, modified_by VARCHAR(160) NULL, modified_at VARCHAR(64) NULL
      )`,
      `CREATE TABLE IF NOT EXISTS audit_frequencies (
        id VARCHAR(64) PRIMARY KEY, high_months INT NOT NULL DEFAULT 12,
        medium_months INT NOT NULL DEFAULT 36, low_months INT NOT NULL DEFAULT 48,
        added_by VARCHAR(160) NULL, modified_by VARCHAR(160) NULL, modified_at VARCHAR(64) NULL
      )`,
      `CREATE TABLE IF NOT EXISTS master_data (
        data_key VARCHAR(128) PRIMARY KEY, data_json LONGTEXT NOT NULL,
        added_by VARCHAR(160) NULL, modified_by VARCHAR(160) NULL, modified_at VARCHAR(64) NULL
      )`,
    ];
    for (const stmt of statements) {
      await pool.execute(stmt);
    }
    globalThis._amsSqlSchemaEnsured = true;
  }
}

export async function findSqlSystemUserByEmail(email: string): Promise<SqlSystemUserRecord | null> {
  if (!hasSqlConfig()) return null;
  const mail = clampStr(email.toLowerCase(), 160);
  if (!mail) return null;

  if (resolveSqlEngine() === 'http') {
    const res = await callHttpGateway<{ user: SqlSystemUserRecord | null }>('findSystemUser', { email: mail });
    return res.user ?? null;
  }

  await ensureSqlSchema();
  const rows = await execQuery<Record<string, unknown>>(
    {
      postgres: `SELECT id, username, full_name, email, role, app_role, scope, employee_number, is_active, is_locked FROM system_users WHERE email = $1 LIMIT 1`,
      mssql: `SELECT TOP 1 id, username, full_name, email, role, app_role, scope, employee_number, is_active, is_locked FROM dbo.system_users WHERE email = @p1`,
      mysql: `SELECT id, username, full_name, email, role, app_role, scope, employee_number, is_active, is_locked FROM system_users WHERE email = ? LIMIT 1`,
    },
    [mail]
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: String(r.id ?? ''),
    username: String(r.username ?? ''),
    fullName: String(r.full_name ?? ''),
    email: String(r.email ?? ''),
    role: r.role === 'admin' ? 'admin' : 'user',
    appRole: r.app_role ? String(r.app_role) : undefined,
    scope: r.scope ? String(r.scope) : undefined,
    employeeNumber: r.employee_number ? String(r.employee_number) : undefined,
    isActive: Boolean(r.is_active),
    isLocked: Boolean(r.is_locked),
  };
}

export async function upsertSqlSystemUser(user: SqlSystemUserRecord): Promise<void> {
  if (!hasSqlConfig()) return;
  const email = clampStr(user.email.toLowerCase(), 160);
  if (!email) return;

  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('upsertSystemUser', { ...user, email });
    return;
  }

  await ensureSqlSchema();
  const id = sanitizeId(user.id || `sys_${email.replace(/[^a-z0-9_-]+/g, '_')}`);
  const nowIso = new Date().toISOString();
  const params = [
    id,
    clampStr(user.username || email.split('@')[0], 80),
    clampStr(user.fullName, 160),
    email,
    user.role === 'admin' ? 'admin' : 'user',
    user.appRole ? clampStr(user.appRole, 80) : null,
    user.scope ? clampStr(user.scope, 240) : null,
    user.employeeNumber ? clampStr(user.employeeNumber, 64) : null,
    Boolean(user.isActive),
    Boolean(user.isLocked),
    nowIso,
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO system_users (id, username, full_name, email, role, app_role, scope, employee_number, is_active, is_locked, modified_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        ON CONFLICT (email) DO UPDATE SET
          username = EXCLUDED.username, full_name = EXCLUDED.full_name, role = EXCLUDED.role,
          app_role = EXCLUDED.app_role, scope = EXCLUDED.scope, employee_number = EXCLUDED.employee_number,
          is_active = EXCLUDED.is_active, is_locked = EXCLUDED.is_locked, modified_at = EXCLUDED.modified_at
      `,
      mssql: `
        MERGE dbo.system_users AS target
        USING (SELECT @p1 AS id, @p2 AS username, @p3 AS full_name, @p4 AS email, @p5 AS role, @p6 AS app_role, @p7 AS scope, @p8 AS employee_number, @p9 AS is_active, @p10 AS is_locked, @p11 AS modified_at) AS src
        ON target.email = src.email
        WHEN MATCHED THEN UPDATE SET
          username = src.username, full_name = src.full_name, role = src.role, app_role = src.app_role,
          scope = src.scope, employee_number = src.employee_number, is_active = src.is_active,
          is_locked = src.is_locked, modified_at = src.modified_at
        WHEN NOT MATCHED THEN INSERT (id, username, full_name, email, role, app_role, scope, employee_number, is_active, is_locked, modified_at)
          VALUES (src.id, src.username, src.full_name, src.email, src.role, src.app_role, src.scope, src.employee_number, src.is_active, src.is_locked, src.modified_at);
      `,
      mysql: `
        INSERT INTO system_users (id, username, full_name, email, role, app_role, scope, employee_number, is_active, is_locked, modified_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          username = VALUES(username), full_name = VALUES(full_name), role = VALUES(role),
          app_role = VALUES(app_role), scope = VALUES(scope), employee_number = VALUES(employee_number),
          is_active = VALUES(is_active), is_locked = VALUES(is_locked), modified_at = VALUES(modified_at)
      `,
    },
    params
  );
}

export async function deleteSqlSystemUserByEmail(email: string): Promise<void> {
  if (!hasSqlConfig()) return;
  const mail = clampStr(email.toLowerCase(), 160);
  if (!mail) return;

  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('deleteSystemUser', { email: mail });
    return;
  }

  await ensureSqlSchema();
  await execQuery(
    {
      postgres: `DELETE FROM system_users WHERE email = $1`,
      mssql: `DELETE FROM dbo.system_users WHERE email = @p1`,
      mysql: `DELETE FROM system_users WHERE email = ?`,
    },
    [mail]
  );
}

export async function upsertSqlEngagement(eng: Record<string, unknown>, actorEmail: string): Promise<void> {
  if (!hasSqlConfig()) return;
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('upsertEngagement', { engagement: eng, actorEmail });
    return;
  }

  await ensureSqlSchema();
  const id = sanitizeId(eng.id);
  const nowIso = new Date().toISOString();
  const params = [
    id,
    clampStr(eng.ref, 40),
    Math.round(clampNum(eng.year, 2000, 2100, 2026)),
    clampStr(eng.title, 240, 'Untitled Engagement'),
    clampStr(eng.category, 120),
    clampStr(eng.department, 160),
    eng.auditDivisionId ? clampStr(eng.auditDivisionId, 64) : null,
    clampStr(eng.entityName, 240),
    Math.round(clampNum(eng.likelihood, 1, 5, 3)),
    Math.round(clampNum(eng.impact, 1, 5, 3)),
    Math.round(clampNum(eng.riskScore, 1, 25, 9)),
    clampStr(eng.riskLevel, 24, 'Medium'),
    clampStr(eng.lead, 160),
    clampStr(eng.headReviewer, 160),
    clampStr(eng.independentReviewer, 160, 'Not needed'),
    clampStr(eng.startDate, 40),
    clampStr(eng.endDate, 40),
    eng.objectives ? clampStr(eng.objectives, 4000) : null,
    eng.scope ? clampStr(eng.scope, 4000) : null,
    eng.criteria ? clampStr(eng.criteria, 4000) : null,
    eng.addresseeName ? clampStr(eng.addresseeName, 160) : null,
    eng.addresseeTitle ? clampStr(eng.addresseeTitle, 160) : null,
    eng.copyFurnished ? clampStr(eng.copyFurnished, 500) : null,
    Math.round(clampNum(eng.durationDays, 0, 3650, 0)),
    Math.round(clampNum(eng.budgetedHours, 0, 50000, 0)),
    clampStr(eng.status, 64, 'Planned'),
    clampStr(eng.readyRatio, 32, '0/9 ready'),
    Math.round(clampNum(eng.lifecycleStage, 1, 7, 1)),
    Math.round(clampNum(eng.fieldworkPct, 0, 100, 0)),
    Math.round(clampNum(eng.fieldworkDayCurrent, 0, 3650, 0)),
    Math.round(clampNum(eng.fieldworkDayTotal, 0, 3650, 0)),
    clampStr(eng.reportStatus, 40, 'Draft'),
    eng.reportRating ? clampStr(eng.reportRating, 64) : null,
    clampStr(eng.reportRef, 64),
    clampStr(eng.executiveSummary, 8000),
    clampStr(eng.addedBy || actorEmail, 160),
    clampStr(actorEmail, 160),
    nowIso,
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO engagements (
          id, ref, year, title, category, department, audit_division_id, entity_name,
          likelihood, impact, risk_score, risk_level, lead, head_reviewer, independent_reviewer,
          start_date, end_date, objectives, scope, criteria, addressee_name, addressee_title, copy_furnished,
          duration_days, budgeted_hours, status, ready_ratio, lifecycle_stage,
          fieldwork_pct, fieldwork_day_current, fieldwork_day_total,
          report_status, report_rating, report_ref, executive_summary, added_by, modified_by, modified_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
          $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38
        )
        ON CONFLICT (id) DO UPDATE SET
          ref=EXCLUDED.ref, year=EXCLUDED.year, title=EXCLUDED.title, category=EXCLUDED.category,
          department=EXCLUDED.department, audit_division_id=EXCLUDED.audit_division_id, entity_name=EXCLUDED.entity_name,
          likelihood=EXCLUDED.likelihood, impact=EXCLUDED.impact, risk_score=EXCLUDED.risk_score, risk_level=EXCLUDED.risk_level,
          lead=EXCLUDED.lead, head_reviewer=EXCLUDED.head_reviewer, independent_reviewer=EXCLUDED.independent_reviewer,
          start_date=EXCLUDED.start_date, end_date=EXCLUDED.end_date, objectives=EXCLUDED.objectives,
          scope=EXCLUDED.scope, criteria=EXCLUDED.criteria, addressee_name=EXCLUDED.addressee_name,
          addressee_title=EXCLUDED.addressee_title, copy_furnished=EXCLUDED.copy_furnished,
          duration_days=EXCLUDED.duration_days, budgeted_hours=EXCLUDED.budgeted_hours, status=EXCLUDED.status,
          ready_ratio=EXCLUDED.ready_ratio, lifecycle_stage=EXCLUDED.lifecycle_stage, fieldwork_pct=EXCLUDED.fieldwork_pct,
          fieldwork_day_current=EXCLUDED.fieldwork_day_current, fieldwork_day_total=EXCLUDED.fieldwork_day_total,
          report_status=EXCLUDED.report_status, report_rating=EXCLUDED.report_rating, report_ref=EXCLUDED.report_ref,
          executive_summary=EXCLUDED.executive_summary, modified_by=EXCLUDED.modified_by, modified_at=EXCLUDED.modified_at
      `,
      mssql: `
        MERGE dbo.engagements AS t
        USING (SELECT @p1 AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET
          ref=@p2, year=@p3, title=@p4, category=@p5, department=@p6, audit_division_id=@p7, entity_name=@p8,
          likelihood=@p9, impact=@p10, risk_score=@p11, risk_level=@p12, lead=@p13, head_reviewer=@p14,
          independent_reviewer=@p15, start_date=@p16, end_date=@p17, objectives=@p18, scope=@p19, criteria=@p20,
          addressee_name=@p21, addressee_title=@p22, copy_furnished=@p23, duration_days=@p24, budgeted_hours=@p25,
          status=@p26, ready_ratio=@p27, lifecycle_stage=@p28, fieldwork_pct=@p29, fieldwork_day_current=@p30,
          fieldwork_day_total=@p31, report_status=@p32, report_rating=@p33, report_ref=@p34, executive_summary=@p35,
          modified_by=@p37, modified_at=@p38
        WHEN NOT MATCHED THEN INSERT (
          id, ref, year, title, category, department, audit_division_id, entity_name,
          likelihood, impact, risk_score, risk_level, lead, head_reviewer, independent_reviewer,
          start_date, end_date, objectives, scope, criteria, addressee_name, addressee_title, copy_furnished,
          duration_days, budgeted_hours, status, ready_ratio, lifecycle_stage,
          fieldwork_pct, fieldwork_day_current, fieldwork_day_total,
          report_status, report_rating, report_ref, executive_summary, added_by, modified_by, modified_at
        ) VALUES (
          @p1,@p2,@p3,@p4,@p5,@p6,@p7,@p8,@p9,@p10,@p11,@p12,@p13,@p14,@p15,@p16,@p17,@p18,@p19,@p20,
          @p21,@p22,@p23,@p24,@p25,@p26,@p27,@p28,@p29,@p30,@p31,@p32,@p33,@p34,@p35,@p36,@p37,@p38
        );
      `,
      mysql: `
        INSERT INTO engagements (
          id, ref, year, title, category, department, audit_division_id, entity_name,
          likelihood, impact, risk_score, risk_level, lead, head_reviewer, independent_reviewer,
          start_date, end_date, objectives, scope, criteria, addressee_name, addressee_title, copy_furnished,
          duration_days, budgeted_hours, status, ready_ratio, lifecycle_stage,
          fieldwork_pct, fieldwork_day_current, fieldwork_day_total,
          report_status, report_rating, report_ref, executive_summary, added_by, modified_by, modified_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          ref=VALUES(ref), year=VALUES(year), title=VALUES(title), category=VALUES(category),
          department=VALUES(department), audit_division_id=VALUES(audit_division_id), entity_name=VALUES(entity_name),
          likelihood=VALUES(likelihood), impact=VALUES(impact), risk_score=VALUES(risk_score), risk_level=VALUES(risk_level),
          lead=VALUES(lead), head_reviewer=VALUES(head_reviewer), independent_reviewer=VALUES(independent_reviewer),
          start_date=VALUES(start_date), end_date=VALUES(end_date), objectives=VALUES(objectives),
          scope=VALUES(scope), criteria=VALUES(criteria), addressee_name=VALUES(addressee_name),
          addressee_title=VALUES(addressee_title), copy_furnished=VALUES(copy_furnished),
          duration_days=VALUES(duration_days), budgeted_hours=VALUES(budgeted_hours), status=VALUES(status),
          ready_ratio=VALUES(ready_ratio), lifecycle_stage=VALUES(lifecycle_stage), fieldwork_pct=VALUES(fieldwork_pct),
          fieldwork_day_current=VALUES(fieldwork_day_current), fieldwork_day_total=VALUES(fieldwork_day_total),
          report_status=VALUES(report_status), report_rating=VALUES(report_rating), report_ref=VALUES(report_ref),
          executive_summary=VALUES(executive_summary), modified_by=VALUES(modified_by), modified_at=VALUES(modified_at)
      `,
    },
    params
  );
}

export async function upsertSqlWorkingNote(
  engagementId: string,
  note: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('upsertWorkingNote', { engagementId, note, actorEmail });
    return;
  }

  await ensureSqlSchema();
  const id = sanitizeId(note.id);
  const safeEngId = sanitizeId(engagementId);
  const nowIso = new Date().toISOString();
  const params = [
    id,
    safeEngId,
    clampStr(note.ref, 40),
    clampStr(note.title, 240, 'Working Note'),
    clampStr(note.controlArea, 160),
    clampStr(note.author, 160),
    clampStr(note.status, 40, 'Draft'),
    Boolean(note.hasException),
    clampStr(note.updatedAt, 64),
    clampStr(note.testingProcedure, 4000),
    note.observations ? clampStr(note.observations, 4000) : null,
    clampStr(note.conclusion, 4000),
    note.reviewerComments ? clampStr(note.reviewerComments, 2000) : null,
    clampStr(note.addedBy || actorEmail, 160),
    clampStr(actorEmail, 160),
    nowIso,
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO working_notes (
          id, engagement_id, ref, title, control_area, author, status, has_exception, updated_at,
          testing_procedure, observations, conclusion, reviewer_comments, added_by, modified_by, modified_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        ON CONFLICT (id) DO UPDATE SET
          ref=EXCLUDED.ref, title=EXCLUDED.title, control_area=EXCLUDED.control_area, author=EXCLUDED.author,
          status=EXCLUDED.status, has_exception=EXCLUDED.has_exception, updated_at=EXCLUDED.updated_at,
          testing_procedure=EXCLUDED.testing_procedure, observations=EXCLUDED.observations,
          conclusion=EXCLUDED.conclusion, reviewer_comments=EXCLUDED.reviewer_comments,
          modified_by=EXCLUDED.modified_by, modified_at=EXCLUDED.modified_at
      `,
      mssql: `
        MERGE dbo.working_notes AS t
        USING (SELECT @p1 AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET
          ref=@p3, title=@p4, control_area=@p5, author=@p6, status=@p7, has_exception=@p8, updated_at=@p9,
          testing_procedure=@p10, observations=@p11, conclusion=@p12, reviewer_comments=@p13,
          modified_by=@p15, modified_at=@p16
        WHEN NOT MATCHED THEN INSERT (
          id, engagement_id, ref, title, control_area, author, status, has_exception, updated_at,
          testing_procedure, observations, conclusion, reviewer_comments, added_by, modified_by, modified_at
        ) VALUES (@p1,@p2,@p3,@p4,@p5,@p6,@p7,@p8,@p9,@p10,@p11,@p12,@p13,@p14,@p15,@p16);
      `,
      mysql: `
        INSERT INTO working_notes (
          id, engagement_id, ref, title, control_area, author, status, has_exception, updated_at,
          testing_procedure, observations, conclusion, reviewer_comments, added_by, modified_by, modified_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          ref=VALUES(ref), title=VALUES(title), control_area=VALUES(control_area), author=VALUES(author),
          status=VALUES(status), has_exception=VALUES(has_exception), updated_at=VALUES(updated_at),
          testing_procedure=VALUES(testing_procedure), observations=VALUES(observations),
          conclusion=VALUES(conclusion), reviewer_comments=VALUES(reviewer_comments),
          modified_by=VALUES(modified_by), modified_at=VALUES(modified_at)
      `,
    },
    params
  );
}

export async function upsertSqlFinding(
  engagementId: string,
  finding: Record<string, unknown>,
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('upsertFinding', { engagementId, finding, actorEmail });
    return;
  }

  await ensureSqlSchema();
  const id = sanitizeId(finding.id);
  const safeEngId = sanitizeId(engagementId);
  const nowIso = new Date().toISOString();
  const params = [
    id,
    safeEngId,
    clampStr(finding.ref, 40),
    clampStr(finding.title, 240, 'Finding'),
    clampStr(finding.severity, 40, 'Medium'),
    finding.category ? clampStr(finding.category, 120) : null,
    clampStr(finding.condition, 4000),
    clampStr(finding.criteria, 4000),
    clampStr(finding.cause, 4000),
    clampStr(finding.effect, 4000),
    clampStr(finding.recommendation, 4000),
    clampStr(finding.owner, 160),
    clampStr(finding.targetDate, 64),
    clampStr(finding.status, 40, 'Open'),
    clampStr(finding.linkedNoteRef, 40),
    clampStr(finding.addedBy || actorEmail, 160),
    clampStr(actorEmail, 160),
    nowIso,
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO findings (
          id, engagement_id, ref, title, severity, category, condition_text, criteria_text,
          cause_text, effect_text, recommendation, owner, target_date, status, linked_note_ref,
          added_by, modified_by, modified_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
        ON CONFLICT (id) DO UPDATE SET
          ref=EXCLUDED.ref, title=EXCLUDED.title, severity=EXCLUDED.severity, category=EXCLUDED.category,
          condition_text=EXCLUDED.condition_text, criteria_text=EXCLUDED.criteria_text, cause_text=EXCLUDED.cause_text,
          effect_text=EXCLUDED.effect_text, recommendation=EXCLUDED.recommendation, owner=EXCLUDED.owner,
          target_date=EXCLUDED.target_date, status=EXCLUDED.status, linked_note_ref=EXCLUDED.linked_note_ref,
          modified_by=EXCLUDED.modified_by, modified_at=EXCLUDED.modified_at
      `,
      mssql: `
        MERGE dbo.findings AS t
        USING (SELECT @p1 AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET
          ref=@p3, title=@p4, severity=@p5, category=@p6, condition_text=@p7, criteria_text=@p8,
          cause_text=@p9, effect_text=@p10, recommendation=@p11, owner=@p12, target_date=@p13,
          status=@p14, linked_note_ref=@p15, modified_by=@p17, modified_at=@p18
        WHEN NOT MATCHED THEN INSERT (
          id, engagement_id, ref, title, severity, category, condition_text, criteria_text,
          cause_text, effect_text, recommendation, owner, target_date, status, linked_note_ref,
          added_by, modified_by, modified_at
        ) VALUES (@p1,@p2,@p3,@p4,@p5,@p6,@p7,@p8,@p9,@p10,@p11,@p12,@p13,@p14,@p15,@p16,@p17,@p18);
      `,
      mysql: `
        INSERT INTO findings (
          id, engagement_id, ref, title, severity, category, condition_text, criteria_text,
          cause_text, effect_text, recommendation, owner, target_date, status, linked_note_ref,
          added_by, modified_by, modified_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          ref=VALUES(ref), title=VALUES(title), severity=VALUES(severity), category=VALUES(category),
          condition_text=VALUES(condition_text), criteria_text=VALUES(criteria_text), cause_text=VALUES(cause_text),
          effect_text=VALUES(effect_text), recommendation=VALUES(recommendation), owner=VALUES(owner),
          target_date=VALUES(target_date), status=VALUES(status), linked_note_ref=VALUES(linked_note_ref),
          modified_by=VALUES(modified_by), modified_at=VALUES(modified_at)
      `,
    },
    params
  );
}

export async function upsertSqlTimelineActivity(
  engagementId: string,
  activity: Record<string, unknown>
): Promise<void> {
  if (!hasSqlConfig()) return;
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('upsertTimelineActivity', { engagementId, activity });
    return;
  }

  await ensureSqlSchema();
  const id = sanitizeId(activity.id);
  const safeEngId = sanitizeId(engagementId);
  const params = [
    id,
    safeEngId,
    clampStr(activity.name, 240),
    clampStr(activity.roleResponsible, 160),
    clampStr(activity.dueDate, 64),
    activity.completedDate ? clampStr(activity.completedDate, 64) : null,
    clampStr(activity.status, 32, 'Pending'),
    Math.round(clampNum(activity.stageId, 1, 7, 1)),
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO timeline_activities (id, engagement_id, name, role_responsible, due_date, completed_date, status, stage_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (id) DO UPDATE SET
          name=EXCLUDED.name, role_responsible=EXCLUDED.role_responsible, due_date=EXCLUDED.due_date,
          completed_date=EXCLUDED.completed_date, status=EXCLUDED.status, stage_id=EXCLUDED.stage_id
      `,
      mssql: `
        MERGE dbo.timeline_activities AS t
        USING (SELECT @p1 AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET
          name=@p3, role_responsible=@p4, due_date=@p5, completed_date=@p6, status=@p7, stage_id=@p8
        WHEN NOT MATCHED THEN INSERT (id, engagement_id, name, role_responsible, due_date, completed_date, status, stage_id)
          VALUES (@p1,@p2,@p3,@p4,@p5,@p6,@p7,@p8);
      `,
      mysql: `
        INSERT INTO timeline_activities (id, engagement_id, name, role_responsible, due_date, completed_date, status, stage_id)
        VALUES (?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          name=VALUES(name), role_responsible=VALUES(role_responsible), due_date=VALUES(due_date),
          completed_date=VALUES(completed_date), status=VALUES(status), stage_id=VALUES(stage_id)
      `,
    },
    params
  );
}

export async function insertSqlFile(engagementId: string, file: Record<string, unknown>): Promise<void> {
  if (!hasSqlConfig()) return;
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('insertFile', { engagementId, file });
    return;
  }

  await ensureSqlSchema();
  const id = sanitizeId(file.id);
  const safeEngId = sanitizeId(engagementId);
  const params = [
    id,
    safeEngId,
    clampStr(file.name, 200),
    clampStr(file.folder, 120),
    clampStr(file.size, 40),
    clampStr(file.uploadedBy, 160),
    clampStr(file.uploadedAt, 64),
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO engagement_files (id, engagement_id, name, folder, size_label, uploaded_by, uploaded_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, folder=EXCLUDED.folder, size_label=EXCLUDED.size_label
      `,
      mssql: `
        MERGE dbo.engagement_files AS t
        USING (SELECT @p1 AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET name=@p3, folder=@p4, size_label=@p5
        WHEN NOT MATCHED THEN INSERT (id, engagement_id, name, folder, size_label, uploaded_by, uploaded_at)
          VALUES (@p1,@p2,@p3,@p4,@p5,@p6,@p7);
      `,
      mysql: `
        INSERT INTO engagement_files (id, engagement_id, name, folder, size_label, uploaded_by, uploaded_at)
        VALUES (?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), folder=VALUES(folder), size_label=VALUES(size_label)
      `,
    },
    params
  );
}

export async function insertSqlActivityLog(
  engagementId: string,
  log: Record<string, unknown>
): Promise<void> {
  if (!hasSqlConfig()) return;
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('insertActivityLog', { engagementId, log });
    return;
  }

  await ensureSqlSchema();
  const id = sanitizeId(log.id || `al-${Date.now()}`);
  const safeEngId = sanitizeId(engagementId);
  const params = [
    id,
    safeEngId,
    clampStr(log.timestamp, 64),
    clampStr(log.actor, 160),
    clampStr(log.action, 400),
    log.detail ? clampStr(log.detail, 1000) : null,
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO activity_logs (id, engagement_id, timestamp_label, actor, action, detail)
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (id) DO NOTHING
      `,
      mssql: `
        IF NOT EXISTS (SELECT 1 FROM dbo.activity_logs WHERE id = @p1)
          INSERT INTO dbo.activity_logs (id, engagement_id, timestamp_label, actor, action, detail)
          VALUES (@p1,@p2,@p3,@p4,@p5,@p6);
      `,
      mysql: `
        INSERT IGNORE INTO activity_logs (id, engagement_id, timestamp_label, actor, action, detail)
        VALUES (?,?,?,?,?,?)
      `,
    },
    params
  );
}

export async function upsertSqlIssue(issue: Record<string, unknown>, actorEmail: string): Promise<void> {
  if (!hasSqlConfig()) return;
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('upsertIssue', { issue, actorEmail });
    return;
  }

  await ensureSqlSchema();
  const id = sanitizeId(issue.id);
  const nowIso = new Date().toISOString();
  const params = [
    id,
    clampStr(issue.ref, 40),
    clampStr(issue.title, 240, 'Issue'),
    clampStr(issue.auditRef, 40),
    clampStr(issue.auditTitle, 240),
    clampStr(issue.severity, 40, 'Medium'),
    clampStr(issue.owner, 160),
    clampStr(issue.ownerUnit, 160),
    clampStr(issue.originalDue, 64),
    clampStr(issue.currentDue, 64),
    Math.round(clampNum(issue.extensionCount, 0, 50, 0)),
    clampStr(issue.daysStatus, 64),
    Boolean(issue.isOverdue),
    Boolean(issue.isDueSoon),
    clampStr(issue.status, 40, 'Open'),
    clampStr(issue.actionPlanSummary, 4000),
    issue.evidenceNote ? clampStr(issue.evidenceNote, 2000) : null,
    issue.extensionReason ? clampStr(issue.extensionReason, 2000) : null,
    clampStr(issue.addedBy || actorEmail, 160),
    clampStr(actorEmail, 160),
    nowIso,
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO issues_register (
          id, ref, title, audit_ref, audit_title, severity, owner, owner_unit,
          original_due, current_due, extension_count, days_status, is_overdue, is_due_soon,
          status, action_plan_summary, evidence_note, extension_reason, added_by, modified_by, modified_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
        ON CONFLICT (id) DO UPDATE SET
          ref=EXCLUDED.ref, title=EXCLUDED.title, audit_ref=EXCLUDED.audit_ref, audit_title=EXCLUDED.audit_title,
          severity=EXCLUDED.severity, owner=EXCLUDED.owner, owner_unit=EXCLUDED.owner_unit,
          original_due=EXCLUDED.original_due, current_due=EXCLUDED.current_due, extension_count=EXCLUDED.extension_count,
          days_status=EXCLUDED.days_status, is_overdue=EXCLUDED.is_overdue, is_due_soon=EXCLUDED.is_due_soon,
          status=EXCLUDED.status, action_plan_summary=EXCLUDED.action_plan_summary, evidence_note=EXCLUDED.evidence_note,
          extension_reason=EXCLUDED.extension_reason, modified_by=EXCLUDED.modified_by, modified_at=EXCLUDED.modified_at
      `,
      mssql: `
        MERGE dbo.issues_register AS t
        USING (SELECT @p1 AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET
          ref=@p2, title=@p3, audit_ref=@p4, audit_title=@p5, severity=@p6, owner=@p7, owner_unit=@p8,
          original_due=@p9, current_due=@p10, extension_count=@p11, days_status=@p12, is_overdue=@p13, is_due_soon=@p14,
          status=@p15, action_plan_summary=@p16, evidence_note=@p17, extension_reason=@p18,
          modified_by=@p20, modified_at=@p21
        WHEN NOT MATCHED THEN INSERT (
          id, ref, title, audit_ref, audit_title, severity, owner, owner_unit,
          original_due, current_due, extension_count, days_status, is_overdue, is_due_soon,
          status, action_plan_summary, evidence_note, extension_reason, added_by, modified_by, modified_at
        ) VALUES (@p1,@p2,@p3,@p4,@p5,@p6,@p7,@p8,@p9,@p10,@p11,@p12,@p13,@p14,@p15,@p16,@p17,@p18,@p19,@p20,@p21);
      `,
      mysql: `
        INSERT INTO issues_register (
          id, ref, title, audit_ref, audit_title, severity, owner, owner_unit,
          original_due, current_due, extension_count, days_status, is_overdue, is_due_soon,
          status, action_plan_summary, evidence_note, extension_reason, added_by, modified_by, modified_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          ref=VALUES(ref), title=VALUES(title), audit_ref=VALUES(audit_ref), audit_title=VALUES(audit_title),
          severity=VALUES(severity), owner=VALUES(owner), owner_unit=VALUES(owner_unit),
          original_due=VALUES(original_due), current_due=VALUES(current_due), extension_count=VALUES(extension_count),
          days_status=VALUES(days_status), is_overdue=VALUES(is_overdue), is_due_soon=VALUES(is_due_soon),
          status=VALUES(status), action_plan_summary=VALUES(action_plan_summary), evidence_note=VALUES(evidence_note),
          extension_reason=VALUES(extension_reason), modified_by=VALUES(modified_by), modified_at=VALUES(modified_at)
      `,
    },
    params
  );
}

export async function upsertSqlUniverseEntity(entity: Record<string, unknown>, actorEmail: string): Promise<void> {
  if (!hasSqlConfig()) return;
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('upsertUniverseEntity', { entity, actorEmail });
    return;
  }

  await ensureSqlSchema();
  const id = sanitizeId(entity.id);
  const nowIso = new Date().toISOString();
  const params = [
    id,
    clampStr(entity.code, 32),
    clampStr(entity.name, 240, 'Entity'),
    clampStr(entity.division, 160),
    entity.auditDivisionId ? clampStr(entity.auditDivisionId, 64) : null,
    clampStr(entity.category, 120),
    Math.round(clampNum(entity.likelihood, 1, 5, 3)),
    Math.round(clampNum(entity.impact, 1, 5, 3)),
    Math.round(clampNum(entity.riskScore, 1, 25, 9)),
    clampStr(entity.riskLevel, 24, 'Medium'),
    clampStr(entity.lastAudited, 64),
    clampStr(entity.nextDue, 64),
    Math.round(clampNum(entity.cycleMonths, 1, 120, 12)),
    clampStr(entity.defaultLead, 160),
    entity.riskNotes ? clampStr(entity.riskNotes, 2000) : null,
    clampStr(entity.addedBy || actorEmail, 160),
    clampStr(actorEmail, 160),
    nowIso,
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO universe_entities (
          id, code, name, division, audit_division_id, category, likelihood, impact, risk_score,
          risk_level, last_audited, next_due, cycle_months, default_lead, risk_notes, added_by, modified_by, modified_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
        ON CONFLICT (id) DO UPDATE SET
          code=EXCLUDED.code, name=EXCLUDED.name, division=EXCLUDED.division,
          audit_division_id=EXCLUDED.audit_division_id, category=EXCLUDED.category,
          likelihood=EXCLUDED.likelihood, impact=EXCLUDED.impact, risk_score=EXCLUDED.risk_score,
          risk_level=EXCLUDED.risk_level, last_audited=EXCLUDED.last_audited, next_due=EXCLUDED.next_due,
          cycle_months=EXCLUDED.cycle_months, default_lead=EXCLUDED.default_lead, risk_notes=EXCLUDED.risk_notes,
          modified_by=EXCLUDED.modified_by, modified_at=EXCLUDED.modified_at
      `,
      mssql: `
        MERGE dbo.universe_entities AS t
        USING (SELECT @p1 AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET
          code=@p2, name=@p3, division=@p4, audit_division_id=@p5, category=@p6,
          likelihood=@p7, impact=@p8, risk_score=@p9, risk_level=@p10, last_audited=@p11,
          next_due=@p12, cycle_months=@p13, default_lead=@p14, risk_notes=@p15,
          modified_by=@p17, modified_at=@p18
        WHEN NOT MATCHED THEN INSERT (
          id, code, name, division, audit_division_id, category, likelihood, impact, risk_score,
          risk_level, last_audited, next_due, cycle_months, default_lead, risk_notes, added_by, modified_by, modified_at
        ) VALUES (@p1,@p2,@p3,@p4,@p5,@p6,@p7,@p8,@p9,@p10,@p11,@p12,@p13,@p14,@p15,@p16,@p17,@p18);
      `,
      mysql: `
        INSERT INTO universe_entities (
          id, code, name, division, audit_division_id, category, likelihood, impact, risk_score,
          risk_level, last_audited, next_due, cycle_months, default_lead, risk_notes, added_by, modified_by, modified_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          code=VALUES(code), name=VALUES(name), division=VALUES(division),
          audit_division_id=VALUES(audit_division_id), category=VALUES(category),
          likelihood=VALUES(likelihood), impact=VALUES(impact), risk_score=VALUES(risk_score),
          risk_level=VALUES(risk_level), last_audited=VALUES(last_audited), next_due=VALUES(next_due),
          cycle_months=VALUES(cycle_months), default_lead=VALUES(default_lead), risk_notes=VALUES(risk_notes),
          modified_by=VALUES(modified_by), modified_at=VALUES(modified_at)
      `,
    },
    params
  );
}

export async function deleteSqlUniverseEntity(id: string): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeId = sanitizeId(id);
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('deleteUniverseEntity', { id: safeId });
    return;
  }

  await ensureSqlSchema();
  await execQuery(
    {
      postgres: `DELETE FROM universe_entities WHERE id = $1`,
      mssql: `DELETE FROM dbo.universe_entities WHERE id = @p1`,
      mysql: `DELETE FROM universe_entities WHERE id = ?`,
    },
    [safeId]
  );
}

export async function upsertSqlUserProfile(profile: Record<string, unknown>, actorEmail: string): Promise<void> {
  if (!hasSqlConfig()) return;
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('upsertUserProfile', { profile, actorEmail });
    return;
  }

  await ensureSqlSchema();
  const id = sanitizeId(profile.id);
  const nowIso = new Date().toISOString();
  const params = [
    id,
    clampStr(profile.name, 160, 'User'),
    profile.email ? clampStr(String(profile.email).toLowerCase(), 160) : null,
    clampStr(profile.roleTitle, 160),
    clampStr(profile.fullLabel, 240),
    clampStr(profile.headerSubtitle, 160),
    clampStr(profile.department, 160),
    Boolean(profile.canApproveHead),
    Boolean(profile.canApproveIndependent),
    Boolean(profile.canApproveCAE),
    profile.employeeNumber ? clampStr(profile.employeeNumber, 64) : null,
    profile.lastLoginDate ? clampStr(profile.lastLoginDate, 64) : null,
    profile.accountModifiedAt ? clampStr(profile.accountModifiedAt, 64) : null,
    clampStr(profile.accountStatus, 32, 'Active'),
    Math.round(clampNum(profile.failedLoginCount, 0, 100, 0)),
    Boolean(profile.isLocked),
    Boolean(profile.requiresPasswordChange),
    Boolean(profile.mfaEnabled),
    Boolean(profile.isPrivileged),
    clampStr(profile.addedBy || actorEmail, 160),
    clampStr(actorEmail, 160),
    nowIso,
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO user_profiles (
          id, name, email, role_title, full_label, header_subtitle, department,
          can_approve_head, can_approve_independent, can_approve_cae, employee_number,
          last_login_date, account_modified_at, account_status, failed_login_count,
          is_locked, requires_password_change, mfa_enabled, is_privileged,
          added_by, modified_by, modified_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
        ON CONFLICT (id) DO UPDATE SET
          name=EXCLUDED.name, email=EXCLUDED.email, role_title=EXCLUDED.role_title,
          full_label=EXCLUDED.full_label, header_subtitle=EXCLUDED.header_subtitle, department=EXCLUDED.department,
          can_approve_head=EXCLUDED.can_approve_head, can_approve_independent=EXCLUDED.can_approve_independent,
          can_approve_cae=EXCLUDED.can_approve_cae, employee_number=EXCLUDED.employee_number,
          last_login_date=EXCLUDED.last_login_date, account_modified_at=EXCLUDED.account_modified_at,
          account_status=EXCLUDED.account_status, failed_login_count=EXCLUDED.failed_login_count,
          is_locked=EXCLUDED.is_locked, requires_password_change=EXCLUDED.requires_password_change,
          mfa_enabled=EXCLUDED.mfa_enabled, is_privileged=EXCLUDED.is_privileged,
          modified_by=EXCLUDED.modified_by, modified_at=EXCLUDED.modified_at
      `,
      mssql: `
        MERGE dbo.user_profiles AS t
        USING (SELECT @p1 AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET
          name=@p2, email=@p3, role_title=@p4, full_label=@p5, header_subtitle=@p6, department=@p7,
          can_approve_head=@p8, can_approve_independent=@p9, can_approve_cae=@p10, employee_number=@p11,
          last_login_date=@p12, account_modified_at=@p13, account_status=@p14, failed_login_count=@p15,
          is_locked=@p16, requires_password_change=@p17, mfa_enabled=@p18, is_privileged=@p19,
          modified_by=@p21, modified_at=@p22
        WHEN NOT MATCHED THEN INSERT (
          id, name, email, role_title, full_label, header_subtitle, department,
          can_approve_head, can_approve_independent, can_approve_cae, employee_number,
          last_login_date, account_modified_at, account_status, failed_login_count,
          is_locked, requires_password_change, mfa_enabled, is_privileged,
          added_by, modified_by, modified_at
        ) VALUES (@p1,@p2,@p3,@p4,@p5,@p6,@p7,@p8,@p9,@p10,@p11,@p12,@p13,@p14,@p15,@p16,@p17,@p18,@p19,@p20,@p21,@p22);
      `,
      mysql: `
        INSERT INTO user_profiles (
          id, name, email, role_title, full_label, header_subtitle, department,
          can_approve_head, can_approve_independent, can_approve_cae, employee_number,
          last_login_date, account_modified_at, account_status, failed_login_count,
          is_locked, requires_password_change, mfa_enabled, is_privileged,
          added_by, modified_by, modified_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          name=VALUES(name), email=VALUES(email), role_title=VALUES(role_title),
          full_label=VALUES(full_label), header_subtitle=VALUES(header_subtitle), department=VALUES(department),
          can_approve_head=VALUES(can_approve_head), can_approve_independent=VALUES(can_approve_independent),
          can_approve_cae=VALUES(can_approve_cae), employee_number=VALUES(employee_number),
          last_login_date=VALUES(last_login_date), account_modified_at=VALUES(account_modified_at),
          account_status=VALUES(account_status), failed_login_count=VALUES(failed_login_count),
          is_locked=VALUES(is_locked), requires_password_change=VALUES(requires_password_change),
          mfa_enabled=VALUES(mfa_enabled), is_privileged=VALUES(is_privileged),
          modified_by=VALUES(modified_by), modified_at=VALUES(modified_at)
      `,
    },
    params
  );
}

export async function deleteSqlUserProfile(id: string): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeId = sanitizeId(id);
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('deleteUserProfile', { id: safeId });
    return;
  }

  await ensureSqlSchema();
  await execQuery(
    {
      postgres: `DELETE FROM user_profiles WHERE id = $1`,
      mssql: `DELETE FROM dbo.user_profiles WHERE id = @p1`,
      mysql: `DELETE FROM user_profiles WHERE id = ?`,
    },
    [safeId]
  );
}

export async function saveSqlFrequencies(
  freq: { high: number; medium: number; low: number },
  actorEmail: string
): Promise<void> {
  if (!hasSqlConfig()) return;
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('saveFrequencies', { freq, actorEmail });
    return;
  }

  await ensureSqlSchema();
  const nowIso = new Date().toISOString();
  const params = [
    'global',
    Math.round(clampNum(freq.high, 1, 120, 12)),
    Math.round(clampNum(freq.medium, 1, 120, 36)),
    Math.round(clampNum(freq.low, 1, 120, 48)),
    clampStr(actorEmail, 160),
    clampStr(actorEmail, 160),
    nowIso,
  ];

  await execQuery(
    {
      postgres: `
        INSERT INTO audit_frequencies (id, high_months, medium_months, low_months, added_by, modified_by, modified_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (id) DO UPDATE SET
          high_months=EXCLUDED.high_months, medium_months=EXCLUDED.medium_months, low_months=EXCLUDED.low_months,
          modified_by=EXCLUDED.modified_by, modified_at=EXCLUDED.modified_at
      `,
      mssql: `
        MERGE dbo.audit_frequencies AS t
        USING (SELECT @p1 AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET
          high_months=@p2, medium_months=@p3, low_months=@p4, modified_by=@p6, modified_at=@p7
        WHEN NOT MATCHED THEN INSERT (id, high_months, medium_months, low_months, added_by, modified_by, modified_at)
          VALUES (@p1,@p2,@p3,@p4,@p5,@p6,@p7);
      `,
      mysql: `
        INSERT INTO audit_frequencies (id, high_months, medium_months, low_months, added_by, modified_by, modified_at)
        VALUES (?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          high_months=VALUES(high_months), medium_months=VALUES(medium_months), low_months=VALUES(low_months),
          modified_by=VALUES(modified_by), modified_at=VALUES(modified_at)
      `,
    },
    params
  );
}

export async function saveSqlMasterData(key: string, value: unknown, actorEmail: string): Promise<void> {
  if (!hasSqlConfig()) return;
  const safeKey = sanitizeId(key);
  if (resolveSqlEngine() === 'http') {
    await callHttpGateway('saveMasterData', { key: safeKey, value, actorEmail });
    return;
  }

  await ensureSqlSchema();
  const nowIso = new Date().toISOString();
  const jsonStr = JSON.stringify(value ?? null);
  const params = [safeKey, jsonStr, clampStr(actorEmail, 160), clampStr(actorEmail, 160), nowIso];

  await execQuery(
    {
      postgres: `
        INSERT INTO master_data (data_key, data_json, added_by, modified_by, modified_at)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (data_key) DO UPDATE SET
          data_json=EXCLUDED.data_json, modified_by=EXCLUDED.modified_by, modified_at=EXCLUDED.modified_at
      `,
      mssql: `
        MERGE dbo.master_data AS t
        USING (SELECT @p1 AS data_key) AS s ON t.data_key = s.data_key
        WHEN MATCHED THEN UPDATE SET data_json=@p2, modified_by=@p4, modified_at=@p5
        WHEN NOT MATCHED THEN INSERT (data_key, data_json, added_by, modified_by, modified_at)
          VALUES (@p1,@p2,@p3,@p4,@p5);
      `,
      mysql: `
        INSERT INTO master_data (data_key, data_json, added_by, modified_by, modified_at)
        VALUES (?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          data_json=VALUES(data_json), modified_by=VALUES(modified_by), modified_at=VALUES(modified_at)
      `,
    },
    params
  );
}

export async function fetchSqlMasterDataValue(key: string): Promise<unknown> {
  if (!hasSqlConfig()) return null;
  const safeKey = sanitizeId(key);
  if (resolveSqlEngine() === 'http') {
    const res = await callHttpGateway<{ value: unknown }>('getMasterData', { key: safeKey });
    return res.value ?? null;
  }

  await ensureSqlSchema();
  const rows = await execQuery<{ data_json: string }>(
    {
      postgres: `SELECT data_json FROM master_data WHERE data_key = $1 LIMIT 1`,
      mssql: `SELECT TOP 1 data_json FROM dbo.master_data WHERE data_key = @p1`,
      mysql: `SELECT data_json FROM master_data WHERE data_key = ? LIMIT 1`,
    },
    [safeKey]
  );
  if (!rows.length || typeof rows[0].data_json !== 'string') return null;
  try {
    return JSON.parse(rows[0].data_json);
  } catch {
    return null;
  }
}

export async function fetchSqlWorkspaceSnapshot(includeAdminEmails: boolean): Promise<{
  engagements: Record<string, unknown>[];
  issues: Record<string, unknown>[];
  universe: Record<string, unknown>[];
  userProfiles: Record<string, unknown>[];
  frequencies: { high: number; medium: number; low: number };
}> {
  if (!hasSqlConfig()) {
    throw new Error('SQL Connect is not configured.');
  }

  if (resolveSqlEngine() === 'http') {
    return callHttpGateway('fetchWorkspace', { includeAdminEmails });
  }

  await ensureSqlSchema();

  const [engRows, wnRows, fndRows, taRows, fileRows, logRows, issueRows, uniRows, profileRows, freqRows] =
    await Promise.all([
      execQuery<Record<string, unknown>>({
        postgres: `SELECT * FROM engagements ORDER BY ref ASC`,
        mssql: `SELECT * FROM dbo.engagements ORDER BY ref ASC`,
        mysql: `SELECT * FROM engagements ORDER BY ref ASC`,
      }),
      execQuery<Record<string, unknown>>({
        postgres: `SELECT * FROM working_notes`,
        mssql: `SELECT * FROM dbo.working_notes`,
        mysql: `SELECT * FROM working_notes`,
      }),
      execQuery<Record<string, unknown>>({
        postgres: `SELECT * FROM findings`,
        mssql: `SELECT * FROM dbo.findings`,
        mysql: `SELECT * FROM findings`,
      }),
      execQuery<Record<string, unknown>>({
        postgres: `SELECT * FROM timeline_activities`,
        mssql: `SELECT * FROM dbo.timeline_activities`,
        mysql: `SELECT * FROM timeline_activities`,
      }),
      execQuery<Record<string, unknown>>({
        postgres: `SELECT * FROM engagement_files`,
        mssql: `SELECT * FROM dbo.engagement_files`,
        mysql: `SELECT * FROM engagement_files`,
      }),
      execQuery<Record<string, unknown>>({
        postgres: `SELECT * FROM activity_logs`,
        mssql: `SELECT * FROM dbo.activity_logs`,
        mysql: `SELECT * FROM activity_logs`,
      }),
      execQuery<Record<string, unknown>>({
        postgres: `SELECT * FROM issues_register ORDER BY ref ASC`,
        mssql: `SELECT * FROM dbo.issues_register ORDER BY ref ASC`,
        mysql: `SELECT * FROM issues_register ORDER BY ref ASC`,
      }),
      execQuery<Record<string, unknown>>({
        postgres: `SELECT * FROM universe_entities ORDER BY code ASC`,
        mssql: `SELECT * FROM dbo.universe_entities ORDER BY code ASC`,
        mysql: `SELECT * FROM universe_entities ORDER BY code ASC`,
      }),
      execQuery<Record<string, unknown>>({
        postgres: `SELECT * FROM user_profiles`,
        mssql: `SELECT * FROM dbo.user_profiles`,
        mysql: `SELECT * FROM user_profiles`,
      }),
      execQuery<Record<string, unknown>>({
        postgres: `SELECT * FROM audit_frequencies WHERE id = 'global'`,
        mssql: `SELECT * FROM dbo.audit_frequencies WHERE id = 'global'`,
        mysql: `SELECT * FROM audit_frequencies WHERE id = 'global'`,
      }),
    ]);

  const groupByEng = <T>(rows: Record<string, unknown>[], mapFn: (r: Record<string, unknown>) => T) => {
    const map = new Map<string, T[]>();
    for (const r of rows) {
      const eid = String(r.engagement_id ?? '');
      const list = map.get(eid) ?? [];
      list.push(mapFn(r));
      map.set(eid, list);
    }
    return map;
  };

  const wnMap = groupByEng(wnRows, (r) => ({
    id: String(r.id),
    ref: String(r.ref ?? ''),
    title: String(r.title ?? ''),
    controlArea: String(r.control_area ?? ''),
    author: String(r.author ?? ''),
    status: String(r.status ?? 'Draft'),
    hasException: Boolean(r.has_exception),
    updatedAt: String(r.updated_at ?? ''),
    testingProcedure: String(r.testing_procedure ?? ''),
    observations: r.observations ?? undefined,
    conclusion: String(r.conclusion ?? ''),
    reviewerComments: r.reviewer_comments ?? undefined,
    addedBy: r.added_by ?? undefined,
    modifiedBy: r.modified_by ?? undefined,
    modifiedAt: r.modified_at ?? undefined,
  }));

  const fndMap = groupByEng(fndRows, (r) => ({
    id: String(r.id),
    ref: String(r.ref ?? ''),
    title: String(r.title ?? ''),
    severity: String(r.severity ?? 'Medium'),
    category: r.category ?? 'General',
    condition: String(r.condition_text ?? ''),
    criteria: String(r.criteria_text ?? ''),
    cause: String(r.cause_text ?? ''),
    effect: String(r.effect_text ?? ''),
    recommendation: String(r.recommendation ?? ''),
    owner: String(r.owner ?? ''),
    targetDate: String(r.target_date ?? ''),
    status: String(r.status ?? 'Open'),
    linkedNoteRef: String(r.linked_note_ref ?? ''),
    addedBy: r.added_by ?? undefined,
    modifiedBy: r.modified_by ?? undefined,
    modifiedAt: r.modified_at ?? undefined,
  }));

  const taMap = groupByEng(taRows, (r) => ({
    id: String(r.id),
    name: String(r.name ?? ''),
    roleResponsible: String(r.role_responsible ?? ''),
    dueDate: String(r.due_date ?? ''),
    completedDate: r.completed_date ?? undefined,
    status: String(r.status ?? 'Pending'),
    stageId: Number(r.stage_id ?? 1),
  }));

  const fileMap = groupByEng(fileRows, (r) => ({
    id: String(r.id),
    name: String(r.name ?? ''),
    folder: String(r.folder ?? ''),
    size: String(r.size_label ?? ''),
    uploadedBy: String(r.uploaded_by ?? ''),
    uploadedAt: String(r.uploaded_at ?? ''),
  }));

  const logMap = groupByEng(logRows, (r) => ({
    id: String(r.id),
    timestamp: String(r.timestamp_label ?? ''),
    actor: String(r.actor ?? ''),
    action: String(r.action ?? ''),
    detail: r.detail ?? undefined,
  }));

  const engagements = engRows.map((r) => {
    const id = String(r.id);
    return {
      id,
      ref: String(r.ref ?? ''),
      year: Number(r.year ?? 2026),
      title: String(r.title ?? ''),
      category: String(r.category ?? ''),
      department: String(r.department ?? ''),
      auditDivisionId: r.audit_division_id ?? undefined,
      entityName: String(r.entity_name ?? ''),
      likelihood: Number(r.likelihood ?? 3),
      impact: Number(r.impact ?? 3),
      riskScore: Number(r.risk_score ?? 9),
      riskLevel: String(r.risk_level ?? 'Medium'),
      lead: String(r.lead ?? ''),
      headReviewer: String(r.head_reviewer ?? ''),
      independentReviewer: String(r.independent_reviewer ?? 'Not needed'),
      startDate: String(r.start_date ?? ''),
      endDate: String(r.end_date ?? ''),
      objectives: r.objectives ?? '',
      scope: r.scope ?? '',
      criteria: r.criteria ?? '',
      addresseeName: r.addressee_name ?? '',
      addresseeTitle: r.addressee_title ?? '',
      copyFurnished: r.copy_furnished ?? '',
      durationDays: Number(r.duration_days ?? 0),
      budgetedHours: Number(r.budgeted_hours ?? 0),
      status: String(r.status ?? 'Planned'),
      readyRatio: String(r.ready_ratio ?? '0/9 ready'),
      lifecycleStage: Number(r.lifecycle_stage ?? 1),
      fieldworkPct: Number(r.fieldwork_pct ?? 0),
      fieldworkDayCurrent: Number(r.fieldwork_day_current ?? 0),
      fieldworkDayTotal: Number(r.fieldwork_day_total ?? 0),
      reportStatus: String(r.report_status ?? 'Draft'),
      reportRating: r.report_rating ?? undefined,
      reportRef: String(r.report_ref ?? ''),
      executiveSummary: String(r.executive_summary ?? ''),
      addedBy: r.added_by ?? undefined,
      modifiedBy: r.modified_by ?? undefined,
      modifiedAt: r.modified_at ?? undefined,
      workingNotes: wnMap.get(id) ?? [],
      findings: fndMap.get(id) ?? [],
      timelineActivities: taMap.get(id) ?? [],
      files: fileMap.get(id) ?? [],
      activityLog: logMap.get(id) ?? [],
    };
  });

  const issues = issueRows.map((r) => ({
    id: String(r.id),
    ref: String(r.ref ?? ''),
    title: String(r.title ?? ''),
    auditRef: String(r.audit_ref ?? ''),
    auditTitle: String(r.audit_title ?? ''),
    severity: String(r.severity ?? 'Medium'),
    owner: String(r.owner ?? ''),
    ownerUnit: String(r.owner_unit ?? ''),
    originalDue: String(r.original_due ?? ''),
    currentDue: String(r.current_due ?? ''),
    extensionCount: Number(r.extension_count ?? 0),
    daysStatus: String(r.days_status ?? ''),
    isOverdue: Boolean(r.is_overdue),
    isDueSoon: Boolean(r.is_due_soon),
    status: String(r.status ?? 'Open'),
    actionPlanSummary: String(r.action_plan_summary ?? ''),
    evidenceNote: r.evidence_note ?? undefined,
    extensionReason: r.extension_reason ?? undefined,
    addedBy: r.added_by ?? undefined,
    modifiedBy: r.modified_by ?? undefined,
    modifiedAt: r.modified_at ?? undefined,
  }));

  const universe = uniRows.map((r) => ({
    id: String(r.id),
    code: String(r.code ?? ''),
    name: String(r.name ?? ''),
    division: String(r.division ?? ''),
    auditDivisionId: r.audit_division_id ?? undefined,
    category: String(r.category ?? ''),
    likelihood: Number(r.likelihood ?? 3),
    impact: Number(r.impact ?? 3),
    riskScore: Number(r.risk_score ?? 9),
    riskLevel: String(r.risk_level ?? 'Medium'),
    lastAudited: String(r.last_audited ?? ''),
    nextDue: String(r.next_due ?? ''),
    cycleMonths: Number(r.cycle_months ?? 12),
    defaultLead: String(r.default_lead ?? ''),
    riskNotes: r.risk_notes ?? '',
    addedBy: r.added_by ?? undefined,
    modifiedBy: r.modified_by ?? undefined,
    modifiedAt: r.modified_at ?? undefined,
  }));

  const userProfiles = profileRows.map((r) => ({
    id: String(r.id),
    name: String(r.name ?? ''),
    email: includeAdminEmails && r.email ? String(r.email) : undefined,
    roleTitle: String(r.role_title ?? ''),
    fullLabel: String(r.full_label ?? ''),
    headerSubtitle: String(r.header_subtitle ?? ''),
    department: String(r.department ?? ''),
    canApproveHead: Boolean(r.can_approve_head),
    canApproveIndependent: Boolean(r.can_approve_independent),
    canApproveCAE: Boolean(r.can_approve_cae),
    employeeNumber: r.employee_number ?? undefined,
    lastLoginDate: r.last_login_date ?? undefined,
    accountModifiedAt: r.account_modified_at ?? undefined,
    accountStatus: String(r.account_status ?? 'Active'),
    failedLoginCount: Number(r.failed_login_count ?? 0),
    isLocked: Boolean(r.is_locked),
    requiresPasswordChange: Boolean(r.requires_password_change),
    passwordHistory: [],
    mfaEnabled: Boolean(r.mfa_enabled),
    isPrivileged: Boolean(r.is_privileged),
  }));

  const f = freqRows[0];
  const frequencies = {
    high: Number(f?.high_months ?? 12),
    medium: Number(f?.medium_months ?? 36),
    low: Number(f?.low_months ?? 48),
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
    throw new Error('SQL Connect is not configured.');
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
      for (const wn of Array.isArray(eng.workingNotes) ? (eng.workingNotes as Record<string, unknown>[]) : []) {
        await upsertSqlWorkingNote(engId, wn, actorEmail);
      }
      for (const fnd of Array.isArray(eng.findings) ? (eng.findings as Record<string, unknown>[]) : []) {
        await upsertSqlFinding(engId, fnd, actorEmail);
      }
      for (const ta of Array.isArray(eng.timelineActivities)
        ? (eng.timelineActivities as Record<string, unknown>[])
        : []) {
        await upsertSqlTimelineActivity(engId, ta);
      }
      for (const fl of Array.isArray(eng.files) ? (eng.files as Record<string, unknown>[]) : []) {
        await insertSqlFile(engId, fl);
      }
      for (const lg of Array.isArray(eng.activityLog) ? (eng.activityLog as Record<string, unknown>[]) : []) {
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
