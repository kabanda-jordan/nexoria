import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Image, Tag, DollarSign, Package, Check } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useShopStore } from '../../store/useShopStore';
import { useToastStore } from '../../store/useToastStore';
import { Product } from '../../types';

interface ProductFormModalProps {
  productToEdit?: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ productToEdit, isOpen, onClose }) => {
  const { addProduct, updateProduct, categories } = useProductStore();
  const { currentSellerShop } = useShopStore();
  const { addToast } = useToastStore();

  const [title, setTitle] = useState(productToEdit?.title || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [price, setPrice] = useState(productToEdit?.price || 15000);
  const [stock, setStock] = useState(productToEdit?.stock || 25);
  const [sku, setSku] = useState(productToEdit?.sku || `SKU-${Math.floor(1000 + Math.random() * 8999)}`);
  const [categoryId, setCategoryId] = useState(productToEdit?.category_id || categories[0]?.id || 'cat-1');
  const [imageUrl, setImageUrl] = useState(
    productToEdit?.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCat = categories.find((c) => c.id === categoryId);

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        sku,
        category_id: categoryId,
        category_slug: selectedCat?.slug || 'electronics-computers',
        images: [imageUrl],
      });
      addToast('Product Updated! 📝', `${title} has been updated.`);
    } else {
      addProduct({
        shop_id: currentSellerShop.id,
        shop_name: currentSellerShop.name,
        category_id: categoryId,
        category_slug: selectedCat?.slug || 'electronics-computers',
        title,
        description,
        price: Number(price),
        sku,
        stock: Number(stock),
        status: 'active',
        images: [imageUrl],
        tags: [selectedCat?.slug || 'general', currentSellerShop.district.toLowerCase()],
        wholesale_tiers: [
          { min_qty: 5, price_per_unit: Math.round(Number(price) * 0.9) },
        ],
      });
      addToast('Product Listed! 🚀', `${title} is now live on Nexora.`);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg">
              {productToEdit ? 'Edit Listing' : 'Add New Product to Shop'}
            </h3>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Samsung Galaxy A55 5G or Agaseke Peace Basket"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_en} ({c.name_rw})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price (RWF)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SKU Code</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description & Specs</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe product features, local warranty, and packaging..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-100 font-bold text-xs text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30"
              >
                Save Product
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
