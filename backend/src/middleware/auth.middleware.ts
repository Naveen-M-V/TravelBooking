import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string; role: string }
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const payload = AuthService.verifyToken(token)
    req.user = payload
    next()
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' })
  }
}

/** Middleware to require one of the specified roles */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' })
    }
    next()
  }
}

/** Optional auth — attaches user if token present but doesn't block if missing */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      req.user = AuthService.verifyToken(token)
    }
  } catch {
    // ignore invalid token for optional auth
  }
  next()
}
