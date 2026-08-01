import { Product, CategoryItem, User, Order, Coupon, EmailNotification } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Outerwear',
    slug: 'outerwear',
    description: 'Tailored trench coats, structured blazers, and heavyweight wool overcoats.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-2',
    name: 'Knitwear',
    slug: 'knitwear',
    description: 'Ultra-soft merino wool sweaters, ribbed vests, and luxury cashmere turtlenecks.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-3',
    name: 'Tops & Shirts',
    slug: 'tops',
    description: 'Minimalist heavyweight cotton tees, silk blouses, and oxford button-downs.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-4',
    name: 'Bottoms',
    slug: 'bottoms',
    description: 'Pleated wide-leg trousers, tailored wool pants, and structured denim.',
    image: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-5',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Leather belts, minimalist wool scarves, and structured carry bags.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    name: 'Tailored Italian Wool Overcoat',
    code: 'EVQ-OW-001',
    category: 'Outerwear',
    price: 18500,
    stock: 8,
    description: `- Crafted from 100% virgin Italian merino wool for supreme insulation without excess bulk.
- Features structured shoulders, peak lapels, and a double-breasted button silhouette.
- Fully lined with breathable viscose silk and internal welt pockets for valuables.
- Ideal for layering over tailored suits or elevating casual streetwear.
- Dry clean only by professional leather and wool care specialists.`,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      size: ['M', 'L', 'XL'],
      color: ['Charcoal Black', 'Camel', 'Midnight Navy'],
      fabric: '100% Italian Virgin Wool',
      fit: 'Relaxed Tailored Fit',
      careInstructions: 'Dry Clean Only. Steam on low heat.'
    },
    featured: true,
    createdAt: '2026-07-01T10:00:00Z'
  },
  {
    id: 'prod-102',
    name: 'Silk-Blend Cashmere Turtleneck',
    code: 'EVQ-KN-002',
    category: 'Knitwear',
    price: 9200,
    stock: 14,
    description: `- An ultra-fine knit sweater combining Grade-A Mongolian cashmere with pure mulberry silk.
- Designed with seamless shoulder construction for a smooth, irritation-free drape.
- Ribbed collar and cuffs maintain elasticity and shape over years of wear.
- Perfect thermal regulation: lightweight warmth in autumn, breathable comfort indoors.`,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      size: ['S', 'M', 'L', 'XL'],
      color: ['Cream Off-White', 'Obsidian Black', 'Sage Green'],
      fabric: '70% Cashmere, 30% Mulberry Silk',
      fit: 'Slim Modern Fit'
    },
    featured: true,
    createdAt: '2026-07-05T12:00:00Z'
  },
  {
    id: 'prod-103',
    name: 'Heavyweight Minimalist Boxy Tee',
    code: 'EVQ-TP-003',
    category: 'Tops & Shirts',
    price: 3800,
    stock: 25,
    description: `- Heavyweight 280 GSM organic combed cotton jersey that never loses its boxy structure.
- Drop-shoulder silhouette with an enhanced ribbed collar that refuses to stretch or sag.
- Pre-shrunk garment wash treatment provides a luxurious, lived-in hand feel from day one.
- The quintessential luxury essential for any capsule wardrobe.`,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      size: ['S', 'M', 'L', 'XL', 'XXL'],
      color: ['Pure White', 'Washed Black', 'Sand Dune'],
      fabric: '100% Organic Combed Cotton (280 GSM)',
      fit: 'Oversized Boxy Fit',
      careInstructions: 'Machine wash cold inside out. Tumble dry low.'
    },
    featured: true,
    createdAt: '2026-07-10T09:30:00Z'
  },
  {
    id: 'prod-104',
    name: 'Pleated Wide-Leg Wool Trousers',
    code: 'EVQ-BT-004',
    category: 'Bottoms',
    price: 11500,
    stock: 10,
    description: `Sophisticated high-rise wide-leg trousers featuring double front pleats and a clean, fluid drape. Tailored with adjustable side waist tabs for a customized fit without needing a belt. Finished with horn buttons and deep seam pockets.`,
    images: [
      'https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      size: ['30', '32', '34', '36'],
      color: ['Taupe Grey', 'Midnight Navy', 'Black'],
      fabric: '95% Super 130s Wool, 5% Elastane',
      fit: 'High-Rise Wide Leg'
    },
    featured: true,
    createdAt: '2026-07-12T14:15:00Z'
  },
  {
    id: 'prod-105',
    name: 'Structured Double-Breasted Linen Blazer',
    code: 'EVQ-OW-005',
    category: 'Outerwear',
    price: 15400,
    stock: 5,
    description: `- Lightweight Belgian Normandy linen woven for breathability during humid summer evenings.
- Soft tailored canvassing that contours gracefully to your natural shoulder line.
- Genuine mother-of-pearl buttons and double back vents for unrestricted mobility.
- Can be styled formally with matching trousers or dressed down over basic tees.`,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      size: ['M', 'L', 'XL'],
      color: ['Oatmeal Cream', 'Slate Blue'],
      fabric: '100% Normandy Linen',
      fit: 'Regular Tailored Fit'
    },
    featured: false,
    createdAt: '2026-07-15T11:00:00Z'
  },
  {
    id: 'prod-106',
    name: 'Monogram Poplin Oxford Shirt',
    code: 'EVQ-TP-006',
    category: 'Tops & Shirts',
    price: 6500,
    stock: 0, // Out of stock example to demonstrate automatic out of stock handling
    description: `- Crisp 80s two-ply cotton poplin with a subtle silky luster and wrinkle-resistant finish.
- Features a French collar, single-needle stitching, and mother-of-pearl buttons.
- Subtle tone-on-tone EVOQUE monogram embroidery on the left gauntlet cuff.`,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      size: ['38', '40', '42', '44'],
      color: ['Sky Blue', 'Crisp White'],
      fabric: '100% Egyptian Cotton Poplin'
    },
    featured: false,
    createdAt: '2026-07-16T16:00:00Z'
  },
  {
    id: 'prod-107',
    name: 'Ribbed Merino Wool Vest',
    code: 'EVQ-KN-007',
    category: 'Knitwear',
    price: 7800,
    stock: 12,
    description: `A contemporary sleeveless sweater vest knitted in a chunky English rib structure. Designed with deep armholes and a relaxed V-neck for effortless layering over collared shirts or tees.`,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      size: ['M', 'L'],
      color: ['Ivory', 'Dark Brown'],
      fabric: '100% Extra-Fine Merino Wool'
    },
    featured: false,
    createdAt: '2026-07-18T10:00:00Z'
  },
  {
    id: 'prod-108',
    name: 'Full-Grain Italian Calfskin Leather Belt',
    code: 'EVQ-AC-008',
    category: 'Accessories',
    price: 5200,
    stock: 20,
    description: `- Handcrafted in Florence from vegetable-tanned full-grain calfskin leather that ages beautifully.
- Brushed stainless steel minimalist buckle with anti-scratch coating.
- Width: 3.5 cm — the versatile gold standard for both dress trousers and denim.`,
    images: [
      'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      size: ['90cm', '95cm', '100cm', '105cm'],
      color: ['Matte Black', 'Cognac Brown'],
      fabric: '100% Full-Grain Italian Leather'
    },
    featured: false,
    createdAt: '2026-07-20T15:30:00Z'
  }
];

// Seeded admin account from Section 12
export const SEED_ADMIN_USER: User = {
  id: 'admin-001',
  name: 'EVOQUE Managing Director',
  email: 'mdruptos@gmail.com',
  passwordHash: 'rupto2958@', // Stored in store and matched securely
  phone: '+880 1603642630',
  shippingAddress: 'Rangpur, Dhaka, Bangladesh',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00Z'
};

export const SEED_CUSTOMER_USER: User = {
  id: 'cust-001',
  name: 'Tanvir Ahmed',
  email: 'tanvir@example.com',
  passwordHash: 'password123',
  phone: '+880 1819-234567',
  shippingAddress: 'House 14, Road 7, Dhanmondi R/A, Dhaka-1205',
  role: 'customer',
  createdAt: '2026-07-10T11:00:00Z'
};

export const INITIAL_USERS: User[] = [SEED_ADMIN_USER, SEED_CUSTOMER_USER];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'EVOQUE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 5000,
    expiryDate: '2026-12-31',
    usageLimit: 100,
    usedCount: 12,
    active: true
  },
  {
    id: 'coup-2',
    code: 'VIPFLAT500',
    discountType: 'flat',
    discountValue: 500,
    minOrderValue: 3000,
    expiryDate: '2026-10-31',
    usageLimit: 50,
    usedCount: 5,
    active: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'EVQ-ORD-8921',
    customerId: 'cust-001',
    customerName: 'Tanvir Ahmed',
    customerEmail: 'tanvir@example.com',
    shippingAddress: 'House 14, Road 7, Dhanmondi R/A, Dhaka-1205',
    phone: '+880 1819-234567',
    items: [
      {
        productId: 'prod-101',
        name: 'Tailored Italian Wool Overcoat',
        code: 'EVQ-OW-001',
        price: 18500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
        selectedSize: 'L',
        selectedColor: 'Charcoal Black'
      },
      {
        productId: 'prod-103',
        name: 'Heavyweight Minimalist Boxy Tee',
        code: 'EVQ-TP-003',
        price: 3800,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
        selectedSize: 'L',
        selectedColor: 'Pure White'
      }
    ],
    subtotal: 26100,
    deliveryCharge: 120, // Flat ৳120 BDT
    discountAmount: 0,
    total: 26220,
    paymentMethod: 'Cash on Delivery',
    status: 'Shipped — with delivery company',
    courierName: 'Steadfast Courier',
    trackingNumber: 'SF-BD-994821',
    createdAt: '2026-07-22T14:30:00Z'
  },
  {
    id: 'EVQ-ORD-8922',
    customerId: 'cust-001',
    customerName: 'Tanvir Ahmed',
    customerEmail: 'tanvir@example.com',
    shippingAddress: 'House 14, Road 7, Dhanmondi R/A, Dhaka-1205',
    phone: '+880 1819-234567',
    items: [
      {
        productId: 'prod-102',
        name: 'Silk-Blend Cashmere Turtleneck',
        code: 'EVQ-KN-002',
        price: 9200,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
        selectedSize: 'M',
        selectedColor: 'Cream Off-White'
      }
    ],
    subtotal: 9200,
    deliveryCharge: 120,
    discountAmount: 0,
    total: 9320,
    paymentMethod: 'Cash on Delivery',
    status: 'Processing',
    createdAt: '2026-07-24T18:15:00Z'
  }
];

export const INITIAL_EMAILS: EmailNotification[] = [];
