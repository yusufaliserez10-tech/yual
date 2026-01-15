/**
 * Authentication & Authorization System
 * Enterprise-grade security with role-based access control
 */

import React from 'react'
import { User, AuthSession } from '@/types'

// Super Admin credentials (in production, use secure auth system)
const SUPER_ADMIN = {
  email: 'superadmin@yual.com',
  password: 'yual2024!',
  role: 'super_admin' as const
}

// Session management
export class AuthService {
  private static instance: AuthService
  private currentSession: AuthSession | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<AuthSession> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (email === SUPER_ADMIN.email && password === SUPER_ADMIN.password) {
      const user: User = {
        id: 'super-admin-1',
        email: SUPER_ADMIN.email,
        name: 'Super Admin',
        role: SUPER_ADMIN.role,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const session: AuthSession = {
        user,
        token: this.generateToken(user),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }

      this.currentSession = session
      this.saveSession(session)

      return session
    }

    throw new Error('Invalid credentials')
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.currentSession = null
    localStorage.removeItem('yual_session')
    localStorage.removeItem('yual_token')
  }

  /**
   * Get current session
   */
  getSession(): AuthSession | null {
    if (this.currentSession) {
      return this.currentSession
    }

    const savedSession = localStorage.getItem('yual_session')
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession) as AuthSession
        if (new Date(session.expiresAt) > new Date()) {
          this.currentSession = session
          return session
        } else {
          localStorage.removeItem('yual_session')
          localStorage.removeItem('yual_token')
        }
      } catch (error) {
        localStorage.removeItem('yual_session')
        localStorage.removeItem('yual_token')
      }
    }

    return null
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: User['role']): boolean {
    const session = this.getSession()
    return session?.user.role === role
  }

  /**
   * Check if user is super admin
   */
  isSuperAdmin(): boolean {
    return this.hasRole('super_admin')
  }

  /**
   * Check if user can access admin features
   */
  canAccessAdmin(): boolean {
    const session = this.getSession()
    return session?.user.role === 'super_admin' || session?.user.role === 'admin'
  }

  /**
   * Generate JWT-like token (simplified for demo)
   */
  private generateToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }))
    const signature = btoa('yual-signature') // In production, use proper HMAC

    return `${header}.${payload}.${signature}`
  }

  /**
   * Save session to localStorage
   */
  private saveSession(session: AuthSession): void {
    localStorage.setItem('yual_session', JSON.stringify(session))
    localStorage.setItem('yual_token', session.token)
  }

  /**
   * Validate token
   */
  validateToken(token: string): boolean {
    try {
      const [, payload] = token.split('.')
      const decoded = JSON.parse(atob(payload))
      return decoded.exp > Math.floor(Date.now() / 1000)
    } catch {
      return false
    }
  }
}

// React Hook for authentication
export function useAuth() {
  const authService = AuthService.getInstance()

  return {
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    getSession: authService.getSession.bind(authService),
    isAuthenticated: authService.isAuthenticated.bind(authService),
    isSuperAdmin: authService.isSuperAdmin.bind(authService),
    canAccessAdmin: authService.canAccessAdmin.bind(authService),
    hasRole: authService.hasRole.bind(authService)
  }
}

// Higher-order component for route protection
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  requiredRole?: User['role']
) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, hasRole } = useAuth()

    if (!isAuthenticated()) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login'
      }
      return null
    }

    if (requiredRole && !hasRole(requiredRole)) {
      // Redirect to unauthorized page
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/unauthorized'
      }
      return null
    }

    return <Component {...props} />
  }
}

export default AuthService
