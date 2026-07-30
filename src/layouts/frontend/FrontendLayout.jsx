import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar, { RootNavbar } from "@/components/frontend/navbar/Navbar";
import Footer, { RootFooter } from "@/components/frontend/footer/Footer";
import Loading from "@/components/shear/Loading";
import { Outlet } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery";
import { asset } from "@/lib/helper";
import RootHomePage from "@/pages/frontend/home/RootHomePage";

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
  const ogImage = asset(seo.og_image) || settings?.logo_full_path;

  const twitterTitle = seo.twitter_title || ogTitle;
  const twitterDescription = seo.twitter_description || ogDescription;
  const twitterImage = asset(seo.twitter_image) || ogImage;

  // favicon: prefer explicit favicon, fall back to logo
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

const FrontendLayout = () => {
  const { data: settingResponse, isLoading: settingLoading } = useApiQuery({
    url: `/settings`,
  });

  const settings = settingResponse?.data?.data || {};

  if (settingLoading) {
    return <Loading />;
  }

  if (settings?.business_id === "ROOT") {
    return <RootLayout settings={settings} />;
  }

  return <BusinessLayout settings={settings} />;
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

const BusinessLayout = ({ settings }) => {
  const settingMeta = settings?.meta ? settings?.meta : {};

  const { data: navbarResponse, isLoading: navbarLoading } = useApiQuery({
    url: `/navbars/show/${settingMeta?.navbar_id}`,
    enabled: !!settingMeta?.navbar_id,
  });

  const { data: footerResponse, isLoading: footerLoading } = useApiQuery({
    url: `/footers/show/${settingMeta?.footer_id}`,
    enabled: !!settingMeta?.footer_id,
  });

  if (navbarLoading || footerLoading) {
    return <Loading />;
  }

  const navbar = navbarResponse?.data || {};
  const footer = footerResponse?.data || {};

  return (
    <div className="min-h-screen bg-background hide-scrollbar">
      {/* site-wide default SEO + favicon + title, driven by /settings */}
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