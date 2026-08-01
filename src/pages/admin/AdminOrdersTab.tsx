import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Truck, FileText, CheckCircle2, AlertCircle, Phone, MapPin, Mail, Plus, X, User as UserIcon, Calculator } from 'lucide-react';
import { generateOrderInvoicePDF } from '../../utils/pdfGenerator';
import { Order, Product } from '../../types';

export const AdminOrdersTab: React.FC = () => {
  const { orders, products, updateOrderStatus, createManualInvoice } = useStore();
  const [successMsg, setSuccessMsg] = useState('');
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({});

  // Manual Invoice Modal state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('+880');
  const [custAddress, setCustAddress] = useState('Local Shop Sale / Storefront Pickup');
  const [custEmail, setCustEmail] = useState('');
  const [customDeliveryCharge, setCustomDeliveryCharge] = useState<number>(0);
  const [customDiscount, setCustomDiscount] = useState<number>(0);

  // Items added to manual invoice
  const [manualItems, setManualItems] = useState<{
    product: Product;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
    customPrice?: number;
  }[]>([]);

  // Item selector state
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [itemQty, setItemQty] = useState<number>(1);
  const [itemSize, setItemSize] = useState<string>('');
  const [itemColor, setItemColor] = useState<string>('');

  const handleAddItemToInvoice = () => {
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    setManualItems(prev => [
      ...prev,
      {
        product: prod,
        quantity: itemQty,
        selectedSize: itemSize || prod.variants?.size?.[0],
        selectedColor: itemColor || prod.variants?.color?.[0],
        customPrice: prod.price
      }
    ]);

    // reset item form
    setItemQty(1);
    setItemSize('');
    setItemColor('');
  };

  const handleRemoveManualItem = (index: number) => {
    setManualItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) {
      alert('Customer Name and Phone Number are required for invoice.');
      return;
    }
    if (manualItems.length === 0) {
      alert('Please add at least one product item to the invoice.');
      return;
    }

    const newOrder = createManualInvoice({
      customerName: custName.trim(),
      customerEmail: custEmail.trim() || undefined,
      phone: custPhone.trim(),
      shippingAddress: custAddress.trim() || 'Direct Local Sale',
      items: manualItems,
      deliveryCharge: customDeliveryCharge,
      discountAmount: customDiscount
    });

    // Generate & download PDF immediately
    generateOrderInvoicePDF(newOrder, 'download');

    setSuccessMsg(`Manual Invoice #${newOrder.id} created successfully! PDF downloaded.`);
    setIsManualModalOpen(false);

    // Reset form
    setCustName('');
    setCustPhone('+880');
    setCustAddress('Local Shop Sale / Storefront Pickup');
    setCustEmail('');
    setCustomDeliveryCharge(0);
    setCustomDiscount(0);
    setManualItems([]);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const manualSubtotal = manualItems.reduce((sum, item) => sum + ((item.customPrice ?? item.product.price) * item.quantity), 0);
  const manualTotal = Math.max(0, manualSubtotal + customDeliveryCharge - customDiscount);

  const handleStatusChange = (order: Order, newStatus: Order['status']) => {
    const trackingNo = trackingInput[order.id] || order.trackingNumber || `STF-${Math.floor(100000 + Math.random() * 900000)}`;
    
    updateOrderStatus(order.id, newStatus, 'Steadfast Courier', trackingNo);
    
    if (newStatus === 'Shipped — with delivery company') {
      setSuccessMsg(`Order #${order.id} updated to Shipped! Steadfast tracking email sent to ${order.customerEmail}.`);
    } else {
      setSuccessMsg(`Order #${order.id} status updated to "${newStatus}".`);
    }
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header with Manual Invoice Trigger */}
      <div className="pb-6 border-b border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-900 flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-neutral-800" />
            <span>Order & POS Invoice Management</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage online Cash on Delivery orders or generate manual invoices for offline local sales.
          </p>
        </div>

        <button
          onClick={() => {
            if (products.length > 0 && !selectedProductId) {
              setSelectedProductId(products[0].id);
            }
            setIsManualModalOpen(true);
          }}
          className="px-5 py-3 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Create Manual Invoice / Offline Sale</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-16 text-center space-y-3 shadow-xs">
            <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto stroke-1" />
            <h3 className="font-serif font-bold text-lg text-neutral-800">No customer orders recorded yet</h3>
            <p className="text-sm text-neutral-500">New Cash on Delivery orders placed on the storefront will appear here instantly.</p>
          </div>
        ) : (
          orders.map((order) => {
            const isShipped = order.status === 'Shipped — with delivery company';
            const isDelivered = order.status === 'Delivered';
            
            const statusBadgeColor = isShipped || isDelivered 
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
              : order.status === 'Cancelled' 
              ? 'bg-rose-100 text-rose-800 border-rose-300' 
              : 'bg-amber-100 text-amber-800 border-amber-300';

            return (
              <div 
                key={order.id} 
                className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden transition-all hover:border-neutral-300"
              >
                {/* Order Top Bar */}
                <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-lg text-neutral-900">
                        #{order.id}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusBadgeColor} flex items-center gap-1.5 shadow-2xs`}>
                        {isShipped && <Truck className="w-3.5 h-3.5" />}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Placed on {new Date(order.createdAt || Date.now()).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Section 6 rule: PDF Invoice Download button */}
                    <button
                      onClick={() => generateOrderInvoicePDF(order, 'download')}
                      className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                      title="Download official PDF invoice"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download Invoice PDF</span>
                    </button>

                    <button
                      onClick={() => generateOrderInvoicePDF(order, 'open')}
                      className="px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all"
                    >
                      View Invoice
                    </button>
                  </div>
                </div>

                {/* Customer Logistics & Status Selector Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-white">
                  
                  {/* Left: Customer & Shipping Details */}
                  <div className="md:col-span-6 space-y-3 text-xs border-b md:border-b-0 md:border-r border-neutral-200 pb-4 md:pb-0 md:pr-6">
                    <h4 className="font-serif font-bold text-sm text-neutral-900">Customer & Shipping Information</h4>
                    
                    <div className="space-y-2 text-neutral-700">
                      <p className="flex items-center gap-2">
                        <strong className="text-neutral-950 font-semibold">{order.customerName}</strong>
                      </p>
                      <p className="flex items-center gap-2 text-neutral-600">
                        <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{order.customerEmail}</span>
                      </p>
                      <p className="flex items-center gap-2 font-mono text-neutral-900">
                        <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{order.phone}</span>
                      </p>
                      <p className="flex items-start gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-neutral-800 font-medium mt-2">
                        <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                        <span>{order.shippingAddress}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Section 12 Status Control & Steadfast Courier Injection */}
                  <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h4 className="font-serif font-bold text-sm text-neutral-900 flex items-center justify-between">
                        <span>Dispatch Status & Courier Management</span>
                        <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">COD Fixed</span>
                      </h4>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                          Update Order Workflow Status *
                        </label>
                        <select
                          value={order.status}
                          onChange={(e: any) => handleStatusChange(order, e.target.value)}
                          className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black cursor-pointer"
                        >
                          <option value="Processing">Processing (Atelier Studio)</option>
                          <option value="Shipped — with delivery company">Shipped — with delivery company (Steadfast Courier)</option>
                          <option value="Delivered">Delivered (COD Cash Received)</option>
                          <option value="Cancelled">Cancelled / Returned</option>
                        </select>
                      </div>

                      {/* Steadfast Courier Tracking Code Input */}
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                          Steadfast Tracking Number (Auto-generates if blank)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={trackingInput[order.id] ?? (order.trackingNumber || '')}
                            onChange={(e) => setTrackingInput({ ...trackingInput, [order.id]: e.target.value })}
                            placeholder="e.g. STF-892104"
                            className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono uppercase"
                          />
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order, 'Shipped — with delivery company')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase rounded-xl shadow-2xs"
                          >
                            Send Courier Update
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-neutral-400 italic">
                      Setting status to "Shipped — with delivery company" dispatches an automated HTML notification email to the customer per Section 9.
                    </p>
                  </div>

                </div>

                {/* Items & Financial Totals Footer */}
                <div className="p-6 bg-neutral-50/70 border-t border-neutral-200 space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-neutral-700">
                    Ordered Garments ({order.items.length})
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-200/80 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-lg bg-neutral-100 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-serif font-bold text-neutral-900 truncate">{item.name}</p>
                            <p className="text-[10px] text-neutral-400 font-mono">SKU: {item.code} | Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-neutral-900 shrink-0">
                          ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="text-neutral-500">
                      <span>Payment Method: </span>
                      <strong className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-[11px]">Cash on Delivery (COD Only)</strong>
                    </div>

                    <div className="flex items-center gap-6 font-semibold">
                      <span className="text-neutral-500">Subtotal: ৳{(order.subtotal || 0).toLocaleString()}</span>
                      <span className="text-neutral-500">Delivery: ৳{(order.deliveryCharge || 0).toLocaleString()}</span>
                      {(order.discountAmount || 0) > 0 && <span className="text-emerald-600">Discount: -৳{(order.discountAmount || 0).toLocaleString()}</span>}
                      <span className="font-serif font-extrabold text-base text-neutral-950">Total COD: ৳{(order.total || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Manual Invoice Creation Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8 space-y-6 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-neutral-900 text-amber-400 rounded-xl">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-neutral-900">
                    Create Manual Invoice / POS Sale
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Issue invoices for over-the-counter or direct offline customer purchases.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualSubmit} className="space-y-6">
              
              {/* Customer Info Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+880 1700 000000"
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Delivery / Pickup Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    placeholder="e.g. Dhanmondi 27, Dhaka or Store Counter Pickup"
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Customer Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Add Items Section */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <span>Add Products to Invoice</span>
                  <span className="text-[10px] font-mono bg-neutral-200 px-2 py-0.5 rounded text-neutral-800">Inventory Stock Auto-deducts</span>
                </h4>

                <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Select Product
                      </label>
                      <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} — BDT ৳{p.price.toLocaleString()} (Stock: {p.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={itemQty}
                        onChange={(e) => setItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-center"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Size
                      </label>
                      <input
                        type="text"
                        value={itemSize}
                        onChange={(e) => setItemSize(e.target.value)}
                        placeholder="M / Free"
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleAddItemToInvoice}
                        className="w-full py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* List of Added Items */}
                  {manualItems.length > 0 ? (
                    <div className="pt-3 border-t border-neutral-200 space-y-2">
                      <p className="text-xs font-semibold text-neutral-700">Items in this Sale ({manualItems.length}):</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {manualItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-bold text-neutral-900 truncate">{item.product.name}</span>
                              {item.selectedSize && <span className="bg-neutral-200 px-1.5 py-0.5 rounded text-[10px] font-mono">Size: {item.selectedSize}</span>}
                              <span className="text-neutral-500 font-mono">x{item.quantity}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-neutral-900">
                                ৳{((item.customPrice ?? item.product.price) * item.quantity).toLocaleString()}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveManualItem(idx)}
                                className="p-1 text-neutral-400 hover:text-rose-600 rounded-md"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic text-center py-2">
                      No products added yet. Choose a product above and click "Add".
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Charge, Discount & Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Delivery Charge (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={customDeliveryCharge}
                    onChange={(e) => setCustomDeliveryCharge(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="0 for shop pickup"
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Special Discount (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="0"
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-neutral-200 flex items-center justify-between font-serif">
                  <span className="text-sm font-bold text-neutral-700">Calculated Invoice Total:</span>
                  <span className="text-xl font-extrabold text-neutral-950 font-mono">
                    ৳{manualTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Save Sale & Generate PDF Invoice</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
