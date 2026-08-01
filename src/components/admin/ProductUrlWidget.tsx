import React, { useState } from 'react';
import { 
  Copy, Check, ExternalLink, QrCode, Share2, Globe, Download, Edit3, ArrowRight, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { Product } from '../../types';
import { productUrlService } from '../../services/productUrlService';
import { useStore } from '../../context/StoreContext';

interface ProductUrlWidgetProps {
  product: Product;
  onOpenProduct?: (product: Product) => void;
  showSlugEditor?: boolean;
}

export const ProductUrlWidget: React.FC<ProductUrlWidgetProps> = ({ 
  product, 
  onOpenProduct,
  showSlugEditor = true 
}) => {
  const { updateProduct, products } = useStore();
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [newSlugInput, setNewSlugInput] = useState(product.slug || productUrlService.slugify(product.name));
  const [slugSuccessMsg, setSlugSuccessMsg] = useState<string | null>(null);

  const currentSlug = product.slug || productUrlService.slugify(product.name);
  const fullPermalink = product.permalink || productUrlService.buildPermalink(currentSlug);
  const shareLinks = productUrlService.getSocialShareLinks(fullPermalink, product.name);
  const qrSvgDataUrl = productUrlService.generateQRCodeDataUrl(fullPermalink);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPermalink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenProduct = () => {
    if (onOpenProduct) {
      onOpenProduct(product);
    } else {
      window.history.pushState({ slug: currentSlug }, '', `/products/${currentSlug}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleSaveSlugUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlugInput.trim()) return;

    const oldSlug = currentSlug;
    const cleanNewSlug = productUrlService.slugify(newSlugInput);

    if (oldSlug === cleanNewSlug) {
      setIsEditingSlug(false);
      return;
    }

    updateProduct(product.id, { slug: cleanNewSlug });
    setIsEditingSlug(false);
    setSlugSuccessMsg(`Updated slug to "${cleanNewSlug}". Automatic 301 Redirect registered from "/products/${oldSlug}".`);
    setTimeout(() => setSlugSuccessMsg(null), 5000);
  };

  const handleDownloadQR = () => {
    const svgString = productUrlService.createSVGQRCode(fullPermalink, 512);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVOQUE-QR-${currentSlug}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 shadow-lg space-y-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Permanent Product URL & Indexing Status</span>
        </div>
        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Google Index Ready
        </span>
      </div>

      {/* Main URL Bar Box */}
      <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/80 space-y-2">
        <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest flex items-center justify-between">
          <span>Target Canonical Permalink</span>
          <span className="text-neutral-500 text-[10px]">301 Redirect Guard Active</span>
        </div>
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <span className="font-mono text-sm text-neutral-100 truncate select-all">
            {fullPermalink}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {/* 1. Copy URL Button */}
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
              }`}
              title="Copy Permanent Product URL"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* 2. Open Product Button */}
            <button
              onClick={handleOpenProduct}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
              title="Open Product Live Page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Tools: QR Code & Social Sharing */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* QR Code Button */}
        <button
          onClick={() => setShowQRModal(true)}
          className="w-full py-2 px-3 bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 rounded-xl border border-neutral-700/60 text-xs font-medium transition-all flex items-center justify-center gap-2"
        >
          <QrCode className="w-4 h-4 text-emerald-400" />
          <span>Generate QR Code</span>
        </button>

        {/* Social Share Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="w-full py-2 px-3 bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 rounded-xl border border-neutral-700/60 text-xs font-medium transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4 text-indigo-400" />
          <span>Social Share Links</span>
        </button>
      </div>

      {/* Redirect-Aware Slug Editor */}
      {showSlugEditor && (
        <div className="pt-3 border-t border-neutral-800/80 space-y-2">
          {!isEditingSlug ? (
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500">Slug:</span>
                <code className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 font-mono text-neutral-200">{currentSlug}</code>
              </div>
              <button
                onClick={() => setIsEditingSlug(true)}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Slug</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveSlugUpdate} className="space-y-2 bg-neutral-950 p-3 rounded-xl border border-indigo-900/50">
              <div className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-indigo-400" />
                <span>Redirect-Aware Slug Update</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSlugInput}
                  onChange={(e) => setNewSlugInput(e.target.value)}
                  placeholder="enter-new-slug"
                  className="flex-1 bg-neutral-900 border border-neutral-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all"
                >
                  Save & 301
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingSlug(false)}
                  className="px-2.5 py-1.5 bg-neutral-800 text-neutral-400 text-xs rounded-lg hover:text-white"
                >
                  Cancel
                </button>
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight">
                Note: Updating the slug automatically registers a 301 permanent redirect from <code className="text-neutral-300">/products/{currentSlug}</code> to ensure no SEO juice or backlink traffic is lost.
              </p>
            </form>
          )}

          {/* Success Message Banner */}
          {slugSuccessMsg && (
            <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{slugSuccessMsg}</span>
            </div>
          )}

          {/* Previous Slugs History if present */}
          {product.previousSlugs && product.previousSlugs.length > 0 && (
            <div className="text-[11px] text-neutral-400 pt-1">
              <span className="text-neutral-500 font-medium">301 Redirect Rules Active ({product.previousSlugs.length}):</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.previousSlugs.map((oldS, i) => (
                  <span key={i} className="bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800 text-[10px] font-mono text-amber-300/80">
                    /products/{oldS} → 301
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <h3 className="font-serif font-bold text-lg text-white">Product QR Code</h3>
            <p className="text-xs text-neutral-400">Scan to visit permanent product page on mobile</p>
            
            <div className="bg-white p-4 rounded-xl inline-block shadow-inner">
              <img src={qrSvgDataUrl} alt={`QR code for ${product.name}`} className="w-48 h-48 mx-auto" />
            </div>

            <div className="text-[11px] font-mono text-neutral-300 truncate bg-neutral-950 p-2 rounded-lg border border-neutral-800">
              {fullPermalink}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadQR}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Vector QR (SVG)</span>
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="font-serif font-bold text-lg text-white text-center">Share Product URL</h3>
            <p className="text-xs text-neutral-400 text-center">Promote permanent product link on social media</p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#1877F2]"></span>
                <span>Facebook</span>
              </a>

              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                <span>WhatsApp</span>
              </a>

              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>Twitter / X</span>
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#0A66C2]"></span>
                <span>LinkedIn</span>
              </a>

              <a
                href={shareLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#229ED9]"></span>
                <span>Telegram</span>
              </a>

              <a
                href={shareLinks.email}
                className="p-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Email</span>
              </a>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
