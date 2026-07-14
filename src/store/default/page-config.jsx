import { LayoutGrid } from "lucide-react";

export const fullPageConfig = [
  {
    type: "banner",
    name: "Hero Banner",
    icon: <LayoutGrid className="h-4 w-4" />,
    description: "Centered hero with heading, subheading and CTA",
    category: "hero",
    is_visible: true,
    preview:
      "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
    tags: ["hero", "centered", "cta"],
    template: "classicBanner",
    classicBanner: {
      content: {
        slogan: "দাওয়াহ ও তাবলীগের সেবায়",
        title: "This is the classic title",
        about: "This is my about us",
        buttons: [
          {
            title: "যোগাযোগ করুন",
            link: "/contact",
          },
        ],
      },
    },
  },
  {
    type: "banner",
    name: "Hero Banner",
    icon: <LayoutGrid className="h-4 w-4" />,
    description: "Centered hero with heading, subheading and CTA",
    category: "hero",
    is_visible: true,
    preview:
      "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
    tags: ["hero", "centered", "cta"],
    template: "stellarBanner",
    classicBanner: {
      content: {
        slogan: "দাওয়াহ ও তাবলীগের সেবায়",
        title: "This is the classic title",
        about: "This is my about us",
        buttons: [
          {
            title: "যোগাযোগ করুন",
            link: "/contact",
          },
        ],
      },
    },
  },
  {
    type: "banner",
    name: "Hero Banner",
    icon: <LayoutGrid className="h-4 w-4" />,
    description: "Centered hero with heading, subheading and CTA",
    category: "hero",
    is_visible: true,
    preview:
      "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
    tags: ["hero", "centered", "cta"],
    template: "simpleBanner",
    classicBanner: {
      content: {
        slogan: "দাওয়াহ ও তাবলীগের সেবায়",
        title: "This is the classic title",
        about: "This is my about us",
        buttons: [
          {
            title: "যোগাযোগ করুন",
            link: "/contact",
          },
        ],
      },
    },
  },
  {
    type: "carousel",
    name: "Hero carousel",
    icon: <LayoutGrid className="h-4 w-4" />,
    description: "Centered hero with heading, subheading and CTA",
    category: "hero",
    is_visible: true,
    preview:
      "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
    tags: ["hero", "centered", "cta"],
    template: "classicCarousel",
    classicCarousel: {
      content: {},
    },
  },
  {
    type: "information",
    name: "Information details",
    icon: <LayoutGrid className="h-4 w-4" />,
    description: "You can manage by the component about details related data",
    category: "hero",
    is_visible: true,
    preview:
      "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
    tags: ["hero", "centered", "cta"],
    template: "classic",
    classic: {
      content: {
        sectionTitle: "This is information sectiodn title",
        sectionSubTitle: "information sectiodn sub title",
        title: "information title",
        subTitle: "information sub title",
        shortDescription: "This is short description",
        fullDescription: "Full descrition",
        detailsButton: "More details...",
        image:
          "http://api.orgsaas.test/storage/uploads/1/images/6a4e277112fac.jpeg",
      },
    },
  },
  {
    type: "list",
    name: "List renderer",
    icon: <LayoutGrid className="h-4 w-4" />,
    description:
      "You can manage by the component List related data. as like News List , User list ,Video List as card view",
    category: "hero",
    is_visible: true,
    preview:
      "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
    tags: ["hero", "centered", "cta"],
    defaultSettings: {
      classicBanner: {
        content: {},
        style: {},
      },
      stellarBanner: {
        content: {},
        style: {},
      },
      simpleBanner: {
        content: {},
        style: {},
      },
    },
  },
];

export const defaultPageConfig = [
  {
    type: "banner",
    name: "Hero Banner",
    icon: <LayoutGrid className="h-4 w-4" />,
    description: "Centered hero with heading, subheading and CTA",
    category: "hero",
    is_visible: true,
    preview:
      "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
    tags: ["hero", "centered", "cta"],
    template: "classicBanner",
    classicBanner: {
      content: {
        slogan: "দাওয়াহ ও তাবলীগের সেবায়",
        title: "This is the classic title",
        about: "This is my about us",
        buttons: [
          {
            title: "যোগাযোগ করুন",
            link: "/contact",
          },
        ],
      },
    },
  },
  {
    type: "carousel",
    name: "Hero carousel",
    icon: <LayoutGrid className="h-4 w-4" />,
    description: "Centered hero with heading, subheading and CTA",
    category: "hero",
    is_visible: true,
    preview:
      "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
    tags: ["hero", "centered", "cta"],
    template: "classicCarousel",
    classicCarousel: {
      content: {},
      style: {},
    },
  },
  {
    type: "information",
    name: "Information details",
    icon: <LayoutGrid className="h-4 w-4" />,
    description: "You can manage by the component about details related data",
    category: "hero",
    is_visible: true,
    preview:
      "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
    tags: ["hero", "centered", "cta"],
    template: "classic",
    classic: {
      content: {
        title: "কেন্দ্রীয় সভাপতির বাণী",
        subTitle: "Nesciunt eaque sed",
        shortDescription:
          "পরম করুণাময় মহান সৃষ্টিকর্তার অশেষ কৃপায় আমাদের সংগঠন আজ ঐক্য, সততা ও সেবার আদর্শকে ধারণ করে সমাজের কল্যাণে নিরলসভাবে কাজ করে যাচ্ছে। প্রতিষ্ঠালগ্ন থেকে আমাদের লক্ষ্য ছিল মানবিক মূল্যবোধ, নৈতিক শিক্ষা এবং সামাজিক দায়বদ্ধতার মাধ্যমে একটি সুন্দর ও সমৃদ্ধ সমাজ গঠন করা।\n<br/><br/>\nআমরা বিশ্বাস করি, একটি সংগঠনের প্রকৃত শক্তি তার সদস্যদের আন্তরিকতা, পারস্পরিক সহযোগিতা এবং নিষ্ঠার মধ্যে নিহিত। সকলের সম্মিলিত প্রচেষ্টায় আমাদের প্রতিটি কার্যক্রম নতুন প্রজন্মের জন্য অনুপ্রেরণার উৎস হয়ে উঠতে গুরুত্বপূর্ণ ভূমিকা পালন করবে।\n<br/><br/>\nবর্তমান যুগে জ্ঞান, প্রযুক্তি এবং মানবিকতার সমন্বয় ঘটিয়ে আমাদের এগিয়ে যেতে হবে। সময়ের চ্যালেঞ্জ মোকাবিলায় দক্ষ নেতৃত্ব, সুশাসন এবং স্বচ্ছতার মাধ্যমে আমরা আমাদের কার্যক্রমকে আরও গতিশীল ও ফলপ্রসূ করে তুলতে প্রতিশ্রুতিবদ্ধ।",
        fullDescription:
          "পরম করুণাময় মহান সৃষ্টিকর্তার অশেষ কৃপায় আমাদের সংগঠন আজ ঐক্য, সততা ও সেবার আদর্শকে ধারণ করে সমাজের কল্যাণে নিরলসভাবে কাজ করে যাচ্ছে। প্রতিষ্ঠালগ্ন থেকে আমাদের লক্ষ্য ছিল মানবিক মূল্যবোধ, নৈতিক শিক্ষা এবং সামাজিক দায়বদ্ধতার মাধ্যমে একটি সুন্দর ও সমৃদ্ধ সমাজ গঠন করা।\n\nআমরা বিশ্বাস করি, একটি সংগঠনের প্রকৃত শক্তি তার সদস্যদের আন্তরিকতা, পারস্পরিক সহযোগিতা এবং নিষ্ঠার মধ্যে নিহিত। সকলের সম্মিলিত প্রচেষ্টায় আমাদের প্রতিটি কার্যক্রম নতুন প্রজন্মের জন্য অনুপ্রেরণার উৎস হয়ে উঠবে এবং সমাজে ইতিবাচক পরিবর্তন আনতে গুরুত্বপূর্ণ ভূমিকা পালন করবে।\n\nবর্তমান যুগে জ্ঞান, প্রযুক্তি এবং মানবিকতার সমন্বয় ঘটিয়ে আমাদের এগিয়ে যেতে হবে। সময়ের চ্যালেঞ্জ মোকাবিলায় দক্ষ নেতৃত্ব, সুশাসন এবং স্বচ্ছতার মাধ্যমে আমরা আমাদের কার্যক্রমকে আরও গতিশীল ও ফলপ্রসূ করে তুলতে প্রতিশ্রুতিবদ্ধ।\n\nআমি আমাদের সকল সদস্য, শুভানুধ্যায়ী এবং সহযোগী প্রতিষ্ঠানের প্রতি আন্তরিক কৃতজ্ঞতা প্রকাশ করছি। আপনাদের অব্যাহত সমর্থন ও আন্তরিক অংশগ্রহণই আমাদের এগিয়ে চলার প্রধান শক্তি।\n\nআসুন, আমরা সবাই মিলে ন্যায়, মানবতা ও উন্নয়নের আদর্শকে ধারণ করে একটি সুন্দর, সমৃদ্ধ ও কল্যাণমুখী সমাজ বিনির্মাণে একযোগে কাজ করি।\n\nসকলের সুস্বাস্থ্য, সাফল্য ও সমৃদ্ধি কামনা করছি।\n\nধন্যবাদান্তে,\n\nকেন্দ্রীয় সভাপতি\nসেবাই আমাদের অঙ্গীকার, উন্নয়ন আমাদের লক্ষ্য।",
        image: "uploads/1/modules/6a362caa03afa.webp",
        imageFullPath:
          "http://api.orgsaas.test/storage/uploads/1/modules/6a362caa03afa.webp",
        buttonText: "আরও জানুন",
        slug: "kendreey-svaptir-banee",
        meta: [],
      },
      style: {},
    },
  },
  {
    type: "list",
    name: "List renderer",
    icon: <LayoutGrid className="h-4 w-4" />,
    description:
      "You can manage by the component List related data. as like News List , User list ,Video List as card view",
    category: "hero",
    is_visible: true,
    preview:
      "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
    tags: ["hero", "centered", "cta"],
    template: "classic",
    classic: {},
  },
];
