import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useApiQuery } from "@/hooks/useAppQuery";
/**
 * =====================================================================
 * GOLD RATES (Section) — goldapi.net live feed, 3 templates
 * =====================================================================
 * ONE live call to goldapi.net (XAU/USD spot, per troy ounce) powers
 * everything. Since goldapi only returns a single raw spot price, the
 * jewelry-style rows you see in the reference design (22K Scrap, Gold
 * 9999, Ten Tola Bar, Kilo Bar 995...) are DERIVED client-side from
 * that spot using standard purity + weight conversions, then converted
 * USD → AED. All of that is tunable via `settings` (see
 * DEFAULT_DERIVED_PRODUCTS / DEFAULT_USD_TO_AED below) — these are
 * close, standard approximations, not a guarantee of exact parity with
 * any specific dealer's board, since karat purity conventions and the
 * USD/AED rate you actually want may differ slightly.
 *
 * ⚠️ Two things worth remembering:
 * - The API key is sent from the browser (visible in devtools →
 *   Network). Fine for a prototype/internal tool; proxy through your
 *   own backend for a public production site.
 * - goldapi.net plans are rate-limited. Polling much faster than your
 *   plan allows will start erroring — the hook below just falls back
 *   to the last good price + a "Reconnecting" badge, it won't crash.
 * =====================================================================
 */

const GOLDAPI_BASE = "https://app.goldapi.net/api/price";

const TROY_OUNCE_GRAMS = 31.1034768;
const TOLA_GRAMS = 11.6638038;

// USD → AED is effectively fixed (AED is pegged to USD), but exposed
// as a setting in case you want to point this at another currency.
const DEFAULT_USD_TO_AED = 3.6725;

// Derived product board — each row = a purity fraction × a weight (in
// grams) applied to the per-gram 24K price. Edit freely, or pass your
// own list via settings.products.
const DEFAULT_DERIVED_PRODUCTS = [
  { id: "22k-scrap", name: "22K SCRAP", unit: "1 GM", grams: 1, purity: 0.916 },
  { id: "gold-9999", name: "GOLD 9999", unit: "1 GM", grams: 1, purity: 0.999 },
  {
    id: "ten-tola-bar",
    name: "TEN TOLA BAR",
    unit: "TTB",
    grams: 10 * TOLA_GRAMS,
    purity: 0.999,
  },
  {
    id: "kilo-bar-995",
    name: "KILO BAR 995",
    unit: "1 KG",
    grams: 1000,
    purity: 0.995,
  },
];

// ---------------------------------------------------------------------
// Fetch spot + derive product board
// ---------------------------------------------------------------------

function useLiveGoldSpot({
  apiKey,
  symbol = "XAU",
  currency = "usd",
  refreshMs = 800,
}) {
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [stale, setStale] = useState(false);

  const inFlightRef = useRef(false);
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  const fetchSpot = useCallback(async () => {
    if (!apiKey || inFlightRef.current) return;
    inFlightRef.current = true;

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(
        `${GOLDAPI_BASE}/${symbol}/${currency.toUpperCase()}`,
        {
          headers: { "x-api-key": apiKey },
          signal: controller.signal,
        },
      );
      if (!res.ok)
        throw new Error(`goldapi ${symbol}/${currency}: ${res.status}`);
      const data = await res.json();

      setSpot({
        bid: data.bid,
        ask: data.ask,
        price: data.price,
        high: data.high,
        low: data.low,
        currency: (data.currency || currency).toUpperCase(),
      });
      setError(null);
      setStale(false);
      setUpdatedAt(new Date());
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err);
        setStale(true);
      }
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [apiKey, symbol, currency]);

  useEffect(() => {
    fetchSpot();
    timerRef.current = setInterval(fetchSpot, refreshMs);
    return () => {
      clearInterval(timerRef.current);
      abortRef.current?.abort();
    };
  }, [fetchSpot, refreshMs]);

  return { spot, loading, error, updatedAt, stale };
}

/**
 * Turns a raw XAU/USD spot into the "board": the hero spot row plus
 * every derived AED product row.
 */
function useGoldBoard(
  spot,
  {
    usdToAed = DEFAULT_USD_TO_AED,
    products = DEFAULT_DERIVED_PRODUCTS,
    spotLabel = "Gold Oz",
  } = {},
) {
  return useMemo(() => {
    if (!spot) return [];

    const spotRow = {
      id: "spot",
      name: spotLabel,
      unit: "OZ",
      currency: spot.currency,
      bid: spot.bid,
      ask: spot.ask,
      price: spot.price,
      high: spot.high,
      low: spot.low,
    };

    const pricePerGram24kUsd = spot.ask / TROY_OUNCE_GRAMS;
    const pricePerGram24kAed = pricePerGram24kUsd * usdToAed;

    const derivedRows = products.map((p) => ({
      id: p.id,
      name: p.name,
      unit: p.unit,
      currency: "AED",
      ask: pricePerGram24kAed * p.purity * p.grams,
    }));

    return [spotRow, ...derivedRows];
  }, [spot, usdToAed, products, spotLabel]);
}

// Flags a value "up"/"down" for ~650ms right after it changes, so a
// row can flash a color without a full animation library.
function useTickFlash(value) {
  const [flash, setFlash] = useState(null);
  const prevRef = useRef(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (value == null) return;
    if (prevRef.current != null && value !== prevRef.current) {
      setFlash(value > prevRef.current ? "up" : "down");
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setFlash(null), 650);
    }
    prevRef.current = value;
    return () => clearTimeout(timeoutRef.current);
  }, [value]);

  return flash;
}

// ---------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------

const fmt = (n, opts = {}) =>
  Number.isFinite(n)
    ? n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...opts,
      })
    : "--";

const fmtTime = (d) =>
  d
    ? d.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

function RatesSkeleton({ dark = true }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl p-6",
        dark ? "bg-red-950/60" : "bg-slate-200/60",
      )}
    >
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-14 w-full animate-pulse rounded-md bg-white/10"
          />
        ))}
      </div>
    </div>
  );
}

function RatesError() {
  return (
    <div className="rounded-2xl border border-dashed border-red-400/40 bg-red-950/40 p-6 text-center text-sm text-red-200">
      Couldn't load the live gold rate right now.
    </div>
  );
}

// =======================================================================
// Ribbon family — redClassic + 3 palette variants of the same layout
// (reference design). One layout, swappable color palette.
// =======================================================================

const RibbonCorner = ({ colorClass }) => (
  <span
    className={cn("absolute left-0 top-0 h-4 w-4", colorClass)}
    style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
  />
);

// Palettes — container/row = the maroon-style body, hero = the metallic
// ribbon that holds the primary spot row. Names are never truncated.
const RIBBON_PALETTES = {
  redClassic: {
    container: "from-red-950 via-red-900 to-red-950",
    headerText: "text-red-100",
    liveLabel: "text-red-200/70",
    timeText: "text-red-200/60",
    ribbonCorner: "bg-red-950",
    hero: "from-amber-300 via-yellow-500 to-amber-600",
    heroName: "text-slate-900",
    heroSub: "text-slate-800",
    heroUp: "text-emerald-800",
    heroDown: "text-red-800",
    row: "from-red-800 via-red-850 to-red-950",
    rowText: "text-white",
    rowUp: "text-emerald-400",
    rowDown: "text-red-400",
  },
  emeraldClassic: {
    container: "from-emerald-950 via-emerald-900 to-emerald-950",
    headerText: "text-emerald-100",
    liveLabel: "text-emerald-200/70",
    timeText: "text-emerald-200/60",
    ribbonCorner: "bg-emerald-950",
    hero: "from-amber-300 via-yellow-500 to-amber-600",
    heroName: "text-slate-900",
    heroSub: "text-slate-800",
    heroUp: "text-emerald-800",
    heroDown: "text-red-800",
    row: "from-emerald-800 via-emerald-850 to-emerald-950",
    rowText: "text-white",
    rowUp: "text-emerald-300",
    rowDown: "text-red-400",
  },
  sapphireClassic: {
    container: "from-slate-950 via-blue-950 to-slate-950",
    headerText: "text-blue-100",
    liveLabel: "text-blue-200/70",
    timeText: "text-blue-200/60",
    ribbonCorner: "bg-blue-950",
    hero: "from-slate-200 via-slate-300 to-slate-400",
    heroName: "text-slate-900",
    heroSub: "text-slate-700",
    heroUp: "text-emerald-700",
    heroDown: "text-red-700",
    row: "from-blue-900 via-blue-850 to-slate-950",
    rowText: "text-white",
    rowUp: "text-emerald-400",
    rowDown: "text-red-400",
  },
  plumClassic: {
    container: "from-purple-950 via-fuchsia-950 to-purple-950",
    headerText: "text-purple-100",
    liveLabel: "text-purple-200/70",
    timeText: "text-purple-200/60",
    ribbonCorner: "bg-purple-950",
    hero: "from-rose-300 via-rose-400 to-amber-400",
    heroName: "text-slate-900",
    heroSub: "text-slate-800",
    heroUp: "text-emerald-800",
    heroDown: "text-red-800",
    row: "from-purple-800 via-purple-850 to-purple-950",
    rowText: "text-white",
    rowUp: "text-emerald-300",
    rowDown: "text-red-400",
  },
};

function RibbonRow({ rate, palette }) {
  const flash = useTickFlash(rate.ask);
  const color = flash === "down" ? palette.rowDown : palette.rowUp;

  return (
    <div className="relative">
      <RibbonCorner colorClass={palette.ribbonCorner} />
      <div
        className={cn(
          "grid grid-cols-4 items-center gap-2 rounded-tr-2xl rounded-bl-2xl bg-gradient-to-b px-4 py-4 sm:px-8",
          palette.row,
        )}
      >
        <span className={cn("text-sm font-bold sm:text-lg", palette.rowText)}>
          {rate.name}
        </span>
        <span
          className={cn(
            "text-center text-sm font-bold sm:text-lg",
            palette.rowText,
          )}
        >
          {rate.unit || "-"}
        </span>
        <span
          className={cn(
            "text-center text-sm font-bold sm:text-lg",
            palette.rowText,
          )}
        >
          {rate.currency}
        </span>
        <span
          className={cn(
            "text-right text-lg font-bold transition-colors duration-500 sm:text-2xl",
            color,
          )}
        >
          {fmt(rate.ask)}
        </span>
      </div>
    </div>
  );
}

function createRibbonTemplate(palette) {
  return function RibbonTemplate({ rates, updatedAt, stale }) {
    const [primary, ...rest] = rates;
    const flash = useTickFlash(primary?.ask);
    const priceColor = flash === "down" ? palette.heroDown : palette.heroUp;

    return (
      <div
        className={cn(
          "overflow-hidden rounded-2xl bg-gradient-to-b p-4 shadow-xl sm:p-6",
          palette.container,
        )}
      >
        <div className="mb-1 flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                stale ? "bg-red-300" : "bg-emerald-400",
              )}
            />
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-widest",
                palette.liveLabel,
              )}
            >
              {stale ? "Reconnecting" : "Live"}
            </span>
          </div>
          <span
            className={cn(
              "text-[10px] font-medium tracking-wide",
              palette.timeText,
            )}
          >
            {fmtTime(updatedAt)}
          </span>
        </div>

        <div
          className={cn(
            "mb-3 grid grid-cols-3 px-4 text-center text-xs font-semibold uppercase tracking-wide sm:text-sm",
            palette.headerText,
          )}
        >
          <span className="text-left">Product</span>
          <span>Bid (Sell)</span>
          <span>Ask (Buy)</span>
        </div>

        {primary && (
          <div className="relative mb-3">
            <RibbonCorner colorClass={palette.ribbonCorner} />
            <div
              className={cn(
                "grid grid-cols-3 items-center rounded-tr-2xl rounded-bl-2xl bg-gradient-to-b px-4 py-5 shadow-lg sm:px-8",
                palette.hero,
              )}
            >
              <span
                className={cn(
                  "text-lg font-extrabold sm:text-2xl",
                  palette.heroName,
                )}
              >
                {primary.name}
              </span>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-extrabold transition-colors duration-500 sm:text-3xl",
                    priceColor,
                  )}
                >
                  {fmt(primary.bid)}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[10px] font-semibold sm:text-xs",
                    palette.heroSub,
                  )}
                >
                  High : {fmt(primary.high)}
                </p>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-2xl font-extrabold transition-colors duration-500 sm:text-3xl",
                    priceColor,
                  )}
                >
                  {fmt(primary.ask)}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[10px] font-semibold sm:text-xs",
                    palette.heroSub,
                  )}
                >
                  Low : {fmt(primary.low)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {rest.map((rate) => (
            <RibbonRow key={rate.id} rate={rate} palette={palette} />
          ))}
        </div>
      </div>
    );
  };
}

const RedClassicTemplate = createRibbonTemplate(RIBBON_PALETTES.redClassic);
const EmeraldClassicTemplate = createRibbonTemplate(
  RIBBON_PALETTES.emeraldClassic,
);
const SapphireClassicTemplate = createRibbonTemplate(
  RIBBON_PALETTES.sapphireClassic,
);
const PlumClassicTemplate = createRibbonTemplate(RIBBON_PALETTES.plumClassic);

// =======================================================================
// Template 2: darkShine — sleek dark/gold minimal table
// =======================================================================

function DarkShineTemplate({ rates, updatedAt, stale }) {
  const [primary, ...rest] = rates;
  const flash = useTickFlash(primary?.ask);
  const bidColor = flash === "down" ? "text-red-400" : "text-amber-400";
  const askColor = flash === "down" ? "text-red-400" : "text-emerald-400";

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-amber-500/20 bg-black/30 px-6 py-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              stale
                ? "bg-red-400"
                : "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",
            )}
          />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-300/60">
            {stale ? "Reconnecting" : "Live"}
          </span>
        </div>
        <span className="text-[10px] tracking-wide text-slate-500">
          {fmtTime(updatedAt)}
        </span>
      </div>

      <div className="grid grid-cols-3 border-b border-amber-500/20 px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-amber-300/80">
        <span className="text-left">Product</span>
        <span>Bid</span>
        <span>Ask</span>
      </div>

      {primary && (
        <div className="relative overflow-hidden border-b border-amber-500/10 px-6 py-6">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-400/10 to-transparent [animation:shine_3s_infinite]" />
          <div className="relative grid grid-cols-3 items-center">
            <span className="text-xl font-extrabold text-white sm:text-2xl">
              {primary.name}
            </span>
            <div className="text-center">
              <p
                className={cn(
                  "text-2xl font-extrabold transition-colors duration-500 sm:text-3xl",
                  bidColor,
                )}
              >
                {fmt(primary.bid)}
              </p>
              <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                High {fmt(primary.high)}
              </p>
            </div>
            <div className="text-center">
              <p
                className={cn(
                  "text-2xl font-extrabold transition-colors duration-500 sm:text-3xl",
                  askColor,
                )}
              >
                {fmt(primary.ask)}
              </p>
              <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                Low {fmt(primary.low)}
              </p>
            </div>
          </div>
          <style>{`
            @keyframes shine {
              0% { transform: translateX(-100%); }
              60% { transform: translateX(150%); }
              100% { transform: translateX(150%); }
            }
          `}</style>
        </div>
      )}

      <div className="divide-y divide-white/5">
        {rest.map((rate) => (
          <DarkShineRow key={rate.id} rate={rate} />
        ))}
      </div>
    </div>
  );
}

function DarkShineRow({ rate }) {
  const flash = useTickFlash(rate.ask);
  const color = flash === "down" ? "text-red-400" : "text-emerald-400";

  return (
    <div className="grid grid-cols-4 items-center gap-2 px-6 py-3.5 transition-colors hover:bg-white/[0.03]">
      <span className="text-sm font-semibold text-slate-200 sm:text-base">
        {rate.name}
      </span>
      <span className="text-center text-xs text-slate-400 sm:text-sm">
        {rate.unit || "-"}
      </span>
      <span className="text-center text-xs text-slate-400 sm:text-sm">
        {rate.currency}
      </span>
      <span
        className={cn(
          "text-right text-base font-bold transition-colors duration-500 sm:text-lg",
          color,
        )}
      >
        {fmt(rate.ask)}
      </span>
    </div>
  );
}

// =======================================================================
// Template 3: assayStamp — hallmark dial + depth gauge (signature look)
// =======================================================================

function AssayStamp({ rate }) {
  const flash = useTickFlash(rate.price ?? rate.ask);

  const priceColor =
    flash === "up"
      ? "text-[#3FA873]"
      : flash === "down"
        ? "text-[#E3897E]"
        : "text-[#F4EEDD]";

  const range = Math.max(
    (rate.high ?? rate.ask) - (rate.low ?? rate.bid ?? 0),
    0.01,
  );
  const pct = Math.min(
    100,
    Math.max(0, (((rate.price ?? rate.ask) - (rate.low ?? 0)) / range) * 100),
  );

  return (
    <div className="relative">
      <div className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-full border border-[#C9A227]/25 sm:h-64 sm:w-64">
        <div className="absolute inset-3 rounded-full border border-[#C9A227]/15" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 360) / 36;
            const major = i % 9 === 0;
            return (
              <line
                key={i}
                x1="100"
                y1={major ? "8" : "12"}
                x2="100"
                y2="18"
                stroke="#C9A227"
                strokeOpacity={major ? 0.55 : 0.2}
                strokeWidth={major ? 1.4 : 1}
                transform={`rotate(${angle} 100 100)`}
              />
            );
          })}
        </svg>

        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C9A227]/80">
            {rate.name}
          </span>
          <span
            className={cn(
              "mt-2 font-serif text-4xl font-semibold tabular-nums transition-colors duration-500 sm:text-5xl",
              priceColor,
            )}
            style={{ fontFamily: "'Fraunces', 'Georgia', serif" }}
          >
            {fmt(rate.price ?? rate.ask)}
          </span>
          <span className="mt-1 font-mono text-[11px] tracking-widest text-[#8A8271]">
            {rate.currency} / {rate.unit || "OZ"}
          </span>
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 divide-x divide-[#C9A227]/15 rounded-2xl border border-[#C9A227]/15 bg-white/[0.02]">
        <div className="px-4 py-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8271]">
            Bid
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-[#F4EEDD]">
            {fmt(rate.bid)}
          </p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8271]">
            Ask
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-[#F4EEDD]">
            {fmt(rate.ask)}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-sm px-2">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8271]">
          <span>Low {fmt(rate.low)}</span>
          <span>High {fmt(rate.high)}</span>
        </div>
        <div className="relative mt-2 h-1.5 rounded-full bg-white/5">
          <div className="h-full rounded-full bg-gradient-to-r from-[#C1443C] via-[#C9A227] to-[#3FA873] opacity-40" />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#0B0D10] bg-[#E8C468] shadow-[0_0_8px_rgba(232,196,104,0.7)] transition-all duration-500"
            style={{ left: `calc(${pct}% - 6px)` }}
          />
        </div>
      </div>
    </div>
  );
}

function TickerRow({ rate }) {
  const flash = useTickFlash(rate.ask);
  const color =
    flash === "up"
      ? "text-[#3FA873]"
      : flash === "down"
        ? "text-[#E3897E]"
        : "text-[#F4EEDD]";

  return (
    <div className="flex items-center justify-between border-t border-[#C9A227]/10 px-1 py-3 first:border-t-0">
      <div className="flex flex-col">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C9BFAE]">
          {rate.name}
        </span>
        {rate.unit && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8271]">
            {rate.unit}
          </span>
        )}
      </div>
      <span
        className={cn(
          "font-mono text-sm font-semibold transition-colors duration-500",
          color,
        )}
      >
        {rate.currency} {fmt(rate.ask)}
      </span>
    </div>
  );
}

function AssayStampTemplate({ rates, updatedAt, stale }) {
  const [primary, ...rest] = rates;
  if (!primary) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#C9A227]/15 bg-[#0B0D10] px-6 py-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:px-10 sm:py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(201,162,39,0.10) 0%, rgba(11,13,16,0) 70%)",
        }}
      />

      <div className="relative mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              stale
                ? "bg-[#E3897E]"
                : "bg-[#3FA873] shadow-[0_0_6px_rgba(63,168,115,0.9)]",
            )}
          >
            <span
              className={cn(
                "block h-full w-full rounded-full",
                !stale && "animate-ping bg-[#3FA873]/70",
              )}
            />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C9BFAE]">
            {stale ? "Reconnecting" : "Live spot"}
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-widest text-[#8A8271]">
          {fmtTime(updatedAt)}
        </span>
      </div>

      <div className="relative">
        <AssayStamp rate={primary} />
      </div>

      {rest.length > 0 && (
        <div className="relative mx-auto mt-10 max-w-sm">
          {rest.map((rate) => (
            <TickerRow key={rate.id} rate={rate} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Registry + section wrapper
// ---------------------------------------------------------------------

// =======================================================================
// Template: minimalLight — clean fintech-style light card
// =======================================================================

function MinimalLightTemplate({ rates, updatedAt, stale }) {
  const [primary, ...rest] = rates;
  const flash = useTickFlash(primary?.ask);
  const heroColor =
    flash === "up"
      ? "text-emerald-600"
      : flash === "down"
        ? "text-rose-600"
        : "text-slate-900";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              stale ? "bg-rose-400" : "bg-emerald-500",
            )}
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {stale ? "Reconnecting" : "Live"}
          </span>
        </div>
        <span className="text-[11px] tracking-wide text-slate-400">
          {fmtTime(updatedAt)}
        </span>
      </div>

      {primary && (
        <div className="flex flex-wrap items-end justify-between gap-4 px-6 py-6">
          <div>
            <p className="text-sm font-medium text-slate-500">{primary.name}</p>
            <p
              className={cn(
                "mt-1 text-4xl font-bold tabular-nums transition-colors duration-500 sm:text-5xl",
                heroColor,
              )}
            >
              {fmt(primary.ask)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {primary.currency} · Bid {fmt(primary.bid)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 text-xs">
            <span className="rounded-full bg-slate-50 px-2.5 py-1 font-medium text-slate-500">
              High {fmt(primary.high)}
            </span>
            <span className="rounded-full bg-slate-50 px-2.5 py-1 font-medium text-slate-500">
              Low {fmt(primary.low)}
            </span>
          </div>
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {rest.map((rate) => (
          <MinimalLightRow key={rate.id} rate={rate} />
        ))}
      </div>
    </div>
  );
}

function MinimalLightRow({ rate }) {
  const flash = useTickFlash(rate.ask);
  const color =
    flash === "up"
      ? "text-emerald-600"
      : flash === "down"
        ? "text-rose-600"
        : "text-slate-900";

  return (
    <div className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-slate-50/80">
      <div>
        <p className="text-sm font-medium text-slate-700">{rate.name}</p>
        <p className="text-xs text-slate-400">{rate.unit}</p>
      </div>
      <p
        className={cn(
          "text-sm font-semibold tabular-nums transition-colors duration-500",
          color,
        )}
      >
        {rate.currency} {fmt(rate.ask)}
      </p>
    </div>
  );
}

// =======================================================================
// Template: chalkboard — hand-chalked jewelry-shop board
// =======================================================================

function ChalkboardTemplate({ rates, updatedAt, stale }) {
  const [primary, ...rest] = rates;
  const flash = useTickFlash(primary?.ask);
  const priceColor = flash === "down" ? "text-rose-300" : "text-amber-200";

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-[6px] border-[#3b2b20] bg-[#1f3d2e] p-6 shadow-2xl sm:p-8"
      style={{ fontFamily: "'Segoe Print', 'Comic Sans MS', cursive" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative mb-4 flex items-center justify-between text-[#d7e4d9]/70">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              stale ? "bg-rose-300" : "bg-amber-200",
            )}
          />
          <span className="text-xs uppercase tracking-wide">
            {stale ? "reconnecting..." : "live rates"}
          </span>
        </div>
        <span className="text-xs">{fmtTime(updatedAt)}</span>
      </div>

      {primary && (
        <div className="relative mb-6 rounded-xl border-2 border-dashed border-[#d7e4d9]/40 px-5 py-5 text-center">
          <p className="text-lg text-[#d7e4d9]/80">{primary.name}</p>
          <p
            className={cn(
              "mt-1 text-5xl font-bold transition-colors duration-500",
              priceColor,
            )}
          >
            {fmt(primary.ask)}
          </p>
          <p className="mt-2 text-xs text-[#d7e4d9]/60">
            Bid {fmt(primary.bid)} &nbsp;·&nbsp; High {fmt(primary.high)}{" "}
            &nbsp;·&nbsp; Low {fmt(primary.low)}
          </p>
        </div>
      )}

      <div className="relative space-y-2">
        {rest.map((rate) => (
          <ChalkboardRow key={rate.id} rate={rate} />
        ))}
      </div>
    </div>
  );
}

function ChalkboardRow({ rate }) {
  const flash = useTickFlash(rate.ask);
  const color = flash === "down" ? "text-rose-300" : "text-amber-200";

  return (
    <div className="flex items-center justify-between border-b border-dashed border-[#d7e4d9]/25 pb-2 text-[#d7e4d9]">
      <span className="text-base">
        {rate.name}{" "}
        <span className="text-xs text-[#d7e4d9]/50">({rate.unit})</span>
      </span>
      <span
        className={cn(
          "text-lg font-semibold transition-colors duration-500",
          color,
        )}
      >
        {rate.currency} {fmt(rate.ask)}
      </span>
    </div>
  );
}

// =======================================================================
// Template: neonTicker — black/neon cyberpunk stock-ticker
// =======================================================================

function NeonTickerTemplate({ rates, updatedAt, stale }) {
  const [primary, ...rest] = rates;
  const flash = useTickFlash(primary?.ask);
  const priceColor = flash === "down" ? "text-[#ff2b6d]" : "text-[#39ff88]";

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#39ff88]/30 bg-black p-6 shadow-[0_0_40px_rgba(57,255,136,0.08)] sm:p-8"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #39ff88 0px, #39ff88 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              stale ? "bg-[#ff2b6d]" : "bg-[#39ff88] shadow-[0_0_8px_#39ff88]",
            )}
          />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#39ff88]/70">
            {stale ? "SIGNAL LOST" : "LIVE FEED"}
          </span>
        </div>
        <span className="text-[10px] tracking-widest text-[#39ff88]/50">
          {fmtTime(updatedAt)}
        </span>
      </div>

      {primary && (
        <div className="relative mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#39ff88]/60">
            {primary.name}
          </p>
          <p
            className={cn(
              "mt-2 text-5xl font-bold tabular-nums transition-colors duration-500 sm:text-6xl",
              priceColor,
            )}
            style={{ textShadow: "0 0 12px currentColor" }}
          >
            {fmt(primary.ask)}
          </p>
          <p className="mt-2 text-[10px] tracking-widest text-[#39ff88]/50">
            BID {fmt(primary.bid)} // HIGH {fmt(primary.high)} // LOW{" "}
            {fmt(primary.low)}
          </p>
        </div>
      )}

      <div className="relative space-y-1.5">
        {rest.map((rate) => (
          <NeonTickerRow key={rate.id} rate={rate} />
        ))}
      </div>
    </div>
  );
}

function NeonTickerRow({ rate }) {
  const flash = useTickFlash(rate.ask);
  const color = flash === "down" ? "text-[#ff2b6d]" : "text-[#39ff88]";

  return (
    <div className="flex items-center justify-between border border-[#39ff88]/10 bg-[#39ff88]/[0.03] px-4 py-2.5">
      <span className="text-xs uppercase tracking-wider text-[#39ff88]/70">
        {rate.name} <span className="text-[#39ff88]/40">{rate.unit}</span>
      </span>
      <span
        className={cn(
          "text-sm font-semibold transition-colors duration-500",
          color,
        )}
        style={{ textShadow: "0 0 6px currentColor" }}
      >
        {rate.currency} {fmt(rate.ask)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------
// Registry + section wrapper
// ---------------------------------------------------------------------

const TEMPLATES = {
  redClassic: RedClassicTemplate,
  emeraldClassic: EmeraldClassicTemplate,
  sapphireClassic: SapphireClassicTemplate,
  plumClassic: PlumClassicTemplate,
  darkShine: DarkShineTemplate,
  assayStamp: AssayStampTemplate,
  minimalLight: MinimalLightTemplate,
  chalkboard: ChalkboardTemplate,
  neonTicker: NeonTickerTemplate,
};

const GoldRatesSectionRenderer = ({
  template = "redClassic",
  content = {},
  settings = {},
  styles = {},
}) => {
  const { data: settingResponse, isLoading: settingLoading } = useApiQuery({
    url: `/client/settings`,
  });

  const businessSettings = settingResponse?.data?.data || {};

  const apiKey = businessSettings?.api_key; //settings?.apiKey; // settings?.apiKey || "6b6fa9cc-bc53-4cbd-aaa9-79cca811ffea";
  const symbol = settings?.symbol || "XAU";
  const currency = settings?.currency || "usd";

  console.log("Client frontend - ",{
    businessSettings,
    apiKey
  })

  const { spot, loading, error, updatedAt, stale } = useLiveGoldSpot({
    apiKey,
    symbol,
    currency,
    // Requested: refresh faster than once a second. Tune via
    // settings.refreshInterval — see the rate-limit note up top first.
    refreshMs: settings?.refreshInterval || 800,
  });

  const rates = useGoldBoard(spot, {
    usdToAed: settings?.usdToAed ?? DEFAULT_USD_TO_AED,
    products: settings?.products || DEFAULT_DERIVED_PRODUCTS,
    spotLabel: settings?.spotLabel || "Gold Oz",
  });

  if(!apiKey){
    return (
      <div className="rounded border border-dashed p-6 text-center text-xs text-muted-foreground">
        Missing the api key. Add form api key form setting.
      </div>
    )
  }

  const Template = TEMPLATES[template];

  if (!Template) {
    return (
      <div className="rounded border border-dashed p-6 text-center text-xs text-muted-foreground">
        Missing gold-rate template: {template}
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto  py-12"
      style={{
        backgroundColor: styles?.sectionBG || undefined,
        color: styles?.sectionTextColor || undefined,
        paddingTop: `${styles?.sectionPaddingY ?? 0}px`,
        paddingBottom: `${styles?.sectionPaddingY ?? 0}px`,
        paddingLeft: `${styles?.paddingX ?? 0}px`,
        paddingRight: `${styles?.paddingX ?? 0}px`,
      }}
    >
      <div className="mx-auto w-full">
        {(content.title || content.subtitle) && (
          <div className="mb-6 text-center">
            {content.title && (
              <h2 className="text-2xl font-semibold text-slate-100">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="mt-1 text-sm text-slate-400">{content.subtitle}</p>
            )}
          </div>
        )}

        {loading && rates.length === 0 ? (
          <RatesSkeleton dark={template !== "minimalLight"} />
        ) : error && rates.length === 0 ? (
          <RatesError />
        ) : (
          <Template rates={rates} updatedAt={updatedAt} stale={stale} />
        )}
      </div>
    </div>
  );
};

export default GoldRatesSectionRenderer;
