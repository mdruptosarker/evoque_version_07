import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User as UserIcon, Menu, Mail, ShieldAlert, Sparkles, Clock, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { 
    cart, 
    setIsCartOpen, 
    setIsMobileSidebarOpen, 
    currentUser, 
    emails, 
    setIsEmailInboxOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    promotions
  } = useStore();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Active promotion for top notification bar
  const headerPromo = promotions.find(p => 
    p.active && 
    p.showOnHeader && 
    new Date(p.endDate) >= new Date()
  );

  const [headerCountdown, setHeaderCountdown] = useState<string>('');

  useEffect(() => {
    if (!headerPromo) {
      setHeaderCountdown('');
      return;
    }

    const updateCountdown = () => {
      const diff = new Date(headerPromo.endDate).getTime() - Date.now();
      if (diff <= 0) {
        setHeaderCountdown('');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setHeaderCountdown(`${days}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [headerPromo]);

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="font-medium tracking-wider uppercase text-[#FAF9F6] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            EVOQUE Atelier BD
          </span>
          
          <span className="text-neutral-600 hidden sm:inline">|</span>

          {headerPromo ? (
            <div className="flex items-center gap-2 text-neutral-200">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                {headerPromo.title}
              </span>
              {headerCountdown && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[11px] font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 animate-pulse" />
                  {headerCountdown}
                </span>
              )}
            </div>
          ) : (
            <span className="text-neutral-400 hidden sm:inline">Flat ৳120 BDT COD Delivery Anywhere in Bangladesh</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsEmailInboxOpen(true)}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors py-0.5 px-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
            title="View client notification logs (Orders, Shipping alerts)"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Email Log</span>
            {emails.length > 0 && (
              <span className="bg-amber-500 text-black font-bold px-1.5 py-0.2 text-[10px] rounded-full">
                {emails.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Navbar - Pure White background per Section 2 & 3 */}
      <header className="bg-white sticky top-0 z-40 border-b border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left: Hamburger (Mobile) + Brand Name EVOQUE & Logo Slot */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-neutral-800 hover:text-black rounded-xl hover:bg-neutral-100 transition-colors"
              aria-label="Open Navigation Sidebar"
              title="Open Navigation Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('home')}>
              {/* Brand Logo */}
              <div 
                className="w-10 h-10 bg-black text-white flex items-center justify-center overflow-hidden shadow-xs transition-transform hover:scale-105"
                style={{ borderRadius: '25%' }}
                title="EVOQUE Logo"
              >
                <img 
                  src="/logo.png" 
                  alt="EVOQUE Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-neutral-900 uppercase">
                EVOQUE
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links (Home, All Products, Shipping) */}
          <nav className="hidden lg:flex items-center justify-center gap-8 text-sm uppercase tracking-widest font-medium text-neutral-600">
            <button 
              onClick={() => setActivePage('home')}
              className={`transition-colors hover:text-black ${activePage === 'home' ? 'text-black font-semibold underline underline-offset-8 decoration-1' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => setActivePage('products')}
              className={`transition-colors hover:text-black ${activePage === 'products' ? 'text-black font-semibold underline underline-offset-8 decoration-1' : ''}`}
            >
              All Products
            </button>
            <button 
              onClick={() => setActivePage('shipping')}
              className={`transition-colors hover:text-black ${activePage === 'shipping' ? 'text-black font-semibold underline underline-offset-8 decoration-1' : ''}`}
            >
              Shipping
            </button>
          </nav>

          {/* Right Side: Exact order per Section 3: Search -> Cart -> Profile */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1">
            {/* 1. Search Icon -> Navigates to dedicated Search Page */}
            <button
              onClick={() => setActivePage('search')}
              className={`p-2 rounded-full transition-colors ${activePage === 'search' ? 'bg-neutral-100 text-black' : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'}`}
              aria-label="Search"
              title="Search Collection"
            >
              <Search className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>

            {/* 2. Cart Icon -> Opens Cart Drawer */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-full transition-colors relative"
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-900 text-white font-sans text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 3. Profile Icon -> Goes to User Profile/Account Page or Login Modal (Hidden on mobile per user instruction, available in Sidebar) */}
            <button
              onClick={() => {
                if (currentUser) {
                  setActivePage('profile');
                } else {
                  setIsAuthModalOpen(true);
                  setAuthModalMode('login');
                }
              }}
              className={`p-2 rounded-full transition-colors hidden sm:flex items-center gap-1.5 ${activePage === 'profile' ? 'bg-neutral-100 text-black' : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'}`}
              aria-label="User Profile"
              title={currentUser ? `Profile (${currentUser.name})` : 'Login / Account'}
            >
              <UserIcon className="w-5 h-5 sm:w-5 sm:h-5" />
              {currentUser && (
                <span className="hidden md:inline text-xs font-medium tracking-wide text-neutral-800 max-w-[80px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>
    </>
  );
};
