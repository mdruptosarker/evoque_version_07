/**
 * EVOQUE Sitemap Validation Engine
 * Validates generated sitemap XMLs against Google & Bing Search Console constraints.
 */

import { 
  SitemapType, 
  SitemapUrlEntry, 
  SitemapValidationReport, 
  SitemapValidationError 
} from './types';

export class SitemapValidator {
  private static VALID_CHANGEFREQS = new Set([
    'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
  ]);

  /**
   * Performs deep validation on a list of sitemap entries
   */
  public static validateEntries(
    type: SitemapType,
    entries: SitemapUrlEntry[],
    xmlContent?: string
  ): SitemapValidationReport {
    const errors: SitemapValidationError[] = [];
    const warnings: SitemapValidationError[] = [];
    const seenUrls = new Set<string>();

    let duplicateUrlsCount = 0;
    let missingLastModCount = 0;
    let missingCanonicalCount = 0;
    let missingImageMetaCount = 0;
    let invalidPriorityCount = 0;

    // 1. Structure Check if XML string provided
    if (xmlContent) {
      if (!xmlContent.startsWith('<?xml')) {
        errors.push({
          type: 'error',
          code: 'ERR_XML_HEADER_MISSING',
          message: 'Sitemap XML string is missing standard <?xml version="1.0"?> declaration header.'
        });
      }
      if (!xmlContent.includes('</urlset>') && !xmlContent.includes('</sitemapindex>')) {
        errors.push({
          type: 'error',
          code: 'ERR_XML_MALFORMED',
          message: 'Sitemap XML lacks proper closing root element tag </urlset> or </sitemapindex>.'
        });
      }
    }

    // 2. Validate URL entries
    entries.forEach((entry, idx) => {
      // URL format check
      if (!entry.loc || typeof entry.loc !== 'string') {
        errors.push({
          type: 'error',
          code: 'ERR_URL_EMPTY',
          message: `Entry #${idx + 1} has an empty or invalid <loc> attribute.`
        });
        return;
      }

      const lowerUrl = entry.loc.toLowerCase().trim();

      // Check protocol
      if (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://')) {
        errors.push({
          type: 'error',
          code: 'ERR_URL_INVALID_PROTOCOL',
          message: `URL "${entry.loc}" must specify http or https protocol.`,
          url: entry.loc
        });
      }

      // Check Domain matching
      if (!lowerUrl.includes('evoque.today')) {
        warnings.push({
          type: 'warning',
          code: 'WARN_DOMAIN_MISMATCH',
          message: `URL "${entry.loc}" uses a domain outside canonical evoque.today.`,
          url: entry.loc
        });
      }

      // Check Duplicates
      if (seenUrls.has(lowerUrl)) {
        duplicateUrlsCount++;
        errors.push({
          type: 'error',
          code: 'ERR_DUPLICATE_URL',
          message: `Duplicate URL detected in ${type} sitemap: "${entry.loc}"`,
          url: entry.loc
        });
      } else {
        seenUrls.add(lowerUrl);
      }

      // Check Lastmod
      if (!entry.lastmod) {
        missingLastModCount++;
        warnings.push({
          type: 'warning',
          code: 'WARN_MISSING_LASTMOD',
          message: `URL "${entry.loc}" is missing <lastmod> timestamp tag.`,
          url: entry.loc
        });
      } else if (isNaN(Date.parse(entry.lastmod))) {
        errors.push({
          type: 'error',
          code: 'ERR_INVALID_DATE',
          message: `URL "${entry.loc}" has unparseable <lastmod> date: "${entry.lastmod}"`,
          url: entry.loc
        });
      }

      // Priority check
      if (typeof entry.priority !== 'number' || entry.priority < 0.0 || entry.priority > 1.0) {
        invalidPriorityCount++;
        errors.push({
          type: 'error',
          code: 'ERR_INVALID_PRIORITY',
          message: `URL "${entry.loc}" has invalid priority value ${entry.priority}. Must be between 0.0 and 1.0.`,
          url: entry.loc
        });
      }

      // Changefreq check
      if (!this.VALID_CHANGEFREQS.has(entry.changefreq)) {
        errors.push({
          type: 'error',
          code: 'ERR_INVALID_CHANGEFREQ',
          message: `URL "${entry.loc}" has invalid changefreq "${entry.changefreq}".`,
          url: entry.loc
        });
      }

      // Image Metadata check
      if (entry.images && entry.images.length > 0) {
        entry.images.forEach((img) => {
          if (!img.title || !img.altText) {
            missingImageMetaCount++;
            warnings.push({
              type: 'warning',
              code: 'WARN_MISSING_IMAGE_ALT',
              message: `Image "${img.url}" on page "${entry.loc}" lacks explicit alt text or title for Google Image search.`,
              url: entry.loc
            });
          }
        });
      }
    });

    const isValid = errors.length === 0;

    return {
      timestamp: new Date().toISOString(),
      sitemapType: type,
      isValid,
      totalUrlsChecked: entries.length,
      duplicateUrlsCount,
      missingLastModCount,
      missingCanonicalCount,
      missingImageMetaCount,
      invalidPriorityCount,
      errors,
      warnings
    };
  }
}
