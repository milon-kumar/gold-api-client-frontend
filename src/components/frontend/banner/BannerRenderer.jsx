import React from 'react'
import FixedBanner from "@/components/frontend/banner/FixedBanner"
import ScrollingBanner from "@/components/frontend/banner/ScrollingBanner"
import MinimalBanner from "@/components/frontend/banner/MinimalBanner"
import InteractiveBanner from "@/components/frontend/banner/InteractiveBanner"
import SolidBanner from "@/components/frontend/hero/banner/SolidBanner"
import DecorativeShapesBanner from "@/components/frontend/banner/DecorativeShapesBanner"
const BannerRenderer = ({ tempalte = "fixedBanner", message }) => {
    const components = {
        fixedBanner: <FixedBanner />,
        scrollingBanner: <ScrollingBanner />,
        minimalBanner: <MinimalBanner />,
        interactiveBanner: <InteractiveBanner />,
        solidBanner: <SolidBanner />,
        decorativeShapesBanner: <DecorativeShapesBanner message={message} />
    }

    return components[tempalte]
}

export default BannerRenderer