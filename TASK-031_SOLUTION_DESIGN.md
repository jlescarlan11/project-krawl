# TASK-031 Solution Design: Set up Next.js 16.0.3 project with TypeScript

## Executive Summary

**Task ID:** TASK-031  
**Task Name:** Set up Next.js 16.0.3 project with TypeScript  
**Priority:** Critical  
**Epic:** epic:design-system  
**Phase:** Phase 1: Foundation  
**Week:** Week 2  
**Estimated Effort:** 0.5 days  
**Solution Design Date:** 2025-11-21  
**Architect:** Senior Software Architect  
**Status:** ✅ **READY FOR IMPLEMENTATION**

---

## 1. Architecture & Design

### 1.1 High-Level Approach

**Design Philosophy:**
- **Completeness:** Complete all missing configuration pieces to meet acceptance criteria
- **Consistency:** Follow existing project patterns and conventions
- **Developer Experience:** Ensure smooth development workflow with proper tooling
- **Maintainability:** Create clear structure that scales with project growth
- **Standards Compliance:** Follow Next.js and TypeScript best practices

**Current State Analysis:**
- ✅ Next.js 16.0.3 installed and functional
- ✅ TypeScript configured with strict mode
- ✅ Path aliases (`@/*`) working correctly
- ✅ ESLint configured
- ✅ Project builds successfully
- ❌ Prettier not configured (critical gap)
- ⚠️ `/hooks` directory missing (optional - hooks in `/lib`)
- ⚠️ `/types` directory missing (optional - types co-located)

**Solution Strategy:**
1. **Complete Prettier Configuration** - Install and configure Prettier for code formatting
2. **Create Optional Directories** - Add `/hooks` and `/types` directories for better organization
3. **Verify Hot Reload** - Test and document hot reload functionality
4. **Update Documentation** - Document project structure and development workflow
5. **Final Verification** - Ensure all acceptance criteria are met

### 1.2 Design Patterns

#### Code Formatting Pattern
- **Prettier:** Standard code formatter for consistent style
- **Integration:** Works seamlessly with ESLint (no conflicts)
- **Automation:** Format on save (IDE) and pre-commit (optional)
- **Configuration:** Shared config file (`.prettierrc.json`)

#### Directory Structure Pattern
- **Separation of Concerns:** Clear separation between hooks, types, components, and utilities
- **Barrel Exports:** Use `index.ts` files for clean imports
- **Co-location:** Allow component-specific types/hooks to live with components
- **Shared Resources:** Use dedicated directories for shared hooks/types

#### Development Workflow Pattern
- **Format Before Commit:** Run Prettier before committing code
- **Lint Before Build:** Run ESLint as part of build process
- **Type Check:** TypeScript strict mode catches errors early
- **Hot Reload:** Fast feedback during development

---

## 2. Implementation Plan

### 2.1 Phase 1: Prettier Configuration (30 minutes)

#### Step 1.1: Install Prettier
**Command:**
```bash
cd frontend
npm install -D prettier
```

**Dependencies to Add:**
- `prettier` (latest stable version, ~3.x)

#### Step 1.2: Create Prettier Configuration
**File:** `frontend/.prettierrc.json`

**Purpose:** Define Prettier formatting rules

**Content:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "quoteProps": "as-needed"
}
```

**Rationale:**
- `semi: true` - Matches existing codebase style
- `singleQuote: false` - Matches existing codebase (double quotes)
- `printWidth: 80` - Standard line length for readability
- `tabWidth: 2` - Matches existing indentation
- `arrowParens: "always"` - Consistent arrow function formatting
- `endOfLine: "lf"` - Cross-platform compatibility (Unix-style)

#### Step 1.3: Create Prettier Ignore File
**File:** `frontend/.prettierignore`

**Purpose:** Exclude files/directories from Prettier formatting

**Content:**
```
# Dependencies
node_modules
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build outputs
.next
out
build
dist
.vercel

# Generated files
next-env.d.ts
tsconfig.tsbuildinfo
*.min.js
*.min.css

# Logs
*.log
npm-debug.log*

# Environment files
.env
.env.local
.env.*.local

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

#### Step 1.4: Add Prettier Scripts to package.json
**File:** `frontend/package.json`

**Changes:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

**Scripts Added:**
- `format` - Format all files in the project
- `format:check` - Check if files are formatted (CI/CD)

#### Step 1.5: Update .gitignore (if needed)
**File:** `frontend/.gitignore`

**Check if exists:** Verify `.gitignore` includes Prettier cache (usually not needed, but verify)

**Note:** Prettier doesn't create cache files by default, but ensure build outputs are ignored.

### 2.2 Phase 2: Create Optional Directories (15 minutes)

#### Step 2.1: Create Hooks Directory
**Directory:** `frontend/hooks/`

**Purpose:** Store custom React hooks

**Files to Create:**

1. **`frontend/hooks/index.ts`** - Barrel export file
```typescript
/**
 * Custom React Hooks
 * 
 * This directory contains reusable React hooks for the Krawl application.
 * 
 * @example
 * ```tsx
 * import { useBreakpoint } from '@/hooks'
 * ```
 */

// Re-export hooks from lib/breakpoints.ts for convenience
// (keeping existing hooks accessible from both locations)
export {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
} from '@/lib/breakpoints';

// Future hooks can be added here:
// export { useAuth } from './useAuth';
// export { useToast } from './useToast';
```

**Rationale:**
- Provides dedicated location for hooks as per task requirements
- Maintains backward compatibility by re-exporting existing hooks
- Allows gradual migration of hooks from `/lib` to `/hooks`

#### Step 2.2: Create Types Directory
**Directory:** `frontend/types/`

**Purpose:** Store shared TypeScript type definitions

**Files to Create:**

1. **`frontend/types/index.ts`** - Barrel export file
```typescript
/**
 * Shared TypeScript Types
 * 
 * This directory contains shared TypeScript type definitions for the Krawl application.
 * Component-specific types should remain co-located with their components.
 * 
 * @example
 * ```tsx
 * import type { ApiResponse, User } from '@/types'
 * ```
 */

// Re-export types from components for convenience
export type {
  StepId,
  IllustrationId,
} from '@/components/onboarding/types';

// Future shared types can be added here:
// export type { User } from './user';
// export type { Gem } from './gem';
// export type { Krawl } from './krawl';
// export type { ApiResponse<T> } from './api';
```

**Rationale:**
- Provides dedicated location for shared types as per task requirements
- Maintains flexibility for component-specific types to remain co-located
- Allows gradual migration of shared types

### 2.3 Phase 3: Update Documentation (20 minutes)

#### Step 3.1: Update frontend/README.md
**File:** `frontend/README.md`

**Sections to Add/Update:**

1. **Add Prettier Section:**
```markdown
## Code Formatting

This project uses [Prettier](https://prettier.io/) for consistent code formatting.

### Formatting Commands

```bash
# Format all files
npm run format

# Check if files are formatted (for CI/CD)
npm run format:check
```

### IDE Integration

For the best experience, configure your IDE to format on save:
- **VS Code:** Install the "Prettier - Code formatter" extension
- **WebStorm/IntelliJ:** Enable Prettier in Settings > Languages & Frameworks > JavaScript > Prettier

### Prettier Configuration

Prettier is configured via `.prettierrc.json`. The configuration follows project conventions:
- Double quotes for strings
- Semicolons required
- 2-space indentation
- 80 character line width
```

2. **Update Project Structure Section:**
```markdown
## Project Structure

```
frontend/
├── app/              # Next.js App Router pages and layouts
├── components/       # React components (UI library)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and helpers
├── types/            # Shared TypeScript type definitions
├── public/           # Static assets
├── docs/             # Project documentation
└── ...
```

### Directory Organization

- **`/app`** - Next.js App Router pages, layouts, and route handlers
- **`/components`** - Reusable React components (UI library)
- **`/hooks`** - Custom React hooks (reusable logic)
- **`/lib`** - Utility functions, helpers, and shared logic
- **`/types`** - Shared TypeScript type definitions
- **`/public`** - Static assets (images, icons, etc.)

**Note:** Component-specific types and hooks can remain co-located with their components for better organization.
```

3. **Update Development Workflow Section:**
```markdown
## Development Workflow

### Before Committing

1. **Format code:**
   ```bash
   npm run format
   ```

2. **Lint code:**
   ```bash
   npm run lint
   ```

3. **Type check:**
   ```bash
   npm run build
   ```

### Hot Reload

The development server supports hot module replacement (HMR):
- Component changes are reflected immediately
- State is preserved during hot reload
- Fast refresh enabled by default

Start the development server:
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.
```

#### Step 3.2: Create Project Structure Documentation
**File:** `frontend/docs/PROJECT_STRUCTURE.md` (optional but recommended)

**Purpose:** Detailed documentation of project structure

**Content:**
```markdown
# Project Structure

This document describes the organization and structure of the Krawl frontend project.

## Directory Overview

### `/app`
Next.js App Router directory containing pages, layouts, and route handlers.

**Key Files:**
- `layout.tsx` - Root layout with fonts and global styles
- `page.tsx` - Landing page
- `globals.css` - Global styles and design tokens

**Subdirectories:**
- `auth/` - Authentication pages
- `onboarding/` - Onboarding flow pages

### `/components`
Reusable React component library.

**Subdirectories:**
- `ui/` - Base UI components (Button, Card, Input, etc.)
- `onboarding/` - Onboarding-specific components

**Key Files:**
- `index.ts` - Barrel exports for all components
- `README.md` - Component documentation

### `/hooks`
Custom React hooks for reusable logic.

**Usage:**
```tsx
import { useBreakpoint, useIsMobile } from '@/hooks'
```

**Note:** Hooks can also be placed in `/lib` if they're utility-focused rather than React-specific.

### `/lib`
Utility functions, helpers, and shared logic.

**Key Files:**
- `utils.ts` - General utility functions (e.g., `cn()`)
- `design-tokens.ts` - Design token exports
- `breakpoints.ts` - Breakpoint utilities and hooks

**Subdirectories:**
- `onboarding/` - Onboarding-specific utilities

### `/types`
Shared TypeScript type definitions.

**Usage:**
```tsx
import type { StepId, IllustrationId } from '@/types'
```

**Note:** Component-specific types should remain co-located with their components.

### `/public`
Static assets served at the root URL.

**Contents:**
- Icons (SVG files)
- Images
- Other static files

## Import Patterns

### Path Aliases

The project uses path aliases for clean imports:

```tsx
// ✅ Good - Using path aliases
import { Button } from '@/components'
import { useBreakpoint } from '@/hooks'
import { cn } from '@/lib/utils'
import type { StepId } from '@/types'

// ❌ Avoid - Relative paths
import { Button } from '../../components/ui/button'
```

### Barrel Exports

Use barrel exports for cleaner imports:

```tsx
// ✅ Good - Using barrel export
import { Button, Card, Input } from '@/components'

// ❌ Avoid - Direct file imports (unless necessary)
import { Button } from '@/components/ui/button'
```

## File Naming Conventions

- **Components:** PascalCase (e.g., `Button.tsx`, `OnboardingFlow.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAuth.ts`, `useBreakpoint.ts`)
- **Utilities:** camelCase (e.g., `utils.ts`, `design-tokens.ts`)
- **Types:** camelCase (e.g., `types.ts`, `user.ts`)
- **Pages:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` (Next.js conventions)

## Code Organization Best Practices

1. **Co-location:** Keep related files together (components with their types)
2. **Separation:** Separate shared resources from component-specific code
3. **Barrel Exports:** Use `index.ts` files for clean imports
4. **Path Aliases:** Always use `@/` prefix for imports
5. **Type Safety:** Use TypeScript types and interfaces consistently
```

### 2.4 Phase 4: Verification & Testing (15 minutes)

#### Step 4.1: Verify Prettier Works
**Commands:**
```bash
cd frontend

# Check formatting (should show files that need formatting)
npm run format:check

# Format all files
npm run format

# Verify formatting again (should pass)
npm run format:check
```

#### Step 4.2: Verify Build Still Works
**Command:**
```bash
npm run build
```

**Expected:** Build should complete successfully with no errors.

#### Step 4.3: Test Hot Reload
**Steps:**
1. Start development server: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Make a small change to `app/page.tsx` (e.g., change text)
4. Verify changes appear immediately without full page reload
5. Verify browser console shows HMR updates

**Expected Behavior:**
- Changes appear immediately
- State is preserved (if using React state)
- No full page reload
- Fast refresh works correctly

#### Step 4.4: Test Path Aliases
**Test File:** Create `frontend/test-aliases.ts` (temporary)

**Content:**
```typescript
// Test path aliases
import { Button } from '@/components';
import { useBreakpoint } from '@/hooks';
import { cn } from '@/lib/utils';
import type { StepId } from '@/types';

// Verify imports work
console.log('Path aliases working correctly');
```

**Command:**
```bash
# Should compile without errors
npx tsc --noEmit test-aliases.ts
```

**Cleanup:** Delete `test-aliases.ts` after verification.

#### Step 4.5: Verify Directory Structure
**Command:**
```bash
# Verify directories exist
ls -la frontend/hooks
ls -la frontend/types
```

**Expected:** Both directories should exist with `index.ts` files.

---

## 3. Technical Specifications

### 3.1 Prettier Configuration

#### Configuration File Structure
```
frontend/
├── .prettierrc.json      # Prettier configuration
├── .prettierignore       # Files to ignore
└── package.json          # Scripts and dependencies
```

#### Prettier Rules Explanation

| Rule | Value | Rationale |
|------|-------|-----------|
| `semi` | `true` | Matches existing codebase style |
| `trailingComma` | `"es5"` | Better git diffs, matches ES5 compatibility |
| `singleQuote` | `false` | Matches existing codebase (double quotes) |
| `printWidth` | `80` | Standard line length for readability |
| `tabWidth` | `2` | Matches existing indentation |
| `useTabs` | `false` | Use spaces, not tabs |
| `arrowParens` | `"always"` | Consistent arrow function formatting |
| `endOfLine` | `"lf"` | Cross-platform compatibility |

#### Integration with ESLint

**No Conflicts:** Prettier and ESLint work together:
- ESLint handles code quality (errors, best practices)
- Prettier handles code formatting (style, spacing)
- Use `eslint-config-prettier` if conflicts arise (not needed with Next.js config)

### 3.2 Directory Structure

#### Hooks Directory
```
frontend/hooks/
└── index.ts              # Barrel exports
```

**Future Structure (example):**
```
frontend/hooks/
├── index.ts
├── useAuth.ts
├── useToast.ts
├── useLocalStorage.ts
└── ...
```

#### Types Directory
```
frontend/types/
└── index.ts              # Barrel exports
```

**Future Structure (example):**
```
frontend/types/
├── index.ts
├── user.ts
├── gem.ts
├── krawl.ts
├── api.ts
└── ...
```

### 3.3 Package.json Updates

#### Scripts Section
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

#### DevDependencies Section
```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.0.3",
    "prettier": "^3.x",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### 3.4 TypeScript Configuration

#### Current Configuration (No Changes Needed)
**File:** `frontend/tsconfig.json`

**Key Settings:**
- ✅ `strict: true` - Strict type checking
- ✅ `paths: { "@/*": ["./*"] }` - Path aliases
- ✅ Next.js plugin configured
- ✅ Proper include/exclude patterns

**Verification:** No changes needed - configuration is correct.

### 3.5 Next.js Configuration

#### Current Configuration (No Changes Needed)
**File:** `frontend/next.config.ts`

**Status:** Basic configuration is sufficient for now.

**Future Enhancements (not part of this task):**
- PWA configuration (TASK-032)
- Image optimization
- Environment variable handling
- Custom webpack config (if needed)

---

## 4. Edge Case Handling

### 4.1 Prettier Edge Cases

#### Case 1: Prettier Conflicts with ESLint
**Scenario:** Prettier and ESLint have conflicting rules

**Solution:**
- Next.js ESLint config is Prettier-compatible by default
- If conflicts arise, install `eslint-config-prettier`:
  ```bash
  npm install -D eslint-config-prettier
  ```
- Add to `eslint.config.mjs`:
  ```js
  import prettierConfig from 'eslint-config-prettier';
  
  export default [
    // ... existing config
    prettierConfig, // Must be last
  ];
  ```

#### Case 2: Large Codebase Formatting
**Scenario:** Formatting entire codebase takes too long

**Solution:**
- Prettier is fast, but for very large codebases:
  - Format incrementally (file by file)
  - Use `.prettierignore` to exclude large generated files
  - Format only changed files in CI/CD

#### Case 3: Team Members Have Different Prettier Versions
**Scenario:** Different Prettier versions produce different formatting

**Solution:**
- Pin Prettier version in `package.json`:
  ```json
  "prettier": "3.2.5"  // Specific version
  ```
- Use `package-lock.json` to ensure consistent versions
- Document Prettier version in README

### 4.2 Directory Structure Edge Cases

#### Case 1: Hooks in Both `/hooks` and `/lib`
**Scenario:** Some hooks in `/hooks`, others in `/lib`

**Solution:**
- Document pattern: React-specific hooks in `/hooks`, utility hooks in `/lib`
- Re-export from `/hooks/index.ts` for convenience
- Gradually migrate hooks to appropriate location

#### Case 2: Types in Both `/types` and Component Files
**Scenario:** Some types in `/types`, others co-located

**Solution:**
- Document pattern: Shared types in `/types`, component-specific types co-located
- Re-export component types from `/types/index.ts` for convenience
- Gradually migrate shared types to `/types`

#### Case 3: Circular Dependencies
**Scenario:** Barrel exports create circular dependencies

**Solution:**
- Avoid circular dependencies in barrel exports
- Use direct imports when necessary
- Structure exports to prevent cycles

### 4.3 Hot Reload Edge Cases

#### Case 1: Hot Reload Not Working
**Scenario:** Changes don't appear in browser

**Solution:**
1. Check browser console for errors
2. Verify development server is running
3. Clear browser cache
4. Restart development server
5. Check for syntax errors preventing HMR

#### Case 2: State Lost During Hot Reload
**Scenario:** React state is lost when component updates

**Solution:**
- This is expected behavior for some state changes
- Use React DevTools to inspect state
- Fast Refresh preserves state for most changes
- Document state management patterns

#### Case 3: TypeScript Errors Block Hot Reload
**Scenario:** TypeScript errors prevent hot reload

**Solution:**
- Fix TypeScript errors first
- Use `// @ts-ignore` sparingly (only for unavoidable cases)
- Enable `isolatedModules: true` in tsconfig.json (already enabled)

### 4.4 Build Edge Cases

#### Case 1: Build Fails After Prettier
**Scenario:** Build fails after formatting

**Solution:**
- Verify no syntax errors introduced
- Check TypeScript compilation: `npx tsc --noEmit`
- Verify ESLint passes: `npm run lint`
- Review formatted code for issues

#### Case 2: Path Aliases Not Working
**Scenario:** Imports using `@/` fail

**Solution:**
1. Verify `tsconfig.json` has correct paths
2. Verify `next.config.ts` doesn't override paths
3. Restart TypeScript server in IDE
4. Clear `.next` directory and rebuild

---

## 5. Testing Strategy

### 5.1 Unit Tests

#### Prettier Configuration Test
**Test:** Verify Prettier formats code correctly

**Steps:**
1. Create test file with unformatted code
2. Run `npm run format`
3. Verify code is formatted according to rules
4. Run `npm run format:check` - should pass

**Test File:** `frontend/test-prettier.ts` (temporary)
```typescript
// Unformatted code
const test={a:1,b:2,c:3}
function testFunc(x,y){return x+y}
```

**Expected:** Formatted to match Prettier rules.

#### Path Alias Test
**Test:** Verify path aliases work correctly

**Steps:**
1. Create test file using path aliases
2. Run TypeScript compiler: `npx tsc --noEmit test-aliases.ts`
3. Verify no errors

**Test File:** `frontend/test-aliases.ts` (temporary)
```typescript
import { Button } from '@/components';
import { useBreakpoint } from '@/hooks';
import { cn } from '@/lib/utils';
import type { StepId } from '@/types';
```

**Expected:** No TypeScript errors.

### 5.2 Integration Tests

#### Build Integration Test
**Test:** Verify build works with all changes

**Steps:**
1. Run `npm run build`
2. Verify build completes successfully
3. Verify no TypeScript errors
4. Verify no ESLint errors
5. Verify output in `.next` directory

**Expected:** Build succeeds with no errors.

#### Format Check Integration Test
**Test:** Verify format check works in CI/CD

**Steps:**
1. Run `npm run format:check`
2. Verify exit code is 0 (success)
3. Make a formatting change
4. Run `npm run format:check` again
5. Verify exit code is 1 (failure)

**Expected:** Format check correctly identifies unformatted files.

### 5.3 Manual Testing

#### Hot Reload Test
**Test:** Verify hot reload works correctly

**Steps:**
1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Open browser DevTools console
4. Make change to `app/page.tsx`
5. Verify change appears immediately
6. Verify console shows HMR update
7. Verify no full page reload

**Expected:** Changes appear immediately with HMR.

#### Directory Structure Test
**Test:** Verify new directories are accessible

**Steps:**
1. Verify `frontend/hooks/` exists
2. Verify `frontend/hooks/index.ts` exists
3. Verify `frontend/types/` exists
4. Verify `frontend/types/index.ts` exists
5. Test imports from both directories

**Expected:** All directories and files exist, imports work.

### 5.4 Edge Case Testing

#### Prettier Conflict Test
**Test:** Verify Prettier doesn't conflict with ESLint

**Steps:**
1. Run `npm run lint`
2. Run `npm run format`
3. Run `npm run lint` again
4. Verify no conflicts

**Expected:** No conflicts between Prettier and ESLint.

#### TypeScript Strict Mode Test
**Test:** Verify TypeScript strict mode still works

**Steps:**
1. Create file with TypeScript error
2. Run `npx tsc --noEmit`
3. Verify error is caught

**Expected:** TypeScript catches errors in strict mode.

---

## 6. Files to Create

### 6.1 Configuration Files

1. **`frontend/.prettierrc.json`**
   - **Purpose:** Prettier configuration
   - **Lines:** ~15
   - **Priority:** High

2. **`frontend/.prettierignore`**
   - **Purpose:** Files to ignore in Prettier
   - **Lines:** ~30
   - **Priority:** High

### 6.2 Directory Structure Files

3. **`frontend/hooks/index.ts`**
   - **Purpose:** Barrel exports for hooks
   - **Lines:** ~20
   - **Priority:** Medium

4. **`frontend/types/index.ts`**
   - **Purpose:** Barrel exports for types
   - **Lines:** ~20
   - **Priority:** Medium

### 6.3 Documentation Files

5. **`frontend/docs/PROJECT_STRUCTURE.md`** (optional)
   - **Purpose:** Detailed project structure documentation
   - **Lines:** ~200
   - **Priority:** Low

---

## 7. Files to Modify

### 7.1 Package Configuration

1. **`frontend/package.json`**
   - **Changes:**
     - Add `prettier` to `devDependencies`
     - Add `format` and `format:check` scripts
   - **Lines Changed:** ~5
   - **Priority:** High

### 7.2 Documentation

2. **`frontend/README.md`**
   - **Changes:**
     - Add Prettier section
     - Update project structure section
     - Update development workflow section
   - **Lines Changed:** ~100
   - **Priority:** Medium

### 7.3 Git Configuration (if needed)

3. **`frontend/.gitignore`**
   - **Changes:**
     - Verify Prettier cache is ignored (usually not needed)
   - **Lines Changed:** 0-5
   - **Priority:** Low

---

## 8. Dependencies to Add

### 8.1 Development Dependencies

1. **`prettier`**
   - **Version:** Latest stable (^3.x)
   - **Purpose:** Code formatter
   - **Install Command:** `npm install -D prettier`
   - **Priority:** High

**No other dependencies needed** - all other tools are already installed.

---

## 9. Code Examples

### 9.1 Prettier Configuration Example

**File:** `frontend/.prettierrc.json`
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "quoteProps": "as-needed"
}
```

### 9.2 Hooks Directory Example

**File:** `frontend/hooks/index.ts`
```typescript
/**
 * Custom React Hooks
 * 
 * This directory contains reusable React hooks for the Krawl application.
 * 
 * @example
 * ```tsx
 * import { useBreakpoint } from '@/hooks'
 * ```
 */

// Re-export hooks from lib/breakpoints.ts for convenience
export {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
} from '@/lib/breakpoints';

// Future hooks can be added here:
// export { useAuth } from './useAuth';
// export { useToast } from './useToast';
```

### 9.3 Types Directory Example

**File:** `frontend/types/index.ts`
```typescript
/**
 * Shared TypeScript Types
 * 
 * This directory contains shared TypeScript type definitions for the Krawl application.
 * Component-specific types should remain co-located with their components.
 * 
 * @example
 * ```tsx
 * import type { StepId, IllustrationId } from '@/types'
 * ```
 */

// Re-export types from components for convenience
export type {
  StepId,
  IllustrationId,
} from '@/components/onboarding/types';

// Future shared types can be added here:
// export type { User } from './user';
// export type { Gem } from './gem';
// export type { Krawl } from './krawl';
```

### 9.4 Package.json Scripts Example

**File:** `frontend/package.json` (excerpt)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "devDependencies": {
    "prettier": "^3.2.5"
  }
}
```

---

## 10. Implementation Checklist

### Phase 1: Prettier Configuration
- [ ] Install Prettier: `npm install -D prettier`
- [ ] Create `.prettierrc.json`
- [ ] Create `.prettierignore`
- [ ] Add format scripts to `package.json`
- [ ] Test Prettier: `npm run format:check`
- [ ] Format codebase: `npm run format`

### Phase 2: Directory Structure
- [ ] Create `frontend/hooks/` directory
- [ ] Create `frontend/hooks/index.ts`
- [ ] Create `frontend/types/` directory
- [ ] Create `frontend/types/index.ts`
- [ ] Test imports from new directories

### Phase 3: Documentation
- [ ] Update `frontend/README.md` with Prettier section
- [ ] Update `frontend/README.md` with project structure
- [ ] Update `frontend/README.md` with development workflow
- [ ] Create `frontend/docs/PROJECT_STRUCTURE.md` (optional)

### Phase 4: Verification
- [ ] Verify build: `npm run build`
- [ ] Verify format check: `npm run format:check`
- [ ] Test hot reload: `npm run dev`
- [ ] Test path aliases
- [ ] Verify all acceptance criteria met

---

## 11. Acceptance Criteria Verification

### Next.js 16.0.3 Project Initialization
- [x] Next.js 16.0.3 installed ✅
- [x] Project structure exists ✅
- [x] App Router configured ✅

### TypeScript Configuration
- [x] `tsconfig.json` configured ✅
- [x] Strict mode enabled ✅
- [x] Path aliases configured (`@/*`) ✅

### Project Structure
- [x] `/app` - App Router pages ✅
- [x] `/components` - React components ✅
- [x] `/lib` - Utility functions ✅
- [ ] `/hooks` - Custom React hooks ⚠️ (will be created)
- [ ] `/types` - TypeScript types ⚠️ (will be created)
- [x] `/styles` - Global styles (`app/globals.css`) ✅
- [x] `/public` - Static assets ✅

### Development Tools
- [x] ESLint configured ✅
- [ ] Prettier configured ⚠️ (will be configured)

### Environment Variables
- [x] Environment variables configured ✅
- [x] Template file exists (`env-example`) ✅

### Build Verification
- [x] Project builds successfully ✅
- [x] TypeScript compilation works ✅
- [ ] Hot reload works ⚠️ (will be verified)

### Path Aliases
- [x] Path aliases work correctly ✅
- [x] Used throughout codebase ✅

---

## 12. Risk Assessment

### Risk Level: 🟢 **LOW**

**Risk Factors:**
- ✅ Core setup already complete
- ✅ Only adding missing configuration
- ✅ No breaking changes
- ✅ Backward compatible
- ✅ Well-tested tools (Prettier)

### Specific Risks

#### 1. Prettier Formatting Changes
**Risk:** Prettier may reformat existing code  
**Impact:** Low - formatting changes are cosmetic  
**Mitigation:** 
- Review formatted changes
- Commit formatting separately from logic changes
- Document formatting in commit message

#### 2. Directory Structure Confusion
**Risk:** Team members unsure where to put hooks/types  
**Impact:** Low - documented patterns  
**Mitigation:**
- Clear documentation
- Examples in README
- Code review guidelines

#### 3. Hot Reload Issues
**Risk:** Hot reload may not work in all scenarios  
**Impact:** Low - development experience only  
**Mitigation:**
- Test thoroughly
- Document known issues
- Provide workarounds

---

## 13. Summary and Recommendations

### Solution Readiness: ✅ **READY FOR IMPLEMENTATION**

**Strengths:**
- ✅ Clear implementation plan
- ✅ All gaps identified and addressed
- ✅ Backward compatible changes
- ✅ Well-documented approach
- ✅ Low risk implementation

**Implementation Time:**
- Prettier setup: 30 minutes
- Directory creation: 15 minutes
- Documentation: 20 minutes
- Verification: 15 minutes
- **Total: ~1.5 hours**

### Recommendations

1. **Immediate Actions:**
   - Install and configure Prettier
   - Create optional directories
   - Update documentation
   - Verify all functionality

2. **Best Practices:**
   - Format code before committing
   - Use path aliases consistently
   - Follow directory structure patterns
   - Document any deviations

3. **Future Enhancements:**
   - Add pre-commit hook for formatting (optional)
   - Migrate hooks from `/lib` to `/hooks` gradually
   - Migrate shared types to `/types` gradually
   - Add more comprehensive project structure docs

### Next Steps

1. ✅ Review this solution design
2. ✅ Get approval to proceed
3. ✅ Create implementation branch
4. ✅ Follow implementation checklist
5. ✅ Verify all acceptance criteria
6. ✅ Update task status

---

**Solution Design Generated:** 2025-11-21  
**Architect:** Senior Software Architect  
**Status:** ✅ **READY FOR IMPLEMENTATION**

