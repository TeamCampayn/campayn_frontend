
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useCampaignForm } from "@/contexts/CampaignFormContext";

const CategoryCarousel = () => {
  const { formData, updateFormData } = useCampaignForm();
  const categories = [
    {
      id: "fashion",
      title: "Fashion",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop"
    },
    {
      id: "lifestyle",
      title: "Lifestyle", 
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop"
    },
    {
      id: "travel",
      title: "Travel",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&h=200&fit=crop"
    },
    {
      id: "food",
      title: "Food & Beverage",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop"
    },
    {
      id: "fitness",
      title: "Fitness & Health",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=200&fit=crop"
    },
    {
      id: "beauty",
      title: "Beauty & Skincare",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Creator Categories</h2>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => (
            <CarouselItem key={category.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
              <div className="relative group overflow-hidden rounded-xl border border-slate-200 hover:border-purple-300 transition-all duration-200 hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium mb-2">{category.title}</h3>
                  <Button 
                    size="sm" 
                    onClick={() => updateFormData({ category: category.id })}
                    className={`text-xs px-3 py-1 h-auto ${
                      formData.category === category.id 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-white text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {formData.category === category.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
