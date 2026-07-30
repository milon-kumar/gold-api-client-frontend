import React from 'react';
import { Helmet } from "react-helmet-async";
import AdminSidebar from "@/components/shear/AdminSidebar.jsx";
import AdminHeader from "@/components/shear/AdminHeader.jsx";
import { Outlet } from "react-router";
import { useApiQuery } from '@/hooks/useAppQuery';
const SiteSeo = ({ settings }) => {
  const seo = settings?.meta?.seo_content || {};
  const businessName = settings?.business?.name;

  const title = seo.meta_title || businessName || "Website";
  const description = seo.meta_description || settings?.footer_text || "";
  const keywords = seo.meta_keywords || "";
  const robots = seo.robots || "index, follow";
  const canonical =
    seo.canonical_url ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const ogTitle = seo.og_title || title;
  const ogDescription = seo.og_description || description;
  const ogImage = seo.og_image || settings?.logo_full_path;

  const twitterTitle = seo.twitter_title || ogTitle;
  const twitterDescription = seo.twitter_description || ogDescription;
  const twitterImage = seo.twitter_image || ogImage;

  const faviconHref = settings?.favicon_full_path || settings?.logo_full_path;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* favicon */}
      {faviconHref && <link rel="icon" type="image/x-icon" href={faviconHref} />}
      {faviconHref && <link rel="shortcut icon" href={faviconHref} />}
      {faviconHref && <link rel="apple-touch-icon" href={faviconHref} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={businessName || title} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
    </Helmet>
  );
};

const AdminLayout = () => {
    const { data: settingResponse, isLoading: settingLoading } = useApiQuery({
        url: `/settings`,
    });

    const settings = settingResponse?.data?.data || {};

    return (
        <>
            <SiteSeo settings={settings} />
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
                <AdminSidebar />
                <div className="flex-1 flex flex-col lg:ml-55">
                    <AdminHeader />
                    <main className="flex-1 sm:p-4 space-y-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
