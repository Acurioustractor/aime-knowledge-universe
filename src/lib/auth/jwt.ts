import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
  iat?: number;
  exp?: number;
}

export interface AuthContext {
  user: JWTPayload;
  isAuthenticated: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class JWTService {
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'aime-wiki'
    });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  static extractTokenFromRequest(request: NextRequest): string | null {
    // Check Authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check cookies
    const tokenCookie = request.cookies.get('auth-token');
    if (tokenCookie) {
      return tokenCookie.value;
    }

    // Check query parameter (less secure, only for specific endpoints)
    const url = new URL(request.url);
    const tokenParam = url.searchParams.get('token');
    if (tokenParam) {
      return tokenParam;
    }

    return null;
  }

  static authenticateRequest(request: NextRequest): AuthContext {
    const token = this.extractTokenFromRequest(request);
    
    if (!token) {
      return {
        user: null as any,
        isAuthenticated: false
      };
    }

    const payload = this.verifyToken(token);
    
    if (!payload) {
      return {
        user: null as any,
        isAuthenticated: false
      };
    }

    return {
      user: payload,
      isAuthenticated: true
    };
  }

  static hasPermission(user: JWTPayload, permission: string): boolean {
    if (user.role === 'admin') {
      return true; // Admins have all permissions
    }
    
    return user.permissions.includes(permission);
  }

  static hasRole(user: JWTPayload, role: string): boolean {
    return user.role === role;
  }
}

// Permission constants
export const PERMISSIONS = {
  // YouTube permissions
  YOUTUBE_READ: 'youtube:read',
  YOUTUBE_SYNC: 'youtube:sync',
  YOUTUBE_ADMIN: 'youtube:admin',
  
  // Content permissions
  CONTENT_READ: 'content:read',
  CONTENT_WRITE: 'content:write',
  CONTENT_DELETE: 'content:delete',
  
  // Airtable permissions
  AIRTABLE_READ: 'airtable:read',
  AIRTABLE_WRITE: 'airtable:write',
  AIRTABLE_SYNC: 'airtable:sync',
  
  // System permissions
  SYSTEM_ADMIN: 'system:admin',
  SYSTEM_MONITOR: 'system:monitor',
  
  // API permissions
  API_ACCESS: 'api:access',
  API_ADMIN: 'api:admin'
} as const;

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user', 
  VIEWER: 'viewer'
} as const;

export const DEFAULT_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.USER]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_WRITE,
    PERMISSIONS.YOUTUBE_READ,
    PERMISSIONS.AIRTABLE_READ,
    PERMISSIONS.API_ACCESS
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.YOUTUBE_READ,
    PERMISSIONS.API_ACCESS
  ]
};