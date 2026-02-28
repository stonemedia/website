"use client";

import React from "react";
import Header from "@/components/Header";
import ShakaVideo from "@/components/ShakaVideo";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase.client";

type ProjectRow = {
  id: string;
  title?: string;
  slug?: string;
  categorySlug?: string;
  serviceSlug?: string;
  status?: "draft" | "published" | string;
  order?: number;
  hlsPath?: string; // e.g. "projects/my-slug/master.m3u8"
};

function hlsPathToPlayableUrl(bucket: string, path: string) {
  // IMPORTANT: This URL style supports relative refs inside m3u8 (0.m3u8, hi_000.ts, etc.)
  return `https://${bucket}.storage.googleapis.com/${path}`;
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

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr(null);

      // NOTE: This requires a Firestore composite index once:
      // categorySlug ==, status in, orderBy order asc
      const q = query(
        collection(db, "projects"),
        where("categorySlug", "==", categorySlug),
        where("status", "in", ["published", "draft"]),
        orderBy("order", "asc")
      );

      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ProjectRow[];

      setProjects(list);
      setLoading(false);
    };

    load().catch((e: any) => {
      setErr(e?.message ?? "Failed to load projects");
      setLoading(false);
    });
  }, [categorySlug]);

  // Your bucket from `gcloud storage buckets list`:
  // gs://stonemediawebsite.firebasestorage.app/
  const bucket = "stonemediawebsite-hls-public-849564114573";

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
              {categorySlug.replace(/-/g, " ")}
            </h1>

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

              {!loading && !err && projects.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70">
                  No projects yet in this category.
                </div>
              )}

              {!loading &&
                !err &&
                projects.map((p) => {
                  const title = p.title ?? p.slug ?? "Untitled";
                  const hlsUrl = p.hlsPath ? hlsPathToPlayableUrl(bucket, p.hlsPath) : null;
                  console.log("PROJECT:", p.slug);
                  console.log("HLS PATH FROM FIRESTORE:", p.hlsPath);
                  console.log("FINAL HLS URL:", hlsUrl);

                  return (
                    <section
                      key={p.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-[0.25em] text-white/55">
                            {(p.serviceSlug ?? "service")} · {(p.status ?? "status")}
                          </div>
                          <h2 className="mt-2 text-xl font-semibold">{title}</h2>
                          {p.slug ? (
                            <p className="mt-1 text-sm text-white/60">{p.slug}</p>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-5">
                        {hlsUrl ? (
                          <>
                            <ShakaVideo src={hlsUrl} />
                            <div className="mt-2 text-[11px] text-white/40 break-all">
                              Source: {hlsUrl}
                            </div>
                          </>
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