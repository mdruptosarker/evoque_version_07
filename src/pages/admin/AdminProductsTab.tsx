import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductUrlWidget } from '../../components/admin/ProductUrlWidget';
import { Package, Plus, Edit, Trash2, X, CheckCircle2, AlertCircle, Image as ImageIcon, Sparkles, RefreshCw, Globe, ExternalLink } from 'lucide-react';
import { Product, ProductSEOData } from '../../types';
import { optimizeImage } from '../../utils/imageOptimizer';

export const AdminProductsTab: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [currentSeoData, setCurrentSeoData] = useState<ProductSEOData | undefined>(undefined);

  // Basic Product Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | string>(12500);
  const [code, setCode] = useState('');
  const [stock, setStock] = useState<number | string>(15);
  const [description, setDescription] = useState('');

  // Image & Color Variant States
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [colorImagesMap, setColorImagesMap] = useState<Record<string, string>>({});
  const [featured, setFeatured] = useState(false);

  // Optional variants per Section 5
  const [sizesStr, setSizesStr] = useState('S, M, L, XL');
  const [colorsStr, setColorsStr] = useState('Black, Charcoal');
  const [fabric, setFabric] = useState('');
  const [fit, setFit] = useState('');
  const [care, setCare] = useState('');

  // Helper for reading files directly from laptop / computer as DataURL with WebP optimization
  const handleFileUpload = async (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    try {
      const optimized = await optimizeImage(file, 2000, 0.85);
      callback(optimized.webpDataUrl);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          callback(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSEOInModal = async () => {
    if (!name) {
      alert('Please enter a product name first.');
      return;
    }
    try {
      setIsGeneratingSEO(true);
      const allImgs = [imageUrl, ...additionalImages].filter(Boolean);
      const res = await fetch('/api/seo/generate-product-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          price: Number(price),
          code,
          description,
          images: allImgs,
          variants: { fabric, fit, careInstructions: care },
        }),
      });

      if (!res.ok) throw new Error('SEO Generation failed');
      const data: ProductSEOData = await res.json();
      setCurrentSeoData(data);
      setSuccessMsg('⚡ AI Generated 100% Complete Google & Image Search SEO Package!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setCurrentSeoData(undefined);
    setName('');
    setCategory(categories[0]?.name || 'Outerwear');
    setPrice(12500);
    setCode(`EVQ-${Math.floor(100 + Math.random() * 900)}`);
    setStock(15);
    setDescription('- Heavyweight Italian virgin wool\n- Structured boxy silhouette\n- Horn button closures\n- Made in Bangladesh atelier');
    setImageUrl('https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80');
    setAdditionalImages([]);
    setColorImagesMap({});
    setFeatured(false);
    setSizesStr('S, M, L, XL');
    setColorsStr('Black, Charcoal');
    setFabric('100% Virgin Wool');
    setFit('Relaxed Atelier Fit');
    setCare('Dry Clean Only');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setCurrentSeoData(p.seoData);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setCode(p.code);
    setStock(p.stock);
    setDescription(p.description);
    setImageUrl(p.images[0] || '');
    setAdditionalImages(p.images.slice(1) || []);
    setColorImagesMap(p.colorImages || {});
    setFeatured(p.featured || false);
    setSizesStr(p.variants?.size?.join(', ') || '');
    setColorsStr(p.variants?.color?.join(', ') || '');
    setFabric(p.variants?.fabric || '');
    setFit(p.variants?.fit || '');
    setCare(p.variants?.careInstructions || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !price) {
      alert('Name, Code (SKU), and Price are mandatory.');
      return;
    }

    const sizeArr = sizesStr.split(',').map(s => s.trim()).filter(Boolean);
    const colorArr = colorsStr.split(',').map(c => c.trim()).filter(Boolean);

    // Collect all images starting with primary, additional gallery images, and color images
    const allImagesSet = new Set<string>();
    const mainImg = imageUrl.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
    allImagesSet.add(mainImg);

    additionalImages.forEach(img => {
      if (img.trim()) allImagesSet.add(img.trim());
    });

    Object.values(colorImagesMap).forEach((img: string) => {
      if (typeof img === 'string' && img.trim()) allImagesSet.add(img.trim());
    });

    const productData = {
      name,
      category,
      price: Number(price),
      code,
      stock: Number(stock),
      description,
      images: Array.from(allImagesSet),
      colorImages: Object.keys(colorImagesMap).length > 0 ? colorImagesMap : undefined,
      featured,
      seoData: currentSeoData,
      variants: {
        size: sizeArr.length > 0 ? sizeArr : undefined,
        color: colorArr.length > 0 ? colorArr : undefined,
        fabric: fabric.trim() || undefined,
        fit: fit.trim() || undefined,
        careInstructions: care.trim() || undefined
      }
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setSuccessMsg(`Updated garment "${name}" successfully!`);
    } else {
      addProduct(productData);
      setSuccessMsg(`Added new garment "${name}" to collection!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = (id: string, prodName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${prodName}"?`)) {
      deleteProduct(id);
      setSuccessMsg(`Deleted "${prodName}" from inventory.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-900 flex items-center gap-2.5">
            <Package className="w-7 h-7 text-neutral-800" />
            <span>Product Inventory Management</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Create, edit, and archive garments per Section 12. Changes sync instantly to storefront catalog.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add New Garment</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Product List Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-neutral-900">Live Storefront Catalog ({products.length} Items)</h3>
          <span className="text-xs font-mono font-semibold bg-neutral-200 px-3 py-1 rounded-full text-neutral-800">
            Real-time Sync Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-100/80 text-neutral-600 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-200">
                <th className="py-3.5 px-6">Garment Preview</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price (BDT)</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs font-medium">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3.5">
                    <img src={p.images[0]} alt={p.name} className="w-12 h-14 object-cover rounded-lg bg-neutral-100 shrink-0" />
                    <div>
                      <p className="font-serif font-bold text-sm text-neutral-900">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-neutral-400 font-mono">SKU: {p.code}</span>
                        <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          /products/{p.slug || p.name.toLowerCase().replace(/\s+/g, '-')}
                        </span>
                      </div>
                      {p.featured && (
                        <span className="inline-block mt-0.5 px-2 py-0.2 bg-amber-100 text-amber-900 text-[9px] font-bold uppercase rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-[11px] font-semibold uppercase">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-sm text-neutral-900">
                    ৳{(p.price || 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {p.stock <= 0 ? (
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-md font-bold text-[11px] uppercase">
                        Sold Out (0)
                      </span>
                    ) : p.stock < 5 ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md font-bold text-[11px] uppercase">
                        Low Stock ({p.stock})
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[11px] uppercase">
                        In Stock ({p.stock})
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors"
                      title="Edit Garment"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                      title="Delete Garment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF9F6] border border-neutral-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-white border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl text-neutral-900">
                  {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Collection'}
                </h2>
                <p className="text-xs text-neutral-500">
                  Fill basic info or use AI Auto-SEO to generate Google Search metadata automatically.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateSEOInModal}
                  disabled={isGeneratingSEO}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <Sparkles className={`w-4 h-4 ${isGeneratingSEO ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingSEO ? 'Generating...' : '⚡ AI Auto-SEO'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Structured Wool Overcoat"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-black capitalize"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Price (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    SKU / Product Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. EVQ-OW-009"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-mono uppercase focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Inventory Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2.5 text-xs font-bold text-neutral-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-900 focus:ring-black border-neutral-300"
                    />
                    <span>Highlight as Featured Garment on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4 p-4 bg-neutral-100/60 rounded-2xl border border-neutral-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800">
                      Primary Garment Image *
                    </label>
                    <span className="text-[11px] text-neutral-500">Paste URL or Choose File from Laptop</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <input
                      type="text"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                    />
                    <label className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Choose File</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], setImageUrl);
                          }
                        }} 
                      />
                    </label>
                    {imageUrl && (
                      <img src={imageUrl} alt="Preview" className="w-11 h-11 object-cover rounded-xl border border-neutral-300 shrink-0 bg-white" />
                    )}
                  </div>
                </div>

                {/* Additional Images / Gallery */}
                <div className="pt-3 border-t border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800">
                      Additional Gallery Images
                    </label>
                    <label className="text-[11px] font-bold text-neutral-900 hover:underline cursor-pointer flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload Additional Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], (dataUrl) => {
                              setAdditionalImages(prev => [...prev, dataUrl]);
                            });
                          }
                        }} 
                      />
                    </label>
                  </div>

                  {additionalImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-2">
                      {additionalImages.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-neutral-300 bg-white">
                          <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setAdditionalImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Product Description & Notes *
                  </label>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                    Tip: Start lines with "-" or "*" to create a bulleted list
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="- Heavyweight virgin wool&#10;- Tailored boxy silhouette&#10;- Made in Dhaka studio"
                  className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-normal focus:outline-none focus:border-black"
                />
              </div>

              {/* Dynamic Optional Variants & Per-Color Images Section */}
              <div className="pt-4 border-t border-neutral-200 space-y-4">
                <h4 className="font-serif font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Optional Dynamic Variants & Per-Color Image Mapping</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Sizes (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={sizesStr}
                      onChange={(e) => setSizesStr(e.target.value)}
                      placeholder="e.g. S, M, L, XL"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Colors (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={colorsStr}
                      onChange={(e) => setColorsStr(e.target.value)}
                      placeholder="e.g. Black, Charcoal, Slate"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Per-Color Image Mapping UI */}
                {colorsStr.trim() && (
                  <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                      Color-Specific Images (Customer clicks color = auto changes image)
                    </p>
                    <div className="space-y-3">
                      {colorsStr.split(',').map(c => c.trim()).filter(Boolean).map((colorName) => {
                        const currentColorImg = colorImagesMap[colorName] || '';
                        return (
                          <div key={colorName} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <span className="font-semibold text-xs text-neutral-900 bg-neutral-200/80 px-2.5 py-1 rounded-lg uppercase tracking-wide self-start sm:self-auto">
                              {colorName}
                            </span>
                            <div className="flex-1 flex gap-2 items-center">
                              <input
                                type="text"
                                value={currentColorImg}
                                onChange={(e) => setColorImagesMap({ ...colorImagesMap, [colorName]: e.target.value })}
                                placeholder={`Image URL for ${colorName}`}
                                className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono"
                              />
                              <label className="px-3 py-1.5 bg-neutral-800 hover:bg-black text-white text-[11px] font-semibold rounded-lg cursor-pointer shrink-0">
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleFileUpload(e.target.files[0], (dataUrl) => {
                                        setColorImagesMap({ ...colorImagesMap, [colorName]: dataUrl });
                                      });
                                    }
                                  }}
                                />
                              </label>
                              {currentColorImg && (
                                <img src={currentColorImg} alt={colorName} className="w-8 h-8 object-cover rounded-md border border-neutral-300 shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Fabric / Material (Optional)
                    </label>
                    <input
                      type="text"
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      placeholder="e.g. 100% Italian Virgin Wool"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Silhouette / Fit (Optional)
                    </label>
                    <input
                      type="text"
                      value={fit}
                      onChange={(e) => setFit(e.target.value)}
                      placeholder="e.g. Relaxed Boxy Cut"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Care Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={care}
                      onChange={(e) => setCare(e.target.value)}
                      placeholder="e.g. Professional Dry Clean Only. Do not bleach."
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  {editingProduct ? 'Save Changes' : 'Confirm & Add Garment'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
