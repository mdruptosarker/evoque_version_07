export interface ProductVariant {
  size?: string[];
  color?: string[];
  fabric?: string;
  fit?: string;
  careInstructions?: string;
}

export interface SEOImageData {
  detectedType: string;
  mainColor: string;
  secondaryColor: string;
  material: string;
  texture: string;
  style: string;
  gender: string;
  fashionCategory: string;
  brandVisibility: string;
  background: string;
  imageQualityScore: number;
  seoFileName: string;
  altText: string;
  titleAttribute: string;
  caption: string;
  imageDescription: string;
  accessibilityDescription: string;
  webpUrl?: string;
  blurDataUrl?: string;
  srcset?: string;
  sizes?: {
    thumb: string;
    w1200: string;
    w1600: string;
    w2000: string;
  };
}

export interface ProductSEOData {
  seoTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  slug: string;
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    imageAlt: string;
    type: string;
  };
  twitterCard: {
    cardType: string;
    title: string;
    description: string;
  };
  keywords: {
    primary: string;
    secondary: string[];
    longTail: string[];
    commercial: string[];
    buyerIntent: string[];
    semanticLSI: string[];
    bangladeshSpecific: string[];
    searchIntent: string;
    difficultyEstimate: 'Easy' | 'Medium' | 'Hard';
  };
  richContent: {
    shortDescription: string;
    longDescription: string;
    productHighlights: string[];
    bulletFeatures: string[];
    faq: { question: string; answer: string }[];
    buyingGuide: string;
    careInstructions: string;
    specificationsTable: Record<string, string>;
    comparisonTable: { feature: string; evoque: string; standard: string }[];
    relatedProductsSectionTitle: string;
  };
  headings: {
    h1: string;
    h2: string[];
    h3: string[];
    h4: string[];
  };
  schemas: {
    productJsonLd: Record<string, any>;
    offerSchema: Record<string, any>;
    brandSchema: Record<string, any>;
    breadcrumbSchema: Record<string, any>;
    reviewSchema: Record<string, any>;
    organizationSchema: Record<string, any>;
  };
  internalLinking: {
    relatedCategorySlugs: string[];
    crossSellKeywords: string[];
    upSellKeywords: string[];
  };
  audit: {
    seoScore: number;
    accessibilityScore: number;
    performanceScore: number;
    coreWebVitalsReady: boolean;
    warnings: string[];
    suggestions: string[];
  };
  imagesAnalysis: SEOImageData[];
  lastGeneratedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  code: string; // SKU / Unique product code
  slug?: string; // Permanent human-readable URL slug e.g. "tailored-italian-wool-overcoat"
  permalink?: string; // Permanent URL e.g. "https://evoque.today/products/tailored-italian-wool-overcoat"
  previousSlugs?: string[]; // Array of historical slugs for 301 redirects
  category: string;
  price: number; // in BDT ৳
  stock: number;
  description: string; // Can be plain text or bullet points (lines starting with - or *)
  images: string[];
  colorImages?: Record<string, string>; // Maps color name (e.g. "Black") to specific image URL/Data URL
  variants?: ProductVariant;
  featured?: boolean;
  seoData?: ProductSEOData;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  shippingAddress?: string;
  profilePicture?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  code: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus = 
  | 'Processing' 
  | 'Shipped — with delivery company' 
  | 'Delivered' 
  | 'Cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number; // Flat ৳120 BDT
  discountAmount: number;
  total: number;
  paymentMethod: 'Cash on Delivery'; // Fixed COD only
  status: OrderStatus;
  createdAt: string;
  trackingNumber?: string;
  courierName?: string; // e.g., 'Steadfast Courier'
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  eventType: 'SIGN_UP_WELCOME' | 'ORDER_PLACED' | 'ORDER_SHIPPED';
  timestamp: string;
  htmlContent: string;
  relatedOrderId?: string;
}

export interface SalesAnalytics {
  daily: { date: string; revenue: number; orders: number }[];
  monthly: { month: string; revenue: number; orders: number }[];
  yearly: { year: string; revenue: number; orders: number }[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: { name: string; code: string; unitsSold: number; revenue: number }[];
}

// ==========================================
// 13-STAGE PIPELINE TYPES & ORCHESTRATOR
// ==========================================

export type PipelineStageId = 
  | '1_admin_auth'
  | '2_product_creation_input'
  | '3_ai_validation'
  | '4_ai_image_processing'
  | '5_product_seo_engine'
  | '6_ai_keyword_research'
  | '7_ai_content_generator'
  | '8_internal_linking'
  | '9_technical_seo'
  | '10_performance_optimization'
  | '11_google_readiness'
  | '12_publish_product'
  | '13_post_publish_automation';

export type PipelineStatus = 'idle' | 'running' | 'completed' | 'failed' | 'warning';

export interface StageResult {
  stageId: PipelineStageId;
  stageName: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'warning';
  timestamp: string;
  durationMs: number;
  details: string;
  data?: Record<string, any>;
  blockingErrors?: string[];
  warnings?: string[];
}

export interface ValidationReport {
  passed: boolean;
  blockingErrors: string[];
  warnings: string[];
  qualityMetrics: {
    titleLengthValid: boolean;
    descriptionLengthValid: boolean;
    imagesResolutionOk: boolean;
    duplicateDetected: boolean;
    missingVariantWarning: boolean;
  };
}

export interface PipelineExecutionState {
  productId: string;
  productName: string;
  currentStageIndex: number;
  overallStatus: PipelineStatus;
  startedAt: string;
  completedAt?: string;
  stages: Record<PipelineStageId, StageResult>;
  logs: { timestamp: string; stageId: PipelineStageId; message: string; type: 'info' | 'warn' | 'error' | 'success' }[];
  validationReport?: ValidationReport;
}

