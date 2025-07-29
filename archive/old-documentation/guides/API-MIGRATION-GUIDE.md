# API Migration Guide: Standardizing AIME Wiki APIs

## ✅ **Completed Migrations**

The following critical API routes have been successfully updated to use the new standardized patterns:

1. **`/api/content`** - Content aggregation with pagination and search
2. **`/api/tools`** - Airtable Digital Assets with filtering
3. **`/api/search`** - Unified search with validation
4. **`/api/airtable`** - Generic Airtable data fetching

## 🔄 **Migration Pattern Template**

Follow this template for updating remaining API routes:

### **1. Import New Utilities**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { 
  createSuccessResponse,
  createPaginatedResponse,
  createErrorResponse 
} from '@/lib/api-response';
import { 
  withErrorHandler,
  validatePaginationParams,
  ValidationError,
  ConfigurationError,
  ExternalAPIError
} from '@/lib/api-error-handler';
import { 
  withSecurity, 
  rateLimits 
} from '@/lib/api-security';
import { isServiceAvailable } from '@/lib/environment';
```

### **2. Define Parameter Interface**

```typescript
interface YourAPIQueryParams {
  param1?: string;
  param2?: string;
  limit: string;
  offset: string;
}
```

### **3. Create Handler Function**

```typescript
/**
 * GET /api/your-endpoint
 * 
 * Description of what this endpoint does
 * 
 * Query Parameters:
 * - param1: Description (optional/required)
 * - param2: Description (optional/required)
 * - limit: Number of items per page (1-100, default: 50)
 * - offset: Number of items to skip (default: 0)
 */
async function handleGet(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  
  // Extract and validate parameters
  const params: YourAPIQueryParams = {
    param1: searchParams.get('param1') || undefined,
    param2: searchParams.get('param2') || undefined,
    limit: searchParams.get('limit') || '50',
    offset: searchParams.get('offset') || '0'
  };
  
  // Validate pagination
  const { limit, offset } = validatePaginationParams(params.limit, params.offset);
  
  // Validate required parameters
  if (!params.param1) {
    throw new ValidationError('param1 is required');
  }
  
  // Check service availability if needed
  if (!isServiceAvailable.serviceName()) {
    throw new ConfigurationError('Service not configured');
  }
  
  try {
    // Your existing logic here...
    const results = await fetchData(params);
    
    // Return standardized response
    return NextResponse.json(
      createPaginatedResponse(
        results.slice(offset, offset + limit),
        results.length,
        offset,
        limit,
        {
          endpoint: '/api/your-endpoint',
          processing_time: Date.now() - startTime,
          // Add any endpoint-specific metadata
        }
      )
    );
    
  } catch (error) {
    // Let the error handler deal with it
    throw error;
  }
}
```

### **4. Apply Security & Error Handling**

```typescript
// Apply security middleware and error handling
export const GET = withSecurity(
  withErrorHandler(handleGet, '/api/your-endpoint'),
  {
    rateLimit: rateLimits.public, // or rateLimits.admin, rateLimits.search, etc.
    endpoint: '/api/your-endpoint'
  }
);
```

## 📋 **Remaining Routes to Migrate**

### **High Priority (Complete these next):**

1. **`/api/youtube/integration/route.ts`**
   - Complex route with multiple actions
   - Use `rateLimits.admin` for security
   - Add proper validation for action parameter

2. **`/api/hoodies/route.ts`**
   - Fetches Hoodie data from Airtable
   - Already partially standardized
   - Add pagination and filtering

3. **`/api/featured/route.ts`**
   - Content aggregation endpoint
   - Add proper error handling
   - Standardize response format

### **Medium Priority:**

4. **`/api/knowledge/route.ts`**
   - GitHub repository integration
   - Add proper error handling for GitHub API

5. **`/api/mailchimp/route.ts`**
   - Mailchimp campaigns integration
   - Add rate limiting and validation

6. **`/api/youtube/route.ts`**
   - Basic YouTube videos endpoint
   - Standardize response format

### **Lower Priority:**

7. **`/api/content/real/route.ts`**
   - Large endpoint with multiple integrations
   - Break into smaller functions
   - Add comprehensive error handling

8. **`/api/aggregation/route.ts`**
   - Pipeline management
   - Use `rateLimits.admin`
   - Add status monitoring

## 🔧 **Service-Specific Migration Notes**

### **YouTube API Routes**
- Use `ExternalAPIError` for quota exceeded errors
- Implement proper key rotation patterns
- Add processing time tracking

### **Airtable Routes**
- Handle pagination properly (Airtable uses offset differently)
- Add rate limiting delays (200ms between requests)
- Use `ExternalAPIError` for API failures

### **GitHub Routes**
- Handle authentication errors gracefully
- Add proper repository validation
- Cache responses when possible

### **Processing/Pipeline Routes**
- Use `rateLimits.admin` or `rateLimits.sync`
- Add progress tracking in metadata
- Implement proper timeout handling

## 📝 **Migration Checklist**

For each route you migrate, ensure:

- [ ] Imports updated to use new utilities
- [ ] Parameter validation implemented
- [ ] Pagination properly handled
- [ ] Error handling uses new patterns
- [ ] Response format standardized
- [ ] Rate limiting applied appropriately
- [ ] Processing time tracked
- [ ] Service availability checked
- [ ] Documentation updated

## 🚨 **Common Migration Pitfalls**

1. **Don't forget to remove old error handling**
   - Replace try/catch blocks that return errors directly
   - Let `withErrorHandler` manage error responses

2. **Validate all user inputs**
   - Use `ValidationError` for bad parameters
   - Check required fields early

3. **Choose appropriate rate limits**
   - `public`: General content endpoints
   - `search`: Search and query endpoints  
   - `admin`: Management and sync endpoints
   - `sync`: Heavy processing endpoints

4. **Handle external API errors properly**
   - Use `ExternalAPIError` for third-party failures
   - Don't expose sensitive error details

## 🔄 **Quick Migration Commands**

```bash
# Test your migrated endpoint
curl "http://localhost:3000/api/your-endpoint?limit=10&offset=0"

# Check health after migration
curl "http://localhost:3000/api/health?detailed=true&metrics=true"

# Test error handling
curl "http://localhost:3000/api/your-endpoint?invalid=param"
```

## 📊 **Expected Benefits After Full Migration**

- **Consistent API behavior** across all endpoints
- **Better error messages** for debugging
- **Automatic rate limiting** protection
- **Performance monitoring** built-in
- **Easier maintenance** and debugging
- **Production-ready** security headers
- **Standardized pagination** everywhere

---

**Next Steps:** Choose one of the high-priority routes and apply this migration pattern. Each route should take 10-20 minutes to migrate following this guide. 