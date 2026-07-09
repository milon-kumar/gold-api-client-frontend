import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

// Some records have a corrupted / char-indexed meta string,
// so parse defensively and only accept the proper shape.
function parseMeta(meta) {
  try {
    const parsed = typeof meta === "string" ? JSON.parse(meta) : meta;
    // Corrupted meta looks like {"0":"{","1":"\"", ...} — reject it
    if (parsed && typeof parsed === "object" && !("0" in parsed)) {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

export default function SimpleImageSlider({ sliders }) {
  if (!sliders?.length) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-muted text-muted-foreground">
        No slides available
      </div>
    );
  }

  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent className="ml-0 h-[80vh]">
        {sliders.map((slide) => {
          const meta = parseMeta(slide.meta);

          return (
            <CarouselItem key={slide.id} className="relative pl-0">
              <img
                src={slide.image_full_path}
                alt={slide.title}
                className="block h-full w-full object-cover"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}