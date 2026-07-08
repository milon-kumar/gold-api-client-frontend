import React from 'react'
import Navbar from '@/layouts/frontend/Navbar'
import Footer from '@/layouts/frontend/Footer'
import { Outlet, useLocation } from 'react-router'
import { useApiQuery } from '@/hooks/useAppQuery'
import { asset } from '@/lib/helper'
const FrontendLayout = () => {

    const { pathname } = useLocation();

    const { data } = useApiQuery({
        url: `/website-settings`,
    });

    const {data: pagesResponse} = useApiQuery({
        url: '/pages'
    })

    console.log("Pages Response -",pagesResponse)
    

    const websiteSettings = data?.data?.web_settings || {};
    const webPages = pagesResponse?.data?.data || [];

    console.log("websiteSettings", websiteSettings)
    console.log("webPages", webPages)


    console.log("What is the path name ",pathname === '/')

    document.title = `${pathname === '/' ? 'Home' : pathname?.split('/')?.pop()?.charAt(0)?.toUpperCase() + pathname?.split('/')?.pop()?.slice(1)} | ${websiteSettings?.web_title}`;

    const favicon = document.getElementById('app-favicon');

    if (favicon) {
        const href =
            websiteSettings?.favicon_url ||
            websiteSettings?.logo_url;

        favicon.href =
            asset(href) || "/favicon.ico";
    }
    return (
        <div className="min-h-screen bg-background">
            <Navbar websiteSettings={websiteSettings} webPages={webPages} />
            <Outlet />
            <Footer websiteSettings={websiteSettings} webPages={webPages} />
        </div>
    )
}

export default FrontendLayout