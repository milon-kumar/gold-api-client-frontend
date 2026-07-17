import React, { useState, useEffect } from "react";
import Navbar, { RootNavbar } from "@/components/frontend/navbar/Navbar";
import Footer, { RootFooter } from "@/components/frontend/footer/Footer";
import Loading from "@/components/shear/Loading";
import { Outlet } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery";
import { asset } from "@/lib/helper";
import RootHomePage from "@/pages/frontend/home/RootHomePage";
const FrontendLayout = () => {
  const { data: settingResponse, isLoading: settingLoading } = useApiQuery({
    url: `/settings`,
  });

  const settings = settingResponse?.data?.data || {};

  if (settingLoading) {
    return <Loading />;
  }

  if (settings?.business_id === "ROOT") {
    return <RootLayout settings={settings}/>;
  }

  return <BusinessLayout settings={settings} />;
};

export default FrontendLayout;

const RootLayout = ({settings}) => {
   const [activeId, setActiveId] = useState("home");
  const sectionIds = ["home", "modules", "builder", "dashboard", "accounts", "register", "contact"];

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
      <RootNavbar activeId={activeId} onNavigate={onNavigate} />
      <RootHomePage onNavigate={onNavigate}/>
      <RootFooter  onNavigate={onNavigate} />
    </div>
  );
};

const BusinessLayout = ({ settings }) => {
  const settingMeta = settings?.meta ? JSON.parse(settings?.meta) : {};

  const {
    data: navbarResponse,
    isLoading: navbarLoading,
    refetch: navbarSettings,
  } = useApiQuery({
    url: `/navbars/show/${settingMeta?.navbar_id}`,
    enabled: !!settingMeta?.navbar_id,
  });

  const {
    data: footerResponse,
    isLoading: footerLoading,
    refetch: footerSettings,
  } = useApiQuery({
    url: `/footers/show/${settingMeta?.footer_id}`,
    enabled: !!settingMeta?.footer_id,
  });

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
    <div className="min-h-screen bg-background hide-scrollbar">
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
