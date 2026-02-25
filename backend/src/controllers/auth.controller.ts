import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, telephone, role } = req.body
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }
      const result = await AuthService.register(email, password, firstName, lastName, role, telephone)
      res.status(201).json({ success: true, ...result })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Registration failed' })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }
      const result = await AuthService.login(email, password)
      res.status(200).json({ success: true, ...result })
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Login failed' })
    }
  }

  static async logout(req: Request, res: Response) {
    // JWT is stateless — client simply discards the token
    res.status(200).json({ success: true, message: 'Logged out successfully' })
  }

  static async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      if (!userId) return res.status(401).json({ error: 'Unauthorized' })
      const user = await AuthService.getCurrentUser(userId)
      if (!user) return res.status(404).json({ error: 'User not found' })
      res.status(200).json({ success: true, user })
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to get user' })
    }
  }
}
