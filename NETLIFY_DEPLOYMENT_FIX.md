# Netlify Deployment Fix - 404 Error Resolution

## Problem
After deploying to Netlify, navigating directly to routes like `/terms`, `/privacy`, `/contact`, etc. resulted in 404 errors, even though they worked fine in localhost.

## Root Cause
Netlify serves static files by default. When you navigate to a URL like `campayn.in/terms`, Netlify looks for a file at `terms.html` or a `terms` folder with an `index.html`. Since React Router handles routing on the client-side, these files don't exist on the server, causing a 404.

## Solution Implemented

### 1. Created `public/_redirects` File
**File:** `public/_redirects`

```
/*    /index.html   200
```

**What it does:**
- Tells Netlify to serve `index.html` for ALL routes
- Maintains the original URL in the browser
- Returns 200 status (not 301/302 redirect)
- Allows React Router to handle routing client-side

### 2. Created `netlify.toml` Configuration
**File:** `netlify.toml` (in project root)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**What it does:**
- Configures build settings for Netlify
- Adds redirect rules (alternative to `_redirects` file)
- Sets `dist` as the publish directory (Vite's build output)

### Why Both Files?
- `_redirects` is simpler and more commonly used
- `netlify.toml` provides additional configuration options
- Both work together for robust routing

## Deployment Steps

### 1. Commit and Push Changes
```bash
cd /Users/dhairyaraniwal/Downloads/campayn/zestful-campaign-craft-69

# Stage the new files
git add public/_redirects
git add netlify.toml

# Commit
git commit -m "Fix: Add Netlify configuration for client-side routing"

# Push to GitHub
git push origin main
```

### 2. Netlify Will Auto-Deploy
Netlify should automatically detect the push and trigger a new deployment.

**Check deployment status:**
- Go to your Netlify dashboard
- Navigate to your site
- Click "Deploys" tab
- Wait for the build to complete (typically 1-2 minutes)

### 3. Verify the Fix
After deployment completes, test these URLs directly:
- `https://campayn.in/terms`
- `https://campayn.in/privacy`
- `https://campayn.in/shipping`
- `https://campayn.in/contact`
- `https://campayn.in/refunds`

All should now work without 404 errors!

## If Issues Persist

### Check Netlify Build Logs
1. Go to Netlify Dashboard
2. Click on your site
3. Go to "Deploys" → Click latest deploy
4. Check "Deploy log" for any errors

### Verify Build Settings
In Netlify Dashboard → Site Settings → Build & Deploy:

**Build settings should be:**
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Base directory:** (leave empty or set to project root)

### Check Environment Variables
Make sure these are set in Netlify Dashboard → Site Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://rxsgvhstplsjahhvlhss.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SOCKET_URL=https://your-backend-url.com
VITE_CONTENT_BUCKET=campaign-contents
```

### Manual Build (If Auto-Deploy Doesn't Work)
1. Go to Netlify Dashboard
2. Click "Deploys" tab
3. Click "Trigger deploy" → "Deploy site"

### Clear Cache and Rebuild
If the issue persists:
1. Go to Netlify Dashboard → Deploys
2. Click "Deploy settings"
3. Scroll to "Clear cache and retry deploy"
4. Click the button

## Testing Locally

### Build and Preview Production Build
```bash
# Build the project
npm run build

# Preview the build locally
npm run preview
```

This simulates the production environment and helps catch routing issues before deployment.

## Understanding the Fix

### How React Router Works
1. User visits `campayn.in/terms`
2. Browser requests `/terms` from server
3. Server (Netlify) returns `index.html` (due to our redirect rule)
4. React app loads
5. React Router sees URL is `/terms`
6. React Router renders the Terms component

### Without the Fix
1. User visits `campayn.in/terms`
2. Browser requests `/terms` from server
3. Server looks for `/terms.html` or `/terms/index.html`
4. File not found → 404 error
5. React never loads

## Additional Netlify Configuration Options

### 301 vs 200 Status
```toml
# Rewrite (200) - Keeps original URL
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Redirect (301) - Changes URL in browser
[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301
```

### Specific Route Handling
```toml
# API proxy (if needed)
[[redirects]]
  from = "/api/*"
  to = "https://your-backend.com/api/:splat"
  status = 200

# Catch-all for SPA (must be last)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Custom Headers
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self'"
```

## Common Netlify Deployment Issues

### Issue: Build Fails
**Solution:** Check Node.js version
```toml
[build.environment]
  NODE_VERSION = "18"
```

### Issue: Environment Variables Not Working
**Solution:** 
- Variables must start with `VITE_` for Vite projects
- Set in Netlify Dashboard, not in `.env` file
- Rebuild after adding variables

### Issue: 404 on Refresh
**Solution:** This is what we just fixed with `_redirects`!

### Issue: Assets Not Loading
**Solution:** Check `vite.config.ts` base path
```typescript
export default defineConfig({
  base: '/', // Should be '/' for root domain
  // ...
})
```

## Verification Checklist

After deployment, verify:
- ✅ Homepage loads: `https://campayn.in`
- ✅ Terms page: `https://campayn.in/terms`
- ✅ Privacy page: `https://campayn.in/privacy`
- ✅ Shipping page: `https://campayn.in/shipping`
- ✅ Contact page: `https://campayn.in/contact`
- ✅ Refunds page: `https://campayn.in/refunds`
- ✅ Dashboard routes work: `https://campayn.in/dashboard`
- ✅ Hard refresh (Ctrl+Shift+R) works on all pages
- ✅ Direct URL navigation works
- ✅ Browser back/forward buttons work
- ✅ Footer links work

## For Future Reference

**Always include these files in any React SPA deployed to Netlify:**
1. `public/_redirects` with the catch-all rule
2. `netlify.toml` with build configuration

**Best Practices:**
- Test production build locally before deploying
- Check Netlify deploy logs for warnings
- Set up deploy previews for pull requests
- Monitor site with Netlify Analytics

## Support

If issues continue:
- **Netlify Support:** https://answers.netlify.com/
- **Netlify Docs:** https://docs.netlify.com/routing/redirects/
- **React Router Docs:** https://reactrouter.com/

---

## Summary

The 404 errors were caused by Netlify not knowing how to handle client-side routes. By adding the `_redirects` file and `netlify.toml`, we configured Netlify to:

1. Serve `index.html` for all routes
2. Let React Router handle navigation
3. Maintain proper URLs in the browser

**Next Step:** Push these changes to GitHub, wait for Netlify to deploy, and test all your legal pages!
