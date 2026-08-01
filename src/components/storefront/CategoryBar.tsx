import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelectCategory }) => {
  const { categories, products } = useStore();

  // Calculate count per category
  const getCount = (slug: string) => {
    if (slug === 'all') return products.length;
    return products.filter(p => p.category.toLowerCase() === slug.toLowerCase() || p.category.toLowerCase().replace(/\s+/g, '-') === slug).length;
  };

  return (
    <div className="bg-white border-y border-neutral-200/80 py-4 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-neutral-400 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Categories:</span>
        </div>

        {/* Horizontal scrollable category bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white shadow-sm scale-102'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-black'
            }`}
          >
            <span>All Collection</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
              {getCount('all')}
            </span>
          </button>

          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.slug.toLowerCase() || selectedCategory.toLowerCase() === cat.name.toLowerCase();
            const count = getCount(cat.slug) || getCount(cat.name);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm scale-102'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
