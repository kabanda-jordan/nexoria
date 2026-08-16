import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Flame, Clock } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { HeroSlide } from '../../types';

const SLIDE_INTERVAL_MS = 5000;

export const HeroCarousel: React.FC = () => {
  const { heroSlides, setSelectedCategorySlug } = useProductStore();
  const { locale } = useLocaleStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlides = heroSlides.filter((s) => s.active);
  const count = activeSlides.length;

  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % count);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [count, isPaused]);

  if (count === 0) return null;

  const prev = () => setCurrentSlide((prev) => (prev - 1 + count) % count);
  const next = () => setCurrentSlide((prev) => (prev + 1) % count);

  const getTitle = (s: HeroSlide) => (locale === 'rw' ? s.title_rw : locale === 'fr' ? s.title_fr : s.title_en);
  const getSubtitle = (s: HeroSlide) => (locale === 'rw' ? s.subtitle_rw : locale === 'fr' ? s.subtitle_fr : s.subtitle_en);
  const getCta = (s: HeroSlide) => (locale === 'rw' ? s.cta_text_rw : locale === 'fr' ? s.cta_text_fr : s.cta_text_en);

  return (
    <section className="w-full bg-slate-950 select-none">
      {/* eBay-style "Today's Deals" header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-emerald-400" />
            Today's Deals
            <span className="hidden sm:inline text-[11px] font-bold text-slate-400 normal-case tracking-normal">
              — top offers on Nexora Rwanda
            </span>
          </h2>
          <button
            onClick={next}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider transition-colors"
          >
            See all deals
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sliding slideshow */}
      <div
        className="relative w-full overflow-hidden group/slideshow"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Track — slides side-ways like eBay */}
        <motion.div
          className="flex"
          animate={{ x: `-${currentSlide * 100}%` }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        >
          {activeSlides.map((slide) => (
            <div
              key={slide.id}
              onClick={() => {
                if (slide.category_slug) setSelectedCategorySlug(slide.category_slug);
              }}
              className={`relative w-full shrink-0 h-[300px] sm:h-[360px] lg:h-[420px] ${
                slide.category_slug ? 'cursor-pointer' : ''
              }`}
            >
              <img
                src={slide.image_url}
                alt={getTitle(slide)}
                draggable={false}
                className="w-full h-full object-cover object-center"
              />
              {/* Gradients for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30" />

              {/* Slide content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-xl text-white">
                    {slide.badge && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider shadow-lg mb-3">
                        <Flame className="w-3.5 h-3.5" />
                        {slide.badge}
                      </span>
                    )}

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow">
                      {getTitle(slide)}
                    </h1>

                    <p className="mt-3 text-xs sm:text-sm lg:text-base text-slate-300 max-w-md leading-relaxed font-medium">
                      {getSubtitle(slide)}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-amber-300 text-[11px] font-bold">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>Offers ending soon — fast delivery in Rwanda</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (slide.category_slug) setSelectedCategorySlug(slide.category_slug);
                      }}
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-md bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-xl shadow-emerald-600/30 transition-all"
                    >
                      {getCta(slide)}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Arrows — revealed on hover, eBay-style */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-slate-950/70 hover:bg-emerald-600 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all active:scale-90 opacity-0 group-hover/slideshow:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-slate-950/70 hover:bg-emerald-600 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all active:scale-90 opacity-0 group-hover/slideshow:opacity-100"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Dots — centered at the bottom */}
        <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-10">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-7 bg-emerald-400' : 'w-4 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
