export const SUPPORTED_LOCALES = ["en", "ne"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];