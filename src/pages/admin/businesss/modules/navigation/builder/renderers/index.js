import HeroRenderer from "./HeroRenderer";
import SplitCardRenderer from "./SplitCardRenderer";
import ListSectionRenderer from "./ListSectionRenderer";

/**
 * RENDERER REGISTRY
 * componentRegistry.js-এর `renderer` key → React Component
 *
 * নতুন Component যোগ করলে:
 *   1) componentRegistry.js-এ config যোগ করুন (renderer: "myComponent")
 *   2) এখানে map-এ যোগ করুন: myComponent: MyComponentRenderer
 * ব্যস — Preview automatically render করবে।
 */
export const RENDERERS = {
  hero: HeroRenderer,
  information: SplitCardRenderer,
  list: ListSectionRenderer,
};

export const getRenderer = (rendererKey) => RENDERERS[rendererKey] || null;

