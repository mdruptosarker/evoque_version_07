import React, { useState } from 'react';
import { useStore, FEATURE_COUPONS_ENABLED } from '../context/StoreContext';
import { Truck, ShieldCheck, MapPin, Phone, User, CheckCircle2, FileText, ArrowRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { generateOrderInvoicePDF } from '../utils/pdfGenerator';
import { SEO } from '../components/common/SEO';

interface CheckoutPageProps {
  onOrderCompleted: (order: Order) => void;
  onBackToShop: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderCompleted, onBackToShop }) => {
  const { 
    cart, 
    currentUser, 
    getCartSubtotal, 
    deliveryCharge, 
    placeOrder, 
    validateCoupon,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useStore();

  const [shippingAddress, setShippingAddress] = useState(currentUser?.shippingAddress || 'House 14, Road 7, Dhanmondi R/A, Dhaka-1205');
  const [phone, setPhone] = useState(currentUser?.phone || '+880 1819-234567');
  
  // Section 7 Coupon state (logic built, UI hidden via FEATURE_COUPONS_ENABLED flag)
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>(undefined);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = getCartSubtotal();
  const total = subtotal + deliveryCharge - couponDiscount;

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="font-serif font-bold text-2xl text-neutral-900">Authentication Required</h2>
        <p className="text-sm text-neutral-600">
          Per Section 6 rules, you must be logged into your customer account to confirm your Cash on Delivery order and receive official tax invoices.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => { setIsAuthModalOpen(true); setAuthModalMode('login'); }}
            className="px-6 py-3 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black"
          >
            Sign In Now
          </button>
          <button
            onClick={() => { setIsAuthModalOpen(true); setAuthModalMode('signup'); }}
            className="px-6 py-3 bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-neutral-200"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto stroke-1" />
        <h2 className="font-serif font-bold text-2xl text-neutral-900">Your Cart is Empty</h2>
        <p className="text-sm text-neutral-500">Add luxury items from our catalog before proceeding to Cash on Delivery checkout.</p>
        <button
          onClick={onBackToShop}
          className="px-8 py-3 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  // Handle Section 7 Coupon check
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponCodeInput.trim()) return;

    const validation = validateCoupon(couponCodeInput, subtotal);
    if (validation.valid) {
      setAppliedCoupon(couponCodeInput.trim());
      setCouponDiscount(validation.discountAmount);
      setCouponSuccess(validation.message);
    } else {
      setCouponError(validation.message);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress || !phone) {
      alert('Please provide your complete Bangladesh shipping address and phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder(shippingAddress, phone, appliedCoupon);
      setIsSubmitting(false);
      if (order) {
        setCompletedOrder(order);
        onOrderCompleted(order);
      } else {
        alert('An error occurred while finalizing your order. Please try again.');
      }
    }, 800);
  };

  // Order Completion Confirmation View
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto my-12 bg-white p-8 sm:p-12 rounded-3xl border border-neutral-200 shadow-xl text-center space-y-6 animate-fade-in">
        <SEO title="Order Confirmed | EVOQUE" />
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-widest rounded-full">
            Order Successfully Placed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-2">
            Thank you, {completedOrder.customerName}!
          </h1>
          <p className="text-sm text-neutral-600 max-w-lg mx-auto">
            Your Cash on Delivery order <strong className="text-black font-mono">#{completedOrder.id}</strong> has been registered. Our Dhaka studio is now preparing your garments for dispatch.
          </p>
        </div>

        {/* Order Summary Box */}
        <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-neutral-200/80 text-left space-y-4 max-w-xl mx-auto">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200 text-xs text-neutral-500">
            <span>SHIPPED TO:</span>
            <span className="font-mono text-neutral-900 font-semibold">{completedOrder.phone}</span>
          </div>
          <p className="text-sm font-medium text-neutral-800">{completedOrder.shippingAddress}</p>
          
          <div className="pt-2 space-y-2">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Payment Method:</span>
              <span className="font-bold text-neutral-950 bg-amber-100 px-2 py-0.5 rounded text-[11px] text-amber-900">
                Cash on Delivery (COD Only)
              </span>
            </div>
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Delivery Charge (All Bangladesh):</span>
              <span className="font-bold text-neutral-900">৳{(completedOrder.deliveryCharge || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-2 border-t border-neutral-200">
              <span>Total COD Payable:</span>
              <span>৳{(completedOrder.total || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: PDF Invoice & Continue Shop per Section 6 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => generateOrderInvoicePDF(completedOrder, 'download')}
            className="px-6 py-4 bg-neutral-900 hover:bg-black text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Download Official PDF Invoice</span>
          </button>

          <button
            onClick={() => generateOrderInvoicePDF(completedOrder, 'open')}
            className="px-6 py-4 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>View Invoice in New Tab</span>
          </button>
        </div>

        <div className="pt-4 border-t border-neutral-100">
          <button
            onClick={onBackToShop}
            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors underline underline-offset-4"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-10">
      <SEO title="Secure COD Checkout | EVOQUE" />
      
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Secure Checkout
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Review your shipping information and confirm your Cash on Delivery order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Shipping & Payment Confirmation Form */}
        <div className="lg:col-span-7 space-y-8">
          
          <form onSubmit={handlePlaceOrder} className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-neutral-900">Shipping Details (Bangladesh)</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Customer Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    disabled
                    value={currentUser.name}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-neutral-300 rounded-xl text-sm font-medium text-neutral-600 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">Registered customer profile name</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Shipping Address (All Bangladesh Division / District) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <textarea
                    required
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House No, Road No, Area, Thana, District, Postal Code"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Phone Number (Required for Courier Verification) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section per Section 6: COD ONLY, no other options */}
            <div className="pt-4 border-t border-neutral-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h3 className="font-serif font-bold text-lg text-neutral-900">Payment Method</h3>
              </div>

              <div className="bg-amber-50/90 border-2 border-amber-400 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-amber-950 uppercase tracking-wide">
                    Cash on Delivery (COD Only) — Fixed Payment Option
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Per Section 6 rules, EVOQUE operates exclusively on a Cash on Delivery model. You will pay exact cash <strong className="font-mono">৳{(total || 0).toLocaleString()} BDT</strong> to the courier rider upon receiving and inspecting your parcel.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-neutral-900 hover:bg-black text-white font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering Order & Generating Invoice...</span>
              ) : (
                <>
                  <span>Confirm COD Order — ৳{(total || 0).toLocaleString()} BDT</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right Column: Order Summary & Hidden Coupon Feature Flag Note */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-lg text-neutral-900 pb-4 border-b border-neutral-200">
              Order Summary ({cart.length} items)
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3">
                  <img 
                    src={item.product.images[0] || ''} 
                    alt={item.product.name} 
                    className="w-12 h-14 object-cover rounded-lg bg-neutral-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-xs text-neutral-900 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-neutral-500">Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}</p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    ৳{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Section 7 Feature Flag check: Keep coupon input hidden/commented out unless FEATURE_COUPONS_ENABLED is true */}
            {FEATURE_COUPONS_ENABLED ? (
              <form onSubmit={handleApplyCoupon} className="pt-4 border-t border-neutral-200 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Have a Coupon Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="e.g. EVOQUE20"
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs uppercase font-mono focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase rounded-xl hover:bg-black"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-600 font-semibold">{couponSuccess}</p>}
              </form>
            ) : (
              /* Hidden per Section 7: "do not expose any coupon input field on customer-facing checkout/cart right now" */
              <div className="p-3 bg-neutral-100/80 rounded-xl border border-neutral-200/80 text-[11px] text-neutral-500">
                <span className="font-bold text-neutral-700">Section 7 Architectural Note:</span> Coupon engine and admin CRUD are 100% active, but customer coupon UI is currently disabled via <code className="bg-neutral-200 px-1 rounded text-black font-mono">FEATURE_COUPONS_ENABLED = false</code>.
              </div>
            )}

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-neutral-200 space-y-2.5 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">৳{(subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span className="flex items-center gap-1">
                  <span>Delivery Charge</span>
                  <span className="text-[10px] bg-neutral-100 px-1.5 py-0.2 rounded text-neutral-500 font-mono">Flat BDT</span>
                </span>
                <span className="font-semibold text-neutral-900">৳{(deliveryCharge || 0).toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>- ৳{(couponDiscount || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-neutral-900">Total COD Amount</span>
                <span className="font-serif font-extrabold text-2xl text-neutral-950">৳{(total || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl text-xs text-neutral-500 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Instant PDF Tax Invoice Guaranteed</span>
              </div>
              <p className="text-[11px]">An official downloadable invoice will be created upon order completion and emailed to <strong className="text-black">{currentUser.email}</strong>.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
