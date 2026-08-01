import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/storefront/ProductCard';
import { Product } from '../types';
import { Search as SearchIcon, X, SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface SearchPageProps {
  onViewProductDetails: (product: Product) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onViewProductDetails }) => {
  const { products, searchQuery, setSearchQuery } = useStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(30000);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Real-time filtering per Section 5: Name, Category, or Code/SKU
  const filteredResults = useMemo(() => {
    return products.filter(product => {
      // 1. Query match
      const queryClean = localQuery.trim().toLowerCase();
      const matchesQuery = !queryClean || (
        product.name.toLowerCase().includes(queryClean) ||
        product.category.toLowerCase().includes(queryClean) ||
        product.code.toLowerCase().includes(queryClean) ||
        product.description.toLowerCase().includes(queryClean)
      );

      // 2. Category match
      const matchesCategory = selectedCategory === 'all' || 
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      // 3. Stock match
      const matchesStock = !inStockOnly || product.stock > 0;

      // 4. Price match
      const matchesPrice = product.price <= maxPrice;

      return matchesQuery && matchesCategory && matchesStock && matchesPrice;
    });
  }, [products, localQuery, selectedCategory, inStockOnly, maxPrice]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['all', ...cats];
  }, [products]);

  return (
    <div className="space-y-10 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <SEO 
        title="Search Catalog | EVOQUE"
        description="Search EVOQUE's luxury minimalist clothing collection by garment name, category, or SKU."
        ogType="website"
      />

      {/* Header & Instant Search Bar */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-200/60 border border-neutral-300 text-xs font-semibold uppercase tracking-wider text-neutral-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Real-time Catalog Search</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">
          Search the Collection
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto">
          Instantly filter garments by name, style category, or unique product code (SKU).
        </p>

        {/* Large Interactive Search Box */}
        <div className="relative max-w-2xl mx-auto shadow-xl rounded-2xl overflow-hidden border border-neutral-300 bg-white">
          <SearchIcon className="w-6 h-6 text-neutral-400 absolute left-5 top-5" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder="Search by product name, category (e.g. Knitwear), or SKU (e.g. EVQ-OW-001)..."
            className="w-full pl-14 pr-12 py-5 text-base sm:text-lg font-medium text-neutral-900 focus:outline-none placeholder:text-neutral-400 bg-transparent"
            autoFocus
          />
          {localQuery && (
            <button
              onClick={() => {
                setLocalQuery('');
                setSearchQuery('');
              }}
              className="absolute right-4 top-5 p-1 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Refine Search Results</span>
          </div>
          <span className="text-xs font-mono font-semibold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">
            {filteredResults.length} Garments Found
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-black capitalize"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between items-baseline text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              <span>Max Price</span>
              <span className="font-mono text-neutral-900 font-bold">৳{(maxPrice || 0).toLocaleString()} BDT</span>
            </div>
            <input
              type="range"
              min={3000}
              max={30000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
          </div>

          {/* Stock Toggle */}
          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-black border-neutral-300"
              />
              <span>Hide Out of Stock Items</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div>
        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-16 text-center space-y-4 shadow-xs">
            <PackageX className="w-12 h-12 text-neutral-300 mx-auto stroke-1" />
            <h3 className="font-serif font-bold text-xl text-neutral-800">No matching garments found</h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              No products matched your search "{localQuery}". Try searching for broader terms like "Wool", "Tee", or "Coat".
            </p>
            <button
              onClick={() => {
                setLocalQuery('');
                setSearchQuery('');
                setSelectedCategory('all');
                setInStockOnly(false);
              }}
              className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition-all"
            >
              Clear Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredResults.map(product => (
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
