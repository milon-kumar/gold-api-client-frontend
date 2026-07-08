import React, { useEffect } from "react";
import { useParams } from "react-router";

import { useApiQuery } from "@/hooks/useAppQuery";

import VideoGallery from "@/pages/frontend/video-gallery/VideoGallery";
import ContactUs from "@/pages/frontend/contact-us/ContactUs";
import ImageGallery from "@/pages/frontend/image-gallery/ImageGallery";
import NewsList from "@/pages/frontend/news/NewsList";

import NoContentFound from "@/components/partials/frontend/NoContentFound";
import PageBreadCrumb from "@/components/partials/frontend/PageBreadCrumb";

import { Loader2 } from "lucide-react";

const Pages = () => {
    const { slug } = useParams();

    const {
        data,
        isLoading,
        refetch,
    } = useApiQuery({
        url: `/page/${slug}`,
        enabled: false,
    });

    useEffect(() => {
        if (slug) {
            refetch();
        }
    }, [slug]);

    const pageContent =
        data?.data?.page_data;

    console.log("pageContent", pageContent);

    // ✅ Loading State
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!pageContent) {
        return <NoContentFound />;
    }
    0
    // ✅ Component Mapping
    const components = {
        gallery: <ImageGallery />,
        all_videos: <VideoGallery />,
        news_list: <NewsList />,
        contact: <ContactUs />,
    };

    return (
        <div className="max-w-7xl mx-auto">
            <PageBreadCrumb
                pageContent={pageContent}
            />

            <div className="max-w-7xl">
                {pageContent?.page_type === "default" &&
                    components[
                    pageContent?.file_name
                    ]}

                {/* Custom Page */}
                {pageContent?.page_type === "custom" && (
                    <CustomContent
                        pageContent={pageContent}
                    />
                )}

            </div>
        </div>
    );
};

export default Pages;
const CustomContent = ({ pageContent }) => {
    return (
        <div className="w-full px-4 lg:px-6 my-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                {pageContent?.page_title}
            </h1>

            {/* Content */}
            <div
                className="text-muted-foreground leading-7"
                dangerouslySetInnerHTML={{
                    __html:
                        pageContent?.page_content,
                }}
            />


        </div>
    );
};