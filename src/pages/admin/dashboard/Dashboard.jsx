import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Image,
  Video,
  FileText,
  Bell,
  Newspaper,
  CalendarDays,
  Users,
  UserCheck,
  UserPlus,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  HardDrive,
  Activity,
  Zap,
  Plus,
  Upload,
  ExternalLink,
  Megaphone,
  Building2,
  GraduationCap,
  Layers,
  FolderOpen,
  Settings,
  BarChart3,
  CircleDot,
  LogIn,
  ShieldCheck,
  Database,
  Server,
  Archive,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Timer,
  MousePointerClick,
  Film,
  Download,
  Briefcase,
  MapPin,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { useApiQuery } from "@/hooks/useAppQuery";
import { ImChrome as Chrome } from "react-icons/im";

/* ================================================================
   PRIMITIVES
================================================================ */

const fmt = (n) => (typeof n === "number" ? n.toLocaleString("en-US") : n);

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Icon size={16} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

function TrendBadge({ trend, invert }) {
  if (trend === 0 || !trend)
    return (
      <span className="text-[11px] font-medium text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5">
        —
      </span>
    );
  const good = invert ? trend < 0 : trend > 0;
  const Icon = trend > 0 ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold rounded-full px-1.5 py-0.5 ${
        good ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
      }`}
    >
      <Icon size={11} />
      {Math.abs(trend)}%
    </span>
  );
}


// tint (e.g. "bg-emerald-50 text-emerald-600") theke shape color map
const SHAPE_COLORS = {
  emerald: { soft: "#d1fae5", mid: "#6ee7b7", strong: "#10b981" },
  sky: { soft: "#e0f2fe", mid: "#7dd3fc", strong: "#0ea5e9" },
  orange: { soft: "#ffedd5", mid: "#fdba74", strong: "#f97316" },
  slate: { soft: "#e2e8f0", mid: "#94a3b8", strong: "#64748b" },
  violet: { soft: "#ede9fe", mid: "#c4b5fd", strong: "#8b5cf6" },
  amber: { soft: "#fef3c7", mid: "#fcd34d", strong: "#f59e0b" },
  indigo: { soft: "#e0e7ff", mid: "#a5b4fc", strong: "#6366f1" },
  teal: { soft: "#ccfbf1", mid: "#5eead4", strong: "#14b8a6" },
  rose: { soft: "#ffe4e6", mid: "#fda4af", strong: "#f43f5e" },
};

function colorsFromTint(tint = "") {
  const key = Object.keys(SHAPE_COLORS).find((k) => tint.includes(k));
  return SHAPE_COLORS[key] || SHAPE_COLORS.slate;
}

/* Corner-e layered shapes: boro circle, ring, quarter-arc, dot grid, choto triangle */
function ShapeBackdrop({ c, seed }) {
  const variant = seed % 3; // ekta grid-e cards gulo ektu alada dekhabe
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMaxYMin slice"
      viewBox="0 0 260 130"
    >
      {/* boro soft circle — top-right corner theke overflow */}
      <circle cx="248" cy="-12" r="72" fill={c.soft} opacity="0.85" />
      {/* tar upor ekta outline ring */}
      <circle
        cx="248"
        cy="-12"
        r="94"
        fill="none"
        stroke={c.mid}
        strokeWidth="1.5"
        strokeDasharray={variant === 1 ? "4 6" : "none"}
        opacity="0.55"
        className="transition-transform duration-700 ease-out origin-[248px_-12px] group-hover:scale-110"
      />
      {/* quarter arc accent */}
      <path
        d="M 175 0 A 74 74 0 0 1 249 62"
        fill="none"
        stroke={c.strong}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
        className="transition-all duration-500 group-hover:opacity-90"
      />
      {/* dot grid — bottom-left */}
      <g fill={c.mid} opacity="0.5">
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3, 4].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={14 + col * 11}
              cy={92 + row * 10}
              r="1.6"
            />
          )),
        )}
      </g>
      {/* variant onujayi ekta extra choto shape */}
      {variant === 0 && (
        <circle
          cx="196"
          cy="52"
          r="5"
          fill="none"
          stroke={c.strong}
          strokeWidth="1.75"
          opacity="0.6"
        />
      )}
      {variant === 1 && (
        <path
          d="M 190 44 l 10 14 h -20 z"
          fill={c.strong}
          opacity="0.35"
          className="transition-transform duration-500 group-hover:-translate-y-1"
        />
      )}
      {variant === 2 && (
        <rect
          x="188"
          y="44"
          width="11"
          height="11"
          rx="3"
          fill={c.strong}
          opacity="0.3"
          transform="rotate(18 193 49)"
          className="transition-transform duration-500 group-hover:rotate-45 origin-[193px_49px]"
        />
      )}
      {/* niche dan kone ekta ardho-lukano ring */}
      <circle
        cx="252"
        cy="132"
        r="26"
        fill="none"
        stroke={c.soft}
        strokeWidth="8"
        opacity="0.9"
      />
    </svg>
  );
}

function TrendChip({ trend, invert }) {
  if (!trend) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-inset ring-slate-200 backdrop-blur-sm">
        <Minus size={11} /> 0%
      </span>
    );
  }
  const up = trend > 0;
  const good = invert ? !up : up;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset backdrop-blur-sm ${
        good
          ? "bg-emerald-50/90 text-emerald-700 ring-emerald-200"
          : "bg-rose-50/90 text-rose-700 ring-rose-200"
      }`}
    >
      {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      {Math.abs(trend)}%
    </span>
  );
}

function StatCard({ stat, seed }) {
  const Icon = stat.icon;
  const c = colorsFromTint(stat.tint);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white
                 shadow-[0_1px_3px_rgba(15,23,42,0.05)]
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:shadow-[0_16px_32px_-14px_rgba(15,23,42,0.18)]"
    >
      {/* geometric shape layer */}
      <ShapeBackdrop c={c} seed={seed} />

      <div className="relative p-4">
        {/* header */}
        <div className="flex items-start justify-between">
          {/* icon — squircle, tilted frame shape er upor bosano */}
          <div className="relative">
            <div
              className="absolute inset-0 rotate-6 rounded-[14px] transition-transform duration-300 group-hover:rotate-12"
              style={{ background: c.soft }}
            />
            <div
              className="relative grid h-10 w-10 place-items-center rounded-[14px] bg-white
                         ring-1 ring-inset shadow-sm transition-transform duration-300 group-hover:scale-105"
              style={{
                ringColor: c.mid,
                color: c.strong,
                boxShadow: `inset 0 0 0 1.5px ${c.mid}`,
              }}
            >
              <Icon size={18} strokeWidth={2.1} />
            </div>
          </div>
          <TrendChip trend={stat.trend} invert={stat.invert} />
        </div>

        {/* value + label */}
        <div className="mt-4">
          <p className="text-[26px] font-extrabold leading-none tracking-tight text-slate-900 tabular-nums">
            {typeof stat.value === "number"
              ? stat.value.toLocaleString()
              : stat.value}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {/* label er pashe ekta choto color bar shape */}
            <span
              className="h-3 w-1 rounded-full"
              style={{ background: c.strong }}
            />
            <p className="text-[12.5px] font-medium text-slate-500">
              {stat.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({
  value,
  color = "bg-emerald-500",
  track = "bg-slate-100",
}) {
  const safeValue = Math.min(100, Math.max(0, value || 0));
  return (
    <div className={`h-1.5 w-full rounded-full ${track} overflow-hidden`}>
      <div
        className={`h-full rounded-full ${color} transition-all duration-700`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function CircularProgress({ pct, color, size = 84 }) {
  const safePct = Math.min(100, Math.max(0, pct || 0));
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="8"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * safePct) / 100}
        className="transition-all duration-1000"
      />
    </svg>
  );
}

function StatusDot({ status }) {
  const map = {
    green: "bg-emerald-500",
    yellow: "bg-amber-400",
    red: "bg-rose-500",
  };
  const color = map[status] || "bg-slate-400";
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${color}`}
      />
      <span
        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`}
      />
    </span>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-1.5 text-slate-600">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color || p.fill }}
          />
          {p.name}: <span className="font-semibold">{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

/* ================================================================
   HELPERS
================================================================ */

const getFlagEmoji = (countryCode) => {
  if (!countryCode) return "🌐";
  const code = countryCode.toUpperCase();
  try {
    return String.fromCodePoint(
      0x1f1e6 + (code.charCodeAt(0) - 65),
      0x1f1e6 + (code.charCodeAt(1) - 65),
    );
  } catch {
    return "🌐";
  }
};

const formatTimeAgo = (timeStr) => {
  if (!timeStr) return "Just now";
  if (timeStr.includes("ago")) return timeStr;

  try {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return timeStr;
  }
};

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const PIE_COLORS = [
  "#059669",
  "#0284c7",
  "#7c3aed",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#f59e0b",
  "#8b5cf6",
];

/* ================================================================
   DYNAMIC SECTIONS
================================================================ */

function WelcomeSection({ data }) {
  const now = data?.welcome?.now ? new Date(data.welcome.now) : new Date();
  const userName = data?.welcome?.userName || "Admin";
  const organization = data?.welcome?.organization || "Organization";

  const actions = [
    { label: "Add New Content", icon: Plus, primary: true },
    { label: "Upload Image", icon: Image },
    { label: "Upload Video", icon: Upload },
    { label: "Create Notice", icon: Megaphone },
    { label: "View Website", icon: ExternalLink },
  ];

  return (
    <Card className="p-5 sm:p-6 overflow-hidden relative">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-50" />
      <div className="absolute -top-8 -right-24 w-56 h-56 rounded-full bg-emerald-100/50" />
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
            Admin Dashboard
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            আসসালামু আলাইকুম, {userName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-medium text-slate-600">{organization}</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} />
              {now.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" — "}
              {now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                a.primary
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/30"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              <a.icon size={14} />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

function StatsOverview({ data }) {
  const [tab, setTab] = useState("Content");

  const contentStats = useMemo(() => {
    const c = data?.stats?.content || {};
    return [
      {
        label: "Total Images",
        value: c.totalImages || 0,
        trend: 0,
        icon: Image,
        tint: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Active Images",
        value: c.activeImages || 0,
        trend: 0,
        icon: Image,
        tint: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Total Videos",
        value: c.totalVideos || 0,
        trend: 0,
        icon: Video,
        tint: "bg-sky-50 text-sky-600",
      },
      {
        label: "Active Videos",
        value: c.activeVideos || 0,
        trend: 0,
        icon: Film,
        tint: "bg-sky-50 text-sky-600",
      },
      {
        label: "Total Activities",
        value: c.totalActivities || 0,
        trend: 0,
        icon: Activity,
        tint: "bg-orange-50 text-orange-600",
      },
      {
        label: "Organizations",
        value: c.totalOrganizations || 0,
        trend: 0,
        icon: Building2,
        tint: "bg-slate-100 text-slate-600",
      },
      {
        label: "Total Sliders",
        value: c.totalSliders || 0,
        trend: 0,
        icon: Layers,
        tint: "bg-violet-50 text-violet-600",
      },
      {
        label: "Total Navigations",
        value: c.totalNavigations || 0,
        trend: 0,
        icon: FileText,
        tint: "bg-amber-50 text-amber-600",
      },
      {
        label: "Active Navigations",
        value: c.totalActiveNavigations || 0,
        trend: 0,
        icon: CheckCircle2,
        tint: "bg-emerald-50 text-emerald-600",
      },
    ];
  }, [data]);

  const userStats = useMemo(() => {
    const u = data?.stats?.users || {};
    return [
      {
        label: "Total Users",
        value: u.total || 0,
        trend: 0,
        icon: Users,
        tint: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Active Users",
        value: u.active || 0,
        trend: 0,
        icon: UserCheck,
        tint: "bg-sky-50 text-sky-600",
      },
      {
        label: "New This Month",
        value: u.newThisMonth || 0,
        trend: 0,
        icon: UserPlus,
        tint: "bg-violet-50 text-violet-600",
      },
    ];
  }, [data]);

  const websiteStats = useMemo(() => {
    const w = data?.stats?.website || {};
    return [
      {
        label: "Total Visitors",
        value: w.totalVisitors || 0,
        trend: 0,
        icon: Globe,
        tint: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Visitors Today",
        value: w.visitorsToday || 0,
        trend: 0,
        icon: CircleDot,
        tint: "bg-sky-50 text-sky-600",
      },
      {
        label: "This Week",
        value: w.visitorsWeek || 0,
        trend: 0,
        icon: TrendingUp,
        tint: "bg-violet-50 text-violet-600",
      },
      {
        label: "This Month",
        value: w.visitorsMonth || 0,
        trend: 0,
        icon: BarChart3,
        tint: "bg-amber-50 text-amber-600",
      },
      {
        label: "Total Page Views",
        value: w.totalPageViews || 0,
        trend: 0,
        icon: Eye,
        tint: "bg-indigo-50 text-indigo-600",
      },
      {
        label: "Avg. Session",
        value: `${w.avgSessionDuration || 0}s`,
        trend: 0,
        icon: Timer,
        tint: "bg-teal-50 text-teal-600",
      },
      {
        label: "Bounce Rate",
        value: `${w.bounceRate || 0}%`,
        trend: 0,
        invert: true,
        icon: MousePointerClick,
        tint: "bg-rose-50 text-rose-600",
      },
    ];
  }, [data]);

  const tabs = {
    Content: contentStats,
    Users: userStats,
    Website: websiteStats,
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <BarChart3 size={16} className="text-emerald-600" /> Statistics
          Overview
        </h2>
        <div className="flex bg-slate-100 rounded-xl p-1">
          {Object.keys(tabs).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs font-semibold rounded-lg px-3.5 py-1.5 transition-all ${
                tab === t
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {tabs[tab].map((s, i) => (
          <StatCard key={s.label} stat={s} seed={i + tab.length} />
        ))}
      </div>
    </section>
  );
}

function VisitorAnalytics({ data }) {
  const visitorTrend = data?.visitorTrend || [];
  const newVsReturning = data?.newVsReturning || [
    { name: "New", value: 0 },
    { name: "Returning", value: 0 },
  ];
  const sessionDuration = data?.sessionDuration || [];

  // Format dates for display
  const formattedTrend = visitorTrend.map((item) => ({
    ...item,
    label: item.label ? new Date(item.label).toLocaleDateString() : item.label,
  }));

  return (
    <section className="space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Activity size={16} className="text-emerald-600" /> Visitor Analytics
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5">
        {/* Visitor trend area chart */}
        <Card className="xl:col-span-2">
          <SectionTitle
            icon={TrendingUp}
            title="Visitor Trend"
            subtitle={`${visitorTrend.length} days`}
          />
          <div className="h-64 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={
                  formattedTrend.length > 0
                    ? formattedTrend
                    : [{ label: "No Data", visitors: 0 }]
                }
                margin={{ top: 5, right: 15, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  name="Visitors"
                  dataKey="visitors"
                  stroke="#059669"
                  strokeWidth={2}
                  fill="url(#gv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* New vs returning pie */}
        <Card>
          <SectionTitle
            icon={Users}
            title="New vs Returning"
            subtitle="Visitor loyalty split"
          />
          <div className="h-52 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    newVsReturning.length > 0
                      ? newVsReturning
                      : [{ name: "No Data", value: 1 }]
                  }
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {newVsReturning.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-slate-500 pb-4">
            {newVsReturning.length > 0
              ? `${Math.round(((newVsReturning[0]?.value || 0) / ((newVsReturning[0]?.value || 0) + (newVsReturning[1]?.value || 0) || 1)) * 100)}% of traffic is first-time visitors`
              : "No data available"}
          </p>
        </Card>

        {/* Page views line chart */}
        <Card className="xl:col-span-2">
          <SectionTitle
            icon={Eye}
            title="Page Views"
            subtitle={`${visitorTrend.length} days`}
          />
          <div className="h-56 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  formattedTrend.length > 0
                    ? formattedTrend
                    : [{ label: "No Data", visitors: 0, pageViews: 0 }]
                }
                margin={{ top: 5, right: 15, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  name="Page Views"
                  dataKey="pageViews"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  name="Visitors"
                  dataKey="visitors"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Session duration bar */}
        <Card>
          <SectionTitle
            icon={Timer}
            title="Session Duration"
            subtitle="Time spent per visit"
          />
          <div className="h-56 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  sessionDuration.length > 0
                    ? sessionDuration
                    : [{ bucket: "No Data", count: 0 }]
                }
                margin={{ top: 5, right: 15, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="bucket"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar
                  name="Sessions"
                  dataKey="count"
                  fill="#0284c7"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
}

function GeographySection({ data }) {
  const countries = data?.geography?.countries || [];
  const cities = data?.geography?.cities || [];

  // Calculate percentages for countries
  const totalCountryVisits =
    countries.reduce((sum, c) => sum + (c.value || 0), 0) || 1;
  const countriesWithPct = countries.map((c) => ({
    ...c,
    pct: Math.round((c.value / totalCountryVisits) * 100),
  }));

  return (
    <Card>
      <SectionTitle
        icon={Globe}
        title="Visitor Geography"
        subtitle="Top countries & cities"
      />
      <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Top Countries
          </p>
          {countriesWithPct.length > 0 ? (
            countriesWithPct.slice(0, 7).map((c) => (
              <div key={c.name || c.code} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="text-base leading-none">
                      {getFlagEmoji(c.code)}
                    </span>{" "}
                    {c.name}
                  </span>
                  <span className="text-slate-500">
                    {fmt(c.value)}{" "}
                    <span className="text-slate-400">({c.pct}%)</span>
                  </span>
                </div>
                <ProgressBar value={c.pct} />
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">
              No country data available
            </p>
          )}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Top Cities
          </p>
          <div className="space-y-2">
            {cities.length > 0 ? (
              cities.slice(0, 6).map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5 hover:border-emerald-200 transition-colors"
                >
                  <span className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <span className="text-base leading-none">
                      {getFlagEmoji(c.code)}
                    </span>
                    <MapPin size={12} className="text-slate-400" /> {c.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {fmt(c.value)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                No city data available
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function DeviceSection({ data }) {
  const devices = data?.devices || [];
  const operatingSystems = data?.operatingSystems || [];

  return (
    <Card>
      <SectionTitle
        icon={Monitor}
        title="Device Analytics"
        subtitle="Devices & operating systems"
      />
      <div className="px-5 pb-5">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={
                  devices.length > 0 ? devices : [{ name: "No Data", value: 1 }]
                }
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
              >
                {devices.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          {devices.map((d, i) => {
            const Icon =
              d.name === "Mobile"
                ? Smartphone
                : d.name === "Tablet"
                  ? Tablet
                  : Monitor;
            return (
              <span
                key={d.name}
                className="flex items-center gap-1.5 text-xs text-slate-600"
              >
                <Icon
                  size={13}
                  style={{ color: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {d.name} <b>{d.value}%</b>
              </span>
            );
          })}
        </div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Operating Systems
        </p>
        <div className="space-y-2.5">
          {operatingSystems.length > 0 ? (
            operatingSystems.map((os) => (
              <div key={os.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{os.name}</span>
                  <span className="text-slate-500">{os.value}%</span>
                </div>
                <ProgressBar value={os.value} color="bg-sky-500" />
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">
              No OS data available
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function BrowserSection({ data }) {
  const browsers = data?.browsers || [];

  return (
    <Card>
      <SectionTitle
        icon={Chrome}
        title="Browser Analytics"
        subtitle="Browser share of sessions"
      />
      <div className="px-5 pb-5">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={
                  browsers.length > 0
                    ? browsers
                    : [{ name: "No Data", value: 1 }]
                }
                dataKey="value"
                nameKey="name"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={2}
              >
                {browsers.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2.5 mt-2">
          {browsers.length > 0 ? (
            browsers.map((b, i) => (
              <div key={b.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    {b.name}
                  </span>
                  <span className="text-slate-500">{b.value}%</span>
                </div>
                <ProgressBar value={b.value} color="bg-violet-500" />
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">
              No browser data available
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function TrafficSources({ data }) {
  const sources = data?.trafficSources || [];

  return (
    <Card>
      <SectionTitle
        icon={Search}
        title="Traffic Sources"
        subtitle="Where visitors arrive from"
      />
      <div className="h-72 px-3 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={
              sources.length > 0 ? sources : [{ name: "No Data", value: 0 }]
            }
            layout="vertical"
            margin={{ top: 0, right: 25, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={95}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar
              name="Visitors"
              dataKey="value"
              fill="#059669"
              radius={[0, 6, 6, 0]}
              maxBarSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function TopPagesTable({ data }) {
  const topPages = data?.topPages || [];

  if (topPages.length === 0) {
    return (
      <Card>
        <SectionTitle
          icon={Eye}
          title="Most Visited Pages"
          subtitle="No data available"
        />
        <div className="px-5 pb-5 text-center text-sm text-slate-400 py-8">
          No page view data available yet
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle
        icon={Eye}
        title="Most Visited Pages"
        subtitle="From visitor data"
      />
      <div className="overflow-x-auto pb-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-y border-slate-100">
              <th className="px-5 py-2.5 font-semibold">Page</th>
              <th className="px-3 py-2.5 font-semibold text-right">Views</th>
              <th className="px-3 py-2.5 font-semibold text-right">Unique</th>
              <th className="px-3 py-2.5 font-semibold text-right">
                Avg. Time
              </th>
              <th className="px-5 py-2.5 font-semibold text-right">Bounce</th>
            </tr>
          </thead>
          <tbody>
            {topPages.slice(0, 10).map((p, i) => (
              <tr
                key={i}
                className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-5 py-3">
                  <p className="font-semibold text-slate-700">
                    {p.title || p.url}
                  </p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    {p.url}
                  </p>
                </td>
                <td className="px-3 py-3 text-right font-semibold text-slate-700">
                  {fmt(p.views)}
                </td>
                <td className="px-3 py-3 text-right text-slate-500">
                  {fmt(p.unique || p.views)}
                </td>
                <td className="px-3 py-3 text-right text-slate-500">
                  {p.time || "—"}
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="font-semibold text-slate-500">
                    {p.bounce || 0}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PopularContent({ data }) {
  const popularContent = data?.popularContent || [];

  // Group by category if available, otherwise use "All"
  const groupedContent = popularContent.reduce((acc, item) => {
    const category = item.category || "All";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedContent);
  const [tab, setTab] = useState(categories[0] || "All");

  const content = groupedContent[tab] || popularContent;

  return (
    <Card>
      <SectionTitle
        icon={TrendingUp}
        title="Popular Content"
        right={
          categories.length > 1 && (
            <div className="flex flex-wrap gap-1 bg-slate-100 rounded-xl p-1">
              {categories.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 transition-all ${
                    tab === t
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )
        }
      />
      <div className="px-5 pb-5 space-y-2">
        {content.length > 0 ? (
          content.slice(0, 5).map((item, i) => (
            <div
              key={item.title || i}
              className="flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-2.5 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
            >
              <span className="text-xs font-bold text-slate-300 w-4">
                {i + 1}
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                <Eye size={14} />
              </span>
              <p className="text-xs font-medium text-slate-700 flex-1 truncate">
                {item.title}
              </p>
              <span className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1">
                <Eye size={11} />
                {fmt(item.views)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            No popular content data available
          </p>
        )}
      </div>
    </Card>
  );
}

function RecentActivities({ data }) {
  const activities = data?.recentActivities || [];

  const getIcon = (type) => {
    const icons = {
      upload: Image,
      image: Image,
      video: Video,
      notice: Megaphone,
      news: Newspaper,
      login: LogIn,
      document: FileText,
      settings: Settings,
    };
    return icons[type] || Activity;
  };

  const getTint = (type) => {
    const tints = {
      upload: "bg-emerald-50 text-emerald-600",
      image: "bg-emerald-50 text-emerald-600",
      video: "bg-sky-50 text-sky-600",
      notice: "bg-rose-50 text-rose-600",
      news: "bg-indigo-50 text-indigo-600",
      login: "bg-slate-100 text-slate-600",
      document: "bg-amber-50 text-amber-600",
      settings: "bg-violet-50 text-violet-600",
    };
    return tints[type] || "bg-slate-50 text-slate-600";
  };

  return (
    <Card>
      <SectionTitle
        icon={Activity}
        title="Recent Activities"
        subtitle="Latest admin actions"
      />
      <div className="px-5 pb-5">
        {activities.length > 0 ? (
          <div className="relative pl-4">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
            <div className="space-y-4">
              {activities.slice(0, 7).map((a, i) => {
                const Icon = getIcon(a.type);
                const tint = getTint(a.type);
                return (
                  <div key={a.id || i} className="relative flex gap-3">
                    <span
                      className={`absolute -left-4 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${tint.split(" ")[0]}`}
                    />
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tint}`}
                    >
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-700 leading-snug">
                        <b>{a.user || "Unknown"}</b>{" "}
                        {a.action || a.text || "performed an action"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatTimeAgo(a.time)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-8">
            No recent activities
          </p>
        )}
      </div>
    </Card>
  );
}

function OnlineNow({ data }) {
  const online = data?.online || { users: 0, sessions: 0, liveViews: 0 };
  const items = [
    { label: "Online Users", value: online.users || 0, icon: Users },
    { label: "Active Sessions", value: online.sessions || 0, icon: Zap },
    { label: "Live Page Views", value: online.liveViews || 0, icon: Eye },
  ];

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <StatusDot status={online.users > 0 ? "green" : "yellow"} />
        <h3 className="text-sm font-semibold text-slate-800">
          Online Right Now
        </h3>
        <span className="ml-auto text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 uppercase tracking-wide">
          {online.users > 0 ? "Live" : "Inactive"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center"
          >
            <it.icon size={15} className="mx-auto text-emerald-600 mb-1.5" />
            <p className="text-lg font-bold text-slate-800 leading-none">
              {it.value}
            </p>
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">
              {it.label}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentVisitorsTable({ data }) {
  const visitors = data?.recentVisitors || [];

  const devIcon = {
    mobile: Smartphone,
    desktop: Monitor,
    tablet: Tablet,
    Mobile: Smartphone,
    Desktop: Monitor,
    Tablet: Tablet,
  };

  return (
    <Card>
      <SectionTitle
        icon={Globe}
        title="Recent Visitors"
        subtitle="Latest sessions on the website"
      />
      <div className="overflow-x-auto pb-2">
        {visitors.length > 0 ? (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-y border-slate-100">
                <th className="px-5 py-2.5 font-semibold">Location</th>
                <th className="px-3 py-2.5 font-semibold">Device</th>
                <th className="px-3 py-2.5 font-semibold">Browser</th>
                <th className="px-3 py-2.5 font-semibold">Page</th>
                <th className="px-5 py-2.5 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {visitors.slice(0, 10).map((v, i) => {
                const D = devIcon[v.device] || Monitor;
                const flag = getFlagEmoji(v.code);
                const location =
                  v.city && v.country
                    ? `${v.city}, ${v.country}`
                    : v.country || v.city || "Unknown";
                return (
                  <tr
                    key={v.id || i}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                        <span className="text-base leading-none">{flag}</span>
                        {location}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <D size={12} /> {v.device || "Unknown"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-500">
                      {v.browser || "Unknown"}
                    </td>
                    <td className="px-3 py-3 font-mono text-[11px] text-emerald-700 truncate max-w-[120px]">
                      {v.page || "/"}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-400">
                      {formatTimeAgo(v.time)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-5 pb-5 text-center text-sm text-slate-400 py-8">
            No recent visitors
          </div>
        )}
      </div>
    </Card>
  );
}

function ModulePerformance({ data }) {
  const modules = data?.modulePerformance || [];

  // If no module performance data, use content stats
  const content = data?.stats?.content || {};
  const moduleData =
    modules.length > 0
      ? modules
      : [
          {
            name: "Images",
            total: content.totalImages || 0,
            active: content.activeImages || 0,
            draft: 0,
          },
          {
            name: "Videos",
            total: content.totalVideos || 0,
            active: content.activeVideos || 0,
            draft: 0,
          },
        ];

  return (
    <Card>
      <SectionTitle
        icon={Layers}
        title="Module Performance"
        subtitle="Content status per module"
      />
      <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {moduleData.map((m) => {
          const draft = m.draft || Math.max(0, m.total - m.active);
          const activePct = m.total > 0 ? (m.active / m.total) * 100 : 0;
          const draftPct = m.total > 0 ? (draft / m.total) * 100 : 0;
          const colors = {
            Images: "bg-emerald-500",
            Videos: "bg-sky-500",
            News: "bg-indigo-500",
            Documents: "bg-amber-500",
            Staff: "bg-cyan-500",
            Notices: "bg-rose-500",
          };
          const color = colors[m.name] || "bg-violet-500";

          return (
            <div
              key={m.name}
              className="rounded-xl border border-slate-100 p-3.5 hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-700">{m.name}</p>
                <p className="text-xs text-slate-400">{fmt(m.total)} total</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className={`h-full ${color}`}
                  style={{ width: `${activePct}%` }}
                />
                {draft > 0 && (
                  <div
                    className="h-full bg-slate-300"
                    style={{ width: `${draftPct}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between mt-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${color}`} /> Active{" "}
                  {fmt(m.active)}
                </span>
                {draft > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300" /> Draft{" "}
                    {fmt(draft)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function StorageUsage({ data }) {
  const storage = data?.storage || { used: 0, limit: 10737418240, percent: 0 };
  const images = storage.images || { bytes: 0, files: 0 };
  const videos = storage.videos || { bytes: 0, files: 0 };
  const documents = storage.documents || { bytes: 0, files: 0 };

  const usedGB = storage.used / (1024 * 1024 * 1024);
  const limitGB = storage.limit / (1024 * 1024 * 1024);
  const pct = storage.percent || (storage.used / storage.limit) * 100;

  const storageItems = [
    {
      label: "Images",
      used: images.bytes / (1024 * 1024 * 1024),
      limit: 1,
      unit: "GB",
      color: "#059669",
      icon: Image,
    },
    {
      label: "Videos",
      used: videos.bytes / (1024 * 1024 * 1024),
      limit: 1,
      unit: "GB",
      color: "#0284c7",
      icon: Video,
    },
    {
      label: "Documents",
      used: documents.bytes / (1024 * 1024 * 1024),
      limit: 1,
      unit: "GB",
      color: "#d97706",
      icon: FileText,
    },
    {
      label: "Total Used",
      used: usedGB,
      limit: limitGB,
      unit: "GB",
      color: "#4f46e5",
      icon: HardDrive,
    },
  ];

  return (
    <Card>
      <SectionTitle
        icon={HardDrive}
        title="Storage Usage"
        subtitle={`${usedGB.toFixed(1)} GB of ${limitGB.toFixed(1)} GB used`}
      />
      <div className="px-5 pb-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {storageItems.map((s) => {
          const pct =
            s.limit > 0
              ? Math.min(100, Math.round((s.used / s.limit) * 100))
              : 0;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-slate-100 p-4 flex flex-col items-center text-center hover:border-emerald-200 transition-colors"
            >
              <div className="relative">
                <CircularProgress pct={pct} color={s.color} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <s.icon size={14} style={{ color: s.color }} />
                  <span className="text-[11px] font-bold text-slate-700">
                    {pct}%
                  </span>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-2">
                {s.label}
              </p>
              <p className="text-[11px] text-slate-400">
                {s.used.toFixed(1)} / {s.limit.toFixed(1)} {s.unit}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function SystemHealth({ data }) {
  const health = data?.systemHealth || {
    server: "green",
    database: "green",
    cache: "green",
    storage: "green",
    queue: "green",
    backup: "yellow",
  };

  const healthItems = [
    { label: "Server", status: health.server, icon: Server },
    { label: "Database", status: health.database, icon: Database },
    { label: "Storage", status: health.storage, icon: HardDrive },
    { label: "Queue", status: health.queue, icon: Layers },
    { label: "Cache", status: health.cache, icon: Zap },
    { label: "Backup", status: health.backup, icon: Archive },
  ];

  return (
    <Card>
      <SectionTitle
        icon={ShieldCheck}
        title="System Health"
        subtitle="All services operational"
      />
      <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {healthItems.map((h) => (
          <div
            key={h.label}
            className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
          >
            <h.icon size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-700 flex-1">
              {h.label}
            </span>
            <StatusDot status={h.status} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function UpcomingEvents({ data }) {
  const events = data?.upcomingEvents || [];

  const getTint = (type) => {
    const tints = {
      Event: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Notice: "bg-rose-50 text-rose-700 border-rose-200",
      Holiday: "bg-slate-100 text-slate-700 border-slate-200",
      News: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    return tints[type] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <Card>
      <SectionTitle
        icon={CalendarDays}
        title="Upcoming Events"
        subtitle="Events, holidays & schedules"
      />
      <div className="px-5 pb-5 space-y-2.5">
        {events.length > 0 ? (
          events.slice(0, 5).map((e, i) => {
            const dateParts = e.date ? e.date.split("-") : [];
            const day = dateParts[2] || e.date || "00";
            const month =
              e.month ||
              (dateParts[1]
                ? new Date(0, parseInt(dateParts[1]) - 1).toLocaleString("en", {
                    month: "short",
                  })
                : "");
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 hover:border-emerald-200 transition-colors"
              >
                <div className="w-11 shrink-0 rounded-lg bg-emerald-600 text-white text-center py-1.5">
                  <p className="text-sm font-bold leading-none">{day}</p>
                  <p className="text-[9px] uppercase tracking-wide opacity-80">
                    {month}
                  </p>
                </div>
                <p className="text-xs font-medium text-slate-700 flex-1 leading-snug">
                  {e.title}
                </p>
                <span
                  className={`text-[10px] font-semibold rounded-full border px-2 py-0.5 ${getTint(e.type)}`}
                >
                  {e.type || "Event"}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            No upcoming events
          </p>
        )}
      </div>
    </Card>
  );
}

function LoginActivityTable({ data }) {
  const logins = data?.loginActivity || [];

  if (logins.length === 0) {
    return (
      <Card>
        <SectionTitle
          icon={LogIn}
          title="Recent Login Activity"
          subtitle="Admin panel sign-ins"
        />
        <div className="px-5 pb-5 text-center text-sm text-slate-400 py-8">
          No login activity data available
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle
        icon={LogIn}
        title="Recent Login Activity"
        subtitle="Admin panel sign-ins"
      />
      <div className="overflow-x-auto pb-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-y border-slate-100">
              <th className="px-5 py-2.5 font-semibold">User</th>
              <th className="px-3 py-2.5 font-semibold">Role</th>
              <th className="px-3 py-2.5 font-semibold">Time</th>
              <th className="px-3 py-2.5 font-semibold">Browser</th>
              <th className="px-3 py-2.5 font-semibold">Device</th>
              <th className="px-5 py-2.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {logins.slice(0, 10).map((l, i) => (
              <tr
                key={i}
                className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-5 py-3 font-medium text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">
                      {getFlagEmoji(l.country)}
                    </span>{" "}
                    {l.user}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-500">{l.role || "—"}</td>
                <td className="px-3 py-3 text-slate-500 whitespace-nowrap">
                  {l.time}
                </td>
                <td className="px-3 py-3 text-slate-500">
                  {l.browser || "Unknown"}
                </td>
                <td className="px-3 py-3 text-slate-500">
                  {l.device || "Unknown"}
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                      l.status === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {l.status === "success" ? "Success" : l.status || "Unknown"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function NotificationsPanel() {
  // Static notifications - you can make these dynamic if your API provides them
  const notifications = [
    {
      icon: AlertTriangle,
      tint: "text-amber-500 bg-amber-50",
      title: "Storage almost full",
      desc: "Storage usage is approaching limits.",
      time: "Recently",
    },
    {
      icon: CheckCircle2,
      tint: "text-emerald-500 bg-emerald-50",
      title: "System running",
      desc: "All systems are operational.",
      time: "Now",
    },
  ];

  return (
    <Card>
      <SectionTitle
        icon={Bell}
        title="Notifications"
        right={
          <span className="text-[10px] font-bold text-white bg-rose-500 rounded-full px-1.5 py-0.5">
            {notifications.length}
          </span>
        }
      />
      <div className="px-5 pb-5 space-y-2.5">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-slate-100 p-3 hover:border-emerald-200 transition-colors"
          >
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.tint}`}
            >
              <n.icon size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-700">{n.title}</p>
              <p className="text-[11px] text-slate-500 leading-snug">
                {n.desc}
              </p>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0">
              {n.time}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ================================================================
   MAIN DASHBOARD
================================================================ */

export default function AdminDashboard() {
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const { data: dashboardResponse, isLoading: dashboardLoading } = useApiQuery({
    url: "/admin/dashboard",
  });

  const dashboardData = dashboardResponse?.data || {};

  // Update clock
  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // Handle loading state
  useEffect(() => {
    if (!dashboardLoading) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [dashboardLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto space-y-4 animate-pulse">
          <div className="h-28 bg-white rounded-2xl border border-slate-200" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-2xl border border-slate-200"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5">
            <div className="h-72 bg-white rounded-2xl border border-slate-200 xl:col-span-2" />
            <div className="h-72 bg-white rounded-2xl border border-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  const hasData = dashboardData && Object.keys(dashboardData).length > 0;
  const orgName = dashboardData?.welcome?.organization || "Organization";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto space-y-6">
        {hasData ? (
          <>
            <WelcomeSection data={dashboardData} />
            <StatsOverview data={dashboardData} />
            <VisitorAnalytics data={dashboardData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3.5">
              <div className="xl:col-span-2">
                <GeographySection data={dashboardData} />
              </div>
              <DeviceSection data={dashboardData} />
              <BrowserSection data={dashboardData} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
              <TrafficSources data={dashboardData} />
              <PopularContent data={dashboardData} />
            </div>

            <TopPagesTable data={dashboardData} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5">
              <div className="xl:col-span-2 space-y-3.5">
                <RecentVisitorsTable data={dashboardData} />
                <ModulePerformance data={dashboardData} />
                <StorageUsage data={dashboardData} />
              </div>
              <div className="space-y-3.5">
                <OnlineNow data={dashboardData} />
                <RecentActivities data={dashboardData} />
                <UpcomingEvents data={dashboardData} />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5">
              <SystemHealth data={dashboardData} />
              <div className="xl:col-span-2">
                <NotificationsPanel />
              </div>
            </div>

            <LoginActivityTable data={dashboardData} />

            <p className="text-center text-[11px] text-slate-400 pb-4">
              {orgName} — Admin Dashboard · Connected to /api/admin/dashboard
            </p>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No dashboard data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
