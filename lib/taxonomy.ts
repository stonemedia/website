export const SERVICE_SLUGS = [
  "dubbing-localization",
  "audio-post",
  "ai-integration",
  "accessibility",
  "compliance",
  "syndication",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const CATEGORIES_BY_SERVICE: Record<ServiceSlug, readonly string[]> = {
  "dubbing-localization": ["ott-dubbing", "ad-campaigns"],
  "audio-post": ["audio-post"],
  "ai-integration": ["ai-integration"],
  "accessibility": ["accessibility"],
  "compliance": ["compliance"],
  "syndication": ["syndication"],
} as const;