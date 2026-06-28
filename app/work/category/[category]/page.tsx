"use client";

import React from "react";
import Header from "@/components/Header";
import ShakaVideo from "@/components/ShakaVideo";
import ProjectPosterGrid from "@/components/ProjectPosterGrid";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase.client";

const DUBBING_CATEGORY_SLUG = "ott-dubbing";

const dubbingMoviePosters = [
  {
    title: "Dasara",
    image: "/posters/dubbing/Dasara.jpg",
    services: [
      "Turnkey Hindi Dubbing / Localization",
      "Voice Casting",
      "ADR / Studio",
      "Mix",
    ],
  },
  {
    title: "JSK",
    image: "/posters/dubbing/JSK.jpg",
    services: ["ADR / Studio", "Technical Support", "Localization Workflow"],
  },
  {
    title: "Paani",
    image: "/posters/dubbing/Paani_Marathi.jpg",
    services: ["Dubbing / Localization", "Mix", "Sound Design", "M&E"],
  },
];

const dubbingSeriesPosters = [
  {
    title: "Abar Proloy",
    image: "/posters/dubbing/Abar_Proloy.jpg",
    services: ["Turnkey Hindi Dubbing", "Mix"],
  },
  {
    title: "Dear Didimoni",
    image: "/posters/dubbing/Dear_Didimoni.jpg",
    services: ["Turnkey Hindi Dubbing", "Mix"],
  },
  {
    title: "Koose Munisamy Veerappan",
    image: "/posters/dubbing/Koose_Munisamy_Veerappan.jpg",
    services: ["Turnkey Hindi Dubbing", "Mix"],
  },
  {
    title: "She And Her Perfect Husband",
    image: "/posters/dubbing/She_And_Her_Perfect_Husband.jpg",
    services: ["Turnkey Hindi Dubbing", "Mix"],
  },
];

type ProjectRow = {
  id: string;
  title?: string;
  slug?: string;
  categorySlug?: string;
  serviceSlug?: string;
  status?: "draft" | "published" | string;
  order?: number;
  hlsPath?: string;
};

function hlsPathToPlayableUrl(bucket: string, path: string) {
  return `https://${bucket}.storage.googleapis.com/${path}`;
}

function getCategoryTitle(categorySlug: string) {
  if (categorySlug === DUBBING_CATEGORY_SLUG) return "Dubbing Projects";

  return categorySlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = React.use(params);

  const [projects, setProjects] = React.useState<ProjectRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [activePlayerId, setActivePlayerId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr(null);

      const q = query(
        collection(db, "projects"),
        where("categorySlug", "==", categorySlug),
        where("status", "in", ["published", "draft"]),
        orderBy("order", "asc")
      );

      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as ProjectRow[];

      setProjects(list);
      setLoading(false);
    };

    load().catch((e: any) => {
      setErr(e?.message ?? "Failed to load projects");
      setLoading(false);
    });
  }, [categorySlug]);

  const bucket = "stonemediawebsite-hls-public-849564114573";
  const showDubbingPosters = categorySlug === DUBBING_CATEGORY_SLUG;

  const visibleProjects = projects.filter(
    (project) => project.slug !== "showreel"
  );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5]">
        <section className="pt-28 pb-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <a
              href="/#top"
              className="text-xs uppercase tracking-[0.25em] text-white/60 hover:text-white"
            >
              ← Back
            </a>

            <h1 className="mt-6 text-3xl font-semibold">
              {getCategoryTitle(categorySlug)}
            </h1>

            {showDubbingPosters && (
              <>
                <ProjectPosterGrid
                  eyebrow="Selected Dubbing Projects"
                  title="Movies"
                  description="A selection of film projects where Stone Media has contributed to dubbing, localization, and language-version workflows. Campaign and advertising films are showcased separately."
                  items={dubbingMoviePosters}
                />

                <div className="my-16 h-px w-full bg-white/10" />

                <ProjectPosterGrid
                  eyebrow="Selected Series Projects"
                  title="Series"
                  description="Selected episodic and series projects where Stone Media has contributed to dubbing, localization, and language-version workflows."
                  items={dubbingSeriesPosters}
                />
              </>
            )}

            <div className="mt-10 grid gap-10">
              {loading && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70">
                  Loading…
                </div>
              )}

              {!loading && err && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-red-200">
                  {err}
                </div>
              )}

              {!loading &&
                !err &&
                visibleProjects.length === 0 &&
                !showDubbingPosters && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70">
                    No projects yet in this category.
                  </div>
                )}

              {!loading &&
                !err &&
                visibleProjects.map((project) => {
                  const title = project.title ?? project.slug ?? "Untitled";
                  const hlsUrl = project.hlsPath
                    ? hlsPathToPlayableUrl(bucket, project.hlsPath)
                    : null;

                  return (
                    <section
                      key={project.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-[0.25em] text-white/55">
                            {(project.serviceSlug ?? "service")} ·{" "}
                            {(project.status ?? "status")}
                          </div>

                          <h2 className="mt-2 text-xl font-semibold">
                            {title}
                          </h2>

                          {project.slug ? (
                            <p className="mt-1 text-sm text-white/60">
                              {project.slug}
                            </p>
                          ) : null}
                        </div>
                      </div>

                     <div className="mt-5">
  {hlsUrl ? (
    activePlayerId === project.id ? (
      <div className="min-h-[260px]">
        <ShakaVideo src={hlsUrl} />
      </div>
    ) : (
      <button
        type="button"
        onClick={() => setActivePlayerId(project.id)}
        className="w-full rounded-xl border border-white/10 bg-black/30 p-6 text-left transition hover:bg-white/10"
      >
        <div className="text-sm font-medium text-white">
          Load Player
        </div>

        <div className="mt-1 text-xs text-white/55">
          Tap to load video and language tracks.
        </div>
      </button>
    )
  ) : (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
      HLS not built yet.
    </div>
  )}
</div>
                    </section>
                  );
                })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}