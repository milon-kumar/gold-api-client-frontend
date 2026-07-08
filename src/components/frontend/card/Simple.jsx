// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Droplets, GraduationCap, TreePine, Stethoscope, Home } from 'lucide-react';
import SectionHeader from '@/components/partials/frontend/SectionHeader';
import { asset, getWords } from '@/lib/helper';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const activities = [
    { icon: Heart, title: 'ত্রাণ কার্যক্রম', desc: 'প্রাকৃতিক দুর্যোগে ক্ষতিগ্রস্তদের জন্য তাৎক্ষণিক ত্রাণ সহায়তা।', count: '১২,৫০০+', countLabel: 'উপকারভোগী', color: 'from-rose-400 to-pink-500', img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&q=80' },
    { icon: GraduationCap, title: 'বৃত্তি প্রকল্প', desc: 'মেধাবী কিন্তু দরিদ্র শিক্ষার্থীদের জন্য বার্ষিক শিক্ষাবৃত্তি।', count: '৫০০+', countLabel: 'বৃত্তিপ্রাপ্ত', color: 'from-amber-400 to-orange-500', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { icon: Stethoscope, title: 'স্বাস্থ্যসেবা', desc: 'গ্রামীণ ও দুর্গম এলাকায় বিনামূল্যে চিকিৎসা সেবা ক্যাম্প।', count: '৩০,০০০+', countLabel: 'রোগী সেবা', color: 'from-teal-400 to-cyan-500', img: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400&q=80' },
    { icon: Droplets, title: 'বিশুদ্ধ পানি', desc: 'প্রত্যন্ত এলাকায় নলকূপ স্থাপন ও বিশুদ্ধ পানি সরবরাহ।', count: '২৫০+', countLabel: 'নলকূপ স্থাপন', color: 'from-blue-400 to-indigo-500', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80' },
    { icon: TreePine, title: 'পরিবেশ সংরক্ষণ', desc: 'বৃক্ষরোপণ ও পরিবেশ সচেতনতামূলক কার্যক্রম।', count: '১০,০০০+', countLabel: 'গাছ রোপণ', color: 'from-green-400 to-emerald-500', img: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&q=80' },
    { icon: Home, title: 'আশ্রয় প্রকল্প', desc: 'গৃহহীন ও দুস্থ পরিবারকে বাসস্থান নির্মাণে সহায়তা।', count: '৩০০+', countLabel: 'পরিবার সহায়তা', color: 'from-violet-400 to-purple-500', img: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&q=80' },
];

export default function SocialActivitiesSection({ ...props }) {
    const { items } = props

    return (
        <section id="social" className="py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <SectionHeader badge="সামাজিক কার্যক্রম" title="মানবসেবায় আমরা" subtitle="সমাজের বিভিন্ন স্তরে আমাদের সামাজিক উন্নয়নমূলক কার্যক্রম" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items?.map((item, i) => (
                        <SingleCard
                            key={i}
                            i={i}
                            categorySection={{
                                name: item?.category_name,
                                published: item?.publish_date
                            }}
                            title={item.title}
                            desc={item?.description}
                            count={item.count}
                            countLabel={item.countLabel}
                            color={item.color}
                            img={item.image_url}
                            icon={item.icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}





export function SingleCard({
    cardAction = [
        {
            title: "",
            icon: "",
            value: ""
        }
    ],
    title = "",
    desc = "",
    img = "",
    icon = "",
    categorySection = {},
    count = "",
    countLabel = "",
    color = "",
}) {
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
                src="https://avatar.vercel.sh/shadcn1"
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
                {
                    cardAction && cardAction?.length > 0 && (
                        <CardAction className="flex items-center gap-2">
                            {
                                cardAction?.map((item, i) => (
                                    <Badge key={i} variant="secondary">{item.title}</Badge>
                                ))
                            }
                        </CardAction>
                    )
                }
                <CardTitle>Design systems meetup</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    A practical talk on component APIs, accessibility, and shipping
                    faster.
                </CardDescription>
                <Button className={'rounded-sm mt-3'}>Read More</Button>
            </CardContent>
        </Card>
    )
}
