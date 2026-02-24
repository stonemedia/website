export type CategorySlug =
  | "ott-dubbing"
  | "ad-campaigns"
  | "audio-post"
  | "ai-integration"
  | "accessibility"
  | "compliance"
  | "syndication";

export type Project = {
  slug: string;
  title: string;
  year: string;
  category: string;       // human-readable label
  categorySlug: CategorySlug;
  meta: string;
  featured?: boolean;

  // Optional: project-specific HLS playlist
  hlsSrc?: string;
};

// Optional fallback for projects that don't have hlsSrc yet
export const DEFAULT_HLS =
  "https://stonemediawebsite.web.app/hls/project1/master.m3u8";

export const projects: Project[] = [
  // OTT / Movie Dubbing
  {
    slug: "ott-dub-01",
    title: "OTT Dubbing Package",
    year: "2025",
    category: "OTT / Movie Dubbing",
    categorySlug: "ott-dubbing",
    meta: "Casting · direction · sync · mix · QC",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/ott-dub-01/master.m3u8",
  },
  {
    slug: "ott-dub-02",
    title: "Feature Film Localization",
    year: "2025",
    category: "OTT / Movie Dubbing",
    categorySlug: "ott-dubbing",
    meta: "Multi-language delivery · platform-ready exports",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/ott-dub-02/master.m3u8",
  },

  // Ad Campaigns
  {
    slug: "ad-campaign-01",
    title: "Ad Campaign Localization",
    year: "2025",
    category: "Ad Campaigns",
    categorySlug: "ad-campaigns",
    meta: "Transcreation · VO · mix · multiple deliverables",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/ad-campaign-01/master.m3u8",
  },
  {
    slug: "ad-campaign-02",
    title: "Brand Film (Regional Versions)",
    year: "2025",
    category: "Ad Campaigns",
    categorySlug: "ad-campaigns",
    meta: "Direction · VO options · fast versioning",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/ad-campaign-02/master.m3u8",
  },

  // Audio Post
  {
    slug: "audio-post-01",
    title: "Dialogue Cleanup + Restoration",
    year: "2025",
    category: "Audio Post",
    categorySlug: "audio-post",
    meta: "Noise reduction · clicks · hum · dialogue clarity",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/audio-post-01/master.m3u8",
  },
  {
    slug: "audio-post-02",
    title: "Mix / QC / Deliverables",
    year: "2025",
    category: "Audio Post",
    categorySlug: "audio-post",
    meta: "Loudness compliance · stems · final exports",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/audio-post-02/master.m3u8",
  },

  // AI Integration
  {
    slug: "ai-integration-01",
    title: "AI-Assisted Localization Workflow",
    year: "2025",
    category: "AI Integration",
    categorySlug: "ai-integration",
    meta: "Workflow design · QC loops · version automation",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/ai-integration-01/master.m3u8",
  },

  // Accessibility
  {
    slug: "accessibility-01",
    title: "Accessibility Assets (AD/CC)",
    year: "2025",
    category: "Accessibility",
    categorySlug: "accessibility",
    meta: "Audio Description + Closed Captions aligned to platform specs",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/accessibility-01/master.m3u8",
  },
  {
    slug: "accessibility-02",
    title: "Subtitles + QC System",
    year: "2025",
    category: "Accessibility",
    categorySlug: "accessibility",
    meta: "Timing fixes · reading comfort · style guide alignment",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/accessibility-02/master.m3u8",
  },

  // Compliance
  {
    slug: "compliance-01",
    title: "Compliance Review + Versioning",
    year: "2025",
    category: "Compliance",
    categorySlug: "compliance",
    meta: "Censor-sensitive language handling · documentation discipline",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/compliance-01/master.m3u8",
  },
  {
    slug: "compliance-02",
    title: "Platform Readiness Package",
    year: "2025",
    category: "Compliance",
    categorySlug: "compliance",
    meta: "Checks + fixes + structured deliverables",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/compliance-02/master.m3u8",
  },

  // Syndication
  {
    slug: "syndication-01",
    title: "Syndication Packaging",
    year: "2025",
    category: "Syndication",
    categorySlug: "syndication",
    meta: "Metadata · version management · platform-ready masters",
    // hlsSrc: "https://stonemediawebsite.web.app/hls/syndication-01/master.m3u8",
  },
];