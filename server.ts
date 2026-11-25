import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import type { Response } from 'express';
import type { AuthenticatedRequest } from './server/authMiddleware.ts';
import { DATA_CONNECT_CONFIG } from './server/firebaseAdmin.ts';
import {
  requireFirebaseAuth,
  requireSqlAdmin,
} from './server/authMiddleware.ts';
import {
  deleteDataConnectAppSession,
  deleteSqlSystemUserByEmail,
  deleteSqlUniverseEntity,
  deleteSqlUserProfile,
  ensureSqlSchema,
  fetchSqlMasterDataValue,
  fetchSqlWorkspaceSnapshot,
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
} from './server/dataConnectDb.ts';

const ADMIN_ONLY_MASTER_KEYS = new Set([
  'access_users_registry',
  'auditors',
  'auditee_directory',
]);

function handleApiError(res: Response, err: unknown, fallback = 'Firebase Data Connect request failed.'): void {
  const msg = err instanceof Error ? err.message : fallback;
  res.status(500).json({ error: msg || fallback });
}

function ensureConfiguredOr503(res: Response): boolean {
  if (!hasSqlConfig()) {
    res.status(503).json({
      error: 'Firebase Data Connect service account (FIREBASE_SERVICE_ACCOUNT_KEY) is not configured.',
    });
    return false;
  }
  return true;
}

async function startServer() {
  const app = express();
  const hmrEnabled = process.env.DISABLE_HMR !== 'true' && !process.env.APP_URL;
  app.use(express.json({ limit: '10mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/sql/status', (_req, res) => {
    res.json(getSqlPublicConfig());
  });

  app.post(
    '/api/sql/schema/ensure',
    requireFirebaseAuth,
    requireSqlAdmin,
    async (_req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        await ensureSqlSchema(true);
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err, 'Failed to verify the Firebase Data Connect schema.');
      }
    }
  );

  app.get('/api/sql/workspace', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    if (!ensureConfiguredOr503(res)) return;
    try {
      const includeAdminEmails = Boolean(
        req.authUser?.isBootstrappedAdmin || req.authUser?.isSqlAdmin
      );
      const snapshot = await fetchSqlWorkspaceSnapshot(includeAdminEmails);
      res.json(snapshot);
    } catch (err) {
      handleApiError(res, err, 'Failed to load workspace from Firebase Data Connect.');
    }
  });

  app.post(
    '/api/sql/sync-from-workspace',
    requireFirebaseAuth,
    requireSqlAdmin,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        const body = (req.body ?? {}) as Record<string, unknown>;
        const actor = req.authUser?.email || 'system';
        const result = await syncWorkspaceSnapshotToSql(body, actor);
        res.json(result);
      } catch (err) {
        handleApiError(res, err, 'Failed to synchronize workspace to Firebase Data Connect.');
      }
    }
  );

  app.put('/api/sql/engagements/:id', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    if (!ensureConfiguredOr503(res)) return;
    try {
      const eng = { ...((req.body ?? {}) as Record<string, unknown>), id: req.params.id };
      await upsertSqlEngagement(eng, req.authUser?.email || 'system');
      res.json({ ok: true });
    } catch (err) {
      handleApiError(res, err);
    }
  });

  app.put(
    '/api/sql/engagements/:engagementId/working-notes/:id',
    requireFirebaseAuth,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        const note = { ...((req.body ?? {}) as Record<string, unknown>), id: req.params.id };
        await upsertSqlWorkingNote(
          req.params.engagementId,
          note,
          req.authUser?.email || 'system'
        );
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.put(
    '/api/sql/engagements/:engagementId/findings/:id',
    requireFirebaseAuth,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        const finding = { ...((req.body ?? {}) as Record<string, unknown>), id: req.params.id };
        await upsertSqlFinding(
          req.params.engagementId,
          finding,
          req.authUser?.email || 'system'
        );
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.put(
    '/api/sql/engagements/:engagementId/timeline/:id',
    requireFirebaseAuth,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        const activity = { ...((req.body ?? {}) as Record<string, unknown>), id: req.params.id };
        await upsertSqlTimelineActivity(req.params.engagementId, activity);
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.post(
    '/api/sql/engagements/:engagementId/files',
    requireFirebaseAuth,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        await insertSqlFile(
          req.params.engagementId,
          (req.body ?? {}) as Record<string, unknown>
        );
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.post(
    '/api/sql/engagements/:engagementId/activity-log',
    requireFirebaseAuth,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        await insertSqlActivityLog(
          req.params.engagementId,
          (req.body ?? {}) as Record<string, unknown>
        );
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.put('/api/sql/issues/:id', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    if (!ensureConfiguredOr503(res)) return;
    try {
      const issue = { ...((req.body ?? {}) as Record<string, unknown>), id: req.params.id };
      await upsertSqlIssue(issue, req.authUser?.email || 'system');
      res.json({ ok: true });
    } catch (err) {
      handleApiError(res, err);
    }
  });

  app.put('/api/sql/universe/:id', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    if (!ensureConfiguredOr503(res)) return;
    try {
      const entity = { ...((req.body ?? {}) as Record<string, unknown>), id: req.params.id };
      await upsertSqlUniverseEntity(entity, req.authUser?.email || 'system');
      res.json({ ok: true });
    } catch (err) {
      handleApiError(res, err);
    }
  });

  app.delete(
    '/api/sql/universe/:id',
    requireFirebaseAuth,
    requireSqlAdmin,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        await deleteSqlUniverseEntity(req.params.id);
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.put(
    '/api/sql/user-profiles/:id',
    requireFirebaseAuth,
    requireSqlAdmin,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        const profile = { ...((req.body ?? {}) as Record<string, unknown>), id: req.params.id };
        await upsertSqlUserProfile(profile, req.authUser?.email || 'system');
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.delete(
    '/api/sql/user-profiles/:id',
    requireFirebaseAuth,
    requireSqlAdmin,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        await deleteSqlUserProfile(req.params.id);
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.get(
    '/api/sql/system-users',
    requireFirebaseAuth,
    requireSqlAdmin,
    async (_req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        const users = await listSqlSystemUsers();
        res.json({ users });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.put(
    '/api/sql/sessions/:id',
    requireFirebaseAuth,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        const b = (req.body ?? {}) as Record<string, unknown>;
        await upsertDataConnectAppSession({
          id: req.params.id,
          userId: req.authUser?.uid,
          email: req.authUser?.email,
          role: typeof b.role === 'string' ? b.role : req.authUser?.isSqlAdmin ? 'admin' : 'user',
          appRole: typeof b.appRole === 'string' ? b.appRole : req.authUser?.appRole,
          issuedAt: typeof b.issuedAt === 'string' ? b.issuedAt : undefined,
          expiresAt: typeof b.expiresAt === 'string' ? b.expiresAt : undefined,
        });
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.delete(
    '/api/sql/sessions/:id',
    requireFirebaseAuth,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        await deleteDataConnectAppSession(req.params.id);
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.put(
    '/api/sql/system-users',
    requireFirebaseAuth,
    requireSqlAdmin,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        const b = (req.body ?? {}) as Record<string, unknown>;
        await upsertSqlSystemUser({
          id: String(b.id ?? ''),
          username: String(b.username ?? ''),
          fullName: String(b.fullName ?? ''),
          email: String(b.email ?? ''),
          role: b.role === 'admin' ? 'admin' : 'user',
          appRole: typeof b.appRole === 'string' ? b.appRole : undefined,
          scope: typeof b.scope === 'string' ? b.scope : undefined,
          employeeNumber: typeof b.employeeNumber === 'string' ? b.employeeNumber : undefined,
          isActive: b.isActive !== false,
          isLocked: b.isLocked === true,
        });
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.delete(
    '/api/sql/system-users',
    requireFirebaseAuth,
    requireSqlAdmin,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        const email = typeof req.body?.email === 'string' ? req.body.email : '';
        await deleteSqlSystemUserByEmail(email);
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.put(
    '/api/sql/frequencies',
    requireFirebaseAuth,
    requireSqlAdmin,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        const b = (req.body ?? {}) as Record<string, unknown>;
        await saveSqlFrequencies(
          {
            high: Number(b.high ?? 12),
            medium: Number(b.medium ?? 36),
            low: Number(b.low ?? 48),
          },
          req.authUser?.email || 'system'
        );
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.get('/api/sql/master-data/:key', requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    if (!ensureConfiguredOr503(res)) return;
    const key = req.params.key;
    if (
      ADMIN_ONLY_MASTER_KEYS.has(key) &&
      !req.authUser?.isBootstrappedAdmin &&
      !req.authUser?.isSqlAdmin
    ) {
      res.status(403).json({ error: 'Forbidden: Administrator privileges required.' });
      return;
    }
    try {
      const value = await fetchSqlMasterDataValue(key);
      res.json({ value });
    } catch (err) {
      handleApiError(res, err);
    }
  });

  app.put(
    '/api/sql/master-data/:key',
    requireFirebaseAuth,
    requireSqlAdmin,
    async (req: AuthenticatedRequest, res) => {
      if (!ensureConfiguredOr503(res)) return;
      try {
        await saveSqlMasterData(
          req.params.key,
          req.body?.value ?? null,
          req.authUser?.email || 'system'
        );
        res.json({ ok: true });
      } catch (err) {
        handleApiError(res, err);
      }
    }
  );

  app.use('/api', (req, res) => {
    res.status(404).json({
      error: `API route not found: ${req.method} ${req.originalUrl}`,
    });
  });

  let viteInitError: unknown = null;
  if (process.env.NODE_ENV !== 'production') {
    const viteReadyPromise = import('vite')
      .then(({ createServer: createViteServer }) =>
        createViteServer({
          server: {
            middlewareMode: true,
            hmr: hmrEnabled,
          },
          appType: 'spa',
        })
      )
      .catch((err) => {
        viteInitError = err;
        console.error('[vite] Failed to start Vite dev middleware:', err);
        return null;
      });
    app.use((req, res, next) => {
      if (req.path.startsWith('/api/')) {
        next();
        return;
      }
      viteReadyPromise
        .then((vite) => {
          if (!vite) {
            next(viteInitError ?? new Error('Vite middleware unavailable'));
            return;
          }
          vite.middlewares(req, res, next);
        })
        .catch(next);
    });
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const resolvePort = (): number => {
    const argv = process.argv.slice(2);
    for (let i = 0; i < argv.length; i += 1) {
      const arg = argv[i];
      if (arg === '--port' && i + 1 < argv.length) {
        const parsed = Number(argv[i + 1]);
        if (Number.isInteger(parsed) && parsed > 0 && parsed < 65536) return parsed;
      } else if (arg.startsWith('--port=')) {
        const parsed = Number(arg.slice('--port='.length));
        if (Number.isInteger(parsed) && parsed > 0 && parsed < 65536) return parsed;
      }
    }
    const envPort = Number(process.env.PORT);
    if (Number.isInteger(envPort) && envPort > 0 && envPort < 65536) return envPort;
    return 3000;
  };

  const port = resolvePort();
  const server = app.listen(port, '0.0.0.0', () => {
    const sqlCfg = getSqlPublicConfig();
    console.log(
      `Audit Management System server listening on port ${port} (${
        sqlCfg.configured
          ? `Firebase Data Connect active over HTTPS (${DATA_CONNECT_CONFIG.serviceId}, ${DATA_CONNECT_CONFIG.location}, connector=${DATA_CONNECT_CONFIG.connector})`
          : 'Firebase Data Connect awaiting FIREBASE_SERVICE_ACCOUNT_KEY'
      })`
    );
  });
  server.on('error', (err) => {
    console.error(`[server] HTTP server failed on port ${port}:`, err);
  });
}

startServer().catch((err) => {
  console.error('[server] Fatal startup error:', err);
  process.exit(1);
});
