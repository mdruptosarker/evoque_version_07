import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Clock, X, ArrowRight, Truck, Eye, CheckCircle2 } from 'lucide-react';
import { PromotionOffer } from '../../types';

interface PromoBannerModalProps {
  onNavigate: (page: string) => void;
}

export const PromoBannerModal: React.FC<PromoBannerModalProps> = ({ onNavigate }) => {
  const { promotions } = useStore();
  
  // Find the top active promotion with showFloatingBanner enabled
  const activePromo: PromotionOffer | undefined = promotions.find(p => 
    p.active && 
    p.showFloatingBanner && 
    new Date(p.endDate) >= new Date()
  );

  const [isDismissed, setIsDismissed] = useState(false);
  const [isModalExpanded, setIsModalExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  // Calculate live ticking countdown timer every second
  useEffect(() => {
    if (!activePromo) return;

    const calculateTime = () => {
      const difference = new Date(activePromo.endDate).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activePromo]);

  // If no active promotion or dismissed in current session, don't show
  if (!activePromo || isDismissed) {
    return null;
  }

  const handleActionClick = () => {
    setIsModalExpanded(false);
    if (activePromo.ctaLink) {
      onNavigate(activePromo.ctaLink);
    } else {
      onNavigate('products');
    }
  };

  return (
    <>
      {/* 1. Subtle, Non-Disturbing Floating Luxury Pill / Card (Bottom Right on Desktop, Bottom Center on Mobile) */}
      <aside 
        aria-label="Promotional Announcement"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-fade-in"
      >
        <div className="bg-neutral-900/95 backdrop-blur-md text-white p-4 rounded-2xl border border-neutral-700/80 shadow-2xl transition-all hover:scale-[1.01]">
          
          <div className="flex items-start justify-between gap-3">
            
            {/* Thumbnail or Badge Icon */}
            <div 
              onClick={() => setIsModalExpanded(true)}
              className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 shrink-0 overflow-hidden cursor-pointer flex items-center justify-center shadow-xs"
            >
              {activePromo.bannerImage ? (
                <img 
                  src={activePromo.bannerImage} 
                  alt={activePromo.title} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform" 
                />
              ) : (
                <Sparkles className="w-5 h-5 text-amber-400" />
              )}
            </div>

            {/* Content & Live Countdown */}
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsModalExpanded(true)}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activePromo.type === 'delivery_offer' ? '🚚 Free Delivery' : '✨ Special Drop'}
                </span>
                {activePromo.freeDeliveryTarget && (
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {activePromo.freeDeliveryTarget}
                  </span>
                )}
              </div>

              <h4 className="font-serif font-bold text-xs sm:text-sm text-white truncate">
                {activePromo.title}
              </h4>

              {/* Countdown Clock Display */}
              {timeLeft && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 mt-1">
                  <Clock className="w-3 h-3 animate-pulse" />
                  <span>
                    {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              )}
            </div>

            {/* Close / Dismiss Button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
              title="Dismiss announcement"
              aria-label="Close promotion banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Row */}
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between gap-2">
            <button
              onClick={() => setIsModalExpanded(true)}
              className="text-[11px] font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            <button
              onClick={handleActionClick}
              className="px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>{activePromo.ctaText || 'Shop Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </aside>

      {/* 2. Expanded Luxury Promo Modal for full high-res banner preview & offer details */}
      {isModalExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div 
            className="fixed inset-0"
            onClick={() => setIsModalExpanded(false)}
          />

          <div className="relative bg-neutral-900 text-white w-full max-w-lg rounded-3xl border border-neutral-700 shadow-2xl overflow-hidden z-10 animate-scale-up">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalExpanded(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-res Banner Image */}
            {activePromo.bannerImage && (
              <div className="aspect-[16/9] w-full relative bg-neutral-950 overflow-hidden">
                <img 
                  src={activePromo.bannerImage} 
                  alt={activePromo.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {activePromo.type === 'delivery_offer' ? '🚚 Exclusive Delivery Offer' : '✨ Limited Capsule Teaser'}
                  </span>
                  {activePromo.freeDeliveryTarget && (
                    <span className="text-xs text-neutral-400 font-mono font-semibold">
                      {activePromo.freeDeliveryTarget} DIVISION
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-extrabold text-white leading-snug">
                  {activePromo.title}
                </h3>

                {activePromo.subtitle && (
                  <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
                    {activePromo.subtitle}
                  </p>
                )}
              </div>

              {/* Big Luxury Countdown Clock */}
              {timeLeft && (
                <div className="p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800 text-center space-y-2">
                  <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Offer Closes In</span>
                  </span>

                  <div className="grid grid-cols-4 gap-2 pt-1 font-mono">
                    <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800">
                      <span className="text-2xl font-bold text-white block">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="text-[10px] text-neutral-500 uppercase">Days</span>
                    </div>
                    <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800">
                      <span className="text-2xl font-bold text-white block">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-[10px] text-neutral-500 uppercase">Hours</span>
                    </div>
                    <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800">
                      <span className="text-2xl font-bold text-white block">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-[10px] text-neutral-500 uppercase">Mins</span>
                    </div>
                    <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800">
                      <span className="text-2xl font-bold text-amber-400 block">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-[10px] text-neutral-500 uppercase">Secs</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Benefit Highlight */}
              {activePromo.type === 'delivery_offer' && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    No coupon code required! When you enter your shipping address during checkout, the ৳120 delivery charge will automatically be reduced to <strong>৳0 Free Delivery</strong>.
                  </span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalExpanded(false)}
                  className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  Dismiss
                </button>

                <button
                  onClick={handleActionClick}
                  className="flex-1 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{activePromo.ctaText || 'Shop Collection'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
