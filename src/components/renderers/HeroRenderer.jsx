import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ClassicBanner from "@/components/frontend/hero/banner/ClassicBanner";
import StellarBanner from "@/components/frontend/hero/banner/StellarBanner";
import AuroraBanner from "../frontend/hero/banner/AuroraBanner";
import GradientBanner from "../frontend/hero/banner/GradientBanner";
import { motion } from "framer-motion";
/**
 * =====================================================================
 * HERO RENDERER — Template Registry Pattern
 * =====================================================================
 * <HeroRenderer type="carousel" template="simpleImageSlider" ... />
 *
 * নতুন Template যোগ করতে:
 *   1) componentRegistry.js-এ config যোগ করুন
 *   2) নিচের TEMPLATES map-এ একটি render function যোগ করুন
 * Builder-এর মূল logic-এ হাত দিতে হবে না।
 * =====================================================================
 */

const SimpleBanner = ({ content, settings }) => (
  <div
    className="relative flex items-center justify-center overflow-hidden rounded-lg bg-slate-200 bg-cover bg-center"
    style={{
      height: `${settings.height || 320}px`,
      backgroundImage: content.image ? `url(${content.image})` : undefined,
    }}
  >
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae doloribus
      eligendi dolores, ab, quisquam rem provident cupiditate ullam similique
      perspiciatis ratione excepturi doloremque sint expedita ipsam sit
      voluptatem omnis fuga!
    </p>
    <div className="rounded-md bg-black/40 px-6 py-4 text-center text-white">
      <h1 className="text-2xl font-semibold">{content.title}</h1>
      {content.buttonText && (
        <a
          href={content.buttonLink || "#"}
          onClick={(e) => e.preventDefault()}
          className="mt-3 inline-block rounded bg-white px-4 py-1.5 text-sm text-slate-900"
        >
          {content.buttonText}
        </a>
      )}
    </div>
  </div>
);

/* ----------------------------- Carousels ----------------------------- */

/** Shared slider engine — সব carousel template এটিই reuse করে */
const useSlider = (count, settings) => {
  const [index, setIndex] = useState(0);
  const loop = settings.loop !== false;

  useEffect(() => {
    if (!settings.autoplay || count <= 1) return undefined;
    const timer = setInterval(
      () => setIndex((i) => (i + 1 >= count ? (loop ? 0 : i) : i + 1)),
      Number(settings.speed) || 3000,
    );
    return () => clearInterval(timer);
  }, [settings.autoplay, settings.speed, count, loop]);

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  const prev = () =>
    setIndex((i) => (i - 1 < 0 ? (loop ? count - 1 : 0) : i - 1));
  const next = () => setIndex((i) => (i + 1 >= count ? (loop ? 0 : i) : i + 1));
  return { index, setIndex, prev, next };
};

const SliderShell = ({ children, settings, slider, count, height }) => (
  <div
    className="relative overflow-hidden rounded-lg bg-slate-900"
    style={{ height: `${height || 400}px` }}
  >
    {children}
    {settings.navigation !== false && count > 1 && (
      <>
        <button
          onClick={slider.prev}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={slider.next}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </>
    )}
    {settings.pagination !== false && count > 1 && (
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => slider.setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === slider.index ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    )}
  </div>
);


const ColumnSlider = ({ 
  content,
  settings,
  autoplay = true,
  speed = 3000,
  height = 400,
  gap = 4,
  containerWidth = "max-w-7xl"
}) => {

  console.log("Content - ",{
    content,settings
  })

  const slides = content?.slides || []
  const showNavigations = settings?.navigation 
  const showPagination = settings?.pagination

  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate items per view and total pages
  const itemsPerView = Math.min(settings?.columns, slides.length);
  const totalPages = Math.ceil(slides.length / itemsPerView);

  // Autoplay
  useEffect(() => {
    if (!autoplay || isHovered || totalPages <= 1) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, speed);

    return () => clearInterval(timer);
  }, [autoplay, speed, totalPages, isHovered]);

  // Go to next/prev
  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Get current visible slides
  const startIndex = currentPage * itemsPerView;
  const visibleSlides = slides.slice(startIndex, startIndex + itemsPerView);

  return (
    <div className={`${containerWidth} mx-auto px-4 sm:px-6`}>
      <div 
        className="relative overflow-hidden"
        style={{ height: `${height}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slide Container */}
        <div className="flex h-full gap-4 p-4">
          {visibleSlides.map((slide, index) => (
            <motion.div
              key={slide._id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-1 h-full overflow-hidden rounded-lg relative group"
            >
              <img
                src={slide.image || slide.image_full_path || slide.url}
                alt={slide.title || "Slide image"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay with content */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {slide.title && (
                    <h3 className="text-white text-lg font-semibold">
                      {slide.title}
                    </h3>
                  )}
                  {slide.sub_description && (
                    <p className="text-white/80 text-sm mt-1">
                      {slide.sub_description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {showNavigations && totalPages > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 p-2 text-white transition-all hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 p-2 text-white transition-all hover:scale-110"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {showPagination && totalPages > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentPage 
                    ? "w-8 bg-white" 
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptySlides = () => (
  <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
    Add slides from the property panel →
  </div>
);

const makeCarousel = (renderSlide, defaultHeight = 400) => {
  const Carousel = ({ content, settings, styles }) => {
    const slides = content.slides || content.images || [];
    const slider = useSlider(slides.length, settings);

    console.log("simple carousel - ",{
      content,settings,styles
    })
    if (!slides.length) {
      return (
        <div style={{ height: defaultHeight }}>
          <EmptySlides />
        </div>
      );
    }
    return (
      <SliderShell
        settings={settings}
        slider={slider}
        count={slides.length}
        height={styles?.imageHeight || defaultHeight}
      >
        <div className="grid grid-col-3">
           {slides.map((slide, i) => (
          <div
            key={slide._id || i}
            className={`absolute inset-0 transition-opacity duration-500 ${i === slider.index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {renderSlide(slide, settings)}
          </div>
        ))}
        </div>
       
      </SliderShell>
    );
  };
  return Carousel;
};

const TextImageSlide = (slide, settings = {}) => {
  return (
    <div
      className="flex h-full flex-col items-center justify-center bg-slate-800 bg-cover bg-center px-8 text-center text-white"
      style={{
        backgroundImage: slide.image ? `url(${slide.image})` : undefined,
      }}
    >
      {settings?.showContent && (
        <div className="rounded-md bg-black/40 px-6 py-4">
          {slide.title && <h2 className="text-2xl font-bold">{slide.title}</h2>}

          {slide.subtitle && (
            <p className="mt-1 text-sm text-white/80">{slide.subtitle}</p>
          )}

          {slide.buttonText && (
            <a
              href={slide.buttonLink || "#"}
              onClick={(e) => e.preventDefault()}
              className="mt-3 inline-block rounded bg-white px-4 py-1.5 text-sm text-slate-900"
            >
              {slide.buttonText}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const ImageOnlySlide = (slide) =>
  slide.image ? (
    <img src={slide.image} alt="" className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full items-center justify-center bg-slate-700 text-xs text-white/60">
      No image
    </div>
  );

/* --------------------------- Template map --------------------------- */


const TEMPLATES = {
  "banner.classicBanner": ClassicBanner,
  "banner.stellarBanner": StellarBanner,
  "banner.simpleBanner": SimpleBanner,
  "banner.gradentBanner": GradientBanner,
  "banner.auroraBanner": AuroraBanner,
  "carousel.classicCarousel": makeCarousel(TextImageSlide, 700),
  "carousel.simpleCarousel": ColumnSlider,
  "carousel.modernCarousel": makeCarousel(TextImageSlide, 440),
  "carousel.imageCarousel": makeCarousel(ImageOnlySlide, 380),
  "carousel.immersiveSlider": makeCarousel(TextImageSlide, 520),
  "carousel.simpleImageSlider": makeCarousel(ImageOnlySlide, 400),
};

const HeroRenderer = ({
  type,
  template,
  content = {},
  settings = {},
  styles = {},
}) => {
  const Template = TEMPLATES[`${type}.${template}`];
  if (!Template) {
    return (
      <div className="rounded border border-dashed p-6 text-center text-xs text-muted-foreground">
        Missing hero template: {type}.{template}
      </div>
    );
  }
  return <Template content={content} settings={settings} styles={styles} />;
};

export default HeroRenderer;
