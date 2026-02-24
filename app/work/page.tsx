import Header from "../../components/Header";
import { projects } from "../data/projects";

export default function WorkIndexPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5]">
      <Header />

      <section className="pt-28 pb-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          {/* Top bar */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">Work</p>
              <h1 className="mt-3 text-3xl md:text-4xl uppercase tracking-[0.14em]">
                Selected Projects
              </h1>
              <p className="mt-4 max-w-2xl text-sm md:text-base text-[#A0A0A0]">
                Dubbing, localization, accessibility, and media infrastructure—built for scale and consistency.
              </p>
            </div>

            {/* Filter row (v1: visual only, no JS) */}
            <div className="flex flex-wrap gap-2">
              {["All", "Dubbing", "Localization", "Accessibility", "Post", "AI", "Streaming"].map((t) => (
                <span
                  key={t}
                  className="border border-[#1A1A1A] bg-[#0A0A0A] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#A0A0A0]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.slug}
                href={`/work/${p.slug}`}
                className="group block border border-[#1A1A1A] bg-[#0D0D0D] transition hover:-translate-y-1 hover:border-[#2A2A2A]"
              >
                {/* Thumbnail placeholder */}
                <div className="aspect-video border-b border-[#1A1A1A] bg-[#0A0A0A]" />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#A0A0A0]">
                        {p.category} · {p.year}
                      </p>
                      <h3 className="mt-2 text-sm md:text-base uppercase tracking-[0.14em]">
                        {p.title}
                      </h3>
                    </div>

                    {/* red accent only on hover */}
                    <span className="mt-1 h-[2px] w-10 bg-transparent transition-colors group-hover:bg-[#7A0E14]" />
                  </div>

                  <p className="mt-3 text-sm text-[#A0A0A0]">{p.meta}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Footer-lite */}
          <div className="mt-16 border-t border-[#1A1A1A] pt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
              Showing {projects.length} projects
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}