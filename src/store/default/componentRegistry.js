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
  heroCarousel: {
    label: "Hero Carousel",
    icon: "Sparkles",
    moduleType:"carousel",
    renderer: "hero",
    defaultType: "carousel",
    types: {
      carousel: {
        label: "Carousel",
        defaultTemplate: "classicCarousel",
        templates: {
          classicCarousel: {
            label: "Details Slider Carousel",
            fields: [
              {
                key: "slides",
                label: "Slides",
                type: "array",
                default: [],
                sourceKeys: ["slider"],
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
            label: "Simple Image Carousel",
            fields: [
              {
                key: "slides",
                label: "Slides",
                type: "array",
                default: [],
                sourceKeys: ["photo"],
                itemFields: [
                  { key: "image", label: "Image", type: "image", default: "" },
                ],
              },
              {
                key: "columns",
                label: "Add slide columns",
                type: "slider",
                group: "settings",
                default: 3,
                min: 1,
                max: 6
              },
              {
                key: "navigation",
                label: "Hide or show navigation",
                type: "boolean",
                group: "settings",
                default: true,
              },
              {
                key: "pagination",
                label: "Hide or show pagination",
                type: "boolean",
                group: "settings",
                default: true,
              }
            ],
          },
        },
      },
    }
  },
  heroBanner: {
    label: "Hero Banner",
    icon: "Sparkles",
    moduleType:"banner",
    renderer: "hero",
    defaultType: "banner",
    types: {
      banner: {
        label: "Default",
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
                visible: true
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
                key: "stats",
                label: "Stats Items",
                type: "array",
                default: [],
                limit: 4,
                itemFields: [
                  {
                    key: "Icon",
                    label: "Icon",
                    helpText: "Use Lucide Icons as Kamel case Formate. Ex: `Target`",
                    type: "text",
                    default: "Target",
                  },
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
                visible: false,
              },
              {
                key: "rightSecOneTitle",
                label: "Card one Title",
                type: "text",
                default: "Regular publications",
                visible: false,
              },
              {
                key: "rightSecOneSubTitle",
                label: "Card one Sub Title",
                type: "text",
                default: "Monthly magazines and Islamic literature",
                visible: false,
              },

              {
                key: "rightSecTwoIcon",
                label: "Card tow icon",
                type: "text",
                default: "Calendar",
                visible: false,
              },
              {
                key: "rightSecTwoHeaderTitle",
                label: "Card tow header title",
                type: "text",
                default: "Upcoming events",
                visible: false,
              },
              {
                key: "rightSecTwoHeaderBadge",
                label: "Card tow header badge",
                type: "text",
                default: "Registration is ongoing.",
                visible: false,
              },
              {
                key: "rightSecTowTitle",
                label: "Card one Title",
                type: "text",
                default: "Annual Tablighi Ijtema 2027",
                visible: false,
              },
              {
                key: "rightSecTowItems",
                label: "Section Items",
                type: "array",
                default: [],
                visible: false,
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
                visible: false,
              },
              {
                key: "rightSecTowFooterTitle",
                label: "Card two footer title",
                type: "text",
                default: "A gathering of millions of people from home and abroad",
                visible: false,
              },
              {
                key: "rightSecThreeIcon",
                label: "Card one icon",
                type: "text",
                default: "Check",
                visible: false,
              },
              {
                key: "rightSecThreeTitle",
                label: "Card the Title",
                type: "text",
                default: "Big family",
                visible: false,
              },
              {
                key: "rightSecThreeSubTitle",
                label: "Card three sub title",
                type: "text",
                default: "Millions of members and well-wishers",
                visible: false,
              },
              {
                key: "rightSecThreeDescription",
                label: "Card three description",
                type: "text",
                default: "Connected from all over the country",
                visible: false,
              },
              {
                key: "bottomTickerItems",
                label: "Ticker Items (input items by coma [,] seperated)",
                type: "text",
                default: "",
                visible: false,
              },
              {
                key: "showCardOne",
                label: "Show card one (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: false,
              },
              {
                key: "showCardTow",
                label: "Show card two (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: false,
              },
              {
                key: "showCardThree",
                label: "Show card Three (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: false,
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
                visible: true
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
                key: "stats",
                label: "Stats Items",
                type: "array",
                default: [],
                limit: 4,
                itemFields: [
                  {
                    key: "Icon",
                    label: "Icon",
                    helpText: "Use Lucide Icons as Kamel case Formate. Ex: `Target`",
                    type: "text",
                    default: "Target",
                  },
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
                visible: false,
              },
              {
                key: "rightSecOneTitle",
                label: "Card one Title",
                type: "text",
                default: "Regular publications",
                visible: false,
              },
              {
                key: "rightSecOneSubTitle",
                label: "Card one Sub Title",
                type: "text",
                default: "Monthly magazines and Islamic literature",
                visible: false,
              },

              {
                key: "rightSecTwoIcon",
                label: "Card tow icon",
                type: "text",
                default: "Calendar",
                visible: false,
              },
              {
                key: "rightSecTwoHeaderTitle",
                label: "Card tow header title",
                type: "text",
                default: "Upcoming events",
                visible: false,
              },
              {
                key: "rightSecTwoHeaderBadge",
                label: "Card tow header badge",
                type: "text",
                default: "Registration is ongoing.",
                visible: false,
              },
              {
                key: "rightSecTowTitle",
                label: "Card one Title",
                type: "text",
                default: "Annual Tablighi Ijtema 2027",
                visible: false,
              },
              {
                key: "rightSecTowItems",
                label: "Section Items",
                type: "array",
                default: [],
                visible: false,
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
                visible: false,
              },
              {
                key: "rightSecTowFooterTitle",
                label: "Card two footer title",
                type: "text",
                default: "A gathering of millions of people from home and abroad",
                visible: false,
              },
              {
                key: "rightSecThreeIcon",
                label: "Card one icon",
                type: "text",
                default: "Check",
                visible: false,
              },
              {
                key: "rightSecThreeTitle",
                label: "Card the Title",
                type: "text",
                default: "Big family",
                visible: false,
              },
              {
                key: "rightSecThreeSubTitle",
                label: "Card three sub title",
                type: "text",
                default: "Millions of members and well-wishers",
                visible: false,
              },
              {
                key: "rightSecThreeDescription",
                label: "Card three description",
                type: "text",
                default: "Connected from all over the country",
                visible: false,
              },
              {
                key: "bottomTickerItems",
                label: "Ticker Items (input items by coma [,] seperated)",
                type: "text",
                default: "",
                visible: false,
              },
              {
                key: "showCardOne",
                label: "Show card one (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: false,
              },
              {
                key: "showCardTow",
                label: "Show card two (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: false,
              },
              {
                key: "showCardThree",
                label: "Show card Three (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: false,
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
                visible: true
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
                key: "stats",
                label: "Stats Items",
                type: "array",
                default: [],
                limit: 4,
                itemFields: [
                  {
                    key: "Icon",
                    label: "Icon",
                    helpText: "Use Lucide Icons as Kamel case Formate. Ex: `Target`",
                    type: "text",
                    default: "Target",
                  },
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
                label: "Card-1  Icon",
                type: "text",
                default: "Check",
                visible: true,
              },
              {
                key: "rightSecOneTitle",
                label: "Card-1 Title",
                type: "text",
                default: "Regular publications",
                visible: true,
              },
              {
                key: "rightSecOneSubTitle",
                label: "Card-1 Sub Title",
                type: "text",
                default: "Monthly magazines and Islamic literature",
                visible: true,
              },

              {
                key: "rightSecTwoIcon",
                label: "Card-2 icon",
                type: "text",
                default: "Calendar",
                visible: true,
              },
              {
                key: "rightSecTwoHeaderTitle",
                label: "Card-2 header title",
                type: "text",
                default: "Upcoming events",
                visible: true,
              },
              {
                key: "rightSecTwoHeaderBadge",
                label: "Card-2 header badge",
                type: "text",
                default: "Registration is ongoing.",
                visible: true,
              },
              {
                key: "rightSecTowTitle",
                label: "Card-2 Title",
                type: "text",
                default: "Annual Tablighi Ijtema 2027",
                visible: true,
              },
              {
                key: "rightSecTowItems",
                label: "Card-2 Section Items",
                type: "array",
                default: [],
                visible: true,
                limit: 5,
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
                label: "Card-2 footer icon",
                type: "text",
                default: "Check",
                visible: true,
              },
              {
                key: "rightSecTowFooterTitle",
                label: "Card-2 footer title",
                type: "text",
                default: "A gathering of millions of people from home and abroad",
                visible: true,
              },
              {
                key: "rightSecThreeIcon",
                label: "Card-3 icon",
                type: "text",
                default: "Check",
                visible: true,
              },
              {
                key: "rightSecThreeTitle",
                label: "Card-3 Title",
                type: "text",
                default: "Big family",
                visible: true,
              },
              {
                key: "rightSecThreeSubTitle",
                label: "Card-3 subtitle",
                type: "text",
                default: "Millions of members and well-wishers",
                visible: true,
              },
              {
                key: "rightSecThreeDescription",
                label: "Card-3 description",
                type: "text",
                default: "Connected from all over the country",
                visible: true,
              },
              {
                key: "bottomTickerItems",
                label: "Ticker Items (input items by coma [,] seperated)",
                type: "text",
                default: "",
                visible: true,
              },
              {
                key: "showCardOne",
                label: "Show card one (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: true,
              },
              {
                key: "showCardTow",
                label: "Show card two (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: true,
              },
              {
                key: "showCardThree",
                label: "Show card Three (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: true,
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
                visible: true
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
                key: "stats",
                label: "Stats Items",
                type: "array",
                default: [],
                limit: 4,
                itemFields: [
                  {
                    key: "Icon",
                    label: "Icon",
                    helpText: "Use Lucide Icons as Kamel case Formate. Ex: `Target`",
                    type: "text",
                    default: "Target",
                  },
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
                label: "Card-1  Icon",
                type: "text",
                default: "Check",
                visible: true,
              },
              {
                key: "rightSecOneTitle",
                label: "Card-1 Title",
                type: "text",
                default: "Regular publications",
                visible: true,
              },
              {
                key: "rightSecOneSubTitle",
                label: "Card-1 Sub Title",
                type: "text",
                default: "Monthly magazines and Islamic literature",
                visible: true,
              },

              {
                key: "rightSecTwoIcon",
                label: "Card-2 icon",
                type: "text",
                default: "Calendar",
                visible: true,
              },
              {
                key: "rightSecTwoHeaderTitle",
                label: "Card-2 header title",
                type: "text",
                default: "Upcoming events",
                visible: true,
              },
              {
                key: "rightSecTwoHeaderBadge",
                label: "Card-2 header badge",
                type: "text",
                default: "Registration is ongoing.",
                visible: true,
              },
              {
                key: "rightSecTowTitle",
                label: "Card-2 Title",
                type: "text",
                default: "Annual Tablighi Ijtema 2027",
                visible: true,
              },
              {
                key: "rightSecTowItems",
                label: "Card-2 Section Items",
                type: "array",
                default: [],
                visible: true,
                limit: 5,
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
                label: "Card-2 footer icon",
                type: "text",
                default: "Check",
                visible: true,
              },
              {
                key: "rightSecTowFooterTitle",
                label: "Card-2 footer title",
                type: "text",
                default: "A gathering of millions of people from home and abroad",
                visible: true,
              },
              {
                key: "rightSecThreeIcon",
                label: "Card-3 icon",
                type: "text",
                default: "Check",
                visible: true,
              },
              {
                key: "rightSecThreeTitle",
                label: "Card-3 Title",
                type: "text",
                default: "Big family",
                visible: true,
              },
              {
                key: "rightSecThreeSubTitle",
                label: "Card-3 subtitle",
                type: "text",
                default: "Millions of members and well-wishers",
                visible: true,
              },
              {
                key: "rightSecThreeDescription",
                label: "Card-3 description",
                type: "text",
                default: "Connected from all over the country",
                visible: true,
              },
              {
                key: "bottomTickerItems",
                label: "Ticker Items (input items by coma [,] seperated)",
                type: "text",
                default: "",
                visible: true,
              },
              {
                key: "showCardOne",
                label: "Show card one (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: true,
              },
              {
                key: "showCardTow",
                label: "Show card two (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: true,
              },
              {
                key: "showCardThree",
                label: "Show card Three (show/height)",
                type: "boolean",
                group: "settings",
                default: true,
                visible: true,
              },
            ],
          },
        }
      }
    }
  },
  information: {
    label: "Information",
    icon: "Info",
    moduleType:"information",
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
              { key: "badge", label: "Badge", type: "text", default: "Why us", visible: false },
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
              {
                key: "headingFontSize",
                label: "Control heading font size (px)",
                type: "slider",
                group: "style",
                default: 22,
                min: 8,
                max: 180
              }, {
                key: "paragraphFontSize",
                label: "Control paragraph font size (px)",
                type: "slider",
                group: "style",
                default: 18,
                min: 8,
                max: 180
              }, {
                key: "imageRounded",
                label: "Control Right image border (px)",
                type: "slider",
                group: "style",
                default: 5,
                min: 5,
                max: 100
              }, {
                key: "applyImageScaleOnHover",
                label: "Apply image scale effect on hover",
                type: "boolean",
                group: "style",
                default: false,
              }, {
                key: "applyImageShadowEffect",
                label: "Apply image shadow effect",
                type: "boolean",
                group: "style",
                default: false,
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
              {
                key: "accentColor",
                label: "Manage color for badge",
                type: "color",
                group: "style",
                default: "#2563eb",
              },
              {
                key: "showBadge",
                label: "Show or hide the badge",
                type: "boolean",
                group: "settings",
                default: true,
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
              {
                key: "headingFontSize",
                label: "Control heading font size (px)",
                type: "slider",
                group: "style",
                default: 22,
                min: 8,
                max: 180
              }, {
                key: "paragraphFontSize",
                label: "Control paragraph font size (px)",
                type: "slider",
                group: "style",
                default: 18,
                min: 8,
                max: 180
              }, {
                key: "imageRounded",
                label: "Control Right image border (px)",
                type: "slider",
                group: "style",
                default: 5,
                min: 5,
                max: 100
              }, {
                key: "applyImageScaleOnHover",
                label: "Apply image scale effect on hover",
                type: "boolean",
                group: "style",
                default: false,
              }, {
                key: "applyImageShadowEffect",
                label: "Apply image shadow effect",
                type: "boolean",
                group: "style",
                default: false,
              },
            ],
          },
          imageLeft: {
            label: "Image Left",
            sourceKeys: ["information"],
            fields: [
              { key: "badge", label: "Badge", type: "text", default: "Why us", visible: false },

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
              {
                key: "headingFontSize",
                label: "Control heading font size (px)",
                type: "slider",
                group: "style",
                default: 22,
                min: 8,
                max: 180
              }, {
                key: "paragraphFontSize",
                label: "Control paragraph font size (px)",
                type: "slider",
                group: "style",
                default: 18,
                min: 8,
                max: 180
              }, {
                key: "imageRounded",
                label: "Control Right image border (px)",
                type: "slider",
                group: "style",
                default: 5,
                min: 5,
                max: 100
              }, {
                key: "applyImageScaleOnHover",
                label: "Apply image scale effect on hover",
                type: "boolean",
                group: "style",
                default: false,
              }, {
                key: "applyImageShadowEffect",
                label: "Apply image shadow effect",
                type: "boolean",
                group: "style",
                default: false,
              },
            ],
          },
          imageRight: {
            label: "Image Right",
            sourceKeys: ["information"],
            fields: [
              { key: "badge", label: "Badge", type: "text", default: "Why us", visible: false },
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
  list: {
    label: "List Component",
    icon: "List",
    moduleType:"list",
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
              { key: "title", label: "Title", type: "text", default: "",},
              { key: "subtitle", label: "Subtitle", type: "text", default: "" },
              {
                key: "items",
                label: "Items",
                type: "array",
                default: [],
                sourceKeys: ['modules'],
                // [
                //   "staff",
                //   "organization",
                //   "photo",
                //   "anual_plan",
                //   "regular_activities",
                //   "archives",
                //   "video",
                // ]
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
                default: 200,
                min: 180,
                max: 400,
                step: 1,
              },
              {
                key: "imageFit",
                label: "Image Fit",
                type: "radio",
                group: "style",
                default: "cover",
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
              { key: "badge", label: "Badge", type: "text", default: "" },
              { key: "title", label: "Title", type: "text", default: "",},
              { key: "subtitle", label: "Subtitle", type: "text", default: "" },
              {
                key: "items",
                label: "Items",
                type: "array",
                default: [],
                sourceKeys: ['modules'],
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
                default: 200,
                min: 180,
                max: 400,
                step: 1,
              },
              {
                key: "imageFit",
                label: "Image Fit",
                type: "radio",
                group: "style",
                default: "cover",
                options: [
                  { label: "Cover", value: "cover" },
                  { label: "Contain", value: "contain" },
                ],
              },
            ],
          }
        },
      },
    },
  },
  imageGallery: {
    label: "Image Gallery",
    icon: "Images",
    moduleType:"image",
    renderer: "imageGallery",
    defaultType: "default",
    types: {
      default: {
        label: "Default",
        defaultTemplate: "imageGallery",
        templates: {
          imageGallery: {
            label: "Image Gallery",
            fields: [
              { key: "badge", label: "Badge", type: "text", default: "" },
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Image Gallery",
              },
              { key: "subtitle", label: "Subtitle", type: "text", default: "" },
              {
                key: "imageGallery",
                label: "Given gallery content",
                type: "array",
                default: [],
                moduleType:"image",
                sourceKeys:['image'],
                itemFields: [
                  { key: "image", label: "Image", type: "image", default: "" },
                ],
              },
              {
                key: "showHeader",
                label: "Show or hide the section header",
                type: "boolean",
                group: "settings",
                default: true,
              },
              {
                key: "showBadge",
                label: "Show or hide the badge",
                type: "boolean",
                group: "settings",
                default: true,
              },
            ]
          }
        }
      }
    }
  },
  videoGallery: {
    label: "Video Gallery",
    icon: "Videos",
    moduleType:"video",
    renderer: "videoGallery",
    defaultType: "default",
    types: {
      default: {
        label: "Default",
        defaultTemplate: "videoGallery",
        templates: {
          videoGallery: {
            label: "Video Gallery",
            fields: [
              { key: "badge", label: "Badge", type: "text", default: "" },
              {
                key: "title",
                label: "Title",
                type: "text",
                default: "Video Gallery",
              },
              { key: "subtitle", label: "Subtitle", type: "text", default: "" },
              {
                key: "videoGallery",
                label: "Given gallery content",
                type: "array",
                default: [],
                moduleType:"video",
                sourceKeys: ['video'],
                itemFields: [
                  { key: "image", label: "Image", type: "image", default: "" },
                ],
              },
              {
                key: "showHeader",
                label: "Show or hide the section header",
                type: "boolean",
                group: "settings",
                default: true,
              },
              {
                key: "showBadge",
                label: "Show or hide the badge",
                type: "boolean",
                group: "settings",
                default: true,
              },
            ]
          }
        }
      }
    }
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


// hero: {
//   label: "Hero",
//   icon: "Sparkles",
//   renderer: "hero", // renderers/index.js এর RENDERERS map-এর key
//   defaultType: "banner",
//   types: {
//     /* -------------------- Banner -------------------- */
//     banner: {
//       label: "Banner",
//       defaultTemplate: "classicBanner",
//       templates: {
//         classicBanner: {
//           label: "Classic Banner",
//           fields: [
//             {
//               key: "slogan",
//               label: "Slogan",
//               type: "text",
//               default: "Welcome",
//             },
//             {
//               key: "title",
//               label: "Title",
//               type: "text",
//               default: "Build Your Future",
//             },
//             {
//               key: "subtitle",
//               label: "Subtitle",
//               type: "text",
//               default: "Simple, modern, and powerful solutions.",
//             },
//             {
//               key: "primaryButtonTitle",
//               label: "Primary Button Title",
//               type: "text",
//               default: "Get Started",
//             },
//             {
//               key: "primaryButtonLink",
//               label: "Primary Button Link",
//               type: "text",
//               default: "/about",
//             },
//             {
//               key: "secondaryButtonTitle",
//               label: "Secondary Button Title",
//               type: "text",
//               default: "Learn More",
//             },
//             {
//               key: "secondaryButtonLink",
//               label: "Secondary Button Link",
//               type: "text",
//               default: "/contact",
//             },
//             {
//               key: "stats",
//               label: "Stats Items",
//               type: "array",
//               default: [],
//               itemFields: [
//                 {
//                   key: "Icon",
//                   label: "Icon",
//                   helpText: "Here you must use Lucide Icons , and that will be the Kamel case",
//                   type: "text",
//                   default: "1",
//                 },
//                 {
//                   key: "count",
//                   label: "Count",
//                   type: "text",
//                   default: "1",
//                 },
//                 {
//                   key: "title",
//                   label: "Title",
//                   type: "text",
//                   default: "Default",
//                 },
//               ],
//             },
//             {
//               key: "rightSecOneIcon",
//               label: "Card one icon",
//               type: "text",
//               default: "Check",
//               visible: false,
//             },
//             {
//               key: "rightSecOneTitle",
//               label: "Card one Title",
//               type: "text",
//               default: "Regular publications",
//             },
//             {
//               key: "rightSecOneSubTitle",
//               label: "Card one Sub Title",
//               type: "text",
//               default: "Monthly magazines and Islamic literature",
//             },

//             {
//               key: "rightSecTwoIcon",
//               label: "Card tow icon",
//               type: "text",
//               default: "Calendar",
//             },
//             {
//               key: "rightSecTwoHeaderTitle",
//               label: "Card tow header title",
//               type: "text",
//               default: "Upcoming events",
//             },
//             {
//               key: "rightSecTwoHeaderBadge",
//               label: "Card tow header badge",
//               type: "text",
//               default: "Registration is ongoing.",
//             },
//             {
//               key: "rightSecTowTitle",
//               label: "Card one Title",
//               type: "text",
//               default: "Annual Tablighi Ijtema 2027",
//             },
//             {
//               key: "rightSecTowItems",
//               label: "Section Items",
//               type: "array",
//               default: [],
//               itemFields: [
//                 {
//                   key: "icon",
//                   label: "Icon",
//                   type: "text",
//                   default: "CircleCheck",
//                 },
//                 {
//                   key: "title",
//                   label: "Title",
//                   type: "text",
//                   default: "Default",
//                 },
//               ],
//             },
//             {
//               key: "rightSecTowFooterIcon",
//               label: "Card one icon",
//               type: "text",
//               default: "Check",
//             },
//             {
//               key: "rightSecTowFooterTitle",
//               label: "Card two footer title",
//               type: "text",
//               default: "A gathering of millions of people from home and abroad",
//             },
//             {
//               key: "rightSecThreeIcon",
//               label: "Card one icon",
//               type: "text",
//               default: "Check",
//             },
//             {
//               key: "rightSecThreeTitle",
//               label: "Card the Title",
//               type: "text",
//               default: "Big family",
//             },
//             {
//               key: "rightSecThreeSubTitle",
//               label: "Card three sub title",
//               type: "text",
//               default: "Millions of members and well-wishers",
//             },
//             {
//               key: "rightSecThreeDescription",
//               label: "Card three description",
//               type: "text",
//               default: "Connected from all over the country",
//             },
//             {
//               key: "bottomTickerItems",
//               label: "Ticker Items (input items by coma [,] seperated)",
//               type: "text",
//               default: "",
//             },
//             {
//               key: "showCardOne",
//               label: "Show card one (show/height)",
//               type: "boolean",
//               group: "settings",
//               default: true,
//             },
//             {
//               key: "showCardTow",
//               label: "Show card two (show/height)",
//               type: "boolean",
//               group: "settings",
//               default: true,
//             },
//             {
//               key: "showCardThree",
//               label: "Show card Three (show/height)",
//               type: "boolean",
//               group: "settings",
//               default: true,
//             },
//           ],
//         },
//         stellarBanner: {
//           label: "Stellar Banner",
//           fields: [
//             {
//               key: "slogan",
//               label: "Slogan",
//               type: "text",
//               default: "Welcome",
//             },
//             {
//               key: "title",
//               label: "Title",
//               type: "text",
//               default: "Build Your Future",
//             },
//             {
//               key: "subtitle",
//               label: "Subtitle",
//               type: "text",
//               default: "Simple, modern, and powerful solutions.",
//             },
//             {
//               key: "primaryButtonTitle",
//               label: "Primary Button Title",
//               type: "text",
//               default: "Get Started",
//             },
//             {
//               key: "primaryButtonLink",
//               label: "Primary Button Link",
//               type: "text",
//               default: "/about",
//             },
//             {
//               key: "secondaryButtonTitle",
//               label: "Secondary Button Title",
//               type: "text",
//               default: "Learn More",
//             },
//             {
//               key: "secondaryButtonLink",
//               label: "Secondary Button Link",
//               type: "text",
//               default: "/contact",
//             },
//             {
//               key: "stats",
//               label: "Stats Items",
//               type: "array",
//               default: [],
//               itemFields: [
//                 {
//                   key: "count",
//                   label: "Count",
//                   type: "text",
//                   default: "1",
//                 },
//                 {
//                   key: "title",
//                   label: "Title",
//                   type: "text",
//                   default: "Default",
//                 },
//               ],
//             },
//             {
//               key: "rightSecOneIcon",
//               label: "Card one icon",
//               type: "text",
//               default: "Check",
//               visible: false,
//             },
//             {
//               key: "rightSecOneTitle",
//               label: "Card one Title",
//               type: "text",
//               default: "Regular publications",
//             },
//             {
//               key: "rightSecOneSubTitle",
//               label: "Card one Sub Title",
//               type: "text",
//               default: "Monthly magazines and Islamic literature",
//             },

//             {
//               key: "rightSecTwoIcon",
//               label: "Card tow icon",
//               type: "text",
//               default: "Calendar",
//             },
//             {
//               key: "rightSecTwoHeaderTitle",
//               label: "Card tow header title",
//               type: "text",
//               default: "Upcoming events",
//             },
//             {
//               key: "rightSecTwoHeaderBadge",
//               label: "Card tow header badge",
//               type: "text",
//               default: "Registration is ongoing.",
//             },
//             {
//               key: "rightSecTowTitle",
//               label: "Card one Title",
//               type: "text",
//               default: "Annual Tablighi Ijtema 2027",
//             },
//             {
//               key: "rightSecTowItems",
//               label: "Section Items",
//               type: "array",
//               default: [],
//               itemFields: [
//                 {
//                   key: "icon",
//                   label: "Icon",
//                   type: "text",
//                   default: "CircleCheck",
//                 },
//                 {
//                   key: "title",
//                   label: "Title",
//                   type: "text",
//                   default: "Default",
//                 },
//               ],
//             },
//             {
//               key: "rightSecTowFooterIcon",
//               label: "Card one icon",
//               type: "text",
//               default: "Check",
//             },
//             {
//               key: "rightSecTowFooterTitle",
//               label: "Card two footer title",
//               type: "text",
//               default: "A gathering of millions of people from home and abroad",
//             },
//             {
//               key: "rightSecThreeIcon",
//               label: "Card one icon",
//               type: "text",
//               default: "Check",
//             },
//             {
//               key: "rightSecThreeTitle",
//               label: "Card the Title",
//               type: "text",
//               default: "Big family",
//             },
//             {
//               key: "rightSecThreeSubTitle",
//               label: "Card three sub title",
//               type: "text",
//               default: "Millions of members and well-wishers",
//             },
//             {
//               key: "rightSecThreeDescription",
//               label: "Card three description",
//               type: "text",
//               default: "Connected from all over the country",
//             },
//             {
//               key: "bottomTickerItems",
//               label: "Ticker Items (input items by coma [,] seperated)",
//               type: "text",
//               default: "",
//             },
//             {
//               key: "showCardOne",
//               label: "Show card one (show/height)",
//               type: "boolean",
//               group: "settings",
//               default: true,
//             },
//             {
//               key: "showCardTow",
//               label: "Show card two (show/height)",
//               type: "boolean",
//               group: "settings",
//               default: true,
//             },
//             {
//               key: "showCardThree",
//               label: "Show card Three (show/height)",
//               type: "boolean",
//               group: "settings",
//               default: true,
//             },
//           ],
//         },
//         gradentBanner: {
//           label: "Gradent Banner",
//           fields: [
//             {
//               key: "slogan",
//               label: "Slogan",
//               type: "text",
//               default: "Welcome",
//             },
//             {
//               key: "title",
//               label: "Title",
//               type: "text",
//               default: "Build Your Future",
//             },
//             {
//               key: "subtitle",
//               label: "Subtitle",
//               type: "text",
//               default: "Simple, modern, and powerful solutions.",
//             },
//             {
//               key: "primayButtonTitle",
//               label: "Primary Button Title",
//               type: "text",
//               default: "Get Started",
//             },
//             {
//               key: "primayButtonLink",
//               label: "Primary Button Link",
//               type: "text",
//               default: "/about",
//             },
//             {
//               key: "seconderyButtonTitle",
//               label: "Secondary Button Title",
//               type: "text",
//               default: "Learn More",
//             },
//             {
//               key: "seconderyButtonLink",
//               label: "Secondary Button Link",
//               type: "text",
//               default: "/contact",
//             },
//             {
//               key: "rightSecOneStats",
//               label: "Stats Items",
//               type: "array",
//               default: [],
//               itemFields: [
//                 {
//                   key: "count",
//                   label: "Count",
//                   type: "text",
//                   default: "1",
//                 },
//                 {
//                   key: "title",
//                   label: "Title",
//                   type: "text",
//                   default: "Default",
//                 },
//               ],
//             },
//             {
//               key: "rightSecOneIcon",
//               label: "Card one icon",
//               type: "text",
//               default: "Check",
//             },
//             {
//               key: "rightSecOneTitle",
//               label: "Card one Title",
//               type: "text",
//               default: "Regular publications",
//             },
//             {
//               key: "rightSecOneSubTitle",
//               label: "Card one Sub Title",
//               type: "text",
//               default: "Monthly magazines and Islamic literature",
//             },

//             {
//               key: "rightSecTwoIcon",
//               label: "Card tow icon",
//               type: "text",
//               default: "Calendar",
//             },
//             {
//               key: "rightSecTwoHeaderTitle",
//               label: "Card tow header title",
//               type: "text",
//               default: "Upcoming events",
//             },
//             {
//               key: "rightSecTwoHeaderBadge",
//               label: "Card tow header badge",
//               type: "text",
//               default: "Registration is ongoing.",
//             },
//             {
//               key: "rightSecTowTitle",
//               label: "Card one Title",
//               type: "text",
//               default: "Annual Tablighi Ijtema 2027",
//             },
//             {
//               key: "rightSecTowItems",
//               label: "Section Items",
//               type: "array",
//               default: [],
//               itemFields: [
//                 {
//                   key: "icon",
//                   label: "Icon",
//                   type: "text",
//                   default: "CircleCheck",
//                 },
//                 {
//                   key: "title",
//                   label: "Title",
//                   type: "text",
//                   default: "Default",
//                 },
//               ],
//             },
//             {
//               key: "rightSecTowFooterIcon",
//               label: "Card one icon",
//               type: "text",
//               default: "Check",
//             },
//             {
//               key: "rightSecTowFooterTitle",
//               label: "Card two footer title",
//               type: "text",
//               default: "A gathering of millions of people from home and abroad",
//             },
//             {
//               key: "rightSecThreeIcon",
//               label: "Card one icon",
//               type: "text",
//               default: "Check",
//             },
//             {
//               key: "rightSecThreeTitle",
//               label: "Card the Title",
//               type: "text",
//               default: "Big family",
//             },
//             {
//               key: "rightSecThreeSubTitle",
//               label: "Card three sub title",
//               type: "text",
//               default: "Millions of members and well-wishers",
//             },
//             {
//               key: "rightSecThreeDescription",
//               label: "Card three description",
//               type: "text",
//               default: "Connected from all over the country",
//             },
//             {
//               key: "bottomTickerItems",
//               label: "Ticker Items (input items by coma [,] seperated)",
//               type: "text",
//               default: "",
//             },
//             {
//               key: "showCardOne",
//               label: "Show card one (show/height)",
//               type: "boolean",
//               group: "settings",
//               default: true,
//             },
//             {
//               key: "showCardTow",
//               label: "Show card two (show/height)",
//               type: "boolean",
//               group: "settings",
//               default: true,
//             },
//             {
//               key: "showCardThree",
//               label: "Show card Three (show/height)",
//               type: "boolean",
//               group: "settings",
//               default: true,
//             },
//           ],
//         },
//         auroraBanner: {
//           label: "Aurora Banner",
//           fields: [
//             {
//               key: "slogan",
//               label: "Slogan",
//               type: "text",
//               default: "Welcome",
//             },
//             {
//               key: "title",
//               label: "Title",
//               type: "text",
//               default: "Build Your Future",
//             },
//             {
//               key: "subtitle",
//               label: "Subtitle",
//               type: "text",
//               default: "Simple, modern, and powerful solutions.",
//             },
//             {
//               key: "primayButtonTitle",
//               label: "Primary Button Title",
//               type: "text",
//               default: "Get Started",
//             },
//             {
//               key: "primayButtonLink",
//               label: "Primary Button Link",
//               type: "text",
//               default: "/about",
//             },
//             {
//               key: "seconderyButtonTitle",
//               label: "Secondary Button Title",
//               type: "text",
//               default: "Learn More",
//             },
//             {
//               key: "seconderyButtonLink",
//               label: "Secondary Button Link",
//               type: "text",
//               default: "/contact",
//             },
//             {
//               key: "items",
//               label: "Items",
//               type: "array",
//               default: [],
//               itemFields: [
//                 {
//                   key: "count",
//                   label: "Count",
//                   type: "text",
//                   default: "1",
//                 },
//                 {
//                   key: "title",
//                   label: "Title",
//                   type: "text",
//                   default: "Default",
//                 },
//               ],
//             },
//           ],
//         },
//       },
//     },

//     /* -------------------- Carousel -------------------- */
//     carousel: {
//       label: "Carousel",
//       defaultTemplate: "classicCarousel",
//       templates: {
//         classicCarousel: {
//           label: "Classic Carousel",
//           fields: [
//             {
//               key: "slides",
//               label: "Slides",
//               type: "array",
//               default: [],
//               sourceKeys: ["slider", "photo", "video"],
//               itemFields: [
//                 {
//                   key: "title",
//                   label: "Title",
//                   type: "text",
//                   default: "Item",
//                 },
//                 {
//                   key: "description",
//                   label: "Description",
//                   type: "textarea",
//                   default: "",
//                 },
//                 { key: "image", label: "Image", type: "image", default: "" },
//               ],
//             },
//             ...autoplayFields,
//             ...carouselStyles,
//           ],
//         },
//         simpleCarousel: {
//           label: "Simple Carousel",
//           fields: [
//             {
//               key: "slides",
//               label: "Slides",
//               type: "array",
//               default: [],
//               sourceKeys: ["slider", "image"],
//               itemFields: [
//                 {
//                   key: "title",
//                   label: "Title",
//                   type: "text",
//                   default: "Slide",
//                 },
//                 { key: "image", label: "Image", type: "image", default: "" },
//               ],
//             },
//             ...autoplayFields,
//           ],
//         },
//         modernCarousel: {
//           label: "Modern Carousel",
//           fields: [
//             {
//               key: "slides",
//               label: "Slides",
//               type: "array",
//               default: [],
//               itemFields: slideFields,
//               sourceKeys: ["slider"],
//             },
//             ...autoplayFields,
//             ...navPagFields,
//           ],
//         },
//         imageCarousel: {
//           label: "Image Carousel",
//           fields: [
//             {
//               key: "images",
//               label: "Images",
//               type: "array",
//               default: [],
//               sourceKeys: ["images", "sliders"],
//               itemFields: [
//                 { key: "image", label: "Image", type: "image", default: "" },
//               ],
//             },
//             ...autoplayFields,
//           ],
//         },
//         immersiveSlider: {
//           label: "Immersive Slider",
//           fields: [
//             {
//               key: "slides",
//               label: "Slides",
//               type: "array",
//               default: [],
//               itemFields: slideFields,
//               sourceKeys: ["slider"],
//             },
//             ...autoplayFields,
//             {
//               key: "height",
//               label: "Height (px)",
//               type: "number",
//               group: "settings",
//               default: 520,
//               min: 240,
//               max: 1000,
//             },
//           ],
//         },
//         simpleImageSlider: {
//           label: "Simple Image Slider",
//           fields: [
//             {
//               key: "slides",
//               label: "Slides",
//               type: "array",
//               default: [],
//               sourceKeys: ["slider", "image"],
//               itemFields: [
//                 { key: "image", label: "Image", type: "image", default: "" },
//               ],
//             },
//             ...autoplayFields,
//             ...navPagFields,
//             {
//               key: "loop",
//               label: "Loop",
//               type: "boolean",
//               group: "settings",
//               default: true,
//             },
//             {
//               key: "height",
//               label: "Height (px)",
//               type: "number",
//               group: "settings",
//               default: 400,
//               min: 160,
//               max: 900,
//             },
//           ],
//         },
//       },
//     },
//   },
// },