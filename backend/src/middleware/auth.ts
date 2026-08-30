import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebaseAdmin';

export interface AuthedRequest extends Request {
  user?: { email: string; uid: string };
}

// Verifies the Firebase ID token sent from the frontend (Authorization: Bearer <token>).
// This replaces the old hand-rolled JWT_SECRET flow — Firebase already issues and
// verifies tokens for you, so there's one less secret to manage and leak.
export async function verifyFirebaseToken(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (!decoded.email) {
      return res.status(403).json({ error: 'Forbidden: token has no email' });
    }
    req.user = { email: decoded.email, uid: decoded.uid };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: invalid or expired token' });
  }
}

// Ensures a route param/body email matches the authenticated user, so user A
// can never read or modify user B's tasks just by changing an email in the URL.
export function ownsResource(getEmail: (req: AuthedRequest) => string | undefined) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const target = getEmail(req);
    if (!req.user || target !== req.user.email) {
      return res.status(403).json({ error: 'Forbidden: not your resource' });
    }
    next();
  };
}
