import React, { useEffect } from "react";
import { useOutletContext, useParams } from "react-router";

import { useApiQuery } from "@/hooks/useAppQuery";

import VideoGallery from "@/pages/frontend/video-gallery/VideoGallery";
import ContactUs from "@/pages/frontend/contact-us/ContactUs";
import ImageGallery from "@/pages/frontend/photo-gallery/PhotoGallery";
import NewsList from "@/pages/frontend/news/NewsList";

import NoContentFound from "@/components/partials/frontend/NoContentFound";
import PageBreadCrumb from "@/components/partials/frontend/PageBreadCrumb";

import { Loader2 } from "lucide-react";
import { safeJsonParse } from "@/lib/helper";
import FrontendSectionRenderer from "@/components/renderers/FrontendSectionRender";
import PageHeroRenderer from "@/components/renderers/PageHeroRenderer";
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

  const { data: getPageResponse,
    isLoading: getPageLoading,
    refetch: getPageRefetch
  } = useApiQuery({
    url: `/page-by-slug/${slug}`,
    enabled: !!slug,
  });

  const page = getPageResponse?.data
  const meta = page?.meta ? JSON.parse(page.meta) : {};

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
      <div>
       <PageHeroRenderer
        variant={meta?.headerTemplate ?? "gradient"}
        eyebrow={meta?.heroContent?.badge ?? pageContent?.page_title}
        title={meta?.heroContent?.title ?? "Get In"}
        highlight={meta?.heroContent?.heightlight ?? "Touch"}
        description={
          meta?.heroContent?.description ??
          "We're here to help. Reach out to us with your questions, feedback, or inquiries, and our team will get back to you as soon as possible."
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label:slug ?? pageContent?.page_title },
        ]}
      />
        <div className="max-w-7xl mx-auto">
        {/* <PageBreadCrumb pageContent={pageContent} /> */}
        <div className="max-w-7xl">
          <CustomContent pageContent={pageContent} />
        </div>
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
