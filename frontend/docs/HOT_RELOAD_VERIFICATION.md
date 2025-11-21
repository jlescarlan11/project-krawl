# Hot Reload Verification Guide

## Overview

This document provides a step-by-step guide for verifying that hot module replacement (HMR) / Fast Refresh is working correctly in the Next.js development environment.

## Prerequisites

- Node.js installed
- Development dependencies installed (`npm install`)
- No syntax errors in the codebase

## Verification Steps

### Step 1: Start Development Server

```bash
cd frontend
npm run dev
```

**Expected Output:**

```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
- Environments: .env

✓ Ready in [time]
```

### Step 2: Open Browser

1. Open your browser
2. Navigate to `http://localhost:3000`
3. Open Developer Tools (F12 or Right-click → Inspect)
4. Go to the **Console** tab

### Step 3: Make a Test Change

1. Open `frontend/app/page.tsx` in your editor
2. Find the heading text (around line 28-30)
3. Change the text from:
   ```tsx
   <h1 className="...">To get started, edit the page.tsx file.</h1>
   ```
   To:
   ```tsx
   <h1 className="...">Hot Reload Test - Changes should appear immediately!</h1>
   ```
4. Save the file (Ctrl+S or Cmd+S)

### Step 4: Verify Hot Reload

**Expected Behavior:**

✅ **Immediate Update:**

- The heading text changes in the browser immediately
- No full page reload occurs
- Browser URL remains `http://localhost:3000`
- Page doesn't flash or reload

✅ **Console Messages:**

- Browser console shows Fast Refresh messages:
  ```
  [Fast Refresh] rebuilding
  [Fast Refresh] done
  ```

✅ **State Preservation:**

- If you had scrolled down, scroll position is preserved
- If you had form inputs filled, they remain filled
- Any React component state is preserved

### Step 5: Test Component State Preservation

1. Add a simple counter component to test state preservation:

```tsx
"use client";

import { useState } from "react";

export function TestCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

2. Add it to `app/page.tsx`:

```tsx
import { TestCounter } from "./TestCounter";

export default function Home() {
  return (
    <div>
      {/* existing content */}
      <TestCounter />
    </div>
  );
}
```

3. In the browser:
   - Click the "Increment" button several times
   - Note the count value
4. Make a change to the component (e.g., change button text)
5. Save the file
6. **Verify:** The count value is preserved after hot reload

## Troubleshooting

### Hot Reload Not Working

**Issue:** Changes don't appear immediately

**Solutions:**

1. **Check for Syntax Errors:**
   - Syntax errors prevent HMR from working
   - Check terminal for error messages
   - Fix any TypeScript or syntax errors

2. **Clear Browser Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache manually

3. **Restart Dev Server:**

   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

4. **Check Browser Console:**
   - Look for error messages
   - Check if WebSocket connection is established
   - Verify no network errors

5. **Verify Next.js Version:**
   - Ensure Next.js 16.0.3 is installed
   - Check `package.json` for correct version

6. **Check File Watchers:**
   - On Windows, ensure file watching is enabled
   - On Linux, may need to increase inotify limits

### Fast Refresh Not Preserving State

**Issue:** Component state is lost after hot reload

**Causes:**

- Component has syntax errors
- Component uses anonymous functions incorrectly
- Component exports are not properly structured

**Solutions:**

- Ensure components are properly exported
- Use named exports for components
- Avoid anonymous function components
- Check for syntax errors

### Full Page Reload Occurs

**Issue:** Page fully reloads instead of hot reloading

**Causes:**

- Error in the code that prevents Fast Refresh
- Change to a file that requires full reload (e.g., `next.config.ts`)
- Change to `_app.tsx` or root layout

**Solutions:**

- Fix any errors in the code
- Some files require full reload (this is expected)
- Check terminal for error messages

## Expected Hot Reload Behavior

### Files That Support Hot Reload

✅ **Hot Reload Works:**

- React components (`.tsx`, `.ts`)
- CSS files (`.css`)
- TypeScript files (`.ts`)
- Utility functions

⚠️ **Requires Full Reload:**

- `next.config.ts` - Configuration changes
- `app/layout.tsx` - Root layout changes
- Environment variables (`.env` files)
- `tsconfig.json` - TypeScript config

### Fast Refresh Limitations

Fast Refresh has some limitations:

1. **Class Components:** May require full reload
2. **Anonymous Components:** May not preserve state
3. **Hooks Rules:** Must follow React Hooks rules
4. **Error Boundaries:** Errors may require full reload

## Verification Checklist

- [ ] Dev server starts without errors
- [ ] Browser connects to `http://localhost:3000`
- [ ] Console shows no errors
- [ ] Making a change to a component updates immediately
- [ ] No full page reload occurs
- [ ] Console shows Fast Refresh messages
- [ ] Component state is preserved
- [ ] Scroll position is preserved
- [ ] Form inputs are preserved

## Additional Resources

- [Next.js Fast Refresh Documentation](https://nextjs.org/docs/architecture/fast-refresh)
- [React Fast Refresh](https://github.com/facebook/react/issues/16604)
- [Next.js Development Documentation](https://nextjs.org/docs/app/building-your-application/development)

---

**Last Updated:** 2025-11-21  
**Next.js Version:** 16.0.3  
**Status:** ✅ Hot Reload Enabled by Default
