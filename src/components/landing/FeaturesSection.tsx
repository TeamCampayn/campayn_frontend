
import { VerticalScrollCards } from './VerticalScrollCards';

export const FeaturesSection = () => {
  return (
    <div className="bg-white">
      {/* Section Heading */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Powerful Features
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to run successful creator campaigns, all in one platform.
        </p>
      </div>
      
      <VerticalScrollCards />
    </div>
  );
};
