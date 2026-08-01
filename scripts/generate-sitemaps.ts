import fs from 'fs';
import path from 'path';

const BASE_DOMAIN = 'https://evoque.today';
const PUBLIC_DIR = path.join(process.cwd(), 'public');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

const today = new Date().toISOString().split('T')[0];

// 1. Root Sitemap Index (/sitemap.xml)
const mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_DOMAIN}/sitemap-products.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_DOMAIN}/sitemap-categories.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_DOMAIN}/sitemap-collections.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_DOMAIN}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_DOMAIN}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_DOMAIN}/image-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

// 2. Products Sitemap (/sitemap-products.xml)
const sampleProducts = [
  { slug: 'tailored-italian-wool-overcoat', name: 'Tailored Italian Wool Overcoat' },
  { slug: 'silk-blend-cashmere-turtleneck', name: 'Silk-Blend Cashmere Turtleneck' },
  { slug: 'heavyweight-minimalist-boxy-tee', name: 'Heavyweight Minimalist Boxy Tee' },
  { slug: 'pleated-relaxed-wool-trousers', name: 'Pleated Relaxed Wool Trousers' },
  { slug: 'structured-raw-denim-jacket', name: 'Structured Raw Denim Jacket' },
  { slug: 'handcrafted-full-grain-leather-belt', name: 'Handcrafted Full-Grain Leather Belt' }
];

const productEntries = sampleProducts.map(p => `  <url>
    <loc>${BASE_DOMAIN}/products/${p.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

const productsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productEntries}
</urlset>`;

// 3. Categories Sitemap (/sitemap-categories.xml)
const categories = ['winter-atelier', 'casual-luxury', 'outerwear', 'tailored-pants', 'footwear', 'accessories'];
const categoryEntries = categories.map(c => `  <url>
    <loc>${BASE_DOMAIN}/categories/${c}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

const categoriesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryEntries}
</urlset>`;

// 4. Collections Sitemap (/sitemap-collections.xml)
const collections = ['winter-atelier-2026', 'heritage-italian-wool', 'monochrome-essentials', 'dhaka-flagship-exclusives'];
const collectionEntries = collections.map(c => `  <url>
    <loc>${BASE_DOMAIN}/collections/${c}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

const collectionsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${collectionEntries}
</urlset>`;

// 5. Blog Sitemap (/sitemap-blog.xml)
const posts = ['craftsmanship-behind-italian-wool-overcoats', 'sustainable-luxury-apparel-in-bangladesh', 'evoque-winter-2026-style-guide'];
const blogEntries = posts.map(p => `  <url>
    <loc>${BASE_DOMAIN}/blog/${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n');

const blogSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogEntries}
</urlset>`;

// 6. Pages Sitemap (/sitemap-pages.xml)
const pages = [
  { path: '/', priority: '1.0' },
  { path: '/products', priority: '0.9' },
  { path: '/about', priority: '0.5' },
  { path: '/contact', priority: '0.6' },
  { path: '/shipping', priority: '0.5' },
  { path: '/privacy', priority: '0.3' },
  { path: '/terms', priority: '0.3' },
  { path: '/returns', priority: '0.5' },
  { path: '/faq', priority: '0.6' }
];

const pageEntries = pages.map(p => `  <url>
    <loc>${BASE_DOMAIN}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

const pagesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageEntries}
</urlset>`;

// 7. Image Sitemap (/image-sitemap.xml)
const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${BASE_DOMAIN}/products/tailored-italian-wool-overcoat</loc>
    <image:image>
      <image:loc>https://images.unsplash.com/photo-1544441893-675973e31985</image:loc>
      <image:title>Tailored Italian Wool Overcoat - View 1</image:title>
      <image:caption>EVOQUE Winter Atelier Collection: Italian Wool Overcoat</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${BASE_DOMAIN}/products/silk-blend-cashmere-turtleneck</loc>
    <image:image>
      <image:loc>https://images.unsplash.com/photo-1576566588028-4147f3842f27</image:loc>
      <image:title>Silk-Blend Cashmere Turtleneck - View 1</image:title>
      <image:caption>EVOQUE Casual Luxury Collection: Cashmere Turtleneck</image:caption>
    </image:image>
  </url>
</urlset>`;

// 8. Robots.txt
const robotsTxt = `# EVOQUE Search Engine Directive
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

# Primary XML Sitemap Index Reference
Sitemap: ${BASE_DOMAIN}/sitemap.xml
`;

// 9. Netlify _redirects configuration
const netlifyRedirects = `# Netlify Redirects for EVOQUE E-Commerce
# Ensure static XML sitemaps & robots.txt bypass SPA catch-all
/sitemap.xml              /sitemap.xml              200
/sitemap-products.xml     /sitemap-products.xml     200
/sitemap-categories.xml   /sitemap-categories.xml   200
/sitemap-collections.xml  /sitemap-collections.xml  200
/sitemap-blog.xml         /sitemap-blog.xml         200
/sitemap-pages.xml        /sitemap-pages.xml        200
/image-sitemap.xml        /image-sitemap.xml        200
/robots.txt               /robots.txt               200

# Legacy route aliases
/sitemaps/product-sitemap.xml   /sitemap-products.xml    301
/sitemaps/category-sitemap.xml  /sitemap-categories.xml  301
/sitemaps/image-sitemap.xml     /image-sitemap.xml       301

# SPA fallback rule for React Router
/*                        /index.html               200
`;

// Write files to public/
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), mainSitemap);
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-products.xml'), productsSitemap);
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-categories.xml'), categoriesSitemap);
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-collections.xml'), collectionsSitemap);
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-blog.xml'), blogSitemap);
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-pages.xml'), pagesSitemap);
fs.writeFileSync(path.join(PUBLIC_DIR, 'image-sitemap.xml'), imageSitemap);
fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt);
fs.writeFileSync(path.join(PUBLIC_DIR, '_redirects'), netlifyRedirects);

console.log('✅ EVOQUE Static Sitemaps, Robots.txt & Netlify _redirects successfully generated in /public!');
