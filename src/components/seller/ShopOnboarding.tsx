import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, Phone, MessageSquare, FileText, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { CloudinaryUpload, CLOUDINARY_ENABLED } from '../ui/CloudinaryUpload';
import { RWANDA_LOCATIONS } from '../../data/rwandaLocations';

export const ShopOnboarding: React.FC = () => {
  const { createShop, isShopLoading } = useShopStore();
  const { currentUser, openAuthModal } = useAuthStore();
  const { addToast } = useToastStore();

  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Kigali City');
  const [phone, setPhone] = useState('+250 7');
  const [whatsapp, setWhatsapp] = useState('+250 7');
  const [bio, setBio] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Open Your Shop on Nexora</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Create an account as a seller to name your shop, add products, and start selling to thousands of buyers across Rwanda.
          </p>
          <button
            onClick={() => openAuthModal('signup')}
            className="mt-6 w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
          >
            Register as a Seller
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      addToast('Shop Name Required', 'Give your shop a name (at least 2 characters).', 'warning');
      return;
    }
    setIsSubmitting(true);
    const res = await createShop({
      name: name.trim(),
      district,
      phone,
      whatsapp: whatsapp || phone,
      bio,
      tin_number: tinNumber || undefined,
      logo_url: logoUrl || undefined,
      banner_url: bannerUrl || undefined,
    });
    setIsSubmitting(false);
    if (res.success) {
      addToast('Shop Created! 🎉', res.message);
    } else {
      addToast('Could Not Create Shop', res.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 sm:p-8 bg-slate-900 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black">Name Your Shop</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Welcome, {currentUser.name}! Your shop goes live after our team approves it.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Shop Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Store className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Keza Craft House"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-500 bg-white"
                  >
                    {Object.keys(RWANDA_LOCATIONS).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 788 123 456"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                <div className="relative flex items-center">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+250 788 123 456"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">TIN Number (optional)</label>
                <div className="relative flex items-center">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    value={tinNumber}
                    onChange={(e) => setTinNumber(e.target.value)}
                    placeholder="e.g. 107876543"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shop Description / Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell buyers what you sell — crafts, electronics, fresh produce..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shop Logo</label>
                <CloudinaryUpload
                  onUpload={(url) => setLogoUrl(url)}
                  label="Upload Logo from PC"
                  hint="Square image works best"
                />
                {logoUrl && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden ring-2 ring-emerald-500">
                    <img src={logoUrl} alt="Shop logo preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shop Banner</label>
                <CloudinaryUpload
                  onUpload={(url) => setBannerUrl(url)}
                  label="Upload Banner from PC"
                  hint="Wide banner, e.g. 1200×400"
                />
                {bannerUrl && (
                  <div className="mt-2 w-full h-20 rounded-xl overflow-hidden ring-2 ring-emerald-500">
                    <img src={bannerUrl} alt="Shop banner preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {!CLOUDINARY_ENABLED && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed">
                Image upload needs Cloudinary configured. Set{' '}
                <span className="font-mono font-bold">VITE_CLOUDINARY_CLOUD_NAME</span> and{' '}
                <span className="font-mono font-bold">VITE_CLOUDINARY_UPLOAD_PRESET</span> in your .env file, then rebuild.
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                Your shop is created with a pending status. Our team reviews TIN details and shop info before approval — usually within 24 hours. Once approved you can list unlimited products.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isShopLoading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating your shop...
                </>
              ) : (
                <>
                  Create My Shop
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
