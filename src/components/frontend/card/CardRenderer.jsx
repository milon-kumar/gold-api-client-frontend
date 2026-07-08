import React from 'react'
import Simple from "@/components/frontend/card/Simple"

const CardRenderer = ({tempalte = "simple", ...props}) => {
    const components = {
        simple : <Simple {...props}/>
    }
  return components[tempalte] || <Simple {...props}/>
}

export default CardRenderer