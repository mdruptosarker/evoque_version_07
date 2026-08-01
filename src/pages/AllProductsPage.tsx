import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/storefront/ProductCard';
import { CategoryBar } from '../components/storefront/CategoryBar';
import { Product } from '../types';
import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface AllProductsPageProps {
  onViewProductDetails: (product: Product) => void;
}

export const AllProductsPage: React.FC<AllProductsPageProps> = ({ onViewProductDetails }) => {
  const { products, selectedCategorySlug, setSelectedCategorySlug } = useStore();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Filter by Category
    if (selectedCategorySlug && selectedCategorySlug !== 'all') {
      result = result.filter(p => 
        p.category.toLowerCase() === selectedCategorySlug.toLowerCase() ||
        p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategorySlug
      );
    }

    // 2. Filter by In Stock Only
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // 3. Sort
    return [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategorySlug, inStockOnly, sortBy]);

  const currentCategoryName = useMemo(() => {
    if (selectedCategorySlug === 'all') return 'All Collection';
    return selectedCategorySlug.charAt(0).toUpperCase() + selectedCategorySlug.slice(1);
  }, [selectedCategorySlug]);

  return (
    <div className="space-y-8 pb-24">
      <SEO 
        title={`${currentCategoryName} | EVOQUE Collection`}
        description={`Explore EVOQUE's luxury ${currentCategoryName} selection. Crafted from premium materials with nationwide Cash on Delivery.`}
        ogType="website"
      />

      {/* Header Banner */}
      <div className="bg-neutral-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catalog & Archive</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight capitalize">
              {currentCategoryName}
            </h1>
            <p className="text-sm text-neutral-400 max-w-xl">
              Showing all items in {currentCategoryName.toLowerCase()}. Every piece is designed for longevity, structured fit, and premium tactile comfort.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
              {filteredProducts.length} Product(s) Available
            </span>
          </div>
        </div>
      </div>

      {/* Prominently Displayed Category Bar below Top Area per Section 5 */}
      <CategoryBar 
        selectedCategory={selectedCategorySlug}
        onSelectCategory={(slug) => setSelectedCategorySlug(slug)}
      />

      {/* Filters & Controls Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={inStockOnly} 
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-black border-neutral-300"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hidden sm:inline flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High (৳)</option>
              <option value="price-desc">Price: High to Low (৳)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-16 text-center space-y-4 shadow-xs">
            <Filter className="w-12 h-12 text-neutral-300 mx-auto stroke-1" />
            <h3 className="font-serif font-bold text-xl text-neutral-800">No matching garments found</h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              We couldn't find any products in this specific category or stock filter. Try switching categories or clearing your active filters.
            </p>
            <button
              onClick={() => { setSelectedCategorySlug('all'); setInStockOnly(false); }}
              className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={onViewProductDetails} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
