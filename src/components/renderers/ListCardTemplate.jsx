import { getWords } from "@/lib/helper";
import SectionHeader from "./SectionHeaderVarients";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { StaffCard } from "@/pages/frontend/all-staffs/AllStaffs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import VideoCard from "./partials/video-gallery/VideoCard";
import VideoLightbox from "./partials/video-gallery/VideoLightBox";
import DefaultListItemCard from "./partials/default-list/DefaultListItemCard";
import BookListItemCard from "./partials/book-list/BookListItemCard";
import SimpleListItemCard from "./partials/simple-list/SimpleListItemCard";

import { useMemo, useState } from "react";
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
        layoutType = "grid", 
        sectionHeader = "classic",
    } = settings || {};

    const moduleType = content?.items?.[0]?._moduleType || 'list';
    const module = content?.items?.[0]?._module || {};

    const listType = useMemo(() => {
        if (module) {
            return module?.meta?.list_type
        }
    }, [module])


    const renderCard = (item, i) => {
        switch (moduleType) {
            case 'user':
                return <StaffCard key={item.id || i} staff={item.item} />;
            case 'video':
                return (
                    <div key={item._id || i}>
                        <VideoCard video={item.item} index={i} onClick={(item) => {
                            setSelectedItem({
                                item: {
                                    ...item
                                }
                            })
                        }} />
                        {
                            selectedItem && (
                                <VideoLightbox video={selectedItem.item} onClose={() => setSelectedItem(null)} />
                            )
                        }
                    </div>
                )
            case 'image':
                return (
                    <div key={item._id || i}>
                        <ImageCard photo={item.item} index={i} onClick={(item) => {
                            setSelectedItem({
                                item: {
                                    ...item
                                }
                            })
                        }} />
                        {
                            selectedItem && (
                                <ImageLightbox image={selectedItem.item} onClose={() => setSelectedItem(null)} />
                            )
                        }
                    </div>
                )
            case 'list':
                switch (listType) {
                    case 'book':
                        return (
                            <BookListItemCard 
                                i={i}
                                item={item}
                                settings={settings}
                                styles={styles}
                            />
                        )
                    case 'simple':
                        return (
                            <SimpleListItemCard
                                i={i}
                                item={item}
                                settings={settings}
                                styles={styles}
                            />
                        )
                    default:
                        return <DefaultListItemCard
                            i={i}
                            item={item}
                            handelDetails={handelDetails}
                            settings={settings}
                            styles={styles}
                        />
                }
            default:
                return <DefaultListItemCard
                    i={i}
                    item={item}
                    handelDetails={handelDetails}
                    settings={settings}
                    styles={styles}
                />
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