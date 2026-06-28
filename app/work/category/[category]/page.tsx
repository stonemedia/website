"use client";

import React from "react";
import Header from "@/components/Header";
import ShakaVideo from "@/components/ShakaVideo";
import ProjectPosterGrid from "@/components/ProjectPosterGrid";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase.client";

const DUBBING_CATEGORY_SLUG = "ott-dubbing";
const PROJECTS_PER_PAGE = 5;

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

type PosterCreditRow = {
  id: string;
  title?: string;
  categorySlug?: string;
  group?: "movies" | "series" | string;
  imageUrl?: string;
  imagePath?: string;
  services?: string[];
  order?: number;
  status?: "draft" | "published" | "archived" | string;
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

function getPosterImage(item: PosterCreditRow) {
  if (item.imageUrl) return item.imageUrl;

  if (
    item.imagePath &&
    (item.imagePath.startsWith("/") || item.imagePath.startsWith("http"))
  ) {
    return item.imagePath;
  }

  return "";
}

function posterCreditToGridItem(item: PosterCreditRow) {
  return {
    title: item.title ?? "Untitled",
    image: getPosterImage(item),
    services: Array.isArray(item.services) ? item.services : [],
  };
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = React.use(params);

  const [projects, setProjects] = React.useState<ProjectRow[]>([]);
  const [posterCredits, setPosterCredits] = React.useState<PosterCreditRow[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr(null);

      const projectQuery = query(
        collection(db, "projects"),
        where("categorySlug", "==", categorySlug),
        where("status", "in", ["published", "draft"]),
        orderBy("order", "asc")
      );

      const [projectSnap, posterSnap] = await Promise.all([
        getDocs(projectQuery),
        getDocs(collection(db, "posterCredits")),
      ]);

      const projectList = projectSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as ProjectRow[];

      const posterList = posterSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as PosterCreditRow[];

      posterList.sort((a, b) => (a.order ?? 1000) - (b.order ?? 1000));

      setProjects(projectList);
      setPosterCredits(posterList);
      setLoading(false);
    };

    load().catch((e: any) => {
      setErr(e?.message ?? "Failed to load projects");
      setLoading(false);
    });
  }, [categorySlug]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug]);

  const bucket = "stonemediawebsite-hls-public-849564114573";

  const visiblePosterCredits = posterCredits.filter(
    (item) =>
      item.categorySlug === categorySlug &&
      item.status === "published" &&
      item.title
  );

  const moviePosterItems = visiblePosterCredits
    .filter((item) => item.group === "movies")
    .map(posterCreditToGridItem);

  const seriesPosterItems = visiblePosterCredits
    .filter((item) => item.group === "series")
    .map(posterCreditToGridItem);

  const hasPosterGrid =
    moviePosterItems.length > 0 || seriesPosterItems.length > 0;

  const visibleProjects = projects.filter(
    (project) => project.slug !== "showreel"
  );

  const totalPages = Math.max(
    1,
    Math.ceil(visibleProjects.length / PROJECTS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProjects = visibleProjects.slice(
    (safeCurrentPage - 1) * PROJECTS_PER_PAGE,
    safeCurrentPage * PROJECTS_PER_PAGE
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

            {hasPosterGrid && (
              <>
                {moviePosterItems.length > 0 && (
                  <ProjectPosterGrid
                    eyebrow={
                      categorySlug === DUBBING_CATEGORY_SLUG
                        ? "Selected Dubbing Projects"
                        : "Selected Projects"
                    }
                    title="Movies"
                    description="A selection of film projects where Stone Media has contributed to dubbing, localization, and language-version workflows."
                    items={moviePosterItems}
                  />
                )}

                {moviePosterItems.length > 0 && seriesPosterItems.length > 0 && (
                  <div className="my-16 h-px w-full bg-white/10" />
                )}

                {seriesPosterItems.length > 0 && (
                  <ProjectPosterGrid
                    eyebrow="Selected Series Projects"
                    title="Series"
                    description="Selected episodic and series projects where Stone Media has contributed to dubbing, localization, and language-version workflows."
                    items={seriesPosterItems}
                  />
                )}
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
                !hasPosterGrid && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70">
                    No projects yet in this category.
                  </div>
                )}

              {!loading &&
                !err &&
                paginatedProjects.map((project) => {
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
                          <ShakaVideo src={hlsUrl} />
                        ) : (
                          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                            HLS not built yet.
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}

              {!loading && !err && visibleProjects.length > PROJECTS_PER_PAGE && (
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row">
                  <div className="text-sm text-white/55">
                    Showing page {safeCurrentPage} of {totalPages}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={safeCurrentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={[
                            "rounded-xl border px-4 py-2 text-sm",
                            page === safeCurrentPage
                              ? "border-[#7A0E14] bg-[#7A0E14]/30 text-white"
                              : "border-white/15 bg-white/10 text-white/70 hover:bg-white/15",
                          ].join(" ")}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      disabled={safeCurrentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}