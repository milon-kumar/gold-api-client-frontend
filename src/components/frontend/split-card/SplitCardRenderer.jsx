import React from 'react'
import Simple from '@/components/frontend/split-card/Simple'

const SplitCardRenderer = ({ tempalte = "simple", ...props }) => {
    const components = {
        simple: <Simple {...props} />
    }
    return components[tempalte] || <Simple {...props} />
}

export default SplitCardRenderer