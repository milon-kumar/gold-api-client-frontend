import React, { useEffect, useState, useCallback } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { cn } from "@/lib/utils";

const StandardCarousel = ({ content, settings, styles }) => {
    const { slides = [] } = content || {};

    const {
        showContent = true,
        autoplay = true,
        speed = 3000,
    } = settings || {};

    const {
        sectionBG = "",
        sectionPaddingY = 0,
        paddingX = 0,
        imageHeight = "500",
    } = styles || {};

    const [api, setApi] = useState(null);
    const [current, setCurrent] = useState(0);

    // dots sync
    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => api.off("select", onSelect);
    }, [api]);

    // autoplay
    useEffect(() => {
        if (!api || !autoplay || slides.length <= 1) return;
        const interval = setInterval(() => {
            if (api.canScrollNext()) {
                api.scrollNext();
            } else {
                api.scrollTo(0);
            }
        }, Number(speed) || 3000);
        return () => clearInterval(interval);
    }, [api, autoplay, speed, slides.length]);

    const scrollTo = useCallback((i) => api?.scrollTo(i), [api]);

    if (!slides.length) return null;

    return (
        <div
            style={{
                backgroundColor: sectionBG || undefined,
                paddingTop: `${sectionPaddingY}px`,
                paddingBottom: `${sectionPaddingY}px`,
                paddingLeft: `${paddingX}px`,
                paddingRight: `${paddingX}px`,
            }}
        >
            <Carousel setApi={setApi} className="relative w-full group">
                <CarouselContent>
                    {slides.map((slide) => (
                        <CarouselItem key={slide._id}>
                            <div
                                className="relative w-full overflow-hidden rounded-2xl"
                                style={{ height: `${imageHeight}px` }}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="h-full w-full object-cover"
                                />

                                {/* readability এর জন্য bottom-to-top gradient overlay */}
                                {showContent && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                )}

                                {showContent && (
                                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-14">
                                        <div className="max-w-2xl">
                                            {slide.title && (
                                                <h2 className="text-2xl font-bold text-white drop-shadow-sm md:text-4xl lg:text-5xl line-clamp-2">
                                                    {slide.title}
                                                </h2>
                                            )}
                                            {slide.description && (
                                                <p className="mt-3 text-sm text-slate-200/90 md:text-base line-clamp-2 md:line-clamp-3">
                                                    {slide.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* nav arrows - hover এ visible, otherwise subtle */}
                <CarouselPrevious className="left-4 opacity-0 transition-opacity group-hover:opacity-100" />
                <CarouselNext className="right-4 opacity-0 transition-opacity group-hover:opacity-100" />

                {/* dots pagination */}
                {slides.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                        {slides.map((slide, i) => (
                            <button
                                key={slide._id}
                                type="button"
                                onClick={() => scrollTo(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    current === i ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                                )}
                            />
                        ))}
                    </div>
                )}
            </Carousel>
        </div>
    );
}

export default StandardCarousel