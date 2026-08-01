import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/storefront/ProductCard';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, AlertCircle, ArrowLeft, CheckCircle2, Share2, Globe } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { productUrlService } from '../services/productUrlService';
import { ProductUrlWidget } from '../components/admin/ProductUrlWidget';
import { optimizeImageUrl } from '../utils/imageUtils';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onViewProductDetails: (product: Product) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product, onBack, onViewProductDetails }) => {
  const { products, addToCart } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Variant selections if dynamically available
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.variants?.size?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.variants?.color?.[0]);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  // Description formatting rule per Section 5: Bullet points vs Plain Paragraph
  const renderDescription = () => {
    const desc = product.description || '';
    const lines = desc.split('\n').map(l => l.trim()).filter(Boolean);
    const isBulleted = lines.some(l => l.startsWith('-') || l.startsWith('*') || l.startsWith('•'));

    if (isBulleted) {
      return (
        <ul className="list-disc list-outside pl-5 space-y-2 text-sm text-neutral-700 leading-relaxed font-normal">
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[-*•]\s*/, '');
            return <li key={idx} className="pl-1">{cleanLine}</li>;
          })}
        </ul>
      );
    } else {
      return (
        <p className="text-sm text-neutral-700 leading-relaxed font-normal">
          {desc}
        </p>
      );
    }
  };

  // Related Products per Section 5: same category first, fallback to in-stock items, exclude current
  const relatedProducts = useMemo(() => {
    const others = products.filter(p => p.id !== product.id && p.stock > 0);
    const sameCategory = others.filter(p => p.category.toLowerCase() === product.category.toLowerCase());
    const differentCategory = others.filter(p => p.category.toLowerCase() !== product.category.toLowerCase());
    return [...sameCategory, ...differentCategory].slice(0, 4);
  }, [products, product]);

  const handleColorSelect = (col: string) => {
    setSelectedColor(col);
    if (product.colorImages && product.colorImages[col]) {
      const colorImgUrl = product.colorImages[col];
      const foundIdx = product.images.findIndex(img => img === colorImgUrl);
      if (foundIdx !== -1) {
        setSelectedImageIndex(foundIdx);
      } else {
        // If not in gallery, add temporarily or force preview
        const newImages = [colorImgUrl, ...product.images];
        product.images = newImages;
        setSelectedImageIndex(0);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | EVOQUE`,
        text: `Check out ${product.name} at EVOQUE Bangladesh — BDT ${(product?.price || 0).toLocaleString()}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const currentSlug = product.slug || productUrlService.slugify(product.name);
  const canonicalUrl = product.permalink || productUrlService.buildPermalink(currentSlug);

  // Structured Product JSON-LD schema with permanent canonical URL
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": canonicalUrl,
    "name": product.name,
    "url": canonicalUrl,
    "image": product.images,
    "description": product.description,
    "sku": product.code,
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "BDT",
      "price": product.price,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "EVOQUE"
      }
    }
  };

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <SEO 
        title={`${product.name} | EVOQUE`}
        description={product.description.slice(0, 150)}
        ogImage={product.images[0]}
        ogUrl={canonicalUrl}
        ogType="product"
        canonicalUrl={canonicalUrl}
        jsonLd={productJsonLd}
      />

      {/* Back CTA */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-xs">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden relative border border-neutral-200/60 shadow-xs">
            <img 
              src={optimizeImageUrl(product.images[selectedImageIndex], 1000, 85)} 
              alt={product.name} 
              className={`w-full h-full object-cover object-center ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
              loading="eager"
              decoding="async"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="px-6 py-3 bg-rose-600 text-white font-extrabold text-sm tracking-widest uppercase rounded-xl shadow-xl">
                  Currently Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails if multiple images exist */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx ? 'border-neutral-900 scale-102 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={optimizeImageUrl(img, 200, 75)} alt="Thumbnail" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details, Dynamic Fields, and Cart Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          
          <div className="space-y-6">
            {/* Meta tags */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-lg">
                  {product.category}
                </span>
                <span className="px-3 py-1 bg-neutral-900 text-white text-xs font-mono tracking-wider uppercase rounded-lg">
                  SKU: {product.code}
                </span>
              </div>
              <button 
                onClick={handleShare}
                className="p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
                title="Share link"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Price & Stock Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-neutral-200">
              <div className="flex items-baseline gap-1.5 shrink-0">
                <span className="text-xs sm:text-sm font-semibold text-neutral-500">BDT</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                  ৳{(product?.price || 0).toLocaleString()}
                </span>
              </div>

              <div className="shrink-0">
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Sold Out
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Dynamic Optional Variant Fields per Section 5 */}
            {product.variants && (
              <div className="space-y-5 py-4 border-b border-neutral-200">
                {/* 1. Size selector only if sizes exist */}
                {product.variants.size && product.variants.size.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold uppercase tracking-wider text-neutral-700">Select Size:</span>
                      <span className="text-neutral-500 font-mono">{selectedSize || 'Standard'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.size.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                            selectedSize === size 
                              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm' 
                              : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Color selector only if colors exist */}
                {product.variants.color && product.variants.color.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold uppercase tracking-wider text-neutral-700">Select Color:</span>
                      <span className="text-neutral-500 font-medium">{selectedColor || 'Default'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.color.map((col) => (
                        <button
                          key={col}
                          onClick={() => handleColorSelect(col)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                            selectedColor === col 
                              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm' 
                              : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-black'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Fabric only if filled in */}
                {product.variants.fabric && (
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-neutral-500 uppercase font-semibold">Material / Fabric:</span>
                    <span className="font-semibold text-neutral-900">{product.variants.fabric}</span>
                  </div>
                )}

                {/* 4. Fit only if filled in */}
                {product.variants.fit && (
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-neutral-500 uppercase font-semibold">Silhouette / Fit:</span>
                    <span className="font-semibold text-neutral-900">{product.variants.fit}</span>
                  </div>
                )}

                {/* 5. Care instructions only if filled in */}
                {product.variants.careInstructions && (
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-neutral-500 uppercase font-semibold">Care:</span>
                    <span className="font-medium text-neutral-700">{product.variants.careInstructions}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center justify-between sm:justify-start border border-neutral-300 rounded-xl bg-neutral-50 px-3 py-2 shrink-0">
                  <span className="text-xs font-semibold text-neutral-500 sm:hidden uppercase">Qty:</span>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200 text-lg font-bold text-neutral-700 disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-neutral-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={isOutOfStock || quantity >= product.stock}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200 text-lg font-bold text-neutral-700 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to cart CTA */}
                <div className="flex-1">
                  {isOutOfStock ? (
                    <button 
                      disabled
                      className="w-full py-3.5 bg-neutral-200 text-neutral-500 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl cursor-not-allowed text-center"
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-black text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-between gap-2 active:scale-98"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 shrink-0" />
                        <span>Add to Cart</span>
                      </div>
                      <span className="font-mono text-neutral-200 text-xs sm:text-sm shrink-0">
                        ৳{((product?.price || 0) * (quantity || 1)).toLocaleString()}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Description Section per Section 5 */}
            <div className="space-y-3 pt-6 border-t border-neutral-200">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900">
                Product Description & Notes
              </h3>
              <div className="bg-neutral-50/80 p-5 rounded-2xl border border-neutral-200/60">
                {renderDescription()}
              </div>
            </div>

            {/* Rich SEO Content: FAQs & Specification Table */}
            {product.seoData?.richContent && (
              <div className="space-y-6 pt-6 border-t border-neutral-200">
                {/* Specifications Table */}
                {product.seoData.richContent.specificationsTable && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900">
                      Garment Specifications
                    </h3>
                    <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 divide-y divide-neutral-200 text-xs">
                      {Object.entries(product.seoData.richContent.specificationsTable).map(([k, v]) => (
                        <div key={k} className="py-2 flex justify-between">
                          <span className="font-semibold text-neutral-500">{k}:</span>
                          <span className="font-bold text-neutral-900">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs Accordion */}
                {product.seoData.richContent.faq && product.seoData.richContent.faq.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-2">
                      {product.seoData.richContent.faq.map((item, idx) => (
                        <details key={idx} className="group bg-neutral-50 border border-neutral-200 rounded-2xl p-3.5 [&_summary::-webkit-details-marker]:none">
                          <summary className="flex items-center justify-between font-bold text-xs text-neutral-900 cursor-pointer list-none">
                            <span>{item.question}</span>
                            <span className="transition group-open:rotate-180">
                              <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"/></svg>
                            </span>
                          </summary>
                          <p className="mt-2 text-xs text-neutral-600 leading-relaxed pl-1 border-t border-neutral-200 pt-2">
                            {item.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-200 text-center">
            <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
              <Truck className="w-5 h-5 text-amber-600 mx-auto" />
              <p className="text-[11px] font-bold text-neutral-800">Nationwide COD</p>
              <p className="text-[10px] text-neutral-500">Flat ৳120 BDT</p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
              <p className="text-[11px] font-bold text-neutral-800">Atelier Quality</p>
              <p className="text-[10px] text-neutral-500">100% Guaranteed</p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
              <RotateCcw className="w-5 h-5 text-sky-600 mx-auto" />
              <p className="text-[11px] font-bold text-neutral-800">Easy Returns</p>
              <p className="text-[10px] text-neutral-500">7 Day Exchange</p>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products / You May Also Like per Section 5 */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-neutral-200">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Curated Recommendations
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 mt-1">
                You May Also Like
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard 
                key={rel.id} 
                product={rel} 
                onViewDetails={(p) => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onViewProductDetails(p);
                }} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
