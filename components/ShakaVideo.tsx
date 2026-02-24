"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  src: string; // HLS master.m3u8 (multi-audio) or DASH manifest
  className?: string;
};

type AudioOption = { language: string; label: string };

function normalizeLang(input: string) {
  const v = (input || "").toLowerCase().trim();
  return v.split("-")[0] || v; // "hi-IN" -> "hi"
}

export default function ShakaVideo({ src, className }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);

  const [ready, setReady] = useState(false);
  const [audioLangs, setAudioLangs] = useState<AudioOption[]>([]);
  const [activeAudio, setActiveAudio] = useState<string>("");

  // Prefer Hindi, then English, else first available
  const preferredOrder = useMemo(() => ["hi", "en", "bn", "ta"], []);

  function detectAudioLanguages(player: any): AudioOption[] {
    const variantTracks = player?.getVariantTracks?.() || [];

    // If available, this is the cleanest
    const directLangs: string[] =
      typeof player.getAudioLanguages === "function"
        ? player.getAudioLanguages()
        : [];

    // Fallback: infer from variant tracks
    const inferredLangs: string[] = Array.from(
      new Set(
        variantTracks
          .map((t: any) => normalizeLang(t.language))
          .filter(Boolean)
      )
    );

    const base = directLangs.length ? directLangs : inferredLangs;

    // Map + de-dupe
    const mapped = base
      .map((l) => normalizeLang(l))
      .filter(Boolean)
      .map((l) => ({ language: l, label: l.toUpperCase() }));

    return Array.from(new Map(mapped.map((x) => [x.language, x])).values());
  }

  function selectAudio(player: any, language: string): boolean {
    const target = normalizeLang(language);
    const tracks = player?.getVariantTracks?.() || [];

    // Find a variant track matching the desired language.
    // Shaka will switch to the appropriate audio rendition for that variant.
    const match =
      tracks.find((t: any) => normalizeLang(t.language) === target) || null;

    if (match && typeof player.selectVariantTrack === "function") {
      // clearBuffer=true makes the switch immediate/clean
      player.selectVariantTrack(match, true);
      return true;
    }

    // Fallback for some builds
    if (typeof player.selectAudioLanguage === "function") {
      player.selectAudioLanguage(target);
      return true;
    }

    return false;
  }

  useEffect(() => {
    let destroyed = false;

    async function init() {
      const video = videoRef.current;
      if (!video) return;

      const shakaMod = await import("shaka-player/dist/shaka-player.compiled.js");
      const shaka = shakaMod.default;

      if (!shaka?.Player?.isBrowserSupported?.()) {
        console.error("Shaka: browser not supported");
        return;
      }

      shaka.polyfill.installAll();
      const player = new shaka.Player(video);
      playerRef.current = player;

      // Helpful for debugging
      player.addEventListener("error", (evt: any) => {
  const d = evt?.detail || evt;
  console.error("Shaka error (raw):", d);
  console.error("Shaka error (fields):", {
    message: d?.message,
    code: d?.code,
    severity: d?.severity,
    category: d?.category,
    data: d?.data,
    stack: d?.stack,
  });
});
      try {
  await player.load(src);
} catch (e: any) {
  // Shaka often throws non-standard objects
  console.error("Shaka load failed (raw):", e);

  // Try to print common fields
  console.error("Shaka load failed (details):", {
    message: e?.message,
    code: e?.code,
    severity: e?.severity,
    category: e?.category,
    data: e?.data,
    stack: e?.stack,
  });

  throw e;
}

      if (destroyed) return;

      const langs = detectAudioLanguages(player);
      setAudioLangs(langs);

      // Pick default language
      const available = langs.map((x) => x.language);
      const pick =
        preferredOrder.find((p) => available.includes(p)) ||
        available[0] ||
        "";

      if (pick) {
        const ok = selectAudio(player, pick);
        if (ok) setActiveAudio(pick);
      }

      setReady(true);
    }

    init().catch((e) => console.error("Shaka init error:", e));

    return () => {
      destroyed = true;
      setReady(false);
      setAudioLangs([]);
      setActiveAudio("");

      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
  }, [src, preferredOrder]);

  function onPickAudio(language: string) {
    const player = playerRef.current;
    if (!player) return;

    const ok = selectAudio(player, language);
    if (ok) setActiveAudio(language);
  }

  return (
    <div className={className}>
      <div className="border border-[#1A1A1A] bg-[#0A0A0A]">
        <video
          ref={videoRef}
          className="w-full aspect-video bg-black"
          controls
          playsInline
        />

        <div className="border-t border-[#1A1A1A] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0] mr-2">
              Audio
            </p>

            {!ready && (
              <span className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
                Loading…
              </span>
            )}

            {ready && audioLangs.length === 0 && (
              <span className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
                No audio tracks detected
              </span>
            )}

            {ready && audioLangs.length === 1 && (
              <span className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
                Single track ({audioLangs[0].label})
              </span>
            )}

            {ready &&
              audioLangs.length > 1 &&
              audioLangs.map((a) => (
                <button
                  key={a.language}
                  onClick={() => onPickAudio(a.language)}
                  className={[
                    "border px-3 py-2 text-xs uppercase tracking-[0.18em]",
                    activeAudio === a.language
                      ? "border-[#7A0E14] text-[#F5F5F5]"
                      : "border-[#1A1A1A] text-[#A0A0A0] hover:border-[#2A2A2A] hover:text-[#F5F5F5]",
                  ].join(" ")}
                >
                  {a.label}
                </button>
              ))}
          </div>

          <p className="mt-3 text-xs text-[#A0A0A0] break-all">Source: {src}</p>
        </div>
      </div>
    </div>
  );
}