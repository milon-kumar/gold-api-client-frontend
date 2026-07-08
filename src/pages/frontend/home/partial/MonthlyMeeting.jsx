import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Mic, FileText } from 'lucide-react';
import SectionHeader from '@/components/partials/frontend/SectionHeader';

const phases = [
    { icon: FileText, title: 'প্রথম পর্ব', subtitle: 'উদ্বোধনী সেশন', time: '৮:০০ — ৯:৩০', color: 'from-primary to-emerald-400', points: ['তেলাওয়াতে কুরআন', 'স্বাগত বক্তব্য', 'পূর্ববর্তী সভার কার্যবিবরণী পাঠ', 'উপস্থিতি নিশ্চিতকরণ'] },
    { icon: Mic, title: 'দ্বিতীয় পর্ব', subtitle: 'প্রধান আলোচনা', time: '৯:৩০ — ১১:০০', color: 'from-amber-400 to-orange-500', points: ['বিশেষ আলোচ্য বিষয়', 'আলেমদের মতামত', 'প্রশ্নোত্তর পর্ব', 'সিদ্ধান্ত গ্রহণ'] },
    { icon: Users, title: 'তৃতীয় পর্ব', subtitle: 'বিভাগীয় প্রতিবেদন', time: '১১:০০ — ১২:৩০', color: 'from-violet-400 to-purple-500', points: ['শিক্ষা বিভাগ', 'সেবা বিভাগ', 'মিডিয়া বিভাগ', 'আর্থিক প্রতিবেদন'] },
    { icon: Clock, title: 'চতুর্থ পর্ব', subtitle: 'পরিকল্পনা ও সমাপ্তি', time: '১২:৩০ — ১:০০', color: 'from-rose-400 to-pink-500', points: ['আগামী মাসের পরিকল্পনা', 'দায়িত্ব বণ্টন', 'দোয়া ও মোনাজাত', 'মধ্যাহ্নভোজ'] },
];

export default function MonthlyMeeting({ books }) {
    return (
        <section id="meeting" className="py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* <SectionHeader badge="মাসিক সভা" title="মাসিক সভার কার্যক্রম" subtitle="প্রতি মাসের নিয়মিত কেন্দ্রীয় সভার বিস্তারিত কার্যক্রম" /> */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {books.map((book, i) => (
                        <motion.div
                            key={book.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 }}
                            className="relative p-6 rounded-2xl bg-card border border-border/50 hover:shadow-xl transition-all group overflow-hidden"
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${book?.color}`} />
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${book?.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="mb-4">
                                <p className="text-xs text-muted-foreground font-bengali">{book?.time}</p>
                                <h3 className="font-black text-foreground font-bengali text-lg">{book?.title}</h3>
                                <p className="text-sm text-primary font-bengali">{book?.subtitle}</p>
                            </div>
                            <ul className="space-y-2">
                                {book?.items?.map((pt, j) => (
                                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground font-bengali">
                                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${book?.color} flex-shrink-0`} />
                                        {pt?.name || pt?.title}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}