import React from 'react';
import { HeroBanner } from '../components/storefront/HeroBanner';
import { ProductCard } from '../components/storefront/ProductCard';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw } from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface HomePageProps {
  setActivePage: (page: string) => void;
  onViewProductDetails: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActivePage, onViewProductDetails }) => {
  const { products, categories, setSelectedCategorySlug } = useStore();

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = products.slice(0, 4);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActivePage('products');
  };

  return (
    <div className="space-y-20 pb-20">
      <SEO 
        title="EVOQUE — High-Fashion Minimalist Essentials"
        description="Discover EVOQUE's luxury architectural clothing collection. Tailored Italian wool coats, Mongolian cashmere, and heavy cotton tees. Cash on Delivery across Bangladesh."
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "EVOQUE",
          "url": window.location.origin,
          "logo": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+880 1603642630",
            "contactType": "customer service",
            "email": "evoque.hq@gmail.com",
            "areaServed": "BD",
            "availableLanguage": ["en", "bn"]
          },
          "sameAs": [
            "https://facebook.com/share/1BScnoENGa",
            "https://instagram.com/evoque_bd?igsh=MTluaWJwZXp4eWFrdQ==",
            "https://www.youtube.com/channel/UCoLywaa4fLidv-AZEN4GJiQ"
          ]
        }}
      />

      {/* Hero Header Section under Navbar per Section 3 */}
      <HeroBanner 
        onExploreClick={() => setActivePage('products')}
        onCategoryClick={handleCategoryClick}
      />

      {/* Featured Categories Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Curated Capsules
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => setActivePage('products')}
            className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1 group transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-neutral-900 shadow-sm hover:shadow-xl transition-all"
            >
              <img 
                src={cat.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'} 
                alt={cat.name} 
                className="w-full h-full object-cover object-center opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="font-serif text-lg font-bold tracking-wide group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {cat.description || 'Explore collection'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Luxury Essentials Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Signature Silhouettes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mt-1">
              Featured Pieces
            </h2>
          </div>
          <button
            onClick={() => setActivePage('products')}
            className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1 group transition-colors"
          >
            <span>Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewDetails={onViewProductDetails} 
            />
          ))}
        </div>
      </section>

      {/* Architectural Ethos Statement Banner */}
      <section className="bg-neutral-900 text-white py-20 px-4 sm:px-6 lg:px-8 my-12 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            "We do not design clothes to demand attention. We craft them to command respect."
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Every EVOQUE garment is engineered with strict adherence to architectural proportion, tactile comfort, and durability. By cutting out traditional retail middlemen, we deliver bespoke atelier quality directly to your doorstep with nationwide Cash on Delivery.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setActivePage('products')}
              className="px-8 py-3.5 bg-white text-neutral-950 font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-all shadow-lg inline-flex items-center gap-2"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Fresh Drops
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => setActivePage('products')}
            className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1 group transition-colors"
          >
            <span>View Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewDetails={onViewProductDetails} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};
