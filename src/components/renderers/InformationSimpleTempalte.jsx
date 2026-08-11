import React from 'react'
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const extractArbitraryGradient = (cls) => {
    const match = cls?.match(/^bg-\[(linear|radial)-gradient\(([^)]+)\)\]$/);
    if (!match) return null;
    const type = match[1];
    const inner = match[2].replace(/_/g, " ");
    return `${type}-gradient(${inner})`;
};

const InformationSimpleTempalte = ({ content, settings, styles }) => {
    const {
        badge,
        title,
        description,
        image,
        buttonText,
        buttonLink,
    } = content || {};

    const {
        showBadge = false,
        sectionHeaderBadge = "soft",
        useGradentBg = false,
        useImageAsBg = false,
    } = settings || {};

    const {
        sectionBG = "#ffffff",
        sectionGradentBG = "bg-linear-to-r from-cyan-500 to-blue-500",
        sectionPaddingY = 48,
        paddingX = 16,
        headingFontSize = 40,
        headingColor = "#0f172a",
        headingPb = 12,
        paragraphFontSize = 16,
        paragraphColor = "#475569",
        imageRounded = 12,
        applyImageScaleOnHover = false,
        applyImageShadowEffect = false,
        bgOverlayColor = "#000000",
        bgOverlayOpacity = 0.45,
        bgBlurAmount = 15,
    } = styles || {};

    const isImageBg = useImageAsBg && Boolean(image);

    const arbitraryGradientCSS = useGradentBg
        ? extractArbitraryGradient(sectionGradentBG)
        : null;

    const sectionStyle = {
        paddingTop: `${sectionPaddingY}px`,
        paddingBottom: `${sectionPaddingY}px`,
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`,
        position: "relative",
        overflow: "hidden",
        ...(!isImageBg &&
            (useGradentBg
                ? arbitraryGradientCSS
                    ? { background: arbitraryGradientCSS }
                    : {}
                : { background: sectionBG })),
    };

    return (
        <div
            className={cn(
                "text-center",
                useGradentBg && !isImageBg && !arbitraryGradientCSS && sectionGradentBG
            )}
            style={sectionStyle}
        >
            {/* actual image blur করা হচ্ছে এই dedicated layer এ — backdrop-filter নয়, filter দিয়ে */}
            {isImageBg && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: `blur(${bgBlurAmount}px)`,
                        // blur এর edge-artifact (ফাঁকা ধার) ঢাকতে সামান্য scale up
                        transform: "scale(1.15)",
                    }}
                />
            )}

            {/* darken/overlay color — এখন এটা আলাদা layer, blur এর সাথে mix হচ্ছে না */}
            {isImageBg && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: bgOverlayColor,
                        opacity: bgOverlayOpacity,
                    }}
                />
            )}

            {/* actual content */}
            <div className="relative z-10">
                {showBadge && badge && (
                    <Badge variant={sectionHeaderBadge}>{badge}</Badge>
                )}

                {title && (
                    <h2
                        className="mt-3 font-bold"
                        style={{
                            fontSize: `${headingFontSize}px`,
                            color: isImageBg ? "#ffffff" : headingColor,
                            paddingBottom: `${headingPb}px`,
                        }}
                    >
                        {title}
                    </h2>
                )}

                {description && (
                    <div
                        className="mx-auto mt-2 max-w-3xl leading-relaxed"
                        style={{
                            fontSize: `${paragraphFontSize}px`,
                            color: isImageBg ? "#e2e8f0" : paragraphColor,
                        }}
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                )}

                {image && !isImageBg && (
                    <div className="mt-6 flex justify-center">
                        <img
                            src={image}
                            alt={title || ""}
                            className={cn(
                                "max-w-full transition-all duration-300",
                                applyImageScaleOnHover && "hover:scale-105",
                                applyImageShadowEffect && "shadow-xl hover:shadow-2xl"
                            )}
                            style={{
                                borderRadius: `${imageRounded}px`,
                            }}
                        />
                    </div>
                )}

                {buttonText && (
                    <div className="mt-6">
                        <a
                            href={buttonLink || "#"}
                            className="inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            {buttonText}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InformationSimpleTempalte