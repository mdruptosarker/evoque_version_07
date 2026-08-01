import React from 'react';
import { Home, ShoppingBag, Truck, Mail, User, X, LogOut, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen, currentUser, logout, setIsAuthModalOpen, setAuthModalMode } = useStore();

  const handleNav = (page: string) => {
    setActivePage(page);
    setIsMobileSidebarOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'All Products', icon: ShoppingBag },
    { id: 'shipping', label: 'Shipping Information', icon: Truck },
    { id: 'contact', label: 'Contact', icon: Mail },
    // Profile is strictly ALWAYS the last item per Section 4
    { id: 'profile', label: 'Profile & Orders', icon: User }
  ];

  return (
    <>
      {/* Sidebar Backdrop - Available on all devices */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Slide-in Drawer for All Devices */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-80 bg-[#FAF9F6] border-r border-neutral-200 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Header */}
        <div>
          <div className="h-20 px-6 border-b border-neutral-200/80 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 bg-neutral-900 text-white flex items-center justify-center font-serif font-bold text-sm"
                style={{ borderRadius: '25%' }}
              >
                E
              </div>
              <span className="font-serif text-xl font-bold tracking-[0.2em] uppercase text-neutral-900">
                EVOQUE
              </span>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links in Exact Order per Section 4 */}
          <nav className="p-6 space-y-2">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-3">
              Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-neutral-900 text-white shadow-md font-semibold' 
                      : 'text-neutral-700 hover:bg-neutral-200/60 hover:text-black'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Info & Account Actions */}
        <div className="p-6 border-t border-neutral-200/80 bg-white/50">
          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-sm overflow-hidden border border-neutral-300">
                  {currentUser.profilePicture ? (
                    <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-900 truncate">{currentUser.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => { setActivePage('admin'); setIsMobileSidebarOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                )}
                <button
                  onClick={() => { logout(); setIsMobileSidebarOpen(false); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-medium hover:bg-neutral-100 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-neutral-600 px-1">Sign in to track orders and download PDF invoices.</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    setIsAuthModalOpen(true);
                    setAuthModalMode('login');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    setIsAuthModalOpen(true);
                    setAuthModalMode('signup');
                  }}
                  className="py-2.5 px-4 rounded-xl border border-neutral-300 bg-white text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-colors text-center"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
