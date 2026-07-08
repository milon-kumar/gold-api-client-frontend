import React from 'react'
import Simple from '@/components/frontend/image-group/Simple'

const ImageGroupRenderer = ({ template = "simple", ...props }) => {
    const components = {
        simple: <Simple {...props} />
    }
    return components[template] || <Simple {...props} />
}

export default ImageGroupRenderer