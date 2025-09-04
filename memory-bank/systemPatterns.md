# System Patterns - Nhà hàng Big Boy

## Kiến trúc tổng thể

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Public Web    │    │  Management     │    │   API Backend   │
│   (Customers)   │    │   Dashboard     │    │   (External)    │
│                 │    │   (Staff)       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Next.js App   │
                    │   (Frontend)    │
                    └─────────────────┘
```

### Routing Architecture

- **App Router**: Next.js 13+ App Directory pattern
- **Route Groups**: `(public)` và `manage` để phân tách logic
- **Middleware Protection**: Bảo vệ routes `/manage/*`
- **API Routes**: `/api/auth/*` cho authentication logic

## Authentication Pattern

### Flow Design

```
Login → Set Cookies → Store Tokens → Auto Refresh → Protected Access
  │         │            │              │              │
  ▼         ▼            ▼              ▼              ▼
Route    HttpOnly     localStorage   Background      Middleware
Handler   Cookies      (Client)      Service         Guard
```

### Implementation Details

1. **Login Process**:
   - POST `/api/auth/login` → Sets httpOnly cookies
   - Client stores tokens in localStorage via `http.ts`
   - Redirect to dashboard

2. **Request Authentication**:
   - `http.ts` reads accessToken from localStorage
   - Adds Authorization header to requests
   - Automatic error handling và retry logic

3. **Token Refresh**:
   - `RefreshToken` component runs interval checks
   - Calls `checkAndRefreshToken` function
   - Server route `/api/auth/refresh-token` updates cookies

4. **Route Protection**:
   - Middleware guards `/manage/*` routes
   - Redirects to `/login` hoặc `/refresh-token` khi cần

## Data Management Patterns

### State Management

- **TanStack Query**: Server state với caching và invalidation
- **React Context**: App-level state (auth status, theme)
- **Local State**: Component-specific với useState/useReducer

### API Layer Structure

```
Components → Queries → API Requests → HTTP Client → External API
     │          │           │            │              │
     ▼          ▼           ▼            ▼              ▼
React Hook   Custom      Thin Wrapper   Axios-like     REST API
  Form       Hooks       Functions      Client       (Backend)
```

### Data Flow Patterns

1. **Queries Layer** (`queries/*`): Custom hooks với TanStack Query
2. **API Requests** (`apiRequests/*`): Thin wrappers around `http.ts`
3. **HTTP Client** (`lib/http.ts`): Centralized request handling
4. **Schema Validation** (`schemaValidations/*`): Zod schemas và TypeScript types

### Proven CRUD Patterns

Established pattern từ Employee và Dishes modules:

```
Schema → API Request → Query Hooks → Components → UI
  │         │            │             │        │
  ▼         ▼            ▼             ▼        ▼
 Zod    HTTP Client   TanStack     React     shadcn/ui
Validation   +         Query     Hook Form   Components
          Error                      +
        Handling                 Validation
```

## Component Architecture

### Design System Hierarchy

```
App Layout
├── Theme Provider (Dark/Light mode)
├── Query Client Provider (TanStack Query)
├── App Provider (Global state)
└── Route-specific Layouts
    ├── Public Layout (Header + Navigation)
    └── Management Layout (Sidebar + Header)
```

### UI Component Strategy

- **shadcn/ui**: Base component library
- **Radix UI**: Headless component primitives
- **Custom Components**: Business logic wrappers
- **Compound Components**: Complex UI patterns

## File Organization Patterns

### Directory Structure Logic

```
src/
├── app/                 # Next.js App Router
│   ├── (public)/       # Public routes (customers)
│   ├── api/            # API route handlers
│   └── manage/         # Protected admin routes
├── components/         # Reusable UI components
├── lib/               # Utility functions
├── queries/           # TanStack Query hooks
├── apiRequests/       # API client functions
├── schemaValidations/ # Zod schemas
└── constants/         # Type definitions
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase với `use` prefix (`useAuth.tsx`)
- **Utils**: camelCase (`formatDate.ts`)
- **API**: camelCase objects (`authApiRequest.ts`)
- **Types**: PascalCase với suffix (`UserType`, `ApiResponse`)

## Error Handling Patterns

### Centralized Error Management

- **API Level**: `handleErrorApi` utility function
- **Component Level**: Error boundaries cho crash protection
- **User Feedback**: Toast notifications với sonner
- **Logging**: Console errors với structured data

### Validation Strategy

- **Client-side**: Zod schemas với React Hook Form
- **Server-side**: Validation tại API routes
- **Type Safety**: TypeScript cho compile-time checks

## Performance Patterns

### Next.js Optimizations

- **Image Optimization**: Next.js Image component với ImageKit CDN
- **Code Splitting**: Automatic với App Router
- **Bundle Optimization**: Turbopack cho faster builds
- **Font Optimization**: next/font với Geist font family

### Caching Strategy

- **Query Caching**: TanStack Query với intelligent cache
- **Image Caching**: Browser cache với CDN
- **Build Caching**: Next.js automatic optimizations

## Security Patterns

### Authentication Security

- **HttpOnly Cookies**: Secure token storage
- **CSRF Protection**: SameSite cookie attributes
- **Token Rotation**: Automatic refresh mechanism
- **Route Guards**: Middleware-based protection

### Data Validation

- **Input Sanitization**: Zod schema validation
- **Type Safety**: TypeScript compile-time checks
- **API Validation**: Server-side validation layers
