import React from 'react'
import ClassicBanner from "@/components/frontend/hero/banner/ClassicBanner"
import StellarBanner from "@/components/frontend/hero/banner/StellarBanner"
import SimpleBanner from "@/components/frontend/hero/banner/SimpleBanner"

import ClassicCarousel from "@/components/frontend/hero/carousel/ClassicCarousel"
import SimpleCarousel from "@/components/frontend/hero/carousel/SimpleCarousel"
import ModernCarousel from "@/components/frontend/hero/carousel/ModernCarousel"
import ImageCarousel from "@/components/frontend/hero/carousel/ImageCarousel"
import ImmersiveSlider from "@/components/frontend/hero/carousel/ImmersiveSlider"
import SimpleImageSlider from "@/components/frontend/hero/carousel/SimpleImageSlider"

const HeroRenderer = ({ sectionType = "banner", template = 'classicBanner', ...rest }) => {

    const components = {
        banner: {
            classicBanner: <ClassicBanner {...rest} />,
            stellarBanner: <StellarBanner {...rest} />,
            simpleBanner: <SimpleBanner {...rest} />
        },

        carousel: {
            classicCarousel: <ClassicCarousel {...rest} />,
            simpleCarousel: <SimpleCarousel {...rest} />,
            modernCarousel: <ModernCarousel {...rest} />,
            imageCarousel: <ImageCarousel {...rest} />,
            immersiveSlider: <ImmersiveSlider {...rest} />,
            simpleImageSlider: <SimpleImageSlider {...rest}/>
        }
    }

    return components[sectionType][template]
}

export default HeroRenderer