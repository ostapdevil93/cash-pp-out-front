/** Базовые URL микросервисов */
export const BASE_URLS = {
  CBS: import.meta.env.VITE_API_CBS,
  LINKS: import.meta.env.VITE_API_LINKS,
  PPA: import.meta.env.VITE_API_PPA,
} as const;
