import type { NextFunction, Request, Response } from 'express';
import { getAdminAuth } from './firebaseAdmin.ts';
import { findSqlSystemUserByEmail, hasSqlConfig } from './dataConnectDb.ts';

export const BOOTSTRAPPED_ADMIN_EMAIL = 'christian.macahilig@citysavings.com.ph';

export interface VerifiedAuthUser {
  uid: string;
  email: string;
  isBootstrappedAdmin: boolean;
  isSqlAdmin: boolean;
  appRole?: string;
}

export interface AuthenticatedRequest extends Request {
  authUser?: VerifiedAuthUser;
}

export async function requireFirebaseAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing bearer token.' });
    return;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Empty bearer token.' });
    return;
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const email = typeof decoded.email === 'string' ? decoded.email.trim().toLowerCase() : '';
    if (!email || decoded.email_verified !== true) {
      res.status(403).json({ error: 'Forbidden: A verified Google email is required.' });
      return;
    }

    const isBootstrappedAdmin = email === BOOTSTRAPPED_ADMIN_EMAIL;
    let isSqlAdmin = isBootstrappedAdmin;
    let appRole: string | undefined = isBootstrappedAdmin ? 'System administrator' : undefined;

    if (hasSqlConfig()) {
      const sqlUser = await findSqlSystemUserByEmail(email).catch(() => null);
      if (sqlUser) {
        if (!isBootstrappedAdmin && (!sqlUser.isActive || sqlUser.isLocked)) {
          res.status(403).json({ error: 'Forbidden: Account is locked or inactive.' });
          return;
        }
        isSqlAdmin = isBootstrappedAdmin || sqlUser.role === 'admin';
        if (sqlUser.appRole) appRole = sqlUser.appRole;
      }
    }

    req.authUser = {
      uid: decoded.uid,
      email,
      isBootstrappedAdmin,
      isSqlAdmin,
      appRole,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired session token.' });
  }
}

export function requireSqlAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.authUser) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }
  if (!req.authUser.isBootstrappedAdmin && !req.authUser.isSqlAdmin) {
    res.status(403).json({ error: 'Forbidden: Administrator privileges required.' });
    return;
  }
  next();
}
