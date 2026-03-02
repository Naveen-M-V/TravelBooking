import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { config } from '../config/env'

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
    telephone?: string
  ) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error('Email is already registered')

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, role, telephone },
    })

    const token = this.signToken({ userId: user.id, email: user.email, role: user.role })
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      token,
    }
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) throw new Error('Invalid email or password')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new Error('Invalid email or password')

    const token = this.signToken({ userId: user.id, email: user.email, role: user.role })
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      token,
    }
  }

  static async getCurrentUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        telephone: true,
        nationality: true,
        residency: true,
        createdAt: true,
      },
    })
  }

  static async updateProfile(userId: string, data: { firstName?: string; lastName?: string; telephone?: string; nationality?: string; residency?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        telephone: true,
        nationality: true,
        residency: true,
      },
    })
    return user
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.passwordHash) throw new Error('User not found')

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) throw new Error('Current password is incorrect')

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } })
  }

  static verifyToken(token: string): AuthPayload {
    return jwt.verify(token, config.jwtSecret as string) as AuthPayload
  }

  private static signToken(payload: AuthPayload): string {
    return jwt.sign(payload, config.jwtSecret as string, { expiresIn: '7d' })
  }
}
