# Frontend API Migration Guide

This document tracks the migration from hardcoded `localhost:4000` URLs to the dynamic API configuration.

## Changes Made

### 1. Created API Utility (`src/lib/api.ts`)
- Dynamic backend URL based on environment
- Development: `http://localhost:4000`
- Production: `https://campayn-backend.netlify.app/.netlify/functions/api`
- Helper function `getApiUrl(path)` for constructing full URLs
- Helper function `apiFetch(path, options)` for making API calls

### 2. Updated Files

#### ✅ Completed
1. **src/contexts/SocketContext.tsx**
   - Changed: `import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'`
   - To: `import { SOCKET_URL } from '../lib/api'` and use `SOCKET_URL`

2. **src/pages/RazorpayPaymentLink.tsx**
   - Changed: `http://localhost:4000/api/campaigns/${campaignId}/payment-info`
   - To: `getApiUrl(\`api/campaigns/\${campaignId}/payment-info\`)`
   - Changed: `http://localhost:4000/api/campaigns/${campaignId}/submit-razorpay-payment`
   - To: `getApiUrl(\`api/campaigns/\${campaignId}/submit-razorpay-payment\`)`

3. **src/pages/AdminRazorpayVerification.tsx**
   - Changed: `http://localhost:4000/api/admin/razorpay-payments/pending`
   - To: `getApiUrl('api/admin/razorpay-payments/pending')`
   - Changed: `http://localhost:4000/api/admin/campaigns/${id}/verify-razorpay-payment`
   - To: `getApiUrl(\`api/admin/campaigns/\${id}/verify-razorpay-payment\`)`
   - Changed: `http://localhost:4000/api/admin/campaigns/${id}/reject-razorpay-payment`
   - To: `getApiUrl(\`api/admin/campaigns/\${id}/reject-razorpay-payment\`)`

#### 🔄 Remaining Files to Update

Note: The following files use `/api/*` relative paths which will work through a proxy configuration or need to be updated to use `getApiUrl()`:

**Already using relative paths (will work with frontend proxy or Netlify redirects):**
- src/pages/dashboard/ExploreCreators.tsx - Uses `/api/creators`
- src/pages/dashboard/CreatorProfile.tsx - Uses `/api/insights`
- src/pages/dashboard/CampaignAnalytics.tsx - Uses `/api/campaigns` and `/api/insights`
- src/pages/AdminCreators.tsx - Uses `/api/creators`

**Need to be updated (using hardcoded localhost:4000):**
- src/components/CampaignManagement.tsx
- src/components/AdminCreatorSelection.tsx  
- src/components/BrandCampaignManagement.tsx
- src/pages/BrandCampaignDetail.tsx
- src/pages/AdminCreators.tsx
- src/pages/AdminCampaignDetail.tsx
- src/components/ConversationHistory.tsx
- src/components/PaymentManagement.tsx
- src/pages/AdminPaymentDashboard.tsx
- src/components/ContentReview.tsx
- src/components/AdminLinkManager.tsx

## Migration Pattern

### Before:
\`\`\`typescript
const response = await fetch(\`http://localhost:4000/api/campaigns/\${id}\`, {
  headers: { 'Content-Type': 'application/json' }
});
\`\`\`

### After:
\`\`\`typescript
import { getApiUrl } from '@/lib/api';

const response = await fetch(getApiUrl(\`api/campaigns/\${id}\`), {
  headers: { 'Content-Type': 'application/json' }
});
\`\`\`

## Alternative: Using Vite Proxy (for development)

Instead of updating all files, you can use Vite's proxy configuration in `vite.config.ts`:

\`\`\`typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  }
});
\`\`\`

This allows using relative `/api/*` paths in all components during development.

## Environment Variables Required

### Frontend (.env or Netlify):
\`\`\`
VITE_BACKEND_URL=https://campayn-backend.netlify.app/.netlify/functions/api
VITE_SOCKET_URL=https://campayn-backend.netlify.app
VITE_SUPABASE_URL=https://rxsgvhstplsjahhvlhss.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
\`\`\`

### Backend (Netlify):
\`\`\`
NODE_ENV=production
FRONTEND_URL=https://campayn.in
SUPABASE_URL=https://rxsgvhstplsjahhvlhss.supabase.co
SUPABASE_SERVICE_KEY=<your-service-key>
IG_ACCESS_TOKEN=<your-token>
IG_BUSINESS_ID=<your-id>
\`\`\`

## Testing

1. **Development**:
   \`\`\`bash
   # Start backend
   cd backend && npm run dev
   
   # Start frontend (in another terminal)
   cd zestful-campaign-craft-69 && npm run dev
   \`\`\`

2. **Production**:
   - Deploy backend to Netlify
   - Update frontend environment variables
   - Deploy frontend to Netlify
   - Test all API endpoints

## Next Steps

1. Update remaining files with hardcoded URLs
2. Test all endpoints in development
3. Deploy backend to Netlify
4. Configure environment variables in Netlify
5. Deploy frontend with updated environment variables
6. Test production deployment
