"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";

type ServiceCTA = { label: string; href: string };

type Service = {
  id: string;
  label: string; // tab label
  title: string; // modal title
  summary: ReactNode;
  body: string;
  bullets: string[];
  ctas?: ServiceCTA[];
};

const SERVICES: Service[] = [
  {
    id: "dubbing-localization",
    label: "Dubbing & Localization",
    title: "Dubbing & Localization",
    summary:
	(
	<>
      <h2><span className="italic text-lg md:text-xl font-medium text-white">The Voice Studio</span>
       </h2> 
       <br />
       Performance comes first
	</>
	),
    body: (
  <>
    <p>
      A good dub isn’t just about syncing lips. It’s about breath, intention, and emotion.
      We work closely with actors — sometimes original cast, sometimes new voices —
      to make performances feel natural in every language. From theatrical releases
      to micro-dramas and YouTube series, every screen demands a slightly different tone.
      We adapt accordingly.
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
    label: "AI Integration",
    title: "AI Integration",
    summary:
      "AI-assisted workflows designed for real-world delivery — with humans in control.",
    body:
      "We integrate AI where it creates leverage: speed, repeatability, and workflow discipline — without compromising creative decisions and QC standards.",
    bullets: [
      "Workflow design + integration",
      "Human-in-the-loop QC systems",
      "Automation for versioning",
      "Future-ready pipeline planning",
    ],
    ctas: [
  {
    label: "View Work",
    href: "/work/category/ai-integration",
  },
],
  },
  {
    id: "accessibility",
    label: "Accessibility Assets",
    title: "Accessibility Assets",
    summary:
      "AD/CC/subtitles built with taste, clarity, pacing — and platform compliance.",
    body:
      "Accessibility shouldn’t feel robotic. We craft captions and audio description with viewing experience, rhythm, and standards in mind.",
    bullets: [
      "Closed Captions / SDH",
      "Audio Description writing + voicing",
      "Subtitle timing + reading comfort",
      "QC + platform compliance",
    ],
    ctas: [
  {
    label: "View Work",
    href: "/work/category/accessibility",
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
    ctas: [
  {
    label: "View Work",
    href: "/work/category/compliance",
  },
],
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
    ctas: [
  {
    label: "View Work",
    href: "/work/category/syndication",
  },
],
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

export default function Hero() {
  

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(SERVICES[0]?.id ?? "dubbing-localization");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredCta, setHoveredCta] = useState<string | null>(null);

  const active = useMemo(() => SERVICES.find((s) => s.id === activeId), [activeId]);

  useLockBodyScroll(open);

  // Only show tabs while hero is visible
  

  // Esc to close modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onClickTab = (id: string) => {
    setActiveId(id);
    setOpen(true);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0B0B0F] text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover opacity-[0.45] scale-[1.06] transition-transform duration-[4000ms] ease-out"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* Glow layers + bottom dissolve */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(122,14,20,0.28),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-40 left-[40%] h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,rgba(70,100,255,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-b from-transparent via-[#030509]/60 to-[#030509]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.02em] leading-[0.95] uppercase">
          Engineering
          <br />
          <span className="text-white/90">Content Globalization</span>
        </h1>

        <div className="mt-8 h-[1px] w-24 bg-gradient-to-r from-[#7A0E14] to-transparent" />

        <p className="mt-8 max-w-2xl text-lg text-[#C2C2C2] leading-relaxed">
          Multilingual production pipelines, accessibility systems, and AI-ready workflows — built for scale, consistency, and platform-ready delivery.
        </p>
{/* Service Tabs (in-hero, replaces floating bar) */}
<div className="mt-10 max-w-4xl">
  <div className="flex flex-wrap gap-3">
    {SERVICES.map((s) => (
      <button
  key={s.id}
  onClick={() => onClickTab(s.id)}
  onMouseEnter={() => setHoveredId(s.id)}
  onMouseLeave={() => setHoveredId(null)}
  className={[
    "inline-flex items-center justify-center border px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors",
    (hoveredId ?? activeId) === s.id
      ? "border-[#7A0E14] bg-[#7A0E14] text-white"
      : "border-[#F5F5F5]/60 bg-transparent text-white/85 hover:border-[#7A0E14] hover:bg-[#7A0E14]",
  ].join(" ")}
>
  {s.label}
</button>
    ))}
  </div>

<p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/40">
    Select a service to explore details & work.
  </p>
</div>
</div>
     

      {/* Modal */}
      {open && active && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-5xl -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c16] flex flex-col">
              <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-5">
                <div>
                  <div className="text-xs tracking-[0.22em] text-white/45 uppercase">
                    Service
                  </div>
                  <h3 className="mt-1 text-2xl md:text-3xl font-semibold text-white">
                    {active.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/65">{active.summary}</p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70
                             hover:bg-white/10 hover:border-white/25 transition"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-8 px-6 py-6 md:grid-cols-5 flex-1 min-h-0 overflow-y-auto">
                <div className="md:col-span-3">
  <div className="text-sm leading-6 text-white/70">{active.body}</div>

  <div className="mt-6 space-y-3">
    {active.bullets.map((b, i) => (
      <div key={i} className="flex items-start gap-3 text-sm text-white/75">
        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7A0E14]" />
        <span>{b}</span>
      </div>
    ))}
  </div>
</div>

<div className="md:col-span-2 flex">
                  <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col">
                    <div className="text-sm font-medium text-white">Work Showcase</div>
                    <p className="mt-2 text-sm text-white/65">
                      Explore category-specific work samples with multilingual playback.
                    </p>

                    <div className="mt-auto pt-6 flex flex-col gap-3">
  {(active.ctas ?? []).map((c, i) => {
    const isActive = hoveredCta
      ? hoveredCta === c.href
      : i === 0;

    return (
      <Link
        key={c.href}
        href={c.href}
        onClick={() => setOpen(false)}
        onMouseEnter={() => setHoveredCta(c.href)}
        onMouseLeave={() => setHoveredCta(null)}
        className={[
          "inline-flex items-center justify-center px-5 py-3 text-xs uppercase tracking-[0.25em] transition-all duration-300",
          isActive
            ? "border border-[#7A0E14] bg-[#7A0E14] text-white"
            : "border border-[#F5F5F5]/60 bg-transparent text-white/85 hover:border-[#7A0E14] hover:bg-[#7A0E14] hover:text-white",
        ].join(" ")}
      >
        {c.label}
      </Link>
    );
  })}

  <a
    href="#contact"
    onClick={() => setOpen(false)}
    className="inline-flex items-center justify-center border border-[#F5F5F5]/40 bg-transparent px-5 py-3 text-xs uppercase tracking-[0.25em] text-white/70 transition-colors hover:border-[#7A0E14] hover:bg-[#7A0E14] hover:text-white"
  >
    Connect
  </a>
</div>
                    <div className="mt-4 text-[11px] text-white/40 uppercase tracking-[0.22em]">
                      Tip: Press <span className="text-white/60">Esc</span> to close
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