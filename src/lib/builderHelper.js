import {
  getComponentConfig,
  getTypeConfig,
  getTemplateConfig,
} from "@/store/default/componentRegistry";

/* =====================================================================
 * PATH UTILS
 * (আপনার প্রোজেক্টে @/lib/helper-এ setByPath থাকলে সেটিই ব্যবহার করুন;
 *  না থাকলে এগুলো ব্যবহার করতে পারেন)
 * =================================================================== */

export const getByPath = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

export const setByPath = (obj, path, value) => {
  const keys = path.split(".");
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let cursor = clone;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
    } else {
      const next = cursor[key];
      cursor[key] = Array.isArray(next) ? [...next] : { ...(next || {}) };
      cursor = cursor[key];
    }
  });
  return clone;
};

export const uid = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

/* =====================================================================
 * CONFIG → DEFAULT STATE BUILDERS
 * =================================================================== */

/**
 * Template-এর field list থেকে default { content, settings } তৈরি করে।
 * field.group === "settings" হলে settings-এ যাবে, নাহলে content-এ।
 */
export const buildDefaults = (component, type, template) => {
  const templateConfig = getTemplateConfig(component, type, template);
  const content = {};
  const settings = {};
  if (!templateConfig) return { content, settings };

  templateConfig.fields.forEach((field) => {
    const target = field.group === "settings" ? settings : content;
    target[field.key] =
      field.type === "array"
        ? (field.default || []).map((item) => ({ ...item, _id: uid("item") }))
        : field.default ?? "";
  });

  return { content, settings };
};

/** Array field-এর নতুন item (itemFields-এর default দিয়ে) */
export const buildArrayItem = (itemFields = []) => {
  const item = { _id: uid("item") };
  itemFields.forEach((f) => {
    item[f.key] = f.default ?? "";
  });
  return item;
};

/**
 * নতুন Component তৈরি — সম্পূর্ণ Configuration থেকে।
 * type/template না দিলে Registry-র default ব্যবহার হবে।
 */
export const createComponent = (componentKey, typeKey, templateKey) => {
  const componentConfig = getComponentConfig(componentKey);
  if (!componentConfig) return null;

  const type = typeKey || componentConfig.defaultType;
  const typeConfig = getTypeConfig(componentKey, type);
  const template = templateKey || typeConfig?.defaultTemplate;

  return {
    id: uid("cmp"),
    component: componentKey,
    type,
    template,
    ...buildDefaults(componentKey, type, template),
    is_visible: true,
  };
};

/** নতুন Section */
export const createSection = (name = "New Section") => ({
  id: uid("sec"),
  name,
  is_visible: true,
  components: [],
});

/**
 * Type বা Template change হলে component-কে নতুন Template-এর
 * default-এ migrate করে। মিলে যাওয়া key-গুলোর পুরনো value ধরে রাখে।
 */
export const migrateComponent = (component, nextType, nextTemplate) => {
  const typeConfig = getTypeConfig(component.component, nextType);
  const template =
    nextTemplate && typeConfig?.templates?.[nextTemplate]
      ? nextTemplate
      : typeConfig?.defaultTemplate;

  const defaults = buildDefaults(component.component, nextType, template);

  const preserve = (freshObj, oldObj = {}) => {
    const merged = { ...freshObj };
    Object.keys(merged).forEach((key) => {
      if (oldObj[key] !== undefined && typeof merged[key] !== "object") {
        merged[key] = oldObj[key];
      }
      if (Array.isArray(merged[key]) && Array.isArray(oldObj[key]) && oldObj[key].length) {
        merged[key] = oldObj[key];
      }
    });
    return merged;
  };

  return {
    ...component,
    type: nextType,
    template,
    content: preserve(defaults.content, component.content),
    settings: preserve(defaults.settings, component.settings),
  };
};

/**
 * Data Source থেকে আসা mapped object-কে template-এর shape-এ merge করে।
 * শুধুমাত্র shape-এ থাকা key-গুলোই নেওয়া হয় — বাকি সব বাদ।
 * ফলে একই source একাধিক ভিন্ন template-এ ব্যবহার করা যায়।
 */
export const mergeIntoShape = (shape = {}, data = {}) => {
  const merged = { ...shape };
  Object.keys(shape).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      merged[key] = data[key];
    }
  });
  return merged;
};

/** Array-এর মধ্যে item reorder (drag & drop) */
export const reorderArray = (list, fromIndex, toIndex) => {
  const result = [...list];
  const [moved] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, moved);
  return result;
};