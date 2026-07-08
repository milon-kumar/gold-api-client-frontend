// @ts-nocheck
import React from 'react';
import SectionHeader from '@/components/partials/frontend/SectionHeader';
import { asset } from '@/lib/helper';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";

// import AtTahreek from '@/assets/images/at-tahreek.png';
// import TawheederDak from '@/assets/images/tawheeder-dak.png';
// import SonamoniProtiva from '@/assets/images/sonamoni-Protiva.png';

const publications = [
    {
        id: 1,
        name: 'মাসিক আত-তাহরীক',
        description: 'ধর্ম, সমাজ ও সাহিত্য বিষয়ক গবেষণা পত্রিকা',
        image_url: 'assets/images/at-tahreek.png',
        link: 'https://at-tahreek.com/',
        button_text: 'মাসিক আত-তাহরীক'
    },
    {
        id: 2,
        name: 'তাওহীদের ডাক',
        description: 'কুরআন ও সুন্নাহকে আঁকড়ে ধরার এক অনন্য বার্তা',
        image_url: 'assets/images/tawheeder-dak.png',
        link: 'https://tawheederdak.com/',
        button_text: 'তাওহীদের ডাক'
    },
    {
        id: 3,
        name: 'সোনামণি প্রতিভা',
        description: 'একটি সৃজনশীল শিশু-কিশোর পত্রিকা',
        image_url: 'assets/images/sonamoni-Protiva.png',
        link: 'https://ahlehadeethbd.org/protiva/',
        button_text: 'সোনামণি প্রতিভা'
    },
];

export default function Publications({ webSettings, items = publications }) {
    const establisher = webSettings?.establisher || '';
    const words = establisher.split(' ');
    const firstWord = words[0] || '';
    const remainingWords = words.slice(1).join(' ') || '';


    return (
        <section id="publications" className="py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <SectionHeader badge={firstWord} title={webSettings?.establisher} />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    {(items || publications)?.map((item) => (
                        <PublicationCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PublicationCard({ item }) {
    const { name, description, image_url, link, button_text } = item;

    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                    src={`${asset(image_url)?.replace('uploads/','')}`}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            <CardContent className="p-6 text-center">
                <CardTitle className="text-xl font-bold mb-3">
                    {name}
                </CardTitle>

                <CardDescription className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                    {description}
                </CardDescription>

                <Button
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition-all duration-300 hover:shadow-md"
                    onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
                >
                    {button_text || name}
                </Button>
            </CardContent>
        </Card>
    );
}