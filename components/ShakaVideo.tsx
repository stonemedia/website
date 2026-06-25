"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  src: string;
  className?: string;
};

type AudioOption = {
  language: string;
  label: string;
};

const LANGUAGE_ORDER = [
  "hi",
  "en",
  "bn",
  "ta",
  "te",
  "kn",
  "ml",
  "mr",
  "gu",
  "pa",
  "or",
  "as",
];

const LANGUAGE_LABELS: Record<string, string> = {
  hi: "Hindi",
  en: "English",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
  mr: "Marathi",
  gu: "Gujarati",
  pa: "Punjabi",
  or: "Odia",
  od: "Odia",
  ori: "Odia",
  odia: "Odia",
  odiya: "Odia",
  as: "Assamese",
  assamese: "Assamese",
};

function normalizeLang(input: string) {
  const raw = (input || "").toLowerCase().trim();
  const base = raw.split("-")[0] || raw;

  if (base === "od" || base === "ori" || base === "odia" || base === "odiya") {
    return "or";
  }

  if (base === "assamese") {
    return "as";
  }

  return base;
}

function titleCase(input: string) {
  return input
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getLanguageLabel(language: string) {
  const normalized = normalizeLang(language);
  return LANGUAGE_LABELS[normalized] || titleCase(language);
}

function getLanguageRank(language: string) {
  const normalized = normalizeLang(language);
  const index = LANGUAGE_ORDER.indexOf(normalized);

  return index === -1 ? 999 : index;
}

export default function ShakaVideo({ src, className }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);

  const [ready, setReady] = useState(false);
  const [audioLangs, setAudioLangs] = useState<AudioOption[]>([]);
  const [activeAudio, setActiveAudio] = useState<string>("");

  const preferredOrder = useMemo(() => LANGUAGE_ORDER, []);

  function detectAudioLanguages(player: any): AudioOption[] {
    const variantTracks = player?.getVariantTracks?.() || [];

    const directLangs: string[] =
      typeof player.getAudioLanguages === "function"
        ? player.getAudioLanguages()
        : [];

    const inferredLangs: string[] = Array.from(
      new Set(
        variantTracks
          .map((track: any) => normalizeLang(track.language))
          .filter(Boolean)
      )
    );

    const base = directLangs.length ? directLangs : inferredLangs;

    const mapped = base
      .map((language) => normalizeLang(language))
      .filter(Boolean)
      .map((language) => ({
        language,
        label: getLanguageLabel(language),
      }));

    const deduped = Array.from(
      new Map(mapped.map((item) => [item.language, item])).values()
    );

    return deduped.sort((a, b) => {
      const rankA = getLanguageRank(a.language);
      const rankB = getLanguageRank(b.language);

      if (rankA !== rankB) return rankA - rankB;

      return a.label.localeCompare(b.label);
    });
  }

  function selectAudio(player: any, language: string): boolean {
    const target = normalizeLang(language);
    const tracks = player?.getVariantTracks?.() || [];

    const match =
      tracks.find((track: any) => normalizeLang(track.language) === target) ||
      null;

    if (match && typeof player.selectVariantTrack === "function") {
      player.selectVariantTrack(match, true);
      return true;
    }

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

      const shakaMod = await import(
        "shaka-player/dist/shaka-player.compiled.js"
      );
      const shaka = shakaMod.default;

      if (!shaka?.Player?.isBrowserSupported?.()) {
        console.error("Shaka: browser not supported");
        return;
      }

      shaka.polyfill.installAll();

      const player = new shaka.Player(video);
      playerRef.current = player;

      player.addEventListener("error", (event: any) => {
        const detail = event?.detail || event;

        console.error("Shaka error:", {
          message: detail?.message,
          code: detail?.code,
          severity: detail?.severity,
          category: detail?.category,
          data: detail?.data,
          stack: detail?.stack,
        });
      });

      try {
        await player.load(src);
      } catch (error: any) {
        console.error("Shaka load failed:", {
          message: error?.message,
          code: error?.code,
          severity: error?.severity,
          category: error?.category,
          data: error?.data,
          stack: error?.stack,
        });

        throw error;
      }

      if (destroyed) return;

      const langs = detectAudioLanguages(player);
      setAudioLangs(langs);

      const available = langs.map((item) => item.language);

      const pick =
        preferredOrder.find((language) => available.includes(language)) ||
        available[0] ||
        "";

      if (pick) {
        const ok = selectAudio(player, pick);
        if (ok) setActiveAudio(pick);
      }

      setReady(true);
    }

    init().catch((error) => console.error("Shaka init error:", error));

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
          className="aspect-video w-full bg-black"
          controls
          playsInline
        />

        <div className="border-t border-[#1A1A1A] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-2 text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
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
              <span className="text-xs text-[#A0A0A0]">
                Single track ({audioLangs[0].label})
              </span>
            )}

            {ready &&
              audioLangs.length > 1 &&
              audioLangs.map((audio) => (
                <button
                  key={audio.language}
                  onClick={() => onPickAudio(audio.language)}
                  className={[
                    "border px-3 py-2 text-xs tracking-[0.08em]",
                    activeAudio === audio.language
                      ? "border-[#7A0E14] text-[#F5F5F5]"
                      : "border-[#1A1A1A] text-[#A0A0A0] hover:border-[#2A2A2A] hover:text-[#F5F5F5]",
                  ].join(" ")}
                >
                  {audio.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}