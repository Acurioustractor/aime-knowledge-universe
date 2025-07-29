import { NextRequest, NextResponse } from 'next/server';
import { JWTService, PERMISSIONS, JWTPayload } from './jwt';
import { createValidationError } from '../validation/middleware';

export interface AuthOptions {
  required?: boolean;
  permissions?: string[];
  roles?: string[];
}

export function withAuth(
  request: NextRequest,
  options: AuthOptions = { required: true }
): {
  user?: JWTPayload;
  isAuthenticated: boolean;
  error?: NextResponse;
} {
  const authContext = JWTService.authenticateRequest(request);
  
  // If authentication is required but user is not authenticated
  if (options.required && !authContext.isAuthenticated) {
    return {
      isAuthenticated: false,
      error: NextResponse.json({
        success: false,
        error: 'Authentication required',
        timestamp: new Date().toISOString()
      }, { status: 401 })
    };
  }

  // If authenticated, check permissions
  if (authContext.isAuthenticated && authContext.user) {
    // Check required permissions
    if (options.permissions) {
      const hasPermission = options.permissions.every(permission =>
        JWTService.hasPermission(authContext.user, permission)
      );
      
      if (!hasPermission) {
        return {
          user: authContext.user,
          isAuthenticated: true,
          error: NextResponse.json({
            success: false,
            error: 'Insufficient permissions',
            required: options.permissions,
            timestamp: new Date().toISOString()
          }, { status: 403 })
        };
      }
    }

    // Check required roles
    if (options.roles) {
      const hasRole = options.roles.includes(authContext.user.role);
      
      if (!hasRole) {
        return {
          user: authContext.user,
          isAuthenticated: true,
          error: NextResponse.json({
            success: false,
            error: 'Insufficient role',
            required: options.roles,
            current: authContext.user.role,
            timestamp: new Date().toISOString()
          }, { status: 403 })
        };
      }
    }
  }

  return {
    user: authContext.user,
    isAuthenticated: authContext.isAuthenticated
  };
}

// Convenience function for checking API key fallback
export function withApiKeyFallback(request: NextRequest): {
  isAuthorized: boolean;
  authMethod: 'jwt' | 'api-key' | 'none';
  user?: JWTPayload;
  error?: NextResponse;
} {
  // First try JWT authentication
  const jwtAuth = withAuth(request, { required: false });
  
  if (jwtAuth.isAuthenticated) {
    return {
      isAuthorized: true,
      authMethod: 'jwt',
      user: jwtAuth.user
    };
  }

  // Fallback to API key for backwards compatibility
  const apiKey = request.headers.get('X-API-Key') || 
                 request.headers.get('api-key') ||
                 new URL(request.url).searchParams.get('api_key');

  const validApiKey = process.env.API_KEY || process.env.ADMIN_API_KEY;
  
  if (apiKey && validApiKey && apiKey === validApiKey) {
    return {
      isAuthorized: true,
      authMethod: 'api-key'
    };
  }

  return {
    isAuthorized: false,
    authMethod: 'none',
    error: NextResponse.json({
      success: false,
      error: 'Authentication required. Provide either a valid JWT token or API key.',
      timestamp: new Date().toISOString()
    }, { status: 401 })
  };
}

// Specific permission checks for common operations
export const authChecks = {
  youtubeRead: (request: NextRequest) => 
    withAuth(request, { permissions: [PERMISSIONS.YOUTUBE_READ] }),
    
  youtubeSync: (request: NextRequest) => 
    withAuth(request, { permissions: [PERMISSIONS.YOUTUBE_SYNC] }),
    
  youtubeAdmin: (request: NextRequest) => 
    withAuth(request, { permissions: [PERMISSIONS.YOUTUBE_ADMIN] }),
    
  contentRead: (request: NextRequest) => 
    withAuth(request, { permissions: [PERMISSIONS.CONTENT_READ] }),
    
  contentWrite: (request: NextRequest) => 
    withAuth(request, { permissions: [PERMISSIONS.CONTENT_WRITE] }),
    
  airtableRead: (request: NextRequest) => 
    withAuth(request, { permissions: [PERMISSIONS.AIRTABLE_READ] }),
    
  airtableSync: (request: NextRequest) => 
    withAuth(request, { permissions: [PERMISSIONS.AIRTABLE_SYNC] }),
    
  systemAdmin: (request: NextRequest) => 
    withAuth(request, { permissions: [PERMISSIONS.SYSTEM_ADMIN] }),
    
  adminOnly: (request: NextRequest) => 
    withAuth(request, { roles: ['admin'] })
};