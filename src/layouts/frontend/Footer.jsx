import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { asset, getWords } from '@/lib/helper';

const footerLinks = {
  'কার্যক্রম': ['দাওয়াহ প্রশিক্ষণ', 'ইসলামিক শিক্ষা', 'সমাজসেবা', 'যুব উন্নয়ন'],
  'মিডিয়া': ['বয়ান সমূহ', 'ভিডিও গ্যালারি', 'ছবি গ্যালারি', 'প্রকাশনা'],
  'সম্পর্কে': ['আমাদের পরিচয়', 'নেতৃত্ব', 'ইতিহাস', 'যোগাযোগ'],
};

export default function Footer({ websiteSettings, webPages }) {

  // page?.children_recursive?.length > 0
  const links = webPages?.filter((page) => page?.children_recursive?.length > 0)?.map((page) => {
    return {
      page: page,
      children: page?.children_recursive
    }
  })

  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <span className="text-white font-bold text-lg">দ</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground font-bengali">দাওয়াহ পোর্টাল</h3>
                <p className="text-xs text-muted-foreground">Dawah Portal</p>
              </div> */}
              <Link
                to="/"
                className="flex items-center gap-3 max-w-[200px] px-2 py-1 rounded-sm bg-[#641B8C]"
              >
                <img
                  src={asset(websiteSettings?.banner_image)}
                  alt="logo"
                  className="h-full w-auto object-contain"
                />
              </Link>
            </div>

            <div className="" dangerouslySetInnerHTML={{
              __html: getWords(websiteSettings?.about_us_desc)
            }} />

            <div className="flex flex-col gap-2 mt-6 text-sm text-muted-foreground">
              <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors font-bengali">
                <Mail className="w-4 h-4" /> {websiteSettings?.email}
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors font-bengali">
                <Phone className="w-4 h-4" /> {websiteSettings?.mobile_number}
              </a>
              <span className="flex items-center gap-2 font-bengali">
                <MapPin className="w-4 h-4" /> {websiteSettings?.central_office}
              </span>
            </div>
          </div>

          {/* Links */}
          {links?.map((link) => {

            const hasChildren =
              link?.children?.length > 0;

            if (!hasChildren) return null;

            return (
              <div key={link?.page?.id}>
                <h4 className="font-bold text-foreground text-sm mb-4 font-bengali">
                  {link?.page?.page_title}
                </h4>

                <ul className="space-y-2.5">
                  {link?.children?.map((child) => {
                    const isCustomLink =
                      child?.page_type === "link";
                    const url = isCustomLink
                      ? child?.custom_link
                      : `/page/${child?.page_slug}`;

                    return (
                      <li key={child?.id}>

                        <a
                          href={url}
                          target={
                            isCustomLink
                              ? "_blank"
                              : undefined
                          }
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group font-bengali"
                        >
                          {child?.page_title}

                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />

                        </a>

                      </li>
                    );

                  })}

                </ul>

              </div>
            );

          })}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-bengali">
            © ২০২৬ দাওয়াহ পোর্টাল। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors font-bengali">গোপনীয়তা নীতি</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors font-bengali">শর্তাবলী</a>
          </div>
        </div>
      </div>
    </footer>
  );
}