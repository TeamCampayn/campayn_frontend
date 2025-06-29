
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#brands" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Brands</a>
            <a href="#creators" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Creators</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About Us</a>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Login
            </button>
          </nav>

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
              <a href="#brands" className="text-gray-700 hover:text-blue-600 font-medium">Brands</a>
              <a href="#creators" className="text-gray-700 hover:text-blue-600 font-medium">Creators</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About Us</a>
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
