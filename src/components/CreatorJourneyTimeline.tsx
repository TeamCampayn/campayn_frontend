
"use client";

import { Calendar, Code, FileText, User, Zap } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const creatorTimelineData = [
  {
    id: 1,
    title: "Profile Setup",
    date: "Day 1",
    content: "Create your creator profile with portfolio, bio, and showcase your best content to attract brand partnerships.",
    category: "Onboarding",
    icon: User,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Content Creation",
    date: "Week 1",
    content: "Develop authentic content that resonates with your audience and aligns with brand values.",
    category: "Content",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Brand Matching",
    date: "Week 2",
    content: "Get matched with brands that align with your niche, values, and audience demographics.",
    category: "Partnerships",
    icon: Zap,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 4,
    title: "Campaign Launch",
    date: "Week 3",
    content: "Execute brand campaigns with creative freedom while meeting deliverable requirements.",
    category: "Execution",
    icon: Code,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 40,
  },
  {
    id: 5,
    title: "Growth & Scale",
    date: "Month 2+",
    content: "Build long-term partnerships, increase rates, and scale your creator business sustainably.",
    category: "Growth",
    icon: Calendar,
    relatedIds: [4],
    status: "pending" as const,
    energy: 20,
  },
];

export const CreatorJourneyTimeline = () => {
  return (
    <div className="relative">
      {/* Section Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-center">
        <h2 className="text-4xl font-bold text-white mb-2">
          Your Creator Journey
        </h2>
        <p className="text-lg text-white/70">
          Click on each step to explore your path to success
        </p>
      </div>
      
      <RadialOrbitalTimeline timelineData={creatorTimelineData} />
    </div>
  );
};

export default CreatorJourneyTimeline;
