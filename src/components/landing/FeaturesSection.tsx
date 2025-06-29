
import { useEffect, useRef, useState } from 'react';
import { Brain, BarChart3, Zap, Shield, Globe, Heart } from 'lucide-react';

export const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matchmaking",
      description: "Our advanced AI analyzes creator content, audience demographics, and engagement patterns to find the perfect match for your brand.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track campaign performance with comprehensive metrics including reach, engagement, conversions, and ROI insights.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Streamline your campaign management with automated creator outreach, content approval, and payment processing.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Brand Safety First",
      description: "Advanced content screening and brand safety measures ensure your campaigns maintain the highest standards.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Global Creator Network",
      description: "Access creators from around the world with diverse audiences and content styles to match any campaign goal.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Heart,
      title: "Relationship Management",
      description: "Build lasting partnerships with creators through our comprehensive relationship management tools.",
      color: "from-pink-500 to-rose-500"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY;
      
      if (scrollY >= sectionTop - 200 && scrollY <= sectionTop + sectionHeight - 400) {
        const progress = (scrollY - sectionTop + 200) / (sectionHeight - 200);
        const newActiveFeature = Math.min(Math.floor(progress * features.length), features.length - 1);
        setActiveFeature(Math.max(0, newActiveFeature));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [features.length]);

  return (
    <section ref={sectionRef} className="relative py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Powerful Features for Modern Marketing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create, manage, and optimize successful influencer campaigns 
            with data-driven insights and automated workflows.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Sticky Feature Display */}
          <div className="lg:sticky lg:top-32">
            <div className="relative">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ${
                      activeFeature === index ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}
                  >
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                      <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                        <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${feature.color} opacity-20 animate-pulse`}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Placeholder for height */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 opacity-0">
                <div className="w-16 h-16 rounded-2xl bg-gray-200 mb-6"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-24 bg-gray-200 rounded mb-6"></div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    activeFeature === index ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                      <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
