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
  BarChart3,
  Menu,
  X,
  Wallet,
  Film,
  Sparkle
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, brand, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (brand && brand.onboarding_completed === false) {
      navigate('/onboarding', { replace: true });
    }
  }, [brand, navigate]);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Target, label: "My Campaigns", path: "/dashboard/campaigns" },
    { icon: Users, label: "Explore Creators", path: "/dashboard/explore-creators" },
    { icon: Film, label: "Asset Vault", path: "/dashboard/vault" },
    { icon: BarChart3, label: "Analytics & Reports", path: "/dashboard/analytics" },
    { icon: Wallet, label: "My Wallet", path: "/dashboard/wallet" },
    { icon: HelpCircle, label: "Support", path: "/dashboard/support" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderSidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-tight text-foreground">Campayn</span>
          <Sparkle className="size-4 fill-[#1ea0ff] text-[#1ea0ff]" />
        </div>
        
        {/* Mobile Close Button */}
        <button 
          className="md:hidden p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="px-4 pb-4 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-black text-white font-space font-bold rounded-full shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-black font-space font-medium rounded-full'
              } mb-1.5`}
            >
              <Icon className={`h-4 w-4 mr-3 transition-colors ${
                isActive(item.path) ? 'text-white' : 'text-zinc-400'
              }`} />
              <span className="text-xs uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f7] grain flex font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-zinc-200/80 flex-col">
        {renderSidebarContent()}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 md:hidden ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {renderSidebarContent()}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-zinc-200/80 px-4 md:px-8 py-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Menu Hamburger Button */}
              <button 
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 shadow-sm transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <h2 className="text-sm md:text-base font-bold font-space text-zinc-900 uppercase tracking-wider truncate max-w-[150px] sm:max-w-xs md:max-w-none">
                {brand?.brand_name || 'Brand Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-[10px] uppercase tracking-wider font-space font-semibold text-zinc-500 bg-white border border-zinc-200 px-3 py-1.5 rounded-full">
                <User className="h-3.5 w-3.5 text-zinc-400" />
                <span>{user?.email}</span>
              </div>
              
              <button 
                onClick={handleSignOut}
                className="btn-secondary-pill py-1.5 px-3.5"
              >
                <span className="flex items-center">
                  <LogOut className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                  Logout
                </span>
              </button>
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
