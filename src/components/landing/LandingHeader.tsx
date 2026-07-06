import { useState, useEffect } from 'react';
import { Sparkle, Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PillButton } from './pill-button';

const LINKS = [
  { label: 'Brands', path: '/' },
  { label: 'Creators', path: '/creators' },
  { label: 'About Us', path: '/about' },
];

export const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8 bg-background/80 backdrop-blur-md border-b border-foreground/10 rounded-b-2xl md:rounded-full md:mt-4 md:border md:shadow-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-tight text-foreground">Campayn</span>
          <Sparkle className="size-4 fill-blue text-blue" />
        </Link>

        {/* Center Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-sm font-semibold uppercase tracking-wider text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right buttons */}
        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <>
              <Link to="/dashboard">
                <button className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:text-blue transition-colors px-4 py-2">
                  <User className="h-4 w-4" />
                  Dashboard
                </button>
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:text-red-500 transition-colors px-4 py-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-xs font-semibold uppercase tracking-wider text-foreground/70 hover:text-foreground transition-colors px-4 py-2">
                Login
              </Link>
              <PillButton variant="ink" icon={false} href="/auth?mode=signup" className="px-5 py-2">
                Get Started
              </PillButton>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-foreground/10 p-5 flex flex-col gap-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-semibold uppercase tracking-wider text-foreground/80 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-foreground/10 my-1" />
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <button className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground w-full py-2">
                    <User className="h-4 w-4" />
                    Dashboard
                  </button>
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground w-full py-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="text-xs font-semibold uppercase tracking-wider text-foreground/80 py-2">
                  Login
                </Link>
                <PillButton variant="ink" icon={false} href="/auth?mode=signup" className="w-full text-center py-2.5">
                  Get Started
                </PillButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
