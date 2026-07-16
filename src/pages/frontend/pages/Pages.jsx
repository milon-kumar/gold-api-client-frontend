import React, { useEffect } from "react";
import { useOutletContext, useParams } from "react-router";

import { useApiQuery } from "@/hooks/useAppQuery";

import VideoGallery from "@/pages/frontend/video-gallery/VideoGallery";
import ContactUs from "@/pages/frontend/contact-us/ContactUs";
import ImageGallery from "@/pages/frontend/image-gallery/ImageGallery";
import NewsList from "@/pages/frontend/news/NewsList";

import NoContentFound from "@/components/partials/frontend/NoContentFound";
import PageBreadCrumb from "@/components/partials/frontend/PageBreadCrumb";

import { Loader2 } from "lucide-react";
import { safeJsonParse } from "@/lib/helper";
import FrontendSectionRenderer from "@/components/renderers/FrontendSectionRender";
const Pages = () => {
  const { slug } = useParams();

  const { data, isLoading, refetch } = useApiQuery({
    url: `/page-by-slug/${slug}`,
    enabled: false,
  });

  useEffect(() => {
    if (slug) {
      refetch();
    }
  }, [slug]);

  const pageContent = data?.data;
  const pageConfig = safeJsonParse(pageContent?.meta);
  const sections = safeJsonParse(pageConfig?.page_config) || [];

  console.log("Page content - ", { pageContent, pageConfig, sections });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-75">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!pageContent) {
    return <NoContentFound />;
  }

  if (pageContent?.page_type === "custom_page") {
    return <FrontendSectionRenderer sections={sections} />;
  }

  if (pageContent?.page_type === "custom") {
    return (
      <div className="max-w-7xl mx-auto">
        <PageBreadCrumb pageContent={pageContent} />
        <div className="max-w-7xl">
          <CustomContent pageContent={pageContent} />
        </div>
      </div>
    );
  }
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
          __html: pageContent?.page_content,
        }}
      />
    </div>
  );
};
