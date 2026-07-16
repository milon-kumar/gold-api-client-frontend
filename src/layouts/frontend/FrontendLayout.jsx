import React from "react";
// import Navbar from "@/layouts/frontend/Navbar";
// import Footer from "@/layouts/frontend/Footer";
import Navbar from "@/components/frontend/navbar/Navbar";
import Footer from "@/components/frontend/footer/Footer";
import Loading from "@/components/shear/Loading";
import { Outlet } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery";
import { asset } from "@/lib/helper";
const FrontendLayout = () => {
  //   const { pathname } = useLocation();

  const { data: settingResponse, isLoading: settingLoading } = useApiQuery({
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

  const settings = settingResponse?.data?.data || {};
  const webPages = pagesResponse?.data || [];
  const linkPages = linkPagesResponse?.data || [];
  const customPages = customPagesResponse?.data || [];

  const settingMeta = settings?.meta ? JSON.parse(settings?.meta) : {};

  const {
    data: navbarResponse,
    isLoading: navbarLoading,
    refetch: navbarSettings,
  } = useApiQuery({
    url: `/admin/navbars/show/${settingMeta?.navbar_id}`,
    // Skip the query if navbar_id doesn't exist
    enabled: !!settingMeta?.navbar_id,
  });

  const {
    data: footerResponse,
    isLoading: footerLoading,
    refetch: footerSettings,
  } = useApiQuery({
    url: `/admin/footers/show/${settingMeta?.footer_id}`,
    // Skip the query if footer_id doesn't exist
    enabled: !!settingMeta?.footer_id,
  });

  if (settingLoading) {
    return <Loading />;
  }

  if (navbarLoading || footerLoading) {
    return <Loading />;
  }

  const navbar = navbarResponse?.data || {};
  const footer = footerResponse?.data || {};

  //   document.title = `${pathname === "/" ? "Home" : pathname?.split("/")?.pop()?.charAt(0)?.toUpperCase() + pathname?.split("/")?.pop()?.slice(1)} | ${settings?.web_title}`;

  const favicon = document.getElementById("app-favicon");

  if (favicon) {
    const href = settings?.favicon_url || settings?.logo_url;

    favicon.href = asset(href) || "/favicon.ico";
  }
  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar websiteSettings={settings} webPages={webPages} /> */}
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

export default FrontendLayout;
