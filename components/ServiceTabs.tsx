"use client";

import { useEffect, useMemo, useState } from "react";
import { SERVICES, type Service } from "../lib/services";
import Link from "next/link";

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

export default function ServiceTabs() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(SERVICES[0]?.id ?? "");

  const active = useMemo<Service | undefined>(
    () => SERVICES.find((s) => s.id === activeId),
    [activeId]
  );

  useLockBodyScroll(open);

  // Escape to close
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
    <div className="w-full">
      {/* Tabs row */}
      <div className="flex flex-wrap gap-2">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            onClick={() => onClickTab(s.id)}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90
                       hover:bg-white/10 hover:border-white/25 transition"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Modal */}
      {open && active && (
        <div
          className="fixed inset-0 z-[80]"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          {/* Panel (3/4 screen vibe) */}
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-5xl -translate-x-1/2 -translate-y-1/2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0B10] shadow-2xl">
              {/* Top bar */}
              <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-5">
                <div>
                  <div className="text-xs tracking-widest text-white/50">SERVICE</div>
                  <h3 className="mt-1 text-2xl font-semibold text-white">
                    {active.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">{active.summary}</p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
                >
                  Close
                </button>
              </div>

              {/* Content */}
              <div className="grid gap-8 px-6 py-6 md:grid-cols-5">
                <div className="md:col-span-3">
                  <p className="text-sm leading-6 text-white/75">
                    {active.body}
                  </p>

                  <div className="mt-6 grid gap-2">
                    {active.bullets.map((b, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA side */}
                <div className="md:col-span-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm font-medium text-white">
                      Want to see proof?
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                      Explore category-specific work samples with multilingual playback.
                    </p>

                    <div className="mt-5 flex flex-col gap-3">
                      {active.hasWork && active.workCategory ? (
                        <Link
                          href={`/work/${active.workCategory}`}
                          className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black hover:opacity-90 transition"
                        >
                          View Work
                        </Link>
                      ) : (
                        <button
                          className="rounded-xl bg-white/20 px-4 py-3 text-sm font-semibold text-white/60 cursor-not-allowed"
                          disabled
                        >
                          View Work
                        </button>
                      )}

                      <Link
                        href="#connect"
                        onClick={() => setOpen(false)}
                        className="rounded-xl border border-white/15 bg-transparent px-4 py-3 text-center text-sm font-semibold text-white/85 hover:bg-white/5 transition"
                      >
                        Talk to us
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-white/45">
                    Tip: press <span className="text-white/70">Esc</span> to close
                  </div>
                </div>
              </div>

              {/* Bottom fade for premium depth */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-black/35" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}