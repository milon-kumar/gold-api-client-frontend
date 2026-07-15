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
 *   key:      "title",             // content বা settings-এর ভিতরের key
 *   label:    "Title",             // Property Panel-এ যে Label দেখাবে
 *   type:     "text",              // text | textarea | number | boolean |
 *                                  // color | image | select | array
 *   group:    "content",           // "content" (default) | "settings"
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
                key: "title",
                label: "Title",
                type: "text",
                default: "Welcome to our site",
              },
              {
                key: "subtitle",
                label: "Subtitle",
                type: "text",
                default: "We build great things",
              },
              {
                key: "description",
                label: "Description",
                type: "textarea",
                default: "",
              },
              {
                key: "buttonText",
                label: "Button Text",
                type: "text",
                default: "Get Started",
              },
              {
                key: "buttonLink",
                label: "Button Link",
                type: "text",
                default: "#",
              },
              {
                key: "backgroundImage",
                label: "Background Image",
                type: "image",
                default: "",
              },
              {
                key: "overlayColor",
                label: "Overlay Color",
                type: "color",
                group: "settings",
                default: "#00000080",
              },
            ],
          },
          stellarBanner: {
            label: "Stellar Banner",
            fields: [
              { key: "badge", label: "Badge", type: "text", default: "New" },
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "A stellar headline",
              },
              { key: "subtitle", label: "Subtitle", type: "text", default: "" },
              {
                key: "primaryButtonText",
                label: "Primary Button",
                type: "text",
                default: "Start",
              },
              {
                key: "primaryButtonLink",
                label: "Primary Link",
                type: "text",
                default: "#",
              },
              {
                key: "secondaryButtonText",
                label: "Secondary Button",
                type: "text",
                default: "",
              },
              {
                key: "secondaryButtonLink",
                label: "Secondary Link",
                type: "text",
                default: "#",
              },
              {
                key: "backgroundImage",
                label: "Background Image",
                type: "image",
                default: "",
              },
              {
                key: "align",
                label: "Alignment",
                type: "select",
                group: "settings",
                default: "center",
                options: [
                  { label: "Left", value: "left" },
                  { label: "Center", value: "center" },
                  { label: "Right", value: "right" },
                ],
              },
            ],
          },
          simpleBanner: {
            label: "Simple Banner",
            fields: [
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Simple banner title",
              },
              { key: "image", label: "Image", type: "image", default: "" },
              {
                key: "height",
                label: "Height (px)",
                type: "number",
                group: "settings",
                default: 320,
                min: 120,
                max: 900,
              },
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
                itemFields: slideFields,
                sourceKeys: ["slider"],
              },
              ...autoplayFields,
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
                sourceKeys: ["image"],
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
            sourceKeys: [
              "introduction",
              "president-message",
              "what-we-want",
              "founding-president",
            ],
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
                key: "color",
                label: "Color",
                type: "select",
                group: "style",
                default: "3",
                options: [
                  { label: "2 Columns", value: "2" },
                  { label: "3 Columns", value: "3" },
                  { label: "4 Columns", value: "4" },
                ],
              },
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
                group: "settings",
                default: "#2563eb",
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
                    key: "description",
                    label: "Description",
                    type: "textarea",
                    default: "",
                  },
                  { key: "image", label: "Image", type: "image", default: "" },
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
                sourceKeys: [
                  "staff",
                  "organization",
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
                    key: "description",
                    label: "Description",
                    type: "textarea",
                    default: "",
                  },
                  {
                    key: "image",
                    label: "Image",
                    type: "image",
                    default: "",
                  },
                  {
                    key: "button",
                    label: "Button title",
                    type: "text",
                    default: "Details",
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
                  { label: "1 Columns", value: "1" },
                  { label: "2 Columns", value: "2" },
                  { label: "3 Columns", value: "3" },
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
                sourceKeys: [
                  "staff",
                  "organization",
                  "anual_plan",
                  "regular_activities",
                  "archives",
                  "video",
                ],
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
                sourceKeys: ["photo", "video"],
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
                sourceKeys: ["news"],
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

// /**
//  * =====================================================================
//  * COMPONENT REGISTRY  (Single Source of Truth)
//  * =====================================================================
//  * পুরো Page Builder এই Configuration পড়ে চলে।
//  *
//  * নতুন Component / Type / Template / Field যোগ করতে চাইলে
//  * শুধু এখানে একটি Object যোগ করুন — Builder-এর কোনো কোড
//  * পরিবর্তন করতে হবে না।
//  *
//  * Field Definition Shape:
//  * {
//  *   key:      "title",             // content বা settings-এর ভিতরের key
//  *   label:    "Title",             // Property Panel-এ যে Label দেখাবে
//  *   type:     "text",              // text | textarea | number | boolean |
//  *                                  // color | image | select | array
//  *   group:    "content",           // "content" (default) | "settings"
//  *   default:  "...",               // component add করলে এই value বসবে
//  *   options:  [{label, value}],    // শুধু select-এর জন্য
//  *   itemFields: [...fields],       // শুধু array-এর জন্য (repeater item)
//  *   min, max, step,                // number-এর জন্য (optional)
//  *   placeholder: "..."             // optional
//  * }
//  * =====================================================================
//  */

// /* ---------- Reusable field snippets (DRY) ---------- */

// const autoplayFields = [
//   { key: "autoplay", label: "Auto Play", type: "boolean", group: "settings", default: true },
//   { key: "speed", label: "Speed (ms)", type: "number", group: "settings", default: 3000, min: 500, step: 100 },
// ];

// const navPagFields = [
//   { key: "navigation", label: "Navigation Arrows", type: "boolean", group: "settings", default: true },
//   { key: "pagination", label: "Pagination Dots", type: "boolean", group: "settings", default: true },
// ];

// const slideFields = [
//   { key: "title", label: "Slide Title", type: "text", default: "Slide title" },
//   { key: "subtitle", label: "Slide Subtitle", type: "text", default: "" },
//   { key: "image", label: "Slide Image", type: "image", default: "" },
//   { key: "buttonText", label: "Button Text", type: "text", default: "" },
//   { key: "buttonLink", label: "Button Link", type: "text", default: "" },
// ];

// /* =====================================================================
//  * REGISTRY
//  * =================================================================== */

// export const COMPONENT_REGISTRY = {
//   /* ================================================================
//    * 1. HERO
//    * ============================================================== */
//   hero: {
//     label: "Hero",
//     icon: "Sparkles",
//     renderer: "hero", // renderers/index.js এর RENDERERS map-এর key
//     defaultType: "banner",
//     types: {
//       /* -------------------- Banner -------------------- */
//       banner: {
//         label: "Banner",
//         defaultTemplate: "classicBanner",
//         templates: {
//           classicBanner: {
//             label: "Classic Banner",
//             fields: [
//               { key: "title", label: "Title", type: "text", default: "Welcome to our site" },
//               { key: "subtitle", label: "Subtitle", type: "text", default: "We build great things" },
//               { key: "description", label: "Description", type: "textarea", default: "" },
//               { key: "buttonText", label: "Button Text", type: "text", default: "Get Started" },
//               { key: "buttonLink", label: "Button Link", type: "text", default: "#" },
//               { key: "backgroundImage", label: "Background Image", type: "image", default: "" },
//               { key: "overlayColor", label: "Overlay Color", type: "color", group: "settings", default: "#00000080" },
//             ],
//           },
//           stellarBanner: {
//             label: "Stellar Banner",
//             fields: [
//               { key: "badge", label: "Badge", type: "text", default: "New" },
//               { key: "title", label: "Title", type: "text", default: "A stellar headline" },
//               { key: "subtitle", label: "Subtitle", type: "text", default: "" },
//               { key: "primaryButtonText", label: "Primary Button", type: "text", default: "Start" },
//               { key: "primaryButtonLink", label: "Primary Link", type: "text", default: "#" },
//               { key: "secondaryButtonText", label: "Secondary Button", type: "text", default: "" },
//               { key: "secondaryButtonLink", label: "Secondary Link", type: "text", default: "#" },
//               { key: "backgroundImage", label: "Background Image", type: "image", default: "" },
//               { key: "align", label: "Alignment", type: "select", group: "settings", default: "center",
//                 options: [
//                   { label: "Left", value: "left" },
//                   { label: "Center", value: "center" },
//                   { label: "Right", value: "right" },
//                 ] },
//             ],
//           },
//           simpleBanner: {
//             label: "Simple Banner",
//             fields: [
//               { key: "title", label: "Title", type: "text", default: "Simple banner title" },
//               { key: "image", label: "Image", type: "image", default: "" },
//               { key: "height", label: "Height (px)", type: "number", group: "settings", default: 320, min: 120, max: 900 },
//               { key: "buttonText", label: "Button Text", type: "text", default: "" },
//               { key: "buttonLink", label: "Button Link", type: "text", default: "#" },
//             ],
//           },
//         },
//       },

//       /* -------------------- Carousel -------------------- */
//       carousel: {
//         label: "Carousel",
//         defaultTemplate: "classicCarousel",
//         templates: {
//           classicCarousel: {
//             label: "Classic Carousel",
//             fields: [
//               { key: "slides", label: "Slides", type: "array", default: [], itemFields: slideFields },
//               ...autoplayFields,
//             ],
//           },
//           simpleCarousel: {
//             label: "Simple Carousel",
//             fields: [
//               { key: "slides", label: "Slides", type: "array", default: [],
//                 itemFields: [
//                   { key: "title", label: "Title", type: "text", default: "Slide" },
//                   { key: "image", label: "Image", type: "image", default: "" },
//                 ] },
//               ...autoplayFields,
//             ],
//           },
//           modernCarousel: {
//             label: "Modern Carousel",
//             fields: [
//               { key: "slides", label: "Slides", type: "array", default: [], itemFields: slideFields },
//               ...autoplayFields,
//               ...navPagFields,
//             ],
//           },
//           imageCarousel: {
//             label: "Image Carousel",
//             fields: [
//               { key: "images", label: "Images", type: "array", default: [],
//                 itemFields: [{ key: "image", label: "Image", type: "image", default: "" }] },
//               ...autoplayFields,
//             ],
//           },
//           immersiveSlider: {
//             label: "Immersive Slider",
//             fields: [
//               { key: "slides", label: "Slides", type: "array", default: [], itemFields: slideFields },
//               ...autoplayFields,
//               { key: "height", label: "Height (px)", type: "number", group: "settings", default: 520, min: 240, max: 1000 },
//             ],
//           },
//           simpleImageSlider: {
//             label: "Simple Image Slider",
//             fields: [
//               { key: "slides", label: "Slides", type: "array", default: [],
//                 itemFields: [{ key: "image", label: "Image", type: "image", default: "" }] },
//               ...autoplayFields,
//               ...navPagFields,
//               { key: "loop", label: "Loop", type: "boolean", group: "settings", default: true },
//               { key: "height", label: "Height (px)", type: "number", group: "settings", default: 400, min: 160, max: 900 },
//             ],
//           },
//         },
//       },
//     },
//   },

//   /* ================================================================
//    * 2. INFORMATION  (একটাই type — UI-তে Type selector hide থাকবে)
//    * ============================================================== */
//   information: {
//     label: "Information",
//     icon: "Info",
//     renderer: "information",
//     defaultType: "default",
//     types: {
//       default: {
//         label: "Default",
//         defaultTemplate: "simple",
//         templates: {
//           simple: {
//             label: "Simple",
//             fields: [
//               { key: "title", label: "Title", type: "text", default: "About us" },
//               { key: "description", label: "Description", type: "textarea", default: "" },
//               { key: "image", label: "Image", type: "image", default: "" },
//             ],
//           },
//           modern: {
//             label: "Modern",
//             fields: [
//               { key: "badge", label: "Badge", type: "text", default: "Why us" },
//               { key: "title", label: "Title", type: "text", default: "A modern headline" },
//               { key: "description", label: "Description", type: "textarea", default: "" },
//               { key: "image", label: "Image", type: "image", default: "" },
//               { key: "accentColor", label: "Accent Color", type: "color", group: "settings", default: "#2563eb" },
//             ],
//           },
//           founder: {
//             label: "Founder",
//             fields: [
//               { key: "founderName", label: "Founder Name", type: "text", default: "John Doe" },
//               { key: "founderImage", label: "Founder Image", type: "image", default: "" },
//               { key: "message", label: "Message", type: "textarea", default: "" },
//               { key: "designation", label: "Designation", type: "text", default: "CEO & Founder" },
//             ],
//           },
//           imageLeft: {
//             label: "Image Left",
//             fields: [
//               { key: "title", label: "Title", type: "text", default: "Side by side" },
//               { key: "description", label: "Description", type: "textarea", default: "" },
//               { key: "image", label: "Image", type: "image", default: "" },
//               { key: "buttonText", label: "Button Text", type: "text", default: "" },
//               { key: "buttonLink", label: "Button Link", type: "text", default: "#" },
//             ],
//           },
//           imageRight: {
//             label: "Image Right",
//             fields: [
//               { key: "title", label: "Title", type: "text", default: "Side by side" },
//               { key: "description", label: "Description", type: "textarea", default: "" },
//               { key: "image", label: "Image", type: "image", default: "" },
//               { key: "buttonText", label: "Button Text", type: "text", default: "" },
//               { key: "buttonLink", label: "Button Link", type: "text", default: "#" },
//             ],
//           },
//         },
//       },
//     },
//   },

//   /* ================================================================
//    * 3. LIST
//    * ============================================================== */
//   list: {
//     label: "List",
//     icon: "List",
//     renderer: "list",
//     defaultType: "default",
//     types: {
//       default: {
//         label: "Default",
//         defaultTemplate: "cardGrid",
//         templates: {
//           cardGrid: {
//             label: "Card Grid",
//             fields: [
//               { key: "badge", label: "Badge", type: "text", default: "" },
//               { key: "title", label: "Title", type: "text", default: "Our services" },
//               { key: "subtitle", label: "Subtitle", type: "text", default: "" },
//               { key: "items", label: "Items", type: "array", default: [],
//                 itemFields: [
//                   { key: "title", label: "Title", type: "text", default: "Item" },
//                   { key: "description", label: "Description", type: "textarea", default: "" },
//                   { key: "image", label: "Image", type: "image", default: "" },
//                 ] },
//               { key: "columns", label: "Columns", type: "select", group: "settings", default: "3",
//                 options: [
//                   { label: "2 Columns", value: "2" },
//                   { label: "3 Columns", value: "3" },
//                   { label: "4 Columns", value: "4" },
//                 ] },
//             ],
//           },
//           listView: {
//             label: "List View",
//             fields: [
//               { key: "title", label: "Title", type: "text", default: "Highlights" },
//               { key: "items", label: "Items", type: "array", default: [],
//                 itemFields: [
//                   { key: "title", label: "Title", type: "text", default: "Item" },
//                   { key: "description", label: "Description", type: "textarea", default: "" },
//                 ] },
//             ],
//           },
//           timeline: {
//             label: "Timeline",
//             fields: [
//               { key: "title", label: "Title", type: "text", default: "Our journey" },
//               { key: "items", label: "Items", type: "array", default: [],
//                 itemFields: [
//                   { key: "year", label: "Year", type: "text", default: "2024" },
//                   { key: "title", label: "Title", type: "text", default: "Milestone" },
//                   { key: "description", label: "Description", type: "textarea", default: "" },
//                 ] },
//             ],
//           },
//           gallery: {
//             label: "Gallery",
//             fields: [
//               { key: "title", label: "Title", type: "text", default: "Gallery" },
//               { key: "images", label: "Images", type: "array", default: [],
//                 itemFields: [
//                   { key: "image", label: "Image", type: "image", default: "" },
//                   { key: "caption", label: "Caption", type: "text", default: "" },
//                 ] },
//               { key: "columns", label: "Columns", type: "select", group: "settings", default: "3",
//                 options: [
//                   { label: "2 Columns", value: "2" },
//                   { label: "3 Columns", value: "3" },
//                   { label: "4 Columns", value: "4" },
//                 ] },
//               { key: "lightbox", label: "Lightbox", type: "boolean", group: "settings", default: true },
//             ],
//           },
//           news: {
//             label: "News",
//             fields: [
//               { key: "title", label: "Title", type: "text", default: "Latest news" },
//               { key: "items", label: "News Items", type: "array", default: [],
//                 itemFields: [
//                   { key: "title", label: "Title", type: "text", default: "News headline" },
//                   { key: "date", label: "Date", type: "text", default: "" },
//                   { key: "excerpt", label: "Excerpt", type: "textarea", default: "" },
//                   { key: "image", label: "Image", type: "image", default: "" },
//                   { key: "link", label: "Link", type: "text", default: "#" },
//                 ] },
//             ],
//           },
//         },
//       },
//     },
//   },
// };

// /* =====================================================================
//  * REGISTRY ACCESS HELPERS
//  * Builder কখনো Registry-তে সরাসরি হাত দেবে না — এই helper গুলো ব্যবহার করবে
//  * =================================================================== */

// export const getComponentConfig = (component) => COMPONENT_REGISTRY[component] || null;

// export const getTypeConfig = (component, type) =>
//   getComponentConfig(component)?.types?.[type] || null;

// export const getTemplateConfig = (component, type, template) =>
//   getTypeConfig(component, type)?.templates?.[template] || null;

// /** Property Panel-এর Type dropdown options */
// export const getTypeOptions = (component) => {
//   const cfg = getComponentConfig(component);
//   if (!cfg) return [];
//   return Object.entries(cfg.types).map(([value, t]) => ({ value, label: t.label }));
// };

// /** Selected Type অনুযায়ী Template dropdown options (Automatically filtered) */
// export const getTemplateOptions = (component, type) => {
//   const cfg = getTypeConfig(component, type);
//   if (!cfg) return [];
//   return Object.entries(cfg.templates).map(([value, t]) => ({ value, label: t.label }));
// };

// /** Left Panel-এর "Add Component" dropdown options */
// export const getComponentOptions = () =>
//   Object.entries(COMPONENT_REGISTRY).map(([value, c]) => ({ value, label: c.label }));
