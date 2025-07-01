
import { DollarSign, Target, Users, Package, TrendingUp } from 'lucide-react';

export const onboardingSteps = [
  {
    icon: DollarSign,
    title: "Set Your Budget",
    description: "Choose your campaign investment with flexible options starting from ₹5,000",
    visual: "Budget slider with real-time calculations"
  },
  {
    icon: Target,
    title: "Define Content Goals", 
    description: "Select content types, quality requirements, and campaign objectives",
    visual: "Interactive content type selection"
  },
  {
    icon: Users,
    title: "Choose Your Creators",
    description: "AI-powered matching with creators that align with your brand values",
    visual: "Creator recommendation algorithm"
  },
  {
    icon: Package,
    title: "Product Details",
    description: "Add your product information and shipping requirements",
    visual: "Product form with smart validation"
  },
  {
    icon: TrendingUp,
    title: "Launch & Track",
    description: "Monitor campaign performance with real-time analytics",
    visual: "Live dashboard preview"
  }
];
