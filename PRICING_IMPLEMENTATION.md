# Creator Pricing Implementation

## Overview
Implemented a comprehensive pricing system that calculates affordable creator counts based on campaign budgets and creator tiers.

## Pricing Structure

Based on the provided screenshot, creator pricing is as follows:

| Tier | Follower Range | Price per Creator |
|------|---------------|-------------------|
| **Nano/Micro** | 1K - 10K | ₹3,900 |
| **Macro** | 10K - 100K | ₹7,400 |
| **Mega** | 100K - 2M | ₹14,200 |

## Implementation Details

### 1. Pricing Configuration (`src/lib/pricing.ts`)

Created a centralized pricing configuration with utility functions:

```typescript
export const CREATOR_PRICING = {
  micro: { pricePerCreator: 3900, followerRange: '1K-10K' },
  macro: { pricePerCreator: 7400, followerRange: '10K-100K' },
  mega: { pricePerCreator: 14200, followerRange: '100K-2M' }
};
```

**Key Functions:**

- `calculateAffordableCreators(budget, tier)` - Calculates maximum number of creators affordable within budget
- `getRecommendedCreatorCount(budget, tier)` - Returns optimal creator count (70-90% budget utilization)
- `calculateTotalCost(count, tier)` - Calculates total cost for given number of creators
- `formatINR(amount)` - Formats currency in Indian Rupee format (₹3.9K, ₹1.4L, etc.)

### 2. Campaign Form Integration (`src/components/CampaignForm.tsx`)

#### Visual Pricing Display

Added a comprehensive budget analysis section that shows:

1. **Pricing Cards** - Shows all three tiers with:
   - Price per creator
   - Follower range
   - Highlighted selected tier
   - Affordable creator count for selected tier

2. **Recommendation Summary** - Displays:
   - Optimal number of creators
   - Cost per creator
   - Maximum affordable creators
   - Estimated total cost
   - Budget utilization percentage

#### Budget Calculation on Form Submission

When a campaign is created, the system:
1. Calculates optimal creator count based on budget and tier
2. Stores `target_creators_count` with the calculated value (not hardcoded)
3. Saves pricing metadata in deliverables:
   - `estimated_cost_per_creator`
   - `max_affordable_creators`

## User Experience Flow

### Step 1: Select Budget
User selects campaign budget (default: ₹50,000)

### Step 2: Select Creator Tier
User chooses between:
- Nano creators (1K-10K followers)
- Micro creators (10K-100K followers)
- Macro creators (100K+ followers)

### Step 3: View Budget Analysis
System automatically displays:
- How many creators can be afforded
- Pricing breakdown
- Recommended creator count
- Budget utilization

### Step 4: Campaign Creation
System saves campaign with:
- Calculated optimal creator count
- Pricing information
- Budget constraints

## Examples

### Example 1: ₹50,000 Budget with Nano Creators
- Price per creator: ₹3,900
- Maximum affordable: 12 creators
- Recommended: 11 creators (85% of budget)
- Estimated cost: ₹42,900

### Example 2: ₹1,00,000 Budget with Macro Creators
- Price per creator: ₹7,400
- Maximum affordable: 13 creators
- Recommended: 12 creators (89% of budget)
- Estimated cost: ₹88,800

### Example 3: ₹2,00,000 Budget with Mega Creators
- Price per creator: ₹14,200
- Maximum affordable: 14 creators
- Recommended: 13 creators (92% of budget)
- Estimated cost: ₹1,84,600

## Budget Optimization

The system recommends using **70-90% of budget** for creator selection to:
- Leave buffer for contingencies
- Allow flexibility for premium creators
- Cover additional campaign costs
- Maintain financial prudence

## Future Enhancements

### Phase 1 (Immediate)
- ✅ Display pricing in campaign form
- ✅ Calculate affordable creator count
- ✅ Store pricing in database
- ⏳ Limit creator approval to budget constraints

### Phase 2 (Next)
- Add budget validation when approving creators
- Show "X/Y creators selected" with budget tracking
- Disable approve button when budget limit reached
- Display warning when approaching budget limit

### Phase 3 (Future)
- Dynamic pricing based on creator engagement
- Bulk discount for multiple creators
- Premium creator surcharge
- Custom pricing tiers

## Technical Details

### Database Schema Updates Needed

To fully support pricing, add these columns to `campaigns` table:

```sql
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS estimated_cost_per_creator INTEGER;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS max_affordable_creators INTEGER;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS actual_creators_selected INTEGER DEFAULT 0;
```

### API Integration

Current API endpoints:
- `POST /api/campaigns/:id/generate-recommendations` - Auto-generates recommendations
- `GET /api/campaigns/:id/creators-enriched` - Returns enriched creator data
- `PATCH /api/campaigns/:id/creators/:id/respond` - Handle approve/reject

No API changes needed for basic pricing functionality.

## Testing Checklist

- [x] Pricing display appears when budget and tier are selected
- [x] All three tier cards show correct pricing
- [x] Selected tier is highlighted
- [x] Affordable creator count calculates correctly
- [x] Recommendation summary shows accurate numbers
- [x] Budget utilization percentage is correct
- [x] Campaign saves with calculated creator count
- [ ] Budget limit enforced during creator approval
- [ ] Warning shown when approaching budget limit

## Notes

- Pricing is hardcoded based on screenshot provided
- Future: Consider making pricing configurable via admin panel
- Currency is fixed to INR (Indian Rupees)
- All calculations use integer arithmetic to avoid floating-point errors
