import dayjs from "dayjs";
import "dayjs/locale/bn";
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";

export const asset = (path) => {
  const URL = import.meta.env.VITE_BASE_URL;
  return `${URL}/public/uploads/${path}`;
};

export const formatDate = (date, format = "DD MMM YY", locale = "en") => {
  return dayjs(date).locale(locale).format(format);
};

export const getWords = (text, limit = 20) => {
  if (!text) return "";
  return text.trim().split(/\s+/).slice(0, limit).join(" ") + " ...";
};

export const getHtmlContent = (data, limit) => {
  if (!data) return "";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = data;

  const text = tempDiv.textContent || tempDiv.innerText || "";
  const words = text.split(" ").filter(Boolean);

  const limitedText =
    words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "");

  return limitedText;
};

export const getUUId = () => {
  return uuidv4();
};

export const setByPath = (obj, path, value) =>
  produce(obj, (draft) => {
    const keys = path.split(".");
    let current = draft;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  });

export const safeJsonParse = (data, fallback = {}) => {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
};


export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};
