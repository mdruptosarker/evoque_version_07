import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Package, FileText, Upload, LogOut, Phone, MapPin, CheckCircle2, Truck, ShieldAlert, Sparkles } from 'lucide-react';
import { generateOrderInvoicePDF } from '../utils/pdfGenerator';
import { SEO } from '../components/common/SEO';

interface ProfilePageProps {
  setActivePage: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setActivePage }) => {
  const { currentUser, orders, updateProfile, logout, setIsAuthModalOpen, setAuthModalMode } = useStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(currentUser?.shippingAddress || '');
  const [profilePicUrl, setProfilePicUrl] = useState(currentUser?.profilePicture || '');
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm text-center space-y-4">
        <User className="w-12 h-12 text-neutral-300 mx-auto stroke-1" />
        <h2 className="font-serif font-bold text-2xl text-neutral-900">Sign In to Your Profile</h2>
        <p className="text-sm text-neutral-500">Access your order history, live courier tracking, and downloadable PDF tax invoices.</p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => { setIsAuthModalOpen(true); setAuthModalMode('login'); }}
            className="px-6 py-3 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black"
          >
            Log In
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

  const userOrders = orders.filter(o => o.customerId === currentUser.id || o.customerEmail.toLowerCase() === currentUser.email.toLowerCase());

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      shippingAddress,
      profilePicture: profilePicUrl
    });
    setIsEditing(false);
    setSuccessMsg('Profile details and photo updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Handle file upload simulation / conversion to base64 per Section 4
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePicUrl(result);
        updateProfile({ profilePicture: result });
        setSuccessMsg('Profile photo uploaded and synced!');
        setTimeout(() => setSuccessMsg(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-12">
      <SEO title="My Profile & Orders | EVOQUE" />
      
      {/* Header Banner */}
      <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          
          {/* Profile Picture Upload per Section 4 */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-neutral-900 text-white flex items-center justify-center font-serif font-bold text-3xl overflow-hidden border-4 border-white shadow-md">
              {profilePicUrl || currentUser.profilePicture ? (
                <img src={profilePicUrl || currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
            </div>
            <label 
              title="Upload / Change Profile Picture"
              className="absolute bottom-0 right-0 p-2 bg-neutral-900 hover:bg-black text-white rounded-full cursor-pointer shadow-md transition-transform hover:scale-110"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-900">
                {currentUser.name}
              </h1>
              {currentUser.role === 'admin' && (
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded-md">
                  Admin Access
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 font-mono">{currentUser.email}</p>
            <p className="text-xs text-neutral-400">
              Member since {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActivePage('admin')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all border border-neutral-200"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>

          <button
            onClick={() => { logout(); setActivePage('home'); }}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all border border-rose-200 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6 animate-fade-in">
          <h3 className="font-serif font-bold text-lg text-neutral-900 pb-3 border-b border-neutral-200">
            Edit Account & Shipping Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Phone Number (For COD Courier)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Default Shipping Address (Bangladesh)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House, Road, Area, District"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Profile Picture URL (Optional fallback to file upload above)
              </label>
              <input
                type="url"
                value={profilePicUrl}
                onChange={(e) => setProfilePicUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-mono text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-black"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Order History Section per Section 6 & 11 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Account Activity
            </span>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 mt-0.5 flex items-center gap-2">
              <Package className="w-6 h-6 text-neutral-700" />
              <span>Order History & Invoices</span>
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold bg-neutral-100 px-3 py-1 rounded-full text-neutral-700">
            {userOrders.length} Order(s)
          </span>
        </div>

        {userOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center space-y-4 shadow-xs">
            <Package className="w-12 h-12 text-neutral-300 mx-auto stroke-1" />
            <h3 className="font-serif font-bold text-lg text-neutral-800">No previous orders found</h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              Once you place a Cash on Delivery order, you will be able to track live courier dispatch status and download official tax invoices here.
            </p>
            <button
              onClick={() => setActivePage('products')}
              className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition-all"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => {
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
                  className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden transition-all hover:border-neutral-300"
                >
                  {/* Order Header */}
                  <div className="p-6 bg-neutral-50/80 border-b border-neutral-200/80 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-extrabold text-base text-neutral-900">
                          #{order.id}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusBadgeColor} flex items-center gap-1.5 shadow-2xs`}>
                          {isShipped && <Truck className="w-3.5 h-3.5" />}
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Section 6 rule: Download / View PDF Invoice button */}
                      <button
                        onClick={() => generateOrderInvoicePDF(order, 'download')}
                        className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                        title="Download official PDF invoice"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Download PDF Invoice</span>
                      </button>

                      <button
                        onClick={() => generateOrderInvoicePDF(order, 'open')}
                        className="px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all"
                        title="View PDF invoice in browser"
                      >
                        View Invoice
                      </button>
                    </div>
                  </div>

                  {/* Courier Tracking Box if shipped per Section 12 */}
                  {order.trackingNumber && (
                    <div className="bg-emerald-50/70 border-b border-emerald-200/60 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Handed to Courier Partner: <strong className="font-bold">{order.courierName || 'Steadfast Courier'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 font-mono bg-white px-3 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                        <span className="text-neutral-400">Tracking #:</span>
                        <span className="font-bold text-neutral-900">{order.trackingNumber}</span>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="p-6 space-y-4">
                    <div className="divide-y divide-neutral-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80'} 
                              alt={item.name} 
                              className="w-12 h-14 object-cover rounded-lg bg-neutral-100 shrink-0"
                            />
                            <div>
                              <h4 className="font-serif font-bold text-sm text-neutral-900">{item.name}</h4>
                              <p className="text-xs text-neutral-500 font-mono">
                                SKU: {item.code} | Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-neutral-900 font-mono">
                            ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Financial Totals */}
                    <div className="pt-4 border-t border-neutral-200 bg-neutral-50/50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div className="space-y-1 text-neutral-600">
                        <p>Shipping Address: <strong className="text-neutral-900">{order.shippingAddress}</strong></p>
                        <p>Phone: <strong className="font-mono text-neutral-900">{order.phone}</strong> | Payment: <strong className="text-amber-800 font-semibold">{order.paymentMethod}</strong></p>
                      </div>

                      <div className="space-y-1 text-right w-full sm:w-auto">
                        <div className="flex justify-between sm:justify-end gap-6 text-neutral-500">
                          <span>Subtotal:</span>
                          <span className="font-semibold text-neutral-900">৳{(order.subtotal || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-6 text-neutral-500">
                          <span>Delivery Charge (Flat BDT):</span>
                          <span className="font-semibold text-neutral-900">৳{(order.deliveryCharge || 0).toLocaleString()}</span>
                        </div>
                        {(order.discountAmount || 0) > 0 && (
                          <div className="flex justify-between sm:justify-end gap-6 text-emerald-600 font-medium">
                            <span>Coupon Discount:</span>
                            <span>- ৳{(order.discountAmount || 0).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between sm:justify-end gap-6 text-sm font-extrabold text-neutral-950 pt-1 border-t border-neutral-200">
                          <span>Grand Total:</span>
                          <span>৳{(order.total || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
