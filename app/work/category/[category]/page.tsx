import Header from "../../../../components/Header";
import ShakaVideo from "../../../../components/ShakaVideo";
import { projects, DEFAULT_HLS, type CategorySlug } from "../../../data/projects";
import { notFound } from "next/navigation";

const CATEGORY_TITLES: Record<CategorySlug, string> = {
  "ott-dubbing": "OTT / Movie Dubbing",
  "ad-campaigns": "Ad Campaigns",
  "audio-post": "Audio Post Production",
  "ai-integration": "AI Integration",
  accessibility: "Accessibility Assets",
  compliance: "Censor & Compliance",
  syndication: "Syndication",
};

export default function WorkCategoryPage({ params }: { params: { category: string } }) {
  const slug = params.category as CategorySlug;
  const title = CATEGORY_TITLES[slug];
  if (!title) return notFound();

  const items = projects.filter((p) => p.categorySlug === slug);

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5]">
      <Header />

      <section className="pt-28 pb-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <a
            href="/#top"
            className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0] hover:text-[#F5F5F5]"
          >
            ← Back to Home
          </a>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
              Work · {title}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl uppercase tracking-[0.14em]">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm md:text-base text-[#A0A0A0]">
              Category-specific showcases with multilingual playback.
            </p>
          </div>

          <div className="mt-12 grid gap-8">
            {items.slice(0, 15).map((p) => {
              const src = p.hlsSrc ?? DEFAULT_HLS;

              return (
                <div key={p.slug} className="border border-[#1A1A1A] bg-[#0A0A0A]">
                  <div className="p-6 border-b border-[#1A1A1A]">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
                      {p.category} · {p.year}
                    </p>

                    <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                      <h3 className="text-xl md:text-2xl uppercase tracking-[0.14em]">
                        {p.title}
                      </h3>

                      <a
                        href={`/work/${p.slug}`}
                        className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0] hover:text-[#F5F5F5]"
                      >
                        Open project →
                      </a>
                    </div>

                    <p className="mt-3 max-w-3xl text-sm md:text-base text-[#A0A0A0]">
                      {p.meta}
                    </p>
                  </div>

                  <div className="p-6">
                    <ShakaVideo src={src} />
                  </div>
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <p className="mt-10 text-sm text-[#A0A0A0]">
              No projects found for this category yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}