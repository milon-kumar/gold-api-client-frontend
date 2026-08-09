import React from 'react'

const VideoGallery = ({
    template,
    content = {},
    settings = {},
    styles = {},
}) => {
  return (
    JSON.stringify({
        template,
        content,
        settings,
        styles
    })
  )
}

export default VideoGallery