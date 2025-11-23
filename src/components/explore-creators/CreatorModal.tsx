
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Instagram, Youtube, MapPin, Users, TrendingUp, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface CreatorModalProps {
  creator: any;
  isOpen: boolean;
  onClose: () => void;
}

const CreatorModal = ({ creator, isOpen, onClose }: CreatorModalProps) => {
  if (!creator) return null;

  const followerGrowthData = [
    { month: 'Jan', followers: 45000 },
    { month: 'Feb', followers: 47000 },
    { month: 'Mar', followers: 48500 },
    { month: 'Apr', followers: 52000 },
    { month: 'May', followers: 54000 },
    { month: 'Jun', followers: 58000 },
  ];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-5 w-5 fill-yellow-400/50 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-gray-300" />
        ))}
        <span className="text-lg font-semibold text-slate-700 ml-2">{rating}</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Creator Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {creator.avatar}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{creator.name}</h2>
              <p className="text-lg text-slate-600">{creator.handle}</p>
              <div className="flex items-center mt-2 space-x-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">{creator.location}</span>
              </div>
              
              <div className="flex items-center mt-3">
                {renderStars(creator.rating)}
                <span className="text-sm text-slate-500 ml-2">(127 reviews)</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {creator.niche.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="bg-primary hover:bg-primary-600 text-white px-8">
              Invite to Campaign
            </Button>
          </div>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">{creator.bio}</p>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{creator.followers}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{creator.engagementRate}</div>
                <p className="text-xs text-muted-foreground">Above industry average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">24.5K</div>
                <p className="text-xs text-muted-foreground">Per post</p>
              </CardContent>
            </Card>
          </div>

          {/* Follower Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Follower Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={followerGrowthData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Line 
                      type="monotone" 
                      dataKey="followers" 
                      stroke="#5B73F5" 
                      strokeWidth={3}
                      dot={{ fill: '#5B73F5' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Content Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="bg-slate-100 rounded-lg p-4 aspect-square flex flex-col justify-between">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-slate-500 text-center">
                        <div className="w-12 h-12 bg-slate-300 rounded-lg mx-auto mb-2"></div>
                        <span className="text-sm">Content Preview {index}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 mt-3">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        2.1K
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        89
                      </div>
                      <div className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1" />
                        45
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audience Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audience Age Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>18-24</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '35%'}}></div>
                      </div>
                      <span className="text-sm">35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>25-34</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>35-44</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '20%'}}></div>
                      </div>
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>United States</span>
                    <span className="font-semibold">42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>United Kingdom</span>
                    <span className="font-semibold">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Canada</span>
                    <span className="font-semibold">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Australia</span>
                    <span className="font-semibold">17%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorModal;
