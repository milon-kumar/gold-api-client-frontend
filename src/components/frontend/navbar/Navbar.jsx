import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
              <span className="h-1 w-1 flex-shrink-0 rounded-full bg-primary/40" />
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
const RightActions = ({ rightConfig = [], className }) => (
  <div className={cn("items-center gap-2", className)}>
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

  // Nothing configured yet -> placeholder for the preview
  if (!items.length && !rightConfig.length) {
    return (
      <div className="rounded border border-dashed p-4 text-center text-xs text-muted-foreground">
        Navbar — no items configured
      </div>
    );
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-40 w-full border-b border-border/60 bg-white/80 backdrop-blur-2xl"
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Left: Logo */}
            <NavLogo leftConfig={leftConfig} />

            {/* Center: Desktop nav items */}
            <div className="hidden items-center gap-1 lg:flex">
              {items.map((item) => {
                const hasChildren = item?.children?.length > 0;

                return (
                  <div key={item.id} className="relative">
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.id ? null : item.id,
                          )
                        }
                        className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        {item.label}
                        <motion.div
                          animate={{
                            rotate: openDropdown === item.id ? 180 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </motion.div>
                      </button>
                    ) : (
                      <a
                        href={resolveUrl(item.url)}
                        target={item.target || "_self"}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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

            {/* Right: Actions + mobile toggle */}
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
        </div>
      </motion.nav>

      {/* ---------------- Mobile menu ---------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
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
                                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-primary/40" />
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
