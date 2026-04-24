import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, telephone, companyName, website, isTravelAgent } = req.body
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }
      const result = await AuthService.register(email, password, firstName, lastName, 'customer', telephone, companyName, website, Boolean(isTravelAgent))
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

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      if (!userId) return res.status(401).json({ error: 'Unauthorized' })
      const { firstName, lastName, telephone, isTravelAgent, companyName, website, nationality, residency } = req.body
      const user = await AuthService.updateProfile(userId, { firstName, lastName, telephone, isTravelAgent, companyName, website, nationality, residency })
      res.status(200).json({ success: true, user })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update profile' })
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.params
      if (!token) return res.status(400).json({ error: 'Token is required' })
      const result = await AuthService.verifyEmail(token)
      res.status(200).json({ success: true, ...result })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Verification failed' })
    }
  }

  static async resendVerification(req: Request, res: Response) {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ error: 'Email is required' })
      await AuthService.resendVerification(email)
      res.status(200).json({ success: true, message: 'Verification email sent' })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to resend verification' })
    }
  }

  static async inviteAdmin(req: Request, res: Response) {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ error: 'Email is required' })
      const result = await AuthService.inviteAdmin(email)
      res.status(200).json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to send invite' })
    }
  }

  static async acceptInvite(req: Request, res: Response) {
    try {
      const { token, password, firstName, lastName } = req.body
      if (!token || !password) return res.status(400).json({ error: 'Token and password are required' })
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
      const result = await AuthService.acceptInvite(token, password, firstName || '', lastName || '')
      res.status(200).json({ success: true, ...result })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to accept invite' })
    }
  }

  static async listUsers(req: Request, res: Response) {
    try {
      const { page, limit, role } = req.query
      const result = await AuthService.listUsers({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
        role: role as string | undefined,
      })
      res.json({ success: true, ...result })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to list users' })
    }
  }

  static async updateUserRole(req: Request, res: Response) {
    try {
      const { role } = req.body
      if (!role || !['customer', 'vendor', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be customer, vendor, or admin.' })
      }
      const user = await AuthService.updateUserRole(req.params.id, role)
      res.json({ success: true, user })
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' })
      res.status(500).json({ error: error.message || 'Failed to update role' })
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      if (!userId) return res.status(401).json({ error: 'Unauthorized' })
      const { currentPassword, newPassword } = req.body
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' })
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters' })
      }
      await AuthService.changePassword(userId, currentPassword, newPassword)
      res.status(200).json({ success: true, message: 'Password changed successfully' })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to change password' })
    }
  }
}
