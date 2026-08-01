import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, CategoryItem, User, Order, Coupon, CartItem, EmailNotification, OrderStatus 
} from '../types';
import { 
  INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_USERS, INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_EMAILS, SEED_ADMIN_USER, SEED_CUSTOMER_USER 
} from '../data/initialData';
import { productUrlService } from '../services/productUrlService';
import { sitemapService } from '../services/sitemap/sitemapService';

// SECTION 7 FEATURE FLAG: Keep coupon UI hidden on customer checkout until flipped to true
export const FEATURE_COUPONS_ENABLED = false;

interface StoreContextType {
  products: Product[];
  categories: CategoryItem[];
  users: User[];
  currentUser: User | null;
  orders: Order[];
  coupons: Coupon[];
  cart: CartItem[];
  emails: EmailNotification[];
  
  // UI States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isEmailInboxOpen: boolean;
  setIsEmailInboxOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  
  // Filtering & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategorySlug: string;
  setSelectedCategorySlug: (slug: string) => void;

  // Auth Methods
  login: (email: string, passwordHash: string) => { success: boolean; message: string; user?: User };
  signup: (userData: Omit<User, 'id' | 'role' | 'createdAt'>) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  quickSwitchUser: (role: 'admin' | 'customer' | 'guest') => void;
  deleteUser: (userId: string) => void;

  // Cart Methods
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => { success: boolean; message: string };
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  deliveryCharge: number; // Flat BDT 120

  // Order & Checkout Methods
  placeOrder: (shippingAddress: string, phone: string, appliedCouponCode?: string) => Order | null;
  createManualInvoice: (manualData: {
    customerName: string;
    customerEmail?: string;
    phone: string;
    shippingAddress: string;
    items: { product: Product; quantity: number; selectedSize?: string; selectedColor?: string; customPrice?: number }[];
    deliveryCharge?: number;
    discountAmount?: number;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courierName?: string) => void;

  // Admin CRUD Methods
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCategory: (categoryData: Omit<CategoryItem, 'id'>) => void;
  deleteCategory: (id: string) => void;

  addCoupon: (couponData: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, updated: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, orderSubtotal: number) => { valid: boolean; discountAmount: number; message: string; coupon?: Coupon };

  // Email Notification Helper
  addEmailNotification: (notification: Omit<EmailNotification, 'id' | 'timestamp'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_PREFIX = 'EVOQUE_APP_V1_';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization with localStorage fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'products');
    const rawList: Product[] = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    let catalogAcc: Product[] = [];
    return rawList.map(p => {
      const ensured = productUrlService.ensureProductUrl(p, catalogAcc);
      catalogAcc.push(ensured);
      return ensured;
    });
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [emails, setEmails] = useState<EmailNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'emails');
    if (saved) {
      const parsed: EmailNotification[] = JSON.parse(saved);
      return parsed.filter(e => e.recipientEmail !== 'tanvir@example.com');
    }
    return INITIAL_EMAILS;
  });

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isEmailInboxOpen, setIsEmailInboxOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');

  const deliveryCharge = 120; // Fixed flat rate for all Bangladesh

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'emails', JSON.stringify(emails)); }, [emails]);

  // Auth Functions
  const login = (email: string, passwordHash: string) => {
    const envAdminEmail = (import.meta as any).env?.VITE_ADMIN_EMAIL || 'mdruptos@gmail.com';
    const envAdminPass = (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'rupto2958@';

    // Allow executive login via configured VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD
    if (email.toLowerCase() === envAdminEmail.toLowerCase() && passwordHash === envAdminPass) {
      const adminUser = users.find(u => u.role === 'admin') || SEED_ADMIN_USER;
      const updatedAdmin = { ...adminUser, email: envAdminEmail };
      setCurrentUser(updatedAdmin);
      setIsAuthModalOpen(false);
      return { success: true, message: `Welcome back, ${updatedAdmin.name}!`, user: updatedAdmin };
    }

    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash);
    if (!foundUser) {
      return { success: false, message: 'Invalid email or password. Please verify your credentials.' };
    }
    setCurrentUser(foundUser);
    setIsAuthModalOpen(false);
    return { success: true, message: `Welcome back, ${foundUser.name}!`, user: foundUser };
  };

  const signup = (userData: Omit<User, 'id' | 'role' | 'createdAt'>) => {
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: User = {
      ...userData,
      id: 'usr-' + Date.now().toString(36),
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    // Trigger Welcome Email (Section 9)
    addEmailNotification({
      recipientEmail: newUser.email,
      recipientName: newUser.name,
      subject: 'Welcome to EVOQUE — Account Confirmed',
      eventType: 'SIGN_UP_WELCOME',
      htmlContent: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAF9F6; color: #1a1a1a; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h1 style="letter-spacing: 0.15em; font-weight: 300; margin-bottom: 8px;">EVOQUE</h1>
        <p style="color: #666; font-size: 14px; margin-top: 0; margin-bottom: 24px;">HIGH-FASHION ESSENTIALS</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
        <h2 style="font-size: 20px; font-weight: 400;">Welcome, ${newUser.name}.</h2>
        <p style="line-height: 1.6; color: #444;">Your EVOQUE customer account has been successfully created. You now have exclusive access to our seasonal drops, personalized tracking, and rapid Cash on Delivery checkout across Bangladesh.</p>
        <div style="margin: 32px 0; padding: 20px; background: #fff; border-radius: 8px; border: 1px solid #eee;">
          <p style="margin: 0; font-size: 13px; color: #888;">SHIPPING ADDRESS ON FILE</p>
          <p style="margin: 4px 0 0 0; font-weight: 500;">${newUser.shippingAddress || 'Not specified'}</p>
        </div>
        <p style="font-size: 13px; color: #777; margin-top: 32px;">Thank you for stepping into the world of minimalist luxury.<br />— The EVOQUE Team</p>
      </div>`
    });

    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const quickSwitchUser = (role: 'admin' | 'customer' | 'guest') => {
    if (role === 'admin') setCurrentUser(SEED_ADMIN_USER);
    else if (role === 'customer') setCurrentUser(SEED_CUSTOMER_USER);
    else setCurrentUser(null);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser && currentUser.id === userId) {
      logout();
    }
  };

  // Cart Functions
  const addToCart = (product: Product, quantity = 1, selectedSize?: string, selectedColor?: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      setAuthModalMode('login');
      return { success: false, message: 'Please login or sign up to add items to cart.' };
    }
    if (product.stock <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => 
        item.product.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stock);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [...prevCart, { product, quantity: Math.min(quantity, product.stock), selectedSize, selectedColor }];
      }
    });

    setIsCartOpen(true);
    return { success: true, message: `${product.name} added to cart.` };
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)));
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor) {
        return { ...item, quantity: Math.min(quantity, item.product.stock) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  // Coupon Validation
  const validateCoupon = (code: string, orderSubtotal: number) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon || !coupon.active) {
      return { valid: false, discountAmount: 0, message: 'Invalid or inactive coupon code.' };
    }
    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, discountAmount: 0, message: 'This coupon has expired.' };
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discountAmount: 0, message: 'Coupon usage limit has been reached.' };
    }
    if (orderSubtotal < (coupon.minOrderValue || (coupon as any).minOrderAmount || 0)) {
      return { valid: false, discountAmount: 0, message: `Minimum order value of BDT ${(coupon.minOrderValue || (coupon as any).minOrderAmount || 0).toLocaleString()} required.` };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((orderSubtotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    return { valid: true, discountAmount: discount, message: `Coupon applied: ${coupon.code}`, coupon };
  };

  // Order & Checkout Functions
  const placeOrder = (shippingAddress: string, phone: string, appliedCouponCode?: string): Order | null => {
    if (!currentUser || cart.length === 0) return null;

    const subtotal = getCartSubtotal();
    let discountAmount = 0;
    if (appliedCouponCode && FEATURE_COUPONS_ENABLED) {
      const validation = validateCoupon(appliedCouponCode, subtotal);
      if (validation.valid) {
        discountAmount = validation.discountAmount;
        // Increment usage count
        if (validation.coupon) {
          updateCoupon(validation.coupon.id, { usedCount: validation.coupon.usedCount + 1 });
        }
      }
    }

    const total = subtotal + deliveryCharge - discountAmount;
    const orderId = 'EVQ-ORD-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      id: orderId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      shippingAddress: shippingAddress || currentUser.shippingAddress || 'Dhaka, Bangladesh',
      phone: phone || currentUser.phone || '+880',
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        code: item.product.code,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      })),
      subtotal,
      deliveryCharge,
      discountAmount,
      total,
      paymentMethod: 'Cash on Delivery',
      status: 'Processing',
      createdAt: new Date().toISOString()
    };

    // 1. Save Order
    setOrders(prev => [newOrder, ...prev]);

    // 2. Decrement Stock for each item (Section 5 rule: flips to out of stock automatically)
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const cartMatch = cart.find(ci => ci.product.id === prod.id);
        if (cartMatch) {
          const newStock = Math.max(0, prod.stock - cartMatch.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      });
    });

    // 3. Send Order Confirmation Email (Section 9)
    const itemsTableRows = newOrder.items.map(i => `
      <tr>
        <td style="padding: 8px 0; color: #444;">${i.name} ${i.selectedSize ? `(Size: ${i.selectedSize})` : ''} x${i.quantity}</td>
        <td style="text-align: right; font-weight: 500;">৳${((i.price || 0) * (i.quantity || 1)).toLocaleString()}</td>
      </tr>
    `).join('');

    addEmailNotification({
      recipientEmail: newOrder.customerEmail,
      recipientName: newOrder.customerName,
      subject: `Order Confirmed: #${newOrder.id} — Cash on Delivery`,
      eventType: 'ORDER_PLACED',
      relatedOrderId: newOrder.id,
      htmlContent: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAF9F6; color: #1a1a1a; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h1 style="letter-spacing: 0.15em; font-weight: 300; margin-bottom: 8px;">EVOQUE</h1>
        <p style="color: #666; font-size: 14px; margin-top: 0;">ORDER CONFIRMATION</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
        <h2 style="font-size: 18px; font-weight: 400;">Thank you for your order, ${newOrder.customerName}!</h2>
        <p style="line-height: 1.6; color: #444;">We have received your order <strong>#${newOrder.id}</strong> and are preparing it for dispatch from our Dhaka studio. You can download your official PDF Invoice anytime from your profile.</p>
        <div style="margin: 24px 0; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${itemsTableRows}
            <tr style="border-top: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Delivery Charge (Flat BDT)</td><td style="text-align: right; font-weight: 500;">৳120</td></tr>
            <tr style="border-top: 1px solid #ddd; font-weight: 600; font-size: 16px;"><td style="padding: 12px 0;">Grand Total</td><td style="text-align: right; color: #000;">৳${(newOrder.total || 0).toLocaleString()}</td></tr>
          </table>
        </div>
        <div style="background: #eef2ff; border-left: 4px solid #4f46e5; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; color: #312e81;"><strong>Payment Method: Cash on Delivery (COD)</strong><br />Please keep exact cash ready upon delivery by our courier partner.</p>
        </div>
        <p style="font-size: 13px; color: #777;">Thank you for shopping with EVOQUE.</p>
      </div>`
    });

    // 4. Clear Cart
    clearCart();
    setIsCartOpen(false);
    return newOrder;
  };

  const createManualInvoice = (manualData: {
    customerName: string;
    customerEmail?: string;
    phone: string;
    shippingAddress: string;
    items: { product: Product; quantity: number; selectedSize?: string; selectedColor?: string; customPrice?: number }[];
    deliveryCharge?: number;
    discountAmount?: number;
  }): Order => {
    const delCharge = manualData.deliveryCharge ?? deliveryCharge;
    const discAmount = manualData.discountAmount ?? 0;
    
    const subtotal = manualData.items.reduce((sum, item) => {
      const itemPrice = item.customPrice ?? item.product.price;
      return sum + (itemPrice * item.quantity);
    }, 0);
    
    const total = Math.max(0, subtotal + delCharge - discAmount);
    const orderId = 'EVQ-POS-' + Math.floor(10000 + Math.random() * 90000);

    const newOrder: Order = {
      id: orderId,
      customerId: 'pos-manual-' + Date.now().toString(36),
      customerName: manualData.customerName,
      customerEmail: manualData.customerEmail || 'pos-client@evoque.bd',
      shippingAddress: manualData.shippingAddress || 'Direct Offline Sale / Local Shop',
      phone: manualData.phone || '+880',
      items: manualData.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        code: item.product.code,
        price: item.customPrice ?? item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      })),
      subtotal,
      deliveryCharge: delCharge,
      discountAmount: discAmount,
      total,
      paymentMethod: 'Cash on Delivery',
      status: 'Delivered',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Decrement stock for sold products
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const match = manualData.items.find(i => i.product.id === prod.id);
        if (match) {
          return { ...prod, stock: Math.max(0, prod.stock - match.quantity) };
        }
        return prod;
      });
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string, courierName?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const updated = { ...ord, status, trackingNumber: trackingNumber || ord.trackingNumber, courierName: courierName || ord.courierName };
        
        // If marked Shipped (Section 9 & 12 rule), trigger email notification!
        if (status === 'Shipped — with delivery company' && ord.status !== status) {
          addEmailNotification({
            recipientEmail: ord.customerEmail,
            recipientName: ord.customerName,
            subject: `Order Shipped: #${ord.id} — On Its Way!`,
            eventType: 'ORDER_SHIPPED',
            relatedOrderId: ord.id,
            htmlContent: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAF9F6; color: #1a1a1a; border: 1px solid #e5e5e5; border-radius: 12px;">
              <h1 style="letter-spacing: 0.15em; font-weight: 300; margin-bottom: 8px;">EVOQUE</h1>
              <p style="color: #666; font-size: 14px; margin-top: 0;">DISPATCH NOTIFICATION</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
              <h2 style="font-size: 18px; font-weight: 400;">Great news, ${ord.customerName}!</h2>
              <p style="line-height: 1.6; color: #444;">Your order <strong>#${ord.id}</strong> has been handed over to our courier partner <strong>${updated.courierName || 'Steadfast Courier'}</strong> and is currently on its way to your delivery address.</p>
              ${updated.trackingNumber ? `<div style="margin: 20px 0; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #ddd;"><p style="margin: 0; font-size: 12px; color: #888;">COURIER TRACKING NUMBER</p><p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; letter-spacing: 0.05em; color: #111;">${updated.trackingNumber}</p></div>` : ''}
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 24px 0;">
                <p style="margin: 0; font-size: 13px; color: #92400e;"><strong>Reminder: Cash on Delivery</strong><br />Please keep BDT ${(ord.total || 0).toLocaleString()} cash ready for the delivery rider.</p>
              </div>
              <p style="font-size: 13px; color: #777;">You can track your order status live from your EVOQUE profile page.</p>
            </div>`
          });
        }
        return updated;
      }
      return ord;
    }));
  };

  // Admin CRUD Methods
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const rawProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now().toString(36),
      createdAt: new Date().toISOString()
    };
    const newProduct = productUrlService.ensureProductUrl(rawProduct, products);
    const updatedList = [newProduct, ...products];
    setProducts(updatedList);
    // Real-time automated sitemap regeneration
    sitemapService.regenerateSitemap('products', updatedList, categories, 'product_crud');
    sitemapService.regenerateSitemap('images', updatedList, categories, 'product_crud');
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => {
      const updatedList = prev.map(p => {
        if (p.id === id) {
          let merged = { ...p, ...updated };
          if (updated.slug && updated.slug !== p.slug) {
            // Admin explicitly requested slug update with 301 redirect
            const { updatedProduct } = productUrlService.updateProductSlug(merged, updated.slug, prev);
            merged = updatedProduct;
          } else {
            merged = productUrlService.ensureProductUrl(merged, prev);
          }
          return merged;
        }
        return p;
      });
      // Real-time automated sitemap regeneration
      sitemapService.regenerateSitemap('products', updatedList, categories, 'product_crud');
      sitemapService.regenerateSitemap('images', updatedList, categories, 'product_crud');
      return updatedList;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== id);
      // Real-time automated sitemap regeneration
      sitemapService.regenerateSitemap('products', filtered, categories, 'product_crud');
      sitemapService.regenerateSitemap('images', filtered, categories, 'product_crud');
      return filtered;
    });
  };

  const addCategory = (categoryData: Omit<CategoryItem, 'id'>) => {
    const newCat: CategoryItem = {
      ...categoryData,
      id: 'cat-' + Date.now().toString(36)
    };
    const updatedCats = [...categories, newCat];
    setCategories(updatedCats);
    sitemapService.regenerateSitemap('categories', products, updatedCats, 'product_crud');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => {
      const filtered = prev.filter(c => c.id !== id);
      sitemapService.regenerateSitemap('categories', products, filtered, 'product_crud');
      return filtered;
    });
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoup: Coupon = {
      ...couponData,
      id: 'coup-' + Date.now().toString(36),
      usedCount: 0
    };
    setCoupons(prev => [newCoup, ...prev]);
  };

  const updateCoupon = (id: string, updated: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const addEmailNotification = (notif: Omit<EmailNotification, 'id' | 'timestamp'>) => {
    const newEmail: EmailNotification = {
      ...notif,
      id: 'email-' + Date.now().toString(36),
      timestamp: new Date().toISOString()
    };
    setEmails(prev => [newEmail, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      users,
      currentUser,
      orders,
      coupons,
      cart,
      emails,
      isCartOpen,
      setIsCartOpen,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      isEmailInboxOpen,
      setIsEmailInboxOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      searchQuery,
      setSearchQuery,
      selectedCategorySlug,
      setSelectedCategorySlug,
      login,
      signup,
      logout,
      updateProfile,
      quickSwitchUser,
      deleteUser,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartSubtotal,
      deliveryCharge,
      placeOrder,
      createManualInvoice,
      updateOrderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      validateCoupon,
      addEmailNotification
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
