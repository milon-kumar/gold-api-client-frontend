import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

/**
 * ValueSlider
 * - value thumb er upore dekha jay
 * - track er border dashed
 * - slide korle filled (range) part vora hoy
 *
 * shadcn er Slider er drop-in replacement (same props API).
 */
const ValueSlider = React.forwardRef(
    ({ className, value, defaultValue, ...props }, ref) => {
        const current = value?.[0] ?? defaultValue?.[0] ?? 0;

        return (
            <SliderPrimitive.Root
                ref={ref}
                value={value}
                defaultValue={defaultValue}
                className={cn(
                    "relative flex w-full touch-none select-none items-center py-3",
                    className,
                )}
                {...props}
            >
                <SliderPrimitive.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full border border-dashed border-muted-foreground/40 bg-transparent">
                    <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary transition-colors" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb
                    className={cn(
                        "flex h-6 min-w-6 items-center justify-center rounded-full",
                        "border border-primary bg-background px-1 shadow-md",
                        "text-[9px] font-semibold tabular-nums text-primary",
                        "cursor-grab transition-transform active:scale-110 active:cursor-grabbing",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                        "disabled:pointer-events-none disabled:opacity-50",
                    )}
                >
                    {current}
                </SliderPrimitive.Thumb>
            </SliderPrimitive.Root>
        );
    },
);
ValueSlider.displayName = "ValueSlider";

export {ValueSlider};