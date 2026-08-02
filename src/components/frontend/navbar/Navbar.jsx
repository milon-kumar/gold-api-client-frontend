import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Blocks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
/**
 * Navbar (Preview)
 * Renders a navbar from the navbar builder API data:
 * - left_config  : logo (text or image)
 * - items        : nav links (nested children => dropdown)
 * - right_config : action buttons (variant, newTab)
 *
 * NOTE: This is preview-safe — it is NOT position:fixed,
 * so it sits inline inside the preview panel.
 */

// "home" | "page/about" | "https://..." | "/login" -> proper href

const resolveUrl = (url) => {
  if (!url) return "#";
  if (/^https?:\/\//i.test(url)) return url;
  return url.startsWith("/") ? url : `/${url}`;
};

const sortByOrder = (arr = []) =>
  [...arr].sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0));

/* ---------------- Desktop dropdown ---------------- */
const DesktopDropdown = ({ items = [], isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="absolute left-0 top-full z-50 mt-2 min-w-52 overflow-hidden rounded-xl border bg-white shadow-xl shadow-black/5"
      >
        <div className="p-1.5">
          {sortByOrder(items).map((child) => (
            <a
              key={child.id}
              href={resolveUrl(child.url)}
              target={child.target || "_self"}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-primary/40" />
              {child.label}
            </a>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---------------- Logo ---------------- */
const NavLogo = ({ leftConfig = {} }) => {
  const {
    link = "/",
    height = 40,
    logo_url,
    logo_text = "Logo",
    logo_type = "text",
  } = leftConfig || {};

  return (
    <a href={resolveUrl(link)} className="flex items-center gap-3 px-2 py-1">
      {logo_type === "image" && logo_url ? (
        <img
          src={logo_url}
          alt={logo_text || "logo"}
          style={{ height: `${height}px` }}
          className="w-auto object-contain"
        />
      ) : (
        <span
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize: `${Math.max(16, height * 0.5)}px` }}
        >
          {logo_text}
        </span>
      )}
    </a>
  );
};

/* ---------------- Right action buttons ---------------- */
const RightActions = ({ rightConfig = [], className }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = () =>{
    navigate('/admin/dashboard')
  }
  return (
    <div className={cn("items-center gap-2", className)}>
      {isAuthenticated ? (
        <>
          <Button
            variant="ghost"
            className="h-11 bg-background px-2 pr-3 hover:bg-muted"
            onClick={handleClick}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_full_path} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="ml-3 hidden text-left md:block">
              <p className="max-w-35 truncate text-sm font-semibold leading-none">
                {user?.name}
              </p>
              <p className="max-w-35 truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </Button>
        </>
      ) : (
        <>
          {sortByOrder(rightConfig).map((action, idx) => (
            <Button
              key={`${action.label}-${idx}`}
              asChild
              variant={action.variant === "outline" ? "outline" : "default"}
              className={cn(
                "rounded-full px-5 text-sm",
                action.variant !== "outline" &&
                  "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90",
              )}
            >
              <a
                href={resolveUrl(action.url)}
                target={action.newTab ? "_blank" : "_self"}
                rel={action.newTab ? "noopener noreferrer" : undefined}
              >
                {action.label}
              </a>
            </Button>
          ))}
        </>
      )}
    </div>
  );
};

const NAV_WRAPPER_CLASS = {
  simple:
    "border-b border-border/60 bg-white/80 backdrop-blur-2xl",
  centered:
    "border-b border-border/60 bg-white/80 backdrop-blur-2xl",
  split: "bg-transparent",
  minimal: "bg-white",
  bold: "border-b border-white/10 bg-slate-900",
};
 
const getNavWrapperClass = (variant, sticky) =>
  `${sticky ? "sticky top-0" : "relative"} z-40 w-full ${
    NAV_WRAPPER_CLASS[variant] || NAV_WRAPPER_CLASS.simple
  }`;
 
const isDarkVariant = (variant) => variant === "bold";
 
const desktopLinkClass = (dark) =>
  dark
    ? "flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
    : "flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
 
const desktopLinkAnchorClass = (dark, minimal) =>
  minimal
    ? dark
      ? "block px-2 py-2 text-sm text-white/75 transition-colors hover:text-white"
      : "block px-2 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    : dark
    ? "block rounded-lg px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
    : "block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
 
/* Split the flat items list roughly in half — used only by the "split" variant */
const splitInHalf = (items) => {
  const half = Math.ceil(items.length / 2);
  return [items.slice(0, half), items.slice(half)];
};
 
/* ---------------- Desktop nav items (shared renderer) ---------------- */
const DesktopNavItems = ({
  items,
  openDropdown,
  setOpenDropdown,
  dark,
  minimal,
  className = "",
}) => (
  <div className={`hidden items-center gap-1 lg:flex ${className}`}>
    {items.map((item) => {
      const hasChildren = item?.children?.length > 0;
 
      return (
        <div key={item.id} className="relative">
          {hasChildren ? (
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === item.id ? null : item.id)
              }
              className={desktopLinkClass(dark)}
            >
              {item.label}
              <motion.div
                animate={{ rotate: openDropdown === item.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.div>
            </button>
          ) : (
            <a
              href={resolveUrl(item.url)}
              target={item.target || "_self"}
              className={desktopLinkAnchorClass(dark, minimal)}
            >
              {item.label}
            </a>
          )}
 
          {hasChildren && (
            <DesktopDropdown
              items={item.children}
              isOpen={openDropdown === item.id}
            />
          )}
        </div>
      );
    })}
  </div>
);
 
/* ---------------- Main Navbar ---------------- */
const Navbar = ({ navbar = {} }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
 
  const items = sortByOrder(navbar?.items || []);
  const leftConfig = navbar?.left_config || {};
  const rightConfig = navbar?.right_config || [];
  const meta = navbar?.meta || {};
 
  const variant = meta.navbarVarients || "simple";
  const sticky = meta.navbarSticky !== false; // default true
  const dark = isDarkVariant(variant);
  const minimal = variant === "minimal";
  const centered = variant === "centered";
  const split = variant === "split";
 
  // Nothing configured yet -> placeholder for the preview
  if (!items.length && !rightConfig.length) {
    return (
      <div className="rounded border border-dashed p-4 text-center text-xs text-muted-foreground">
        Navbar — no items configured
      </div>
    );
  }
 
  const [leftItems, rightItems] = split ? splitInHalf(items) : [items, []];
 
  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={getNavWrapperClass(variant, sticky)}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <div
          className={
            split
              ? "mx-auto max-w-6xl px-4 py-2 sm:px-6"
              : "mx-auto max-w-7xl px-4 sm:px-6"
          }
        >
          {/* ---------------- SPLIT: pill container, logo centered ---------------- */}
          {split ? (
            <div className="flex h-14 items-center justify-between gap-4 rounded-full border border-border/60 bg-white px-4 md:h-16">
              <DesktopNavItems
                items={leftItems}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                dark={false}
                minimal={false}
                className="flex-1 justify-start"
              />
              <NavLogo leftConfig={leftConfig} />
              <div className="flex flex-1 items-center justify-end gap-2">
                <DesktopNavItems
                  items={rightItems}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  dark={false}
                  minimal={false}
                />
                <RightActions rightConfig={rightConfig} className="hidden md:flex" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : centered ? (
            /* ---------------- CENTERED: logo on top, links centered below ---------------- */
            <div className="flex flex-col">
              <div className="flex h-16 items-center justify-between md:h-20">
                <div className="w-24 md:w-32" />
                <NavLogo leftConfig={leftConfig} />
                <div className="flex items-center gap-2">
                  <RightActions
                    rightConfig={rightConfig}
                    className="hidden md:flex"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setMobileOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="hidden justify-center border-t border-border/60 py-2 lg:flex">
                <DesktopNavItems
                  items={items}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  dark={false}
                  minimal={false}
                />
              </div>
            </div>
          ) : (
            /* ---------------- SIMPLE / MINIMAL / BOLD: single row ---------------- */
            <div
              className={`flex items-center justify-between ${
                minimal ? "h-14" : "h-16 md:h-20"
              }`}
            >
              <div className="flex items-center gap-8">
                <NavLogo leftConfig={leftConfig} />
                <DesktopNavItems
                  items={items}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  dark={dark}
                  minimal={minimal}
                />
              </div>
 
              <div className="flex items-center gap-2">
                <RightActions
                  rightConfig={rightConfig}
                  className="hidden md:flex"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`lg:hidden ${dark ? "text-white hover:bg-white/10" : ""}`}
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.nav>
 
      {/* ---------------- Mobile menu (same for every variant) ---------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 right-0 top-0 w-80 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <NavLogo leftConfig={leftConfig} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
 
              <div className="space-y-1">
                {items.map((item) => {
                  const hasChildren = item?.children?.length > 0;
 
                  return (
                    <div key={item.id}>
                      {hasChildren ? (
                        <>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-foreground transition-colors hover:bg-secondary"
                            onClick={() =>
                              setMobileExpanded(
                                mobileExpanded === item.id ? null : item.id,
                              )
                            }
                          >
                            <span>{item.label}</span>
                            <motion.div
                              animate={{
                                rotate: mobileExpanded === item.id ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                          </button>
 
                          <AnimatePresence>
                            {mobileExpanded === item.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="space-y-0.5 pb-1 pl-4">
                                  {sortByOrder(item.children).map((child) => (
                                    <a
                                      key={child.id}
                                      href={resolveUrl(child.url)}
                                      target={child.target || "_self"}
                                      className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                      onClick={() => setMobileOpen(false)}
                                    >
                                      <span className="h-1 w-1 shrink-0 rounded-full bg-primary/40" />
                                      {child.label}
                                    </a>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <a
                          href={resolveUrl(item.url)}
                          target={item.target || "_self"}
                          className="block rounded-xl px-4 py-3 text-foreground transition-colors hover:bg-secondary"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
 
              {/* Mobile right actions */}
              <div className="mt-6 flex flex-col gap-2">
                {sortByOrder(rightConfig).map((action, idx) => (
                  <Button
                    key={`${action.label}-m-${idx}`}
                    asChild
                    variant={
                      action.variant === "outline" ? "outline" : "default"
                    }
                    className="w-full rounded-full"
                  >
                    <a
                      href={resolveUrl(action.url)}
                      target={action.newTab ? "_blank" : "_self"}
                      rel={action.newTab ? "noopener noreferrer" : undefined}
                    >
                      {action.label}
                    </a>
                  </Button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
 
export default Navbar;

export const RootNavbar = ({ activeId, onNavigate }) => {
  const NAV_ITEMS = [
    { label: "Home", id: "home" },
    { label: "Modules", id: "modules" },
    { label: "Page Builder", id: "builder" },
    { label: "Live Dashboard", id: "dashboard" },
    { label: "Accounts", id: "accounts" },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 group"
          aria-label="OrgSuite home"
        >
          <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white grid place-items-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Blocks className="w-5 h-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            OrgSuite
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.id}
              onClick={() => onNavigate(n.id)}
              className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeId === n.id
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => onNavigate("register")}
            className="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 rounded-full px-5"
          >
            Register Business
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pb-4 pt-2 flex flex-col gap-1">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setOpen(false);
                onNavigate(n.id);
              }}
              className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                activeId === n.id
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {n.label}
            </button>
          ))}
          <Button
            onClick={() => {
              setOpen(false);
              onNavigate("register");
            }}
            className="mt-2 bg-slate-900 hover:bg-slate-800 rounded-xl"
          >
            Register Business
          </Button>
        </div>
      )}
    </header>
  );
};
