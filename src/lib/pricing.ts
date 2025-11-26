// Creator Pricing Configuration
// Based on follower tiers and market rates

export const CREATOR_PRICING = {
  micro: {
    name: 'Micro Creators',
    followerRange: '1K-10K',
    pricePerCreator: 3900,
    description: 'Nano to Micro influencers with highly engaged audiences'
  },
  macro: {
    name: 'Macro Creators',
    followerRange: '10K-100K',
    pricePerCreator: 7400,
    description: 'Mid-tier influencers with established reach'
  },
  mega: {
    name: 'Mega Creators',
    followerRange: '100K-2M',
    pricePerCreator: 14200,
    description: 'Large influencers with massive reach'
  }
};

export type CreatorTier = keyof typeof CREATOR_PRICING;

/**
 * Calculate how many creators can be afforded with given budget
 */
export const calculateAffordableCreators = (budget: number, tier: CreatorTier): number => {
  const pricing = CREATOR_PRICING[tier];
  if (!pricing) return 0;
  
  return Math.floor(budget / pricing.pricePerCreator);
};

/**
 * Calculate total cost for N creators of a specific tier
 */
export const calculateTotalCost = (creatorCount: number, tier: CreatorTier): number => {
  const pricing = CREATOR_PRICING[tier];
  if (!pricing) return 0;
  
  return creatorCount * pricing.pricePerCreator;
};

/**
 * Get pricing info for a tier
 */
export const getPricingForTier = (tier: CreatorTier) => {
  return CREATOR_PRICING[tier];
};

/**
 * Format currency in Indian Rupees
 */
export const formatINR = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Get recommended creator count based on budget and tier
 * Returns a range and optimal number
 */
export const getRecommendedCreatorCount = (budget: number, tier: CreatorTier) => {
  const maxAffordable = calculateAffordableCreators(budget, tier);
  
  // Recommend using 70-90% of budget for creators
  const minRecommended = Math.floor(maxAffordable * 0.7);
  const optimalRecommended = Math.floor(maxAffordable * 0.8);
  
  return {
    max: maxAffordable,
    min: Math.max(1, minRecommended),
    optimal: Math.max(1, optimalRecommended),
    pricing: CREATOR_PRICING[tier]
  };
};
