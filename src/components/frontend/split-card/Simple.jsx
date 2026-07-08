import { motion } from "framer-motion";
import SectionHeader from "@/components/partials/frontend/SectionHeader";
import {
    Users,
    MapPin,
    Calendar,
    BookOpen
} from "lucide-react";

export default function AboutSection({
    showSectionHeader = true,
    sectionHeader = {
        badge: "পরিচিতি",
        title: "আমাদের সম্পর্কে",
        subtitle: "একটি ঐতিহাসিক দাওয়াহ আন্দোলনের পথচলা"
    },
    image = {
        src: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80",
        alt: "about",
        overlayText: "প্রতিষ্ঠাতা",
        overlaySubtext: "মাওলানা মুহাম্মদ আব্দুল হামিদ রহ."
    },
    showFounder = true,
    founder = {
        name: "মাওলানা মুহাম্মদ আব্দুল হামিদ রহ.",
        title: "প্রতিষ্ঠাতা"
    },
    historyTitle = "আমাদের ইতিহাস",
    historyContent = `<p>১৯৯৮ সালে প্রতিষ্ঠিত এই সংগঠনটি বাংলাদেশের ইসলামিক দাওয়াহ আন্দোলনের অগ্রদূত। দীর্ঘ দুই দশকেরও বেশি সময় ধরে আমরা কুরআন ও সুন্নাহর আলোকে মানুষের জীবন পরিবর্তনে কাজ করে আসছি।</p>`,
    infoCards = [
        { label: "সক্রিয় সদস্য", value: "৫০,০০০+", icon: Users, color: "from-blue-500 to-blue-700" },
        { label: "জেলা", value: "৬৪টি", icon: MapPin, color: "from-green-500 to-green-700" },
        { label: "প্রতিষ্ঠিত", value: "১৯৯৮", icon: Calendar, color: "from-purple-500 to-purple-700" },
        { label: "প্রকাশনা", value: "১০০+", icon: BookOpen, color: "from-orange-500 to-orange-700" }
    ],
    backgroundColor = "from-secondary/20 to-background",
    textColor = "text-foreground",
    className = "",
    imagePosition = "left", // "left" or "right"
    sectionBgColor = "",
    ...props
}) {
    const isImageRight = imagePosition === "right";

    return (
        <section id="about" className={`py-10 sm:py-14 ${sectionBgColor ? sectionBgColor : `bg-gradient-to-b ${backgroundColor}`} ${className} `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {showSectionHeader && (
                    <SectionHeader
                        badge={sectionHeader.badge}
                        title={sectionHeader.title}
                        subtitle={sectionHeader.subtitle}
                    />
                )}

                <div className="grid lg:grid-cols-2 gap-12 items-start mb-14">
                    {/* Image Column - order changes based on imagePosition */}
                    <motion.div
                        initial={{ opacity: 0, x: isImageRight ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={isImageRight ? "lg:order-last" : "lg:order-first"}
                    >
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                            />
                            {
                                showFounder && (
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="glass rounded-2xl p-4">
                                            <p className="text-sm font-bold text-foreground font-bengali">{founder.title}</p>
                                            <p className="text-xs text-muted-foreground font-bengali mt-1">{founder.name}</p>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: isImageRight ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-5"
                    >
                        <h3 className={`text-2xl font-black ${textColor} font-bengali`}>{historyTitle}</h3>
                        {
                            historyContent && (
                                <div className="text-muted-foreground font-bengali leading-relaxed" dangerouslySetInnerHTML={{ __html: historyContent }} />
                            )
                        }
                    </motion.div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {infoCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all text-center group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                                <card.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-2xl font-black text-foreground font-bengali">{card.value}</p>
                            <p className="text-sm text-muted-foreground font-bengali mt-1">{card.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}