import React from 'react'
import { cn } from '@/lib/utils';
import { getWords } from '@/lib/helper';
import { imageFitClass } from "@/lib/styleHelper";

const DefaultListItemCard = ({
    i,
    item = {},
    handelDetails,
    settings={},
    styles= {}
}) => {
    const cardContent = item.sub_title || item.sub_description || item.description;
        const {
        cardSubTitleWordLimit = 50,
        columns = "4",
        layoutType = "grid", 
        sectionHeader = "classic",
    } = settings || {};

    
    return (
        <div
            key={item._id || i}
            className="overflow-hidden rounded-lg border h-full"
        >
            {item.image && (
                <div
                    style={{ height: styles?.cardImageHeight || 200 }}
                    className="object-contain"
                >
                    <img
                        src={item.image}
                        alt={item.title}
                        className={cn(
                            "h-full w-full",
                            imageFitClass[styles?.imageFit] ?? "object-cover",
                        )}
                    />
                </div>
            )}

            <div className="p-4">
                <h3
                    className="text-2xl font-semibold text-slate-900 cursor-pointer"
                    onClick={() => handelDetails(item)}
                >
                    {item.title}
                </h3>
                {cardContent && (
                    <p
                        className="mt-1 text-base text-slate-500"
                        dangerouslySetInnerHTML={{
                            __html: getWords(cardContent, cardSubTitleWordLimit),
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default DefaultListItemCard