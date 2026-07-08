import React from 'react';
import { motion } from 'framer-motion';

const ImageGroup = ({
    images = [],
    rounded = 'lg', // 'sm', 'md', 'lg', 'xl', 'full', 'none'
    gap = 'md', // 'sm', 'md', 'lg'
    layout = 'grid', // 'grid', 'masonry', 'horizontal', 'vertical'
    columns = 3, // for grid layout
    aspect = 'square', // 'square', 'video', 'portrait', 'auto'
    imageSize = 'md', // 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'
    hoverEffect = true,
    showOverlay = false,
    overlayText = '',
    className = '',
    ...props
}) => {

    // Rounded variants
    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full'
    };

    // Gap variants
    const gapClasses = {
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8'
    };

    const imageSizes = {
        xs: 'w-10 h-10 object-cover',
        sm: 'w-20 h-20 object-cover',
        md: 'w-32 h-32 object-cover',
        lg: 'w-48 h-48 object-cover',
        xl: 'w-64 h-64 object-cover',
        '2xl': 'w-80 h-80 object-cover',
        full: 'w-full h-full object-cover'
    }

    // Aspect ratio classes
    const aspectClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        portrait: 'aspect-[3/4]',
        auto: 'aspect-auto'
    };

    // Layout classes
    const layoutClasses = {
        grid: `grid grid-cols-1 sm:grid-cols-2 ${columns > 2 ? `lg:grid-cols-${columns}` : ''}`,
        masonry: 'columns-1 sm:columns-2 lg:columns-3',
        horizontal: 'flex overflow-x-auto',
        vertical: 'flex flex-col'
    };

    const roundedClass = roundedClasses[rounded] || roundedClasses.lg;
    const gapClass = gapClasses[gap] || gapClasses.md;
    const layoutClass = layoutClasses[layout] || layoutClasses.grid;
    const aspectClass = aspectClasses[aspect] || aspectClasses.square;
    const imageSizeClass = imageSizes[imageSize] || imageSizes.md;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className={`max-w-7xl py-10 mx-auto px-4 sm:px-6 ${className}`} {...props}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`${layoutClass} ${gapClass}`}
            >
                {images.map((image, index) => (
                    <motion.div
                        key={image.id || index}
                        variants={itemVariants}
                        whileHover={hoverEffect ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
                        className={`relative overflow-hidden ${aspectClass} ${layout === 'masonry' ? 'mb-4 break-inside-avoid' : ''
                            } ${layout === 'horizontal' ? 'flex-shrink-0 w-80' : ''}`}
                    >
                        <img
                            src={image.url}
                            alt={image.alt || `Image ${index + 1}`}
                            className={`${imageSizeClass} ${roundedClass} transition-all duration-300 ${hoverEffect ? 'hover:scale-105' : ''
                                }`}
                        />

                        {/* Optional overlay */}
                        {showOverlay && (
                            <div className={`absolute inset-0 bg-black/40 ${roundedClass} flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300`}>
                                <p className="text-white text-center font-medium px-4">
                                    {image.overlayText || overlayText || `Image ${index + 1}`}
                                </p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default ImageGroup