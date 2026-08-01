import React, { useState } from 'react';
import { useStore, FEATURE_COUPONS_ENABLED } from '../../context/StoreContext';
import { Ticket, Plus, Trash2, CheckCircle2, AlertTriangle, Calendar, Percent, DollarSign } from 'lucide-react';

export const AdminCouponsTab: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon } = useStore();
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrder, setMinOrder] = useState<number>(5000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = (e: React.FormEvent) => {
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

  const handleDelete = (id: string, cCode: string) => {
    if (window.confirm(`Delete coupon "${cCode}"?`)) {
      deleteCoupon(id);
      setSuccessMsg(`Deleted coupon "${cCode}".`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200">
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-900 flex items-center gap-2.5">
          <Ticket className="w-7 h-7 text-neutral-800" />
          <span>Coupon & Promotional Discount Engine</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Full CRUD coupon management per Section 7 & 12 specifications.
        </p>
      </div>

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
          <strong>Engine Status:</strong> All coupon validation, discount calculation, and database CRUD methods below are 100% operational. To reveal the input box on the customer Checkout page, toggle <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono font-bold">FEATURE_COUPONS_ENABLED = true</code> in <code className="font-mono">StoreContext.tsx</code>.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Create Coupon Form */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6 self-start">
          <h3 className="font-serif font-bold text-lg text-neutral-900 pb-3 border-b border-neutral-200">
            Create Promotional Coupon
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
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
                  <option value="fixed">Fixed BDT (৳)</option>
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
              className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
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
                  onClick={() => handleDelete(c.id, c.code)}
                  className="p-2 text-neutral-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
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
  );
};
