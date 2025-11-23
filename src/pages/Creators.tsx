
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Users, TrendingUp, Eye, DollarSign, Zap, Info } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const creatorsData = [
  {
    id: 1,
    name: "Maya Rodriguez",
    handle: "@fashionista_maya",
    avatar: "MR",
    followers: "245K",
    avgEngagement: "5.2%",
    cpe: "$0.12",
    category: "Fashion",
    campaigns: 3,
    sparklineData: [4.8, 5.1, 4.9, 5.3, 5.2],
    totalEarnings: "$7,500",
    contentDelivered: 12,
    rating: 4.9,
    trend: "+0.3%"
  },
  {
    id: 2,
    name: "Joe Chen",
    handle: "@tech_reviewer_joe",
    avatar: "JC",
    followers: "180K",
    avgEngagement: "4.8%",
    cpe: "$0.15",
    category: "Technology",
    campaigns: 2,
    sparklineData: [4.5, 4.7, 4.8, 4.6, 4.8],
    totalEarnings: "$5,200",
    contentDelivered: 8,
    rating: 4.7,
    trend: "+0.1%"
  },
  {
    id: 3,
    name: "Sara Williams",
    handle: "@gym_guru_sara",
    avatar: "SW",
    followers: "320K",
    avgEngagement: "6.1%",
    cpe: "$0.09",
    category: "Fitness",
    campaigns: 4,
    sparklineData: [5.8, 6.0, 6.2, 5.9, 6.1],
    totalEarnings: "$9,800",
    contentDelivered: 15,
    rating: 4.8,
    trend: "+0.2%"
  },
  {
    id: 4,
    name: "Alex Thompson",
    handle: "@foodie_adventures",
    avatar: "AT",
    followers: "420K",
    avgEngagement: "7.3%",
    cpe: "$0.08",
    category: "Food",
    campaigns: 5,
    sparklineData: [7.0, 7.2, 7.1, 7.4, 7.3],
    totalEarnings: "$12,300",
    contentDelivered: 20,
    rating: 5.0,
    trend: "+0.4%"
  }
];

const CreatorSparkline = ({ data }: { data: number[] }) => (
  <div className="h-12 w-20">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.map((value, index) => ({ value, index }))}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#0d9488" 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const CreatorCard = ({ creator }: { creator: typeof creatorsData[0] }) => (
  <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
    <CardHeader className="text-center pb-3">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
        {creator.avatar}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <h3 className="font-semibold text-slate-900">{creator.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm text-slate-600 ml-1">{creator.rating}</span>
          </div>
        </div>
        <p className="text-sm text-slate-600">{creator.handle}</p>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {creator.category}
          </Badge>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            <Zap className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {/* Engagement Trend */}
      <div className="bg-slate-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-600">Engagement Trend</span>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
            {creator.trend}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-900">{creator.avgEngagement}</div>
            <div className="text-xs text-slate-600">Avg Rate</div>
          </div>
          <CreatorSparkline data={creator.sparklineData} />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-blue-900">{creator.followers}</div>
              <div className="text-xs text-blue-600">Followers</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total follower count across platforms</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <DollarSign className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-green-900">{creator.cpe}</div>
              <div className="text-xs text-green-600">CPE</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cost per engagement - lower is better</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <TrendingUp className="h-4 w-4 text-purple-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-purple-900">{creator.campaigns}</div>
              <div className="text-xs text-purple-600">Campaigns</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Active and completed campaigns</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <Eye className="h-4 w-4 text-orange-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-orange-900">{creator.contentDelivered}</div>
              <div className="text-xs text-orange-600">Content</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total content pieces delivered</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Earnings & Actions */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium text-slate-900">Total Earnings</div>
            <div className="text-lg font-bold text-teal-600">{creator.totalEarnings}</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Eye className="h-3 w-3 mr-1" />
            View Profile
          </Button>
          <Button size="sm" className="flex-1 bg-teal-600 hover:bg-teal-700 text-xs">
            Message
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Creators = () => {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              Creator Performance
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-5 w-5 text-slate-400 ml-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Monitor and analyze your top-performing creators across all campaigns</p>
                </TooltipContent>
              </Tooltip>
            </h1>
            <p className="text-slate-600 mt-1">Monitor and analyze your top-performing creators</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Zap className="h-3 w-3 mr-1" />
              Live Metrics
            </Badge>
            <Button variant="outline">Find Creators</Button>
          </div>
        </div>

        {/* Creator Performance Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
            Top Performers
          </h2>
          
          {/* Enhanced Creator Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creatorsData.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
            Summary Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Top Performer
                </CardTitle>
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">Alex Thompson</div>
                <p className="text-xs text-slate-600 mt-1">7.3% avg engagement • $0.08 CPE</p>
                <Badge variant="secondary" className="mt-2 text-xs bg-yellow-50 text-yellow-800">
                  ⭐ 5.0 Rating
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Reach
                </CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">1.2M</div>
                <p className="text-xs text-slate-600 mt-1">Combined follower count</p>
                <Badge variant="secondary" className="mt-2 text-xs bg-blue-50 text-blue-800">
                  +15% this month
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Avg CPE
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">$0.11</div>
                <p className="text-xs text-slate-600 mt-1">Cost per engagement</p>
                <Badge variant="secondary" className="mt-2 text-xs bg-green-50 text-green-800">
                  -8% vs last month
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Creators;
