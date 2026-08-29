import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar, { RootNavbar } from "@/components/frontend/navbar/Navbar";
import Footer, { RootFooter } from "@/components/frontend/footer/Footer";
import Loading from "@/components/shear/Loading";
import { Outlet } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery";
import RootHomePage from "@/pages/frontend/home/RootHomePage";

/**
 * Site-wide SEO tags, driven by settings.meta.seo_content
 * (the same shape saved from the admin "SEO" section:
 *  { title, description, meta_tags, og_title, og_description })
 * plus favicon from settings.favicon_full_path (falls back to logo).
 */
const SiteSeo = ({ settings }) => {
  const seo = settings?.meta?.seo_content || {};
  const businessName = settings?.name;

  const title = seo.title || businessName || "Website";
  const description = seo.description || settings?.footer_text || "";
  const keywords = seo.meta_tags || "";

  const ogTitle = seo.og_title || title;
  const ogDescription = seo.og_description || description;
  const ogImage = settings?.logo_full_path;

  // favicon: prefer explicit favicon, fall back to logo
  const faviconHref = settings?.favicon_full_path || settings?.logo_full_path;

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* favicon */}
      {faviconHref && <link rel="icon" type="image/x-icon" href={faviconHref} />}
      {faviconHref && <link rel="shortcut icon" href={faviconHref} />}
      {faviconHref && <link rel="apple-touch-icon" href={faviconHref} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={businessName || title} />
      <meta property="og:title" content={ogTitle} />
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
    </Helmet>
  );
};

const FrontendLayout = () => {
  const { data: settingResponse, isLoading: settingLoading } = useApiQuery({
    url: `/client/settings`,
  });

  const settings = settingResponse?.data?.data || {};

  const navbar = settings?.navbar || {};
  const footer = settings?.footer || {};

  if (settingLoading) {
    return <Loading />;
  }

  // if (settings?.business_id === "ROOT") {
  //   return <RootLayout settings={settings} />;
  // }

  return <BusinessLayout settings={settings} navbar={navbar} footer={footer} />;
};

export default FrontendLayout;

const RootLayout = ({ settings }) => {
  const [activeId, setActiveId] = useState("home");
  const sectionIds = [
    "home",
    "modules",
    "builder",
    "dashboard",
    "accounts",
    "register",
    "contact",
  ];

  const onNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background hide-scrollbar">
      <SiteSeo settings={settings} />
      <RootNavbar activeId={activeId} onNavigate={onNavigate} />
      <RootHomePage onNavigate={onNavigate} />
      <RootFooter onNavigate={onNavigate} />
    </div>
  );
};

const BusinessLayout = ({ settings, navbar, footer }) => {
  return (
    <div className="min-h-screen bg-background hide-scrollbar">
      {/* site-wide default SEO + favicon + title, driven by settings.meta.seo_content */}
      <SiteSeo settings={settings} />

      <Navbar navbar={navbar} />
      <Outlet
        context={{
          settings: settings,
        }}
      />
      <Footer footer={footer} />
    </div>
  );
};