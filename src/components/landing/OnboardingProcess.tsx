
import { useState, useEffect } from 'react';
import { DollarSign, Target, Users, Package, TrendingUp } from 'lucide-react';

export const OnboardingProcess = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Seamless Campaign Creation
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our intuitive 5-step process gets your influencer campaign live in minutes, 
            not hours. Watch how simple it is to connect with your perfect creators.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps Navigation */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    activeStep === index
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeStep === index
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div className={`text-2xl font-bold transition-all duration-300 ${
                      activeStep === index ? 'text-blue-600' : 'text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Animation */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center transition-all duration-500 ${
                    activeStep === 0 ? 'scale-110' : 'scale-100'
                  }`}>
                    {React.createElement(steps[activeStep].icon, { className: "w-10 h-10 text-white" })}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{steps[activeStep].title}</h4>
                  <p className="text-gray-600 mb-4">{steps[activeStep].visual}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
