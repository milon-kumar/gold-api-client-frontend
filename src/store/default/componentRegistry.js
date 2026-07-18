/**
 * =====================================================================
 * COMPONENT REGISTRY  (Single Source of Truth)
 * =====================================================================
 * পুরো Page Builder এই Configuration পড়ে চলে।
 *
 * নতুন Component / Type / Template / Field যোগ করতে চাইলে
 * শুধু এখানে একটি Object যোগ করুন — Builder-এর কোনো কোড
 * পরিবর্তন করতে হবে না।
 *
 * Field Definition Shape:
 * {
 *   key:      "title",             // content / settings / styles-এর ভিতরের key
 *   label:    "Title",             // Property Panel-এ যে Label দেখাবে
 *   type:     "text",              // text | textarea | number | boolean |
 *                                  // color | image | select | array
 *   group:    "content",           // "content" (default) | "settings" | "style"
 *   default:  "...",               // component add করলে এই value বসবে
 *   options:  [{label, value}],    // শুধু select-এর জন্য
 *   itemFields: [...fields],       // শুধু array-এর জন্য (repeater item)
 *   min, max, step,                // number-এর জন্য (optional)
 *   placeholder: "...",            // optional
 *   sourceKeys: ["slider"]         // array field-এ "Pick" button আসবে —
 *                                  // existing CRUD data থেকে item add করা যাবে
 * }
 *
 * Template Definition-এ অতিরিক্ত:
 *   sourceKeys: ["information"]    // Property Panel-এ "Select from existing"
 *                                  // button আসবে — একটি record pick করলে
 *                                  // পুরো content ভরে যাবে (এরপরও editable)
 * (Data source গুলোর সংজ্ঞা: config/dataSources.js)
 * =====================================================================
 */

/* ---------- Reusable field snippets (DRY) ---------- */

const autoplayFields = [
  {
    key: "showContent",
    label: "Show content on image",
    type: "boolean",
    group: "settings",
    default: false,
  },
  {
    key: "autoplay",
    label: "Auto Play",
    type: "boolean",
    group: "settings",
    default: true,
  },
  {
    key: "speed",
    label: "Speed (ms)",
    type: "number",
    group: "settings",
    default: 3000,
    min: 500,
    step: 100,
  },
];

const carouselStyles = [
  {
    key: "imageHeight",
    label: "Set Image Height",
    type: "slider",
    group: "style",
    default: "700",
    min: 600,
    max: 700,
    step: 5,
  },
];

const navPagFields = [
  {
    key: "navigation",
    label: "Navigation Arrows",
    type: "boolean",
    group: "settings",
    default: true,
  },
  {
    key: "pagination",
    label: "Pagination Dots",
    type: "boolean",
    group: "settings",
    default: true,
  },
];

const slideFields = [
  { key: "title", label: "Slide Title", type: "text", default: "Slide title" },
  { key: "subtitle", label: "Slide Subtitle", type: "text", default: "" },
  { key: "image", label: "Slide Image", type: "image", default: "" },
  { key: "buttonText", label: "Button Text", type: "text", default: "" },
  { key: "buttonLink", label: "Button Link", type: "text", default: "" },
];

/* =====================================================================
 * REGISTRY
 * =================================================================== */

export const COMPONENT_REGISTRY = {
  /* ================================================================
   * 1. HERO
   * ============================================================== */
  hero: {
    label: "Hero",
    icon: "Sparkles",
    renderer: "hero", // renderers/index.js এর RENDERERS map-এর key
    defaultType: "banner",
    types: {
      /* -------------------- Banner -------------------- */
      banner: {
        label: "Banner",
        defaultTemplate: "classicBanner",
        templates: {
          classicBanner: {
            label: "Classic Banner",
            fields: [
              {
                key: "slogan",
                label: "Slogan",
                type: "text",
                default: "Welcome",
              },
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Build Your Future",
              },
              {
                key: "subtitle",
                label: "Subtitle",
                type: "text",
                default: "Simple, modern, and powerful solutions.",
              },
              {
                key: "primayButtonTitle",
                label: "Primary Button Title",
                type: "text",
                default: "Get Started",
              },
              {
                key: "primayButtonLink",
                label: "Primary Button Link",
                type: "text",
                default: "/about",
              },
              {
                key: "seconderyButtonTitle",
                label: "Secondary Button Title",
                type: "text",
                default: "Learn More",
              },
              {
                key: "seconderyButtonLink",
                label: "Secondary Button Link",
                type: "text",
                default: "/contact",
              },
              {
                key: "items",
                label: "Items",
                type: "array",
                default: [],
                itemFields: [
                  {
                    key: "count",
                    label: "Count",
                    type: "text",
                    default: "1",
                  },
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "Default",
                  },
                ],
              },
            ],
          },
          stellarBanner: {
            label: "Stellar Banner",
            fields: [
              {
                key: "slogan",
                label: "Slogan",
                type: "text",
                default: "Welcome",
              },
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Build Your Future",
              },
              {
                key: "subtitle",
                label: "Subtitle",
                type: "text",
                default: "Simple, modern, and powerful solutions.",
              },
              {
                key: "primaryButtonTitle",
                label: "Primary Button Title",
                type: "text",
                default: "Get Started",
              },
              {
                key: "primaryButtonLink",
                label: "Primary Button Link",
                type: "text",
                default: "/about",
              },
              {
                key: "secondaryButtonTitle",
                label: "Secondary Button Title",
                type: "text",
                default: "Learn More",
              },
              {
                key: "secondaryButtonLink",
                label: "Secondary Button Link",
                type: "text",
                default: "/contact",
              },
              {
                key: "items",
                label: "Items",
                type: "array",
                default: [],
                itemFields: [
                  {
                    key: "count",
                    label: "Count",
                    type: "text",
                    default: "1",
                  },
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "Default",
                  },
                ],
              },
            ],
          },
          gradentBanner: {
            label: "Gradent Banner",
            fields: [
              {
                key: "slogan",
                label: "Slogan",
                type: "text",
                default: "Welcome",
              },
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Build Your Future",
              },
              {
                key: "subtitle",
                label: "Subtitle",
                type: "text",
                default: "Simple, modern, and powerful solutions.",
              },
              {
                key: "primayButtonTitle",
                label: "Primary Button Title",
                type: "text",
                default: "Get Started",
              },
              {
                key: "primayButtonLink",
                label: "Primary Button Link",
                type: "text",
                default: "/about",
              },
              {
                key: "seconderyButtonTitle",
                label: "Secondary Button Title",
                type: "text",
                default: "Learn More",
              },
              {
                key: "seconderyButtonLink",
                label: "Secondary Button Link",
                type: "text",
                default: "/contact",
              },
              {
                key: "rightSecOneStats",
                label: "Stats Items",
                type: "array",
                default: [],
                itemFields: [
                  {
                    key: "count",
                    label: "Count",
                    type: "text",
                    default: "1",
                  },
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "Default",
                  },
                ],
              },
              {
                key: "rightSecOneIcon",
                label: "Card one icon",
                type: "text",
                default: "Check",
              },
              {
                key: "rightSecOneTitle",
                label: "Card one Title",
                type: "text",
                default: "Regular publications",
              },
              {
                key: "rightSecOneSubTitle",
                label: "Card one Sub Title",
                type: "text",
                default: "Monthly magazines and Islamic literature",
              },

              {
                key: "rightSecTwoIcon",
                label: "Card tow icon",
                type: "text",
                default: "Calendar",
              },
               {
                key: "rightSecTwoHeaderTitle",
                label: "Card tow header title",
                type: "text",
                default: "Upcoming events",
              },
               {
                key: "rightSecTwoHeaderBadge",
                label: "Card tow header badge",
                type: "text",
                default: "Registration is ongoing.",
              },
              {
                key: "rightSecTowTitle",
                label: "Card one Title",
                type: "text",
                default: "Annual Tablighi Ijtema 2027",
              },
              {
                key: "rightSecTowItems",
                label: "Section Items",
                type: "array",
                default: [],
                itemFields: [
                  {
                    key: "icon",
                    label: "Icon",
                    type: "text",
                    default: "CircleCheck",
                  },
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "Default",
                  },
                ],
              },
              {
                key: "rightSecTowFooterIcon",
                label: "Card one icon",
                type: "text",
                default: "Check",
              },
              {
                key: "rightSecTowFooterTitle",
                label: "Card two footer title",
                type: "text",
                default: "A gathering of millions of people from home and abroad",
              },
              {
                key: "rightSecThreeIcon",
                label: "Card one icon",
                type: "text",
                default: "Check",
              },
              {
                key: "rightSecThreeTitle",
                label: "Card the Title",
                type: "text",
                default: "Big family",
              },
              {
                key: "rightSecThreeSubTitle",
                label: "Card three sub title",
                type: "text",
                default: "Millions of members and well-wishers",
              },
              {
                key: "rightSecThreeDescription",
                label: "Card three description",
                type: "text",
                default: "Connected from all over the country",
              },
              {
                key: "bottomTickerItems",
                label: "Ticker Items (input items by coma [,] seperated)",
                type: "text",
                default: "",
              },
              {
                key: "showCardOne",
                label: "Show card one (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
              },
              {
                key: "showCardTow",
                label: "Show card two (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
              },
              {
                key: "showCardThree",
                label: "Show card Three (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
              },
            ],
          },
          auroraBanner: {
            label: "Aurora Banner",
            fields: [
              {
                key: "slogan",
                label: "Slogan",
                type: "text",
                default: "Welcome",
              },
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Build Your Future",
              },
              {
                key: "subtitle",
                label: "Subtitle",
                type: "text",
                default: "Simple, modern, and powerful solutions.",
              },
              {
                key: "primayButtonTitle",
                label: "Primary Button Title",
                type: "text",
                default: "Get Started",
              },
              {
                key: "primayButtonLink",
                label: "Primary Button Link",
                type: "text",
                default: "/about",
              },
              {
                key: "seconderyButtonTitle",
                label: "Secondary Button Title",
                type: "text",
                default: "Learn More",
              },
              {
                key: "seconderyButtonLink",
                label: "Secondary Button Link",
                type: "text",
                default: "/contact",
              },
              {
                key: "items",
                label: "Items",
                type: "array",
                default: [],
                itemFields: [
                  {
                    key: "count",
                    label: "Count",
                    type: "text",
                    default: "1",
                  },
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "Default",
                  },
                ],
              },
            ],
          },
        },
      },

      /* -------------------- Carousel -------------------- */
      carousel: {
        label: "Carousel",
        defaultTemplate: "classicCarousel",
        templates: {
          classicCarousel: {
            label: "Classic Carousel",
            fields: [
              {
                key: "slides",
                label: "Slides",
                type: "array",
                default: [],
                sourceKeys: ["slider", "photo", "video"],
                itemFields: [
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "Item",
                  },
                  {
                    key: "description",
                    label: "Description",
                    type: "textarea",
                    default: "",
                  },
                  { key: "image", label: "Image", type: "image", default: "" },
                ],
              },
              ...autoplayFields,
              ...carouselStyles,
            ],
          },
          simpleCarousel: {
            label: "Simple Carousel",
            fields: [
              {
                key: "slides",
                label: "Slides",
                type: "array",
                default: [],
                sourceKeys: ["slider", "image"],
                itemFields: [
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "Slide",
                  },
                  { key: "image", label: "Image", type: "image", default: "" },
                ],
              },
              ...autoplayFields,
            ],
          },
          modernCarousel: {
            label: "Modern Carousel",
            fields: [
              {
                key: "slides",
                label: "Slides",
                type: "array",
                default: [],
                itemFields: slideFields,
                sourceKeys: ["slider"],
              },
              ...autoplayFields,
              ...navPagFields,
            ],
          },
          imageCarousel: {
            label: "Image Carousel",
            fields: [
              {
                key: "images",
                label: "Images",
                type: "array",
                default: [],
                sourceKeys: ["images", "sliders"],
                itemFields: [
                  { key: "image", label: "Image", type: "image", default: "" },
                ],
              },
              ...autoplayFields,
            ],
          },
          immersiveSlider: {
            label: "Immersive Slider",
            fields: [
              {
                key: "slides",
                label: "Slides",
                type: "array",
                default: [],
                itemFields: slideFields,
                sourceKeys: ["slider"],
              },
              ...autoplayFields,
              {
                key: "height",
                label: "Height (px)",
                type: "number",
                group: "settings",
                default: 520,
                min: 240,
                max: 1000,
              },
            ],
          },
          simpleImageSlider: {
            label: "Simple Image Slider",
            fields: [
              {
                key: "slides",
                label: "Slides",
                type: "array",
                default: [],
                sourceKeys: ["slider", "image"],
                itemFields: [
                  { key: "image", label: "Image", type: "image", default: "" },
                ],
              },
              ...autoplayFields,
              ...navPagFields,
              {
                key: "loop",
                label: "Loop",
                type: "boolean",
                group: "settings",
                default: true,
              },
              {
                key: "height",
                label: "Height (px)",
                type: "number",
                group: "settings",
                default: 400,
                min: 160,
                max: 900,
              },
            ],
          },
        },
      },
    },
  },

  /* ================================================================
   * 2. INFORMATION  (একটাই type — UI-তে Type selector hide থাকবে)
   * ============================================================== */
  information: {
    label: "Information",
    icon: "Info",
    renderer: "information",
    defaultType: "default",
    types: {
      default: {
        label: "Default",
        defaultTemplate: "simple",
        templates: {
          simple: {
            label: "Simple",
            sourceKeys: ["information"],
            fields: [
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "About us",
              },
              {
                key: "description",
                label: "Description",
                type: "textarea",
                default: "",
              },
              { key: "image", label: "Image", type: "image", default: "" },
            ],
          },
          modern: {
            label: "Modern",
            sourceKeys: ["information"],
            fields: [
              { key: "badge", label: "Badge", type: "text", default: "Why us" },
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "A modern headline",
              },
              {
                key: "description",
                label: "Description",
                type: "textarea",
                default: "",
              },
              { key: "image", label: "Image", type: "image", default: "" },
              {
                key: "accentColor",
                label: "Accent Color",
                type: "color",
                group: "style",
                default: "#2563eb",
              },
              {
                key: "sectionHeaderBadge",
                label: "Section header badge varients",
                type: "radio",
                group: "settings",
                default: "glow",
                options: [
                  { label: "Soft", value: "soft" },
                  { label: "Outline", value: "outline" },
                  { label: "Dot", value: "dot" },
                  { label: "Gradient", value: "gradient" },
                  { label: "Glow", value: "glow" },
                  { label: "Glass", value: "glass" },
                  { label: "Gold", value: "gold" },
                  { label: "Line", value: "line" },
                ],
              },
            ],
          },
          founder: {
            label: "Founder",
            sourceKeys: ["information"],
            fields: [
              {
                key: "founderName",
                label: "Founder Name",
                type: "text",
                default: "John Doe",
              },
              {
                key: "founderImage",
                label: "Founder Image",
                type: "image",
                default: "",
              },
              {
                key: "message",
                label: "Message",
                type: "textarea",
                default: "",
              },
              {
                key: "designation",
                label: "Designation",
                type: "text",
                default: "CEO & Founder",
              },
            ],
          },
          imageLeft: {
            label: "Image Left",
            sourceKeys: ["information"],
            fields: [
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Side by side",
              },
              {
                key: "description",
                label: "Description",
                type: "textarea",
                default: "",
              },
              { key: "image", label: "Image", type: "image", default: "" },
              {
                key: "buttonText",
                label: "Button Text",
                type: "text",
                default: "",
              },
              {
                key: "buttonLink",
                label: "Button Link",
                type: "text",
                default: "#",
              },
            ],
          },
          imageRight: {
            label: "Image Right",
            sourceKeys: ["information"],
            fields: [
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Side by side",
              },
              {
                key: "description",
                label: "Description",
                type: "textarea",
                default: "",
              },
              { key: "image", label: "Image", type: "image", default: "" },
              {
                key: "buttonText",
                label: "Button Text",
                type: "text",
                default: "",
              },
              {
                key: "buttonLink",
                label: "Button Link",
                type: "text",
                default: "#",
              },
            ],
          },
        },
      },
    },
  },

  /* ================================================================
   * 3. LIST
   * ============================================================== */
  list: {
    label: "List",
    icon: "List",
    renderer: "list",
    defaultType: "default",
    types: {
      default: {
        label: "Default",
        defaultTemplate: "cardGrid",
        templates: {
          cardGrid: {
            label: "Card Grid",
            fields: [
              { key: "badge", label: "Badge", type: "text", default: "" },
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Our services",
              },
              { key: "subtitle", label: "Subtitle", type: "text", default: "" },
              {
                key: "items",
                label: "Items",
                type: "array",
                default: [],
                sourceKeys: [
                  "staff",
                  "organization",
                  "photo",
                  "anual_plan",
                  "regular_activities",
                  "archives",
                  "video",
                ],
                itemFields: [
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "Item",
                  },
                  {
                    key: "sub_title",
                    label: "Sub Title",
                    type: "text",
                    default: "Item",
                  },
                  {
                    key: "sub_description",
                    label: "Sub Description",
                    type: "text",
                    default: "Item",
                  },
                  {
                    key: "description",
                    label: "Description",
                    type: "textarea",
                    default: "",
                  },
                  { key: "image", label: "Image", type: "image", default: "" },
                ],
              },
              {
                key: "sectionHeader",
                label: "Section header Varients",
                type: "radio",
                group: "settings",
                default: "classic",
                options: [
                  { label: "Classic", value: "classic" },
                  { label: "Gradient", value: "gradient" },
                  { label: "split", value: "split" },
                  { label: "elegant", value: "elegant" },
                ],
              },
              {
                key: "columns",
                label: "Columns",
                type: "select",
                group: "settings",
                default: "3",
                options: [
                  { label: "2 Columns", value: "2" },
                  { label: "3 Columns", value: "3" },
                  { label: "4 Columns", value: "4" },
                  { label: "5 Columns", value: "5" },
                ],
              },
              {
                key: "cardSubTitleWordLimit",
                label: "Show Sub title words in card",
                type: "slider",
                group: "settings",
                default: 50,
                min: 20,
                max: 150,
                step: 1,
              },
              {
                key: "cardImageHeight",
                label: "Card image height (px)",
                type: "slider",
                group: "style",
                default: 50,
                min: 180,
                max: 400,
                step: 1,
              },
              {
                key: "imageFit",
                label: "Image Fit",
                type: "radio",
                group: "style",
                default: "contain",
                options: [
                  { label: "Cover", value: "cover" },
                  { label: "Contain", value: "contain" },
                ],
              },
            ],
          },
          listView: {
            label: "List View",
            fields: [
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Highlights",
              },
              {
                key: "items",
                label: "Items",
                type: "array",
                default: [],
                sourceKeys: ["organization", "activity"],
                itemFields: [
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "Item",
                  },
                  {
                    key: "description",
                    label: "Description",
                    type: "textarea",
                    default: "",
                  },
                ],
              },
            ],
          },
          timeline: {
            label: "Timeline",
            fields: [
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Our journey",
              },
              {
                key: "items",
                label: "Items",
                type: "array",
                default: [],
                sourceKeys: ["activity"],
                itemFields: [
                  { key: "year", label: "Year", type: "text", default: "2024" },
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "Milestone",
                  },
                  {
                    key: "description",
                    label: "Description",
                    type: "textarea",
                    default: "",
                  },
                ],
              },
            ],
          },
          gallery: {
            label: "Gallery",
            fields: [
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Gallery",
              },
              {
                key: "images",
                label: "Images",
                type: "array",
                default: [],
                sourceKeys: ["image"],
                itemFields: [
                  { key: "image", label: "Image", type: "image", default: "" },
                  {
                    key: "caption",
                    label: "Caption",
                    type: "text",
                    default: "",
                  },
                ],
              },
              {
                key: "columns",
                label: "Columns",
                type: "select",
                group: "settings",
                default: "3",
                options: [
                  { label: "2 Columns", value: "2" },
                  { label: "3 Columns", value: "3" },
                  { label: "4 Columns", value: "4" },
                ],
              },
              {
                key: "lightbox",
                label: "Lightbox",
                type: "boolean",
                group: "settings",
                default: true,
              },
            ],
          },
          news: {
            label: "News",
            fields: [
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Latest news",
              },
              {
                key: "items",
                label: "News Items",
                type: "array",
                default: [],
                sourceKeys: ["activity", "video"],
                itemFields: [
                  {
                    key: "title",
                    label: "Title",
                    type: "text",
                    default: "News headline",
                  },
                  { key: "date", label: "Date", type: "text", default: "" },
                  {
                    key: "excerpt",
                    label: "Excerpt",
                    type: "textarea",
                    default: "",
                  },
                  { key: "image", label: "Image", type: "image", default: "" },
                  { key: "link", label: "Link", type: "text", default: "#" },
                ],
              },
            ],
          },
        },
      },
    },
  },
};

/* =====================================================================
 * REGISTRY ACCESS HELPERS
 * Builder কখনো Registry-তে সরাসরি হাত দেবে না — এই helper গুলো ব্যবহার করবে
 * =================================================================== */

export const getComponentConfig = (component) =>
  COMPONENT_REGISTRY[component] || null;

export const getTypeConfig = (component, type) =>
  getComponentConfig(component)?.types?.[type] || null;

export const getTemplateConfig = (component, type, template) =>
  getTypeConfig(component, type)?.templates?.[template] || null;

/** Property Panel-এর Type dropdown options */
export const getTypeOptions = (component) => {
  const cfg = getComponentConfig(component);
  if (!cfg) return [];
  return Object.entries(cfg.types).map(([value, t]) => ({
    value,
    label: t.label,
  }));
};

/** Selected Type অনুযায়ী Template dropdown options (Automatically filtered) */
export const getTemplateOptions = (component, type) => {
  const cfg = getTypeConfig(component, type);
  if (!cfg) return [];
  return Object.entries(cfg.templates).map(([value, t]) => ({
    value,
    label: t.label,
  }));
};

/** Left Panel-এর "Add Component" dropdown options */
export const getComponentOptions = () =>
  Object.entries(COMPONENT_REGISTRY).map(([value, c]) => ({
    value,
    label: c.label,
  }));

/* =====================================================================
 * GLOBAL STYLE FIELDS
 * =====================================================================
 * প্রতিটি component-এর Style tab-এ এই field-গুলো automatically থাকবে।
 * value গুলো component.styles-এ save হয় এবং Preview-তে wrapper-এ
 * inline style হিসেবে apply হয় (দেখুন: builderHelper.toInlineStyle)।
 *
 * কোনো template-এ extra style field দরকার হলে সেই template-এর
 * fields-এ group: "style" দিয়ে field যোগ করুন — সেগুলো Style tab-এ
 * global গুলোর উপরে দেখাবে।
 * =================================================================== */

export const GLOBAL_STYLE_FIELDS = [
  {
    key: "sectionBG",
    label: "Section Background Color",
    type: "color",
    group: "style",
    default: "",
  },
  {
    key: "sectionPaddingY",
    label: "Section Padding Y (rem)",
    type: "slider",
    group: "style",
    default: 12,
    min: 5,
    max: 100,
    step: 1,
  },
  {
    key: "paddingX",
    label: "Padding X (rem)",
    type: "slider",
    group: "style",
    default: 12,
    min: 5,
    max: 100,
    step: 1,
  },
];

/**
 * Style tab-এর সম্পূর্ণ field list:
 * template-specific (group: "style") + global style fields
 */
export const getStyleFields = (component, type, template) => {
  const templateConfig = getTemplateConfig(component, type, template);
  const templateStyleFields = (templateConfig?.fields || []).filter(
    (f) => f.group === "style",
  );
  return [...templateStyleFields, ...GLOBAL_STYLE_FIELDS];
};
