import { Request, Response, NextFunction } from 'express'

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: Extract user role from request
      // TODO: Check if user role is in allowedRoles
      
      next()
    } catch (error) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' })
    }
  }
}
