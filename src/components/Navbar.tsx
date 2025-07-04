
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

export const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/50197cd5-740c-4048-b1cc-36754841abcb.png" 
                alt="Campayn Logo" 
                className="w-10 h-10 rounded-xl object-contain"
              />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Campayn
              </span>
              <div className="text-xs text-gray-500 font-medium">Creator Platform</div>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/creators" 
              className={`font-medium transition-colors ${
                isActive('/creators') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Creators
            </Link>
            <Link 
              to="/create-campaign" 
              className={`font-medium transition-colors ${
                isActive('/create-campaign') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Create Campaign
            </Link>
          </div>
          
          {/* CTA Button */}
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};
