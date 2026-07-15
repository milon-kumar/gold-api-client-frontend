import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

/* ------------------------------ Banners ------------------------------ */

const ClassicBanner = ({ content, settings }) => (
  <div
    className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-lg bg-slate-800 bg-cover bg-center px-6 py-16 text-center text-white"
    style={{ backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined }}
  >
    <div className="absolute inset-0" style={{ background: settings.overlayColor || "rgba(0,0,0,0.5)" }} />
    <div className="relative z-10 max-w-2xl space-y-3">
      <h1 className="text-3xl font-bold md:text-4xl">{content.title}</h1>
      {content.subtitle && <p className="text-lg opacity-90">{content.subtitle}</p>}
      {content.description && <p className="text-sm opacity-75">{content.description}</p>}
      {content.buttonText && (
        <a
          href={content.buttonLink || "#"}
          className="inline-block rounded-md bg-white px-5 py-2 text-sm font-medium text-slate-900"
          onClick={(e) => e.preventDefault()}
        >
          {content.buttonText}
        </a>
      )}
    </div>
  </div>
);

const StellarBanner = ({ content, settings }) => {
  const align =
    settings.align === "left" ? "items-start text-left" :
    settings.align === "right" ? "items-end text-right" :
    "items-center text-center";
  return (
    <div
      className="relative flex min-h-[380px] flex-col justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-900 via-slate-900 to-black bg-cover bg-center px-8 py-16 text-white"
      style={{ backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined }}
    >
      <div className={`relative z-10 flex max-w-3xl flex-col gap-4 ${align} mx-auto w-full`}>
        {content.badge && (
          <span className="rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-widest">
            {content.badge}
          </span>
        )}
        <h1 className="text-4xl font-bold md:text-5xl">{content.title}</h1>
        {content.subtitle && <p className="text-lg text-white/80">{content.subtitle}</p>}
        <div className="flex gap-3">
          {content.primaryButtonText && (
            <a href={content.primaryButtonLink || "#"} onClick={(e) => e.preventDefault()}
              className="rounded-md bg-white px-5 py-2 text-sm font-medium text-slate-900">
              {content.primaryButtonText}
            </a>
          )}
          {content.secondaryButtonText && (
            <a href={content.secondaryButtonLink || "#"} onClick={(e) => e.preventDefault()}
              className="rounded-md border border-white/40 px-5 py-2 text-sm font-medium">
              {content.secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const SimpleBanner = ({ content, settings }) => (
  <div
    className="relative flex items-center justify-center overflow-hidden rounded-lg bg-slate-200 bg-cover bg-center"
    style={{
      height: `${settings.height || 320}px`,
      backgroundImage: content.image ? `url(${content.image})` : undefined,
    }}
  >
    <div className="rounded-md bg-black/40 px-6 py-4 text-center text-white">
      <h1 className="text-2xl font-semibold">{content.title}</h1>
      {content.buttonText && (
        <a href={content.buttonLink || "#"} onClick={(e) => e.preventDefault()}
          className="mt-3 inline-block rounded bg-white px-4 py-1.5 text-sm text-slate-900">
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

  const prev = () => setIndex((i) => (i - 1 < 0 ? (loop ? count - 1 : 0) : i - 1));
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
        <button onClick={slider.prev}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={slider.next}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white">
          <ChevronRight className="h-4 w-4" />
        </button>
      </>
    )}
    {settings.pagination !== false && count > 1 && (
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <button key={i} onClick={() => slider.setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === slider.index ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
        ))}
      </div>
    )}
  </div>
);

const EmptySlides = () => (
  <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
    Add slides from the property panel →
  </div>
);

const makeCarousel = (renderSlide, defaultHeight = 400) => {
  const Carousel = ({ content, settings }) => {
    const slides = content.slides || content.images || [];
    const slider = useSlider(slides.length, settings);
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
        height={settings.height || defaultHeight}
      >
        {slides.map((slide, i) => (
          <div key={slide._id || i}
            className={`absolute inset-0 transition-opacity duration-500 ${i === slider.index ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            {renderSlide(slide)}
          </div>
        ))}
      </SliderShell>
    );
  };
  return Carousel;
};

const TextImageSlide = (slide) => (
  <div
    className="flex h-full flex-col items-center justify-center bg-slate-800 bg-cover bg-center px-8 text-center text-white"
    style={{ backgroundImage: slide.image ? `url(${slide.image})` : undefined }}
  >
    <div className="rounded-md bg-black/40 px-6 py-4">
      {slide.title && <h2 className="text-2xl font-bold">{slide.title}</h2>}
      {slide.subtitle && <p className="mt-1 text-sm text-white/80">{slide.subtitle}</p>}
      {slide.buttonText && (
        <a href={slide.buttonLink || "#"} onClick={(e) => e.preventDefault()}
          className="mt-3 inline-block rounded bg-white px-4 py-1.5 text-sm text-slate-900">
          {slide.buttonText}
        </a>
      )}
    </div>
  </div>
);

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
  "carousel.classicCarousel": makeCarousel(TextImageSlide, 420),
  "carousel.simpleCarousel": makeCarousel(TextImageSlide, 360),
  "carousel.modernCarousel": makeCarousel(TextImageSlide, 440),
  "carousel.imageCarousel": makeCarousel(ImageOnlySlide, 380),
  "carousel.immersiveSlider": makeCarousel(TextImageSlide, 520),
  "carousel.simpleImageSlider": makeCarousel(ImageOnlySlide, 400),
};

const HeroRenderer = ({ type, template, content = {}, settings = {} }) => {
  const Template = TEMPLATES[`${type}.${template}`];
  if (!Template) {
    return (
      <div className="rounded border border-dashed p-6 text-center text-xs text-muted-foreground">
        Missing hero template: {type}.{template}
      </div>
    );
  }
  return <Template content={content} settings={settings} />;
};

export default HeroRenderer;