import React from "react";
import Navbar from "@/layouts/frontend/Navbar";
import Footer from "@/layouts/frontend/Footer";
import { Outlet, useLocation } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery";
import { asset } from "@/lib/helper";
const FrontendLayout = () => {
  const { pathname } = useLocation();

  const { data:settingResponse } = useApiQuery({
    url: `/settings`,
  });

  const { data: pagesResponse } = useApiQuery({
    url: "/pages",
  });

  const { data: linkPagesResponse } = useApiQuery({
    url: "/pages",
    params: {
      page_type: "link",
    },
  });

  const { data: customPagesResponse } = useApiQuery({
    url: "/pages",
    params: {
      page_type: "custom",
    },
  });

  const websiteSettings = settingResponse?.data?.data || {};
  const webPages = pagesResponse?.data || [];
  const linkPages = linkPagesResponse?.data || [];
  const customPages = customPagesResponse?.data || [];

  console.log("What is the pages data - ", {
    websiteSettings,
    webPages,
    linkPages,
    customPages,
  });

  document.title = `${pathname === "/" ? "Home" : pathname?.split("/")?.pop()?.charAt(0)?.toUpperCase() + pathname?.split("/")?.pop()?.slice(1)} | ${websiteSettings?.web_title}`;

  const favicon = document.getElementById("app-favicon");

  if (favicon) {
    const href = websiteSettings?.favicon_url || websiteSettings?.logo_url;

    favicon.href = asset(href) || "/favicon.ico";
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar websiteSettings={websiteSettings} webPages={webPages} />

      <Outlet />

      <Footer
        websiteSettings={websiteSettings}
        webPages={webPages}
        linkPages={linkPages}
        customPages={customPages}
      />
    </div>
  );
};

export default FrontendLayout;
