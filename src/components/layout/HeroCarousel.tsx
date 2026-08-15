import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useLocaleStore } from '../../store/useLocaleStore';

export const HeroCarousel: React.FC = () => {
  const { heroSlides, setSelectedCategorySlug } = useProductStore();
  const { locale, t } = useLocaleStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeSlides = heroSlides.filter((s) => s.active);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const slide = activeSlides[currentSlide];

  const getTitle = () => (locale === 'rw' ? slide.title_rw : locale === 'fr' ? slide.title_fr : slide.title_en);
  const getSubtitle = () => (locale === 'rw' ? slide.subtitle_rw : locale === 'fr' ? slide.subtitle_fr : slide.subtitle_en);
  const getCta = () => (locale === 'rw' ? slide.cta_text_rw : locale === 'fr' ? slide.cta_text_fr : slide.cta_text_en);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with subtle Ken Burns zoom effect */}
            <motion.img
              src={slide.image_url}
              alt={getTitle()}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: 'easeOut' }}
              className="w-full h-full object-cover object-center"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-2xl text-white">
              {slide.badge && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-bold w-fit mb-4"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{slide.badge}</span>
                </motion.div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
              >
                {getTitle()}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-medium"
              >
                {getSubtitle()}
              </motion.p>

              {/* Flash Deal Timer Pill */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-4 flex items-center gap-2 text-amber-300 text-xs font-semibold"
              >
                <Clock className="w-4 h-4 animate-pulse" />
                <span>Offers ending soon — Fast Delivery in Rwanda!</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center gap-4"
              >
                <button
                  onClick={() => {
                    if (slide.category_slug) setSelectedCategorySlug(slide.category_slug);
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-600/30 group"
                >
                  <span>{getCta()}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Buttons */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/10 transition-all active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/10 transition-all active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-5 right-6 flex items-center gap-2 z-10">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-emerald-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
