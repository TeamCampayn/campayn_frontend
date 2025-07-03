
import { Linkedin, Twitter, Github } from 'lucide-react';

export const AboutTeam = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      bio: "Former creator economy executive with 10+ years building platforms that empower creators.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Tech visionary who previously scaled platforms to millions of users at leading tech companies.",
      social: {
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Priya Patel",
      role: "Head of Creator Relations",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Creator advocate with deep understanding of influencer marketing and community building.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Alex Kim",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Product strategist focused on creating intuitive experiences that creators and brands love.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meet Our Team
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate individuals working tirelessly to revolutionize the creator economy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group text-center"
            >
              <div className="relative mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-2xl mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-purple-600 font-medium mb-4">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{member.bio}</p>

              <div className="flex justify-center space-x-3">
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                )}
                {member.social.twitter && (
                  <a
                    href={member.social.twitter}
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
                  >
                    <Twitter className="w-4 h-4 text-white" />
                  </a>
                )}
                {member.social.github && (
                  <a
                    href={member.social.github}
                    className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
                  >
                    <Github className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
