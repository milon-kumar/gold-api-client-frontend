// @ts-nocheck
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  Headset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FiFacebook, FiYoutube, FiInstagram, FiLinkedin } from "react-icons/fi";
import { useOutletContext } from "react-router";
import PageHeroRenderer from "@/components/renderers/PageHeroRenderer";

export default function Contact() {
  const { settings } = useOutletContext();

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  /* ---------------------------------------------
     Settings data with business fallback
     (settings.email/phone/location can be null,
      so we fall back to settings.business.*)
  --------------------------------------------- */
  const email = settings?.email || settings?.business?.email;
  const phone = settings?.phone || settings?.business?.phone;
  const location = settings?.location || settings?.business?.location;

  // 017XXXXXXXX → https://wa.me/88017XXXXXXXX
  const whatsappLink = phone
    ? `https://wa.me/88${phone.replace(/[^0-9]/g, "")}`
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: এখানে আপনার contact API mutation call করুন
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "ফোন",
      value: phone,
      href: phone ? `tel:${phone}` : null,
      sub: "সকাল ৯টা — রাত ৯টা",
      color: "from-primary to-emerald-400",
    },
    {
      icon: Mail,
      label: "ইমেইল",
      value: email,
      href: email ? `mailto:${email}` : null,
      sub: "২৪ ঘণ্টার মধ্যে উত্তর",
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: MapPin,
      label: "ঠিকানা",
      value: location,
      href: null,
      sub: "কেন্দ্রীয় কার্যালয়",
      color: "from-violet-400 to-purple-500",
    },
    {
      icon: Clock,
      label: "সময়",
      value: "শনি — বৃহস্পতি",
      href: null,
      sub: "সকাল ৯টা — সন্ধ্যা ৬টা",
      color: "from-rose-400 to-pink-500",
    },
  ].filter((info) => info.value); // null value হলে card দেখাবে না

  const socials = [
    {
      icon: FiFacebook,
      label: "Facebook",
      href: settings?.facebook_link,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: FiYoutube,
      label: "YouTube",
      href: settings?.youtube_link,
      color: "bg-rose-500 hover:bg-rose-600",
    },
    {
      icon: FiInstagram,
      label: "Instagram",
      href: settings?.instagram_link,
      color:
        "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600",
    },
    {
      icon: FiLinkedin,
      label: "LinkedIn",
      href: settings?.linkedin_link,
      color: "bg-sky-600 hover:bg-sky-700",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: whatsappLink,
      color: "bg-green-500 hover:bg-green-600",
    },
  ].filter((s) => s.href); // link না থাকলে button দেখাবে না

  return (
    <div className="min-h-screen bg-background">
      {/* ---------------- Hero ---------------- */}
      <PageHeroRenderer
        variant="gradient"
        eyebrow="যোগাযোগ"
        title="আমাদের সাথে"
        highlight="যোগাযোগ করুন"
        description="আপনার যেকোনো প্রশ্ন, পরামর্শ বা মতামত আমাদের জানান — আমরা যত দ্রুত সম্ভব উত্তর দেওয়ার চেষ্টা করবো, ইনশাআল্লাহ।"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "যোগাযোগ" }]}
        rightSlot={
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
              <Headset className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="font-bengali text-lg font-bold leading-none text-white">
                {settings?.business?.name || "আমাদের টিম"}
              </p>
              <p className="font-bengali mt-1.5 text-sm text-slate-400">
                আপনার সেবায় সর্বদা প্রস্তুত
              </p>
            </div>
          </div>
        }
      />

      {/* ---------------- Contact Info Cards ---------------- */}
      <section className="relative -mt-0 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {contactInfo.map((info, i) => {
              const CardTag = info.href ? "a" : "div";
              return (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <CardTag
                    href={info.href || undefined}
                    className="group block h-full rounded-2xl border border-border/50 bg-card p-5 text-center transition-all hover:border-primary/20 hover:shadow-lg"
                  >
                    <div
                      className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${info.color} shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-bengali mb-1 text-xs text-muted-foreground">
                      {info.label}
                    </p>
                    <p className="font-bengali break-words text-sm font-bold text-foreground">
                      {info.value}
                    </p>
                    <p className="font-bengali mt-0.5 text-xs text-muted-foreground">
                      {info.sub}
                    </p>
                  </CardTag>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Form + Map ---------------- */}
      <section className="py-10 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-xl shadow-primary/5"
            >
              <div className="bg-gradient-to-r from-primary to-emerald-500 px-8 py-6 text-white">
                <h2 className="font-bengali text-xl font-black">বার্তা পাঠান</h2>
                <p className="font-bengali mt-1 text-sm text-white/70">
                  ফর্মটি পূরণ করুন, আমরা উত্তর দেবো
                </p>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                  <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
                  <h3 className="font-bengali mb-2 text-xl font-black text-foreground">
                    বার্তা পাঠানো হয়েছে!
                  </h3>
                  <p className="font-bengali mb-6 text-muted-foreground">
                    শীঘ্রই আমরা আপনার সাথে যোগাযোগ করবো।
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="font-bengali rounded-full"
                  >
                    আরেকটি বার্তা পাঠান
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 p-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="font-bengali mb-1.5 block text-sm font-semibold text-foreground">
                        নাম *
                      </label>
                      <input
                        required
                        className="font-bengali w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="আপনার নাম"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="font-bengali mb-1.5 block text-sm font-semibold text-foreground">
                        ফোন
                      </label>
                      <input
                        className="font-bengali w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="+880 XXXX-XXXXXX"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bengali mb-1.5 block text-sm font-semibold text-foreground">
                      ইমেইল *
                    </label>
                    <input
                      required
                      type="email"
                      className="font-bengali w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bengali mb-1.5 block text-sm font-semibold text-foreground">
                      বিষয় *
                    </label>
                    <input
                      required
                      className="font-bengali w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="বার্তার বিষয়"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-bengali mb-1.5 block text-sm font-semibold text-foreground">
                      বার্তা *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="font-bengali w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="আপনার বার্তা লিখুন..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="font-bengali group w-full rounded-xl py-6 font-bold"
                  >
                    বার্তা পাঠান
                    <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
              {/* Map */}
              <div className="relative h-64 overflow-hidden rounded-3xl border border-border/50 bg-secondary">
                <iframe
                  title="map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=88.55,24.35,88.65,24.42&layer=mapnik"
                  allowFullScreen
                />
                <div className="pointer-events-none absolute inset-0 rounded-3xl border-4 border-white/10" />
              </div>

              {/* Address card */}
              {location && (
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h3 className="font-bengali mb-4 flex items-center gap-2 font-bold text-foreground">
                    <MapPin className="h-5 w-5 text-primary" /> কেন্দ্রীয়
                    কার্যালয়
                  </h3>
                  <div className="font-bengali space-y-2 text-sm text-muted-foreground">
                    <p>{location}</p>
                  </div>
                </div>
              )}

              {/* Social */}
              {socials.length > 0 && (
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h3 className="font-bengali mb-4 font-bold text-foreground">
                    সোশ্যাল মিডিয়া
                  </h3>
                  <div className="flex flex-col gap-3">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-bengali flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all ${s.color}`}
                      >
                        <s.icon className="h-5 w-5" />
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}