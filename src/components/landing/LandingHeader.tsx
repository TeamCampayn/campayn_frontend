
import { useState } from 'react';
import { Menu, X, Home, Users, Info } from 'lucide-react';
import { MenuBar } from '../ui/glow-menu';

const menuItems = [
  {
    icon: Home,
    label: "Brands",
    href: "#brands",
    gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: Users,
    label: "Creators",
    href: "#creators",
    gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: Info,
    label: "About Us",
    href: "#about",
    gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
];

export const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Brands");

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    const href = menuItems.find(item => item.label === label)?.href;
    if (href) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Campayn
              </span>
              <div className="text-xs text-gray-500 font-medium">Influencer Platform</div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <MenuBar
              items={menuItems}
              activeItem={activeItem}
              onItemClick={handleItemClick}
              className="bg-white/80 backdrop-blur-md border border-gray-200/50"
            />
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Login
            </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item.label)}
                  className={`text-gray-700 hover:text-blue-600 font-medium text-left ${
                    activeItem === item.label ? 'text-blue-600' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium w-fit">
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
