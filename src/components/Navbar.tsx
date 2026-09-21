import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  Home, 
  Layers, 
  Info, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, savedCount }) => {
  const { user, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'houses', label: 'Houses', icon: Building2 },
    { id: 'land', label: 'Land', icon: Layers },
    { id: 'prediction', label: 'AI Price Prediction', icon: Sparkles, badge: 'ML' },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <button 
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group transition-transform focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-forest-900 flex items-center justify-center text-white shadow-sm ring-1 ring-amber-400/40">
              <Building2 className="w-6 h-6 text-amber-300 transition-transform group-hover:scale-105" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-gray-900 font-serif">
                  AVENZA
                </span>
                <span className="text-xl font-semibold tracking-tight text-emerald-700 font-serif">
                  PROPERTY
                </span>
              </div>
              <p className="text-[11px] font-medium tracking-wide text-gray-500 uppercase">
                Premium Properties Across Tamil Nadu
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-emerald-900 bg-emerald-50/90 font-semibold shadow-xs'
                      : 'text-gray-700 hover:text-emerald-800 hover:bg-gray-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-gray-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300/60 rounded-md">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-emerald-300 transition-all text-left shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden xl:block">
                    <div className="text-xs font-bold text-gray-900 leading-tight">
                      {user.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium capitalize flex items-center gap-1">
                      {user.accountType === 'host' ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-amber-500" />
                          <span>Verified Host</span>
                        </>
                      ) : (
                        <span>Member</span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-gray-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>

                    {user.accountType === 'host' ? (
                      <button
                        id="dropdown-host-dashboard-btn"
                        onClick={() => {
                          handleNavClick('host-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                        <span>Host Dashboard</span>
                      </button>
                    ) : (
                      <button
                        id="dropdown-user-dashboard-btn"
                        onClick={() => {
                          handleNavClick('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                        <span>My Dashboard</span>
                      </button>
                    )}

                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-800 transition-colors"
                >
                  Login
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-all ring-1 ring-emerald-900/20"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <button
                onClick={() => handleNavClick(user.accountType === 'host' ? 'host-dashboard' : 'dashboard')}
                className="p-2 rounded-lg text-emerald-800 bg-emerald-50"
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:text-emerald-800 hover:bg-gray-50 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-gray-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-md">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-emerald-700 capitalize font-medium">{user.accountType}</p>
                </div>
                {user.accountType === 'host' ? (
                  <button
                    onClick={() => handleNavClick('host-dashboard')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-800"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Host Dashboard</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-800"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>User Dashboard</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-800 rounded-xl hover:bg-emerald-900 text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
