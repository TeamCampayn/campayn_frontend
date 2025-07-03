
import { Shield, Star, Handshake, Rocket } from 'lucide-react';

export const AboutValues = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We believe in building lasting relationships through honest communication and transparent processes.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from product development to customer support.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Handshake,
      title: "Collaboration",
      description: "Success comes from working together. We foster partnerships that benefit everyone involved.",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "We embrace change and continuously evolve to stay ahead in the dynamic creator economy.",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section className="py-20 relative">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-300/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Values
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These core values guide everything we do and shape the culture we're building at Campayn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
