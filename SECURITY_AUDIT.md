# Security Audit Report - Promptr

**Audit Date:** 2026-01-06
**Application:** Promptr (AI Prompt Management Platform)
**Auditor:** Claude Code
**Branch:** `claude/code-audit-u62rk`

---

## Executive Summary

This security audit reviewed the Promptr codebase, a Next.js full-stack application for AI prompt management. The application demonstrates solid security fundamentals with proper authentication, input validation, and user isolation. However, several areas require attention to harden the application against potential attacks.

**Overall Risk Level:** Medium

| Category | Status |
|----------|--------|
| Authentication | Good |
| Authorization | Good |
| Input Validation | Good |
| Injection Prevention | Good |
| XSS Prevention | Good |
| Rate Limiting | Needs Improvement |
| Security Headers | Needs Improvement |
| Error Handling | Good |

---

## Findings

### Critical Issues

No critical issues identified.

### High Priority Issues

#### 1. Race Condition in Beta Code Redemption
**File:** `app/api/beta/validate/route.ts:36-74`
**Severity:** High
**Description:** The beta code redemption process has a TOCTOU (Time-of-check to Time-of-use) race condition. Between checking if a code is used (line 51) and updating it as used (line 67-74), multiple concurrent requests could redeem the same code.

**Current Code:**
```typescript
// Check if already used (line 51)
if (betaCode.is_used) { ... }

// Later: Redeem the code (line 67-74)
const { error: updateError } = await supabase
  .from("beta_codes")
  .update({ is_used: true, used_by: userId, used_at: new Date().toISOString() })
  .eq("id", betaCode.id);
```

**Recommendation:** Use an atomic database operation with a conditional update:
```typescript
const { data, error } = await supabase
  .from("beta_codes")
  .update({ is_used: true, used_by: userId, used_at: new Date().toISOString() })
  .eq("code", normalizedCode)
  .eq("is_used", false)
  .gt("expires_at", new Date().toISOString())
  .select()
  .single();
```

#### 2. No Rate Limiting on API Routes
**Files:** All API routes under `app/api/`
**Severity:** High
**Description:** No rate limiting is implemented on any API endpoints. This exposes the application to:
- Brute force attacks on beta codes
- API abuse and resource exhaustion
- Potential DoS conditions
- Increased OpenAI API costs from malicious requests

**Recommendation:** Implement rate limiting using Vercel's built-in rate limiting, Upstash Redis, or middleware-based solutions:
```typescript
// Example using a simple in-memory rate limiter
import rateLimit from 'express-rate-limit';

// Or use Vercel Edge Config / Upstash for production
```

---

### Medium Priority Issues

#### 3. Missing Content-Security-Policy Header
**File:** `next.config.ts`
**Severity:** Medium
**Description:** While security headers are configured, Content-Security-Policy (CSP) is missing. CSP is a critical defense-in-depth mechanism against XSS attacks.

**Current Headers:**
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- X-XSS-Protection: 1; mode=block
- Permissions-Policy: camera=(), microphone=(), geolocation=()

**Recommendation:** Add a Content-Security-Policy header:
```typescript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.openai.com https://clerk.com"
}
```

#### 4. Beta Code Brute Force Vulnerability
**File:** `scripts/generate-beta-codes.ts`
**Severity:** Medium
**Description:** Beta codes use a limited character set (24 chars) with format `BETA-XXXX-XXXX`. This provides ~24^8 = 110 billion combinations, but without rate limiting, automated attacks could attempt to guess valid codes.

**Recommendation:**
1. Implement rate limiting on `/api/beta/validate`
2. Add account lockout after N failed attempts
3. Consider using longer codes or UUIDs
4. Log and alert on suspicious validation attempts

#### 5. Service Role Key Bypass of RLS
**Files:** `app/api/beta/validate/route.ts`, `app/api/beta/status/route.ts`
**Severity:** Medium
**Description:** Beta-related endpoints use `getSupabaseServiceClient()` which bypasses Row Level Security. While this is necessary for the beta system, it requires careful handling.

**Current Status:** Properly used for administrative operations on `beta_codes` table.

**Recommendation:**
- Ensure service role key is never exposed to client
- Regularly audit endpoints using service role
- Consider implementing a dedicated admin API with additional authentication

---

### Low Priority Issues

#### 6. Code Duplication in Error Handling
**Files:** Multiple API routes
**Severity:** Low
**Description:** The `isClerkTokenTemplateNotFound()` function is duplicated across multiple files:
- `app/api/prompts/route.ts`
- `app/api/categories/route.ts`

**Recommendation:** Extract to a shared utility:
```typescript
// lib/clerk-utils.ts
export function isClerkTokenTemplateNotFound(err: unknown): boolean { ... }
```

#### 7. Unused Error Class
**File:** `lib/errors.ts`
**Severity:** Low
**Description:** `UpstreamServiceError` class is defined but not used anywhere in the codebase.

**Recommendation:** Remove unused code or implement where appropriate for better error categorization.

#### 8. Deprecated Security Header
**File:** `next.config.ts`
**Severity:** Low
**Description:** `X-XSS-Protection` header is deprecated and removed from modern browsers. Modern CSP provides better protection.

**Recommendation:** Remove `X-XSS-Protection` and rely on CSP instead.

---

## Security Strengths

### 1. Robust Authentication
- Clerk authentication properly implemented via middleware
- All protected routes require authentication
- JWT token verification for Supabase integration

### 2. Proper Authorization
- User isolation via Supabase Row Level Security (RLS)
- All queries filter by `user_id` for data isolation
- Beta access gate for controlled rollout

### 3. Strong Input Validation
- Centralized validation in `lib/validations.ts`
- UUID format validation for resource IDs
- Length limits enforced (name: 100 chars, content: 10,000 chars)
- Control character sanitization

### 4. XSS Prevention
- No use of `dangerouslySetInnerHTML`
- React's default escaping for all rendered content
- Input sanitization removes control characters

### 5. SQL Injection Prevention
- Supabase client uses parameterized queries
- No raw SQL construction from user input

### 6. Secure Environment Variable Handling
- `.env*` files properly gitignored
- Environment validation with `requireEnv()`
- Clear error messages for missing configuration

### 7. Error Handling
- Errors logged server-side, generic messages to client
- No stack traces or internal details exposed
- Graceful degradation for external services (OpenAI)

---

## Files Reviewed

| File | Purpose | Status |
|------|---------|--------|
| `app/api/prompts/route.ts` | Prompt CRUD | Reviewed |
| `app/api/prompts/search/route.ts` | Semantic search | Reviewed |
| `app/api/prompts/backfill/route.ts` | Embedding backfill | Reviewed |
| `app/api/categories/route.ts` | Category CRUD | Reviewed |
| `app/api/beta/validate/route.ts` | Beta code redemption | Reviewed |
| `app/api/beta/status/route.ts` | Beta access check | Reviewed |
| `middleware.ts` | Route protection | Reviewed |
| `lib/auth.ts` | Token utilities | Reviewed |
| `lib/supabase.ts` | Database clients | Reviewed |
| `lib/validations.ts` | Input validation | Reviewed |
| `lib/errors.ts` | Error utilities | Reviewed |
| `lib/ai.ts` | OpenAI integration | Reviewed |
| `lib/embeddings.ts` | Vector embeddings | Reviewed |
| `next.config.ts` | Security headers | Reviewed |
| `components/BetaGuard.tsx` | Access control | Reviewed |
| `components/PromptCard.tsx` | UI rendering | Reviewed |
| `components/PromptForm.tsx` | Input handling | Reviewed |
| `components/PromptDetailModal.tsx` | Edit handling | Reviewed |
| `app/beta-access/page.tsx` | Beta entry page | Reviewed |
| `scripts/generate-beta-codes.ts` | Code generation | Reviewed |
| `scripts/backfill-embeddings.ts` | Data migration | Reviewed |

---

## Recommendations Summary

### Immediate Actions (High Priority)
1. Fix race condition in beta code redemption with atomic update
2. Implement rate limiting on all API endpoints

### Short-term Actions (Medium Priority)
3. Add Content-Security-Policy header
4. Add brute force protection for beta codes
5. Document service role key usage

### Long-term Actions (Low Priority)
6. Refactor duplicated error handling code
7. Remove unused error classes
8. Remove deprecated X-XSS-Protection header

---

## Compliance Notes

- **GDPR:** User data is isolated per user. Consider adding data export/deletion functionality.
- **OWASP Top 10:** No critical vulnerabilities found. Rate limiting addresses A05:2021 (Security Misconfiguration).
- **Dependencies:** Using latest versions of major packages. Regular dependency audits recommended.

---

## Conclusion

The Promptr application demonstrates good security practices with proper authentication, authorization, and input validation. The primary concerns are the lack of rate limiting and a race condition in the beta code system. Addressing the high-priority issues will significantly improve the application's security posture.

**Next Steps:**
1. Prioritize fixing the race condition in beta code redemption
2. Implement rate limiting before scaling user base
3. Add CSP header for defense-in-depth
4. Schedule regular security reviews as the application evolves

---

*Report generated by Claude Code security audit*
