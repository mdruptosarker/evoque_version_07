/**
 * EVOQUE Dynamic Sitemap Engine - Type Definitions
 * Fully compliant with Google XML Sitemap & Image Sitemap specifications
 */

export type SitemapType = 
  | 'main'
  | 'products'
  | 'images'
  | 'categories'
  | 'collections'
  | 'blog'
  | 'pages';

export type ChangeFrequency = 
  | 'always' 
  | 'hourly' 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'yearly' 
  | 'never';

export interface ImageSitemapItem {
  url: string;
  title: string;
  caption?: string;
  altText?: string;
  license?: string;
  geoLocation?: string;
  productUrl?: string;
}

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string; // YYYY-MM-DD or ISO 8601
  changefreq: ChangeFrequency;
  priority: number; // 0.0 to 1.0
  images?: ImageSitemapItem[];
}

export interface SitemapMetadata {
  type: SitemapType;
  path: string;
  fullUrl: string;
  lastGenerated: string;
  totalUrls: number;
  status: 'active' | 'generating' | 'error';
  validationStatus: 'valid' | 'warning' | 'error';
  xmlSizeKb: number;
}

export interface SitemapValidationError {
  type: 'error' | 'warning';
  code: string;
  message: string;
  url?: string;
}

export interface SitemapValidationReport {
  timestamp: string;
  sitemapType: SitemapType;
  isValid: boolean;
  totalUrlsChecked: number;
  duplicateUrlsCount: number;
  missingLastModCount: number;
  missingCanonicalCount: number;
  missingImageMetaCount: number;
  invalidPriorityCount: number;
  errors: SitemapValidationError[];
  warnings: SitemapValidationError[];
}

export interface SitemapAuditLog {
  id: string;
  timestamp: string;
  eventType: 'regenerate_all' | 'update_products' | 'update_categories' | 'ping_indexnow' | 'validation_run';
  triggerSource: 'automatic' | 'admin_manual' | 'pipeline_publish' | 'product_crud';
  details: string;
  status: 'success' | 'failed' | 'retry_fallback';
  durationMs: number;
}

export interface IndexNowPingResult {
  engine: 'IndexNow' | 'Google' | 'Bing';
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  urlsSubmittedCount: number;
}
