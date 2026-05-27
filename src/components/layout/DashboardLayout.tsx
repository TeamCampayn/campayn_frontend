import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { 
  Home, 
  Target, 
  HelpCircle, 
  LogOut,
  User,
  Users,
  BarChart3
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, brand, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Target, label: "My Campaigns", path: "/dashboard/campaigns" },
    { icon: Users, label: "Explore Creators", path: "/dashboard/explore-creators" },
    { icon: BarChart3, label: "Analytics & Reports", path: "/dashboard/analytics" },
    { icon: HelpCircle, label: "Support", path: "/dashboard/support" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/20 via-slate-50/50 to-purple-50/30 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/70 backdrop-blur-md border-r border-gray-200/50 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.015)]">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm bg-white border border-gray-200/30">
            <img 
              src="/lovable-uploads/50197cd5-740c-4048-b1cc-36754841abcb.png" 
              alt="Campayn Logo" 
              className="w-8 h-8 rounded-lg object-contain"
            />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Campayn
            </span>
            <div className="text-[10px] text-gray-400 font-medium">Influencer Portal</div>
          </div>
        </div>
        
        <nav className="px-4 pb-4 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl mb-2 transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-indigo-700 font-medium border border-indigo-200/20 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 mr-3 transition-colors ${
                  isActive(item.path) ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white/60 backdrop-blur-md border-b border-gray-200/40 px-8 py-4 shadow-[0_2px_18px_rgba(0,0,0,0.01)] flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                {brand?.brand_name || 'Brand Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100/60 border border-gray-200/20 px-3 py-1.5 rounded-lg">
                <User className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium">{user?.email}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="flex items-center border-gray-200/80 hover:bg-gray-50 text-gray-600 text-xs px-3 py-1.5 h-auto rounded-lg"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
