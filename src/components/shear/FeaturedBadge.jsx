import React from 'react'
import { Badge } from '@/components/ui/badge';

const FeaturedBadge = () => {
    return (
        <div className="absolute top-3 left-3 z-20">
            <Badge className="border-0 bg-yellow-500 text-white shadow-lg">
                ⭐ Featured
            </Badge>
        </div>
    )
}

export default FeaturedBadge