
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Camera, Image, Plus } from "lucide-react";

const ContentTabPanel = () => {
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [addCallToAction, setAddCallToAction] = useState(false);

  const toggleContent = (contentType: string) => {
    setSelectedContent(prev => 
      prev.includes(contentType) 
        ? prev.filter(item => item !== contentType)
        : [...prev, contentType]
    );
  };

  const contentOptions = [
    {
      id: "reel",
      icon: Video,
      title: "30-Second Reel",
      description: "Short-form video content",
      hasCallToAction: true
    },
    {
      id: "story",
      icon: Camera,
      title: "Video Story",
      description: "Instagram story format"
    },
    {
      id: "post",
      icon: Image,
      title: "Static Post",
      description: "Image-based content"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Content Requirements</h2>
      
      <Tabs defaultValue="content-posting" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="content-posting">Content + Instagram Posting</TabsTrigger>
          <TabsTrigger value="content-only">Content Only</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content-posting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedContent.includes(option.id);
              
              return (
                <div
                  key={option.id}
                  onClick={() => toggleContent(option.id)}
                  className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    hover:-translate-y-1 hover:shadow-md
                    ${isSelected 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-slate-200 bg-white hover:border-slate-300"
                    }
                  `}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-lg ${isSelected ? "bg-purple-100" : "bg-slate-100"}`}>
                      <Icon className={`h-6 w-6 ${isSelected ? "text-purple-600" : "text-slate-600"}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{option.title}</h3>
                      <p className="text-sm text-slate-500">{option.description}</p>
                    </div>
                    
                    {option.hasCallToAction && isSelected && (
                      <div className="mt-3 flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          id="call-to-action"
                          checked={addCallToAction}
                          onChange={(e) => setAddCallToAction(e.target.checked)}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="call-to-action" className="text-slate-700">
                          Add call-to-action
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="content-only" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedContent.includes(option.id);
              
              return (
                <div
                  key={option.id}
                  onClick={() => toggleContent(option.id)}
                  className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    hover:-translate-y-1 hover:shadow-md
                    ${isSelected 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-slate-200 bg-white hover:border-slate-300"
                    }
                  `}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-lg ${isSelected ? "bg-purple-100" : "bg-slate-100"}`}>
                      <Icon className={`h-6 w-6 ${isSelected ? "text-purple-600" : "text-slate-600"}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{option.title}</h3>
                      <p className="text-sm text-slate-500">{option.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentTabPanel;
