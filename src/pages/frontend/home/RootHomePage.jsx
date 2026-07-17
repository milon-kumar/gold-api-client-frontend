import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  MessageSquareQuote,
  BookOpen,
  Target,
  Award,
  Users,
  Building2,
  FolderTree,
  Video,
  AudioLines,
  Image,
  Archive as ArchiveIcon,
  Bell,
  CalendarRange,
  Repeat,
  HeartHandshake,
  GalleryHorizontal,
  Settings,
  Compass,
  Network,
  Menu,
  X,
  ArrowRight,
  Check,
  Blocks,
  PanelTop,
  PanelBottom,
  Activity,
  ShieldCheck,
  UserCog,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  CircleDot,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useApiMutation } from "@/hooks/useAppMutation";
import { toast } from "sonner";

/* ============================================================
   DATA
   ============================================================ */
const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "Modules", id: "modules" },
  { label: "Page Builder", id: "builder" },
  { label: "Live Dashboard", id: "dashboard" },
  { label: "Accounts", id: "accounts" },
  { label: "Contact", id: "contact" },
];

const MODULE_GROUPS = [
  {
    group: "Overview",
    tagline: "Your command center",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        desc: "Everything at a glance — stats, activity, and quick actions.",
      },
    ],
  },
  {
    group: "Our Information",
    tagline: "Tell your organization's story",
    items: [
      {
        name: "President's Message",
        icon: MessageSquareQuote,
        desc: "A dedicated page for your president's words and vision.",
      },
      {
        name: "Introduction",
        icon: BookOpen,
        desc: "Present your organization's history and identity beautifully.",
      },
      {
        name: "What We Want",
        icon: Target,
        desc: "Share your mission, goals, and aspirations with the world.",
      },
      {
        name: "Founding President",
        icon: Award,
        desc: "Honor your founder with a rich, dedicated profile page.",
      },
    ],
  },
  {
    group: "Human Resource",
    tagline: "Your people, organized",
    items: [
      {
        name: "Staffs",
        icon: Users,
        desc: "Manage staff profiles, roles, and photos in one directory.",
      },
    ],
  },
  {
    group: "Content Management",
    tagline: "Publish anything, instantly",
    items: [
      {
        name: "Organization",
        icon: Building2,
        desc: "Manage branches and affiliated organizations with ease.",
      },
      {
        name: "Category",
        icon: FolderTree,
        desc: "Keep all your content neatly grouped and easy to find.",
      },
      {
        name: "Videos",
        icon: Video,
        desc: "Embed and showcase event recordings and video content.",
      },
      {
        name: "Audio",
        icon: AudioLines,
        desc: "Publish speeches, anthems, and audio recordings.",
      },
      {
        name: "Photo",
        icon: Image,
        desc: "Build stunning photo galleries from your events.",
      },
      {
        name: "Archive",
        icon: ArchiveIcon,
        desc: "Preserve documents and records in a searchable archive.",
      },
      {
        name: "Notice Board",
        icon: Bell,
        desc: "Post announcements that reach everyone immediately.",
      },
      {
        name: "Annual Plan",
        icon: CalendarRange,
        desc: "Publish yearly plans and keep members aligned.",
      },
      {
        name: "Regular Activities",
        icon: Repeat,
        desc: "Showcase your day-to-day programs and routines.",
      },
      {
        name: "Social Activities",
        icon: HeartHandshake,
        desc: "Highlight community work and social impact.",
      },
      {
        name: "Sliders",
        icon: GalleryHorizontal,
        desc: "Design eye-catching homepage banners in seconds.",
      },
    ],
  },
  {
    group: "Settings & Utilities",
    tagline: "Fine-tune everything",
    items: [
      {
        name: "Settings",
        icon: Settings,
        desc: "Control your site identity, branding, and preferences.",
      },
      {
        name: "Navigation",
        icon: Compass,
        desc: "Shape your site's menus visually — no code needed.",
      },
      {
        name: "Organizational Level",
        icon: Network,
        desc: "Model your hierarchy from central to local levels.",
      },
    ],
  },
];

const RootHomePage = ({ onNavigate }) => {
  return (
    <main>
      <Hero onNavigate={onNavigate} />
      <Modules />
      <PageBuilder />
      <Dashboard />
      <Accounts />
      <RegisterCTA />
      <Contact />
    </main>
  );
};

export default RootHomePage;

/* ============================================================
   SHARED
   ============================================================ */
function SectionHead({ eyebrow, title, sub, light = false }) {
  return (
    <div className="max-w-2xl mb-12">
      <Badge
        variant="outline"
        className={`gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider ${
          light
            ? "border-white/20 text-amber-300"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {eyebrow}
      </Badge>
      <h2
        className={`mt-5 text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight leading-tight ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${light ? "text-white/70" : "text-slate-600"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ onNavigate }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const feed = [
    { icon: Bell, mod: "Notice Board", ev: "New notice published" },
    { icon: CalendarRange, mod: "Annual Plan", ev: "2026 plan updated" },
    { icon: Image, mod: "Photo", ev: "14 photos uploaded" },
    {
      icon: GalleryHorizontal,
      mod: "Sliders",
      ev: "Homepage slider reordered",
    },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      {/* decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-32 w-80 h-80 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
        {/* Copy */}
        <div>
          <Badge className="gap-1.5 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-100 px-3.5 py-1.5 text-xs font-semibold">
            <CircleDot className="w-3.5 h-3.5" />
            Organization Management Platform
          </Badge>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
            Your organization's website,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              run from one console
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
            Notice boards, annual plans, staff directories, galleries, and your
            president's message — every page your organization publishes, built
            and updated without writing a single line of code.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => onNavigate("register")}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-7 shadow-lg shadow-emerald-600/30"
            >
              Register your business
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("modules")}
              className="rounded-full px-7"
            >
              Explore modules
            </Button>
          </div>
          <div className="mt-10 flex gap-10">
            {[
              ["21", "Modules"],
              ["5", "Module groups"],
              ["100%", "No-code"],
            ].map(([k, v]) => (
              <div key={v}>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {k}
                </div>
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mt-0.5">
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live console preview */}
        <div className="relative">
          <div className="rounded-3xl bg-slate-900 p-4 shadow-2xl shadow-slate-900/30 ring-1 ring-white/10">
            <div className="flex items-center justify-between px-2 pb-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                admin.orgsuite.app
              </span>
            </div>
            <div className="rounded-2xl bg-white overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Daily Live Dashboard
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {time.toLocaleTimeString()}
                </div>
              </div>
              {feed.map(({ icon: Icon, mod, ev }, i) => (
                <div
                  key={mod}
                  className={`flex items-center gap-3.5 px-5 py-3.5 ${i < feed.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {mod}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{ev}</div>
                  </div>
                  <Check className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                </div>
              ))}
            </div>
          </div>
          {/* floating badge */}
          <div className="absolute -bottom-4 -left-4 sm:-left-8 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 grid place-items-center">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Live & Secure
              </div>
              <div className="text-xs text-slate-500">
                Updates publish instantly
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MODULES
   ============================================================ */
function Modules() {
  const [filter, setFilter] = useState("All");
  const groups = ["All", ...MODULE_GROUPS.map((g) => g.group)];
  const shown =
    filter === "All"
      ? MODULE_GROUPS
      : MODULE_GROUPS.filter((g) => g.group === filter);

  return (
    <section id="modules" className="bg-white py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHead
          eyebrow="Module Library"
          title="21 powerful modules. Zero code."
          sub="Every module ships ready to use — turn it on, add your content, and it appears on your public site instantly."
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                filter === g
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {shown.map((g) => (
          <div key={g.group} className="mb-14 last:mb-0">
            <div className="flex items-baseline gap-3 mb-6">
              <h3 className="text-xl font-bold text-slate-900">{g.group}</h3>
              <span className="text-sm text-slate-400">— {g.tagline}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {g.items.map(({ name, icon: Icon, desc }) => (
                <Card
                  key={name}
                  className="group relative overflow-hidden border-slate-200 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-600/10 hover:border-emerald-300"
                >
                  {/* hover glow */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-600 grid place-items-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-emerald-600 group-hover:to-teal-500 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-emerald-600/30">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1.5">
                      {name}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PAGE BUILDER
   ============================================================ */
function PageBuilder() {
  const items = [
    {
      icon: Blocks,
      name: "Dynamic Page Builder",
      desc: "Compose any page from ready-made blocks — hero, gallery, notice list, staff grid. Reorder with drag & drop, publish with one click.",
      featured: true,
    },
    {
      icon: PanelTop,
      name: "Dynamic Navbar Builder",
      desc: "Build your site menu visually. Add, nest, and reorder links — changes go live across every page instantly.",
    },
    {
      icon: PanelBottom,
      name: "Dynamic Footer Builder",
      desc: "Design footer columns, contact info, and quick links once. It stays consistent everywhere, automatically.",
    },
  ];
  return (
    <section id="builder" className="bg-slate-50 py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHead
          eyebrow="Build Without Developers"
          title="Pages, navbars & footers — built by dragging"
          sub="Your website's structure isn't locked away in code. Everything a visitor sees is assembled visually inside OrgSuite."
        />
        <div className="grid md:grid-cols-3 gap-5">
          {items.map(({ icon: Icon, name, desc, featured }) => (
            <Card
              key={name}
              className={`rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                featured
                  ? "bg-emerald-600 border-emerald-600 text-white hover:shadow-emerald-600/30"
                  : "bg-white border-slate-200 hover:shadow-slate-900/10 hover:border-emerald-300"
              }`}
            >
              <CardContent className="p-7">
                <div
                  className={`w-13 h-13 p-3 rounded-2xl grid place-items-center mb-5 w-fit ${
                    featured
                      ? "bg-white/15 text-amber-300"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2.5">{name}</h3>
                <p
                  className={`text-sm leading-relaxed ${featured ? "text-white/80" : "text-slate-500"}`}
                >
                  {desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   LIVE DASHBOARD
   ============================================================ */
function Dashboard() {
  const rows = [
    {
      t: "09:02",
      icon: Bell,
      mod: "Notice Board",
      ev: "Eid holiday notice published",
      who: "admin",
    },
    {
      t: "10:41",
      icon: Users,
      mod: "Staffs",
      ev: "New staff profile added",
      who: "hr-lead",
    },
    {
      t: "11:15",
      icon: Video,
      mod: "Videos",
      ev: "AGM 2026 recording uploaded",
      who: "media",
    },
    {
      t: "13:27",
      icon: Repeat,
      mod: "Regular Activities",
      ev: "Weekly report submitted",
      who: "admin",
    },
    {
      t: "15:03",
      icon: Settings,
      mod: "Settings",
      ev: "Site logo updated",
      who: "admin",
    },
  ];
  return (
    <section
      id="dashboard"
      className="bg-slate-900 py-20 sm:py-24 text-white relative overflow-hidden"
    >
      <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <SectionHead
            light
            eyebrow="Daily Live Dashboard"
            title="See everything happening — as it happens"
            sub="Every publish, upload, and edit shows up on the live feed the moment it happens. No refreshing, no guessing who changed what."
          />
          <ul className="space-y-4 -mt-4">
            {[
              "Real-time activity feed across all 21 modules",
              "Daily summaries of publishes, uploads, and edits",
              "Per-member action history for full accountability",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-white/85">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden backdrop-blur">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10 text-xs font-mono text-white/50">
            <Clock className="w-3.5 h-3.5" />
            activity.log — today
          </div>
          {rows.map(({ t, icon: Icon, mod, ev, who }, i) => (
            <div
              key={t}
              className={`flex items-center gap-4 px-6 py-4 ${i < rows.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <span className="text-xs font-mono text-amber-300 w-11 shrink-0">
                {t}
              </span>
              <span className="w-9 h-9 rounded-xl bg-white/10 text-emerald-300 grid place-items-center shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {mod}
                </div>
                <div className="text-xs text-white/55 truncate">{ev}</div>
              </div>
              <span className="text-[11px] font-mono text-white/40 ml-auto shrink-0">
                @{who}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}

/* ============================================================
   ACCOUNT MANAGEMENT
   ============================================================ */
function Accounts() {
  const roles = [
    {
      icon: ShieldCheck,
      name: "Owner",
      desc: "Full control — billing, modules, members, and every setting.",
      perms: [
        "All modules & settings",
        "Billing management",
        "Member management",
      ],
    },
    {
      icon: UserCog,
      name: "Admin",
      desc: "Runs the day-to-day: publishes content, manages staff records.",
      perms: ["All content modules", "HR module access", "Navigation control"],
      featured: true,
    },
    {
      icon: Users,
      name: "Editor",
      desc: "Creates and updates content in assigned modules only.",
      perms: ["Assigned modules", "Draft & publish", "Media uploads"],
    },
  ];
  return (
    <section id="accounts" className="bg-white py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHead
          eyebrow="Account Management"
          title="The right access for every member"
          sub="Invite your team, assign roles, and let each person manage exactly what they should — nothing more, nothing less."
        />
        <div className="grid md:grid-cols-3 gap-5">
          {roles.map(({ icon: Icon, name, desc, perms, featured }) => (
            <Card
              key={name}
              className={`rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                featured
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35"
                  : "bg-slate-50 border-slate-200 hover:border-emerald-300 hover:shadow-slate-900/10"
              }`}
            >
              <CardContent className="p-7">
                <div
                  className={`w-12 h-12 rounded-2xl grid place-items-center mb-5 ${
                    featured
                      ? "bg-white/15 text-amber-300"
                      : "bg-white border border-slate-200 text-emerald-600"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <p
                  className={`text-sm leading-relaxed mb-6 ${featured ? "text-white/80" : "text-slate-500"}`}
                >
                  {desc}
                </p>
                <ul className="space-y-3">
                  {perms.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2.5 text-sm font-medium"
                    >
                      <Check
                        className={`w-4 h-4 shrink-0 ${featured ? "text-amber-300" : "text-emerald-600"}`}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   REGISTER BUSINESS CTA
   ============================================================ */
function RegisterCTA() {
  const initialForm = {
    name: "",
    email: "",
    phone: "",
    location: "",
    domain: "",
    password: "",
  };

  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate: register, isLoading: registerLoading } = useApiMutation({
    url: "/business-register",
    method: "POST",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (!prev[field] && !prev.general) return prev;
      const next = { ...prev };
      delete next[field];
      delete next.general;
      return next;
    });
  };

  const parseApiErrors = (error) => {
    const raw = error?.message ?? error?.response?.data?.message;

    if (!raw) return { general: ["Registration failed. Please try again."] };

    if (typeof raw === "object") return raw;

    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {
        // JSON na — plain string message
      }
      return { general: [raw] };
    }

    return { general: ["Registration failed. Please try again."] };
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = ["Full name is required."];
    if (!form.email.trim()) errs.email = ["Email address is required."];
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = ["Enter a valid email address."];
    if (!form.phone.trim()) errs.phone = ["Phone number is required."];
    if (!form.location.trim()) errs.location = ["Location is required."];
    if (!form.domain.trim()) errs.domain = ["Domain name is required."];
    if (!form.password) errs.password = ["Password is required."];
    else if (form.password.length < 8)
      errs.password = ["Password must be at least 8 characters."];
    return errs;
  };

  const handleSubmit = async () => {
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setFieldErrors({});
    setShowSuccess(false);

    try {
      const response = await register(form);
      if (response.success) {
        setShowSuccess(true);
        setForm(initialForm);
        // Scroll to show the success message
        setTimeout(() => {
          document.getElementById("success-message")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    } catch (error) {
      const parsed = parseApiErrors(error);
      setFieldErrors(parsed);

      const firstMessage =
        Object.values(parsed).flat()[0] || "Registration failed.";
      toast.error(firstMessage);
    }
  };

  const inputClass = (field) =>
    `h-12 rounded-xl bg-white/10 text-white placeholder:text-white/40 ${
      fieldErrors[field]
        ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
        : "border-white/20"
    }`;

  const FieldError = ({ field }) =>
    fieldErrors[field] ? (
      <p className="mt-1.5 text-xs text-red-400 flex items-start gap-1.5">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        {fieldErrors[field][0]}
      </p>
    ) : null;

  return (
    <section id="register" className="bg-slate-50 py-20 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 sm:p-14 shadow-2xl shadow-slate-900/30">
          {/* Decorative */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

          <div className="relative">
            <Badge className="gap-1.5 rounded-full bg-amber-400/15 text-amber-300 hover:bg-amber-400/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Register Your Business
            </Badge>

            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-white">
              Get your organization online this week
            </h2>

            <p className="mt-4 text-white/70">
              Fill in the details below to create your business account.
            </p>

            {/* Success Message */}
            {showSuccess && (
              <div
                id="success-message"
                className="mt-6 p-6 rounded-xl bg-linear-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-400/30 shadow-lg shadow-emerald-500/10 animate-in slide-in-from-top duration-500"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-emerald-300 mb-1">
                      Registration Successful! 🎉
                    </h3>
                    <p className="text-emerald-200/80 leading-relaxed">
                      Your business registration has been completed
                      successfully. However, it is currently in a pending
                      status. Please contact support to activate your business
                      account.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General error */}
            {fieldErrors.general && !showSuccess && (
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {fieldErrors.general[0]}
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  aria-invalid={!!fieldErrors.name}
                  className={inputClass("name")}
                  disabled={showSuccess}
                />
                <FieldError field="name" />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  aria-invalid={!!fieldErrors.email}
                  className={inputClass("email")}
                  disabled={showSuccess}
                />
                <FieldError field="email" />
              </div>

              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  aria-invalid={!!fieldErrors.phone}
                  className={inputClass("phone")}
                  disabled={showSuccess}
                />
                <FieldError field="phone" />
              </div>

              <div>
                <Input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  aria-invalid={!!fieldErrors.location}
                  className={inputClass("location")}
                  disabled={showSuccess}
                />
                <FieldError field="location" />
              </div>

              <div>
                <Input
                  placeholder="Domain Name (example.com)"
                  value={form.domain}
                  onChange={(e) => handleChange("domain", e.target.value)}
                  aria-invalid={!!fieldErrors.domain}
                  className={inputClass("domain")}
                  disabled={showSuccess}
                />
                <FieldError field="domain" />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  aria-invalid={!!fieldErrors.password}
                  className={inputClass("password")}
                  disabled={showSuccess}
                />
                <FieldError field="password" />
              </div>

              <div className="md:col-span-2 flex flex-wrap items-center gap-4 mt-2">
                <Button
                  size="lg"
                  disabled={registerLoading || showSuccess}
                  onClick={handleSubmit}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl px-8 shadow-lg shadow-amber-400/30 disabled:opacity-60"
                >
                  {registerLoading ? "Registering..." : "Register Business"}
                  {registerLoading ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </Button>

                <span className="text-sm text-white/50">
                  Free 14-day trial · No credit card required
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
/* ============================================================
   CONTACT US
   ============================================================ */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const info = [
    { icon: Mail, label: "Email us", value: "info@schoolsoftwarebd.com" },
    { icon: Phone, label: "Call us", value: "+880 1897-770000" },
    { icon: MapPin, label: "Visit us", value: "Sahara Center,37/A,Lift 16, VIP Road,Kakrail, Dhaka" },
  ];

  return (
    <section id="contact" className="bg-white py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHead
          eyebrow="Contact Us"
          title="Questions? Let's talk."
          sub="Whether you're setting up a new organization or migrating an existing site, our team responds within one business day."
        />
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info cards */}
          <div className="lg:col-span-2 space-y-4">
            {info.map(({ icon: Icon, label, value }) => (
              <Card
                key={label}
                className="rounded-2xl border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-600/5 transition-all"
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <span className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 grid place-items-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {label}
                    </div>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      {value}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="rounded-2xl bg-emerald-600 border-emerald-600 text-white">
              <CardContent className="p-5 flex items-center gap-4">
                <span className="w-12 h-12 rounded-xl bg-white/15 text-amber-300 grid place-items-center shrink-0">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Support hours
                  </div>
                  <div className="font-semibold mt-0.5">
                    Sat – Thu, 9 AM – 6 PM
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card className="lg:col-span-3 rounded-3xl border-slate-200 shadow-lg shadow-slate-900/5">
            <CardContent className="p-6 sm:p-8">
              {!sent ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        Your name
                      </label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Rahim Uddin"
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        Email address
                      </label>
                      <Input
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="you@organization.org"
                        type="email"
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Message
                    </label>
                    <Textarea
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Tell us about your organization and what you need..."
                      rows={5}
                      className="rounded-xl resize-none"
                    />
                  </div>
                  <Button
                    size="lg"
                    onClick={() => {
                      if (form.name && form.email && form.message)
                        setSent(true);
                    }}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8"
                  >
                    Send message
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-10">
                  <span className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto mb-5">
                    <Check className="w-8 h-8" />
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Message sent
                  </h3>
                  <p className="text-slate-500">
                    Thanks, {form.name}. We'll reply to{" "}
                    <strong>{form.email}</strong> within one business day.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
