# Sentry Installation Guide

## Installation

Sentry is already installed and configured in this project. The installation uses `@sentry/nextjs@10.26.0` which is compatible with Next.js 16.0.3.

### Current Setup

The project uses **npm overrides** to handle the peer dependency specification:

```json
{
  "overrides": {
    "@sentry/nextjs": {
      "next": "$next"
    }
  }
}
```

This allows `@sentry/nextjs@10.26.0` to work with Next.js 16.0.3 without requiring `--legacy-peer-deps`.

### Installing Dependencies

Simply run:

```bash
cd frontend
npm install
```

The `postinstall` script will automatically apply any patches (e.g., the `util._extend` deprecation fix).

### Why npm overrides?

The `@sentry/nextjs` package specifies peer dependencies for Next.js versions that may not include Next.js 16 in older versions. However, `@sentry/nextjs@10.26.0` is fully compatible with Next.js 16. The override ensures npm uses the installed Next.js version for Sentry's peer dependency check.

This approach is:
1. ✅ Cleaner than `--legacy-peer-deps` (only affects specific package)
2. ✅ More maintainable (explicit in package.json)
3. ✅ Works with all npm versions
4. ✅ Safe (no runtime incompatibilities)

## Configuration

### Environment Variables

Configure Sentry in your `.env.local` file:

```bash
# Sentry DSN (from TASK-017)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Sentry Environment
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development  # or staging, production

# Optional: Sentry Release (Git commit SHA)
NEXT_PUBLIC_SENTRY_RELEASE=git-commit-sha
```

### Configuration Files

The Sentry setup includes:

- **`sentry.client.config.ts`** - Client-side configuration (browser)
- **`sentry.server.config.ts`** - Server-side configuration (Node.js)
- **`sentry.edge.config.ts`** - Edge runtime configuration (middleware)
- **`instrumentation.ts`** - Loads appropriate config based on runtime

### Features Configured

- ✅ Error tracking with filtering and sanitization
- ✅ Performance monitoring (10% sample rate in production)
- ✅ User context tracking (privacy-first, no email)
- ✅ Error boundaries for React components
- ✅ Source map upload (via webpack plugin)
- ✅ Tunnel route to bypass ad blockers

## Verification

After installation, verify that Sentry is working:

1. Check that `node_modules/@sentry/nextjs` exists
2. Configure environment variables in `.env.local`
3. Start the dev server: `npm run dev`
4. Check the console for any Sentry initialization errors
5. Visit `/sentry-example-page` to test error tracking
6. Verify errors appear in Sentry dashboard

## Troubleshooting

### Build Errors

If you encounter TypeScript errors:
- Ensure you're using `@sentry/nextjs@10.26.0` or later
- Check that npm overrides are configured in `package.json`
- Run `npm install` to ensure dependencies are up to date

### util._extend Deprecation Warning

This warning is fixed using `patch-package`. The patch is automatically applied via the `postinstall` script. If you see the warning:
1. Ensure `patch-package` is installed
2. Check that `patches/next+16.0.3.patch` exists
3. Run `npm install` to reapply the patch

### Errors Not Appearing in Sentry

1. Check that `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Verify the DSN is valid in Sentry dashboard
3. Check browser console for Sentry initialization errors
4. Ensure ad blockers aren't blocking Sentry requests (tunnel route helps)

