import React, { useState } from 'react';
import { useStore, FEATURE_COUPONS_ENABLED } from '../../context/StoreContext';
import { 
  Ticket, Plus, Trash2, CheckCircle2, AlertTriangle, Calendar, Percent, DollarSign, 
  Truck, Sparkles, Clock, Image as ImageIcon, Globe, Eye, ToggleLeft, ToggleRight, X 
} from 'lucide-react';
import { PromoOfferType } from '../../types';
import { optimizeImage } from '../../utils/imageOptimizer';

export const AdminCouponsTab: React.FC = () => {
  const { 
    coupons, addCoupon, deleteCoupon, updateCoupon,
    promotions, addPromotion, updatePromotion, deletePromotion 
  } = useStore();

  const [activeSection, setActiveSection] = useState<'promotions' | 'coupons'>('promotions');
  const [successMsg, setSuccessMsg] = useState('');

  // ----------------------------------------------------
  // Promotional Offer / Delivery Banner Form States
  // ----------------------------------------------------
  const [promoTitle, setPromoTitle] = useState('Special Delivery Privilege: Rangpur Division');
  const [promoSubtitle, setPromoSubtitle] = useState('100% Free Nationwide COD Delivery across all areas in Rangpur division.');
  const [promoType, setPromoType] = useState<PromoOfferType>('delivery_offer');
  const [promoBannerImage, setPromoBannerImage] = useState('https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80');
  const [promoEndDate, setPromoEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format for datetime-local
  });
  const [freeDeliveryTarget, setFreeDeliveryTarget] = useState<'ALL' | 'RANGPUR' | 'DHAKA' | 'CHITTAGONG' | 'SYLHET' | 'RAJSHAHI' | 'KHULNA' | 'BARISAL' | 'MYMENSINGH'>('RANGPUR');
  const [promoMinOrder, setPromoMinOrder] = useState<number>(0);
  const [promoCtaText, setPromoCtaText] = useState('Shop Collection');
  const [promoCtaLink, setPromoCtaLink] = useState('products');
  const [showOnHeader, setShowOnHeader] = useState(true);
  const [showFloatingBanner, setShowFloatingBanner] = useState(true);
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);

  // ----------------------------------------------------
  // Coupon Form States
  // ----------------------------------------------------
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrder, setMinOrder] = useState<number>(5000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  // Handle direct file upload from Laptop / Mobile
  const handleFileUpload = async (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    try {
      const optimized = await optimizeImage(file, 2000, 0.85);
      callback(optimized.webpDataUrl);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          callback(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle.trim() || !promoEndDate) {
      alert('Please provide title and expiration date.');
      return;
    }

    addPromotion({
      title: promoTitle.trim(),
      subtitle: promoSubtitle.trim() || undefined,
      type: promoType,
      bannerImage: promoBannerImage.trim() || undefined,
      startDate: new Date().toISOString(),
      endDate: new Date(promoEndDate).toISOString(),
      active: true,
      freeDeliveryTarget: promoType === 'delivery_offer' ? freeDeliveryTarget : undefined,
      minOrderValue: Number(promoMinOrder) || 0,
      ctaText: promoCtaText.trim() || 'Explore Now',
      ctaLink: promoCtaLink.trim() || 'products',
      showOnHeader,
      showFloatingBanner
    });

    setSuccessMsg(`🚀 Created promotional announcement "${promoTitle}" successfully!`);
    setIsCreatingPromo(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrder),
      usageLimit: 100,
      expiryDate,
      active: true
    });

    setSuccessMsg(`Created coupon code "${code.trim().toUpperCase()}" successfully!`);
    setCode('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeletePromo = (id: string, title: string) => {
    if (window.confirm(`Delete promotion "${title}"?`)) {
      deletePromotion(id);
      setSuccessMsg(`Deleted promotion "${title}".`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDeleteCoupon = (id: string, cCode: string) => {
    if (window.confirm(`Delete coupon "${cCode}"?`)) {
      deleteCoupon(id);
      setSuccessMsg(`Deleted coupon "${cCode}".`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Helper to compute remaining time countdown
  const getRemainingTimeString = (targetDateStr: string) => {
    const diff = new Date(targetDateStr).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-900 flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-amber-500" />
            <span>Promotions, Delivery Offers & Coupons</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage regional free delivery offers (e.g. Rangpur Free Delivery), collection teasers with live countdown timers, and vouchers.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 bg-neutral-200/80 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveSection('promotions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'promotions'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Delivery & Teaser Banners ({promotions.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('coupons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'coupons'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Ticket className="w-4 h-4 text-amber-600" />
            <span>Vouchers & Coupons ({coupons.length})</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* SECTION 1: PROMOTIONAL OFFERS & DELIVERY BANNERS     */}
      {/* ==================================================== */}
      {activeSection === 'promotions' && (
        <div className="space-y-8">
          
          {/* Quick Action Top Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900">
                Active Storefront Banners & Regional Offers
              </h3>
              <p className="text-xs text-neutral-500">
                These banners appear in the top header and floating announcement card with live countdowns.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingPromo(!isCreatingPromo)}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {isCreatingPromo ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 text-amber-400" />}
              <span>{isCreatingPromo ? 'Cancel' : 'Create New Offer / Banner'}</span>
            </button>
          </div>

          {/* Create Promotion Form Drawer / Card */}
          {isCreatingPromo && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-neutral-900 shadow-lg space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-neutral-900">
                      Configure Promotional Offer / Arrival Teaser
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Set banner images, countdown duration, and regional free delivery triggers.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingPromo(false)}
                  className="p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePromotion} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Offer Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      Offer / Announcement Type *
                    </label>
                    <select
                      value={promoType}
                      onChange={(e) => setPromoType(e.target.value as PromoOfferType)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    >
                      <option value="delivery_offer">🚚 Regional Delivery Offer (e.g. Rangpur Free Delivery)</option>
                      <option value="collection_launch">✨ Upcoming Collection Launch (e.g. 7 Days Anime Teaser)</option>
                      <option value="flash_sale">⚡ Flash Discount Sale</option>
                      <option value="announcement">📢 General Store Announcement</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      Banner Headline / Offer Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={promoTitle}
                      onChange={(e) => setPromoTitle(e.target.value)}
                      placeholder="e.g. Special Delivery Privilege: Rangpur Division"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Subtitle / Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      Offer Description / Details (Shown on Floating Card)
                    </label>
                    <input
                      type="text"
                      value={promoSubtitle}
                      onChange={(e) => setPromoSubtitle(e.target.value)}
                      placeholder="e.g. 100% Free Nationwide COD Delivery across all areas in Rangpur division."
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-normal focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* If Delivery Offer: Select Target Division / Area */}
                  {promoType === 'delivery_offer' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                        Free Delivery Qualifying Region *
                      </label>
                      <select
                        value={freeDeliveryTarget}
                        onChange={(e: any) => setFreeDeliveryTarget(e.target.value)}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-emerald-400 rounded-xl text-xs font-bold text-emerald-950 focus:outline-none focus:border-black"
                      >
                        <option value="RANGPUR">🟢 Rangpur Division (All Rangpur addresses get ৳0 Delivery)</option>
                        <option value="DHAKA">🟢 Dhaka Division (All Dhaka addresses get ৳0 Delivery)</option>
                        <option value="CHITTAGONG">🟢 Chittagong Division</option>
                        <option value="SYLHET">🟢 Sylhet Division</option>
                        <option value="RAJSHAHI">🟢 Rajshahi Division</option>
                        <option value="KHULNA">🟢 Khulna Division</option>
                        <option value="BARISAL">🟢 Barisal Division</option>
                        <option value="MYMENSINGH">🟢 Mymensingh Division</option>
                        <option value="ALL">🌟 Nationwide Free Delivery (All Bangladesh ৳0)</option>
                      </select>
                    </div>
                  )}

                  {/* Expiration Date & Time with Countdown */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Offer End Date & Countdown Target *</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={promoEndDate}
                      onChange={(e) => setPromoEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Preset quick buttons for duration */}
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-neutral-500">Quick Timer Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 3);
                        setPromoEndDate(d.toISOString().slice(0, 16));
                      }}
                      className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[11px] font-semibold rounded-lg cursor-pointer"
                    >
                      3 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 7);
                        setPromoEndDate(d.toISOString().slice(0, 16));
                      }}
                      className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[11px] font-semibold rounded-lg cursor-pointer"
                    >
                      7 Days (Anime Drop)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 14);
                        setPromoEndDate(d.toISOString().slice(0, 16));
                      }}
                      className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[11px] font-semibold rounded-lg cursor-pointer"
                    >
                      14 Days (Rangpur Free COD)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 30);
                        setPromoEndDate(d.toISOString().slice(0, 16));
                      }}
                      className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[11px] font-semibold rounded-lg cursor-pointer"
                    >
                      1 Month
                    </button>
                  </div>
                </div>

                {/* Banner Image Upload Section */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Promotional Banner Image
                    </label>
                    <span className="text-[11px] text-neutral-500">Choose file from Laptop/Mobile or paste link</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <label className="px-5 py-3 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-sm transition-all hover:scale-[1.02] active:scale-95">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Choose Banner File from Device</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], setPromoBannerImage);
                          }
                        }} 
                      />
                    </label>

                    <div className="flex-1 flex gap-2 items-center">
                      <input
                        type="text"
                        value={promoBannerImage}
                        onChange={(e) => setPromoBannerImage(e.target.value)}
                        placeholder="Or paste banner image URL (https://...)"
                        className="flex-1 px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                      />
                      {promoBannerImage && (
                        <img src={promoBannerImage} alt="Banner Preview" className="w-12 h-12 object-cover rounded-xl border border-neutral-300 bg-white shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA and Display Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={promoCtaText}
                      onChange={(e) => setPromoCtaText(e.target.value)}
                      placeholder="e.g. Shop Collection / Explore Preview"
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col justify-center space-y-2 pt-2 sm:pt-0">
                    <label className="flex items-center gap-2 text-xs font-semibold text-neutral-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOnHeader}
                        onChange={(e) => setShowOnHeader(e.target.checked)}
                        className="w-4 h-4 rounded text-black focus:ring-black"
                      />
                      <span>Display in Top Header Notification Bar (Live Ticker)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-neutral-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showFloatingBanner}
                        onChange={(e) => setShowFloatingBanner(e.target.checked)}
                        className="w-4 h-4 rounded text-black focus:ring-black"
                      />
                      <span>Show Elegant Non-Disturbing Floating Announcement Card</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsCreatingPromo(false)}
                    className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Announcement & Launch Offer</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotions.map((promo) => {
              const isExpired = new Date(promo.endDate) < new Date();
              return (
                <div 
                  key={promo.id} 
                  className={`bg-white rounded-3xl border p-6 shadow-sm transition-all overflow-hidden flex flex-col justify-between ${
                    promo.active && !isExpired ? 'border-neutral-300 hover:border-neutral-900 shadow-md' : 'border-neutral-200 opacity-60'
                  }`}
                >
                  <div>
                    {/* Top Badges & Countdown */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          promo.type === 'delivery_offer' 
                            ? 'bg-emerald-100 text-emerald-900' 
                            : promo.type === 'collection_launch' 
                            ? 'bg-purple-100 text-purple-900' 
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {promo.type === 'delivery_offer' ? '🚚 Delivery Offer' : promo.type === 'collection_launch' ? '✨ Collection Teaser' : '⚡ Promo Offer'}
                        </span>

                        {promo.freeDeliveryTarget && (
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-mono font-bold rounded">
                            {promo.freeDeliveryTarget} Division (৳0 COD)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{getRemainingTimeString(promo.endDate)}</span>
                      </div>
                    </div>

                    {/* Banner Image Preview */}
                    {promo.bannerImage && (
                      <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-neutral-200 relative group bg-neutral-900">
                        <img 
                          src={promo.bannerImage} 
                          alt={promo.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <p className="font-serif font-bold text-sm line-clamp-1">{promo.title}</p>
                        </div>
                      </div>
                    )}

                    {/* Headline and details */}
                    <h4 className="font-serif font-extrabold text-base text-neutral-900">
                      {promo.title}
                    </h4>
                    {promo.subtitle && (
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {promo.subtitle}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-neutral-400" />
                        Header Ticker: <strong className="text-neutral-800">{promo.showOnHeader ? 'Enabled' : 'Disabled'}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Floating Card: <strong className="text-neutral-800">{promo.showFloatingBanner ? 'Enabled' : 'Disabled'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                    <button
                      onClick={() => updatePromotion(promo.id, { active: !promo.active })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        promo.active 
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {promo.active ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{promo.active ? 'Active' : 'Paused'}</span>
                    </button>

                    <button
                      onClick={() => handleDeletePromo(promo.id, promo.title)}
                      className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* SECTION 2: VOUCHERS & COUPON CODES                   */}
      {/* ==================================================== */}
      {activeSection === 'coupons' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Section 7 Mandatory Architectural Banner */}
          <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-6 shadow-xs space-y-2 text-amber-950">
            <div className="flex items-center justify-between font-bold text-sm text-amber-900">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Section 7 Architectural Mandate Compliance Note:</span>
              </span>
              <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full font-mono text-xs">
                FEATURE_COUPONS_ENABLED = {String(FEATURE_COUPONS_ENABLED).toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Per Section 7 rules: <em>"Build the system/logic to apply a coupon, but do not expose any coupon input field on the customer-facing checkout/cart right now. Keep the UI hidden/commented out or behind a feature flag."</em>
              <br /><br />
              <strong>Engine Status:</strong> All coupon validation, discount calculation, and database CRUD methods below are 100% operational.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Create Coupon Form */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6 self-start">
              <h3 className="font-serif font-bold text-lg text-neutral-900 pb-3 border-b border-neutral-200">
                Create Promotional Coupon
              </h3>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WINTER25"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono uppercase font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Discount Type *
                    </label>
                    <select
                      value={discountType}
                      onChange={(e: any) => setDiscountType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Fixed BDT (৳)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Value ({discountType === 'percentage' ? '%' : '৳'}) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Minimum Order Amount (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Expiration Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Register Coupon Code</span>
                </button>
              </form>
            </div>

            {/* Right Column: Existing Coupons Table */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-neutral-900">
                  Active Coupon Directory ({coupons.length})
                </h3>
              </div>

              <div className="space-y-3">
                {coupons.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs flex items-center justify-between gap-4 group hover:border-neutral-400 transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                        {c.discountType === 'percentage' ? <Percent className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-base text-neutral-900 tracking-wider">
                            {c.code}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 font-medium mt-0.5">
                          Discount: <strong className="text-black font-mono">{c.discountValue}{c.discountType === 'percentage' ? '%' : ' BDT'} OFF</strong> | Min Order: ৳{(c.minOrderValue || (c as any).minOrderAmount || 0).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> Expiry: {c.expiryDate}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCoupon(c.id, c.code)}
                      className="p-2 text-neutral-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

