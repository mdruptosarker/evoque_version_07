import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Layers, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminCategoriesTab: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const autoSlug = slug.trim() || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const img = imageUrl.trim() || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';

    addCategory({
      name: name.trim(),
      slug: autoSlug,
      description: desc.trim(),
      image: img
    });

    setSuccessMsg(`Created category "${name.trim()}" successfully! Storefront navigation synced.`);
    setName('');
    setSlug('');
    setDesc('');
    setImageUrl('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = (id: string, catName: string) => {
    if (categories.length <= 1) {
      alert('You must keep at least one category in the storefront.');
      return;
    }
    if (window.confirm(`Delete category "${catName}"? This will update storefront filters immediately.`)) {
      deleteCategory(id);
      setSuccessMsg(`Deleted category "${catName}".`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200">
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-900 flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-neutral-800" />
          <span>Category Management</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Add or remove capsule collections per Section 12. New categories instantly appear on the storefront Category Bar and All Products filters.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Create Category Form */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6 self-start">
          <h3 className="font-serif font-bold text-lg text-neutral-900 pb-3 border-b border-neutral-200">
            Create New Capsule Category
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                }}
                placeholder="e.g. Leather Goods"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="leather-goods"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono lowercase focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Brief luxury description for homepage cards"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Category to Catalog</span>
            </button>
          </form>
        </div>

        {/* Right Column: Existing Categories List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Active Storefront Categories ({categories.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-2xs flex items-center justify-between gap-3 group hover:border-neutral-400 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={cat.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=200&q=80'} 
                    alt={cat.name} 
                    className="w-12 h-14 object-cover rounded-xl bg-neutral-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-sm text-neutral-900 truncate">{cat.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-mono">/{cat.slug}</p>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">{cat.description || 'Active collection'}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 text-neutral-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
