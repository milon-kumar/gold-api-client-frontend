import { getWords } from "@/lib/helper";
import SectionHeader from "./SectionHeaderVarients";
import { imageFitClass } from "@/lib/styleHelper";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { StaffCard } from "@/pages/frontend/all-staffs/AllStaffs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import VideoCard from "./partials/video-gallery/VideoCard";
import VideoLightbox from "./partials/video-gallery/VideoLightBox";
import { useState } from "react";
import ImageCard from "./partials/image-gallery/ImageCard";
import ImageLightbox from "./partials/image-gallery/ImageLightbox";

const colsClass = (columns) =>
    ({ 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5" })[
    Number(columns)
    ] || "md:grid-cols-3";

const Empty = ({ label }) => (
    <p className="rounded border border-dashed p-6 text-center text-xs text-muted-foreground">
        Add {label} from the property panel →
    </p>
);


const ListCardTempalte = ({ content, settings, styles }) => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null)
    const handelDetails = (item) => {
        setSelectedItem(item)
        navigate(`/details/${item?._sourceId}`);
    };

    const {
        cardSubTitleWordLimit = 50,
        columns = "4",
        layoutType = "grid", // grid | carousel
        sectionHeader = "classic",
    } = settings || {};

    const moduleType = content?.items?.[0]?._moduleType || 'list';

    const renderCard = (item, i) => {
        switch (moduleType) {
            case 'user':
                return <StaffCard key={item.id || i} staff={item.item} />;
            case 'video':
                return (
                    <div key={item._id || i}>
                        <VideoCard video={item.item} index={i} onClick={(item) => {
                            setSelectedItem({
                                item:{
                                    ...item
                                }
                            })
                        }}/>
                        {
                            selectedItem && (
                                <VideoLightbox video={selectedItem.item} onClose={() => setSelectedItem(null)} />
                            )
                        }
                    </div>
                )
            case 'image' :
                return (
                    <div key={item._id || i}>
                        <ImageCard photo={item.item} index={i}  onClick={(item) => {
                            setSelectedItem({
                                item:{
                                    ...item
                                }
                            })
                        }}/>
                        {
                            selectedItem && (
                                <ImageLightbox image={selectedItem.item} onClose={() => setSelectedItem(null)}/>
                            )
                        }
                    </div>
                )    
            default: {
                const cardContent = item.sub_title || item.sub_description || item.description;
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
        }
    };

    return (
        <div className="">
            {content.title && (
                <SectionHeader
                    variant={sectionHeader}
                    badge={content.badge}
                    title={content.title}
                    subtitle={content.subtitle}
                />
            )}

            {content.items?.length ? (
                layoutType === "carousel" ? (
                    <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent className="-ml-4">
                            {content.items.map((item, i) => (
                                <CarouselItem
                                    key={item._id || i}
                                    className={cn(
                                        "pl-4",
                                        {
                                            2: "md:basis-1/2",
                                            3: "md:basis-1/3",
                                            4: "md:basis-1/4",
                                        }[Number(columns)] || "md:basis-1/3",
                                        "basis-full"
                                    )}
                                >
                                    {renderCard(item, i)}
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                ) : (
                    <div className={`grid gap-4 ${colsClass(columns)}`}>
                        {content.items.map((item, i) => renderCard(item, i))}
                    </div>
                )
            ) : (
                <Empty label="items" />
            )}
        </div>
    );
};

export default ListCardTempalte;