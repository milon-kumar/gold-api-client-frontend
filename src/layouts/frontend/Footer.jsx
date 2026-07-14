// Footer.jsx
import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ArrowUp,
  Globe,
  Store,
  AppWindow,
} from "lucide-react";
import { FiFacebook,FiYoutube, FiInstagram,FiLinkedin } from "react-icons/fi";
import { Link } from "react-router";
import { asset, getWords } from "@/lib/helper";

export default function Footer({ settings, webPages , linkPages,customPages}) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getPageUrl = (page) => {
    if (page?.page_type === "link" && page?.custom_link) {
      return page.custom_link;
    }
    return `/page/${page?.page_slug}`;
  };

  const isExternalLink = (page) => {
    return page?.page_type === "link" && page?.custom_link;
  };

  const dynamicColumns = webPages
    ?.filter((page) => page?.children_recursive?.length > 0)
    ?.slice(0, 2)
    ?.map((page) => ({
      title: page.page_title,
      pages: page.children_recursive || [],
    }));

  const socialLinks = [
    { icon: FiFacebook, url: settings?.facebook_link, label: "Facebook" },
    { icon: FiYoutube, url: settings?.youtube_link, label: "YouTube" },
    { icon: FiInstagram, url: settings?.instagram_link, label: "Instagram" },
    { icon: FiLinkedin, url: settings?.linkedin_link, label: "LinkedIn" },
  ].filter((social) => social.url);

  const appLinks = [
    { icon: Store, url: settings?.play_store_link, label: "Play Store" },
    { icon: AppWindow, url: settings?.app_store_link, label: "App Store" },
  ].filter((app) => app.url);

  return (
    <footer className="relative border-t border-border/50 bg-linear-to-b from-amber-50/80 to-white">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform ${
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              {settings?.logo_full_path ? (
                <img
                  src={settings.logo_full_path}
                  alt={settings?.business?.name || "Logo"}
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {settings?.business?.name?.charAt(0) || "দ"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground font-bengali">
                      {settings?.business?.name || "Business Name"}
                    </h3>
                  </div>
                </div>
              )}
            </Link>

            {settings?.footer_text && (
              <div
                className="text-sm text-muted-foreground leading-relaxed font-bengali"
                dangerouslySetInnerHTML={{
                  __html: getWords(settings.footer_text),
                }}
              />
            )}

            {/* Copyright */}
            {settings?.copyright_text && (
              <p className="text-xs text-muted-foreground/70 font-bengali pt-2">
                {settings.copyright_text}
              </p>
            )}
          </div>

          {/* Column 2: Important Links */}
          <div>
            <h4 className="font-bold text-foreground text-sm mb-4 font-bengali relative">
              গুরুত্বপূর্ণ লিংক
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {linkPages?.slice(0, 6)?.map((page) => {
                const url = getPageUrl(page);
                const external = isExternalLink(page);
                return (
                  <li key={page.id}>
                    <a
                      href={url}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group font-bengali"
                    >
                      <span className="w-1 h-1 bg-primary/30 rounded-full group-hover:bg-primary transition-colors"></span>
                      {page.page_title}
                      {external && (
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Custom Pages */}
          <div>
            <h4 className="font-bold text-foreground text-sm mb-4 font-bengali relative">
              {"Pages"}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {(customPages?.slice(0, 6))?.map(
                (page) => {
                  const url = getPageUrl(page);
                  const external = isExternalLink(page);
                  return (
                    <li key={page.id}>
                      <a
                        href={url}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group font-bengali"
                      >
                        <span className="w-1 h-1 bg-primary/30 rounded-full group-hover:bg-primary transition-colors"></span>
                        {page.page_title}
                        {external && (
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    </li>
                  );
                },
              )}
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-foreground text-sm mb-4 font-bengali relative">
                যোগাযোগ
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary rounded-full"></span>
              </h4>
              <div className="space-y-3">
                {settings?.business?.email && (
                  <a
                    href={`mailto:${settings.business.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group font-bengali"
                  >
                    <Mail className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0" />
                    <span className="truncate">{settings.business.email}</span>
                  </a>
                )}
                {settings?.business?.phone && (
                  <a
                    href={`tel:${settings.business.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group font-bengali"
                  >
                    <Phone className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0" />
                    <span>{settings.business.phone}</span>
                  </a>
                )}
                {settings?.business?.location && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground font-bengali">
                    <MapPin className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                    <span>{settings.business.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div>
                <h4 className="font-bold text-foreground text-sm mb-3 font-bengali">
                  সামাজিক মাধ্যম
                </h4>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all duration-300 hover:scale-110"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* App Store Links */}
            {appLinks.length > 0 && (
              <div>
                <h4 className="font-bold text-foreground text-sm mb-3 font-bengali">
                  অ্যাপ ডাউনলোড
                </h4>
                <div className="flex flex-wrap gap-3">
                  {appLinks.map((app, index) => (
                    <a
                      key={index}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all duration-300 text-sm"
                    >
                      <app.icon className="w-4 h-4" />
                      {app.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/70 font-bengali text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            {settings?.business?.name || "Business"}.
            {settings?.copyright_text && ` ${settings.copyright_text}`}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground/70 hover:text-primary transition-colors font-bengali"
            >
              গোপনীয়তা নীতি
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground/70 hover:text-primary transition-colors font-bengali"
            >
              শর্তাবলী
            </a>
            <button
              onClick={scrollToTop}
              className="text-xs text-muted-foreground/70 hover:text-primary transition-colors flex items-center gap-1 font-bengali"
            >
              উপরে যান
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
