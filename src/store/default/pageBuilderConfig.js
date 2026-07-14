// Icon JSX আকারে রাখবো না, string রাখবো (save/serialize-এর জন্য)
export const COMPONENT_TYPES = {
  INFORMATION: "information",
};

export const informationConfig = {
  type: COMPONENT_TYPES.INFORMATION,
  name: "Information details",
  iconName: "Info",
  description: "About / details related content section",
  category: "content",
  is_visible: true,
  tags: ["about", "details", "info"],

  // কোন template active সেটা এখানে
  template: "classic",

  // নিয়ম: component[template] = { content, style }
  classic: {
    content: {
      sectionTitle: "আমাদের সম্পর্কে",
      sectionSubTitle: "সংক্ষিপ্ত পরিচিতি",
      title: "আমীরে জামা'আতের পরিচয়",
      subTitle: "একটি সংক্ষিপ্ত উপ-শিরোনাম",
      shortDescription: "এখানে সংক্ষিপ্ত বর্ণনা থাকবে...",
      fullDescription: "এখানে বিস্তারিত বর্ণনা থাকবে...",
      detailsButton: "More Details",
      image: "https://via.placeholder.com/600x400",
      slug: null,
    },
    style: {
      imagePosition: "left",
      bgColor: "bg-white",
    },
  },
};

// Popover-এ যে list দেখাও
export const defaultPageConfig = [
  informationConfig,
  // পরে banner, carousel, list এখানে যোগ হবে — একই shape মেনে
];