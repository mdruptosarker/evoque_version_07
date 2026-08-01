import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onCategoryClick: (slug: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onCategoryClick }) => {
  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white min-h-[72vh] flex items-center border-b border-neutral-800">
      {/* Background Architectural Grid / Image Parallax Effect */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80" 
          alt="EVOQUE Lifestyle Campaign" 
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/80 to-transparent" />
      </div>

      {/* Subtle Radial Gradient Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl space-y-8">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs tracking-widest uppercase font-medium text-neutral-200 shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Autumn / Winter Luxury Capsule 2026</span>
          </div>

          {/* Main Statement Title */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Architectural Form. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500 font-light italic">
              Uncompromised Comfort.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
            EVOQUE defines modern luxury clothing through disciplined silhouettes, premium Italian virgin wool, Mongolian cashmere, and heavyweight organic cottons. Engineered for the discerning individual.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="px-8 py-4 bg-white text-neutral-950 font-semibold text-sm tracking-wider uppercase rounded-xl hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onCategoryClick('outerwear')}
              className="px-8 py-4 bg-transparent border border-neutral-600 text-white font-medium text-sm tracking-wider uppercase rounded-xl hover:bg-white/10 hover:border-white transition-all text-center"
            >
              View Tailored Outerwear
            </button>
          </div>

          {/* Value Propositions / Bangladesh COD feature highlight */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-800/80 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white">Cash on Delivery</p>
                <p className="text-[11px] text-neutral-400">Flat ৳120 BDT All Bangladesh</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-800/80 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white">Official Invoice</p>
                <p className="text-[11px] text-neutral-400">Instant PDF generation</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-800/80 flex items-center justify-center text-sky-400 shrink-0">
                <span className="font-serif font-bold text-sm">100%</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white">Premium Quality</p>
                <p className="text-[11px] text-neutral-400">Virgin wool & Mongolian cashmere</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
