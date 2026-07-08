import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, BookOpen, Heart, CheckCircle2, ArrowRight, Users, Globe, Award, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  { icon: Users, title: 'বিশাল নেটওয়ার্ক', desc: '৫০,০০০+ সক্রিয় সদস্যের সাথে যুক্ত হন' },
  { icon: BookOpen, title: 'বিশেষ প্রশিক্ষণ', desc: 'একচেটিয়া দাওয়াহ ও ইসলামী শিক্ষা কোর্স' },
  { icon: Globe, title: 'আন্তর্জাতিক সুযোগ', desc: '২৫+ দেশে দাওয়াহ কার্যক্রমে অংশগ্রহণ' },
  { icon: Heart, title: 'সামাজিক সেবা', desc: 'মানবসেবায় অংশ নেওয়ার সুযোগ' },
  { icon: Award, title: 'স্বীকৃতি ও পুরস্কার', desc: 'সেরা সদস্যদের জাতীয় পুরস্কারে ভূষিত করা হয়' },
];

const steps = [
  { num: '০১', title: 'ফর্ম পূরণ করুন', desc: 'নিচের আবেদন ফর্মটি সম্পূর্ণ করুন' },
  { num: '০২', title: 'যাচাইকরণ', desc: 'আমাদের টিম ২৪-৪৮ ঘণ্টার মধ্যে যোগাযোগ করবে' },
  { num: '০৩', title: 'ওরিয়েন্টেশন', desc: 'বিশেষ ওরিয়েন্টেশন সেশনে অংশ নিন' },
  { num: '০৪', title: 'সক্রিয় সদস্য', desc: 'সকল সুবিধা উপভোগ শুরু করুন' },
];

const districts = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ', 'কুমিল্লা', 'নারায়ণগঞ্জ', 'গাজীপুর', 'টাঙ্গাইল', 'ফরিদপুর', 'জামালপুর', 'নেত্রকোণা', 'কিশোরগঞ্জ', 'মানিকগঞ্জ', 'মুন্সিগঞ্জ', 'শরিয়তপুর', 'মাদারীপুর'];

const interests = ['দাওয়াহ ও তাবলীগ', 'ইসলামী শিক্ষা', 'সমাজসেবা', 'যুব উন্নয়ন', 'মিডিয়া ও প্রযুক্তি', 'গবেষণা ও প্রকাশনা'];

export default function JoinUs() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', district: '',
    upazila: '', age: '', occupation: '', reason: '',
  });

  const toggleInterest = (item) => {
    setSelectedInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5" />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-bengali">সদস্যপদ আবেদন</span>
            </span>
            <h1 className="text-4xl sm:text-6xl font-black font-bengali text-foreground leading-tight">
              দ্বীনের খেদমতে<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">আমাদের সাথে যোগ দিন</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground font-bengali max-w-2xl mx-auto leading-relaxed">
              ৫০,০০০+ নিবেদিতপ্রাণ সদস্যের পরিবারে আপনাকে স্বাগতম। ইসলামের সুমহান বাণী প্রচারে আমাদের সাথে হাত মেলান।
            </p>
          </motion.div>
        </div>
      </section>


      {/* Benefits */}
      <section className="py-14 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <b.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-sm text-foreground font-bengali mb-1">{b.title}</h3>
                <p className="text-xs text-muted-foreground font-bengali leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-foreground font-bengali text-center mb-10">কিভাবে যোগ দেবেন</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl bg-card border border-border/50 text-center"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30 z-10" />
                )}
                <div className="text-4xl font-black text-primary/20 font-bengali mb-3">{step.num}</div>
                <h3 className="font-bold text-foreground font-bengali mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-bengali">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form or Success */}
      <section className="py-16 pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-foreground font-bengali mb-3">আবেদন সফলভাবে জমা হয়েছে!</h2>
              <p className="text-muted-foreground font-bengali text-lg mb-8">
                আপনার আবেদন আমরা পেয়েছি। ২৪-৪৮ ঘণ্টার মধ্যে আমাদের টিম আপনার সাথে যোগাযোগ করবে।
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                className="rounded-full px-8 py-6 font-bengali"
              >
                আরেকটি আবেদন করুন
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl border border-border/50 shadow-xl shadow-primary/5 overflow-hidden"
            >
              {/* Form header */}
              <div className="bg-gradient-to-r from-primary to-emerald-500 p-8 text-white text-center">
                <h2 className="text-2xl font-black font-bengali mb-1">সদস্যপদ আবেদন ফর্ম</h2>
                <p className="text-white/70 font-bengali text-sm">সকল তথ্য সঠিকভাবে পূরণ করুন</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="font-bold text-foreground font-bengali mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> ব্যক্তিগত তথ্য
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">পূর্ণ নাম *</label>
                      <input
                        required
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">বয়স *</label>
                      <input
                        required
                        type="number"
                        min="16"
                        max="80"
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                        placeholder="আপনার বয়স"
                        value={form.age}
                        onChange={e => setForm({ ...form, age: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">মোবাইল নম্বর *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                        <input
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                          placeholder="+880 XXXX-XXXXXX"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">ইমেইল</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                          placeholder="email@example.com"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">পেশা *</label>
                      <input
                        required
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                        placeholder="আপনার পেশা"
                        value={form.occupation}
                        onChange={e => setForm({ ...form, occupation: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="font-bold text-foreground font-bengali mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> ঠিকানা
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">জেলা *</label>
                      <div className="relative">
                        <select
                          required
                          className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                          value={form.district}
                          onChange={e => setForm({ ...form, district: e.target.value })}
                        >
                          <option value="">জেলা নির্বাচন করুন</option>
                          {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">উপজেলা / থানা *</label>
                      <input
                        required
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                        placeholder="উপজেলা / থানার নাম"
                        value={form.upazila}
                        onChange={e => setForm({ ...form, upazila: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h3 className="font-bold text-foreground font-bengali mb-4 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" /> আগ্রহের ক্ষেত্র
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {interests.map(item => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleInterest(item)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold font-bengali transition-all ${
                          selectedInterests.includes(item)
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-secondary text-muted-foreground hover:border-primary/30 border border-border'
                        }`}
                      >
                        {selectedInterests.includes(item) && <span className="mr-1">✓</span>}
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-foreground font-bengali mb-1.5">
                    কেন যোগ দিতে চান? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bengali focus:outline-none focus:ring-2 focus:ring-primary/20 transition resize-none"
                    placeholder="সংক্ষেপে লিখুন আপনি কেন এই সংগঠনে যোগ দিতে চান..."
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                  />
                </div>

                {/* Agreement */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <input type="checkbox" required id="agree" className="mt-1 accent-primary" />
                  <label htmlFor="agree" className="text-sm text-muted-foreground font-bengali cursor-pointer">
                    আমি সংগঠনের নিয়ম-কানুন মানতে এবং দ্বীনের খেদমতে নিবেদিত থাকতে সম্মত।
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 rounded-xl font-bengali font-bold text-base shadow-lg shadow-primary/20 group"
                >
                  আবেদন জমা দিন
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}