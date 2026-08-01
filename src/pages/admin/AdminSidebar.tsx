import React from 'react';
import { BarChart3, Package, Layers, ShoppingCart, Users, Ticket, LogOut, ArrowLeft, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, onExitAdmin }) => {
  const { currentUser, logout } = useStore();

  const tabs = [
    { id: 'sales', label: 'Sales', fullLabel: 'Sales Information', icon: BarChart3 },
    { id: 'orders', label: 'Orders', fullLabel: 'Order Information', icon: ShoppingCart },
    { id: 'products', label: 'Products', fullLabel: 'Product List', icon: Package },
    { id: 'seo', label: 'SEO Engine', fullLabel: 'Autonomous SEO Engine', icon: Sparkles },
    { id: 'categories', label: 'Categories', fullLabel: 'Category Management', icon: Layers },
    { id: 'users', label: 'Users', fullLabel: 'User List', icon: Users },
    { id: 'coupons', label: 'Coupons', fullLabel: 'Coupon Management', icon: Ticket },
  ];

  return (
    <>
      {/* Mobile Top Header & Horizontal Scrollable Tabs (< lg) */}
      <div className="lg:hidden bg-neutral-900 text-neutral-300 border-b border-neutral-800 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between border-b border-neutral-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-500 text-black flex items-center justify-center font-serif font-bold text-xs rounded-lg shadow-xs">
              E
            </div>
            <div>
              <span className="font-serif text-base font-bold tracking-[0.15em] uppercase text-white">
                EVOQUE Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExitAdmin}
              className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Store</span>
            </button>
            <button
              onClick={() => { logout(); onExitAdmin(); }}
              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Persistent Vertical Sidebar (>= lg) */}
      <aside className="hidden lg:flex w-64 bg-neutral-900 text-neutral-300 flex-col justify-between shrink-0 border-r border-neutral-800">
        <div>
          {/* Header */}
          <div className="h-20 px-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-500 text-black flex items-center justify-center font-serif font-bold text-sm rounded-lg shadow-xs">
                E
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-[0.2em] uppercase text-white block">
                  EVOQUE
                </span>
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase">Executive Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="p-4 space-y-1.5">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-3 mb-2">
              Management Modules
            </p>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-xs transition-all ${
                    isActive 
                      ? 'bg-emerald-600 text-white font-bold shadow-md' 
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  <span>{tab.fullLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-800 space-y-3 bg-neutral-950/60">
          <div className="px-2">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Managing Director'}</p>
            <p className="text-[10px] text-neutral-500 truncate font-mono">{currentUser?.email || 'mdruptos@gmail.com'}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onExitAdmin}
              className="py-2 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="Return to storefront"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Store</span>
            </button>

            <button
              onClick={() => { logout(); onExitAdmin(); }}
              className="py-2 px-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
