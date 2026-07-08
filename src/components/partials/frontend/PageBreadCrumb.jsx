import React from "react";
import { Link } from "react-router";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Home } from "lucide-react";
import { motion } from "framer-motion";

const PageBreadCrumb = ({ pageContent }) => {

    console.log("PageBreadCromb ->", pageContent)
    return (
        <section className="relative pt-28 pb-14 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5" />
            <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
                <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="font-bengali">{pageContent?.page_title}</span>
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black font-bengali text-foreground">
                        {pageContent?.page_title}
                    </h1>
                    {/* <p className="mt-4 text-muted-foreground font-bengali max-w-xl mx-auto text-lg">
                        {pageContent?.page_description}
                    </p> */}
                </motion.div>
            </div>
        </section>

        // <div className="w-full border-b border-border mt-28">
        //     {/* Container */}
        //     <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6 md:py-8">

        //         {/* Title */}
        //         <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-bengali">
        //             {title}
        //         </h1>

        //         {/* Breadcrumb */}
        //         <Breadcrumb>
        //             <BreadcrumbList>

        //                 {/* Home */}
        //                 <BreadcrumbItem>
        //                     <BreadcrumbLink asChild>
        //                         <Link
        //                             to="/"
        //                             className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        //                         >
        //                             <Home className="w-4 h-4" />
        //                             হোম
        //                         </Link>
        //                     </BreadcrumbLink>
        //                 </BreadcrumbItem>

        //                 <BreadcrumbSeparator />

        //                 {/* Current Page */}
        //                 <BreadcrumbItem>
        //                     <BreadcrumbPage className="font-medium text-foreground">
        //                         {title}
        //                     </BreadcrumbPage>
        //                 </BreadcrumbItem>

        //             </BreadcrumbList>
        //         </Breadcrumb>

        //     </div>

        // </div>
    );
};

export default PageBreadCrumb;