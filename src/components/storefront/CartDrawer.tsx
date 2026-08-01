import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { optimizeImageUrl } from '../../utils/imageUtils';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    getCartSubtotal, 
    deliveryCharge,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useStore();

  const subtotal = getCartSubtotal();
  const total = subtotal + (cart.length > 0 ? deliveryCharge : 0);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (!currentUser) {
      // Per Section 6 rule: prompt login or sign up first!
      setIsAuthModalOpen(true);
      setAuthModalMode('login');
    } else {
      onProceedToCheckout();
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md flex z-50">
        <div className="w-full h-full bg-[#FAF9F6] shadow-2xl flex flex-col border-l border-neutral-200">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b border-neutral-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-neutral-900">Your Shopping Cart</h2>
                <p className="text-xs text-neutral-500">{cart.length} unique item(s) selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition-colors shrink-0"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-neutral-500">
                <div className="w-16 h-16 rounded-full bg-neutral-200/60 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-serif font-semibold text-base text-neutral-800">Your cart is currently empty</p>
                <p className="text-xs max-w-xs leading-relaxed">Explore our seasonal luxury drops and add items to begin your order.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-all shadow-xs"
                >
                  Explore Store
                </button>
              </div>
            ) : (
              <>
                {/* Flat rate COD delivery banner per Section 6 */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 sm:p-3.5 flex items-center gap-3 text-xs text-amber-900">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Cash on Delivery Across Bangladesh</span>
                    <p className="text-[11px] text-amber-800 leading-tight">Flat ৳120 BDT shipping added at checkout.</p>
                  </div>
                </div>

                {cart.map((item) => {
                  const itemKey = `${item.product.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`;
                  return (
                    <div 
                      key={itemKey}
                      className="bg-white p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 shadow-2xs flex gap-3 sm:gap-4 items-center transition-all hover:border-neutral-300"
                    >
                      <img 
                        src={optimizeImageUrl(item.product.images[0], 200, 75)} 
                        alt={item.product.name} 
                        className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded-lg bg-neutral-100 shrink-0"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-neutral-900 truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                            className="text-neutral-400 hover:text-rose-600 p-1 transition-colors shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[10px] sm:text-[11px] text-neutral-500 font-mono tracking-wide mt-0.5">
                          SKU: {item.product.code}
                        </p>

                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {item.selectedSize && (
                              <span className="bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                                Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-100 gap-2">
                          <span className="text-xs sm:text-sm font-bold text-neutral-900 shrink-0">
                            ৳{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}
                          </span>

                          {/* Editable quantity buttons */}
                          <div className="flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded-lg border border-neutral-200 shrink-0">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                              className="p-0.5 text-neutral-600 hover:text-black transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold min-w-[18px] text-center text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                              className="p-0.5 text-neutral-600 hover:text-black transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={clearCart}
                    className="text-xs text-neutral-400 hover:text-rose-600 transition-colors underline underline-offset-4"
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer Totals & CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-neutral-200 space-y-3.5 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] shrink-0">
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">৳{(subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span className="flex items-center gap-1">
                    <span>Delivery Charge</span>
                    <span className="text-[9px] sm:text-[10px] bg-neutral-100 px-1.5 py-0.2 rounded text-neutral-500 font-mono">Flat BDT</span>
                  </span>
                  <span className="font-semibold text-neutral-900">৳{(deliveryCharge || 0).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="font-serif font-bold text-sm sm:text-base text-neutral-900">Total</span>
                  <span className="font-serif font-extrabold text-lg sm:text-xl text-neutral-900">৳{(total || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 sm:py-4 bg-neutral-900 hover:bg-black text-white font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span className="truncate">{currentUser ? 'Proceed to Checkout' : 'Login / Sign Up to Checkout'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-500 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Cash on Delivery Guarantee • 7 Day Exchange</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
