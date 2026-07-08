import dayjs from 'dayjs';
import 'dayjs/locale/bn';

export const asset = (path) => {
    const URL = import.meta.env.VITE_BASE_URL;
    return `${URL}/public/uploads/${path}`;
}


export const formatDate = (date, format = 'DD MMM YY', locale = 'en') => {
    return dayjs(date).locale(locale).format(format);
}

export const getWords = (text, limit = 20) => {
  if (!text) return "";
  return text
    .trim()
    .split(/\s+/)
    .slice(0, limit)
    .join(" ");
}


export const getHtmlContent = (data, limit) => {
    if (!data) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;

    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.split(' ').filter(Boolean);

    const limitedText =
      words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');

    return limitedText;
  };
