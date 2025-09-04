# Tech Context - Nhà hàng Big Boy

## Technology Stack

### Core Framework

- **Next.js 15.5.2**: React framework với App Router
- **React 19.1.0**: Latest React với concurrent features
- **TypeScript 5**: Type safety và developer experience
- **Node.js**: Runtime environment

### UI & Styling

- **TailwindCSS 4**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **next-themes**: Dark/light mode support

### State Management & Data Fetching

- **TanStack Query 5.85.5**: Server state management
- **React Hook Form 7.62.0**: Form handling
- **Zod 4.1.3**: Schema validation và TypeScript inference

### Authentication & Security

- **jsonwebtoken 9.0.2**: JWT token handling
- **HTTP-only cookies**: Secure token storage
- **Next.js Middleware**: Route protection

### Development Tools

- **ESLint 9**: Code linting với Next.js config
- **Prettier 3.6.2**: Code formatting
- **TypeScript ESLint 8**: TypeScript-specific linting
- **Turbopack**: Fast bundler cho development

## Development Setup

### Package Manager

- **npm**: Primary package manager
- **yarn.lock**: Alternative lockfile present

### Build & Development Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build --turbopack",
  "start": "next start",
  "lint": "eslint",
  "lint:fix": "eslint --fix",
  "prettier": "prettier --check .",
  "prettier:fix": "prettier --write ."
}
```

### Environment Configuration

- **NEXT_PUBLIC_API_ENDPOINT**: Backend API URL
- **NEXT_PUBLIC_URL**: Frontend application URL
- Configuration validation với Zod schemas

## Technical Constraints

### Framework Limitations

- **Next.js App Router**: Requires specific routing patterns
- **Server Components**: Limited client-side functionality
- **Hydration**: Potential SSR/client mismatches

### Dependencies

- **React 19**: Cutting-edge features, potential instability
- **TailwindCSS 4**: Latest version với breaking changes
- **Turbopack**: Experimental bundler

### Performance Considerations

- **Bundle Size**: Multiple UI libraries có thể tăng bundle size
- **Image Loading**: Dependency on ImageKit CDN
- **Server Rendering**: Potential performance overhead

## API Integration

### External Services

- **ImageKit**: CDN cho image optimization
  - URL pattern: `https://ik.imagekit.io/freeflo/production/`
  - Transform parameters: `?tr=w-2048,q-75`

### Backend Communication

- **REST API**: Primary communication protocol
- **JSON**: Data exchange format
- **Authorization Headers**: Bearer token authentication

## Build & Deployment

### Build Configuration

```typescript
// next.config.ts
{
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io'
      }
    ]
  }
}
```

### Asset Management

- **Static Assets**: Public folder cho images, icons
- **Font Optimization**: Geist font family
- **Service Worker**: Present cho PWA capabilities

## Code Quality

### Linting Configuration

- **ESLint**: Extended từ Next.js recommended
- **React Hooks**: Plugin cho hooks rules
- **TanStack Query**: Plugin cho query rules
- **TypeScript**: Strict type checking

### Code Formatting

- **Prettier**: Automatic code formatting
- **Import Organization**: Plugin cho import sorting
- **Consistent Style**: Enforced formatting rules

## Security Configuration

### Authentication Strategy

- **JWT Tokens**: Access và refresh tokens
- **HttpOnly Cookies**: Secure server-side storage
- **localStorage**: Client-side token access
- **Automatic Refresh**: Background token renewal

### Route Protection

- **Middleware**: Server-side route guards
- **Conditional Redirects**: Based on auth status
- **Protected Paths**: `/manage/*` routes secured

## Performance Optimizations

### Next.js Features

- **Image Optimization**: Automatic với next/image
- **Code Splitting**: Route-based splitting
- **Font Optimization**: Self-hosted fonts
- **Bundle Analysis**: Built-in analyzers

### Caching Strategy

- **Browser Caching**: Static assets caching
- **Query Caching**: TanStack Query cache
- **CDN Caching**: ImageKit CDN optimization

## Development Workflow

### Local Development

1. **Environment Setup**: Copy environment variables
2. **Dependencies**: `npm install` hoặc `yarn install`
3. **Development Server**: `npm run dev`
4. **Hot Reload**: Turbopack fast refresh

### Code Quality Checks

1. **Linting**: `npm run lint` trước commit
2. **Formatting**: `npm run prettier:fix`
3. **Type Checking**: TypeScript compilation
4. **Build Verification**: `npm run build`

## Known Technical Debt

### Current Issues

- **README**: Generic Next.js template, cần cập nhật
- **Environment Variables**: Chưa có .env.example
- **Testing**: Chưa có test setup
- **Documentation**: API documentation chưa complete

### Future Improvements

- **Error Boundary**: Global error handling
- **Monitoring**: Performance và error tracking
- **Testing Strategy**: Unit và integration tests
- **CI/CD Pipeline**: Automated deployment
