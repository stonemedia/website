"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";

type ServiceCTA = {
  label: string;
  href: string;
};

type Service = {
  id: string;
  label: string;
  title: string;
  summary: ReactNode;
  body: ReactNode;
  bullets: string[];
  ctas?: ServiceCTA[];
};

const SERVICES: Service[] = [
  {
    id: "dubbing-localization",
    label: "Dubbing & Localization",
    title: "Dubbing & Localization",
    summary: (
      <>
        <span className="italic text-lg font-medium text-white md:text-xl">
          The Voice Studio
        </span>
        <br />
        Performance comes first
      </>
    ),
    body: (
      <>
        <p>
          A good dub isn’t just about syncing lips. It’s about breath, intention,
          and emotion. We work closely with actors — sometimes original cast,
          sometimes new voices — to make performances feel natural in every
          language. From theatrical releases to micro-dramas and YouTube series,
          every screen demands a slightly different tone. We adapt accordingly.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px w-8 bg-[#7A0E14]" />
          <span className="text-xs uppercase tracking-[0.25em] text-white/80">
            We work across
          </span>
        </div>
      </>
    ),
    bullets: [
      "Original dialogue dubbing & direction",
      "Localization in all Indian languages",
      "OTT films & satellite series",
      "Trailers and promos",
      "Micro-dramas & digital series",
      "E-learning & corporate content",
      "IVR systems & brand communication",
      "Animation & children’s programming",
    ],
    ctas: [
      {
        label: "View OTT / Movie Dubbing",
        href: "/work/category/ott-dubbing",
      },
      {
        label: "View Ad Campaign Work",
        href: "/work/category/ad-campaigns",
      },
    ],
  },
  {
    id: "audio-post",
    label: "Audio Post Production",
    title: "Audio Post Production",
    summary:
      "Clean, controlled, delivery-ready audio — restoration, mix, M&E, and QC.",
    body:
      "We handle the finishing layer that makes content feel premium: restoration, dialogue polish, sound design support, loudness compliance, and final exports.",
    bullets: [
      "Audio restoration + dialogue cleanup",
      "Mix / stems / M&E prep",
      "Loudness + spec compliance",
      "QC passes + versioning",
    ],
    ctas: [
      {
        label: "View Work",
        href: "/work/category/audio-post",
      },
    ],
  },
  {
    id: "ai-integration",
    label: "AI Workflow Systems",
    title: "AI Workflow Systems",
    summary:
      "AlterDub is our AI workflow initiative focused on dubbing and localization — building studio-ready systems that improve speed, consistency, and version control while keeping creative direction and QC firmly in human hands.",
    body:
      "We are developing practical AI layers around voice workflows, review cycles, multilingual delivery, and production coordination — focused on real-world adoption, not experimental demos.",
    bullets: [
      "AI-assisted dubbing workflow design",
      "Human-in-the-loop voice and QC systems",
      "Automation for versions, reviews, and delivery",
      "Future-ready studio pipeline development",
    ],
    ctas: [
      {
        label: "Learn More",
        href: "/alterdub",
      },
    ],
  },
  {
  id: "accessibility",
  label: "Accessibility Assets",
  title: "Accessibility Assets",
  summary:
    "Accessibility assets built with clarity, rhythm, compliance — and respect for the viewing experience.",
  body:
    "Accessibility is not an add-on. It is part of how content travels. We craft captions, SDH, subtitles, and audio description with language sensitivity, reading comfort, emotional pacing, and platform standards in mind. Through XsAble App, enjoy synchronized accessibility experiences that keep AD and caption assets aligned with program audio.",
  bullets: [
    "Closed Captions / SDH with reading comfort",
    "Audio Description writing + voicing",
    "Subtitle timing, spotting + accessibility QC",
    "Sync-ready accessibility assets for XsAble workflows",
    "Platform compliance + delivery readiness",
  ],
  ctas: [
    {
      label: "View Work",
      href: "/work/category/accessibility",
    },
    {
      label: "XsAble App",
      href: "/xsable",
    },
  ],
},
  {
    id: "compliance",
    label: "Censor & Compliance",
    title: "Censor & Compliance",
    summary:
      "Compliance-first localization and delivery planning for smoother releases.",
    body:
      "We reduce release risk by aligning language, on-screen text, captions, and deliverables with compliance expectations early in the workflow.",
    bullets: [
      "Compliance review support",
      "Censor-sensitive language handling",
      "Versioning + documentation discipline",
      "Delivery readiness guidance",
    ],
    ctas: [],
  },
  {
    id: "syndication",
    label: "Syndication",
    title: "Syndication",
    summary:
      "Packaging content for multi-market distribution — versions, metadata, and delivery discipline.",
    body:
      "We support syndication-ready pipelines: consistent naming, version management, asset packaging, and platform-friendly deliveries.",
    bullets: [
      "Packaging + version management",
      "Metadata/label discipline",
      "Platform-ready masters",
      "Repeatable delivery workflow",
    ],
    ctas: [],
  },
];

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

function getPanelTitle(serviceId: string) {
  if (serviceId === "ai-integration") return "AlterDub";
  if (serviceId === "accessibility") return "Work + Accessibility Tech";
  if (serviceId === "compliance") return "Compliance Support";
  if (serviceId === "syndication") return "Syndication Support";
  return "Work Showcase";
}

function getPanelDescription(serviceId: string) {
  if (serviceId === "ai-integration") {
    return "AI-assisted dubbing workflows built for modern studios.";
  }

  if (serviceId === "accessibility") {
    return "Explore accessibility work samples, or view the XsAble technology initiative.";
  }

  if (serviceId === "compliance") {
    return "Planning, review, and delivery discipline to reduce release risk.";
  }

  if (serviceId === "syndication") {
    return "Packaging, versioning, metadata, and delivery discipline for multi-market distribution.";
  }

  return "Explore category-specific work samples with multilingual playback.";
}

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(
    SERVICES[0]?.id ?? "dubbing-localization"
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredCta, setHoveredCta] = useState<string | null>(null);

  const active = useMemo(
    () => SERVICES.find((service) => service.id === activeId),
    [activeId]
  );

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onClickTab = (id: string) => {
    setActiveId(id);
    setHoveredCta(null);
    setOpen(true);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0B0B0F] text-white">
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="h-full w-full scale-[1.06] object-cover opacity-[0.45] transition-transform duration-[4000ms] ease-out"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute -left-40 -top-40 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(122,14,20,0.28),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-40 left-[40%] h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,rgba(70,100,255,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-b from-transparent via-[#030509]/60 to-[#030509]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32">
        <h1 className="text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.02em] md:text-7xl">
          Engineering
          <br />
          <span className="text-white/90">Content Globalization</span>
        </h1>

        <div className="mt-8 h-px w-24 bg-gradient-to-r from-[#7A0E14] to-transparent" />

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#C2C2C2]">
          Multilingual production pipelines, accessibility systems, and AI-ready
          workflows — built for scale, consistency, and platform-ready delivery.
        </p>

        <div className="mt-10 max-w-4xl">
          <div className="flex flex-wrap gap-3">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => onClickTab(service.id)}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={[
                  "inline-flex items-center justify-center border px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors",
                  (hoveredId ?? activeId) === service.id
                    ? "border-[#7A0E14] bg-[#7A0E14] text-white"
                    : "border-[#F5F5F5]/60 bg-transparent text-white/85 hover:border-[#7A0E14] hover:bg-[#7A0E14]",
                ].join(" ")}
              >
                {service.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/40">
            Select a service to explore details & work.
          </p>
        </div>
      </div>

      {open && active && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-5xl -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c16]">
              <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                    Service
                  </div>
                  <h3 className="mt-1 text-2xl font-semibold text-white md:text-3xl">
                    {active.title}
                  </h3>
                  <div className="mt-2 text-sm text-white/65">
                    {active.summary}
                  </div>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70 transition hover:border-white/25 hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="grid min-h-0 flex-1 gap-8 overflow-y-auto px-6 py-6 md:grid-cols-5">
                <div className="md:col-span-3">
                  <div className="text-sm leading-6 text-white/70">
                    {active.body}
                  </div>

                  <div className="mt-6 space-y-3">
                    {active.bullets.map((bullet, index) => (
                      <div
                        key={`${active.id}-${index}`}
                        className="flex items-start gap-3 text-sm text-white/75"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7A0E14]" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex md:col-span-2">
                  <div className="mt-auto flex w-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm font-medium text-white">
                      {getPanelTitle(active.id)}
                    </div>

                    <p className="mt-2 text-xs text-[#A0A0A0]">
                      {getPanelDescription(active.id)}
                    </p>

                    <div className="mt-auto flex flex-col gap-3 pt-6">
                      {(active.ctas ?? []).map((cta, index) => {
                        const isActive = hoveredCta
                          ? hoveredCta === cta.href
                          : index === 0;

                        return (
                          <Link
                            key={cta.href}
                            href={cta.href}
                            onClick={() => setOpen(false)}
                            onMouseEnter={() => setHoveredCta(cta.href)}
                            onMouseLeave={() => setHoveredCta(null)}
                            className={[
  "inline-flex items-center justify-center px-5 py-3 text-xs transition-all duration-300",
  cta.href === "/xsable"
    ? "normal-case tracking-[0.08em]"
    : "uppercase tracking-[0.25em]",
  isActive
    ? "border border-[#7A0E14] bg-[#7A0E14] text-white"
    : "border border-[#F5F5F5]/60 bg-transparent text-white/85 hover:border-[#7A0E14] hover:bg-[#7A0E14] hover:text-white",
].join(" ")}
                          >
                            {cta.label}
                          </Link>
                        );
                      })}

                      <a
                        href="/#contact"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center justify-center border border-[#F5F5F5]/40 bg-transparent px-5 py-3 text-xs uppercase tracking-[0.25em] text-white/70 transition-colors hover:border-[#7A0E14] hover:bg-[#7A0E14] hover:text-white"
                      >
                        Connect
                      </a>
                    </div>

                    <div className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/40">
                      Tip: Press <span className="text-white/60">Esc</span> to
                      close
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-black/35" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
