
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const CreatorCarousel = () => {
  const creators = [
    {
      id: 1,
      username: "@fashionista_maya",
      followers: "125K",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      username: "@travel_with_raj",
      followers: "89K", 
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      username: "@lifestyle_priya",
      followers: "156K",
      avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      username: "@fitness_guru_sam",
      followers: "203K",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 5,
      username: "@beauty_secrets_ana",
      followers: "98K",
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Recently Selected Creators</h2>
      
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {creators.map((creator) => (
              <CarouselItem key={creator.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="text-center space-y-2 p-3">
                  <div className="relative mx-auto w-16 h-16">
                    <img 
                      src={creator.avatar} 
                      alt={creator.username}
                      className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900">{creator.username}</p>
                    <p className="text-xs text-slate-600">{creator.followers} followers</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </div>
  );
};

export default CreatorCarousel;
