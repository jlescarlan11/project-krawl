## PWA Test Plan

This document describes the manual and automated checks required to validate TASK-032 (PWA enablement).

### 1. Prerequisites

- Build the app: `npm run build && npm run start`
- Use Chrome 130+, Edge 130+, Safari iOS 18+, Firefox 131+
- Mobile simulator (Android or iOS) for install flow

### 2. Functional Tests

1. **Manifest validation**
   - Open `chrome://inspect/#manifest` or Lighthouse
   - Confirm name, icons, theme color, and start URL
2. **Install prompt**
   - In Chrome, open site, wait for install indicator, click “Install Krawl”
   - Launch installed app, ensure splash icon + standalone mode
3. **Offline navigation**
   - In DevTools → Network → Offline
   - Navigate between cached routes, confirm `app/offline` page when necessary
4. **Service worker update**
   - Start app, keep tab open
   - Modify code & redeploy locally
   - Confirm toast prompting to update; clicking “Update” reloads page

### 3. Edge Cases

- Toggle airplane mode mid-request to verify graceful error UI
- Delete cache via Application tab and reload offline to verify fallback HTML
- Test Firefox where install prompts differ (about:install)
- Validate iOS Safari (limited SW features) still loads manifest + icons

### 4. Automation Hooks

- `useServiceWorkerUpdates` unit tests (Jest) should mock registration events
- Add Playwright scenario that intercepts network and asserts offline page content

Document test evidence (screenshots, notes) in QA Verification Report for TASK-032.

