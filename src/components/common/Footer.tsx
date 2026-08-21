import React, { useState } from 'react';
import { Facebook, Instagram, MessageCircle, Youtube, Globe, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  setActivePage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const { products, categories } = useStore();
  const [showSeoModal, setShowSeoModal] = useState<'none' | 'sitemap' | 'robots'>('none');

  // Generate dynamic sitemap XML simulation per Section 8
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${window.location.origin}/</loc><priority>1.0</priority></url>
  <url><loc>${window.location.origin}/products</loc><priority>0.9</priority></url>
  <url><loc>${window.location.origin}/search</loc><priority>0.8</priority></url>
  <url><loc>${window.location.origin}/shipping</loc><priority>0.5</priority></url>
  <url><loc>${window.location.origin}/contact</loc><priority>0.5</priority></url>
${categories.map(c => `  <url><loc>${window.location.origin}/category/${c.slug}</loc><priority>0.8</priority></url>`).join('\n')}
${products.map(p => `  <url><loc>${window.location.origin}/product/${p.code}</loc><priority>0.7</priority></url>`).join('\n')}
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /profile

Sitemap: ${window.location.origin}/sitemap.xml`;

  return (
    <>
      <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-neutral-800">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 bg-black text-white flex items-center justify-center overflow-hidden shadow-xs"
                  style={{ borderRadius: '25%' }}
                >
                  <img src="/logo.png" alt="EVOQUE Logo" className="w-full h-full object-cover" />
                </div>
                <h2 className="font-serif text-3xl font-extrabold tracking-[0.25em] text-white uppercase">
                  EVOQUE
                </h2>
              </div>

              {/* Static Brand Tagline */}
              <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
                Redefining modern wardrobe essentials through minimalist aesthetics and architectural craftsmanship.
              </p>

              <p className="text-xs text-neutral-500">
                © {new Date().getFullYear()} EVOQUE. All rights reserved by EVOQUE. COD Delivery flat rate BDT ৳120 across all divisions.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
                Navigation
              </h3>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                <li><button onClick={() => setActivePage('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => setActivePage('products')} className="hover:text-white transition-colors">All Products</button></li>
                <li><button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">Search Collection</button></li>
                <li><button onClick={() => setActivePage('shipping')} className="hover:text-white transition-colors">Shipping Information</button></li>
                <li><button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors">Contact Support</button></li>
                <li><button onClick={() => setActivePage('profile')} className="hover:text-white transition-colors">Profile & Order History</button></li>
              </ul>
            </div>

            {/* Social Media Section per Section 10 */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
                Connect With Us
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Follow our official social media channels for exclusive lookbooks, capsule release announcements, and private client sales.
              </p>

              <div className="space-y-1.5 text-xs text-neutral-300">
                <p><span className="text-neutral-500 font-mono">Atelier:</span> Rangpur, Dhaka, Bangladesh</p>
                <p><span className="text-neutral-500 font-mono">Phone:</span> +880 1603642630</p>
                <p><span className="text-neutral-500 font-mono">Email:</span> evoque.hq@gmail.com</p>
              </div>
              
              <div className="flex items-center gap-3 pt-1">
                <a 
                  href="https://facebook.com/share/1BScnoENGa" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-white hover:text-black transition-all hover:scale-110 shadow-xs"
                  title="Official Facebook Page"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://instagram.com/evoque_bd?igsh=MTluaWJwZXp4eWFrdQ==" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-white hover:text-black transition-all hover:scale-110 shadow-xs"
                  title="Official Instagram Atelier"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://wa.me/8801995111632" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-white hover:text-black transition-all hover:scale-110 shadow-xs"
                  title="Official WhatsApp Support"
                  aria-label="WhatsApp Support"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.youtube.com/channel/UCoLywaa4fLidv-AZEN4GJiQ" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-white hover:text-black transition-all hover:scale-110 shadow-xs"
                  title="Official YouTube Channel"
                  aria-label="YouTube Channel"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 border-t border-neutral-800/80">
            <p>© {new Date().getFullYear()} EVOQUE. All rights reserved by EVOQUE.</p>
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              <span>Developed by <strong className="text-neutral-300 font-medium">Muhhamad Rupto Sarker</strong></span>
              <span>|</span>
              <button onClick={() => setActivePage('shipping')} className="hover:text-neutral-300 transition-colors">COD Terms</button>
              <span>|</span>
              <span>Lighthouse 95+ Optimized</span>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};
