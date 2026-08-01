import React from 'react';
import { ShoppingBag, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { optimizeImageUrl, preloadProductDetailImages } from '../../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useStore();
  const isOutOfStock = product.stock <= 0;

  const handleMouseEnter = () => {
    // Preload product detail page images into browser RAM on hover for instant opening
    preloadProductDetailImages(product.images);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    
    // Default variant if available
    const defaultSize = product.variants?.size?.[0];
    const defaultColor = product.variants?.color?.[0];
    addToCart(product, 1, defaultSize, defaultColor);
  };

  return (
    <div 
      onClick={() => onViewDetails(product)}
      onMouseEnter={handleMouseEnter}
      className="group bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top: Product Photography Frame with hover zoom */}
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        <img 
          src={optimizeImageUrl(product.images[0], 600, 75)} 
          alt={product.name} 
          className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
          loading="lazy"
          decoding="async"
        />

        {/* Badges container */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10 gap-2">
          {/* SKU / Product Code Badge per Section 5 */}
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-black/75 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-mono tracking-wider uppercase rounded-md shrink-0">
            {product.code}
          </span>

          {/* Out of Stock / Low Stock / In Stock Badge */}
          {isOutOfStock ? (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-rose-600 text-white font-semibold text-[9px] sm:text-[10px] uppercase tracking-wider rounded-md flex items-center gap-1 shadow-xs shrink-0">
              <AlertCircle className="w-3 h-3" />
              Out of Stock
            </span>
          ) : product.stock <= 3 ? (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-amber-500 text-black font-bold text-[9px] sm:text-[10px] uppercase tracking-wider rounded-md shadow-xs shrink-0">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-600/90 text-white text-[9px] sm:text-[10px] uppercase tracking-wider rounded-md flex items-center gap-1 shadow-xs shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              In Stock
            </span>
          )}
        </div>

        {/* Category tag bottom left on image */}
        <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
          <span className="text-[10px] sm:text-[11px] font-medium text-neutral-800 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs">
            {product.category}
          </span>
        </div>
      </div>

      {/* Bottom: Product Info & Actions */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-serif font-bold text-xs sm:text-base text-neutral-900 group-hover:text-black line-clamp-1 transition-colors">
            {product.name}
          </h3>
          
          {/* Price & Stock Badge with proper mobile separation */}
          <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
            <p className="text-xs sm:text-sm font-semibold text-neutral-800 flex items-baseline gap-1">
              <span className="text-[10px] sm:text-xs font-normal text-neutral-500">BDT</span>
              <span className="text-sm sm:text-lg text-neutral-950 font-sans font-extrabold tracking-tight">
                ৳{(product?.price || 0).toLocaleString()}
              </span>
            </p>

            {/* Clean inline stock badge */}
            {isOutOfStock ? (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/80 shrink-0">
                Sold Out
              </span>
            ) : product.stock <= 3 ? (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 shrink-0">
                Low Stock ({product.stock})
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shrink-0">
                In Stock ({product.stock})
              </span>
            )}
          </div>
        </div>

        {/* Two clearly separated buttons per Section 5 */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 border-t border-neutral-100">
          {/* 1. Add to Cart Button */}
          {isOutOfStock ? (
            <button 
              disabled
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2 px-2 bg-neutral-200 text-neutral-500 text-[11px] sm:text-xs font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-1"
            >
              <span>Sold Out</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] sm:text-xs font-semibold rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1 active:scale-95"
              title="Add to Cart"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>
          )}

          {/* 2. Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="w-full py-2 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 hover:text-black text-[11px] sm:text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 border border-neutral-200/80 active:scale-95"
            title="View Full Product Details"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
