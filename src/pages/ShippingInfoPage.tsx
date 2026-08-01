import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Clock, MapPin, AlertCircle } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const ShippingInfoPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-12">
      <SEO 
        title="Shipping & Cash on Delivery Policy | EVOQUE"
        description="Learn about EVOQUE's flat BDT 120 nationwide Cash on Delivery shipping across all divisions in Bangladesh via Steadfast Courier."
        ogType="article"
      />

      <div className="text-center space-y-4 pb-6 border-b border-neutral-200">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">Nationwide Logistics</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
          EVOQUE partners exclusively with premium courier networks across Bangladesh to ensure safe, rapid, and transparent Cash on Delivery service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-neutral-900">Flat BDT ৳120 Delivery Rate</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Per Section 6 mandates, we charge a fixed, transparent delivery rate of <strong>৳120 BDT</strong> for all orders across every division in Bangladesh (Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, and Mymensingh). There are no hidden zone fees or weight surcharges.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
            ৳
          </div>
          <h3 className="font-serif font-bold text-lg text-neutral-900">100% Cash on Delivery (COD)</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            We operate exclusively on Cash on Delivery. You do not need to make advance mobile bank transfers or credit card payments. Simply pay the exact invoice amount in cash to the delivery rider upon receiving your sealed parcel.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-neutral-900">Dispatch & Transit Times</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Orders placed before 4:00 PM are dispatched from our Dhaka warehouse on the same working day.
            <br /><br />
            • <strong>Inside Dhaka Metropolitan:</strong> 24 to 48 Hours<br />
            • <strong>Outside Dhaka / Major Districts:</strong> 2 to 4 Working Days
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-neutral-900">Steadfast Courier Integration</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            All shipments are tracked via our logistics partner, <strong>Steadfast Courier</strong>. When your order is marked shipped by our admin team, an automatic dispatch email with your official tracking code will be sent to your inbox.
          </p>
        </div>

      </div>

      <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3 text-amber-950">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span>Parcel Inspection & Returns Policy</span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          Please inspect the outer packaging before signing off with the delivery rider. If you need to exchange a size or request a return, contact our support team at <strong className="underline">evoque.hq@gmail.com</strong> or WhatsApp <strong className="font-mono">+880 1603642630</strong> within 7 days of delivery with your Order ID and attached PDF invoice.
        </p>
      </div>
    </div>
  );
};
