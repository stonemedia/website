export type Service = {
  id: string;
  label: string;           // short tab label
  title: string;           // modal title
  summary: string;         // 1–2 lines in modal
  body: string;            // short paragraph
  bullets: string[];       // “what you get”
  hasWork?: boolean;
  workCategory?: string;   // route slug like "dubbing"
};

export const SERVICES: Service[] = [
  {
    id: "dubbing",
    label: "Dubbing",
    title: "Dubbing",
    summary: "Performance-first dubbing engineered for consistency, speed, and sync.",
    body:
      "From casting and creative adaptation to direction, recording, QC, and final mix — we deliver dubbing that feels native, not translated.",
    bullets: [
      "Casting + character mapping",
      "Lip-sync / performance direction",
      "Multi-language pipelines + QC",
      "Broadcast/platform-ready delivery",
    ],
    hasWork: true,
    workCategory: "dubbing",
  },
  {
    id: "localisation",
    label: "Localization",
    title: "Localization",
    summary: "Cultural adaptation + workflow control across languages and platforms.",
    body:
      "Localization is more than translation — it’s intent, tone, and audience context. We maintain fidelity while ensuring natural flow.",
    bullets: [
      "Creative adaptation / transcreation",
      "Terminology + style consistency",
      "Sub/dub alignment workflows",
      "Delivery templates per platform",
    ],
    hasWork: true,
    workCategory: "localization",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    title: "Accessibility (AD/CC)",
    summary: "Audio Description + Closed Captions that feel premium, not mechanical.",
    body:
      "We craft accessibility tracks with pacing, clarity, and intent — designed to match the viewing experience and platform standards.",
    bullets: [
      "Audio Description writing + voicing",
      "Closed Captions (SDH) standards",
      "Timing/QC + platform compliance",
      "Multi-language accessibility options",
    ],
    hasWork: true,
    workCategory: "accessibility",
  },
  {
    id: "campaign",
    label: "Campaign Localization",
    title: "Campaign Localization",
    summary: "Turn one campaign into many — language, culture, rhythm, and format.",
    body:
      "We localize ads, promos, and brand films for Indian languages with creative adaptation, VO, mix, and fast iterations.",
    bullets: [
      "Ad/Promo transcreation",
      "VO/artist options + direction",
      "Mix/master for multiple deliverables",
      "Fast-turnaround versioning",
    ],
    hasWork: true,
    workCategory: "campaign-localization",
  },
  {
    id: "subtitling",
    label: "Subtitling",
    title: "Subtitling",
    summary: "Readable, natural subtitles that respect tone, timing, and intent.",
    body:
      "We handle translation, adaptation, timing fixes, and final QC — optimized for viewer comfort and platform rules.",
    bullets: [
      "SRT/WebVTT delivery",
      "Reading speed + line breaks",
      "Post-dub subtitle accuracy updates",
      "QC checks + style guide alignment",
    ],
    hasWork: true,
    workCategory: "subtitling",
  },
];