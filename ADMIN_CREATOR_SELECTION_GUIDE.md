# Admin Creator Selection Guide

## How to Access Creator Selection for Multi-Phase Campaigns

### Step-by-Step Process

#### 1. Access Admin Dashboard
- Navigate to `/admin` (requires admin login)
- You'll see the main Admin Dashboard

#### 2. Navigate to Multi-Phase Campaigns
- On the Admin Dashboard, click the **"Multi-Phase Campaigns"** button (blue button with building icon)
- This takes you to `/admin/campaigns` 

#### 3. Find Campaigns in Creator Selection Phase
- In the Campaign Management page, you'll see all campaigns organized by phase
- Use the tabs at the top to filter by phase or view "All Campaigns"
- Look for campaigns with a **blue badge** labeled "Creator Selection"

#### 4. Access Creator Selection
- For any campaign in "Creator Selection" phase, click the **"Select Creators"** button (blue button)
- This navigates to `/admin/campaigns/{campaign-id}/creators`

#### 5. Creator Selection Interface
- **Search & Filter**: Use search bar and filters to find relevant creators
- **View Creator Profiles**: Each creator card shows:
  - Name and Instagram handle
  - Follower count and engagement rate
  - Category/niche
  - Profile metrics
- **Select Creators**: Check the boxes for creators you want to recommend
- **Add Notes**: Write admin notes explaining why you're recommending these creators
- **Submit Recommendations**: Click "Send Recommendations to Brand"

### Alternative Path via Admin Dashboard

#### Quick Campaign Access
- On the Admin Dashboard, in the "All Campaigns" table
- Find any campaign and click **"Manage Campaign"**
- This also takes you to the Campaign Management page where you can access creator selection

### What Happens After Creator Selection

1. **Brand Notification**: Brand receives creator recommendations
2. **Brand Review**: Brand can approve, reject, or request more info for each creator
3. **Phase Progression**: Once creators are approved, campaign moves to "Payment Pending" phase
4. **Continued Management**: Admin can track progress through all 5 phases

### Campaign Phases Overview

1. **Creator Selection** (20% complete) - Admin recommends creators
2. **Payment Pending** (40% complete) - Payment processing
3. **Content Approval** (60% complete) - Content review
4. **Campaign Active** (80% complete) - Live campaign monitoring
5. **Campaign Complete** (100% complete) - Final results

### Troubleshooting

**If you don't see the "Select Creators" button:**
- Check that the campaign is in "Creator Selection" phase
- Verify you have admin permissions
- Refresh the Campaign Management page

**If creator selection page doesn't load:**
- Verify the campaign ID exists
- Check that the backend server is running
- Ensure the route `/admin/campaigns/:campaignId/creators` is accessible

### Key Features

- **Advanced Filtering**: Filter by follower count, engagement rate, category
- **Bulk Selection**: Select multiple creators at once
- **Real-time Search**: Search by name, handle, or category
- **Creator Analytics**: View detailed metrics for each creator
- **Admin Notes**: Add context and reasoning for recommendations
- **Brand Communication**: System notifies brands of new recommendations

### Tips for Effective Creator Selection

1. **Match Campaign Goals**: Select creators whose audience aligns with brand objectives
2. **Diversify Portfolio**: Choose creators from different follower tiers and niches
3. **Quality over Quantity**: Focus on engagement rate rather than just follower count
4. **Add Detailed Notes**: Explain your reasoning to help brands make decisions
5. **Consider Budget**: Select creators within the campaign's budget range