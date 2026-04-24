import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import { config } from '../config/env'
import { EmailService } from './email.service'

const prisma = new PrismaClient()

export interface AuthPayload {
  userId: string
  email: string
  role: string
}

export class AuthService {
  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string = 'customer',
    telephone?: string,
    companyName?: string,
    website?: string,
    isTravelAgent = false
  ) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error('Email is already registered')

    const passwordHash = await bcrypt.hash(password, 10)
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.user.create({
      data: {
        email, passwordHash, firstName, lastName, role, telephone, companyName, website, isTravelAgent,
        emailVerified: false, verificationToken, verificationTokenExpiry,
      },
    })

    await EmailService.sendVerificationEmail(email, firstName || 'there', verificationToken)
    return { requiresVerification: true, email }
  }

  static async verifyEmail(token: string) {
    const user = await prisma.user.findUnique({ where: { verificationToken: token } })
    if (!user) throw new Error('Invalid or expired verification link')
    if (!user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) {
      throw new Error('Verification link has expired. Please request a new one.')
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null, verificationTokenExpiry: null },
    })

    const jwtToken = this.signToken({ userId: updated.id, email: updated.email, role: updated.role })
    return {
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        isTravelAgent: updated.isTravelAgent,
        companyName: updated.companyName,
        website: updated.website,
        role: updated.role,
      },
      token: jwtToken,
    }
  }

  static async resendVerification(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('No account found with that email')
    if (user.emailVerified) throw new Error('This email is already verified')

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.user.update({ where: { id: user.id }, data: { verificationToken, verificationTokenExpiry } })
    await EmailService.sendVerificationEmail(email, user.firstName || 'there', verificationToken)
    return { success: true }
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) throw new Error('Invalid email or password')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new Error('Invalid email or password')

    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in. Check your inbox for the verification link.')
    }

    const token = this.signToken({ userId: user.id, email: user.email, role: user.role })
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isTravelAgent: user.isTravelAgent,
        companyName: user.companyName,
        website: user.website,
        role: user.role,
      },
      token,
    }
  }

  static async inviteAdmin(email: string) {
    const inviteToken = crypto.randomBytes(32).toString('hex')
    const inviteTokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      await prisma.user.update({ where: { email }, data: { role: 'admin', inviteToken, inviteTokenExpiry } })
    } else {
      await prisma.user.create({ data: { email, role: 'admin', emailVerified: false, inviteToken, inviteTokenExpiry } })
    }

    await EmailService.sendAdminInviteEmail(email, inviteToken)
    return { success: true, email }
  }

  static async acceptInvite(token: string, password: string, firstName: string, lastName: string) {
    const user = await prisma.user.findUnique({ where: { inviteToken: token } })
    if (!user) throw new Error('Invalid or expired invite link')
    if (!user.inviteTokenExpiry || user.inviteTokenExpiry < new Date()) {
      throw new Error('Invite link has expired. Please ask an admin to send a new invite.')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, firstName, lastName, emailVerified: true, inviteToken: null, inviteTokenExpiry: null },
    })

    const jwtToken = this.signToken({ userId: updated.id, email: updated.email, role: updated.role })
    return {
      user: { id: updated.id, email: updated.email, firstName: updated.firstName, lastName: updated.lastName, role: updated.role },
      token: jwtToken,
    }
  }

  static async getCurrentUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true,
        telephone: true, isTravelAgent: true, companyName: true, website: true, nationality: true, residency: true, createdAt: true,
      },
    })
  }

  static async updateProfile(userId: string, data: { firstName?: string; lastName?: string; telephone?: string; isTravelAgent?: boolean; companyName?: string; website?: string; nationality?: string; residency?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true,
        telephone: true, isTravelAgent: true, companyName: true, website: true, nationality: true, residency: true,
      },
    })
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.passwordHash) throw new Error('User not found')

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) throw new Error('Current password is incorrect')

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } })
  }

  static async listUsers(params: { page?: number; limit?: number; role?: string }) {
    const { page = 1, limit = 50, role } = params
    const skip = (page - 1) * limit
    const where = role ? { role } : {}
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true,
          role: true, emailVerified: true, telephone: true, isTravelAgent: true, companyName: true, website: true,
          nationality: true, createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])
    return { users, total, page, limit, pages: Math.ceil(total / limit) }
  }

  static async updateUserRole(userId: string, role: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    })
  }

  static verifyToken(token: string): AuthPayload {
    return jwt.verify(token, config.jwtSecret as string) as AuthPayload
  }

  private static signToken(payload: AuthPayload): string {
    return jwt.sign(payload, config.jwtSecret as string, { expiresIn: '7d' })
  }
}
