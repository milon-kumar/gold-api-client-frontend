import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery";
import { asset } from "@/lib/helper";

const navLinks = [
    { label: 'হোম', href: '#' },
    { label: 'আমাদের সম্পর্কে', href: '#about' },
    {
        label: 'কার্যক্রম',
        href: '#programs',
        children: [
            { label: 'দাওয়াহ', href: '#dawah' },
            { label: 'শিক্ষা', href: '#education' },
            { label: 'সেবা', href: '#service' },
        ],
    },
    { label: 'মিডিয়া', href: '#media' },
    { label: 'গ্যালারি', href: '#gallery' },
    { label: 'যোগাযোগ', href: '#contact' },
];

const DropdownMenu = ({ items, isOpen }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-black/[0.06] py-1.5 z-50"
                >
                    {items.map((item) => {

                        const isCustomLink =
                            item?.page_type === "link";

                        const url = isCustomLink
                            ? item?.custom_link
                            : `/page/${item?.page_slug}`;

                        return (
                            <a
                                key={item?.id}
                                href={url}
                                target={
                                    isCustomLink
                                        ? "_blank"
                                        : undefined
                                }
                                className="flex items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors font-bengali"
                            >
                                {item?.page_title}
                            </a>
                        );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
export default function Navbar({ websiteSettings, webPages }) {

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileExpanded, setMobileExpanded] = useState(null);
    const location = useLocation();
    const navigation = useNavigate();
    const currentPath = location.pathname;
    const navRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActiveRoute = path => {
        if (path === '/') return currentPath === '/';
        return currentPath === path || currentPath.startsWith(path);
    };



    return (
        <>
            <motion.nav
                ref={navRef}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-white/80 backdrop-blur-2xl shadow-lg shadow-black/3 border-b border-white/50'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <Link
                            to="/"
                            className="flex items-center gap-3 max-w-50 px-2 py-1 rounded-sm"
                        >
                            <img
                                src={websiteSettings?.logo_full_path}
                                alt="logo"
                                className="h-full w-auto object-contain"
                            />
                        </Link>


                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            <a
                                href={'/'}
                                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary font-bengali block"
                            >
                                হোম
                            </a>

                            {webPages.map((page) => {
                                const isCustomLink = page?.page_type === "link";
                                const url = isCustomLink
                                    ? page?.custom_link
                                    : `/page/${page?.page_slug}`;

                                const hasChildren = page?.children?.length > 0;

                                return (
                                    <div key={page?.id} className="relative">

                                        {hasChildren ? (
                                            <button
                                                onClick={() =>
                                                    setOpenDropdown(
                                                        openDropdown === page?.page_title
                                                            ? null
                                                            : page?.page_title
                                                    )
                                                }
                                                className="flex items-center cursor-pointer gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary font-bengali"
                                            >
                                                {page?.page_title}

                                                <motion.div
                                                    animate={{
                                                        rotate:
                                                            openDropdown === page?.page_title
                                                                ? 180
                                                                : 0,
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </motion.div>
                                            </button>
                                        ) : (
                                            <a
                                                href={url}
                                                target={
                                                    isCustomLink && !hasChildren
                                                        ? "_blank"
                                                        : undefined
                                                }
                                                className="px-3 py-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary font-bengali block"
                                            >
                                                {page?.page_title}
                                            </a>
                                        )}

                                        {hasChildren && (
                                            <DropdownMenu
                                                items={page?.children}
                                                isOpen={
                                                    openDropdown === page?.page_title
                                                }
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground">
                                <Search className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground">
                                <Globe className="w-4 h-4" />
                            </Button> */}
                            <Button onClick={() => navigation('/membership')} className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 text-sm shadow-lg shadow-primary/20">
                                যোগদান করুন
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setMobileOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
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
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-bold text-lg font-bengali">মেনু</h2>
                                <Button onClick={() => setMobileOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="space-y-1">
                                {navLinks.map((link) => (
                                    <div key={link.label}>
                                        {link.children ? (
                                            <>
                                                <button
                                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors font-bengali"
                                                    onClick={() =>
                                                        setMobileExpanded(
                                                            mobileExpanded === link.label ? null : link.label
                                                        )
                                                    }
                                                >
                                                    <span>{link.label}</span>
                                                    <motion.div
                                                        animate={{
                                                            rotate: mobileExpanded === link.label ? 180 : 0,
                                                        }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                    </motion.div>
                                                </button>

                                                <AnimatePresence>
                                                    {mobileExpanded === link.label && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pl-4 pb-1 space-y-0.5">
                                                                {link.children.map((child) => (
                                                                    <a
                                                                        key={child.label}
                                                                        href={child.href}
                                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors font-bengali"
                                                                        onClick={() => setMobileOpen(false)}
                                                                    >
                                                                        <span className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
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
                                                href={link.href}
                                                className="block px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors font-bengali"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {link.label}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full mt-6 bg-primary text-primary-foreground rounded-full font-bengali">
                                যোগদান করুন
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}