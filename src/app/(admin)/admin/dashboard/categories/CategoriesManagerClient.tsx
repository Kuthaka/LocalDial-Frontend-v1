'use client'

import { useState } from 'react'
import { Plus, Tag, Layers, SubscriptIcon as SubCategoryIcon, LayoutGrid } from 'lucide-react'
import { addMainCategory, addCategory, addSubCategory } from '@/app/actions/admin'
import toast, { Toaster } from 'react-hot-toast'

export default function CategoriesManagerClient({ 
  mainCategories, 
  normalCategories, 
  subCategories 
}: { 
  mainCategories: any[], 
  normalCategories: any[], 
  subCategories: any[] 
}) {
  const [activeTab, setActiveTab] = useState<'main' | 'normal' | 'sub'>('main')

  async function handleAddMain(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const loadingToast = toast.loading('Adding Main Category...')
    const result = await addMainCategory(new FormData(e.currentTarget))
    if (result.error) toast.error(result.error, { id: loadingToast })
    else toast.success('Added successfully!', { id: loadingToast })
    e.currentTarget.reset()
  }

  async function handleAddNormal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const loadingToast = toast.loading('Adding Normal Category...')
    const result = await addCategory(new FormData(e.currentTarget))
    if (result.error) toast.error(result.error, { id: loadingToast })
    else toast.success('Added successfully!', { id: loadingToast })
    e.currentTarget.reset()
  }

  async function handleAddSub(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const loadingToast = toast.loading('Adding Sub Category...')
    const result = await addSubCategory(new FormData(e.currentTarget))
    if (result.error) toast.error(result.error, { id: loadingToast })
    else toast.success('Added successfully!', { id: loadingToast })
    e.currentTarget.reset()
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        <button 
          onClick={() => setActiveTab('main')}
          className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'main' ? 'bg-[#1c2331] text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <LayoutGrid className="w-4 h-4" /> Main Categories
        </button>
        <button 
          onClick={() => setActiveTab('normal')}
          className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'normal' ? 'bg-[#1c2331] text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Layers className="w-4 h-4" /> Normal Categories
        </button>
        <button 
          onClick={() => setActiveTab('sub')}
          className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'sub' ? 'bg-[#1c2331] text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Tag className="w-4 h-4" /> Sub Categories
        </button>
      </div>

      {/* Main Categories Tab */}
      {activeTab === 'main' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h3 className="text-lg font-bold mb-4">Add Main Category</h3>
            <form onSubmit={handleAddMain} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                <input type="text" name="name" required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#104825] outline-none" placeholder="e.g. Food & Dining" />
              </div>
              <button type="submit" className="w-full bg-[#1c2331] text-white font-bold py-2.5 rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Main Category
              </button>
            </form>
          </div>
          {/* List */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Existing Main Categories ({mainCategories?.length || 0})</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {mainCategories?.map(cat => (
                <div key={cat.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-bold text-slate-800">
                  {cat.name}
                </div>
              ))}
              {!mainCategories?.length && <p className="text-slate-500 text-sm">No main categories found.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Normal Categories Tab */}
      {activeTab === 'normal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h3 className="text-lg font-bold mb-4">Add Normal Category</h3>
            <form onSubmit={handleAddNormal} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Main Category</label>
                <select name="main_category_id" required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#104825] outline-none">
                  <option value="">Select Main Category</option>
                  {mainCategories?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category Name</label>
                <input type="text" name="name" required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#104825] outline-none" placeholder="e.g. Restaurants" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea name="description" rows={2} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#104825] outline-none" placeholder="Brief description..."></textarea>
              </div>
              <button type="submit" className="w-full bg-[#1c2331] text-white font-bold py-2.5 rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Normal Category
              </button>
            </form>
          </div>
          {/* List */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Existing Normal Categories ({normalCategories?.length || 0})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {normalCategories?.map(cat => {
                const mainCat = mainCategories?.find(m => m.id === cat.main_category_id)
                return (
                  <div key={cat.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-bold text-slate-800">{cat.name}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase mt-1">Under: {mainCat?.name || 'Uncategorized'}</p>
                  </div>
                )
              })}
              {!normalCategories?.length && <p className="text-slate-500 text-sm">No normal categories found.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Sub Categories Tab */}
      {activeTab === 'sub' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h3 className="text-lg font-bold mb-4">Add Sub Category</h3>
            <form onSubmit={handleAddSub} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Parent Category</label>
                <select name="category_id" required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#104825] outline-none">
                  <option value="">Select Normal Category</option>
                  {normalCategories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Sub Category Name</label>
                <input type="text" name="name" required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#104825] outline-none" placeholder="e.g. Vegetarian" />
              </div>
              <button type="submit" className="w-full bg-[#1c2331] text-white font-bold py-2.5 rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Sub Category
              </button>
            </form>
          </div>
          {/* List */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Existing Sub Categories ({subCategories?.length || 0})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {subCategories?.map(sub => {
                const parentCat = normalCategories?.find(c => c.id === sub.category_id)
                return (
                  <div key={sub.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-bold text-slate-800">{sub.name}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase mt-1">Under: {parentCat?.name || 'Unknown'}</p>
                  </div>
                )
              })}
              {!subCategories?.length && <p className="text-slate-500 text-sm">No sub categories found.</p>}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
