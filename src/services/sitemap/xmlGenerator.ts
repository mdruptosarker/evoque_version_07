/**
 * EVOQUE XML Generator Service
 * Constructs W3C & Google Search Console compliant XML sitemaps.
 * Supports standard urlsets, image sitemaps, and sitemap indexes.
 */

import { SitemapUrlEntry, ImageSitemapItem } from './types';

export class XmlGenerator {
  /**
   * Escape XML special characters to prevent invalid XML syntax
   */
  public static escapeXml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Generates Root Sitemap Index XML (/sitemap.xml)
   */
  public static generateSitemapIndex(
    subSitemaps: { loc: string; lastmod: string }[]
  ): string {
    const sitemapEntries = subSitemaps
      .map(
        (sub) => `  <sitemap>
    <loc>${this.escapeXml(sub.loc)}</loc>
    <lastmod>${this.escapeXml(sub.lastmod)}</lastmod>
  </sitemap>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
  }

  /**
   * Generates Standard URLSet Sitemap XML (/sitemap-products.xml, /sitemap-categories.xml, etc.)
   */
  public static generateUrlSet(entries: SitemapUrlEntry[]): string {
    const urlBlocks = entries
      .map((entry) => {
        let block = `  <url>\n    <loc>${this.escapeXml(entry.loc)}</loc>\n    <lastmod>${this.escapeXml(entry.lastmod)}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority.toFixed(1)}</priority>`;

        if (entry.images && entry.images.length > 0) {
          entry.images.forEach((img) => {
            block += `\n    <image:image>`;
            block += `\n      <image:loc>${this.escapeXml(img.url)}</image:loc>`;
            if (img.title) {
              block += `\n      <image:title>${this.escapeXml(img.title)}</image:title>`;
            }
            if (img.caption) {
              block += `\n      <image:caption>${this.escapeXml(img.caption)}</image:caption>`;
            }
            if (img.license) {
              block += `\n      <image:license>${this.escapeXml(img.license)}</image:license>`;
            }
            block += `\n    </image:image>`;
          });
        }

        block += `\n  </url>`;
        return block;
      })
      .join('\n');

    const hasImages = entries.some((e) => e.images && e.images.length > 0);
    const xmlnsImage = hasImages
      ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
      : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${xmlnsImage}>
${urlBlocks}
</urlset>`;
  }

  /**
   * Generates Dedicated Google Image Sitemap XML (/image-sitemap.xml)
   */
  public static generateImageSitemap(imageItems: ImageSitemapItem[]): string {
    // Group images by product URL
    const grouped = new Map<string, ImageSitemapItem[]>();
    for (const item of imageItems) {
      const pageUrl = item.productUrl || 'https://evoque.today/products';
      const list = grouped.get(pageUrl) || [];
      list.push(item);
      grouped.set(pageUrl, list);
    }

    const urlBlocks: string[] = [];
    const today = new Date().toISOString().split('T')[0];

    grouped.forEach((images, pageUrl) => {
      let block = `  <url>\n    <loc>${this.escapeXml(pageUrl)}</loc>\n    <lastmod>${today}</lastmod>`;

      images.forEach((img) => {
        block += `\n    <image:image>`;
        block += `\n      <image:loc>${this.escapeXml(img.url)}</image:loc>`;
        if (img.title) {
          block += `\n      <image:title>${this.escapeXml(img.title)}</image:title>`;
        }
        if (img.caption || img.altText) {
          block += `\n      <image:caption>${this.escapeXml(img.caption || img.altText || '')}</image:caption>`;
        }
        if (img.license) {
          block += `\n      <image:license>${this.escapeXml(img.license)}</image:license>`;
        }
        if (img.geoLocation) {
          block += `\n      <image:geo_location>${this.escapeXml(img.geoLocation)}</image:geo_location>`;
        }
        block += `\n    </image:image>`;
      });

      block += `\n  </url>`;
      urlBlocks.push(block);
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlBlocks.join('\n')}
</urlset>`;
  }
}
