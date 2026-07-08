// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { FiFacebook, FiYoutube } from 'react-icons/fi';
import { useApiQuery } from '@/hooks/useAppQuery';


export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const { data } = useApiQuery({
        url: `/website-settings`,
    });

    const websiteSettings = data?.data?.web_settings || {};

    const contactInfo = [
        { icon: Phone, label: 'ফোন', value: websiteSettings?.mobile_number, sub: 'সকাল ৯টা — রাত ৯টা', color: 'from-primary to-emerald-400' },
        { icon: Mail, label: 'ইমেইল', value: websiteSettings?.email, sub: '২৪ ঘণ্টার মধ্যে উত্তর', color: 'from-amber-400 to-orange-500' },
        { icon: MapPin, label: 'ঠিকানা', value: websiteSettings?.central_office, sub: 'কেন্দ্রীয় কার্যালয়', color: 'from-violet-400 to-purple-500' },
        { icon: Clock, label: 'সময়', value: 'শনি — বৃহস্পতি', sub: 'সকাল ৯টা — সন্ধ্যা ৬টা', color: 'from-rose-400 to-pink-500' },
    ];

    const socials = [
        { icon: FiFacebook, label: 'Facebook', handle: websiteSettings?.facebook_link, color: 'bg-blue-500 hover:bg-blue-600' },
        { icon: FiYoutube, label: 'YouTube', handle: websiteSettings?.youtube_link, color: 'bg-rose-500 hover:bg-rose-600' },
        { icon: MessageCircle, label: 'WhatsApp', handle: websiteSettings?.mobile_number, color: 'bg-green-500 hover:bg-green-600' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <section className="pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {contactInfo.map((info, i) => (
                            <motion.div
                                key={info.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="p-5 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all text-center group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <info.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-xs text-muted-foreground font-bengali mb-1">{info.label}</p>
                                <p className="font-bold text-foreground font-bengali text-sm">{info.value}</p>
                                <p className="text-xs text-muted-foreground font-bengali mt-0.5">{info.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form + Map */}
            <section className="py-10 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-card rounded-3xl border border-border/50 shadow-xl shadow-primary/5 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-primary to-emerald-500 px-8 py-6 text-white">
                                <h2 className="text-xl font-black font-bengali">বার্তা পাঠান</h2>
                                <p className="text-white/70 text-sm font-bengali mt-1">ফর্মটি পূরণ করুন, আমরা উত্তর দেবো</p>
                            </div>

                            {submitted ? (
                                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                                    <h3 className="text-xl font-black text-foreground font-bengali mb-2">বার্তা পাঠানো হয়েছে!</h3>
                                    <p className="text-muted-foreground font-bengali mb-6">শীঘ্রই আমরা আপনার সাথে যোগাযোগ করবো।</p>
                                    <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="rounded-full font-bengali">
                                        আরেকটি বার্তা পাঠান
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">নাম *</label>
                                            <input
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                                placeholder="আপনার নাম"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">ফোন</label>
                                            <input
                                                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                                placeholder="+880 XXXX-XXXXXX"
                                                value={form.phone}
                                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">ইমেইল *</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                            placeholder="email@example.com"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">বিষয় *</label>
                                        <input
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                            placeholder="বার্তার বিষয়"
                                            value={form.subject}
                                            onChange={e => setForm({ ...form, subject: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">বার্তা *</label>
                                        <textarea
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition resize-none"
                                            placeholder="আপনার বার্তা লিখুন..."
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full py-6 rounded-xl font-bengali font-bold group">
                                        বার্তা পাঠান
                                        <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </form>
                            )}
                        </motion.div>

                        {/* Right side */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col gap-6"
                        >
                            {/* Map placeholder */}
                            <div className="relative rounded-3xl overflow-hidden h-64 bg-secondary border border-border/50">
                                <iframe
                                    title="map"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=90.35,23.72,90.45,23.82&layer=mapnik"
                                    allowFullScreen
                                />
                                <div className="absolute inset-0 pointer-events-none rounded-3xl border-4 border-white/10" />
                            </div>

                            {/* Address card */}
                            <div className="p-6 rounded-2xl bg-card border border-border/50">
                                <h3 className="font-bold text-foreground font-bengali mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" /> কেন্দ্রীয় কার্যালয়
                                </h3>
                                <div className="space-y-2 text-sm text-muted-foreground font-bengali">
                                    <p>{websiteSettings?.central_office}</p>
                                </div>
                            </div>

                            {/* Social */}
                            <div className="p-6 rounded-2xl bg-card border border-border/50">
                                <h3 className="font-bold text-foreground font-bengali mb-4">সোশ্যাল মিডিয়া</h3>
                                <div className="flex flex-col gap-3">
                                    {socials.map((s) => (
                                        <a
                                            key={s.label}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-semibold font-bengali transition-all ${s.color}`}
                                            href={s.handle}
                                        >
                                            <s.icon className="w-5 h-5" />
                                            {s.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}